import { Property } from '../types';

type CsvRow = Record<string, string>;

const REQUIRED_FIELDS = [
  'title',
  'price',
  'address',
  'city',
  'country',
  'postalCode',
  'bedrooms',
  'bathrooms',
  'size',
  'images',
  'description',
  'type',
  'category',
  'features',
  'status'
] as const;

const VALID_TYPES = ['koop', 'huur'] as const;
const VALID_CATEGORIES = ['appartementen', 'huizen', 'vakantiewoningen', 'nieuwbouw'] as const;
const VALID_STATUSES = ['actief', 'concept', 'verkocht', 'verhuurd', 'ingetrokken'] as const;

export function validateCsvData(data: CsvRow[]): string[] {
  const errors: string[] = [];

  // Check if CSV is empty
  if (data.length === 0) {
    errors.push('Het CSV-bestand is leeg');
    return errors;
  }

  // Check for required fields
  const firstRow = data[0];
  const missingFields = REQUIRED_FIELDS.filter(field => !(field in firstRow));
  if (missingFields.length > 0) {
    errors.push(`Ontbrekende verplichte kolommen: ${missingFields.join(', ')}`);
  }

  // Validate each row
  data.forEach((row, index) => {
    const rowNumber = index + 1;

    // Check for empty required fields
    REQUIRED_FIELDS.forEach(field => {
      if (!row[field]?.trim()) {
        errors.push(`Rij ${rowNumber}: ${field} is verplicht`);
      }
    });

    // Validate numeric fields
    if (isNaN(Number(row.price)) || Number(row.price) <= 0) {
      errors.push(`Rij ${rowNumber}: Ongeldige prijs`);
    }
    if (isNaN(Number(row.bedrooms)) || Number(row.bedrooms) < 0) {
      errors.push(`Rij ${rowNumber}: Ongeldig aantal slaapkamers`);
    }
    if (isNaN(Number(row.bathrooms)) || Number(row.bathrooms) < 0) {
      errors.push(`Rij ${rowNumber}: Ongeldig aantal badkamers`);
    }
    if (isNaN(Number(row.size)) || Number(row.size) <= 0) {
      errors.push(`Rij ${rowNumber}: Ongeldig woonoppervlak`);
    }

    // Validate enums
    if (!VALID_TYPES.includes(row.type as any)) {
      errors.push(`Rij ${rowNumber}: Ongeldig type (moet 'koop' of 'huur' zijn)`);
    }
    if (!VALID_CATEGORIES.includes(row.category as any)) {
      errors.push(`Rij ${rowNumber}: Ongeldige categorie`);
    }
    if (!VALID_STATUSES.includes(row.status as any)) {
      errors.push(`Rij ${rowNumber}: Ongeldige status`);
    }

    // Validate images
    const images = row.images.split(',').map(url => url.trim());
    if (images.length === 0) {
      errors.push(`Rij ${rowNumber}: Minimaal één afbeelding URL is verplicht`);
    }
    images.forEach(url => {
      try {
        new URL(url);
      } catch {
        errors.push(`Rij ${rowNumber}: Ongeldige afbeelding URL: ${url}`);
      }
    });

    // Validate features
    const features = row.features.split(',').map(feature => feature.trim());
    if (features.length === 0) {
      errors.push(`Rij ${rowNumber}: Minimaal één kenmerk is verplicht`);
    }
  });

  return errors;
}