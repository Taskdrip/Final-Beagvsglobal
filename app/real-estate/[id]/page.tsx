'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Home, MapPin, Bed, Bath, Maximize } from 'lucide-react';
import { toast } from 'sonner';
import { mockListings } from '@/lib/mock-data';

export default function RealEstateDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('marketplace_listings');
      const localListings = stored ? JSON.parse(stored) : [];
      const found = localListings.find((l: any) => l.id === params.id && l.type === 'real_estate')
        || mockListings.find((l: any) => l.id === params.id && l.type === 'real_estate');
      if (found) setProperty(found);
    } catch {
      const found = mockListings.find((l: any) => l.id === params.id && l.type === 'real_estate');
      if (found) setProperty(found);
    }
    setLoading(false);
  }, [params.id]);

  const handleContactSeller = () => {
    toast.success('Redirecting to property owner...');
    router.push(`/profile/${property.sellerId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Home className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">Property Not Found</h2>
        <p className="text-muted-foreground mb-6">This property may have been removed or doesn't exist.</p>
        <Button asChild>
          <Link href="/marketplace">Browse Properties</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
              <Image
                src={property.images[0] || "/placeholder.svg"}
                alt={property.title}
                fill
                className="object-cover"
              />
            </div>
            {property.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {property.images.slice(1, 5).map((img: string, idx: number) => (
                  <div key={idx} className="aspect-square bg-muted rounded overflow-hidden relative">
                    <Image src={img || "/placeholder.svg"} alt={`Property ${idx + 2}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{property.location || 'Location not specified'}</span>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <Badge>{property.category}</Badge>
                {property.isFeatured && <Badge variant="secondary">Featured</Badge>}
              </div>
              
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-primary">{property.priceInPi} π</span>
                <span className="text-lg text-muted-foreground">
                  ≈ ${(property.priceInPi * 0.62).toFixed(2)} USD
                </span>
              </div>
            </div>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">Property Features</h3>
                <div className="grid grid-cols-3 gap-4">
                  {property.bedrooms && (
                    <div className="text-center">
                      <Bed className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium">{property.bedrooms}</p>
                      <p className="text-xs text-muted-foreground">Bedrooms</p>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="text-center">
                      <Bath className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium">{property.bathrooms}</p>
                      <p className="text-xs text-muted-foreground">Bathrooms</p>
                    </div>
                  )}
                  {property.area && (
                    <div className="text-center">
                      <Maximize className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium">{property.area}</p>
                      <p className="text-xs text-muted-foreground">Sq Ft</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{property.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">Property Details</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Listed by</dt>
                    <dd className="font-medium">
                      <Link href={`/profile/${property.sellerId}`} className="hover:underline">
                        {property.sellerName}
                      </Link>
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Property Type</dt>
                    <dd className="font-medium capitalize">{property.propertyType || 'Not specified'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Listed</dt>
                    <dd className="font-medium">{new Date(property.createdAt).toLocaleDateString()}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Button size="lg" className="w-full" onClick={handleContactSeller}>
              <Home className="h-5 w-5 mr-2" />
              Contact Property Owner
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
