"use client";

import { useAuth } from '@/contexts/auth-context';
import { redirect } from 'next/navigation';
import { AdminDashboard } from '@/components/dashboard/admin-dashboard';
import { SellerDashboard } from '@/components/dashboard/seller-dashboard';
import { BuyerDashboard } from '@/components/dashboard/buyer-dashboard';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    redirect('/');
  }

  if (!user) {
    return null;
  }

  // Render role-specific dashboard
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

  // Default to buyer dashboard
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <BuyerDashboard username={user.username} />
    </div>
  );
}
