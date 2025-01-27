import * as admin from 'firebase-admin';
import * as crypto from 'crypto';

export async function validateWebhookSecret(secret: string): Promise<boolean> {
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

    const storedSecret = configDoc.data()?.secret;
    
    // Use constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(storedSecret),
      Buffer.from(secret)
    );

  } catch (error) {
    console.error('Error validating webhook secret:', error);
    return false;
  }
}

export function generateWebhookSecret(): string {
  return crypto.randomBytes(32).toString('hex');
}