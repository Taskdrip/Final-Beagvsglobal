"use client";

import { useState } from 'react';
import { Package, Search, MapPin, Clock, CheckCircle2, Truck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function TrackingPage() {
  const [trackingId, setTrackingId] = useState('');
  const [trackingData, setTrackingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTrack = () => {
    if (!trackingId.trim()) {
      toast.error('Please enter a tracking ID');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Mock tracking data
      const mockData = {
        trackingId: trackingId,
        orderId: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        status: 'in_transit',
        estimatedDelivery: '2024-02-05',
        currentLocation: 'Distribution Center - New York',
        history: [
          {
            status: 'Order Placed',
            location: 'Beagvs Marketplace',
            timestamp: '2024-01-28 10:30 AM',
            notes: 'Order confirmed and being processed',
          },
          {
            status: 'Processing',
            location: 'Seller Warehouse - Los Angeles',
            timestamp: '2024-01-28 2:15 PM',
            notes: 'Item packed and ready for shipment',
          },
          {
            status: 'Shipped',
            location: 'Origin Facility - Los Angeles',
            timestamp: '2024-01-29 8:00 AM',
            notes: 'Package picked up by carrier',
          },
          {
            status: 'In Transit',
            location: 'Distribution Center - Phoenix',
            timestamp: '2024-01-30 3:45 PM',
            notes: 'Package in transit to destination',
          },
          {
            status: 'In Transit',
            location: 'Distribution Center - New York',
            timestamp: '2024-01-31 11:20 AM',
            notes: 'Package arrived at regional hub',
          },
        ],
      };

      setTrackingData(mockData);
      setIsLoading(false);
      toast.success('Tracking information found');
    }, 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'order placed':
      case 'processing':
        return <Package className="h-5 w-5" />;
      case 'shipped':
      case 'in transit':
        return <Truck className="h-5 w-5" />;
      case 'delivered':
        return <CheckCircle2 className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'default';
      case 'in transit':
      case 'shipped':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-3">Track Your Shipment</h1>
        <p className="text-muted-foreground text-lg">
          Enter your tracking ID to view real-time shipment status
        </p>
      </div>

      {/* Tracking Input */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="trackingId" className="sr-only">
                Tracking ID
              </Label>
              <Input
                id="trackingId"
                placeholder="Enter tracking ID (e.g., TRACK123456)"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                className="h-12 text-lg"
              />
            </div>
            <Button onClick={handleTrack} disabled={isLoading} size="lg" className="md:w-auto">
              <Search className="mr-2 h-4 w-4" />
              {isLoading ? 'Tracking...' : 'Track Package'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tracking Results */}
      {trackingData && (
        <div className="space-y-6">
          {/* Status Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Shipment Status</CardTitle>
                  <CardDescription className="mt-1">
                    Order ID: {trackingData.orderId}
                  </CardDescription>
                </div>
                <Badge variant={getStatusColor(trackingData.status)} className="capitalize text-sm">
                  {trackingData.status.replace('_', ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm font-medium">Current Location</span>
                  </div>
                  <p className="font-medium">{trackingData.currentLocation}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">Estimated Delivery</span>
                  </div>
                  <p className="font-medium">{trackingData.estimatedDelivery}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tracking Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Tracking History</CardTitle>
              <CardDescription>Detailed shipment journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

                {/* Timeline Items */}
                <div className="space-y-6">
                  {trackingData.history.map((event: any, index: number) => (
                    <div key={index} className="relative flex gap-4">
                      {/* Timeline Dot */}
                      <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-background border-2 border-primary">
                        {getStatusIcon(event.status)}
                      </div>

                      {/* Event Details */}
                      <div className="flex-1 pt-1.5">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-semibold">{event.status}</h4>
                          <span className="text-sm text-muted-foreground">{event.timestamp}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{event.location}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{event.notes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Need Help Card */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold mb-1">Need Help with Your Shipment?</h3>
                  <p className="text-sm text-muted-foreground">
                    Contact our support team for assistance
                  </p>
                </div>
                <Button variant="outline" className="bg-transparent md:w-auto w-full">
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* No Results Yet */}
      {!trackingData && !isLoading && (
        <Card className="text-center p-12">
          <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">Track Your Package</h3>
          <p className="text-muted-foreground">
            Enter your tracking ID above to view real-time shipping updates
          </p>
        </Card>
      )}
    </div>
  );
}
