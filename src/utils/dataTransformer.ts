import { Property } from '../types';
import { csvLogger } from './csvLogger';

export function transformPropertyData(row: Record<string, any>): Omit<Property, 'id'> | null {
  try {
    return {
      title: row.title,
      price: Number(row.price),
      address: row.address,
      city: row.city,
      country: row.country,
      postalCode: row.postalcode || row.postalCode,
      bedrooms: Number(row.bedrooms),
      bathrooms: Number(row.bathrooms),
      size: Number(row.size),
      images: row.images.split(/[,|]/).map((url: string) => url.trim()),
      description: row.description,
      type: row.type as 'koop' | 'huur',
      category: row.category as Property['category'],
      features: row.features.split(/[,|]/).map((feature: string) => feature.trim()),
      datePosted: new Date().toLocaleDateString('nl-NL'),
      status: row.status as Property['status'],
      makelaarId: row.makelaarid || row.makelaarId || generateRealtorId(),
      featured: false
    };
  } catch (error: any) {
    csvLogger.log('error', `Fout bij transformeren van data: ${error.message}`, row);
    return null;
  }
}

function generateRealtorId(): string {
  const date = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const random = String(Math.floor(Math.random() * 100)).padStart(2, '0');
  return `RLTR-${date}${random}`;
}

export function validateTransformedData(property: Omit<Property, 'id'>): string[] {
  const errors: string[] = [];

  if (!property.title) errors.push('Titel is verplicht');
  if (!property.price || property.price <= 0) errors.push('Ongeldige prijs');
  if (!property.address) errors.push('Adres is verplicht');
  if (!property.city) errors.push('Stad is verplicht');
  if (!property.country) errors.push('Land is verplicht');
  if (!property.postalCode) errors.push('Postcode is verplicht');
  if (property.bedrooms < 0) errors.push('Ongeldig aantal slaapkamers');
  if (property.bathrooms < 0) errors.push('Ongeldig aantal badkamers');
  if (property.size <= 0) errors.push('Ongeldige grootte');
  if (property.images.length === 0) errors.push('Minimaal één afbeelding is verplicht');
  if (!property.description) errors.push('Beschrijving is verplicht');

  return errors;
}