"use client";

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import type { Review } from '@/lib/database-types';

interface ReviewsSectionProps {
  listingId: string;
}

export function ReviewsSection({ listingId }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    loadReviews();
  }, [listingId]);

  const loadReviews = async () => {
    try {
      // Mock data - in production, fetch from API
      const mockReviews: Review[] = [
        {
          id: '1',
          listingId,
          orderId: 'order_1',
          buyerId: 'buyer_1',
          sellerId: 'seller_1',
          rating: 5,
          comment: 'Excellent product! Exactly as described and shipped quickly.',
          createdAt: new Date(Date.now() - 86400000),
        },
        {
          id: '2',
          listingId,
          orderId: 'order_2',
          buyerId: 'buyer_2',
          sellerId: 'seller_1',
          rating: 4,
          comment: 'Good quality, minor wear but overall satisfied.',
          createdAt: new Date(Date.now() - 172800000),
        },
        {
          id: '3',
          listingId,
          orderId: 'order_3',
          buyerId: 'buyer_3',
          sellerId: 'seller_1',
          rating: 5,
          comment: 'Amazing! Would definitely buy from this seller again.',
          createdAt: new Date(Date.now() - 259200000),
        },
      ];

      setReviews(mockReviews);
      
      // Calculate average
      if (mockReviews.length > 0) {
        const avg = mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length;
        setAverageRating(avg);
      }
    } catch (error) {
      console.error('[v0] Load reviews error:', error);
    }
  };

  const renderStars = (rating: number, size: 'sm' | 'lg' = 'sm') => {
    const sizeClass = size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-muted-foreground'
            }`}
          />
        ))}
      </div>
    );
  };

  if (reviews.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No reviews yet. Be the first to review this item!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Reviews</CardTitle>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-2">
            {renderStars(Math.round(averageRating), 'lg')}
            <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
          </div>
          <span className="text-muted-foreground">
            Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {reviews.map((review, index) => (
          <div key={review.id}>
            {index > 0 && <Separator className="mb-6" />}
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>U{review.buyerId.slice(-1)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Buyer {review.buyerId.slice(-4)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {renderStars(review.rating)}
                      <span className="text-sm text-muted-foreground">
                        {review.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {review.comment && (
                <p className="text-muted-foreground pl-12">{review.comment}</p>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
