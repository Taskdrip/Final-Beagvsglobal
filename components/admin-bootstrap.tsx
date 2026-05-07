'use client';

import { useEffect } from 'react';

/**
 * Bootstrap component to ensure admin account exists and is properly configured
 * This runs on app initialization to fix admin access issues
 */
export function AdminBootstrap() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ensureAdminAccount = () => {
      try {
        const stored = localStorage.getItem('beagvs_users');
        const users = stored ? JSON.parse(stored) : [];

        let adminUser = users.find((u: any) => u.email === 'beagvsglobal@gmail.com');

        if (adminUser) {
          // ALWAYS force admin role - critical fix
          console.log('[BEAGVS] Ensuring admin role for beagvsglobal@gmail.com');
          adminUser.role = 'admin';
          adminUser.id = 'admin_1';
          
          const updatedUsers = users.map((u: any) => 
            u.email === 'beagvsglobal@gmail.com' ? adminUser : u
          );
          
          localStorage.setItem('beagvs_users', JSON.stringify(updatedUsers));
          console.log('[BEAGVS] Admin user in database:', adminUser);
          
          // Update current user if logged in as admin
          const currentUser = localStorage.getItem('current_user');
          if (currentUser && currentUser !== 'null') {
            const current = JSON.parse(currentUser);
            if (current.email === 'beagvsglobal@gmail.com') {
              current.role = 'admin';
              current.id = 'admin_1';
              localStorage.setItem('current_user', JSON.stringify(current));
              console.log('[BEAGVS] ✅ Admin role fixed for current session - Role:', current.role);
              // Force page reload to apply admin role
              if (current.role === 'admin' && window.location.pathname === '/dashboard') {
                window.location.reload();
              }
            }
          }
        } else {
          console.log('[BEAGVS] ⚠️ Admin account not found. Use "Reset Admin Account" button to create.');
        }
      } catch (error) {
        console.error('[BEAGVS] Error bootstrapping admin:', error);
      }
    };

    ensureAdminAccount();
  }, []);

  return null;
}
