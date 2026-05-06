"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Package, Truck, CheckCircle2, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/auth-context';
import { redirect, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { ReviewDialog } from '@/components/reviews/review-dialog';

export default function OrdersPage() {
  const { user, isAuthenticated } = useAuth();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      const orderId = searchParams.get('orderId');
      toast.success('Order placed successfully!', {
        description: `Order ${orderId} is being processed.`,
      });
    }
  }, [searchParams]);

  if (!isAuthenticated) {
    redirect('/');
  }

  // Mock orders data
  const orders = [
    {
      id: 'order_1',
      listingTitle: 'Premium Wireless Headphones',
      seller: 'TechStore',
      buyer: 'John Doe',
      status: 'shipped',
      totalPi: 25.5,
      deliveryMethod: 'courier',
      trackingNumber: 'TR123456789',
      date: '2024-01-20',
      estimatedDelivery: '2024-01-25',
    },
    {
      id: 'order_2',
      listingTitle: 'Vintage Leather Backpack',
      seller: 'StyleHub',
      buyer: 'Jane Smith',
      status: 'pending',
      totalPi: 45.0,
      deliveryMethod: 'courier',
      date: '2024-01-22',
      estimatedDelivery: '2024-01-28',
    },
    {
      id: 'order_3',
      listingTitle: 'Smart Home Security Camera',
      seller: 'SmartHome Co',
      buyer: 'Mike Wilson',
      status: 'delivered',
      totalPi: 35.0,
      deliveryMethod: 'local',
      date: '2024-01-18',
      deliveredDate: '2024-01-19',
    },
    {
      id: 'order_4',
      listingTitle: 'Professional Web Design Service',
      seller: 'DesignStudio',
      buyer: 'Sarah Johnson',
      status: 'in_escrow',
      totalPi: 150.0,
      deliveryMethod: 'digital',
      date: '2024-01-23',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle2 className="h-5 w-5 text-primary" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-primary" />;
      case 'pending':
      case 'in_escrow':
        return <Clock className="h-5 w-5 text-muted-foreground" />;
      default:
        return <Package className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge variant="default">Delivered</Badge>;
      case 'shipped':
        return <Badge variant="secondary">Shipped</Badge>;
      case 'in_escrow':
        return <Badge variant="outline">In Escrow</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const activeOrders = orders.filter(o => o.status !== 'delivered');
  const completedOrders = orders.filter(o => o.status === 'delivered');

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <Link href="/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-muted-foreground">
          Track and manage your {user?.role === 'seller' ? 'sales' : 'purchases'}
        </p>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">
            Active Orders ({activeOrders.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedOrders.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeOrders.length === 0 ? (
            <Card className="p-12">
              <div className="text-center">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No active orders</h3>
                <p className="text-muted-foreground mb-4">
                  You don't have any active orders at the moment.
                </p>
                <Button asChild>
                  <Link href="/marketplace">Browse Marketplace</Link>
                </Button>
              </div>
            </Card>
          ) : (
            activeOrders.map(order => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getStatusIcon(order.status)}
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-1">{order.listingTitle}</CardTitle>
                        <CardDescription>
                          Order #{order.id} • Placed on {order.date}
                        </CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">
                        {user?.role === 'seller' ? 'Buyer' : 'Seller'}
                      </p>
                      <p className="font-medium">
                        {user?.role === 'seller' ? order.buyer : order.seller}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Amount</p>
                      <p className="font-medium">{order.totalPi} π</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Delivery</p>
                      <p className="font-medium capitalize">{order.deliveryMethod}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">
                        {order.status === 'shipped' ? 'Est. Delivery' : 'Status'}
                      </p>
                      <p className="font-medium">
                        {order.estimatedDelivery || order.status}
                      </p>
                    </div>
                  </div>

                  {order.trackingNumber && (
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Tracking Number</p>
                      <p className="font-mono text-sm">{order.trackingNumber}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">View Details</Button>
                    {order.status === 'shipped' && user?.role === 'buyer' && (
                      <Button size="sm">Confirm Delivery</Button>
                    )}
                    {order.status === 'pending' && user?.role === 'seller' && (
                      <Button size="sm">Update Status</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedOrders.length === 0 ? (
            <Card className="p-12">
              <div className="text-center">
                <CheckCircle2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No completed orders yet</h3>
                <p className="text-muted-foreground">
                  Your completed orders will appear here.
                </p>
              </div>
            </Card>
          ) : (
            completedOrders.map(order => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getStatusIcon(order.status)}
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-1">{order.listingTitle}</CardTitle>
                        <CardDescription>
                          Order #{order.id} • Delivered on {order.deliveredDate}
                        </CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">
                        {user?.role === 'seller' ? 'Buyer' : 'Seller'}
                      </p>
                      <p className="font-medium">
                        {user?.role === 'seller' ? order.buyer : order.seller}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Amount</p>
                      <p className="font-medium">{order.totalPi} π</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Delivery</p>
                      <p className="font-medium capitalize">{order.deliveryMethod}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Placed</p>
                      <p className="font-medium">{order.date}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">View Details</Button>
                    <Button variant="outline" size="sm">Download Invoice</Button>
                    {user?.role === 'buyer' && (
                      <ReviewDialog
                        listingId={order.id}
                        orderId={order.id}
                        sellerId="seller_1"
                        listingTitle={order.listingTitle}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
