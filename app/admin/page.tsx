"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Users, Package, AlertTriangle, DollarSign, Settings, Wallet, 
  TrendingUp, Shield, Edit, Trash2, Check, X, Eye, Search,
  MoreHorizontal, UserCheck, Star, Ban, Building, Home, Briefcase, Plus, Trash,
  ClipboardList, Newspaper, MessageSquare, Send, Truck, MapPin, CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { AdminLogin } from '@/components/admin/admin-login';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { mockListings, mockNews, mockOrders, mockEscrows, mockDisputes } from '@/lib/mock-data';
import { UserRole, Listing, ListingType } from '@/lib/database-types';

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Wallet Management State
  const [wallets, setWallets] = useState([
    { id: 'wallet_1', name: 'Primary Pi Wallet', address: 'GBXYZ...ABC123', type: 'primary', balance: '1,234.56 Pi', isActive: true },
    { id: 'wallet_2', name: 'Escrow Wallet', address: 'GBDEF...XYZ789', type: 'escrow', balance: '567.89 Pi', isActive: true },
  ]);
  const [newWalletName, setNewWalletName] = useState('');
  const [newWalletAddress, setNewWalletAddress] = useState('');
  const [newWalletType, setNewWalletType] = useState('payment');
  const [addWalletDialogOpen, setAddWalletDialogOpen] = useState(false);
  
  // Settings state
  const [platformFee, setPlatformFee] = useState('2.5');
  const [featuredListingPrice, setFeaturedListingPrice] = useState('10');
  
  // User management state
  const [users, setUsers] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('beagvs_users');
      if (stored) {
        try {
          const parsedUsers = JSON.parse(stored);
          return parsedUsers.map((u: any) => ({
            ...u,
            status: u.status || 'active',
            verified: u.verified !== undefined ? u.verified : true,
            joinedDate: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : new Date().toLocaleDateString()
          }));
        } catch (e) {
          console.error('Error parsing users:', e);
        }
      }
    }
    return [];
  });
  const [searchUser, setSearchUser] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Listing management state
  const [listings, setListings] = useState(mockListings);
  const [searchListing, setSearchListing] = useState('');
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [editListingDialogOpen, setEditListingDialogOpen] = useState(false);
  const [deleteListingDialogOpen, setDeleteListingDialogOpen] = useState(false);
  
  // Edit listing form state
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editType, setEditType] = useState<ListingType>('goods');
  const [editPropertyType, setEditPropertyType] = useState('');
  const [editBedrooms, setEditBedrooms] = useState('');
  const [editBathrooms, setEditBathrooms] = useState('');
  const [editSquareFeet, setEditSquareFeet] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editYearBuilt, setEditYearBuilt] = useState('');
  
  // Dispute management
  const [disputes, setDisputes] = useState(mockDisputes);
  const [selectedDispute, setSelectedDispute] = useState<any>(null);
  const [resolutionDialogOpen, setResolutionDialogOpen] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');
  
  // Escrow management
  const [escrows, setEscrows] = useState(mockEscrows);
  
  // Task submissions management
  const [taskSubmissions, setTaskSubmissions] = useState([
    {
      id: 'task_1',
      userId: 'user_1',
      username: 'john_doe',
      title: 'Follow us on social media',
      taskCount: 3,
      totalBudget: 3000,
      platformFee: 300,
      grandTotal: 3300,
      paymentProof: 'proof1.png',
      status: 'pending',
      submittedAt: new Date('2024-01-28'),
      tasks: [
        { title: 'Follow on Twitter', type: 'social_media', participants: 100, budget: 1000, region: 'Global' },
        { title: 'Like Facebook Page', type: 'social_media', participants: 150, budget: 1500, region: 'Global' },
        { title: 'Subscribe YouTube', type: 'social_media', participants: 100, budget: 500, region: 'Global' }
      ]
    }
  ]);
  const [selectedTaskSubmission, setSelectedTaskSubmission] = useState<any>(null);
  const [taskChatOpen, setTaskChatOpen] = useState(false);
  const [taskChatMessage, setTaskChatMessage] = useState('');
  const [taskChatMessages, setTaskChatMessages] = useState<any[]>([]);
  
  // News management
  const [newsArticles, setNewsArticles] = useState(mockNews);
  const [newsDialogOpen, setNewsDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<any>(null);
  const [newsTitle, setNewsTitle] = useState('');
  const [newsSlug, setNewsSlug] = useState('');
  const [newsExcerpt, setNewsExcerpt] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsCategory, setNewsCategory] = useState('');
  const [newsImage, setNewsImage] = useState('');
  const [newsAuthor, setNewsAuthor] = useState('Beagvs Team');
  
  // Feeds management
  const [feedPosts, setFeedPosts] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('feed_posts');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error('[v0] Error loading feeds:', e);
        }
      }
    }
    return [];
  });
  const [feedDialogOpen, setFeedDialogOpen] = useState(false);
  const [editingFeed, setEditingFeed] = useState<any>(null);
  const [feedContent, setFeedContent] = useState('');
  const [feedSection, setFeedSection] = useState('community');
  
  // Shipping management
  const [shipments, setShipments] = useState([
    {
      id: 'ship_1',
      orderId: 'order_1',
      trackingId: 'TRK123456789',
      buyerName: 'John Doe',
      itemTitle: 'Wireless Headphones',
      status: 'shipped',
      location: 'Distribution Center',
      lastUpdate: new Date(Date.now() - 86400000),
    },
    {
      id: 'ship_2',
      orderId: 'order_2',
      trackingId: 'TRK987654321',
      buyerName: 'Jane Smith',
      itemTitle: 'Modern Downtown Apartment',
      status: 'in_transit',
      location: 'Local Hub',
      lastUpdate: new Date(Date.now() - 43200000),
    },
  ]);
  const [selectedShipment, setSelectedShipment] = useState<any>(null);
  const [shippingDialogOpen, setShippingDialogOpen] = useState(false);
  const [newShipmentStatus, setNewShipmentStatus] = useState('');
  const [newShipmentLocation, setNewShipmentLocation] = useState('');
  const [newShipmentNotes, setNewShipmentNotes] = useState('');

  useEffect(() => {
    const adminEmail = localStorage.getItem('userEmail');
    const adminPassword = localStorage.getItem('userPassword');
    
    if (adminEmail === 'beagvsglobal@gmail.com' && adminPassword === 'BEAGVSglobal.2024#') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  // Wallet management handlers
  const handleAddWallet = () => {
    if (!newWalletName || !newWalletAddress) {
      toast.error('Please fill in all wallet fields');
      return;
    }
    
    const newWallet = {
      id: `wallet_${Date.now()}`,
      name: newWalletName,
      address: newWalletAddress,
      type: newWalletType,
      balance: '0.00 Pi',
      isActive: true,
    };
    
    setWallets([...wallets, newWallet]);
    setNewWalletName('');
    setNewWalletAddress('');
    setNewWalletType('payment');
    setAddWalletDialogOpen(false);
    toast.success('Wallet added successfully');
  };

  const handleDeleteWallet = (walletId: string) => {
    setWallets(wallets.filter(w => w.id !== walletId));
    toast.success('Wallet removed');
  };

  const handleToggleWalletStatus = (walletId: string) => {
    setWallets(wallets.map(w => 
      w.id === walletId ? { ...w, isActive: !w.isActive } : w
    ));
    toast.success('Wallet status updated');
  };

  // User management handlers
  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setEditUserDialogOpen(true);
  };

  const handleVerifyUser = (userId: string) => {
    setUsers(users.map(u => u.id === userId ? { ...u, verified: true } : u));
    toast.success('User verified successfully');
  };

  const handleSuspendUser = (userId: string) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u
    ));
    toast.success('User status updated');
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      setUsers(users.filter(u => u.id !== selectedUser.id));
      toast.success('User deleted');
      setDeleteDialogOpen(false);
    }
  };

  // Listing management handlers
  const handleEditListing = (listing: Listing) => {
    setSelectedListing(listing);
    setEditTitle(listing.title);
    setEditDescription(listing.description);
    setEditPrice(listing.priceInPi.toString());
    setEditCategory(listing.category);
    setEditType(listing.type);
    
    // Real estate fields
    if (listing.type === 'real_estate') {
      setEditPropertyType(listing.propertyType || '');
      setEditBedrooms(listing.bedrooms?.toString() || '');
      setEditBathrooms(listing.bathrooms?.toString() || '');
      setEditSquareFeet(listing.squareFeet?.toString() || '');
      setEditLocation(listing.location || '');
      setEditYearBuilt(listing.yearBuilt?.toString() || '');
    }
    
    setEditListingDialogOpen(true);
  };

  const handleSaveListing = () => {
    if (!selectedListing) return;
    
    const updatedListing: Listing = {
      ...selectedListing,
      title: editTitle,
      description: editDescription,
      priceInPi: parseFloat(editPrice),
      category: editCategory,
      type: editType,
      updatedAt: new Date(),
    };

    // Add real estate fields if applicable
    if (editType === 'real_estate') {
      updatedListing.propertyType = editPropertyType;
      updatedListing.bedrooms = editBedrooms ? parseInt(editBedrooms) : undefined;
      updatedListing.bathrooms = editBathrooms ? parseInt(editBathrooms) : undefined;
      updatedListing.squareFeet = editSquareFeet ? parseInt(editSquareFeet) : undefined;
      updatedListing.location = editLocation;
      updatedListing.yearBuilt = editYearBuilt ? parseInt(editYearBuilt) : undefined;
    }

    setListings(listings.map(l => l.id === selectedListing.id ? updatedListing : l));
    setEditListingDialogOpen(false);
    toast.success('Listing updated successfully');
  };

  const handleToggleFeatured = (listingId: string) => {
    setListings(listings.map(l => 
      l.id === listingId ? { ...l, isFeatured: !l.isFeatured } : l
    ));
    toast.success('Featured status updated');
  };

  const handleApproveReject = (listingId: string, approve: boolean) => {
    setListings(listings.map(l => 
      l.id === listingId ? { ...l, status: approve ? 'active' : 'inactive' } : l
    ));
    toast.success(approve ? 'Listing approved' : 'Listing rejected');
  };

  const handleDeleteListing = () => {
    if (selectedListing) {
      setListings(listings.filter(l => l.id !== selectedListing.id));
      toast.success('Listing deleted');
      setDeleteListingDialogOpen(false);
    }
  };

  // Dispute handlers
  const handleResolveDispute = (disputeId: string, resolution: string) => {
    setDisputes(disputes.map(d => 
      d.id === disputeId ? { ...d, status: 'resolved', resolution } : d
    ));
    setResolutionDialogOpen(false);
    toast.success('Dispute resolved');
  };

  // Escrow handlers
  const handleReleaseEscrow = (escrowId: string) => {
    setEscrows(escrows.map(e => 
      e.id === escrowId ? { ...e, status: 'released', releasedAt: new Date() } : e
    ));
    toast.success('Escrow funds released');
  };

  const handleRefundEscrow = (escrowId: string) => {
    setEscrows(escrows.map(e => 
      e.id === escrowId ? { ...e, status: 'cancelled' } : e
    ));
    toast.success('Escrow funds refunded');
  };

  const handleSaveSettings = () => {
    toast.success('Settings saved successfully');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
  }
  
  // Task submission handlers
  const handleApproveTask = (taskId: string) => {
    const updatedSubmissions = taskSubmissions.map(t =>
      t.id === taskId ? { ...t, status: 'approved' } : t
    );
    setTaskSubmissions(updatedSubmissions);
    
    // Save approved tasks to localStorage for earn page
    const approvedTasks = updatedSubmissions.filter(t => t.status === 'approved');
    if (typeof window !== 'undefined') {
      localStorage.setItem('approved_tasks', JSON.stringify(approvedTasks));
    }
    
    toast.success('Task approved and published to Earn page');
  };
  
  const handleRejectTask = (taskId: string) => {
    setTaskSubmissions(taskSubmissions.map(t =>
      t.id === taskId ? { ...t, status: 'rejected' } : t
    ));
    toast.error('Task rejected');
  };
  
  const handleSendTaskMessage = () => {
    if (!taskChatMessage.trim()) return;
    const newMessage = {
      id: Date.now().toString(),
      sender: 'admin',
      message: taskChatMessage,
      timestamp: new Date()
    };
    setTaskChatMessages([...taskChatMessages, newMessage]);
    setTaskChatMessage('');
    toast.success('Message sent');
  };
  
  // News handlers
  const handleOpenNewsDialog = (article?: any) => {
    if (article) {
      setEditingNews(article);
      setNewsTitle(article.title);
      setNewsSlug(article.slug);
      setNewsExcerpt(article.excerpt);
      setNewsContent(article.content);
      setNewsCategory(article.category);
      setNewsImage(article.image || '');
      setNewsAuthor(article.author);
    } else {
      setEditingNews(null);
      setNewsTitle('');
      setNewsSlug('');
      setNewsExcerpt('');
      setNewsContent('');
      setNewsCategory('');
      setNewsImage('');
      setNewsAuthor('Beagvs Team');
    }
    setNewsDialogOpen(true);
  };
  
  const handleSaveNews = () => {
    if (!newsTitle || !newsExcerpt || !newsContent || !newsCategory) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (editingNews) {
      // Update existing
      setNewsArticles(newsArticles.map(a =>
        a.id === editingNews.id
          ? {
              ...a,
              title: newsTitle,
              slug: newsSlug || newsTitle.toLowerCase().replace(/\s+/g, '-'),
              excerpt: newsExcerpt,
              content: newsContent,
              category: newsCategory,
              image: newsImage,
              author: newsAuthor,
            }
          : a
      ));
      toast.success('News article updated');
    } else {
      // Create new
      const newArticle = {
        id: `news_${Date.now()}`,
        title: newsTitle,
        slug: newsSlug || newsTitle.toLowerCase().replace(/\s+/g, '-'),
        excerpt: newsExcerpt,
        content: newsContent,
        category: newsCategory,
        image: newsImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop',
        author: newsAuthor,
        publishedAt: new Date(),
      };
      setNewsArticles([newArticle, ...newsArticles]);
      toast.success('News article published');
    }
    
    setNewsDialogOpen(false);
  };
  
  const handleDeleteNews = (newsId: string) => {
    setNewsArticles(newsArticles.filter(a => a.id !== newsId));
    toast.success('News article deleted');
  };
  
  // Feed handlers
  const handleSaveFeed = () => {
    if (!feedContent.trim()) {
      toast.error('Please add content');
      return;
    }
    
    const newPost = {
      id: `feed_${Date.now()}`,
      userId: 'admin_1',
      username: 'Admin',
      profilePicture: undefined,
      content: feedContent,
      section: feedSection,
      likes: [],
      comments: [],
      tips: [],
      createdAt: new Date().toISOString(),
    };
    
    const updated = [newPost, ...feedPosts];
    setFeedPosts(updated);
    localStorage.setItem('feed_posts', JSON.stringify(updated));
    
    setFeedDialogOpen(false);
    setFeedContent('');
    setFeedSection('community');
    toast.success('Post published to feed');
  };
  
  const handleDeleteFeed = (feedId: string) => {
    const updated = feedPosts.filter(f => f.id !== feedId);
    setFeedPosts(updated);
    localStorage.setItem('feed_posts', JSON.stringify(updated));
    toast.success('Post deleted');
  };
  
  // Shipping handlers
  const handleUpdateShipping = () => {
    if (!selectedShipment || !newShipmentStatus) {
      toast.error('Please select status');
      return;
    }
    
    setShipments(shipments.map(s =>
      s.id === selectedShipment.id
        ? {
            ...s,
            status: newShipmentStatus,
            location: newShipmentLocation || s.location,
            lastUpdate: new Date(),
          }
        : s
    ));
    
    setShippingDialogOpen(false);
    setNewShipmentStatus('');
    setNewShipmentLocation('');
    setNewShipmentNotes('');
    toast.success('Shipping status updated');
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchUser.toLowerCase()) ||
    user.email.toLowerCase().includes(searchUser.toLowerCase())
  );

  const filteredListings = listings.filter(listing => 
    listing.title.toLowerCase().includes(searchListing.toLowerCase()) ||
    listing.category.toLowerCase().includes(searchListing.toLowerCase())
  );

  const stats = {
    totalUsers: users.length,
    activeListings: listings.filter(l => l.status === 'active').length,
    pendingDisputes: disputes.filter(d => d.status === 'open').length,
    totalRevenue: escrows.reduce((sum, e) => sum + e.amountPi, 0),
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Manage Beagvs platform</p>
            </div>
            <Button variant="outline" onClick={() => {
              localStorage.removeItem('userEmail');
              localStorage.removeItem('userPassword');
              setIsAuthenticated(false);
            }}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">Active platform users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeListings}</div>
              <p className="text-xs text-muted-foreground">Published listings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Disputes</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingDisputes}</div>
              <p className="text-xs text-muted-foreground">Need attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRevenue.toFixed(2)} Pi</div>
              <p className="text-xs text-muted-foreground">In escrow + released</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="wallets" className="space-y-6">
          <TabsList>
            <TabsTrigger value="wallets">
              <Wallet className="h-4 w-4 mr-2" />
              Wallets
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="listings">
              <Package className="h-4 w-4 mr-2" />
              Listings
            </TabsTrigger>
            <TabsTrigger value="disputes">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Disputes
            </TabsTrigger>
            <TabsTrigger value="escrow">
              <Shield className="h-4 w-4 mr-2" />
              Escrow
            </TabsTrigger>
            <TabsTrigger value="shipping">
              <Truck className="h-4 w-4 mr-2" />
              Shipping
            </TabsTrigger>
            <TabsTrigger value="tasks">
              <ClipboardList className="h-4 w-4 mr-2" />
              Task Requests
            </TabsTrigger>
            <TabsTrigger value="news">
              <Newspaper className="h-4 w-4 mr-2" />
              News
            </TabsTrigger>
            <TabsTrigger value="feeds">
              <TrendingUp className="h-4 w-4 mr-2" />
              Feeds
            </TabsTrigger>
            <TabsTrigger value="verifications">
              <UserCheck className="h-4 w-4 mr-2" />
              Verifications
            </TabsTrigger>
            <TabsTrigger value="tasksubmissions">
              <CheckCircle className="h-4 w-4 mr-2" />
              Task Submissions
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Wallets Tab */}
          <TabsContent value="wallets" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Payment Wallet Management</CardTitle>
                    <CardDescription>
                      Manage Pi Network wallets for receiving payments
                    </CardDescription>
                  </div>
                  <Button onClick={() => setAddWalletDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Wallet
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {wallets.map((wallet) => (
                    <div key={wallet.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Wallet className="h-8 w-8 text-primary" />
                        <div>
                          <div className="font-medium">{wallet.name}</div>
                          <div className="text-sm text-muted-foreground font-mono">{wallet.address}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="capitalize">{wallet.type}</Badge>
                            <Badge variant={wallet.isActive ? 'default' : 'secondary'}>
                              {wallet.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            <span className="text-sm text-muted-foreground">{wallet.balance}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleWalletStatus(wallet.id)}
                        >
                          {wallet.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteWallet(wallet.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage and moderate user accounts</CardDescription>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={searchUser}
                      onChange={(e) => setSearchUser(e.target.value)}
                      className="pl-8 w-[250px]"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Account</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Verified</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.isPremium ? 'default' : 'secondary'}>
                            {user.isPremium ? 'Premium' : 'Free'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.verified ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <X className="h-4 w-4 text-muted-foreground" />
                          )}
                        </TableCell>
                        <TableCell>{user.joinedDate}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit User
                              </DropdownMenuItem>
                              {!user.verified && (
                                <DropdownMenuItem onClick={() => handleVerifyUser(user.id)}>
                                  <UserCheck className="h-4 w-4 mr-2" />
                                  Verify User
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => handleSuspendUser(user.id)}>
                                <Ban className="h-4 w-4 mr-2" />
                                {user.status === 'active' ? 'Suspend' : 'Activate'}
                              </DropdownMenuItem>
                              {user.role === 'seller' && (
                                <DropdownMenuItem onClick={() => {
                                  setUsers(users.map(u => 
                                    u.id === user.id ? { ...u, isPremium: !u.isPremium } : u
                                  ));
                                  toast.success(`User ${user.isPremium ? 'downgraded to Free' : 'upgraded to Premium'}`);
                                }}>
                                  <Shield className="h-4 w-4 mr-2" />
                                  {user.isPremium ? 'Remove Premium' : 'Upgrade to Premium'}
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => {
                                  setSelectedUser(user);
                                  setDeleteDialogOpen(true);
                                }}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Listings Tab */}
          <TabsContent value="listings" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Listing Management</CardTitle>
                    <CardDescription>
                      Manage goods, services, and real estate listings
                    </CardDescription>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search listings..."
                      value={searchListing}
                      onChange={(e) => setSearchListing(e.target.value)}
                      className="pl-8 w-[250px]"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Featured</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredListings.map((listing) => (
                      <TableRow key={listing.id}>
                        <TableCell className="font-medium">{listing.title}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {listing.type === 'goods' && <Package className="h-4 w-4" />}
                            {listing.type === 'services' && <Briefcase className="h-4 w-4" />}
                            {listing.type === 'real_estate' && <Building className="h-4 w-4" />}
                            <span className="capitalize">{listing.type.replace('_', ' ')}</span>
                          </div>
                        </TableCell>
                        <TableCell>{listing.category}</TableCell>
                        <TableCell>{listing.priceInPi.toLocaleString()} Pi</TableCell>
                        <TableCell>
                          <Badge variant={listing.status === 'active' ? 'default' : 'secondary'}>
                            {listing.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {listing.isFeatured && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleEditListing(listing)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Listing
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleFeatured(listing.id)}>
                                <Star className="h-4 w-4 mr-2" />
                                {listing.isFeatured ? 'Remove Featured' : 'Make Featured'}
                              </DropdownMenuItem>
                              {listing.status === 'pending' && (
                                <>
                                  <DropdownMenuItem onClick={() => handleApproveReject(listing.id, true)}>
                                    <Check className="h-4 w-4 mr-2" />
                                    Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleApproveReject(listing.id, false)}>
                                    <X className="h-4 w-4 mr-2" />
                                    Reject
                                  </DropdownMenuItem>
                                </>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => {
                                  setSelectedListing(listing);
                                  setDeleteListingDialogOpen(true);
                                }}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Listing
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Disputes Tab */}
          <TabsContent value="disputes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dispute Resolution</CardTitle>
                <CardDescription>Review and resolve transaction disputes</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Dispute ID</TableHead>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {disputes.map((dispute) => (
                      <TableRow key={dispute.id}>
                        <TableCell className="font-medium">{dispute.id}</TableCell>
                        <TableCell>{dispute.orderId}</TableCell>
                        <TableCell>{dispute.reason}</TableCell>
                        <TableCell>
                          <Badge variant={dispute.status === 'open' ? 'destructive' : 'default'}>
                            {dispute.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{dispute.createdAt.toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => {
                                setSelectedDispute(dispute);
                                setResolutionDialogOpen(true);
                              }}>
                                <Eye className="h-4 w-4 mr-2" />
                                Review & Resolve
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleResolveDispute(dispute.id, 'Favor Buyer')}>
                                <Check className="h-4 w-4 mr-2" />
                                Favor Buyer
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleResolveDispute(dispute.id, 'Favor Seller')}>
                                <Check className="h-4 w-4 mr-2" />
                                Favor Seller
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleResolveDispute(dispute.id, 'Split 50/50')}>
                                <DollarSign className="h-4 w-4 mr-2" />
                                Split Payment
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Escrow Tab */}
          <TabsContent value="escrow" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Escrow Management</CardTitle>
                <CardDescription>Monitor and manage escrow transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Escrow ID</TableHead>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {escrows.map((escrow) => (
                      <TableRow key={escrow.id}>
                        <TableCell className="font-medium">{escrow.id}</TableCell>
                        <TableCell>{escrow.orderId}</TableCell>
                        <TableCell>{escrow.amountPi} Pi</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              escrow.status === 'held' ? 'default' : 
                              escrow.status === 'released' ? 'default' : 
                              'secondary'
                            }
                          >
                            {escrow.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{escrow.createdAt.toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          {escrow.status === 'held' && (
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleReleaseEscrow(escrow.id)}
                              >
                                Release to Seller
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRefundEscrow(escrow.id)}
                              >
                                Refund to Buyer
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shipping Management Tab */}
          <TabsContent value="shipping" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="break-words">Shipping Management</CardTitle>
                    <CardDescription className="break-words">Track and update shipping status for orders</CardDescription>
                  </div>
                  <Badge variant="secondary" className="flex-shrink-0">
                    {shipments.filter(s => s.status === 'shipped' || s.status === 'in_transit').length} Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tracking ID</TableHead>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Buyer</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Last Update</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shipments.map((shipment) => (
                      <TableRow key={shipment.id}>
                        <TableCell className="font-mono text-sm">{shipment.trackingId}</TableCell>
                        <TableCell>{shipment.orderId}</TableCell>
                        <TableCell className="truncate max-w-[150px]">{shipment.buyerName}</TableCell>
                        <TableCell className="truncate max-w-[200px]">{shipment.itemTitle}</TableCell>
                        <TableCell>
                          <Badge variant={
                            shipment.status === 'delivered' ? 'default' :
                            shipment.status === 'in_transit' ? 'secondary' :
                            'outline'
                          } className="capitalize">
                            {shipment.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell className="truncate max-w-[150px]">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            <span>{shipment.location}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {shipment.lastUpdate.toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedShipment(shipment);
                              setNewShipmentStatus(shipment.status);
                              setNewShipmentLocation(shipment.location);
                              setShippingDialogOpen(true);
                            }}
                            className="bg-transparent"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Update
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Task Requests Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="break-words">Task Submission Requests</CardTitle>
                    <CardDescription className="break-words">Review and approve task submissions from users</CardDescription>
                  </div>
                  <Badge variant="secondary" className="flex-shrink-0">{taskSubmissions.filter(t => t.status === 'pending').length} Pending</Badge>
                </div>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <div className="space-y-4 max-w-full">
                  {taskSubmissions.map((submission) => (
                    <Card 
                      key={submission.id} 
                      className={`overflow-hidden cursor-pointer hover:border-primary transition-colors ${submission.status === 'approved' ? 'border-green-500/50' : submission.status === 'rejected' ? 'border-red-500/50' : ''}`}
                      onClick={() => {
                        setSelectedTaskSubmission(submission);
                      }}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <CardTitle className="text-lg break-words">{submission.username}</CardTitle>
                              <Badge variant={
                                submission.status === 'approved' ? 'default' :
                                submission.status === 'rejected' ? 'destructive' :
                                'secondary'
                              } className="flex-shrink-0">
                                {submission.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap text-sm text-muted-foreground">
                              <span>{submission.taskCount} Tasks</span>
                              <span>•</span>
                              <span>{submission.grandTotal} Pi Total</span>
                              <span>•</span>
                              <span className="truncate">{submission.submittedAt.toLocaleDateString()}</span>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedTaskSubmission(submission);
                              setTaskChatOpen(true);
                            }}
                            className="bg-transparent"
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Chat
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Tasks List */}
                        <div className="space-y-2 overflow-x-auto">
                          {submission.tasks.map((task, index) => (
                            <div key={index} className="p-3 bg-muted rounded-lg min-w-0">
                              <div className="flex items-start justify-between gap-3 flex-wrap">
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium mb-1 break-words">{task.title}</h4>
                                  <div className="flex items-center gap-2 flex-wrap text-sm text-muted-foreground">
                                    <span className="capitalize">{task.type.replace('_', ' ')}</span>
                                    <span>•</span>
                                    <span>{task.participants} participants</span>
                                    <span>•</span>
                                    <span>{task.budget} Pi</span>
                                    <span>•</span>
                                    <span className="truncate">{task.region}</span>
                                  </div>
                                </div>
                                <Badge variant="outline" className="text-xs flex-shrink-0">
                                  {(task.budget / task.participants).toFixed(2)} Pi/person
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Payment Info */}
                        <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                          <div>
                            <p className="text-sm font-medium">Payment Summary</p>
                            <p className="text-xs text-muted-foreground">
                              Budget: {submission.totalBudget} Pi + Fee: {submission.platformFee} Pi
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold">{submission.grandTotal} Pi</p>
                            <p className="text-xs text-green-600">Payment Proof Submitted</p>
                          </div>
                        </div>

                        {/* Actions */}
                        {submission.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleApproveTask(submission.id)}
                              className="flex-1"
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Approve & Publish
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleRejectTask(submission.id)}
                              className="flex-1"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  
                  {taskSubmissions.length === 0 && (
                    <div className="text-center py-12">
                      <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No task submissions yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* News Management Tab */}
          <TabsContent value="news" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>News & Blog Management</CardTitle>
                    <CardDescription>Create, edit, and manage news articles</CardDescription>
                  </div>
                  <Button onClick={() => handleOpenNewsDialog()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add News Article
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {newsArticles.map((article) => (
                    <Card key={article.id}>
                      <CardContent className="pt-6">
                        <div className="flex gap-4">
                          {article.image && (
                            <div className="flex-shrink-0 w-32 h-24 relative rounded-lg overflow-hidden">
                              <Image src={article.image || "/placeholder.svg"} alt={article.title} fill className="object-cover" />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h4 className="font-semibold mb-1">{article.title}</h4>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                                  <Badge variant="secondary">{article.category}</Badge>
                                  <span>by {article.author}</span>
                                  <span>•</span>
                                  <span>{article.publishedAt.toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleOpenNewsDialog(article)}
                                  className="bg-transparent"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteNews(article.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feeds Management Tab */}
          <TabsContent value="feeds" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="break-words">Feed Management</CardTitle>
                    <CardDescription className="break-words">Manage community, popular, and sponsored posts</CardDescription>
                  </div>
                  <Button onClick={() => setFeedDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Post
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="community">Community</TabsTrigger>
                    <TabsTrigger value="popular">Popular</TabsTrigger>
                    <TabsTrigger value="sponsored">Sponsored</TabsTrigger>
                  </TabsList>
                  
                  {['all', 'community', 'popular', 'sponsored'].map(section => (
                    <TabsContent key={section} value={section} className="space-y-4">
                      {feedPosts
                        .filter(post => section === 'all' || post.section === section)
                        .map((post) => (
                          <Card key={post.id}>
                            <CardContent className="pt-4">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="font-semibold">{post.username}</span>
                                    <Badge variant="secondary" className="capitalize">{post.section}</Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(post.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-sm break-words whitespace-pre-wrap">{post.content}</p>
                                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                    <span>{post.likes?.length || 0} likes</span>
                                    <span>{post.comments?.length || 0} comments</span>
                                    <span>{post.tips?.length || 0} tips</span>
                                  </div>
                                </div>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteFeed(post.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      {feedPosts.filter(post => section === 'all' || post.section === section).length === 0 && (
                        <div className="text-center py-12">
                          <p className="text-muted-foreground">No posts in this section</p>
                        </div>
                      )}
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Verifications Tab */}
          <TabsContent value="verifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Verification Requests</CardTitle>
                <CardDescription>
                  Review and approve user verification requests with payment proof
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Transaction Hash</TableHead>
                      <TableHead>Proof</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(() => {
                      const requests = typeof window !== 'undefined' 
                        ? JSON.parse(localStorage.getItem('verification_requests') || '[]')
                        : [];
                      
                      return requests.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                            No verification requests yet
                          </TableCell>
                        </TableRow>
                      ) : requests.map((request: any) => (
                        <TableRow key={request.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{request.username}</p>
                              <p className="text-sm text-muted-foreground">{request.email}</p>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{request.amount} Pi</TableCell>
                          <TableCell>
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                              {request.transactionHash?.substring(0, 16)}...
                            </code>
                          </TableCell>
                          <TableCell>
                            {request.paymentProof ? (
                              <Dialog>
                                <Button variant="outline" size="sm" className="bg-transparent" onClick={(e) => {
                                  e.currentTarget.nextElementSibling?.querySelector('img')?.click();
                                }}>
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                                <DialogContent className="max-w-3xl">
                                  <Image
                                    src={request.paymentProof || "/placeholder.svg"}
                                    alt="Payment proof"
                                    width={800}
                                    height={600}
                                    className="w-full h-auto rounded-lg"
                                  />
                                </DialogContent>
                              </Dialog>
                            ) : (
                              <span className="text-sm text-muted-foreground">No proof</span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              request.status === 'approved' ? 'default' :
                              request.status === 'rejected' ? 'destructive' :
                              'secondary'
                            }>
                              {request.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {request.status === 'pending' && (
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  onClick={() => {
                                    if (typeof window !== 'undefined') {
                                      const stored = localStorage.getItem('verification_requests');
                                      const requests = stored ? JSON.parse(stored) : [];
                                      const updated = requests.map((r: any) =>
                                        r.id === request.id ? { ...r, status: 'approved' } : r
                                      );
                                      localStorage.setItem('verification_requests', JSON.stringify(updated));
                                      
                                      // Update user verification status
                                      const users = JSON.parse(localStorage.getItem('beagvs_users') || '[]');
                                      const updatedUsers = users.map((u: any) =>
                                        u.id === request.userId ? { ...u, verified: true } : u
                                      );
                                      localStorage.setItem('beagvs_users', JSON.stringify(updatedUsers));
                                      
                                      toast.success('Verification approved!');
                                      window.location.reload();
                                    }
                                  }}
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => {
                                    if (typeof window !== 'undefined') {
                                      const stored = localStorage.getItem('verification_requests');
                                      const requests = stored ? JSON.parse(stored) : [];
                                      const updated = requests.map((r: any) =>
                                        r.id === request.id ? { ...r, status: 'rejected' } : r
                                      );
                                      localStorage.setItem('verification_requests', JSON.stringify(updated));
                                      toast.success('Verification rejected');
                                      window.location.reload();
                                    }
                                  }}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ));
                    })()}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Task Submissions Tab */}
          <TabsContent value="tasksubmissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Task Submissions</CardTitle>
                <CardDescription>
                  Review and approve task completion submissions from users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Task</TableHead>
                      <TableHead>Note</TableHead>
                      <TableHead>Proof</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(() => {
                      const submissions = typeof window !== 'undefined' 
                        ? JSON.parse(localStorage.getItem('task_submissions') || '[]')
                        : [];
                      
                      return submissions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                            No task submissions yet
                          </TableCell>
                        </TableRow>
                      ) : submissions.map((submission: any) => (
                        <TableRow key={submission.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{submission.username}</p>
                              <p className="text-xs text-muted-foreground">{submission.userId}</p>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <p className="font-medium truncate">{submission.taskTitle}</p>
                          </TableCell>
                          <TableCell className="max-w-sm">
                            <p className="text-sm line-clamp-2">{submission.note}</p>
                          </TableCell>
                          <TableCell>
                            {submission.proof && submission.proof.length > 0 ? (
                              <Dialog>
                                <Button variant="outline" size="sm" className="bg-transparent">
                                  <Eye className="h-4 w-4 mr-1" />
                                  View ({submission.proof.length})
                                </Button>
                                <DialogContent className="max-w-3xl">
                                  <DialogHeader>
                                    <DialogTitle>Submission Proof</DialogTitle>
                                  </DialogHeader>
                                  <div className="grid grid-cols-2 gap-2">
                                    {submission.proof.map((img: string, idx: number) => (
                                      <Image
                                        key={idx}
                                        src={img || "/placeholder.svg"}
                                        alt={`Proof ${idx + 1}`}
                                        width={400}
                                        height={300}
                                        className="w-full h-auto rounded-lg"
                                      />
                                    ))}
                                  </div>
                                </DialogContent>
                              </Dialog>
                            ) : (
                              <span className="text-sm text-muted-foreground">No proof</span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm">
                            {new Date(submission.submittedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              submission.status === 'approved' ? 'default' :
                              submission.status === 'rejected' ? 'destructive' :
                              'secondary'
                            }>
                              {submission.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {submission.status === 'pending' && (
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  onClick={() => {
                                    if (typeof window !== 'undefined') {
                                      const stored = localStorage.getItem('task_submissions');
                                      const submissions = stored ? JSON.parse(stored) : [];
                                      const updated = submissions.map((s: any) =>
                                        s.id === submission.id ? { ...s, status: 'approved' } : s
                                      );
                                      localStorage.setItem('task_submissions', JSON.stringify(updated));
                                      toast.success('Task submission approved!');
                                      window.location.reload();
                                    }
                                  }}
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => {
                                    if (typeof window !== 'undefined') {
                                      const stored = localStorage.getItem('task_submissions');
                                      const submissions = stored ? JSON.parse(stored) : [];
                                      const updated = submissions.map((s: any) =>
                                        s.id === submission.id ? { ...s, status: 'rejected' } : s
                                      );
                                      localStorage.setItem('task_submissions', JSON.stringify(updated));
                                      toast.success('Task submission rejected');
                                      window.location.reload();
                                    }
                                  }}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ));
                    })()}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            {/* Wallet Management Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Payment & Escrow Wallets</CardTitle>
                  <CardDescription>Manage Pi Network wallets for payments and escrow</CardDescription>
                </div>
                <Button onClick={() => setAddWalletDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Wallet
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {wallets.map((wallet) => (
                      <TableRow key={wallet.id}>
                        <TableCell className="font-medium">{wallet.name}</TableCell>
                        <TableCell className="font-mono text-sm">{wallet.address}</TableCell>
                        <TableCell>
                          <Badge variant={wallet.type === 'escrow' ? 'default' : 'secondary'}>
                            {wallet.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{wallet.balance}</TableCell>
                        <TableCell>
                          <Badge variant={wallet.isActive ? 'default' : 'secondary'}>
                            {wallet.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => {
                                const updatedWallets = wallets.map(w => 
                                  w.id === wallet.id ? { ...w, isActive: !w.isActive } : w
                                );
                                setWallets(updatedWallets);
                                toast.success(`Wallet ${wallet.isActive ? 'deactivated' : 'activated'}`);
                              }}>
                                {wallet.isActive ? 'Deactivate' : 'Activate'}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => {
                                  setWallets(wallets.filter(w => w.id !== wallet.id));
                                  toast.success('Wallet removed');
                                }}
                              >
                                <Trash className="h-4 w-4 mr-2" />
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Platform Settings Card */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
                <CardDescription>Configure platform fees and pricing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="platformFee">Platform Fee (%)</Label>
                  <Input
                    id="platformFee"
                    type="number"
                    step="0.1"
                    value={platformFee}
                    onChange={(e) => setPlatformFee(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Percentage charged on each transaction
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="featuredPrice">Featured Listing Price (Pi)</Label>
                  <Input
                    id="featuredPrice"
                    type="number"
                    value={featuredListingPrice}
                    onChange={(e) => setFeaturedListingPrice(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Cost for sellers to feature their listings
                  </p>
                </div>

                <Button onClick={handleSaveSettings}>
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Wallet Dialog */}
      <Dialog open={addWalletDialogOpen} onOpenChange={setAddWalletDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Payment Wallet</DialogTitle>
            <DialogDescription>
              Add a new Pi Network wallet to receive payments
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="walletName">Wallet Name</Label>
              <Input
                id="walletName"
                placeholder="e.g., Primary Payment Wallet"
                value={newWalletName}
                onChange={(e) => setNewWalletName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="walletAddress">Pi Wallet Address</Label>
              <Input
                id="walletAddress"
                placeholder="GB..."
                value={newWalletAddress}
                onChange={(e) => setNewWalletAddress(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="walletType">Wallet Type</Label>
              <Select value={newWalletType} onValueChange={setNewWalletType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primary - Main business wallet</SelectItem>
                  <SelectItem value="payment">Payment - Receive customer payments</SelectItem>
                  <SelectItem value="escrow">Escrow - Hold funds in escrow</SelectItem>
                  <SelectItem value="backup">Backup - Secondary wallet</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                {newWalletType === 'escrow' 
                  ? 'Escrow wallet holds funds until transactions are completed'
                  : 'Payment wallet receives funds from completed transactions'}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddWalletDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddWallet}>Add Wallet</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Listing Dialog */}
      <Dialog open={editListingDialogOpen} onOpenChange={setEditListingDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Listing</DialogTitle>
            <DialogDescription>
              Update listing details and information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editTitle">Title</Label>
              <Input
                id="editTitle"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editDescription">Description</Label>
              <Textarea
                id="editDescription"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editPrice">Price (Pi)</Label>
                <Input
                  id="editPrice"
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editType">Type</Label>
                <Select value={editType} onValueChange={(value: ListingType) => setEditType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="goods">Goods</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                    <SelectItem value="real_estate">Real Estate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editCategory">Category</Label>
              <Input
                id="editCategory"
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
              />
            </div>

            {/* Real Estate Specific Fields */}
            {editType === 'real_estate' && (
              <>
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-4">Real Estate Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="editPropertyType">Property Type</Label>
                      <Select value={editPropertyType} onValueChange={setEditPropertyType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="House">House</SelectItem>
                          <SelectItem value="Apartment">Apartment</SelectItem>
                          <SelectItem value="Commercial">Commercial</SelectItem>
                          <SelectItem value="Land">Land</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editLocation">Location</Label>
                      <Input
                        id="editLocation"
                        value={editLocation}
                        onChange={(e) => setEditLocation(e.target.value)}
                        placeholder="City, District"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editBedrooms">Bedrooms</Label>
                      <Input
                        id="editBedrooms"
                        type="number"
                        value={editBedrooms}
                        onChange={(e) => setEditBedrooms(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editBathrooms">Bathrooms</Label>
                      <Input
                        id="editBathrooms"
                        type="number"
                        value={editBathrooms}
                        onChange={(e) => setEditBathrooms(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editSquareFeet">Square Feet</Label>
                      <Input
                        id="editSquareFeet"
                        type="number"
                        value={editSquareFeet}
                        onChange={(e) => setEditSquareFeet(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editYearBuilt">Year Built</Label>
                      <Input
                        id="editYearBuilt"
                        type="number"
                        value={editYearBuilt}
                        onChange={(e) => setEditYearBuilt(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditListingDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveListing}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedUser?.username}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Listing Confirmation */}
      <AlertDialog open={deleteListingDialogOpen} onOpenChange={setDeleteListingDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Listing</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedListing?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteListing} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Task Detail Dialog */}
      <Dialog open={!!selectedTaskSubmission && !taskChatOpen} onOpenChange={(open) => !open && setSelectedTaskSubmission(null)}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Task Submission Details</DialogTitle>
            <DialogDescription>
              Review task details and payment proof
            </DialogDescription>
          </DialogHeader>
          {selectedTaskSubmission && (
            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <h3 className="font-semibold">{selectedTaskSubmission.username}</h3>
                  <p className="text-sm text-muted-foreground">User ID: {selectedTaskSubmission.userId}</p>
                  <p className="text-sm text-muted-foreground">Submitted: {selectedTaskSubmission.submittedAt.toLocaleDateString()}</p>
                </div>
                <Badge variant={
                  selectedTaskSubmission.status === 'approved' ? 'default' :
                  selectedTaskSubmission.status === 'rejected' ? 'destructive' :
                  'secondary'
                }>
                  {selectedTaskSubmission.status}
                </Badge>
              </div>

              {/* Payment Proof */}
              <div className="space-y-2">
                <Label>Payment Proof</Label>
                <div className="border rounded-lg p-4 bg-muted/50">
                  <div className="aspect-video relative rounded overflow-hidden bg-background">
                    <Image 
                      src={selectedTaskSubmission.paymentProof || '/placeholder.svg'} 
                      alt="Payment proof" 
                      fill 
                      className="object-contain"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Payment proof file: {selectedTaskSubmission.paymentProof}</p>
                </div>
              </div>

              {/* Tasks */}
              <div className="space-y-2">
                <Label>Submitted Tasks ({selectedTaskSubmission.taskCount})</Label>
                <div className="space-y-2">
                  {selectedTaskSubmission.tasks.map((task: any, index: number) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <h4 className="font-semibold mb-2">{task.title}</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Type:</span>
                            <span className="ml-2 capitalize">{task.type.replace('_', ' ')}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Participants:</span>
                            <span className="ml-2">{task.participants}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Budget:</span>
                            <span className="ml-2 font-semibold">{task.budget} Pi</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Per Person:</span>
                            <span className="ml-2 font-semibold">{(task.budget / task.participants).toFixed(2)} Pi</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-muted-foreground">Region:</span>
                            <span className="ml-2">{task.region}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="p-4 bg-primary/5 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>Total Budget:</span>
                  <span className="font-semibold">{selectedTaskSubmission.totalBudget} Pi</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee:</span>
                  <span className="font-semibold">{selectedTaskSubmission.platformFee} Pi</span>
                </div>
                <div className="flex justify-between text-lg pt-2 border-t">
                  <span className="font-bold">Grand Total:</span>
                  <span className="font-bold">{selectedTaskSubmission.grandTotal} Pi</span>
                </div>
              </div>

              {/* Actions */}
              {selectedTaskSubmission.status === 'pending' && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      handleApproveTask(selectedTaskSubmission.id);
                      setSelectedTaskSubmission(null);
                    }}
                    className="flex-1"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Approve & Publish to Earn Page
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleRejectTask(selectedTaskSubmission.id);
                      setSelectedTaskSubmission(null);
                    }}
                    className="flex-1"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
              
              <Button
                variant="outline"
                onClick={() => setTaskChatOpen(true)}
                className="w-full"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat with Submitter
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Task Chat Dialog */}
      <Dialog open={taskChatOpen} onOpenChange={setTaskChatOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Chat with {selectedTaskSubmission?.username}</DialogTitle>
            <DialogDescription>
              Discuss task details and requirements
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="max-h-80 overflow-y-auto space-y-3 p-4 bg-muted rounded-lg">
              {taskChatMessages.length === 0 ? (
                <p className="text-center text-muted-foreground text-sm">No messages yet</p>
              ) : (
                taskChatMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-lg p-3 ${msg.sender === 'admin' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>
                      <p className="text-sm">{msg.message}</p>
                      <p className="text-xs opacity-70 mt-1">{msg.timestamp.toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={taskChatMessage}
                onChange={(e) => setTaskChatMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendTaskMessage()}
              />
              <Button onClick={handleSendTaskMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Shipping Update Dialog */}
      <Dialog open={shippingDialogOpen} onOpenChange={setShippingDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Update Shipping Status</DialogTitle>
            <DialogDescription>
              Update tracking information for {selectedShipment?.trackingId}
            </DialogDescription>
          </DialogHeader>
          {selectedShipment && (
            <div className="space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">Order: {selectedShipment.orderId}</p>
                <p className="text-sm text-muted-foreground">{selectedShipment.itemTitle}</p>
                <p className="text-sm text-muted-foreground">Buyer: {selectedShipment.buyerName}</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="shipmentStatus">Status *</Label>
                <Select value={newShipmentStatus} onValueChange={setNewShipmentStatus}>
                  <SelectTrigger id="shipmentStatus">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="in_transit">In Transit</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shipmentLocation">Current Location</Label>
                <Input
                  id="shipmentLocation"
                  placeholder="e.g., Distribution Center, Local Hub"
                  value={newShipmentLocation}
                  onChange={(e) => setNewShipmentLocation(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shipmentNotes">Notes (Optional)</Label>
                <Textarea
                  id="shipmentNotes"
                  placeholder="Add any additional notes..."
                  value={newShipmentNotes}
                  onChange={(e) => setNewShipmentNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShippingDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateShipping}>
              Update Shipping
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Feed Post Dialog */}
      <Dialog open={feedDialogOpen} onOpenChange={setFeedDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Feed Post</DialogTitle>
            <DialogDescription>
              Create a new post for the feed
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="feedSection">Section *</Label>
              <Select value={feedSection} onValueChange={setFeedSection}>
                <SelectTrigger id="feedSection">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="community">Community</SelectItem>
                  <SelectItem value="popular">Popular</SelectItem>
                  <SelectItem value="sponsored">Sponsored</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedContent">Content *</Label>
              <Textarea
                id="feedContent"
                placeholder="Write your post content..."
                value={feedContent}
                onChange={(e) => setFeedContent(e.target.value)}
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFeedDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveFeed}>
              Publish Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* News Editor Dialog */}
      <Dialog open={newsDialogOpen} onOpenChange={setNewsDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingNews ? 'Edit News Article' : 'Create New Article'}</DialogTitle>
            <DialogDescription>
              {editingNews ? 'Update the news article details below' : 'Fill in the details to publish a new article'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newsTitle">Title *</Label>
                <Input
                  id="newsTitle"
                  placeholder="Article title"
                  value={newsTitle}
                  onChange={(e) => setNewsTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newsSlug">URL Slug</Label>
                <Input
                  id="newsSlug"
                  placeholder="auto-generated-from-title"
                  value={newsSlug}
                  onChange={(e) => setNewsSlug(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newsCategory">Category *</Label>
                <Select value={newsCategory} onValueChange={setNewsCategory}>
                  <SelectTrigger id="newsCategory">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Platform Updates">Platform Updates</SelectItem>
                    <SelectItem value="Features">Features</SelectItem>
                    <SelectItem value="Announcements">Announcements</SelectItem>
                    <SelectItem value="Community">Community</SelectItem>
                    <SelectItem value="Tutorials">Tutorials</SelectItem>
                    <SelectItem value="News">News</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newsAuthor">Author</Label>
                <Input
                  id="newsAuthor"
                  placeholder="Beagvs Team"
                  value={newsAuthor}
                  onChange={(e) => setNewsAuthor(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newsImage">Featured Image URL</Label>
              <Input
                id="newsImage"
                placeholder="https://images.unsplash.com/photo-..."
                value={newsImage}
                onChange={(e) => setNewsImage(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Use Unsplash or other image URLs (800x400 recommended)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newsExcerpt">Excerpt *</Label>
              <Textarea
                id="newsExcerpt"
                placeholder="Brief summary of the article (2-3 sentences)"
                value={newsExcerpt}
                onChange={(e) => setNewsExcerpt(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newsContent">Content *</Label>
              <Textarea
                id="newsContent"
                placeholder="Full article content (supports basic formatting)"
                value={newsContent}
                onChange={(e) => setNewsContent(e.target.value)}
                rows={12}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Write your content here. You can use line breaks for paragraphs.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNews}>
              {editingNews ? 'Update Article' : 'Publish Article'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
