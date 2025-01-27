"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateWebhookSecret = validateWebhookSecret;
const admin = require("firebase-admin");
async function validateWebhookSecret(secret) {
    var _a;
    try {
        // Get the stored secret from Firestore
        const configDoc = await admin
            .firestore()
            .collection('config')
            .doc('webhook')
            .get();
        if (!configDoc.exists) {
            return false;
        }
        const storedSecret = (_a = configDoc.data()) === null || _a === void 0 ? void 0 : _a.secret;
        return storedSecret === secret;
    }
    catch (error) {
        console.error('Error validating webhook secret:', error);
        return false;
    }
}
//# sourceMappingURL=validation.js.map