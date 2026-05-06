'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2, Coins } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

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
  const [showComments, setShowComments] = useState(false);
  const [tipTimer, setTipTimer] = useState(30);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('feed_posts');
        console.log('[v0] Feed - Loading posts from localStorage');
        
        if (stored) {
          const parsedPosts = JSON.parse(stored);
          console.log('[v0] Feed - Found posts:', parsedPosts.length);
          setAllPosts(parsedPosts);
          setPosts(parsedPosts);
        } else {
          console.log('[v0] Feed - No posts found');
          setAllPosts([]);
          setPosts([]);
        }
      } catch (error) {
        console.error('[v0] Feed - Error loading posts:', error);
        setAllPosts([]);
        setPosts([]);
      }
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Tip instructions timer
    if (showInstructions && tipTimer > 0) {
      const interval = setInterval(() => {
        setTipTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
    if (tipTimer === 0) {
      setShowInstructions(false);
      setTipTimer(30);
    }
  }, [showInstructions, tipTimer]);

  useEffect(() => {
    // Apply filter
    let filtered = [...allPosts];
    
    if (filter === 'community') {
      filtered = allPosts.filter(p => !p.isSponsored);
    } else if (filter === 'popular') {
      filtered = allPosts.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
    } else if (filter === 'sponsored') {
      filtered = allPosts.filter(p => p.isSponsored);
    }
    
    setPosts(filtered);
  }, [filter, allPosts]);

  const handleLike = (postId: string) => {
    if (!user) {
      toast.error('Please login to like posts');
      return;
    }

    const updatedPosts = allPosts.map(post => {
      if (post.id === postId) {
        const likes = post.likes || [];
        const hasLiked = likes.includes(user.id);
        
        return {
          ...post,
          likes: hasLiked 
            ? likes.filter((id: string) => id !== user.id)
            : [...likes, user.id]
        };
      }
      return post;
    });

    setAllPosts(updatedPosts);
    localStorage.setItem('feed_posts', JSON.stringify(updatedPosts));
    toast.success(updatedPosts.find(p => p.id === postId)?.likes?.includes(user.id) ? 'Liked!' : 'Unliked');
  };

  const handleComment = () => {
    if (!user) {
      toast.error('Please login to comment');
      return;
    }
    if (!commentText.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    const newComment = {
      id: `comment_${Date.now()}`,
      userId: user.id,
      username: user.username,
      text: commentText,
      createdAt: new Date().toISOString(),
    };

    const updatedPosts = allPosts.map(post => {
      if (post.id === selectedPost.id) {
        return {
          ...post,
          comments: [...(post.comments || []), newComment]
        };
      }
      return post;
    });

    setAllPosts(updatedPosts);
    localStorage.setItem('feed_posts', JSON.stringify(updatedPosts));
    setCommentText('');
    setShowCommentDialog(false);
    toast.success('Comment added!');
  };

  const handleTip = async () => {
    if (!user) {
      toast.error('Please login to tip');
      return;
    }
    if (!tipAmount || parseFloat(tipAmount) <= 0) {
      toast.error('Please enter a valid tip amount');
      return;
    }

    setTipProcessing(true);
    setTipProgress(0);

    // Simulate payment processing with progress
    const progressInterval = setInterval(() => {
      setTipProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate Pi payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setTipProgress(100);

    const newTip = {
      id: `tip_${Date.now()}`,
      userId: user.id,
      username: user.username,
      amount: parseFloat(tipAmount),
      note: tipNote,
      createdAt: new Date().toISOString(),
    };

    const updatedPosts = allPosts.map(post => {
      if (post.id === selectedPost.id) {
        return {
          ...post,
          tips: [...(post.tips || []), newTip]
        };
      }
      return post;
    });

    setAllPosts(updatedPosts);
    localStorage.setItem('feed_posts', JSON.stringify(updatedPosts));
    
    clearInterval(progressInterval);
    setTipAmount('');
    setTipNote('');
    setTipProcessing(false);
    setTipProgress(0);
    setShowTipDialog(false);
    toast.success(`Successfully tipped π ${tipAmount} to ${selectedPost.username}!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Community Feed</h1>
        
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All Posts
          </Button>
          <Button 
            variant={filter === 'community' ? 'default' : 'outline'}
            onClick={() => setFilter('community')}
          >
            Community
          </Button>
          <Button 
            variant={filter === 'popular' ? 'default' : 'outline'}
            onClick={() => setFilter('popular')}
          >
            Popular
          </Button>
          <Button 
            variant={filter === 'sponsored' ? 'default' : 'outline'}
            onClick={() => setFilter('sponsored')}
          >
            Sponsored
          </Button>
        </div>
        
        {posts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No posts yet</p>
              <p className="text-sm text-muted-foreground">Be the first to create a post!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={post.userAvatar || "/placeholder.svg"} alt={post.username} />
                      <AvatarFallback>{post.username?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{post.username}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 whitespace-pre-wrap">{post.content}</p>
                  
                  {post.images && post.images.length > 0 && (
                    <div className="mb-4 rounded-lg overflow-hidden">
                      <img 
                        src={post.images[0] || "/placeholder.svg"} 
                        alt="Post" 
                        className="w-full max-h-96 object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 pt-4 border-t flex-wrap">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleLike(post.id)}
                    >
                      <Heart className={`h-4 w-4 mr-1 ${post.likes?.includes(user?.id) ? 'fill-red-500 text-red-500' : ''}`} />
                      {post.likes?.length || 0}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedPost(post);
                        setShowCommentDialog(true);
                      }}
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {post.comments?.length || 0}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedPost(post);
                        setShowTipDialog(true);
                      }}
                    >
                      <Coins className="h-4 w-4 mr-1" />
                      Tip
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Comment Dialog */}
        <Dialog open={showCommentDialog} onOpenChange={setShowCommentDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Comments</DialogTitle>
              <DialogDescription>
                {selectedPost?.comments?.length || 0} comment{selectedPost?.comments?.length !== 1 ? 's' : ''}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Existing Comments */}
              {selectedPost?.comments && selectedPost.comments.length > 0 && (
                <div className="space-y-4 mb-4 max-h-60 overflow-y-auto">
                  {selectedPost.comments.map((comment: any) => (
                    <div key={comment.id} className="flex gap-3 p-3 bg-muted rounded-lg">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{comment.username?.[0] || 'U'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">{comment.username}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Comment Form */}
              <div className="border-t pt-4">
                <Label>Add your comment</Label>
                <Textarea
                  placeholder="Write your comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={3}
                  className="mt-2"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => {
                  setShowCommentDialog(false);
                  setCommentText('');
                }}>
                  Close
                </Button>
                <Button onClick={handleComment} disabled={!commentText.trim()}>
                  Post Comment
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Tip Dialog */}
        <Dialog open={showTipDialog} onOpenChange={setShowTipDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Pi Tip</DialogTitle>
              <DialogDescription>
                Support @{selectedPost?.username} with Pi
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Creator Wallet Display with Copy */}
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs text-muted-foreground">Creator's Pi Wallet</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedPost?.piWalletAddress || 'GBXXXXXXXXXXXXXXXXXXXXX');
                      toast.success('Wallet address copied!');
                    }}
                  >
                    Copy
                  </Button>
                </div>
                <div className="font-mono text-sm break-all">
                  {selectedPost?.piWalletAddress || 'GBXXXXXXXXXXXXXXXXXXXXX'}
                </div>
              </div>

              {/* How to Tip Instructions */}
              {!showInstructions && (
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => setShowInstructions(true)}
                >
                  How to Tip? (30s Tutorial)
                </Button>
              )}

              {showInstructions && (
                <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-sm">How to Send Pi Tips</h4>
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                      {tipTimer}s
                    </span>
                  </div>
                  <ol className="space-y-2 text-sm">
                    <li className="flex gap-2">
                      <span className="font-bold">1.</span>
                      <span>Copy the creator's wallet address above</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">2.</span>
                      <span>Open your Pi Network app</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">3.</span>
                      <span>Tap "Send" and paste the wallet address</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">4.</span>
                      <span>Enter the amount you want to tip</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">5.</span>
                      <span>Add a note (optional) and confirm payment</span>
                    </li>
                  </ol>
                </div>
              )}

              {/* Tip Amount */}
              <div>
                <Label htmlFor="tip-amount">Tip Amount (Pi)</Label>
                <Input
                  id="tip-amount"
                  type="number"
                  placeholder="5.00"
                  value={tipAmount}
                  onChange={(e) => setTipAmount(e.target.value)}
                  min="0.01"
                  step="0.01"
                  disabled={tipProcessing}
                />
              </div>

              {/* Tip Note */}
              <div>
                <Label htmlFor="tip-note">Note (optional)</Label>
                <Textarea
                  id="tip-note"
                  placeholder="Great post! Keep up the good work..."
                  value={tipNote}
                  onChange={(e) => setTipNote(e.target.value)}
                  rows={2}
                  disabled={tipProcessing}
                />
              </div>

              {/* Processing Progress */}
              {tipProcessing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processing payment...</span>
                    <span>{tipProgress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${tipProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowTipDialog(false)}
                  disabled={tipProcessing}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleTip}
                  disabled={tipProcessing || !tipAmount}
                >
                  <Coins className="h-4 w-4 mr-2" />
                  {tipProcessing ? 'Sending...' : 'Send Tip'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
