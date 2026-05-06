"use client";

import React from "react"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Camera, Save, Wallet, UserPlus, ImageIcon, Heart, MessageCircle, Send, Users, Package, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/auth-context';
import { redirect } from 'next/navigation';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [website, setWebsite] = useState(user?.website || '');
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '');
  const [walletAddress, setWalletAddress] = useState(user?.piWalletAddress || '');
  const [isEditing, setIsEditing] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [postImage, setPostImage] = useState('');
  const [myPosts, setMyPosts] = useState<any[]>([]);
  
  // Social links
  const [twitter, setTwitter] = useState(user?.socialLinks?.twitter || '');
  const [facebook, setFacebook] = useState(user?.socialLinks?.facebook || '');
  const [instagram, setInstagram] = useState(user?.socialLinks?.instagram || '');
  const [linkedin, setLinkedin] = useState(user?.socialLinks?.linkedin || '');

  if (!isAuthenticated) {
    redirect('/');
  }

  // Load user's posts
  useEffect(() => {
    if (typeof window !== 'undefined' && user) {
      const stored = localStorage.getItem('feed_posts');
      if (stored) {
        try {
          const allPosts = JSON.parse(stored);
          const filtered = allPosts.filter((p: any) => p.username === user.username);
          setMyPosts(filtered);
        } catch (e) {
          console.error('[v0] Error loading posts:', e);
        }
      }
    }
  }, [user]);

  const handleSave = () => {
    if (!user) return;
    
    // Update user in localStorage
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
                  bio,
                  website,
                  profilePicture,
                  piWalletAddress: walletAddress,
                  socialLinks: { twitter, facebook, instagram, linkedin },
                  updatedAt: new Date(),
                }
              : u
          );
          localStorage.setItem('beagvs_users', JSON.stringify(updatedUsers));
          toast.success('Profile updated successfully');
          setIsEditing(false);
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

  const handlePostImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPostImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = () => {
    if (!postContent.trim() && !postImage) {
      toast.error('Please write something or add an image');
      return;
    }

    const newPost = {
      id: `post_${Date.now()}`,
      userId: user?.id,
      username: user?.username,
      profilePicture: profilePicture || user?.profilePicture,
      content: postContent,
      images: postImage ? [postImage] : [],
      section: 'community',
      likes: [],
      comments: [],
      tips: [],
      createdAt: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('feed_posts');
      const posts = stored ? JSON.parse(stored) : [];
      const updated = [newPost, ...posts];
      localStorage.setItem('feed_posts', JSON.stringify(updated));
      setMyPosts([newPost, ...myPosts]);
      setPostContent('');
      setPostImage('');
      toast.success('Post published to feed!');
    }
  };

  const handleLikePost = (postId: string) => {
    if (!user) return;

    const updatedPosts = myPosts.map(post => {
      if (post.id === postId) {
        const hasLiked = post.likes.includes(user.id);
        return {
          ...post,
          likes: hasLiked 
            ? post.likes.filter((id: string) => id !== user.id)
            : [...post.likes, user.id]
        };
      }
      return post;
    });

    setMyPosts(updatedPosts);

    // Update in localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('feed_posts');
      if (stored) {
        const allPosts = JSON.parse(stored);
        const updated = allPosts.map((p: any) => {
          const matchingPost = updatedPosts.find(up => up.id === p.id);
          return matchingPost || p;
        });
        localStorage.setItem('feed_posts', JSON.stringify(updated));
      }
    }
  };

  const stats = {
    followers: user?.followers?.length || 0,
    following: user?.following?.length || 0,
    posts: myPosts.length,
    listings: 0,
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="bg-transparent">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">My Profile</TabsTrigger>
          <TabsTrigger value="posts">My Posts ({myPosts.length})</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          {/* Profile Header Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Profile Picture */}
                <div className="relative">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} />
                    <AvatarFallback>{user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <label htmlFor="profile-upload" className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90">
                      <Camera className="h-4 w-4" />
                      <input
                        id="profile-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-bold">{username}</h1>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="capitalize">{user?.role}</Badge>
                        {user?.isPremium && <Badge variant="default">Premium</Badge>}
                      </div>
                    </div>
                    <Button onClick={() => isEditing ? handleSave() : setIsEditing(true)} className="bg-transparent">
                      <Save className="mr-2 h-4 w-4" />
                      {isEditing ? 'Save Changes' : 'Edit Profile'}
                    </Button>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{stats.posts}</div>
                      <div className="text-xs text-muted-foreground">Posts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{stats.followers}</div>
                      <div className="text-xs text-muted-foreground">Followers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{stats.following}</div>
                      <div className="text-xs text-muted-foreground">Following</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{stats.listings}</div>
                      <div className="text-xs text-muted-foreground">Listings</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bio Section */}
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://yourwebsite.com"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </div>
                </>
              ) : (
                <>
                  {bio && <p className="text-muted-foreground whitespace-pre-wrap">{bio}</p>}
                  {website && (
                    <a href={website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline block">
                      {website}
                    </a>
                  )}
                  {!bio && !website && <p className="text-muted-foreground">No bio added yet</p>}
                </>
              )}
            </CardContent>
          </Card>

          {/* Social Links */}
          {isEditing && (
            <Card>
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
                <CardDescription>Connect your social media profiles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter/X</Label>
                    <Input
                      id="twitter"
                      placeholder="https://twitter.com/username"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      placeholder="https://facebook.com/username"
                      value={facebook}
                      onChange={(e) => setFacebook(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      placeholder="https://instagram.com/username"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      placeholder="https://linkedin.com/in/username"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Wallet */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Payment Wallet
              </CardTitle>
              <CardDescription>
                {user?.role === 'seller' 
                  ? 'Add your wallet address to receive payments'
                  : 'Your wallet for making purchases'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="space-y-2">
                  <Label htmlFor="wallet">Pi Network Wallet Address</Label>
                  <Input
                    id="wallet"
                    placeholder="Enter your Pi wallet address"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                  />
                </div>
              ) : (
                <div className="p-4 bg-muted rounded-lg">
                  {walletAddress ? (
                    <>
                      <p className="text-sm text-muted-foreground mb-1">Wallet Address</p>
                      <p className="font-mono text-sm break-all">{walletAddress}</p>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">No wallet added yet</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* View Public Profile */}
          <Card>
            <CardContent className="pt-6">
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href={`/profile/${user?.username}`}>
                  <Users className="mr-2 h-4 w-4" />
                  View Public Profile
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Posts Tab */}
        <TabsContent value="posts" className="space-y-6">
          {/* Create Post Card */}
          <Card>
            <CardHeader>
              <CardTitle>Create a Post</CardTitle>
              <CardDescription>Share your thoughts with the community</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="What's on your mind?"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                rows={4}
              />
              
              {postImage && (
                <div className="relative aspect-video w-full max-w-md rounded-lg overflow-hidden border">
                  <Image src={postImage || "/placeholder.svg"} alt="Post image" fill className="object-cover" />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setPostImage('')}
                  >
                    Remove
                  </Button>
                </div>
              )}

              <div className="flex items-center gap-2">
                <label htmlFor="post-image" className="cursor-pointer">
                  <Button variant="outline" size="sm" className="bg-transparent" asChild>
                    <span>
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Add Image
                    </span>
                  </Button>
                  <input
                    id="post-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePostImageUpload}
                  />
                </label>
                <Button onClick={handleCreatePost} className="ml-auto">
                  <Send className="h-4 w-4 mr-2" />
                  Publish Post
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* My Posts */}
          <div className="space-y-4">
            {myPosts.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                    <p className="text-muted-foreground">Create your first post to share with the community</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              myPosts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={post.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.username}`} />
                        <AvatarFallback>{post.username.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">{post.username}</span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm mb-3 whitespace-pre-wrap break-words">{post.content}</p>
                        
                        {post.images && post.images.length > 0 && (
                          <div className="relative aspect-video w-full rounded-lg overflow-hidden border mb-3">
                            <Image src={post.images[0] || "/placeholder.svg"} alt="Post" fill className="object-cover" />
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLikePost(post.id)}
                            className={`bg-transparent ${post.likes.includes(user?.id) ? 'text-red-500' : ''}`}
                          >
                            <Heart className={`h-4 w-4 mr-1 ${post.likes.includes(user?.id) ? 'fill-current' : ''}`} />
                            {post.likes.length}
                          </Button>
                          <Button variant="ghost" size="sm" className="bg-transparent">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            {post.comments?.length || 0}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
