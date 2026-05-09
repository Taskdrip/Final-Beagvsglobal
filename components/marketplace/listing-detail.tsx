"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Package, Shield, Truck, User, Heart, MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Listing } from '@/lib/database-types';
import { useCart } from '@/contexts/cart-context';
import { toast } from 'sonner';
import { ChatDialog } from '@/components/chat/chat-dialog';
import { ReviewsSection } from '@/components/reviews/reviews-section';
import { Input } from '@/components/ui/input';

interface ListingDetailProps {
  listing: Listing;
}

export function ListingDetail({ listing }: ListingDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem } = useCart();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(listing.likes?.length || 0);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Array<{ id: string; userId: string; username: string; comment: string; createdAt: Date }>>([
    { id: '1', userId: 'user1', username: 'John Doe', comment: 'Great product! Highly recommend.', createdAt: new Date('2024-01-25') },
    { id: '2', userId: 'user2', username: 'Jane Smith', comment: 'Fast delivery and excellent quality.', createdAt: new Date('2024-01-26') },
  ]);

  const handleAddToCart = () => {
    addItem(listing);
    toast.success('Added to cart', {
      description: `${listing.title} has been added to your cart.`,
    });
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    toast.success(isLiked ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleCommentSubmit = () => {
    if (!comment.trim()) return;
    
    const newComment = {
      id: Date.now().toString(),
      userId: 'current_user',
      username: 'You',
      comment: comment.trim(),
      createdAt: new Date(),
    };
    
    setComments([newComment, ...comments]);
    setComment('');
    toast.success('Comment posted');
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link href="/marketplace" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Marketplace
        </Link>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            <img
              src={listing.images[selectedImage] || '/placeholder.svg'}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          </div>
          {listing.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {listing.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-muted rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img src={image || "/placeholder.svg"} alt={`${listing.title} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <h1 className="text-3xl font-bold text-balance">{listing.title}</h1>
              {listing.isFeatured && <Badge>Featured</Badge>}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="capitalize">{listing.type}</Badge>
              <Badge variant="secondary">{listing.category}</Badge>
            </div>
          </div>

          <div className="text-4xl font-bold">{listing.priceInPi} π</div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed">{listing.description}</p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-3">Delivery Options</h3>
            <div className="flex flex-wrap gap-2">
              {listing.deliveryMethods.map(method => (
                <Badge key={method} variant="secondary" className="capitalize">
                  {method}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <Button onClick={handleAddToCart} size="lg" className="w-full">
              Add to Cart
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button asChild variant="outline" size="lg" className="bg-transparent">
                <Link href="/cart">View Cart</Link>
              </Button>
              <ChatDialog 
                listingId={listing.id} 
                sellerId={listing.sellerId} 
                sellerName="Seller" 
              />
            </div>
            
            {/* Social Actions */}
            <div className="flex items-center gap-2 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLike}
                className={`bg-transparent ${isLiked ? 'text-red-500 border-red-500' : ''}`}
              >
                <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
              </Button>
              <Button variant="outline" size="sm" className="bg-transparent">
                <MessageSquare className="h-4 w-4 mr-2" />
                {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <Shield className="h-8 w-8 text-primary mb-2" />
            <CardTitle className="text-lg">Escrow Protected</CardTitle>
            <CardDescription>
              Your payment is held securely until you confirm delivery or service completion.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Package className="h-8 w-8 text-primary mb-2" />
            <CardTitle className="text-lg">Tracked Delivery</CardTitle>
            <CardDescription>
              Track your order every step of the way with real-time shipping updates.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <User className="h-8 w-8 text-primary mb-2" />
            <CardTitle className="text-lg">Verified Sellers</CardTitle>
            <CardDescription>
              All sellers are verified through Pi Network authentication for your security.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Comments Section */}
      <div className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Comments</CardTitle>
            <CardDescription>Join the conversation about this listing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Comment Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}
              />
              <Button onClick={handleCommentSubmit}>
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((c) => (
                <div key={c.id} className="flex gap-3 p-4 bg-muted rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{c.username}</span>
                      <span className="text-xs text-muted-foreground">
                        {c.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm">{c.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews Section */}
      <div className="mt-8">
        <ReviewsSection listingId={listing.id} />
      </div>
    </div>
  );
}
