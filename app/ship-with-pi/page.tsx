'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';
import {
  Package, Truck, Plane, Ship, ArrowLeft, MapPin, Weight,
  DollarSign, Calculator, LogIn, Clock, CheckCircle, AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';

const PI_USD_RATE = 0.62;

const shippingOptions = [
  { value: 'local', label: 'Local Delivery', icon: Package, baseRate: 5, description: 'Within city delivery · 1–2 days' },
  { value: 'courier', label: 'Express Courier', icon: Truck, baseRate: 15, description: 'Nationwide delivery · 2–5 days' },
  { value: 'freight', label: 'Freight Shipping', icon: Ship, baseRate: 50, description: 'Heavy cargo · 5–14 days' },
  { value: 'air', label: 'Air Cargo', icon: Plane, baseRate: 100, description: 'International express · 1–3 days' },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: 'Pending', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20', icon: Clock },
  processing: { label: 'Processing', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20', icon: Clock },
  shipped: { label: 'Shipped', color: 'bg-purple-500/10 text-purple-600 border-purple-500/20', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-green-500/10 text-green-600 border-green-500/20', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-500/10 text-red-600 border-red-500/20', icon: AlertCircle },
};

export default function ShipWithPiPage() {
  const { user, isAuthenticated, login } = useAuth();
  const [shippingType, setShippingType] = useState('');
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [weight, setWeight] = useState('');
  const [dimensions, setDimensions] = useState({ length: '', width: '', height: '' });
  const [estimatedCost, setEstimatedCost] = useState({ usd: 0, pi: 0 });
  const [myRequests, setMyRequests] = useState<any[]>([]);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadMyRequests();
    }
  }, [isAuthenticated, user]);

  const loadMyRequests = () => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('shipping_requests');
    if (stored) {
      const all = JSON.parse(stored);
      const mine = all.filter((r: any) => r.userId === user?.id);
      setMyRequests(mine.reverse());
    }
  };

  const calculateCost = () => {
    if (!weight || !shippingType) {
      toast.error('Please enter weight and select a shipping type');
      return;
    }
    const selected = shippingOptions.find(o => o.value === shippingType);
    if (!selected) return;
    const weightNum = parseFloat(weight);
    const costUSD = selected.baseRate + weightNum * 0.5;
    const costPi = costUSD / PI_USD_RATE;
    setEstimatedCost({ usd: costUSD, pi: costPi });
    toast.success('Cost calculated!');
  };

  const handleSubmitRequest = () => {
    if (!isAuthenticated) {
      login();
      return;
    }
    if (!shippingType || !fromLocation || !toLocation || !itemDescription || !weight) {
      toast.error('Please fill in all required fields');
      return;
    }
    const request = {
      id: `ship_${Date.now()}`,
      userId: user?.id,
      username: user?.username,
      shippingType,
      fromLocation,
      toLocation,
      itemDescription,
      weight: parseFloat(weight),
      dimensions,
      costUSD: estimatedCost.usd,
      costPi: estimatedCost.pi,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    const stored = localStorage.getItem('shipping_requests');
    const requests = stored ? JSON.parse(stored) : [];
    requests.push(request);
    localStorage.setItem('shipping_requests', JSON.stringify(requests));
    toast.success('Shipping request submitted! We\'ll be in touch soon.');
    setShippingType('');
    setFromLocation('');
    setToLocation('');
    setItemDescription('');
    setWeight('');
    setDimensions({ length: '', width: '', height: '' });
    setEstimatedCost({ usd: 0, pi: 0 });
    loadMyRequests();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 w-fit">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3">Ship with Pi Network</h1>
          <p className="text-lg text-muted-foreground">
            Fast, reliable shipping services — paid with Pi cryptocurrency
          </p>
        </div>

        {/* Login Banner for unauthenticated users */}
        {!isAuthenticated && (
          <Card className="mb-8 border-primary/30 bg-primary/5">
            <CardContent className="py-6">
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
                <div className="flex items-center gap-3">
                  <LogIn className="h-8 w-8 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Sign in to submit shipping requests</p>
                    <p className="text-sm text-muted-foreground">
                      You can still browse options and calculate costs. Sign in to place a request.
                    </p>
                  </div>
                </div>
                <Button onClick={login} className="flex-shrink-0">
                  Sign In / Sign Up
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Shipping Options */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Available Shipping Options</h2>
            <p className="text-sm text-muted-foreground mb-2">Click an option to select it for your request.</p>
            {shippingOptions.map((option) => {
              const IconComponent = option.icon;
              const isSelected = shippingType === option.value;
              return (
                <Card
                  key={option.value}
                  className={`cursor-pointer transition-all hover:border-primary/60 ${
                    isSelected ? 'border-primary ring-2 ring-primary bg-primary/5' : ''
                  }`}
                  onClick={() => setShippingType(option.value)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <IconComponent className={`h-5 w-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                      {option.label}
                      {isSelected && (
                        <Badge className="ml-auto text-xs">Selected</Badge>
                      )}
                    </CardTitle>
                    <CardDescription>{option.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm font-medium">
                      Base rate:{' '}
                      <span className="text-primary">${option.baseRate} USD</span>
                      <span className="text-muted-foreground ml-1">
                        ({(option.baseRate / PI_USD_RATE).toFixed(2)} Pi)
                      </span>
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Shipping Request Form */}
          <Card>
            <CardHeader>
              <CardTitle>Request Shipping</CardTitle>
              <CardDescription>Fill in details to get a shipping quote</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!shippingType && (
                <p className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-3 py-2 rounded-md border border-amber-200 dark:border-amber-800">
                  Please select a shipping option on the left first.
                </p>
              )}

              <div className="space-y-2">
                <Label htmlFor="from">From Location *</Label>
                <Input
                  id="from"
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  placeholder="City, Country or full address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="to">To Location *</Label>
                <Input
                  id="to"
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                  placeholder="City, Country or full address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Item Description *</Label>
                <Textarea
                  id="description"
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  placeholder="Describe what you're shipping..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg) *</Label>
                <Input
                  id="weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="0.0"
                  step="0.1"
                  min="0.1"
                />
              </div>

              <div>
                <Label className="mb-2 block">Dimensions (cm) — optional</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(['length', 'width', 'height'] as const).map((dim) => (
                    <div key={dim} className="space-y-1">
                      <Label htmlFor={dim} className="text-xs capitalize text-muted-foreground">{dim}</Label>
                      <Input
                        id={dim}
                        type="number"
                        value={dimensions[dim]}
                        onChange={(e) => setDimensions({ ...dimensions, [dim]: e.target.value })}
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={calculateCost} variant="outline" className="w-full bg-transparent">
                <Calculator className="h-4 w-4 mr-2" />
                Calculate Cost
              </Button>

              {estimatedCost.usd > 0 && (
                <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-sm">Estimated Cost</h3>
                  <div className="flex items-end gap-2">
                    <p className="text-2xl font-bold text-primary">{estimatedCost.pi.toFixed(2)} Pi</p>
                    <p className="text-muted-foreground mb-0.5">(${estimatedCost.usd.toFixed(2)} USD)</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Rate: 1 Pi = ${PI_USD_RATE} USD</p>
                </div>
              )}

              <Button onClick={handleSubmitRequest} className="w-full" size="lg">
                {isAuthenticated ? 'Submit Shipping Request' : 'Sign In to Submit Request'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* My Requests */}
        {isAuthenticated && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">My Shipping Requests</h2>
            {myRequests.length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center space-y-2">
                  <Package className="h-10 w-10 mx-auto text-muted-foreground opacity-40" />
                  <p className="text-muted-foreground">You haven&apos;t submitted any shipping requests yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {myRequests.map((req) => {
                  const statusCfg = STATUS_CONFIG[req.status] || STATUS_CONFIG.pending;
                  const StatusIcon = statusCfg.icon;
                  const option = shippingOptions.find(o => o.value === req.shippingType);
                  const OptionIcon = option?.icon || Package;
                  return (
                    <Card key={req.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <OptionIcon className="h-5 w-5 text-muted-foreground" />
                            <CardTitle className="text-base">{option?.label || req.shippingType}</CardTitle>
                          </div>
                          <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border font-medium ${statusCfg.color}`}>
                            <StatusIcon className="h-3 w-3" />
                            {statusCfg.label}
                          </span>
                        </div>
                        <CardDescription className="text-xs">
                          {new Date(req.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{req.fromLocation} → {req.toLocation}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Weight className="h-4 w-4 flex-shrink-0" />
                          <span>{req.weight} kg</span>
                        </div>
                        <p className="text-muted-foreground line-clamp-2">{req.itemDescription}</p>
                        {req.costPi > 0 && (
                          <p className="font-semibold text-primary">{req.costPi.toFixed(2)} Pi · ${req.costUSD.toFixed(2)}</p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <MapPin className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Global Coverage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Ship anywhere in the world with our extensive logistics network
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Weight className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Flexible Options</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                From small packages to heavy freight, we handle all sizes
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <DollarSign className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Pay with Pi</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Secure payments using Pi Network cryptocurrency
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
