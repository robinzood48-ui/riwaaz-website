import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product } from '../types/index.ts';
import { useToast } from './ToastContext.tsx';

interface WishlistContextType {
  items: Product[];
  count: number;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('riwaaz_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem('riwaaz_wishlist', JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  }, [items]);

  const isInWishlist = (productId: string) => {
    return items.some(p => p.id === productId);
  };

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      setItems(prev => prev.filter(p => p.id !== product.id));
      showToast('Removed from Wishlist', product.name, 'info');
    } else {
      setItems(prev => [...prev, product]);
      showToast('Saved to Wishlist', product.name, 'success');
    }
  };

  const removeFromWishlist = (productId: string) => {
    const item = items.find(p => p.id === productId);
    setItems(prev => prev.filter(p => p.id !== productId));
    if (item) {
      showToast('Removed from Wishlist', item.name, 'info');
    }
  };

  const clearWishlist = () => {
    setItems([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        count: items.length,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};
