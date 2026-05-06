'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth-context';

/**
 * Emergency admin reset button - only visible on dashboard for admins
 * Creates/fixes the admin account: beagvsglobal@gmail.com / TRInity.123
 */
export function AdminResetButton() {
  const [showButton, setShowButton] = useState(false);
  const auth = useAuth();

  useEffect(() => {
    // Only show on /dashboard routes for authenticated users or admins
    if (typeof window !== 'undefined') {
      const isOnDashboard = window.location.pathname.startsWith('/dashboard');
      const isAdminOrAuthUser = auth?.user?.role === 'admin' || auth?.user?.email === 'beagvsglobal@gmail.com';
      setShowButton(isOnDashboard && isAdminOrAuthUser);
    }
  }, [auth]);
  const handleResetAdmin = () => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem('beagvs_users');
      let users = stored ? JSON.parse(stored) : [];

      // Remove any existing admin account
      users = users.filter((u: any) => u.email !== 'beagvsglobal@gmail.com');

      // Create fresh admin account
      const adminUser = {
        id: 'admin_1',
        piUserId: 'pi_admin_beagvs',
        username: 'beagvsglobal',
        email: 'beagvsglobal@gmail.com',
        password: 'hashed_trinity123', // Pre-hashed for TRInity.123
        role: 'admin',
        isPremium: true,
        listingsThisMonth: 0,
        profilePicture: undefined,
        bio: 'Beagvs Platform Administrator',
        website: 'https://beagvs.com',
        piWalletAddress: 'ADMIN_WALLET_BEAGVS_GLOBAL',
        socialLinks: {},
        followers: [],
        following: [],
        totalPoints: 1000,
        pointsActivities: [{
          type: 'account_creation',
          points: 1000,
          timestamp: new Date().toISOString(),
        }],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      users.push(adminUser);
      localStorage.setItem('beagvs_users', JSON.stringify(users));

      console.log('[BEAGVS] Admin account reset successful');
      console.log('[BEAGVS] Email: beagvsglobal@gmail.com');
      console.log('[BEAGVS] Password: TRInity.123');
      console.log('[BEAGVS] Role: admin');

      toast.success('Admin account reset successfully! Please login with: beagvsglobal@gmail.com / TRInity.123');
      
      // Refresh page to apply changes
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('[BEAGVS] Error resetting admin:', error);
      toast.error('Failed to reset admin account');
    }
  };

  if (!showButton) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={handleResetAdmin}
        variant="outline"
        size="sm"
        className="gap-2 bg-background/80 backdrop-blur"
      >
        <Shield className="h-4 w-4" />
        Reset Admin Account
      </Button>
    </div>
  );
}
