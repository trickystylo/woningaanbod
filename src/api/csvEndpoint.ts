import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { parseFile } from '../utils/csvParser';
import { transformPropertyData, validateTransformedData } from '../utils/dataTransformer';
import { csvLogger } from '../utils/csvLogger';
import { addProperty } from '../lib/firebase';
import { Property } from '../types';

const app = express();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Configure CORS with specific origin
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || 'https://woningaanbod.eu',
  methods: ['POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Require API key for authentication
const apiKeyAuth = (req: express.Request, res: express.Response, next: express.Function) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.CSV_API_KEY) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  next();
};

app.post('/api/csv/upload', apiKeyAuth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const fileBuffer = req.file.buffer;
    const data = await parseFile(new Blob([fileBuffer]));

    if (!data) {
      return res.status(400).json({ error: 'Invalid file format' });
    }

    const results = {
      added: 0,
      duplicates: 0,
      errors: 0,
      details: [] as string[]
    };

    for (const row of data) {
      const property = transformPropertyData(row);
      
      if (!property) {
        results.errors++;
        results.details.push(`Failed to transform row: ${JSON.stringify(row)}`);
        continue;
      }

      const validationErrors = validateTransformedData(property);
      if (validationErrors.length > 0) {
        results.errors++;
        results.details.push(`Validation errors for ${property.address}: ${validationErrors.join(', ')}`);
        continue;
      }

      try {
        await addProperty(property);
        results.added++;
      } catch (error) {
        results.errors++;
        results.details.push(`Error adding property ${property.address}: ${error}`);
      }
    }

    res.json({
      success: true,
      results
    });

  } catch (error) {
    console.error('CSV upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`CSV API listening on port ${port}`);
});