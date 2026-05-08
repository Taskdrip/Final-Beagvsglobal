import Link from 'next/link';
import { Suspense } from 'react';
import { MarketplaceContent } from '@/components/marketplace/marketplace-content';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata = {
  title: 'Marketplace - Beagvs',
  description: 'Browse and buy goods and services on Beagvs marketplace with secure Pi Network payments.',
};

export default function MarketplacePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="border-b bg-muted/30 py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-balance">
            {'Discover Goods & Services'}
          </h1>
          <p className="text-muted-foreground max-w-2xl text-balance">
            {'Browse thousands of listings from trusted sellers. All transactions protected by escrow.'}
          </p>
        </div>
      </section>

      {/* Marketplace Content */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <Suspense fallback={<MarketplaceSkeleton />}>
            <MarketplaceContent />
          </Suspense>
        </div>
      </section>
    </div>
  );
}

function MarketplaceSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1 space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
      <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
