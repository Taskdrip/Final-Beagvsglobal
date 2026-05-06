import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Package, Zap, Lock, ShoppingBag, TrendingUp, Home, Truck, Globe, Coins } from 'lucide-react';
import { getFeaturedListings } from '@/lib/mock-data';
import { FeatureSlider } from '@/components/feature-slider';

export default function HomePage() {
  const featuredListings = getFeaturedListings().slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/10 to-background py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
              <Coins className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Powered by Pi Network</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              Buy, Sell & Ship with <span className="text-primary">Beagvs</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
              The secure marketplace for goods and services with integrated shipping and Pi Network escrow protection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/marketplace">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Browse Marketplace
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/shipping">
                  <Truck className="mr-2 h-5 w-5" />
                  Learn About Shipping
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Slider Section */}
      <FeatureSlider />

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Beagvs?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
              Experience the future of online commerce with blockchain security and integrated logistics.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Escrow Protection</CardTitle>
                <CardDescription>
                  Your Pi is held securely until delivery is confirmed
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Truck className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Integrated Shipping</CardTitle>
                <CardDescription>
                  Multiple delivery options with real-time tracking
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Lock className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Secure Payments</CardTitle>
                <CardDescription>
                  Pi Network integration for fast, safe transactions
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Globe className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Global Reach</CardTitle>
                <CardDescription>
                  Buy and sell from anywhere in the world
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Listings</h2>
              <p className="text-muted-foreground">Discover trending products and services</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/marketplace">View All</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredListings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-muted relative">
                  <img
                    src={listing.images[0] || "/placeholder.svg"}
                    alt={listing.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="line-clamp-1">{listing.title}</CardTitle>
                      <CardDescription className="line-clamp-2 mt-2">
                        {listing.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        π {listing.priceInPi}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        ${(listing.priceInPi * 100).toFixed(2)} USD
                      </div>
                    </div>
                    <Button asChild>
                      <Link href={`/marketplace/${listing.id}`}>View Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How Beagvs Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
              Simple, secure, and efficient - from browsing to delivery.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Browse & Select</h3>
              <p className="text-sm text-muted-foreground">
                Find products or services in our marketplace
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Secure Payment</h3>
              <p className="text-sm text-muted-foreground">
                Pay with Pi through our escrow system
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Track Shipment</h3>
              <p className="text-sm text-muted-foreground">
                Monitor your order with real-time updates
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                4
              </div>
              <h3 className="font-semibold mb-2">Confirm & Release</h3>
              <p className="text-sm text-muted-foreground">
                Verify delivery and funds are released to seller
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-primary text-primary-foreground rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg mb-8 text-pretty max-w-2xl mx-auto opacity-90">
              Join thousands of buyers and sellers using Beagvs for secure, efficient commerce.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/marketplace">Start Shopping</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">10K+</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">5K+</div>
              <div className="text-sm text-muted-foreground">Listings</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">98%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">Support</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
