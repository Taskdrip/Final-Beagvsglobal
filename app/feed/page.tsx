'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2, Coins, ImageIcon, Send, Flame, Hash, TrendingUp, X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const SEED_POSTS = [
  {
    id: 'seed_1',
    userId: 'admin_beagvs',
    username: 'Beagvs Official',
    userAvatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=beagvs',
    content: '🎉 Welcome to the Beagvs Community Feed!\n\nWe\'re building the future of Pi-powered commerce. Here you can share updates, promote your listings, connect with buyers and sellers, and earn Pi rewards.\n\n✅ List your products\n✅ Send Pi tips to creators\n✅ Build your reputation\n✅ Join the Pi economy\n\nLet\'s build something amazing together! 🚀',
    images: ['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80'],
    likes: ['user1', 'user2', 'user3', 'user4', 'user5'],
    comments: [
      { id: 'c1', userId: 'u1', username: 'PiTrader', text: 'So excited to be part of this! Already listed my first product 🎊', createdAt: new Date(Date.now() - 3600000).toISOString() },
      { id: 'c2', userId: 'u2', username: 'CryptoSeller', text: 'This platform is exactly what the Pi community needed!', createdAt: new Date(Date.now() - 1800000).toISOString() },
    ],
    tips: [],
    tags: ['announcement', 'welcome', 'Pi'],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    isSponsored: false,
    piWalletAddress: 'GBXXXXXXXXXXXXXXXXXXXXX',
  },
  {
    id: 'seed_2',
    userId: 'user_sarah',
    username: 'Sarah K.',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    content: '🏠 Just listed my new handmade ceramic collection on Beagvs!\n\nEach piece is hand-thrown and glazed with natural pigments. Perfect as home decor or thoughtful gifts.\n\nPrice: π 25 - π 85 per piece\n\nCheck it out in the marketplace! 🏺✨',
    images: ['https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80'],
    likes: ['user1', 'user3'],
    comments: [
      { id: 'c3', userId: 'u3', username: 'ArtLover', text: 'These look absolutely gorgeous! Just bought one 😍', createdAt: new Date(Date.now() - 900000).toISOString() },
    ],
    tips: [{ id: 't1', userId: 'u4', username: 'GiftBuyer', amount: 5, note: 'Beautiful work!', createdAt: new Date(Date.now() - 1200000).toISOString() }],
    tags: ['handmade', 'ceramics', 'art'],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    isSponsored: false,
    piWalletAddress: 'GBYYY111111111111111111',
  },
  {
    id: 'seed_3',
    userId: 'user_techseller',
    username: 'TechHub Pi',
    userAvatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=techseller',
    content: '📱 FLASH SALE — Next 24 hours only!\n\nRefurbished smartphones now available on Beagvs at 40% off normal prices.\n\n🔥 iPhone 13 Pro — π 450 (was π 750)\n🔥 Samsung S22 — π 380 (was π 620)\n🔥 Google Pixel 7 — π 350 (was π 580)\n\nAll devices tested, certified, and shipped with 30-day warranty. Pi escrow protected!\n\nDM me for bundle deals! 💬',
    images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80'],
    likes: ['user1', 'user2', 'user3', 'user4', 'user5', 'user6', 'user7'],
    comments: [
      { id: 'c4', userId: 'u5', username: 'BudgetShopper', text: 'Is the iPhone still available? Sending a DM now!', createdAt: new Date(Date.now() - 600000).toISOString() },
      { id: 'c5', userId: 'u6', username: 'PiMillionaire', text: 'Just grabbed the Pixel 7. Fast shipping thanks!', createdAt: new Date(Date.now() - 300000).toISOString() },
    ],
    tips: [],
    tags: ['tech', 'sale', 'phones'],
    createdAt: new Date(Date.now() - 43200000).toISOString(),
    isSponsored: true,
    piWalletAddress: 'GBZZZ222222222222222222',
  },
  {
    id: 'seed_4',
    userId: 'user_pifarmer',
    username: 'Pi Farmer',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pifarmer',
    content: '💡 Pro tip for new Beagvs sellers:\n\nWant to get more sales? Here\'s what worked for me:\n\n1️⃣ Use high-quality photos (natural light is best)\n2️⃣ Write detailed descriptions with keywords\n3️⃣ Price competitively — check similar listings\n4️⃣ Respond to messages within 1 hour\n5️⃣ Enable "instant escrow release" for fast shipping ratings\n\nI went from 0 to 47 sales in my first month! The Pi community is incredibly supportive 🙌\n\n#PiSeller #BeagvsTips',
    images: [],
    likes: ['user1', 'user2', 'user3'],
    comments: [
      { id: 'c6', userId: 'u7', username: 'NewSeller2024', text: 'Thank you for sharing! Just started and this is super helpful', createdAt: new Date(Date.now() - 7200000).toISOString() },
    ],
    tips: [
      { id: 't2', userId: 'u8', username: 'GratefulBuyer', amount: 10, note: 'Great advice, helped me a lot!', createdAt: new Date(Date.now() - 3600000).toISOString() }
    ],
    tags: ['tips', 'selling', 'pieconomy'],
    createdAt: new Date(Date.now() - 21600000).toISOString(),
    isSponsored: false,
    piWalletAddress: 'GBWWW333333333333333333',
  },
  {
    id: 'seed_5',
    userId: 'user_designer',
    username: 'Luna Designs',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=luna',
    content: '🎨 Offering custom logo & branding packages — accepting Pi!\n\nPackages start at π 15:\n• Basic Logo — π 15\n• Brand Identity — π 45\n• Full Brand Kit — π 90\n\nAll delivered within 48 hours. 100+ happy clients on Beagvs ⭐⭐⭐⭐⭐\n\nDrop your business name in the comments and I\'ll share a free concept sketch! 🖌️',
    images: ['https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80'],
    likes: ['user2', 'user4', 'user6', 'user8'],
    comments: [
      { id: 'c7', userId: 'u9', username: 'StartupFounder', text: 'PiCraft Marketplace — we need a logo! DMing you now 🙏', createdAt: new Date(Date.now() - 5400000).toISOString() },
      { id: 'c8', userId: 'u10', username: 'LocalBusiness', text: 'Just ordered the Brand Identity package. Can\'t wait!', createdAt: new Date(Date.now() - 1800000).toISOString() },
    ],
    tips: [],
    tags: ['design', 'logo', 'creative'],
    createdAt: new Date(Date.now() - 10800000).toISOString(),
    isSponsored: false,
    piWalletAddress: 'GBVVV444444444444444444',
  },
];

