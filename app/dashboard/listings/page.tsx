"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Package, Edit, Trash2, Eye, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function MyListingsPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [listings, setListings] = useState([
    {
      id: '1',
      title: 'Vintage Camera Collection',
      category: 'electronics',
      priceInPi: 45.0,
      status: 'active' as const,
      isFeatured: true,
      images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=400&fit=crop'],
      views: 127,
      createdAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      title: 'Professional Web Design Service',
      category: 'services',
      priceInPi: 200.0,
      status: 'active' as const,
      isFeatured: false,
      images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=400&fit=crop'],
      views: 85,
      createdAt: new Date('2024-01-18'),
    },
    {
      id: '3',
      title: 'Handmade Leather Wallet',
      category: 'fashion',
      priceInPi: 15.0,
      status: 'sold' as const,
      isFeatured: false,
      images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=400&fit=crop'],
      views: 54,
      createdAt: new Date('2024-01-10'),
    },
  ]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/marketplace');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  // Premium account status
  const isPremium = user?.isPremium || false;
  const listingsThisMonth = user?.listingsThisMonth || 0;
  const maxListings = isPremium ? 12 : 1;
  const canCreateListing = listingsThisMonth < maxListings;

  const activeListings = listings.filter(l => l.status === 'active').length;
  const totalViews = listings.reduce((sum, l) => sum + l.views, 0);
  const soldListings = listings.filter(l => l.status === 'sold').length;

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      setListings(listings.filter(l => l.id !== id));
      toast.success(`Deleted "${title}"`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'sold': return 'secondary';
      case 'inactive': return 'outline';
      default: return 'default';
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Listings</h1>
          <p className="text-muted-foreground">
            Manage your marketplace listings
          </p>
        </div>
        <Button asChild size="lg" disabled={!canCreateListing}>
          <Link href="/dashboard/listings/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Listing
          </Link>
        </Button>
      </div>

      {/* Premium Status Card */}
      <Card className="mb-8 border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold">
                  {isPremium ? 'Premium Account' : 'Free Account'}
                </h3>
                {isPremium && <Badge variant="default">Premium</Badge>}
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {isPremium 
                  ? `You can create up to ${maxListings} listings per month.`
                  : `Free accounts can create ${maxListings} listing per month. Upgrade to Premium for ${isPremium ? maxListings : 12} listings per month.`
                }
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Monthly listings used</span>
                  <span className="font-medium">{listingsThisMonth} / {maxListings}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${(listingsThisMonth / maxListings) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            {!isPremium && (
              <Button asChild size="lg">
                <Link href="/dashboard/settings">Upgrade to Premium</Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeListings}</div>
            <p className="text-xs text-muted-foreground">Currently on marketplace</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews}</div>
            <p className="text-xs text-muted-foreground">All time views</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Items Sold</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{soldListings}</div>
            <p className="text-xs text-muted-foreground">Completed sales</p>
          </CardContent>
        </Card>
      </div>

      {/* Listings Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">All Listings</h2>
        
        {listings.length === 0 ? (
          <Card className="p-12">
            <div className="text-center space-y-4">
              <Package className="h-16 w-16 text-muted-foreground mx-auto opacity-50" />
              <div>
                <h3 className="text-xl font-semibold mb-2">No listings yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first listing to start selling
                </p>
                <Button asChild>
                  <Link href="/dashboard/listings/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Listing
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {listings.map(listing => (
              <Card key={listing.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="w-full md:w-48 aspect-square md:aspect-auto bg-muted">
                    <img
                      src={listing.images[0] || "/placeholder.svg"}
                      alt={listing.title}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold">{listing.title}</h3>
                          {listing.isFeatured && (
                            <Badge variant="secondary" className="gap-1">
                              <Star className="h-3 w-3" />
                              Featured
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                          <Badge variant={getStatusColor(listing.status)} className="capitalize">
                            {listing.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground capitalize">
                            {listing.category}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            • {listing.views} views
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="text-2xl font-bold">{listing.priceInPi} π</div>
                          <span className="text-sm text-muted-foreground">
                            Listed {listing.createdAt.toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex md:flex-col gap-2">
                        <Button asChild variant="outline" size="sm" className="flex-1 md:flex-none bg-transparent">
                          <Link href={`/marketplace/${listing.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </Button>
                        <Button asChild variant="outline" size="sm" className="flex-1 md:flex-none bg-transparent">
                          <Link href={`/dashboard/listings/${listing.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(listing.id, listing.title)}
                          className="flex-1 md:flex-none text-destructive hover:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
