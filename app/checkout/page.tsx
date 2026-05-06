"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/cart-context';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';
import { DeliveryMethod } from '@/lib/database-types';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPi, clearCart } = useCart();
  const { user, isAuthenticated, login } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  // Form state
  const [shippingAddress, setShippingAddress] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('courier');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-16">
        <Card className="p-12">
          <div className="text-center space-y-4">
            <Shield className="h-16 w-16 text-primary mx-auto" />
            <h2 className="text-2xl font-bold">Sign In Required</h2>
            <p className="text-muted-foreground">
              Please sign in with your Pi Network account to continue with checkout.
            </p>
            <Button onClick={login} size="lg">
              Sign In with Pi Network
            </Button>
            <div className="pt-4">
              <Link href="/cart" className="text-sm text-muted-foreground hover:text-foreground">
                Return to cart
              </Link>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-16">
        <Card className="p-12">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Your cart is empty</h2>
            <p className="text-muted-foreground">
              Add items to your cart before checking out.
            </p>
            <Button asChild size="lg">
              <Link href="/marketplace">Browse Marketplace</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const handleCheckout = async () => {
    if (!shippingAddress.trim()) {
      toast.error('Please provide a shipping address');
      return;
    }

    if (!phone.trim()) {
      toast.error('Please provide a contact phone number');
      return;
    }

    setIsProcessing(true);

    try {
      // In production, this would call your Pi Network payment API
      // and create the order with escrow
      console.log('[v0] Processing Pi Network payment...', {
        userId: user?.id,
        totalPi,
        items: items.map(item => ({
          listingId: item.listing.id,
          quantity: item.quantity,
          price: item.listing.priceInPi,
        })),
        shippingAddress,
        deliveryMethod,
        phone,
        notes,
      });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock successful payment
      const orderId = `order_${Date.now()}`;
      const escrowId = `escrow_${Date.now()}`;

      console.log('[v0] Order created:', { orderId, escrowId });

      toast.success('Order placed successfully!', {
        description: 'Your payment is securely held in escrow.',
      });

      clearCart();
      router.push(`/dashboard/orders?success=true&orderId=${orderId}`);
    } catch (error) {
      console.error('[v0] Checkout error:', error);
      toast.error('Failed to process payment', {
        description: 'Please try again or contact support.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link href="/cart" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </Link>
        <h1 className="text-3xl font-bold">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="md:col-span-2 space-y-6">
          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
              <CardDescription>
                Provide your delivery details for order fulfillment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Shipping Address *</Label>
                <Input
                  id="address"
                  placeholder="Enter your full shipping address"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Contact Phone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Order Notes (Optional)</Label>
                <Input
                  id="notes"
                  placeholder="Add any special instructions"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Delivery Method */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Method</CardTitle>
              <CardDescription>
                Choose how you would like to receive your items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={deliveryMethod} onValueChange={(value) => setDeliveryMethod(value as DeliveryMethod)}>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="courier" id="courier" />
                  <Label htmlFor="courier" className="flex-1 cursor-pointer">
                    <div className="font-medium">Courier Service</div>
                    <div className="text-sm text-muted-foreground">3-7 business days</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="local" id="local" />
                  <Label htmlFor="local" className="flex-1 cursor-pointer">
                    <div className="font-medium">Local Pickup</div>
                    <div className="text-sm text-muted-foreground">Arrange with seller</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="freight" id="freight" />
                  <Label htmlFor="freight" className="flex-1 cursor-pointer">
                    <div className="font-medium">Freight Shipping</div>
                    <div className="text-sm text-muted-foreground">For large items</div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>
                Secure payment powered by Pi Network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <Shield className="h-8 w-8 text-primary" />
                <div className="flex-1">
                  <div className="font-medium">Pi Network Payment</div>
                  <div className="text-sm text-muted-foreground">
                    Your payment will be held securely in escrow
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="md:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {items.map(item => (
                  <div key={item.listing.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.listing.title} × {item.quantity}
                    </span>
                    <span className="font-medium">
                      {(item.listing.priceInPi * item.quantity).toFixed(2)} π
                    </span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{totalPi.toFixed(2)} π</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Escrow Fee</span>
                  <span className="font-medium">0.00 π</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="font-medium">TBD</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{totalPi.toFixed(2)} π</span>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={isProcessing}
                size="lg"
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Place Order'
                )}
              </Button>

              <div className="space-y-2 text-xs text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Shield className="h-3 w-3" />
                  Payment held in escrow until delivery
                </p>
                <p>By placing your order, you agree to our Terms & Conditions.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
