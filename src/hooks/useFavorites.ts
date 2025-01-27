import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const STORAGE_KEY = 'woningaanbod_favorites';

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  // Persist favorites to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = useCallback((propertyId: string) => {
    if (!user) {
      toast.error('U moet ingelogd zijn om favorieten te kunnen opslaan');
      return;
    }

    setFavorites(prev => {
      const newFavorites = prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId];
      
      // In a real app, this would be an API call to update the user's favorites
      console.log('Updating favorites:', newFavorites);
      
      const action = prev.includes(propertyId) ? 'verwijderd uit' : 'toegevoegd aan';
      toast.success(`Woning ${action} favorieten`);
      
      return newFavorites;
    });
  }, [user]);

  const isFavorite = useCallback((propertyId: string) => {
    return favorites.includes(propertyId);
  }, [favorites]);

  return {
    favorites,
    toggleFavorite,
    isFavorite
  };
}