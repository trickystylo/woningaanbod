import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  getDocs,
  Timestamp,
  orderBy,
  limit,
  doc,
  updateDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ListingUrl } from '../types/listing';

export class StorageService {
  private static instance: StorageService;
  
  private constructor() {}

  static getInstance(): StorageService {
    if (!this.instance) {
      this.instance = new StorageService();
    }
    return this.instance;
  }

  async saveListingUrl(url: string, userId: string): Promise<string> {
    try {
      // Check for duplicate URLs from this user in the last 24 hours
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const duplicateQuery = query(
        collection(db, 'listingUrls'),
        where('userId', '==', userId),
        where('url', '==', url),
        where('createdAt', '>=', yesterday),
        limit(1)
      );

      const duplicates = await getDocs(duplicateQuery);
      if (!duplicates.empty) {
        throw new Error('Deze URL is recent al verwerkt');
      }

      // Save metadata to Firestore
      const docRef = await addDoc(collection(db, 'listingUrls'), {
        url,
        userId,
        createdAt: serverTimestamp(),
        status: 'pending'
      });

      return docRef.id;
    } catch (error) {
      if (error instanceof Error && error.message.includes('failed-precondition')) {
        throw new Error('Database niet beschikbaar. Probeer het later opnieuw.');
      }
      console.error('Error saving listing URL:', error);
      throw error;
    }
  }

  async getUserListings(userId: string): Promise<ListingUrl[]> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      const listingsRef = collection(db, 'listingUrls');
      const q = query(
        listingsRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(50)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: (doc.data().createdAt as Timestamp)?.toDate() || new Date(),
        status: doc.data().status || 'pending'
      })) as ListingUrl[];
    } catch (error) {
      if (error instanceof Error && error.message.includes('failed-precondition')) {
        console.error('Firebase indexes not created:', error);
        return []; // Return empty array instead of throwing
      }
      console.error('Error getting user listings:', error);
      return []; // Return empty array for other errors
    }
  }

  async updateListingStatus(id: string, status: ListingUrl['status']): Promise<void> {
    try {
      const docRef = doc(db, 'listingUrls', id);
      await updateDoc(docRef, {
        status,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating listing status:', error);
      throw error;
    }
  }
}

export const storageService = StorageService.getInstance();