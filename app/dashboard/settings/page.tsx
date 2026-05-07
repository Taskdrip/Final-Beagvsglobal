"use client";

import React from "react";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, User, Wallet, Camera, Globe, Twitter, Facebook, Instagram, Linkedin, Save, Shield, Copy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { user, isAuthenticated } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [website, setWebsite] = useState(user?.website || '');
  const [piWallet, setPiWallet] = useState(user?.piWalletAddress || '');
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '');
  const router = useRouter(); // Declare router
  
  // Social links
  const [twitter, setTwitter] = useState(user?.socialLinks?.twitter || '');
  const [facebook, setFacebook] = useState(user?.socialLinks?.facebook || '');
  const [instagram, setInstagram] = useState(user?.socialLinks?.instagram || '');
  const [linkedin, setLinkedin] = useState(user?.socialLinks?.linkedin || '');
  const [userRole, setUserRole] = useState(user?.role || 'buyer');
  
  // Verification dialog state
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [adminWallet, setAdminWallet] = useState('GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
  const [transactionHash, setTransactionHash] = useState('');
  const [paymentProof, setPaymentProof] = useState('');

  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
      setBio(user.bio || '');
      setWebsite(user.website || '');
      setPiWallet(user.piWalletAddress || '');
      setProfilePicture(user.profilePicture || '');
      setTwitter(user.socialLinks?.twitter || '');
      setFacebook(user.socialLinks?.facebook || '');
      setInstagram(user.socialLinks?.instagram || '');
      setLinkedin(user.socialLinks?.linkedin || '');
      setUserRole(user.role || 'buyer');
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const handleSaveProfile = () => {
    if (!user) return;

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('beagvs_users');
      if (stored) {
        try {
          const users = JSON.parse(stored);
          const updatedUsers = users.map((u: any) => 
            u.id === user.id 
              ? {
                  ...u,
                  username,
                  email,
                  bio,
                  website,
                  avatar: profilePicture,
                  profilePicture: profilePicture,
                  profileImage: profilePicture,
                  role: userRole,
                  piWalletAddress: piWallet,
                  socialLinks: { twitter, facebook, instagram, linkedin },
                  updatedAt: new Date(),
                }
              : u
          );
          localStorage.setItem('beagvs_users', JSON.stringify(updatedUsers));
          
          // Update auth context storage
          const currentUserData = updatedUsers.find((u: any) => u.id === user.id);
          if (currentUserData) {
            localStorage.setItem('current_user', JSON.stringify(currentUserData));
            
            // Force immediate backup
            localStorage.setItem('beagvs_backup_beagvs_users', JSON.stringify(updatedUsers));
            localStorage.setItem('beagvs_backup_current_user', JSON.stringify(currentUserData));
            
            console.log('[v0] Updated and backed up current_user:', currentUserData);
          }
          
          toast.success('Profile updated successfully!');
          
          // Stay on settings page - no navigation needed
          // Data is already updated in localStorage
        } catch (e) {
          console.error('[v0] Error saving profile:', e);
          toast.error('Failed to update profile');
        }
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVerificationRequest = () => {
    if (!user) return;

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('beagvs_users');
      if (stored) {
        try {
          const users = JSON.parse(stored);
          const updatedUsers = users.map((u: any) =>
            u.id === user.id
              ? {
                  ...u,
                  verified: true,
                  updatedAt: new Date(),
                }
              : u
          );
          localStorage.setItem('beagvs_users', JSON.stringify(updatedUsers));
          localStorage.setItem('current_user', JSON.stringify(
            updatedUsers.find((u: any) => u.id === user.id)
          ));
          toast.success('Verification request submitted!');
          setShowVerificationDialog(false);
        } catch (e) {
          console.error('[v0] Error submitting verification request:', e);
          toast.error('Failed to submit verification request');
        }
      }
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <Link href={`/profile/${user?.username}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Profile
        </Link>
        <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile, wallet, and social links
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Picture */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Profile Picture
            </CardTitle>
            <CardDescription>
              Upload a profile picture to personalize your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`} />
                <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="profile-upload"
                />
                <label htmlFor="profile-upload">
                  <Button variant="outline" asChild className="cursor-pointer bg-transparent">
                    <span>
                      <Camera className="h-4 w-4 mr-2" />
                      Change Picture
                    </span>
                  </Button>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Update your personal information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Account Type</Label>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <div className="font-medium">
                    {userRole === 'seller' ? 'Seller Account' : 'Buyer Account'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {userRole === 'seller' 
                      ? 'You can list products and services for sale' 
                      : 'Switch to seller to list products'
                    }
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="bg-transparent"
                  onClick={() => {
                    const newRole = userRole === 'buyer' ? 'seller' : 'buyer';
                    setUserRole(newRole);
                    
                    // Auto-save role change immediately
                    if (typeof window !== 'undefined') {
                      const stored = localStorage.getItem('beagvs_users');
                      if (stored) {
                        try {
                          const users = JSON.parse(stored);
                          const updatedUsers = users.map((u: any) =>
                            u.id === user?.id
                              ? { ...u, role: newRole, updatedAt: new Date() }
                              : u
                          );
                          localStorage.setItem('beagvs_users', JSON.stringify(updatedUsers));
                          localStorage.setItem('current_user', JSON.stringify(
                            updatedUsers.find((u: any) => u.id === user?.id)
                          ));
                          toast.success(`Switched to ${newRole} account`);
                        } catch (e) {
                          console.error('[v0] Error updating role:', e);
                        }
                      }
                    }
                  }}
                >
                  Switch to {userRole === 'buyer' ? 'Seller' : 'Buyer'}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://yourwebsite.com"
              />
            </div>
          </CardContent>
        </Card>

        {/* Pi Wallet */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Pi Network Wallet
            </CardTitle>
            <CardDescription>
              Add your Pi wallet address to receive payments for sales and tips
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="piWallet">Pi Wallet Address</Label>
              <Input
                id="piWallet"
                value={piWallet}
                onChange={(e) => setPiWallet(e.target.value)}
                placeholder="GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Your Pi wallet address will be shown when users tip your posts or purchase your items
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Social Media Links
            </CardTitle>
            <CardDescription>
              Connect your social media accounts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="twitter" className="flex items-center gap-2">
                <Twitter className="h-4 w-4" />
                Twitter/X
              </Label>
              <Input
                id="twitter"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="https://twitter.com/username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="facebook" className="flex items-center gap-2">
                <Facebook className="h-4 w-4" />
                Facebook
              </Label>
              <Input
                id="facebook"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                placeholder="https://facebook.com/username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram" className="flex items-center gap-2">
                <Instagram className="h-4 w-4" />
                Instagram
              </Label>
              <Input
                id="instagram"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="https://instagram.com/username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin" className="flex items-center gap-2">
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </Label>
              <Input
                id="linkedin"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSaveProfile} size="lg">
            <Save className="h-4 w-4 mr-2" />
            Save All Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
