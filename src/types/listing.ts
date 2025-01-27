export interface ListingUrl {
  id?: string;
  url: string;
  userId: string;
  createdAt: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  updatedAt?: Date;
  error?: string;
}