'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ListingDetail } from '@/components/marketplace/listing-detail';
import { getListingById, mockListings } from '@/lib/mock-data';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function getInitialListing(id: string | undefined) {
  if (!id) return null;
  return getListingById(id) || null;
}

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;

  const [listing, setListing] = useState<any>(() => getInitialListing(id));
  const [localChecked, setLocalChecked] = useState(false);

  useEffect(() => {
    if (!id) return;

    if (listing) {
      setLocalChecked(true);
      return;
    }

    try {
      const stored = localStorage.getItem('marketplace_listings');
      const localListings = stored ? JSON.parse(stored) : [];
      const localListing = localListings.find((l: any) => l.id === id);
      if (localListing) {
        setListing(localListing);
      }
    } catch {
    }
    setLocalChecked(true);
  }, [id, listing]);

  if (!id || (!listing && !localChecked)) {
    return <ListingDetailSkeleton />;
  }

  if (!listing) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Listing Not Found</h2>
        <p className="text-muted-foreground mb-6">This listing may have been removed or does not exist.</p>
        <Button asChild>
          <Link href="/marketplace">Back to Marketplace</Link>
        </Button>
      </div>
    );
  }

  return <ListingDetail listing={listing} />;
}

function ListingDetailSkeleton() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Skeleton className="aspect-square w-full" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
