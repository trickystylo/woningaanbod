import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { Property } from '../types';

const firebaseConfig = {
  apiKey: "AIzaSyA0uih_kVTsHJ9h94E6sSecaMGApgYmxeE",
  authDomain: "homeassistant2-25410.firebaseapp.com",
  projectId: "homeassistant2-25410",
  storageBucket: "homeassistant2-25410.appspot.com",
  messagingSenderId: "630781902629",
  appId: "1:630781902629:web:a7ac9631d0a774f33864cc"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Property CRUD operations
export async function addProperty(property: Omit<Property, 'id'>) {
  try {
    const docRef = await addDoc(collection(db, 'properties'), {
      ...property,
      datePosted: new Date().toISOString()
    });
    return { id: docRef.id, ...property };
  } catch (error) {
    console.error('Error adding property:', error);
    throw error;
  }
}

export async function updateProperty(id: string, updates: Partial<Property>) {
  try {
    const propertyRef = doc(db, 'properties', id);
    await updateDoc(propertyRef, updates);
    return true;
  } catch (error) {
    console.error('Error updating property:', error);
    throw error;
  }
}

export async function deleteProperty(id: string) {
  try {
    const propertyRef = doc(db, 'properties', id);
    await deleteDoc(propertyRef);
    return true;
  } catch (error) {
    console.error('Error deleting property:', error);
    throw error;
  }
}

export async function getAllProperties(): Promise<Property[]> {
  try {
    const q = query(collection(db, 'properties'), orderBy('datePosted', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Property));
  } catch (error) {
    console.error('Error getting properties:', error);
    throw error;
  }
}

export async function getPropertyById(id: string): Promise<Property | null> {
  try {
    const propertyRef = doc(db, 'properties', id);
    const snapshot = await getDocs(query(collection(db, 'properties'), where('id', '==', id)));
    if (snapshot.empty) return null;
    const data = snapshot.docs[0].data();
    return { id: snapshot.docs[0].id, ...data } as Property;
  } catch (error) {
    console.error('Error getting property:', error);
    throw error;
  }
}