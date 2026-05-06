'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Briefcase, Clock, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export default function ServiceDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const listings = JSON.parse(localStorage.getItem('marketplace_listings') || '[]');
      const found = listings.find((l: any) => l.id === params.id && l.category === 'services');
      
      if (found) {
        setService(found);
      }
      setLoading(false);
    }
  }, [params.id]);

  const handleContactSeller = () => {
    toast.success('Redirecting to seller profile...');
    router.push(`/profile/${service.sellerId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Briefcase className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">Service Not Found</h2>
        <p className="text-muted-foreground mb-6">This service may have been removed or doesn't exist.</p>
        <Button asChild>
          <Link href="/marketplace">Browse Services</Link>
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
                src={service.images[0] || "/placeholder.svg"}
                alt={service.title}
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{service.title}</h1>
              <div className="flex items-center gap-4 mb-4">
                <Badge>{service.category}</Badge>
                {service.isFeatured && <Badge variant="secondary">Featured</Badge>}
              </div>
              
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-primary">{service.priceInPi} π</span>
                <span className="text-lg text-muted-foreground">
                  ≈ ${(service.priceInPi * 0.62).toFixed(2)} USD
                </span>
              </div>
            </div>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Service Description</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">Service Details</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Provider</dt>
                    <dd className="font-medium">
                      <Link href={`/profile/${service.sellerId}`} className="hover:underline">
                        {service.sellerName}
                      </Link>
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Location</dt>
                    <dd className="font-medium">{service.location || 'Remote/Flexible'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Availability</dt>
                    <dd className="font-medium">Available Now</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Posted</dt>
                    <dd className="font-medium">{new Date(service.createdAt).toLocaleDateString()}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Button size="lg" className="w-full" onClick={handleContactSeller}>
              <Briefcase className="h-5 w-5 mr-2" />
              Contact Service Provider
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
