export const config = {
  webhook: {
    secret: process.env.WEBHOOK_SECRET || 'your_webhook_secret_here',
    allowedOrigins: [
      'https://woningaanbod.eu',
      'http://localhost:3000'
    ]
  },
  firebase: {
    projectId: 'homeassistant2-25410',
    region: 'europe-west1'
  }
};