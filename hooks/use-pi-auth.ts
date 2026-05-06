"use client";

import { useState, useEffect } from 'react';
import { usePiNetworkAuthentication } from './use-pi-network-authentication';
import { BACKEND_URLS } from '@/lib/system-config';

export interface PiProduct {
  id: string;
  name: string;
  description: string;
  price_in_pi: number;
  app_id: string;
  created_at: string;
}

interface UsePiAuthReturn {
  products: PiProduct[];
  isLoading: boolean;
  error: string | null;
}

declare global {
  interface Window {
    pay: (config: {
      amount: number;
      memo: string;
      metadata: { productId: string };
      onComplete: (payment: any) => void;
      onError: (error: any) => void;
    }) => void;
  }
}

export function usePiAuth(): UsePiAuthReturn | null {
  const { isAuthenticated, piAccessToken } = usePiNetworkAuthentication();
  const [products, setProducts] = useState<PiProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !piAccessToken) {
      setIsLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        // For now, we'll use mock products since we need an appId
        // In production, this would fetch from BACKEND_URLS.GET_PRODUCTS(appId)
        const mockProducts: PiProduct[] = [
          {
            id: '697e084ca4bb446e6274b2cd',
            name: 'Verified account subscription',
            description: 'Experience premium access and privileges on Beagvs Ecosystem.',
            price_in_pi: 10.0,
            app_id: 'beagvs-app',
            created_at: new Date().toISOString(),
          },
        ];

        setProducts(mockProducts);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products');
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [isAuthenticated, piAccessToken]);

  if (!isAuthenticated) {
    return null;
  }

  return {
    products,
    isLoading,
    error,
  };
}
