'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, User, Heart, MessageSquare, Share2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { mockNews } from '@/lib/mock-data';

export default function NewsArticlePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const article = mockNews.find(a => a.slug === slug);

  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(article?.likes || 0);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Array<{ id: string; author: string; text: string; timestamp: Date }>>([
    { id: '1', author: 'Sarah Johnson', text: 'Great article! Very informative.', timestamp: new Date('2024-01-27T10:30:00') },
    { id: '2', author: 'Mike Chen', text: 'Thanks for sharing this update.', timestamp: new Date('2024-01-27T14:20:00') },
  ]);

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
        <Button asChild>
          <Link href="/news">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to News
          </Link>
        </Button>
      </div>
    );
  }

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
    toast.success(isLiked ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        });
        toast.success('Shared successfully');
      } catch (err) {
        toast.error('Failed to share');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const handleCommentSubmit = () => {
    if (!commentText.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    const newComment = {
      id: Date.now().toString(),
      author: 'You',
      text: commentText.trim(),
      timestamp: new Date(),
    };

    setComments([newComment, ...comments]);
    setCommentText('');
    toast.success('Comment posted');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/news">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to News
          </Link>
        </Button>

        {/* Article */}
        <article>
          {/* Header */}
          <div className="mb-6">
            <Badge variant="secondary" className="mb-3">{article.category}</Badge>
            <h1 className="text-4xl font-bold mb-4 break-words">{article.title}</h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{article.author}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <time dateTime={article.publishedAt.toISOString()}>
                  {article.publishedAt.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </time>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {article.image && (
            <div className="relative w-full h-[400px] rounded-xl overflow-hidden mb-8">
              <Image
                src={article.image || "/placeholder.svg"}
                alt={article.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-xl text-muted-foreground leading-relaxed mb-6">
              {article.excerpt}
            </p>
            <div className="whitespace-pre-wrap break-words">{article.content}</div>
          </div>

          {/* Social Actions */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 flex-wrap">
                <Button
                  variant={isLiked ? 'default' : 'outline'}
                  onClick={handleLike}
                  className="gap-2"
                >
                  <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{likes} Likes</span>
                </Button>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <MessageSquare className="h-4 w-4" />
                  <span>{comments.length} Comments</span>
                </Button>
                <Button variant="outline" onClick={handleShare} className="gap-2 bg-transparent">
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Comments ({comments.length})</h3>

              {/* Comment Input */}
              <div className="flex gap-2 mb-6">
                <Input
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}
                />
                <Button onClick={handleCommentSubmit}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No comments yet. Be the first to comment!
                  </p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 p-4 bg-muted rounded-lg">
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarFallback>{comment.author[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-medium">{comment.author}</span>
                          <span className="text-xs text-muted-foreground">
                            {comment.timestamp.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: 'numeric'
                            })}
                          </span>
                        </div>
                        <p className="text-sm break-words">{comment.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </article>
      </div>
    </div>
  );
}
