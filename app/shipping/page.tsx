import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Truck, Plane, Home, CheckCircle2 } from 'lucide-react';

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">How It Works</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Learn how Beagvs makes buying, selling, and shipping simple, secure, and transparent from start to finish.
        </p>
      </div>

      {/* Process Steps */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">The Beagvs Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <CardTitle>Browse & Select</CardTitle>
              <CardDescription>
                Explore our marketplace and find the perfect item or service. Filter by category, price, and delivery method.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <CardTitle>Secure Payment</CardTitle>
              <CardDescription>
                Pay with Pi Network. Your payment is held securely in escrow until delivery is confirmed.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <CardTitle>Ship & Track</CardTitle>
              <CardDescription>
                Seller ships the item using your chosen delivery method. Track your order in real-time.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">4</span>
              </div>
              <CardTitle>Confirm & Release</CardTitle>
              <CardDescription>
                Confirm delivery and the escrow automatically releases payment to the seller. Simple and secure.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Delivery Options */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Delivery Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Home className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Local Pickup</CardTitle>
              <CardDescription>
                Meet the seller in person and inspect the item before confirming. Perfect for large items or local buyers who want immediate possession.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  No shipping fees
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Instant inspection
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Same-day completion
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Package className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Courier Service</CardTitle>
              <CardDescription>
                Standard delivery for small to medium packages. Door-to-door service with tracking and signature confirmation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  3-7 business days
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Real-time tracking
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Insurance included
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Truck className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Freight Shipping</CardTitle>
              <CardDescription>
                For large, heavy, or bulk items. Professional freight carriers handle pickup, transport, and delivery with care.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Large item support
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  White glove service
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Schedule delivery
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Plane className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Digital Delivery</CardTitle>
              <CardDescription>
                For digital services and products. Instant delivery via download link or online access upon payment confirmation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Instant delivery
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  No shipping costs
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Secure access
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Escrow Protection */}
      <div>
        <h2 className="text-3xl font-bold mb-8 text-center">Escrow Protection</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">How Escrow Works</h3>
                <ol className="space-y-3 text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="font-semibold text-foreground">1.</span>
                    Buyer pays with Pi Network and funds are held in escrow
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-foreground">2.</span>
                    Seller receives notification and ships the item
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-foreground">3.</span>
                    Buyer receives item and confirms delivery
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-foreground">4.</span>
                    Escrow releases payment to seller automatically
                  </li>
                </ol>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Your Protection</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    Funds are secure until delivery confirmation
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    Dispute resolution available if issues arise
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    Full refund if item not received or as described
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    Admin oversight on all high-value transactions
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
