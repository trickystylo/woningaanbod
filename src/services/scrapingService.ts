import { load } from 'cheerio';
import fetch from 'node-fetch';
import { openai } from '../lib/openai';
import { createChatCompletion, SYSTEM_PROMPTS } from '../utils/chatGptRules';
import { csvLogger } from '../utils/csvLogger';

interface ScrapedData {
  title: string;
  description: string;
  images: string[];
  price?: string;
  features?: string[];
}

export async function scrapeWebsite(url: string): Promise<ScrapedData> {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = load(html);

    const data: ScrapedData = {
      title: $('title').text() || $('h1').first().text() || '',
      description: $('meta[name="description"]').attr('content') || '',
      images: [],
    };

    // Extract images
    $('img').each((_, element) => {
      const src = $(element).attr('src');
      if (src && src.startsWith('http')) {
        data.images.push(src);
      }
    });

    // Try to extract price
    const priceText = $('*:contains("€")').first().text();
    if (priceText) {
      const priceMatch = priceText.match(/€\s*[\d.,]+/);
      if (priceMatch) {
        data.price = priceMatch[0];
      }
    }

    // Try to extract features
    const features: string[] = [];
    $('ul li').each((_, element) => {
      const text = $(element).text().trim();
      if (text && text.length < 100) { // Avoid long text blocks
        features.push(text);
      }
    });
    data.features = features;

    csvLogger.log('info', `Successfully scraped website: ${url}`);
    return data;

  } catch (error) {
    csvLogger.log('error', `Failed to scrape website: ${url}`, error);
    throw new Error(`Failed to scrape website: ${error}`);
  }
}

export async function processWithChatGPT(data: ScrapedData): Promise<string> {
  try {
    const prompt = `
      Hier is informatie over een woning:
      
      Titel: ${data.title}
      Beschrijving: ${data.description}
      ${data.price ? `Prijs: ${data.price}` : ''}
      ${data.features?.length ? `Kenmerken: ${data.features.join(', ')}` : ''}
      
      ${SYSTEM_PROMPTS.propertyDescription}
    `;

    const description = await createChatCompletion(openai, prompt);
    csvLogger.log('info', 'Successfully generated description with ChatGPT');
    return description;

  } catch (error) {
    csvLogger.log('error', 'Failed to process with ChatGPT', error);
    throw new Error(`Failed to process with ChatGPT: ${error}`);
  }
}

export async function processListingUrl(url: string): Promise<ScrapedData & { enhancedDescription: string }> {
  try {
    // 1. Scrape the website
    const scrapedData = await scrapeWebsite(url);
    
    // 2. Process with ChatGPT
    const enhancedDescription = await processWithChatGPT(scrapedData);
    
    return {
      ...scrapedData,
      enhancedDescription
    };
  } catch (error) {
    csvLogger.log('error', `Failed to process listing URL: ${url}`, error);
    throw error;
  }
}