'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ListingDetail } from '@/components/marketplace/listing-detail';
import { getListingById } from '@/lib/mock-data';
import { Skeleton } from '@/components/ui/skeleton';

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundListing = getListingById(params.id);
    if (!foundListing) {
      router.push('/marketplace');
      return;
    }
    setListing(foundListing);
    setLoading(false);
  }, [params.id, router]);

  if (loading) {
    return <ListingDetailSkeleton />;
  }

  if (!listing) {
    return null;
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
