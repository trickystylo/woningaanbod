export const env = {
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  }
};

export function validateEnv() {
  const missing: string[] = [];

  // Validate Firebase config
  if (!env.firebase.apiKey) missing.push('VITE_FIREBASE_API_KEY');
  if (!env.firebase.authDomain) missing.push('VITE_FIREBASE_AUTH_DOMAIN');
  if (!env.firebase.projectId) missing.push('VITE_FIREBASE_PROJECT_ID');
  if (!env.firebase.messagingSenderId) missing.push('VITE_FIREBASE_MESSAGING_SENDER_ID');
  if (!env.firebase.appId) missing.push('VITE_FIREBASE_APP_ID');

  if (missing.length > 0) {
    console.error('Missing environment variables:', missing.join(', '));
    console.error('Please check your .env file and ensure all required variables are set.');
  }
}