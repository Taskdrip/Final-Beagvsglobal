'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Package, MapPin, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function TrackShippingPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingData, setTrackingData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = () => {
    if (!trackingNumber.trim()) {
      toast.error('Please enter a tracking number');
      return;
    }

    setLoading(true);

    // Simulate tracking lookup from localStorage
    setTimeout(() => {
      const stored = localStorage.getItem('shipping_orders');
      if (stored) {
        const orders = JSON.parse(stored);
        const found = orders.find((order: any) => 
          order.trackingNumber === trackingNumber || 
          order.orderId === trackingNumber
        );

        if (found) {
          setTrackingData(found);
          toast.success('Shipment found!');
        } else {
          // Generate mock tracking for demo
          setTrackingData({
            trackingNumber: trackingNumber,
            status: 'In Transit',
            carrier: 'Pi Express',
            estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            currentLocation: 'Distribution Center',
            timeline: [
              { status: 'Order Placed', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleString(), completed: true },
              { status: 'Package Picked Up', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleString(), completed: true },
              { status: 'In Transit', date: new Date().toLocaleString(), completed: true },
              { status: 'Out for Delivery', date: 'Pending', completed: false },
              { status: 'Delivered', date: 'Pending', completed: false },
            ]
          });
          toast.info('Showing demo tracking data');
        }
      } else {
        // Generate mock tracking for demo
        setTrackingData({
          trackingNumber: trackingNumber,
          status: 'In Transit',
          carrier: 'Pi Express',
          estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          currentLocation: 'Distribution Center',
          timeline: [
            { status: 'Order Placed', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleString(), completed: true },
            { status: 'Package Picked Up', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleString(), completed: true },
            { status: 'In Transit', date: new Date().toLocaleString(), completed: true },
            { status: 'Out for Delivery', date: 'Pending', completed: false },
            { status: 'Delivered', date: 'Pending', completed: false },
          ]
        });
        toast.info('Showing demo tracking data');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Track Your Shipment</h1>
          <p className="text-muted-foreground">Enter your tracking number to get real-time updates</p>
        </div>

        {/* Search Box */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <Input
                placeholder="Enter tracking number or order ID"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
              />
              <Button onClick={handleTrack} disabled={loading}>
                <Search className="h-4 w-4 mr-2" />
                {loading ? 'Tracking...' : 'Track'}
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
                    <CardTitle>Tracking #{trackingData.trackingNumber}</CardTitle>
                    <CardDescription>Carrier: {trackingData.carrier}</CardDescription>
                  </div>
                  <Badge className="text-lg px-4 py-2">{trackingData.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Current Location</p>
                      <p className="font-medium">{trackingData.currentLocation}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                      <p className="font-medium">{trackingData.estimatedDelivery}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Shipment Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trackingData.timeline.map((event: any, index: number) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className={`mt-1 ${event.completed ? 'text-primary' : 'text-muted-foreground'}`}>
                        {event.completed ? (
                          <CheckCircle className="h-6 w-6" />
                        ) : (
                          <div className="h-6 w-6 rounded-full border-2 border-muted" />
                        )}
                      </div>
                      <div className="flex-1 pb-4 border-b last:border-0">
                        <p className={`font-medium ${event.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {event.status}
                        </p>
                        <p className="text-sm text-muted-foreground">{event.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Help Section */}
        {!trackingData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Need Help?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Tracking numbers are usually 10-20 characters long</p>
              <p>• You can also use your order ID to track shipments</p>
              <p>• Tracking information updates every few hours</p>
              <p>• Contact support if you can't find your shipment</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
