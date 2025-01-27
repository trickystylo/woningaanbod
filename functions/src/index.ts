import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { validateWebhookSecret } from './utils/validation';
import { processPropertyData } from './utils/propertyProcessor';
import { config } from './config';

admin.initializeApp();

export const processWebhook = functions
  .region(config.firebase.region)
  .https.onRequest(async (req, res) => {
    try {
      // Set CORS headers
      res.set('Access-Control-Allow-Origin', config.webhook.allowedOrigins.join(','));
      res.set('Access-Control-Allow-Methods', 'POST');
      res.set('Access-Control-Allow-Headers', 'Content-Type, x-webhook-secret');

      // Handle preflight requests
      if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
      }

      // Validate request method
      if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
      }

      // Validate webhook secret
      const webhookSecret = req.headers['x-webhook-secret'];
      if (!webhookSecret || typeof webhookSecret !== 'string') {
        res.status(401).json({ error: 'Missing webhook secret' });
        return;
      }

      if (!await validateWebhookSecret(webhookSecret)) {
        res.status(401).json({ error: 'Invalid webhook secret' });
        return;
      }

      // Process the incoming data
      const data = req.body;
      const properties = await processPropertyData(data);

      // Store properties in Firestore
      const batch = admin.firestore().batch();
      const results = {
        added: 0,
        errors: 0,
        details: [] as string[]
      };

      for (const property of properties) {
        try {
          const propertyRef = admin.firestore().collection('properties').doc();
          batch.set(propertyRef, {
            ...property,
            datePosted: admin.firestore.FieldValue.serverTimestamp()
          });
          results.added++;
        } catch (error) {
          results.errors++;
          results.details.push(`Error processing property: ${error}`);
        }
      }

      // Commit the batch
      await batch.commit();

      // Return success response
      res.json({
        success: true,
        results
      });

    } catch (error) {
      console.error('Webhook processing error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  });