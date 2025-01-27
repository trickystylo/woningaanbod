import { useState, useCallback } from 'react';
import { Property } from '../types';
import { FEATURED_PROPERTIES } from '../data/properties';
import { toast } from 'react-hot-toast';

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>(FEATURED_PROPERTIES);

  const toggleFeatured = useCallback(async (propertyId: string) => {
    try {
      setProperties(prev => prev.map(property => {
        if (property.id === propertyId) {
          const updated = { ...property, featured: !property.featured };
          // In a real app, this would be an API call
          console.log('Updating property:', updated);
          return updated;
        }
        return property;
      }));
      toast.success('Status succesvol bijgewerkt');
      return true;
    } catch (error) {
      console.error('Error toggling featured status:', error);
      toast.error('Er is een fout opgetreden bij het bijwerken van de status');
      return false;
    }
  }, []);

  const updateProperty = useCallback(async (propertyId: string, updates: Partial<Property>) => {
    try {
      setProperties(prev => prev.map(property => {
        if (property.id === propertyId) {
          const updated = { ...property, ...updates };
          // In a real app, this would be an API call
          console.log('Updating property:', updated);
          return updated;
        }
        return property;
      }));
      toast.success('Woning succesvol bijgewerkt');
      return true;
    } catch (error) {
      console.error('Error updating property:', error);
      toast.error('Er is een fout opgetreden bij het bijwerken van de woning');
      return false;
    }
  }, []);

  return {
    properties,
    toggleFeatured,
    updateProperty
  };
}