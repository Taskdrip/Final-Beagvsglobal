"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/lib/database-types';
import { AuthModal } from '@/components/auth/auth-modal';
import { SecureStorage } from '@/lib/secure-storage';
import { PiNetworkIntegration } from '@/lib/pi-network-integration';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authMessage: string;
  error: string | null;
  login: () => void;
  logout: () => void;
  updateUserRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const hashPassword = (password: string): string => {
    return SecureStorage.hashPassword(password);
  };

  useEffect(() => {
    setIsLoading(true);
    
    const backupPrefix = 'beagvs_backup_';
    ['beagvs_users', 'current_user', 'feed_posts', 'task_submissions', 'earn_tasks', 'marketplace_listings'].forEach(key => {
      const current = localStorage.getItem(key);
      const backup = localStorage.getItem(`${backupPrefix}${key}`);
      if ((!current || current === '[]' || current === 'null') && backup) {
        console.log(`[v0] Restoring ${key} from backup on mount`);
        localStorage.setItem(key, backup);
      }
    });
    
    const storedUser = localStorage.getItem('current_user');
    if (storedUser && storedUser !== 'null') {
      try {
        const userData = JSON.parse(storedUser);
        
        const allUsers = localStorage.getItem('beagvs_users');
        if (allUsers) {
          const users = JSON.parse(allUsers);
          const latestUserData = users.find((u: any) => u.id === userData.id);
          if (latestUserData) {
            setUser(latestUserData);
            console.log('[BEAGVS] Restored user session with latest data:', latestUserData.username);
          } else {
            setUser(userData);
            console.log('[BEAGVS] Restored user session:', userData.username);
          }
        } else {
          setUser(userData);
          console.log('[BEAGVS] Restored user session:', userData.username);
        }
      } catch (error) {
        console.error('[BEAGVS] Failed to restore session:', error);
        localStorage.removeItem('current_user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = () => {
    setShowAuthModal(true);
  };

  const ADMIN_EMAIL = 'beagvsglobal@gmail.com';
  const ADMIN_PASSWORDS = ['BEAGVSglobal.2024#', 'TRInity.123'];

  const isAdminCredentials = (email: string, password: string) =>
    email === ADMIN_EMAIL && ADMIN_PASSWORDS.includes(password);

  const handleAuthSuccess = (userData: { email: string; password: string; username: string; role: UserRole; isNewUser?: boolean }) => {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem('beagvs_users');
      const users = stored ? JSON.parse(stored) : [];
      
      let existingUser = users.find((u: any) => u.email === userData.email);
      
      if (existingUser) {
        const hashedInput = hashPassword(userData.password);
        const passwordMatch =
          existingUser.password === hashedInput ||
          existingUser.password === userData.password ||
          isAdminCredentials(userData.email, userData.password);
        
        if (passwordMatch) {
          existingUser.updatedAt = new Date();
          if (existingUser.password === userData.password) {
            existingUser.password = hashedInput;
          }
          if (existingUser.email === ADMIN_EMAIL) {
            existingUser.role = 'admin';
          }
          localStorage.setItem('beagvs_users', JSON.stringify(users));
          localStorage.setItem('current_user', JSON.stringify(existingUser));
          
          const backupPrefix = 'beagvs_backup_';
          ['feed_posts', 'task_submissions', 'earn_tasks'].forEach(key => {
            const current = localStorage.getItem(key);
            const backup = localStorage.getItem(`${backupPrefix}${key}`);
            if ((!current || current === '[]') && backup) {
              localStorage.setItem(key, backup);
            }
          });
          
          setUser(existingUser);
          setShowAuthModal(false);
          toast.success(`Welcome back, ${existingUser.username}!`);
          
          PiNetworkIntegration.connectToFireside(existingUser.id, existingUser.username);
          PiNetworkIntegration.syncPiUsername(existingUser.id, existingUser.username);
          
          console.log('[v0] User logged in with role:', existingUser.role);
        } else {
          toast.error('Incorrect password. Please try again.');
          return;
        }
      } else {
        const userId = userData.email === ADMIN_EMAIL ? 'admin_1' : 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        const isAdmin = isAdminCredentials(userData.email, userData.password);
        const newUser: User = {
          id: userId,
          piUserId: 'pi_' + Math.random().toString(36).substr(2, 9),
          username: userData.username || userData.email.split('@')[0],
          email: userData.email,
          password: hashPassword(userData.password),
          role: isAdmin ? 'admin' : userData.role,
          isPremium: false,
          listingsThisMonth: 0,
          profilePicture: undefined,
          bio: undefined,
          website: undefined,
          socialLinks: {},
          followers: [],
          following: [],
          totalPoints: 3,
          pointsActivities: [{
            type: 'account_creation',
            points: 3,
            timestamp: new Date().toISOString(),
          }],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        users.push(newUser);
        localStorage.setItem('beagvs_users', JSON.stringify(users));
        localStorage.setItem('current_user', JSON.stringify(newUser));
        
        const backupPrefix = 'beagvs_backup_';
        ['feed_posts', 'task_submissions', 'earn_tasks'].forEach(key => {
          const current = localStorage.getItem(key);
          const backup = localStorage.getItem(`${backupPrefix}${key}`);
          if ((!current || current === '[]') && backup) {
            localStorage.setItem(key, backup);
          }
        });
        
        setUser(newUser);
        setShowAuthModal(false);
        toast.success(`Welcome to Beagvs, ${newUser.username}! 🎉`);
      }
    } catch (e) {
      console.error('[v0] Auth error:', e);
      toast.error('Something went wrong. Please try again.');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('piAccessToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userPassword');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('current_user');
  };

  const updateUserRole = (role: UserRole) => {
    if (user && typeof window !== 'undefined') {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      localStorage.setItem('userRole', role);
      localStorage.setItem('current_user', JSON.stringify(updatedUser));
      
      const stored = localStorage.getItem('beagvs_users');
      if (stored) {
        const users = JSON.parse(stored);
        const updatedUsers = users.map((u: any) => u.id === user.id ? updatedUser : u);
        localStorage.setItem('beagvs_users', JSON.stringify(updatedUsers));
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        authMessage: '',
        error: null,
        login,
        logout,
        updateUserRole,
      }}
    >
      {children}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
        onPiAuth={login}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error('[v0] useAuth must be used within an AuthProvider');
    return {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      authMessage: '',
      error: 'Auth context not available',
      login: () => {},
      logout: () => {},
      updateUserRole: () => {},
    };
  }
  return context;
}
