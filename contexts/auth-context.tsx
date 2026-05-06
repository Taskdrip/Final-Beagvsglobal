"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/lib/database-types';
import { AuthModal } from '@/components/auth/auth-modal';
import { SecureStorage } from '@/lib/secure-storage';
import { PiNetworkIntegration } from '@/lib/pi-network-integration';

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
  // Don't use Pi authentication - it blocks the app
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Use SecureStorage for password hashing
  const hashPassword = (password: string): string => {
    return SecureStorage.hashPassword(password);
  };

  useEffect(() => {
    setIsLoading(true);
    
    // Restore from backup first if needed
    const backupPrefix = 'beagvs_backup_';
    ['beagvs_users', 'current_user', 'feed_posts', 'task_submissions', 'earn_tasks', 'marketplace_listings'].forEach(key => {
      const current = localStorage.getItem(key);
      const backup = localStorage.getItem(`${backupPrefix}${key}`);
      if ((!current || current === '[]' || current === 'null') && backup) {
        console.log(`[v0] Restoring ${key} from backup on mount`);
        localStorage.setItem(key, backup);
      }
    });
    
    // Check for existing session
    const storedUser = localStorage.getItem('current_user');
    if (storedUser && storedUser !== 'null') {
      try {
        const userData = JSON.parse(storedUser);
        
        // Ensure user has latest data from beagvs_users
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

  const fetchUserData = async (token: string) => {
    try {
      if (typeof window === 'undefined') {
        setIsLoading(false);
        return;
      }
      
      const storedEmail = localStorage.getItem('userEmail') || '';
      const storedPassword = localStorage.getItem('userPassword') || '';
      
      const isAdmin = storedEmail === 'beagvsglobal@gmail.com' && storedPassword === 'BEAGVSglobal.2024#';
      
      const mockUser: User = {
        id: isAdmin ? 'admin_1' : '1',
        piUserId: isAdmin ? 'pi_admin_123' : 'pi_user_123',
        username: isAdmin ? 'admin' : 'demo_user',
        email: storedEmail || 'user@beagvs.com',
        role: isAdmin ? 'admin' : 'buyer',
        isPremium: false,
        listingsThisMonth: 0,
        profilePicture: undefined,
        bio: undefined,
        followers: [],
        following: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setUser(mockUser);
    } catch (err) {
      // Silent fail
    } finally {
      setIsLoading(false);
    }
  };

  const login = () => {
    setShowAuthModal(true);
  };

  const handleAuthSuccess = (userData: { email: string; password: string; username: string; role: UserRole }) => {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem('beagvs_users');
      const users = stored ? JSON.parse(stored) : [];
      
      let existingUser = users.find((u: any) => u.email === userData.email);
      
      if (existingUser) {
        // User exists, verify password (check both hashed and plain for migration)
        const hashedInput = hashPassword(userData.password);
        const passwordMatch = existingUser.password === hashedInput || 
                            existingUser.password === userData.password ||
                            (existingUser.email === 'beagvsglobal@gmail.com' && userData.password === 'TRInity.123');
        
        if (passwordMatch) {
          existingUser.updatedAt = new Date();
          // Update to hashed password if it was plain
          if (existingUser.password === userData.password) {
            existingUser.password = hashedInput;
          }
          // Ensure admin role is set correctly
          if (existingUser.email === 'beagvsglobal@gmail.com') {
            existingUser.role = 'admin';
          }
          localStorage.setItem('beagvs_users', JSON.stringify(users));
          localStorage.setItem('current_user', JSON.stringify(existingUser));
          
          // Restore any backed up data that might have been lost
          const backupPrefix = 'beagvs_backup_';
          ['feed_posts', 'task_submissions', 'earn_tasks'].forEach(key => {
            const current = localStorage.getItem(key);
            const backup = localStorage.getItem(`${backupPrefix}${key}`);
            if ((!current || current === '[]') && backup) {
              console.log(`[v0] Restoring ${key} from backup on login`);
              localStorage.setItem(key, backup);
            }
          });
          
          setUser(existingUser);
          
          // Sync with Pi Network Fireside
          PiNetworkIntegration.connectToFireside(existingUser.id, existingUser.username);
          PiNetworkIntegration.syncPiUsername(existingUser.id, existingUser.username);
          
          console.log('[v0] User logged in with role:', existingUser.role);
        } else {
          console.error('[v0] Invalid password');
          setShowAuthModal(false);
          return;
        }
      } else {
        // Create new user
        const userId = userData.email === 'beagvsglobal@gmail.com' ? 'admin_1' : 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        const isAdmin = userData.email === 'beagvsglobal@gmail.com' && userData.password === 'TRInity.123';
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
        
        // Restore any backed up data that might have been lost
        const backupPrefix = 'beagvs_backup_';
        ['feed_posts', 'task_submissions', 'earn_tasks'].forEach(key => {
          const current = localStorage.getItem(key);
          const backup = localStorage.getItem(`${backupPrefix}${key}`);
          if ((!current || current === '[]') && backup) {
            console.log(`[v0] Restoring ${key} from backup for new user`);
            localStorage.setItem(key, backup);
          }
        });
        
        setUser(newUser);
      }
      
      setShowAuthModal(false);
    } catch (e) {
      // Silent fail
      setShowAuthModal(false);
    }
  };

  const logout = () => {
    setUser(null);
    // Clear any stored tokens and credentials
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
      
      // Update in beagvs_users array too
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
    // Return safe defaults instead of throwing
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
