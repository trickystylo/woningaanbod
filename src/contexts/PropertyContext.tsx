import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Property } from '../types';
import { getAllProperties, updateProperty as updateFirebaseProperty, addProperty as addFirebaseProperty, deleteProperty as deleteFirebaseProperty } from '../lib/firebase';
import { toast } from 'react-hot-toast';

interface PropertyContextType {
  properties: Property[];
  loading: boolean;
  error: string | null;
  toggleFeatured: (propertyId: string) => Promise<boolean>;
  updateProperty: (propertyId: string, updates: Partial<Property>) => Promise<boolean>;
  addProperty: (property: Omit<Property, 'id'>) => Promise<Property>;
  deleteProperty: (propertyId: string) => Promise<boolean>;
  refreshProperties: () => Promise<void>;
}

const PropertyContext = createContext<PropertyContextType | null>(null);

export function PropertyProvider({ children }: { children: React.ReactNode }) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshProperties = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedProperties = await getAllProperties();
      setProperties(fetchedProperties);
      setError(null);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Er is een fout opgetreden bij het ophalen van de woningen');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProperties();
  }, [refreshProperties]);

  const toggleFeatured = useCallback(async (propertyId: string) => {
    try {
      const property = properties.find(p => p.id === propertyId);
      if (!property) return false;

      const updated = await updateFirebaseProperty(propertyId, {
        featured: !property.featured
      });

      if (updated) {
        setProperties(prev => prev.map(p => 
          p.id === propertyId ? { ...p, featured: !p.featured } : p
        ));
        toast.success('Status succesvol bijgewerkt');
      }
      
      return true;
    } catch (error) {
      console.error('Error toggling featured status:', error);
      toast.error('Er is een fout opgetreden bij het bijwerken van de status');
      return false;
    }
  }, [properties]);

  const updateProperty = useCallback(async (propertyId: string, updates: Partial<Property>) => {
    try {
      const updated = await updateFirebaseProperty(propertyId, updates);
      
      if (updated) {
        setProperties(prev => prev.map(p => 
          p.id === propertyId ? { ...p, ...updates } : p
        ));
        toast.success('Woning succesvol bijgewerkt');
      }
      
      return true;
    } catch (error) {
      console.error('Error updating property:', error);
      toast.error('Er is een fout opgetreden bij het bijwerken van de woning');
      return false;
    }
  }, []);

  const addProperty = useCallback(async (property: Omit<Property, 'id'>) => {
    try {
      const newProperty = await addFirebaseProperty(property);
      setProperties(prev => [newProperty, ...prev]);
      toast.success('Woning succesvol toegevoegd');
      return newProperty;
    } catch (error) {
      console.error('Error adding property:', error);
      toast.error('Er is een fout opgetreden bij het toevoegen van de woning');
      throw error;
    }
  }, []);

  const deleteProperty = useCallback(async (propertyId: string) => {
    try {
      await deleteFirebaseProperty(propertyId);
      setProperties(prev => prev.filter(p => p.id !== propertyId));
      toast.success('Woning succesvol verwijderd');
      return true;
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Er is een fout opgetreden bij het verwijderen van de woning');
      return false;
    }
  }, []);

  return (
    <PropertyContext.Provider value={{ 
      properties, 
      loading, 
      error, 
      toggleFeatured, 
      updateProperty,
      addProperty,
      deleteProperty,
      refreshProperties
    }}>
      {children}
    </PropertyContext.Provider>
  );
}

export function useProperties() {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperties must be used within a PropertyProvider');
  }
  return context;
}