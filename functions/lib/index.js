"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processWebhook = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const validation_1 = require("./utils/validation");
const propertyProcessor_1 = require("./utils/propertyProcessor");
admin.initializeApp();
exports.processWebhook = functions
    .region('europe-west1')
    .https.onRequest(async (req, res) => {
    try {
        // Validate request method
        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method not allowed' });
        }
        // Validate webhook secret
        const webhookSecret = req.headers['x-webhook-secret'];
        if (!webhookSecret || typeof webhookSecret !== 'string') {
            return res.status(401).json({ error: 'Missing webhook secret' });
        }
        if (!await (0, validation_1.validateWebhookSecret)(webhookSecret)) {
            return res.status(401).json({ error: 'Invalid webhook secret' });
        }
        // Process the incoming data
        const data = req.body;
        const properties = await (0, propertyProcessor_1.processPropertyData)(data);
        // Store properties in Firestore
        const batch = admin.firestore().batch();
        const results = {
            added: 0,
            errors: 0,
            details: []
        };
        for (const property of properties) {
            try {
                const propertyRef = admin.firestore().collection('properties').doc();
                batch.set(propertyRef, Object.assign(Object.assign({}, property), { datePosted: admin.firestore.FieldValue.serverTimestamp() }));
                results.added++;
            }
            catch (error) {
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
    }
    catch (error) {
        console.error('Webhook processing error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
//# sourceMappingURL=index.js.map