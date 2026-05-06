'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/auth-context';
import { Package, Truck, Plane, Ship, ArrowLeft, MapPin, Weight, DollarSign, Calculator } from 'lucide-react';
import { toast } from 'sonner';

const PI_USD_RATE = 0.62; // Current Pi to USD exchange rate

export default function ShipWithPiPage() {
  const { user, isAuthenticated } = useAuth();
  const [shippingType, setShippingType] = useState('');
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [weight, setWeight] = useState('');
  const [dimensions, setDimensions] = useState({ length: '', width: '', height: '' });
  const [estimatedCost, setEstimatedCost] = useState({ usd: 0, pi: 0 });

  const shippingOptions = [
    { value: 'local', label: 'Local Delivery', icon: Package, baseRate: 5, description: 'Within city delivery - 1-2 days' },
    { value: 'courier', label: 'Express Courier', icon: Truck, baseRate: 15, description: 'Nationwide delivery - 2-5 days' },
    { value: 'freight', label: 'Freight Shipping', icon: Ship, baseRate: 50, description: 'Heavy cargo - 5-14 days' },
    { value: 'air', label: 'Air Cargo', icon: Plane, baseRate: 100, description: 'International express - 1-3 days' },
  ];

  const calculateCost = () => {
    if (!weight || !shippingType) {
      toast.error('Please enter weight and select shipping type');
      return;
    }

    const selectedOption = shippingOptions.find(opt => opt.value === shippingType);
    if (!selectedOption) return;

    const weightNum = parseFloat(weight);
    const baseRate = selectedOption.baseRate;
    const costUSD = baseRate + (weightNum * 0.5); // $0.50 per kg
    const costPi = costUSD / PI_USD_RATE;

    setEstimatedCost({ usd: costUSD, pi: costPi });
  };

  const handleSubmitRequest = () => {
    if (!isAuthenticated) {
      toast.error('Please login to submit shipping request');
      return;
    }

    if (!shippingType || !fromLocation || !toLocation || !itemDescription || !weight) {
      toast.error('Please fill in all required fields');
      return;
    }

    const shippingRequest = {
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

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('shipping_requests');
      const requests = stored ? JSON.parse(stored) : [];
      requests.push(shippingRequest);
      localStorage.setItem('shipping_requests', JSON.stringify(requests));
      
      toast.success('Shipping request submitted successfully!');
      
      // Reset form
      setShippingType('');
      setFromLocation('');
      setToLocation('');
      setItemDescription('');
      setWeight('');
      setDimensions({ length: '', width: '', height: '' });
      setEstimatedCost({ usd: 0, pi: 0 });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Ship with Pi Network</h1>
          <p className="text-lg text-muted-foreground">
            Fast, reliable shipping services paid with Pi cryptocurrency
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Shipping Options */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">Available Shipping Options</h2>
            {shippingOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <Card 
                  key={option.value}
                  className={`cursor-pointer transition-all ${shippingType === option.value ? 'border-primary ring-2 ring-primary' : ''}`}
                  onClick={() => setShippingType(option.value)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <IconComponent className="h-5 w-5" />
                      {option.label}
                    </CardTitle>
                    <CardDescription>{option.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Base rate: ${option.baseRate} USD ({(option.baseRate / PI_USD_RATE).toFixed(2)} Pi)
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
              <div className="space-y-2">
                <Label htmlFor="from">From Location *</Label>
                <Input
                  id="from"
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  placeholder="Pickup address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="to">To Location *</Label>
                <Input
                  id="to"
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                  placeholder="Delivery address"
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
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="length">Length (cm)</Label>
                  <Input
                    id="length"
                    type="number"
                    value={dimensions.length}
                    onChange={(e) => setDimensions({ ...dimensions, length: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="width">Width (cm)</Label>
                  <Input
                    id="width"
                    type="number"
                    value={dimensions.width}
                    onChange={(e) => setDimensions({ ...dimensions, width: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={dimensions.height}
                    onChange={(e) => setDimensions({ ...dimensions, height: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>

              <Button onClick={calculateCost} variant="outline" className="w-full bg-transparent">
                <Calculator className="h-4 w-4 mr-2" />
                Calculate Cost
              </Button>

              {estimatedCost.usd > 0 && (
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Estimated Cost:</h3>
                  <div className="space-y-1">
                    <p className="text-lg font-bold">{estimatedCost.pi.toFixed(2)} Pi</p>
                    <p className="text-sm text-muted-foreground">${estimatedCost.usd.toFixed(2)} USD</p>
                    <p className="text-xs text-muted-foreground">Rate: 1 Pi = ${PI_USD_RATE} USD</p>
                  </div>
                </div>
              )}

              <Button onClick={handleSubmitRequest} className="w-full">
                Submit Shipping Request
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Information Section */}
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
