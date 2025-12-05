import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceEventEmitter } from 'react-native';

const FAVORITES_STORAGE_KEY = '@kalendos_favorites';
const FAVORITES_CHANGED_EVENT = 'favoritesChanged';

export interface FavoriteProduct {
  id: string;
  handle: string;
  title: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText?: string;
      };
    }>;
  };
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Load favorites from AsyncStorage
  useEffect(() => {
    loadFavorites();

    // Listen for favorites changes from other components
    const subscription = DeviceEventEmitter.addListener(
      FAVORITES_CHANGED_EVENT,
      () => {
        console.log('📢 Favoriler değişti eventi alındı - yeniden yükleniyor');
        loadFavorites();
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveFavorites = async (newFavorites: FavoriteProduct[]) => {
    try {
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites));
      setFavorites(newFavorites);

      // Notify all other useFavorites hooks that favorites changed
      console.log('📢 Favoriler değişti - event yayınlanıyor');
      DeviceEventEmitter.emit(FAVORITES_CHANGED_EVENT);
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const addFavorite = async (product: FavoriteProduct) => {
    const newFavorites = [...favorites, product];
    await saveFavorites(newFavorites);
  };

  const removeFavorite = async (productId: string) => {
    const newFavorites = favorites.filter((fav) => fav.id !== productId);
    await saveFavorites(newFavorites);
  };

  const toggleFavorite = async (product: FavoriteProduct) => {
    if (isFavorite(product.id)) {
      await removeFavorite(product.id);
    } else {
      await addFavorite(product);
    }
  };

  const isFavorite = (productId: string): boolean => {
    return favorites.some((fav) => fav.id === productId);
  };

  const clearFavorites = async () => {
    await saveFavorites([]);
  };

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    loadFavorites,
    favoriteCount: favorites.length,
  };
};
