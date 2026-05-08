'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Coins } from 'lucide-react';

interface PiPriceData {
  usd: number;
  change24h: number;
}

function getSimulatedPrice(): PiPriceData {
  const basePrice = 0.6124;
  const variation = (Math.random() - 0.5) * 0.02;
  return {
    usd: Number((basePrice + variation).toFixed(4)),
    change24h: Number((Math.random() * 6 - 3).toFixed(2)),
  };
}

function getCachedPrice(): PiPriceData | null {
  if (typeof window === 'undefined') return null;
  try {
    const cached = localStorage.getItem('pi_coin_price');
    if (!cached) return null;
    const data = JSON.parse(cached);
    const age = Date.now() - new Date(data.lastUpdated).getTime();
    if (age < 60_000) return data;
    return null;
  } catch {
    return null;
  }
}

export function PiPriceTicker() {
  const [price, setPrice] = useState<PiPriceData>(() => {
    if (typeof window !== 'undefined') {
      const cached = getCachedPrice();
      if (cached) return cached;
    }
    return getSimulatedPrice();
  });

  useEffect(() => {
    const cached = getCachedPrice();
    if (cached) {
      setPrice(cached);
    } else {
      const sim = getSimulatedPrice();
      setPrice(sim);
      try {
        localStorage.setItem('pi_coin_price', JSON.stringify({ ...sim, lastUpdated: new Date().toISOString() }));
      } catch {}
    }

    const interval = setInterval(() => {
      const c = getCachedPrice();
      if (c) { setPrice(c); return; }
      const sim = getSimulatedPrice();
      setPrice(sim);
      try {
        localStorage.setItem('pi_coin_price', JSON.stringify({ ...sim, lastUpdated: new Date().toISOString() }));
      } catch {}
    }, 60_000);

    return () => clearInterval(interval);
  }, []);

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
      <div className={`flex items-center gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        <span className="text-xs font-medium">
          {isPositive ? '+' : ''}{price.change24h.toFixed(2)}%
        </span>
      </div>
    </div>
  );
}
