"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Listing } from '@/lib/database-types';

export interface CartItem {
  listing: Listing;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (listing: Listing, quantity?: number) => void;
  removeItem: (listingId: string) => void;
  updateQuantity: (listingId: string, quantity: number) => void;
  clearCart: () => void;
  totalPi: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const savedCart = localStorage.getItem('beagvs_cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        setItems(parsed);
      }
    } catch (error) {
      console.error('[v0] Failed to parse cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem('beagvs_cart', JSON.stringify(items));
    } catch (error) {
      console.error('[v0] Failed to save cart:', error);
    }
  }, [items]);

  const addItem = (listing: Listing, quantity = 1) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.listing.id === listing.id);
      
      if (existingItem) {
        return currentItems.map(item =>
          item.listing.id === listing.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...currentItems, { listing, quantity }];
    });
  };

  const removeItem = (listingId: string) => {
    setItems(currentItems => currentItems.filter(item => item.listing.id !== listingId));
  };

  const updateQuantity = (listingId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(listingId);
      return;
    }
    
    setItems(currentItems =>
      currentItems.map(item =>
        item.listing.id === listingId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalPi = items.reduce((sum, item) => sum + (item.listing.priceInPi * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalPi,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
