export interface Property {
  id: string;
  title: string;
  price: number;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  bedrooms: number;
  bathrooms: number;
  size: number;
  images: string[];
  description: string;
  type: 'koop' | 'huur';
  category: 'appartementen' | 'huizen' | 'vakantiewoningen' | 'nieuwbouw';
  features: string[];
  datePosted: string;
  status: 'actief' | 'concept' | 'verkocht' | 'verhuurd' | 'ingetrokken';
  makelaarId: string;
  featured: boolean;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  favorites: string[];
}

export type UserRole = 'user' | 'realtor' | 'owner' | 'admin';

export interface ApiResponse {
  success: boolean;
  results?: {
    added: number;
    duplicates: number;
    errors: number;
    details: string[];
  };
  error?: string;
}