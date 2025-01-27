import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Property, PropertyFilters } from '../types';

export async function searchProperties(filters: PropertyFilters) {
  try {
    let q = collection(db, 'properties');
    const conditions = [];

    if (filters.type) {
      conditions.push(where('type', '==', filters.type));
    }

    if (filters.category) {
      conditions.push(where('category', '==', filters.category));
    }

    if (filters.country) {
      conditions.push(where('country', '==', filters.country));
    }

    if (filters.city) {
      conditions.push(where('city', '==', filters.city));
    }

    if (filters.minPrice) {
      conditions.push(where('price', '>=', filters.minPrice));
    }

    if (filters.maxPrice) {
      conditions.push(where('price', '<=', filters.maxPrice));
    }

    if (filters.minBedrooms) {
      conditions.push(where('bedrooms', '>=', filters.minBedrooms));
    }

    if (filters.minSize) {
      conditions.push(where('size', '>=', filters.minSize));
    }

    q = query(q, ...conditions, orderBy('datePosted', 'desc'), limit(50));
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Property[];
  } catch (error) {
    console.error('Error searching properties:', error);
    throw error;
  }
}

export async function getPropertyCountByCountry(country: string): Promise<number> {
  try {
    const q = query(
      collection(db, 'properties'),
      where('country', '==', country)
    );
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error('Error getting property count:', error);
    throw error;
  }
}

export async function getPropertyCountByCategory(category: string): Promise<number> {
  try {
    const q = query(
      collection(db, 'properties'),
      where('category', '==', category)
    );
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error('Error getting property count:', error);
    throw error;
  }
}