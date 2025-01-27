import { GoogleAuth } from 'google-auth-library';
import { env } from '../config/env.config';

export class DriveService {
  private static instance: DriveService;
  private auth;
  private baseUrl = 'https://www.googleapis.com/drive/v3';

  private constructor() {
    this.auth = new GoogleAuth({
      credentials: {
        client_email: env.google.clientEmail,
        private_key: env.google.privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/drive.file']
    });
  }

  static getInstance(): DriveService {
    if (!this.instance) {
      this.instance = new DriveService();
    }
    return this.instance;
  }

  private async getAccessToken(): Promise<string> {
    const client = await this.auth.getClient();
    const token = await client.getAccessToken();
    return token.token || '';
  }

  async saveListingUrl(url: string, userId: string): Promise<string> {
    try {
      const timestamp = new Date().toISOString();
      const fileName = `listing_${userId}_${timestamp}.txt`;
      const fileContent = `URL: ${url}\nUser: ${userId}\nTimestamp: ${timestamp}`;

      const token = await this.getAccessToken();
      
      // Create file metadata
      const metadata = {
        name: fileName,
        parents: [env.google.folderId],
        mimeType: 'text/plain'
      };

      // Create multipart request
      const boundary = '-------314159265358979323846';
      const delimiter = "\r\n--" + boundary + "\r\n";
      const closeDelim = "\r\n--" + boundary + "--";

      const multipartRequestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: text/plain\r\n\r\n' +
        fileContent +
        closeDelim;

      // Create file
      const response = await fetch(`${this.baseUrl}/files?uploadType=multipart`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': `multipart/related; boundary=${boundary}`,
          'Content-Length': multipartRequestBody.length.toString()
        },
        body: multipartRequestBody
      });

      if (!response.ok) {
        throw new Error('Failed to create file');
      }

      const data = await response.json();
      return data.id;
    } catch (error) {
      console.error('Error saving to Google Drive:', error);
      throw new Error('Fout bij opslaan in Google Drive');
    }
  }

  async getFileUrl(fileId: string): Promise<string> {
    try {
      const token = await this.getAccessToken();

      // Create public permission
      await fetch(`${this.baseUrl}/files/${fileId}/permissions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          role: 'reader',
          type: 'anyone'
        })
      });

      // Get file metadata
      const response = await fetch(
        `${this.baseUrl}/files/${fileId}?fields=webViewLink`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get file URL');
      }

      const data = await response.json();
      return data.webViewLink || '';
    } catch (error) {
      console.error('Error getting file URL:', error);
      throw new Error('Fout bij ophalen van bestand URL');
    }
  }
}

export const driveService = DriveService.getInstance();