function timeAgo(dateStr: string) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function FeedPage() {
  const auth = useAuth();
  const user = auth?.user || null;
  const [posts, setPosts] = useState<any[]>([]);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'community' | 'popular' | 'sponsored'>('all');
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [showTipDialog, setShowTipDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [commentText, setCommentText] = useState('');
  const [tipAmount, setTipAmount] = useState('');
  const [tipNote, setTipNote] = useState('');
  const [tipProcessing, setTipProcessing] = useState(false);
  const [tipProgress, setTipProgress] = useState(0);
  const [newPostContent, setNewPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [sharePost, setSharePost] = useState<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('feed_posts');
      if (stored) {
        const parsed = JSON.parse(stored);
        setAllPosts(parsed);
        setPosts(parsed);
      } else {
        localStorage.setItem('feed_posts', JSON.stringify(SEED_POSTS));
        setAllPosts(SEED_POSTS);
        setPosts(SEED_POSTS);
      }
    } catch {
      setAllPosts(SEED_POSTS);
      setPosts(SEED_POSTS);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let filtered = [...allPosts];
    if (filter === 'community') filtered = allPosts.filter(p => !p.isSponsored);
    else if (filter === 'popular') filtered = [...allPosts].sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
    else if (filter === 'sponsored') filtered = allPosts.filter(p => p.isSponsored);
    setPosts(filtered);
  }, [filter, allPosts]);

  const savePosts = (updated: any[]) => {
    setAllPosts(updated);
    localStorage.setItem('feed_posts', JSON.stringify(updated));
  };

  const handleLike = (postId: string) => {
    if (!user) { toast.error('Please login to like posts'); return; }
    const updated = allPosts.map(post => {
      if (post.id !== postId) return post;
      const likes = post.likes || [];
      const hasLiked = likes.includes(user.id);
      return { ...post, likes: hasLiked ? likes.filter((id: string) => id !== user.id) : [...likes, user.id] };
    });
    savePosts(updated);
    const post = updated.find(p => p.id === postId);
    toast.success(post?.likes?.includes(user.id) ? '❤️ Liked!' : 'Unliked');
  };

  const handleComment = () => {
    if (!user) { toast.error('Please login to comment'); return; }
    if (!commentText.trim()) { toast.error('Please enter a comment'); return; }
    const newComment = {
      id: `comment_${Date.now()}`,
      userId: user.id,
      username: user.username,
      text: commentText,
      createdAt: new Date().toISOString(),
    };
    const updated = allPosts.map(post => {
      if (post.id !== selectedPost.id) return post;
      return { ...post, comments: [...(post.comments || []), newComment] };
    });
    savePosts(updated);
    setSelectedPost((prev: any) => ({ ...prev, comments: [...(prev.comments || []), newComment] }));
    setCommentText('');
    toast.success('💬 Comment posted!');
  };

  const handleTip = async () => {
    if (!user) { toast.error('Please login to tip'); return; }
    if (!tipAmount || parseFloat(tipAmount) <= 0) { toast.error('Enter a valid tip amount'); return; }
    setTipProcessing(true);
    setTipProgress(0);
    const interval = setInterval(() => setTipProgress(p => Math.min(p + 12, 90)), 200);
    await new Promise(r => setTimeout(r, 2000));
    clearInterval(interval);
    setTipProgress(100);
    const newTip = { id: `tip_${Date.now()}`, userId: user.id, username: user.username, amount: parseFloat(tipAmount), note: tipNote, createdAt: new Date().toISOString() };
    const updated = allPosts.map(post => post.id === selectedPost.id ? { ...post, tips: [...(post.tips || []), newTip] } : post);
    savePosts(updated);
    setTipAmount(''); setTipNote('');
    setTipProcessing(false); setTipProgress(0);
    setShowTipDialog(false);
    toast.success(`🎉 Tipped π ${tipAmount} to ${selectedPost.username}!`);
  };

  const handleCreatePost = async () => {
    if (!user) { toast.error('Please login to post'); return; }
    if (!newPostContent.trim()) { toast.error('Write something first!'); return; }
    setIsPosting(true);
    await new Promise(r => setTimeout(r, 600));
    const newPost = {
      id: `post_${Date.now()}`,
      userId: user.id,
      username: user.username || user.email?.split('@')[0] || 'User',
      userAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
      content: newPostContent,
      images: [],
      likes: [],
      comments: [],
      tips: [],
      tags: [],
      isSponsored: false,
      piWalletAddress: '',
      createdAt: new Date().toISOString(),
    };
    const updated = [newPost, ...allPosts];
    savePosts(updated);
    setNewPostContent('');
    setIsPosting(false);
    toast.success('🚀 Post published!');
  };

  const handleShare = (post: any) => {
    setSharePost(post);
  };

  const copyShareLink = () => {
    const url = `${window.location.origin}/feed#${sharePost.id}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
    setSharePost(null);
  };

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => {
      const next = new Set(prev);
      next.has(postId) ? next.delete(postId) : next.add(postId);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-2xl mx-auto px-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Community Feed</h1>
            <p className="text-muted-foreground text-sm mt-1">{allPosts.length} posts from the Pi community</p>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">Live</span>
          </div>
        </div>

        {/* Create Post */}
        {user ? (
          <Card className="mb-6 border-primary/20 shadow-sm">
            <CardContent className="pt-4">
              <div className="flex gap-3">
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} />
                  <AvatarFallback>{user.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    ref={textareaRef}
                    placeholder={`What's on your mind, ${user.username || 'Pioneer'}? Share a listing, tip, or update...`}
                    value={newPostContent}
                    onChange={e => setNewPostContent(e.target.value)}
                    rows={3}
                    className="resize-none border-0 bg-muted/50 focus-visible:ring-1 rounded-xl"
                  />
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="text-muted-foreground" disabled>
                        <ImageIcon className="h-4 w-4 mr-1" /> Photo
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground" disabled>
                        <Hash className="h-4 w-4 mr-1" /> Tag
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      onClick={handleCreatePost}
                      disabled={isPosting || !newPostContent.trim()}
                      className="px-5"
                    >
                      {isPosting ? (
                        <div className="flex items-center gap-2"><div className="animate-spin h-3 w-3 border border-white border-t-transparent rounded-full" /> Posting...</div>
                      ) : (
                        <><Send className="h-4 w-4 mr-1" /> Post</>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6 bg-primary/5 border-primary/20">
            <CardContent className="py-5 text-center">
              <p className="text-muted-foreground mb-3">Login to post, like, comment and tip Pi</p>
              <Button size="sm" asChild><a href="/login">Login to Join</a></Button>
            </CardContent>
          </Card>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
          {(['all', 'community', 'popular', 'sponsored'] as const).map(f => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f)}
              className="capitalize flex-shrink-0"
            >
              {f === 'popular' && <Flame className="h-3.5 w-3.5 mr-1" />}
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>

        {/* Posts */}
        {posts.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <MessageCircle className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">No posts yet</p>
              <p className="text-sm text-muted-foreground">Be the first to share something!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-5">
            {posts.map((post) => {
              const hasLiked = user && post.likes?.includes(user.id);
              const commentsExpanded = expandedComments.has(post.id);

              return (
                <Card key={post.id} id={post.id} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 ring-2 ring-background">
                          <AvatarImage src={post.userAvatar || '/placeholder.svg'} alt={post.username} />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {post.username?.[0]?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm leading-tight">{post.username}</p>
                          <p className="text-xs text-muted-foreground">{timeAgo(post.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {post.isSponsored && (
                          <Badge variant="secondary" className="text-xs">Sponsored</Badge>
                        )}
                        {post.tips?.length > 0 && (
                          <Badge variant="outline" className="text-xs text-amber-500 border-amber-500/30">
                            π {post.tips.reduce((s: number, t: any) => s + t.amount, 0)} tipped
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap mb-4">{post.content}</p>

                    {post.images && post.images.length > 0 && (
                      <div className="mb-4 rounded-xl overflow-hidden">
                        <img
                          src={post.images[0]}
                          alt="Post"
                          className="w-full max-h-80 object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}

                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {post.tags.map((tag: string) => (
                          <span key={tag} className="text-xs text-primary/70 bg-primary/10 px-2 py-0.5 rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-1 pt-3 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(post.id)}
                        className={`flex-1 gap-1.5 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors ${hasLiked ? 'text-red-500' : ''}`}
                      >
                        <Heart className={`h-4 w-4 transition-all ${hasLiked ? 'fill-red-500 scale-110' : ''}`} />
                        <span className="text-xs">{post.likes?.length || 0}</span>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedPost(post);
                          setShowCommentDialog(true);
                        }}
                        className="flex-1 gap-1.5 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span className="text-xs">{post.comments?.length || 0}</span>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setSelectedPost(post); setShowTipDialog(true); }}
                        className="flex-1 gap-1.5 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-colors"
                      >
                        <Coins className="h-4 w-4" />
                        <span className="text-xs">Tip</span>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShare(post)}
                        className="flex-1 gap-1.5 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-950/20 transition-colors"
                      >
                        <Share2 className="h-4 w-4" />
                        <span className="text-xs">Share</span>
                      </Button>
                    </div>

                    {/* Inline comments preview */}
                    {post.comments?.length > 0 && (
                      <div className="mt-3 pt-3 border-t space-y-2">
                        {(commentsExpanded ? post.comments : post.comments.slice(0, 2)).map((c: any) => (
                          <div key={c.id} className="flex gap-2 text-xs">
                            <span className="font-semibold text-primary">{c.username}</span>
                            <span className="text-muted-foreground">{c.text}</span>
                          </div>
                        ))}
                        {post.comments.length > 2 && (
                          <button
                            onClick={() => toggleComments(post.id)}
                            className="text-xs text-muted-foreground hover:text-primary transition-colors"
                          >
                            {commentsExpanded ? 'Show less' : `View all ${post.comments.length} comments`}
                          </button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Comment Dialog */}
      <Dialog open={showCommentDialog} onOpenChange={setShowCommentDialog}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
            <DialogDescription>{selectedPost?.comments?.length || 0} comment{selectedPost?.comments?.length !== 1 ? 's' : ''}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedPost?.comments && selectedPost.comments.length > 0 && (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {selectedPost.comments.map((comment: any) => (
                  <div key={comment.id} className="flex gap-3 p-3 bg-muted rounded-xl">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="text-xs">{comment.username?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{comment.username}</span>
                        <span className="text-xs text-muted-foreground">{timeAgo(comment.createdAt)}</span>
                      </div>
                      <p className="text-sm">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="border-t pt-4">
              <Label className="text-sm font-semibold">Add a comment</Label>
              <Textarea
                placeholder="Write your comment..."
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                rows={3}
                className="mt-2 resize-none"
                onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleComment(); }}
              />
              <p className="text-xs text-muted-foreground mt-1">Ctrl+Enter to post</p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setShowCommentDialog(false); setCommentText(''); }}>Close</Button>
              <Button onClick={handleComment} disabled={!commentText.trim()}>
                <Send className="h-4 w-4 mr-1" /> Post Comment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tip Dialog */}
      <Dialog open={showTipDialog} onOpenChange={setShowTipDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Pi Tip</DialogTitle>
            <DialogDescription>Support <strong>@{selectedPost?.username}</strong> with Pi</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-xl border">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs text-muted-foreground">Creator Pi Wallet</Label>
                <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => { navigator.clipboard.writeText(selectedPost?.piWalletAddress || 'GBXXXXXXXXXXXXXXXXXXXXX'); toast.success('Wallet copied!'); }}>
                  Copy
                </Button>
              </div>
              <div className="font-mono text-xs break-all text-muted-foreground">
                {selectedPost?.piWalletAddress || 'GBXXXXXXXXXXXXXXXXXXXXX'}
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl">
              <h4 className="font-semibold text-sm mb-3">How to tip with Pi:</h4>
              <ol className="space-y-1.5 text-sm text-muted-foreground">
                {['Copy the wallet address above', 'Open your Pi Network app', 'Tap "Send" and paste the address', 'Enter amount and confirm'].map((s, i) => (
                  <li key={i} className="flex gap-2"><span className="text-primary font-bold">{i + 1}.</span> {s}</li>
                ))}
              </ol>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[5, 10, 25].map(amt => (
                <Button key={amt} variant={tipAmount === String(amt) ? 'default' : 'outline'} size="sm" onClick={() => setTipAmount(String(amt))}>
                  π {amt}
                </Button>
              ))}
            </div>

            <div>
              <Label htmlFor="tip-amount">Custom Amount (Pi)</Label>
              <Input id="tip-amount" type="number" placeholder="Enter amount..." value={tipAmount} onChange={e => setTipAmount(e.target.value)} min="0.01" step="0.01" disabled={tipProcessing} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="tip-note">Note (optional)</Label>
              <Textarea id="tip-note" placeholder="Great post! Keep it up..." value={tipNote} onChange={e => setTipNote(e.target.value)} rows={2} disabled={tipProcessing} className="mt-1 resize-none" />
            </div>

            {tipProcessing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Processing...</span>
                  <span className="font-semibold">{tipProgress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${tipProgress}%` }} />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowTipDialog(false)} disabled={tipProcessing}>Cancel</Button>
              <Button onClick={handleTip} disabled={tipProcessing || !tipAmount} className="bg-amber-500 hover:bg-amber-600 text-black font-bold">
                <Coins className="h-4 w-4 mr-2" />
                {tipProcessing ? 'Sending...' : `Tip π ${tipAmount || '...'}`}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={!!sharePost} onOpenChange={() => setSharePost(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Share Post</DialogTitle>
            <DialogDescription>Share this post with others</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Button className="w-full" variant="outline" onClick={copyShareLink}>
              <Share2 className="h-4 w-4 mr-2" /> Copy Link
            </Button>
            <Button className="w-full bg-[#1877f2] hover:bg-[#166fe5] text-white" onClick={() => { window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin + '/feed')}`, '_blank'); setSharePost(null); }}>
              Share on Facebook
            </Button>
            <Button className="w-full bg-[#1da1f2] hover:bg-[#0d95e8] text-white" onClick={() => { window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(sharePost?.content?.slice(0, 100) + '... via @Beagvs')}&url=${encodeURIComponent(window.location.origin + '/feed')}`, '_blank'); setSharePost(null); }}>
              Share on X (Twitter)
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
