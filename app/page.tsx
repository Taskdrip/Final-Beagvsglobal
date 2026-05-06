'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Truck, Lock, Globe, ShoppingBag, TrendingUp, Star, ArrowRight, Zap } from 'lucide-react';
import { HeroSlider } from '@/components/hero-slider';
import { getFeaturedListings } from '@/lib/mock-data';

const featuredListings = getFeaturedListings().slice(0, 3);

const features = [
  {
    icon: Shield,
    title: 'Escrow Protection',
    description: 'Your Pi is held securely in escrow until delivery is confirmed. Zero risk on every transaction.',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    icon: Truck,
    title: 'Integrated Shipping',
    description: 'Multiple delivery options with real-time tracking and Pi-powered payments.',
    color: 'text-sky-500',
    bg: 'bg-sky-500/10',
  },
  {
    icon: Lock,
    title: 'Secure Payments',
    description: 'Pi Network blockchain integration for fast, safe, and transparent transactions.',
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10',
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Buy and sell with verified users from anywhere in the world.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
];

const steps = [
  { num: '01', title: 'Browse & Select', desc: 'Find products or services in our verified marketplace' },
  { num: '02', title: 'Secure Payment', desc: 'Pay with Pi through our escrow system' },
  { num: '03', title: 'Track Shipment', desc: 'Monitor your order with real-time updates' },
  { num: '04', title: 'Confirm & Release', desc: 'Verify delivery and funds release to seller' },
];

const stats = [
  { value: '10K+', label: 'Active Users', icon: TrendingUp },
  { value: '5K+', label: 'Listings', icon: ShoppingBag },
  { value: '98%', label: 'Success Rate', icon: Star },
  { value: '24/7', label: 'Support', icon: Zap },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSlider />

      {/* Stats Bar */}
      <section className="py-10 border-y bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="group">
                  <div className="flex items-center justify-center mb-2">
                    <Icon className="h-5 w-5 text-primary mr-2" />
                    <div className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Why Beagvs</p>
            <h2 className="text-4xl font-bold mb-4">Built for the Pi Economy</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Experience the future of online commerce with blockchain security and integrated logistics.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <Card key={f.title} className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group border-border/50">
                  <CardHeader>
                    <div className={`w-14 h-14 rounded-2xl ${f.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`h-7 w-7 ${f.color}`} />
                    </div>
                    <CardTitle className="text-lg">{f.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">{f.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">Trending Now</p>
              <h2 className="text-4xl font-bold">Featured Listings</h2>
              <p className="text-muted-foreground mt-2">Discover top products from verified sellers</p>
            </div>
            <Button variant="outline" asChild className="hidden md:flex items-center gap-2">
              <Link href="/marketplace">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredListings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                  <img
                    src={listing.images[0] || '/placeholder.svg'}
                    alt={listing.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  {listing.isFeatured && (
                    <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                      Featured
                    </div>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="line-clamp-1 text-base">{listing.title}</CardTitle>
                      <CardDescription className="line-clamp-2 mt-1">{listing.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-primary">π {listing.priceInPi}</div>
                      <div className="text-xs text-muted-foreground">${(listing.priceInPi * 100).toFixed(2)} est.</div>
                    </div>
                    <Button size="sm" asChild>
                      <Link href={`/marketplace/${listing.id}`}>View Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Button asChild variant="outline">
              <Link href="/marketplace">View All Listings</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Simple Process</p>
            <h2 className="text-4xl font-bold mb-4">How Beagvs Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From browsing to delivery — simple, secure, and efficient.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-border" />
            {steps.map((step, i) => (
              <div key={step.num} className="relative text-center group">
                <div className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-5 font-bold text-lg group-hover:scale-110 transition-transform duration-300 shadow-lg relative z-10">
                  {step.num}
                </div>
                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden bg-primary text-primary-foreground rounded-3xl p-12 md:p-16 text-center">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white blur-3xl -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl translate-x-1/4 translate-y-1/4" />
            </div>
            <div className="relative z-10">
              <p className="text-primary-foreground/70 text-sm font-semibold uppercase tracking-widest mb-4">Get Started Today</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-5">Ready to Join Beagvs?</h2>
              <p className="text-xl mb-10 max-w-2xl mx-auto opacity-80">
                Join thousands of buyers and sellers using Beagvs for secure, efficient Pi-powered commerce.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild className="font-bold px-8">
                  <Link href="/marketplace">Start Shopping</Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground hover:text-primary font-bold px-8" asChild>
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
