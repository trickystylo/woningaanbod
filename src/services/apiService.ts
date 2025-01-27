import { Property, ApiResponse } from '../types';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '../lib/firebase';

const functions = getFunctions(app, 'europe-west1');

export class ApiService {
  private static instance: ApiService;
  
  private constructor() {}

  static getInstance(): ApiService {
    if (!this.instance) {
      this.instance = new ApiService();
    }
    return this.instance;
  }

  async uploadCsv(file: File): Promise<ApiResponse> {
    const processCSV = httpsCallable(functions, 'processCSV');
    
    // Convert file to base64
    const reader = new FileReader();
    const fileContent = await new Promise<string>((resolve) => {
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });

    try {
      const result = await processCSV({ 
        content: fileContent,
        filename: file.name
      });
      
      return result.data as ApiResponse;
    } catch (error) {
      console.error('Error uploading CSV:', error);
      throw error;
    }
  }

  async processWebhookData(data: any): Promise<Property[]> {
    const processWebhook = httpsCallable(functions, 'processWebhook');
    const result = await processWebhook(data);
    return result.data as Property[];
  }
}

export const apiService = ApiService.getInstance();