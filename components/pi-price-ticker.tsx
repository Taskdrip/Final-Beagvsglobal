'use client';

import { useState, useEffect } from 'react';
import { PiPriceTracker, type PiPriceData } from '@/lib/pi-price-tracker';
import { TrendingUp, TrendingDown, Coins } from 'lucide-react';

export function PiPriceTicker() {
  const [price, setPrice] = useState<PiPriceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load initial price
    PiPriceTracker.getPrice().then((priceData) => {
      setPrice(priceData);
      setIsLoading(false);
    });

    // Start real-time updates
    PiPriceTracker.startRealTimeUpdates((priceData) => {
      setPrice(priceData);
    });

    // Cleanup
    return () => {
      PiPriceTracker.stopRealTimeUpdates();
    };
  }, []);

  if (isLoading || !price) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Coins className="h-4 w-4 animate-pulse" />
        <span>Loading...</span>
      </div>
    );
  }

  const isPositive = price.change24h >= 0;

  return (
    <div className="flex items-center gap-3 px-3 py-1.5 bg-muted/50 rounded-full text-sm">
      <div className="flex items-center gap-1.5">
        <Coins className="h-4 w-4 text-primary" />
        <span className="font-semibold">π</span>
      </div>
      
      <span className="font-bold text-foreground">
        ${price.usd.toFixed(4)}
      </span>
      
      <div className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? (
          <TrendingUp className="h-3 w-3" />
        ) : (
          <TrendingDown className="h-3 w-3" />
        )}
        <span className="text-xs font-medium">
          {isPositive ? '+' : ''}{price.change24h.toFixed(2)}%
        </span>
      </div>
    </div>
  );
}
