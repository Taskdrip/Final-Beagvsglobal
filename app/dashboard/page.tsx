"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { AdminDashboard } from '@/components/dashboard/admin-dashboard';
import { SellerDashboard } from '@/components/dashboard/seller-dashboard';
import { BuyerDashboard } from '@/components/dashboard/buyer-dashboard';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated || !user) {
    return null;
  }

  if (user.role === 'admin') {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <AdminDashboard />
      </div>
    );
  }

  if (user.role === 'seller') {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <SellerDashboard username={user.username} />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <BuyerDashboard username={user.username} />
    </div>
  );
}
