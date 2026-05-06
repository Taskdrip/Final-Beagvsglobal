'use client';

import Link from 'next/link';
import { ShoppingBag, Clock, CheckCircle, Heart, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface BuyerDashboardProps {
  username: string;
}

export function BuyerDashboard({ username }: BuyerDashboardProps) {
  const stats = {
    totalOrders: 8,
    pendingDeliveries: 2,
    completedOrders: 6,
    savedItems: 12,
  };

  const recentOrders = [
    {
      id: 'order_1',
      title: 'Premium Wireless Headphones',
      status: 'shipped',
      amount: 45.5,
      date: '2024-01-20',
      trackingNumber: 'TRK123456789',
    },
    {
      id: 'order_2',
      title: 'Vintage Leather Backpack',
      status: 'pending',
      amount: 75.0,
      date: '2024-01-22',
      trackingNumber: null,
    },
    {
      id: 'order_3',
      title: 'Smart Home Security Camera',
      status: 'delivered',
      amount: 65.0,
      date: '2024-01-18',
      trackingNumber: 'TRK987654321',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Buyer Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {username}! Track your orders and discover new items.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">All time purchases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Deliveries</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingDeliveries}</div>
            <p className="text-xs text-muted-foreground">In transit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedOrders}</div>
            <p className="text-xs text-muted-foreground">Successfully delivered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Items</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.savedItems}</div>
            <p className="text-xs text-muted-foreground">In your wishlist</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Explore and manage your purchases</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full justify-start">
              <Link href="/marketplace">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Browse Marketplace
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start bg-transparent">
              <Link href="/dashboard/orders">
                <Clock className="mr-2 h-4 w-4" />
                Track My Orders
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start bg-transparent">
              <Link href="/dashboard/settings">
                <TrendingUp className="mr-2 h-4 w-4" />
                Become a Seller
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
            <CardDescription>Based on your browsing history</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Discover items similar to what you've viewed recently
            </p>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/marketplace?recommended=true">View Recommendations</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Your latest purchases and their status</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm" className="bg-transparent">
              <Link href="/dashboard/orders">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map(order => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium mb-1">{order.title}</h4>
                  <p className="text-sm text-muted-foreground">{order.date}</p>
                  {order.trackingNumber && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Tracking: {order.trackingNumber}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-bold">{order.amount} π</div>
                    <Badge
                      variant={
                        order.status === 'delivered'
                          ? 'default'
                          : order.status === 'shipped'
                          ? 'secondary'
                          : 'outline'
                      }
                      className="capitalize"
                    >
                      {order.status}
                    </Badge>
                  </div>
                  <Button asChild size="sm" variant="ghost">
                    <Link href={`/dashboard/orders/${order.id}`}>View</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
