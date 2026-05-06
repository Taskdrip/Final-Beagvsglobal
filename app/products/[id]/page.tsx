'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, ArrowLeft, Package, Star } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { toast } from 'sonner';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { addItem } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load from marketplace listings
      const listings = JSON.parse(localStorage.getItem('marketplace_listings') || '[]');
      const found = listings.find((l: any) => l.id === params.id && l.category === 'goods');
      
      if (found) {
        setProduct(found);
      }
      setLoading(false);
    }
  }, [params.id]);

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        title: product.title,
        price: product.priceInPi,
        image: product.images[0],
        quantity: 1,
      });
      toast.success('Added to cart!');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
        <p className="text-muted-foreground mb-6">This product may have been removed or doesn't exist.</p>
        <Button asChild>
          <Link href="/marketplace">Browse Marketplace</Link>
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
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden relative">
              <Image
                src={product.images[0] || "/placeholder.svg"}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(1, 5).map((img: string, idx: number) => (
                  <div key={idx} className="aspect-square bg-muted rounded overflow-hidden relative">
                    <Image src={img || "/placeholder.svg"} alt={`${product.title} ${idx + 2}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
              <div className="flex items-center gap-4 mb-4">
                <Badge>{product.category}</Badge>
                <Badge variant="outline">{product.condition}</Badge>
                {product.isFeatured && <Badge variant="secondary">Featured</Badge>}
              </div>
              
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-primary">{product.priceInPi} π</span>
                <span className="text-lg text-muted-foreground">
                  ≈ ${(product.priceInPi * 0.62).toFixed(2)} USD
                </span>
              </div>
            </div>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{product.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">Product Details</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Seller</dt>
                    <dd className="font-medium">
                      <Link href={`/profile/${product.sellerId}`} className="hover:underline">
                        {product.sellerName}
                      </Link>
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Location</dt>
                    <dd className="font-medium">{product.location || 'Not specified'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Condition</dt>
                    <dd className="font-medium capitalize">{product.condition}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Listed</dt>
                    <dd className="font-medium">{new Date(product.createdAt).toLocaleDateString()}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button size="lg" variant="outline" asChild className="bg-transparent">
                <Link href={`/profile/${product.sellerId}`}>Contact Seller</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
