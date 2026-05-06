'use client';

import React from "react"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, UserPlus, UserMinus, MessageSquare, MapPin, Calendar, Link2, Coins, PlusCircle, ImageIcon, Heart, BadgeCheck, Star, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { AccountVerificationDialog } from '@/components/account-verification-dialog';

export default function ProfilePage({ params }: { params: { username: string } }) {
  const router = useRouter();
  const auth = useAuth();
  const [loading, setLoading] = useState(true);
  const [profileUser, setProfileUser] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [showPostDialog, setShowPostDialog] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [postImage, setPostImage] = useState('');
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [showTipDialog, setShowTipDialog] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [tipAmount, setTipAmount] = useState('');
  const [tipNote, setTipNote] = useState('');
  const [tipProcessing, setTipProcessing] = useState(false);
  const [tipProgress, setTipProgress] = useState(0);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [showFollowersDialog, setShowFollowersDialog] = useState(false);
  const [showFollowingDialog, setShowFollowingDialog] = useState(false);
  const [followersList, setFollowersList] = useState<any[]>([]);
  const [followingList, setFollowingList] = useState<any[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPostImage(reader.result as string);
        toast.success('Image uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };
  
  const currentUser = auth?.user || null;
  const isAuthenticated = auth?.isAuthenticated || false;
  
  useEffect(() => {
    console.log('[v0] Loading profile:', params.username);
    console.log('[v0] Current user:', currentUser);
    
    setLoading(true);
    
    // Restore backed up data if needed
    if (typeof window !== 'undefined') {
      const backupPrefix = 'beagvs_backup_';
      const keysToRestore = ['feed_posts', 'beagvs_users'];
      keysToRestore.forEach(key => {
        const current = localStorage.getItem(key);
        const backup = localStorage.getItem(`${backupPrefix}${key}`);
        if ((!current || current === '[]' || current === 'null') && backup) {
          console.log(`[v0] Restoring ${key} from backup`);
          localStorage.setItem(key, backup);
        }
      });
    }
    
    try {
      // Check if viewing own profile
      if (currentUser && (
        currentUser.username === params.username || 
        currentUser.email?.split('@')[0] === params.username ||
        currentUser.id === params.username
      )) {
        console.log('[v0] Loading own profile for user:', currentUser);
        setProfileUser(currentUser);
        
        // Load user posts
        if (typeof window !== 'undefined') {
          const posts = JSON.parse(localStorage.getItem('feed_posts') || '[]');
          console.log('[v0] All feed posts:', posts);
          const userPostsFiltered = posts.filter((p: any) => 
            p.userId === currentUser.id || p.username === currentUser.username
          );
          console.log('[v0] Filtered posts for user:', userPostsFiltered);
          setUserPosts(userPostsFiltered);
        }
        
        setLoading(false);
        return;
      }

      // Search for other users
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('beagvs_users');
        if (stored) {
          const users = JSON.parse(stored);
          const found = users.find((u: any) => 
            u.username === params.username || 
            u.email?.split('@')[0] === params.username
          );
          
          if (found) {
            setProfileUser(found);
            
            // Load user posts
            const posts = JSON.parse(localStorage.getItem('feed_posts') || '[]');
            const userPostsFiltered = posts.filter((p: any) => 
              p.userId === found.id || p.username === found.username
            );
            console.log('[v0] Loaded posts for user:', userPostsFiltered);
            setUserPosts(userPostsFiltered);
          } else {
            setProfileUser(null);
          }
        }
      }
    } catch (error) {
      console.error('[v0] Error loading profile:', error);
      setProfileUser(null);
    } finally {
      setLoading(false);
    }
  }, [params.username, currentUser]);

  const handleCreatePost = () => {
    if (!currentUser || !postContent.trim()) {
      toast.error('Please enter post content');
      return;
    }

    try {
      const newPost = {
        id: `post_${Date.now()}`,
        userId: currentUser.id,
        username: currentUser.username,
        userAvatar: currentUser.avatar || currentUser.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.username}`,
        piWalletAddress: currentUser.piWalletAddress || 'GBXXXXXXXXXXXXXXXXXXXXX',
        content: postContent,
        images: postImage ? [postImage] : [],
        likes: [],
        comments: [],
        tips: [],
        isSponsored: false,
        popularity: 0,
        timestamp: new Date(),
        createdAt: new Date().toISOString(),
      };

      // Save to feed_posts
      const posts = JSON.parse(localStorage.getItem('feed_posts') || '[]');
      posts.unshift(newPost);
      localStorage.setItem('feed_posts', JSON.stringify(posts));
      
      // Force immediate backup
      localStorage.setItem('beagvs_backup_feed_posts', JSON.stringify(posts));
      
      console.log('[v0] Post saved to feed_posts:', newPost);
      console.log('[v0] Total posts now:', posts.length);
      
      // Update local state
      setUserPosts([newPost, ...userPosts]);
      setPostContent('');
      setPostImage('');
      setShowPostDialog(false);
      
      toast.success('Post created successfully and added to feed!');
    } catch (error) {
      console.error('[v0] Error creating post:', error);
      toast.error('Failed to create post');
    }
  };

  const handleFollow = () => {
    if (!isAuthenticated || !currentUser || !profileUser) {
      toast.error('Please login to follow users');
      return;
    }
    
    try {
      const stored = localStorage.getItem('beagvs_users');
      if (stored) {
        const users = JSON.parse(stored);
        const updatedUsers = users.map((u: any) => {
          // Add follower to profile user
          if (u.id === profileUser.id) {
            const followers = u.followers || [];
            return {
              ...u,
              followers: isFollowing 
                ? followers.filter((id: string) => id !== currentUser.id)
                : [...followers, currentUser.id]
            };
          }
          // Add following to current user
          if (u.id === currentUser.id) {
            const following = u.following || [];
            return {
              ...u,
              following: isFollowing
                ? following.filter((id: string) => id !== profileUser.id)
                : [...following, profileUser.id]
            };
          }
          return u;
        });
        
        localStorage.setItem('beagvs_users', JSON.stringify(updatedUsers));
        
        // Force backup of updated user data
        localStorage.setItem('beagvs_backup_beagvs_users', JSON.stringify(updatedUsers));
        
        // Update profile user state to reflect changes immediately
        const updatedProfileUser = updatedUsers.find((u: any) => u.id === profileUser.id);
        if (updatedProfileUser) {
          setProfileUser(updatedProfileUser);
        }
        
        setIsFollowing(!isFollowing);
        toast.success(isFollowing ? 'Unfollowed user' : 'Following user');
      }
    } catch (error) {
      console.error('[v0] Error updating follow:', error);
      toast.error('Failed to update follow status');
    }
  };

  const handleComment = () => {
    if (!currentUser) {
      toast.error('Please login to comment');
      return;
    }
    if (!commentText.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    const newComment = {
      id: `comment_${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      text: commentText,
      createdAt: new Date().toISOString(),
    };

    const posts = JSON.parse(localStorage.getItem('feed_posts') || '[]');
    const updatedPosts = posts.map((p: any) => {
      if (p.id === selectedPost.id) {
        return {
          ...p,
          comments: [...(p.comments || []), newComment]
        };
      }
      return p;
    });

    localStorage.setItem('feed_posts', JSON.stringify(updatedPosts));
    setUserPosts(updatedPosts.filter((p: any) => p.userId === profileUser.id || p.username === profileUser.username));
    setCommentText('');
    setShowCommentDialog(false);
    toast.success('Comment added!');
  };

  const handleTip = async () => {
    if (!currentUser) {
      toast.error('Please login to tip');
      return;
    }
    if (!tipAmount || parseFloat(tipAmount) <= 0) {
      toast.error('Please enter a valid tip amount');
      return;
    }

    setTipProcessing(true);
    setTipProgress(0);

    const progressInterval = setInterval(() => {
      setTipProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    await new Promise(resolve => setTimeout(resolve, 2000));
    setTipProgress(100);

    const newTip = {
      id: `tip_${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      amount: parseFloat(tipAmount),
      note: tipNote,
      createdAt: new Date().toISOString(),
    };

    const posts = JSON.parse(localStorage.getItem('feed_posts') || '[]');
    const updatedPosts = posts.map((p: any) => {
      if (p.id === selectedPost.id) {
        return {
          ...p,
          tips: [...(p.tips || []), newTip]
        };
      }
      return p;
    });

    localStorage.setItem('feed_posts', JSON.stringify(updatedPosts));
    setUserPosts(updatedPosts.filter((p: any) => p.userId === profileUser.id || p.username === profileUser.username));
    
    clearInterval(progressInterval);
    setTipAmount('');
    setTipNote('');
    setTipProcessing(false);
    setTipProgress(0);
    setShowTipDialog(false);
    toast.success(`Successfully tipped π ${tipAmount}!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>User Not Found</CardTitle>
            <CardDescription>The profile you're looking for doesn't exist.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/')} className="w-full">
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === profileUser.id;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage 
                    src={
                      profileUser.avatar || 
                      profileUser.profilePicture || 
                      profileUser.profileImage ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileUser.username}`
                    } 
                  />
                  <AvatarFallback className="text-2xl">{profileUser.username?.[0]}</AvatarFallback>
                </Avatar>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-bold">{profileUser.username}</h1>
                      {profileUser.verified && (
                        <div className="relative inline-flex">
                          <BadgeCheck className="h-7 w-7 text-blue-500 fill-blue-500" />
                          <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                        </div>
                      )}
                    </div>
                    <p className="text-muted-foreground">{profileUser.email}</p>
                  </div>
                  
                  <div className="flex gap-2 mt-4 md:mt-0 flex-wrap">
                    {isOwnProfile ? (
                      <>
                        <Button onClick={() => setShowPostDialog(true)}>
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Create Post
                        </Button>
                        {!profileUser.verified && (
                          <Button 
                            onClick={() => setShowVerificationDialog(true)}
                            variant="outline"
                            className="border-blue-500 text-blue-500 hover:bg-blue-50"
                          >
                            <BadgeCheck className="h-4 w-4 mr-2" />
                            Get Verified
                          </Button>
                        )}
                        <Button onClick={() => router.push('/dashboard/settings')} variant="outline">
                          <Settings className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button onClick={handleFollow} variant={isFollowing ? 'outline' : 'default'}>
                          {isFollowing ? (
                            <>
                              <UserMinus className="h-4 w-4 mr-2" />
                              Unfollow
                            </>
                          ) : (
                            <>
                              <UserPlus className="h-4 w-4 mr-2" />
                              Follow
                            </>
                          )}
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => router.push(`/messages?user=${profileUser.username}`)}
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex gap-6 mb-4 flex-wrap">
                  <button 
                    onClick={() => {
                      const users = JSON.parse(localStorage.getItem('beagvs_users') || '[]');
                      const followers = (profileUser.followers || []).map((id: string) => 
                        users.find((u: any) => u.id === id)
                      ).filter(Boolean);
                      setFollowersList(followers);
                      setShowFollowersDialog(true);
                    }}
                    className="text-center hover:bg-muted/50 px-3 py-2 rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="font-bold">{profileUser.followers?.length || 0}</div>
                    <div className="text-sm text-muted-foreground">Followers</div>
                  </button>
                  <button 
                    onClick={() => {
                      const users = JSON.parse(localStorage.getItem('beagvs_users') || '[]');
                      const following = (profileUser.following || []).map((id: string) => 
                        users.find((u: any) => u.id === id)
                      ).filter(Boolean);
                      setFollowingList(following);
                      setShowFollowingDialog(true);
                    }}
                    className="text-center hover:bg-muted/50 px-3 py-2 rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="font-bold">{profileUser.following?.length || 0}</div>
                    <div className="text-sm text-muted-foreground">Following</div>
                  </button>
                  <div className="text-center">
                    <div className="font-bold">{userPosts.length}</div>
                    <div className="text-sm text-muted-foreground">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold flex items-center gap-1 justify-center">
                      <Coins className="h-4 w-4 text-yellow-500" />
                      {(() => {
                        const totalTips = userPosts.reduce((sum, post) => {
                          const postTips = post.tips || [];
                          return sum + postTips.reduce((tipSum: number, tip: any) => tipSum + (tip.amount || 0), 0);
                        }, 0);
                        return totalTips.toFixed(2);
                      })()}
                    </div>
                    <div className="text-sm text-muted-foreground">Tips Received</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold flex items-center gap-1 justify-center">
                      <Coins className="h-4 w-4 text-yellow-500" />
                      {profileUser.totalPoints || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Pi Earned</div>
                  </div>
                </div>

                <p className="text-sm mb-4">{profileUser.bio || 'No bio yet'}</p>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {profileUser.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {profileUser.location}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Joined {new Date(profileUser.createdAt || Date.now()).toLocaleDateString()}
                  </div>
                  <Badge variant="secondary">{profileUser.role}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Posts Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Posts</CardTitle>
            <CardDescription>
              {userPosts.length} {userPosts.length === 1 ? 'post' : 'posts'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userPosts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No posts yet</p>
                {isOwnProfile && (
                  <Button 
                    onClick={() => setShowPostDialog(true)} 
                    className="mt-4"
                    variant="outline"
                  >
                    Create your first post
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {userPosts.map((post) => (
                  <Card key={post.id} className="border-l-4 border-l-primary overflow-hidden">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3 mb-3">
                        <Avatar className="flex-shrink-0">
                          <AvatarImage src={post.userAvatar || "/placeholder.svg"} />
                          <AvatarFallback>{post.username?.[0] || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="font-semibold truncate">{post.username}</span>
                            <span className="text-sm text-muted-foreground flex-shrink-0">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm mb-3 whitespace-pre-wrap break-words overflow-wrap-anywhere">{post.content}</p>
                          {post.images && post.images.length > 0 && (
                            <div className="mb-3 rounded-lg overflow-hidden">
                              <img 
                                src={post.images[0] || "/placeholder.svg"} 
                                alt="Post image" 
                                className="w-full max-h-96 object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-3 border-t flex-wrap">
                        <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (!currentUser) {
                                  toast.error('Please login to like posts');
                                  return;
                                }
                                const posts = JSON.parse(localStorage.getItem('feed_posts') || '[]');
                                const updated = posts.map((p: any) => {
                                  if (p.id === post.id) {
                                    const likes = p.likes || [];
                                    const hasLiked = likes.includes(currentUser.id);
                                    return {
                                      ...p,
                                      likes: hasLiked ? likes.filter((id: string) => id !== currentUser.id) : [...likes, currentUser.id]
                                    };
                                  }
                                  return p;
                                });
                                localStorage.setItem('feed_posts', JSON.stringify(updated));
                                setUserPosts(updated.filter((p: any) => p.userId === currentUser.id || p.username === currentUser.username));
                                toast.success('Updated!');
                              }}
                            >
                              <Heart className={`h-4 w-4 mr-1 ${post.likes?.includes(currentUser?.id) ? 'fill-red-500 text-red-500' : ''}`} />
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
                              <MessageSquare className="h-4 w-4 mr-1" />
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
                              <Coins className="h-4 w-4 mr-1 text-yellow-500" />
                              Tip
                              {post.tips && post.tips.length > 0 && (
                                <span className="ml-1 text-yellow-600 font-semibold">
                                  π {post.tips.reduce((sum: number, tip: any) => sum + (tip.amount || 0), 0).toFixed(2)}
                                </span>
                              )}
                            </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Post Dialog */}
      <Dialog open={showPostDialog} onOpenChange={setShowPostDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Post</DialogTitle>
            <DialogDescription>Share your thoughts with your followers</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="post-content">Content</Label>
              <Textarea
                id="post-content"
                placeholder="What's on your mind?"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="post-image">Image (optional)</Label>
              <div className="space-y-2">
                <Input
                  id="post-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="cursor-pointer"
                />
                {postImage && (
                  <div className="relative rounded-lg overflow-hidden border">
                    <img src={postImage || "/placeholder.svg"} alt="Preview" className="w-full h-48 object-cover" />
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
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowPostDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePost}>
                Publish Post
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
                      <p className="text-sm break-words">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

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

      {/* Account Verification Dialog */}
      {isOwnProfile && currentUser && (
        <AccountVerificationDialog
          open={showVerificationDialog}
          onOpenChange={setShowVerificationDialog}
          userId={currentUser.id}
          username={currentUser.username}
          userEmail={currentUser.email}
        />
      )}

      {/* Followers Dialog */}
      <Dialog open={showFollowersDialog} onOpenChange={setShowFollowersDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Followers</DialogTitle>
            <DialogDescription>
              {followersList.length} {followersList.length === 1 ? 'follower' : 'followers'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {followersList.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No followers yet</p>
            ) : (
              followersList.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar || user.profilePicture || `/placeholder.svg`} />
                      <AvatarFallback>{user.username?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold flex items-center gap-1">
                        {user.username}
                        {user.verified && (
                          <div className="relative inline-flex">
                            <BadgeCheck className="h-4 w-4 text-blue-500 fill-blue-500" />
                            <Star className="h-2 w-2 text-yellow-400 fill-yellow-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                          </div>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {currentUser && user.id !== currentUser.id && (
                      <>
                        <Button
                          size="sm"
                          variant={currentUser.following?.includes(user.id) ? "outline" : "default"}
                          onClick={() => {
                            const users = JSON.parse(localStorage.getItem('beagvs_users') || '[]');
                            const isFollowing = currentUser.following?.includes(user.id);
                            const updatedUsers = users.map((u: any) => {
                              if (u.id === user.id) {
                                const followers = u.followers || [];
                                return {
                                  ...u,
                                  followers: isFollowing 
                                    ? followers.filter((id: string) => id !== currentUser.id)
                                    : [...followers, currentUser.id]
                                };
                              }
                              if (u.id === currentUser.id) {
                                const following = u.following || [];
                                return {
                                  ...u,
                                  following: isFollowing
                                    ? following.filter((id: string) => id !== user.id)
                                    : [...following, user.id]
                                };
                              }
                              return u;
                            });
                            localStorage.setItem('beagvs_users', JSON.stringify(updatedUsers));
                            localStorage.setItem('beagvs_backup_beagvs_users', JSON.stringify(updatedUsers));
                            toast.success(isFollowing ? 'Unfollowed' : 'Following');
                          }}
                        >
                          {currentUser.following?.includes(user.id) ? 'Unfollow' : 'Follow'}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => router.push(`/messages?user=${user.username}`)}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Following Dialog */}
      <Dialog open={showFollowingDialog} onOpenChange={setShowFollowingDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Following</DialogTitle>
            <DialogDescription>
              Following {followingList.length} {followingList.length === 1 ? 'user' : 'users'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {followingList.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Not following anyone yet</p>
            ) : (
              followingList.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar || user.profilePicture || `/placeholder.svg`} />
                      <AvatarFallback>{user.username?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold flex items-center gap-1">
                        {user.username}
                        {user.verified && (
                          <div className="relative inline-flex">
                            <BadgeCheck className="h-4 w-4 text-blue-500 fill-blue-500" />
                            <Star className="h-2 w-2 text-yellow-400 fill-yellow-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                          </div>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {currentUser && user.id !== currentUser.id && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const users = JSON.parse(localStorage.getItem('beagvs_users') || '[]');
                            const updatedUsers = users.map((u: any) => {
                              if (u.id === user.id) {
                                const followers = u.followers || [];
                                return {
                                  ...u,
                                  followers: followers.filter((id: string) => id !== currentUser.id)
                                };
                              }
                              if (u.id === currentUser.id) {
                                const following = u.following || [];
                                return {
                                  ...u,
                                  following: following.filter((id: string) => id !== user.id)
                                };
                              }
                              return u;
                            });
                            localStorage.setItem('beagvs_users', JSON.stringify(updatedUsers));
                            localStorage.setItem('beagvs_backup_beagvs_users', JSON.stringify(updatedUsers));
                            toast.success('Unfollowed');
                          }}
                        >
                          Unfollow
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => router.push(`/messages?user=${user.username}`)}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
