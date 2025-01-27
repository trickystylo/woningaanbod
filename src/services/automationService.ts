import { OpenAI } from 'openai';
import { Property } from '../types';
import { csvLogger } from '../utils/csvLogger';
import { openai, DEFAULT_MODEL } from '../lib/openai';

export class AutomationService {
  private static instance: AutomationService;
  
  private constructor() {}

  static getInstance(): AutomationService {
    if (!this.instance) {
      this.instance = new AutomationService();
    }
    return this.instance;
  }

  async processListingUrl(url: string, realtorId: string): Promise<Property | null> {
    try {
      // 1. Extract content from URL using ChatGPT
      const content = await this.extractListingContent(url);
      
      // 2. Parse content into standardized format
      const propertyData = await this.parseListingContent(content);
      
      // 3. Generate CSV and store in Google Drive
      await this.storeListingData(propertyData, realtorId);
      
      return propertyData;
    } catch (error) {
      csvLogger.log('error', `Error processing listing URL: ${url}`, error);
      return null;
    }
  }

  private async extractListingContent(url: string): Promise<string> {
    try {
      const response = await fetch(url);
      const html = await response.text();
      
      // Use ChatGPT to extract relevant content
      const completion = await openai.chat.completions.create({
        model: DEFAULT_MODEL,
        messages: [{
          role: "system",
          content: "Extract property listing information from the provided HTML content. Focus on: title, price, location, features, description, and images."
        }, {
          role: "user",
          content: html
        }],
        temperature: 0.3,
      });

      return completion.choices[0].message?.content || '';
    } catch (error) {
      throw new Error(`Failed to extract listing content: ${error}`);
    }
  }

  private async parseListingContent(content: string): Promise<Property> {
    try {
      // Use ChatGPT to parse the content into structured data
      const completion = await openai.chat.completions.create({
        model: DEFAULT_MODEL,
        messages: [{
          role: "system",
          content: "Convert the property listing information into a structured JSON format matching the required Property type."
        }, {
          role: "user",
          content
        }],
        temperature: 0.1,
      });

      const parsedData = JSON.parse(completion.choices[0].message?.content || '{}');
      
      // Validate the parsed data
      if (!this.validatePropertyData(parsedData)) {
        throw new Error('Invalid property data structure');
      }

      return parsedData;
    } catch (error) {
      throw new Error(`Failed to parse listing content: ${error}`);
    }
  }

  private validatePropertyData(data: any): boolean {
    const requiredFields = [
      'title', 'price', 'address', 'city', 'country', 'postalCode',
      'bedrooms', 'bathrooms', 'size', 'images', 'description',
      'type', 'category', 'features', 'status'
    ];

    return requiredFields.every(field => field in data);
  }

  private async storeListingData(property: Property, realtorId: string): Promise<void> {
    try {
      // Create CSV content
      const csvContent = this.convertToCsv([property]);
      
      // Store in Firebase Storage
      const fileName = `listings/${realtorId}/${new Date().toISOString()}.csv`;
      const fileRef = storage.ref().child(fileName);
      await fileRef.putString(csvContent, 'raw', {
        contentType: 'text/csv'
      });

      // Add reference to Firestore
      await db.collection('listingFiles').add({
        realtorId,
        fileName,
        timestamp: new Date(),
        status: 'pending'
      });
    } catch (error) {
      throw new Error(`Failed to store listing data: ${error}`);
    }
  }

  private convertToCsv(properties: Property[]): string {
    const headers = [
      'title', 'price', 'address', 'city', 'country', 'postalCode',
      'bedrooms', 'bathrooms', 'size', 'images', 'description',
      'type', 'category', 'features', 'status'
    ];

    const rows = properties.map(p => headers.map(header => {
      const value = p[header as keyof Property];
      if (Array.isArray(value)) {
        return `"${value.join(',')}"`;
      }
      return `"${value}"`;
    }).join(','));

    return [headers.join(','), ...rows].join('\n');
  }
}

export const automationService = AutomationService.getInstance();