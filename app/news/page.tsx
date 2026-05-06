"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, MessageSquare, Share2, Calendar, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

// Mock news data with images - fallback if no news in localStorage
const mockNewsData = [
  {
    id: '1',
    title: 'Beagvs Launches Global Escrow Payment System',
    slug: 'beagvs-launches-global-escrow',
    excerpt: 'We are excited to announce the launch of our new global escrow payment system, making transactions safer and more secure for buyers and sellers worldwide.',
    content: 'Full article content here...',
    author: 'Beagvs Team',
    category: 'Platform Updates',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop',
    publishedAt: new Date('2024-01-28'),
    likes: 145,
    comments: 23
  },
  {
    id: '2',
    title: 'Real Estate Listings Now Available on Beagvs',
    slug: 'real-estate-listings-available',
    excerpt: 'Discover properties, land, and commercial spaces on Beagvs marketplace. Buy, sell, or lease real estate with cryptocurrency payments.',
    content: 'Full article content here...',
    author: 'Sarah Johnson',
    category: 'Features',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=400&fit=crop',
    publishedAt: new Date('2024-01-26'),
    likes: 89,
    comments: 12
  },
  {
    id: '3',
    title: 'Earn Pi: Complete Tasks and Get Rewarded',
    slug: 'earn-pi-tasks-rewards',
    excerpt: 'Introducing our new Earn Pi feature where users can complete simple tasks for brands and earn cryptocurrency rewards.',
    content: 'Full article content here...',
    author: 'Mike Chen',
    category: 'Announcements',
    image: 'https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?w=800&h=400&fit=crop',
    publishedAt: new Date('2024-01-24'),
    likes: 234,
    comments: 45
  },
  {
    id: '4',
    title: 'Shipping Integration: Track Your Orders Globally',
    slug: 'shipping-integration-tracking',
    excerpt: 'New shipping tracking feature allows buyers to monitor their purchases from warehouse to doorstep with real-time updates.',
    content: 'Full article content here...',
    author: 'Emily Rodriguez',
    category: 'Platform Updates',
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&h=400&fit=crop',
    publishedAt: new Date('2024-01-22'),
    likes: 67,
    comments: 8
  },
  {
    id: '5',
    title: 'Community Spotlight: Top Sellers of the Month',
    slug: 'community-spotlight-top-sellers',
    excerpt: 'Meet our top-performing sellers who are making waves in the Beagvs marketplace and learn their success strategies.',
    content: 'Full article content here...',
    author: 'David Park',
    category: 'Community',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    publishedAt: new Date('2024-01-20'),
    likes: 156,
    comments: 34
  }
];

export default function NewsPage() {
  const [news, setNews] = useState(mockNewsData);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load news from localStorage
    if (typeof window !== 'undefined') {
      const storedNews = JSON.parse(localStorage.getItem('beagvs_news') || '[]');
      console.log('[v0] Loaded news articles:', storedNews);
      
      if (storedNews.length > 0) {
        // Combine stored news (newest first) with mock data
        const combined = [...storedNews.reverse(), ...mockNewsData];
        setNews(combined);
      }
    }
  }, []);

  const categories = ['all', ...Array.from(new Set(news.map(n => n.category)))];

  const filteredNews = news.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleLike = (id: string) => {
    setNews(news.map(article => 
      article.id === id 
        ? { ...article, likes: article.likes + 1 }
        : article
    ));
    toast.success('Liked!');
  };

  const handleShare = (article: typeof mockNewsData[0]) => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.origin + `/news/${article.slug}`
      });
    } else {
      navigator.clipboard.writeText(window.location.origin + `/news/${article.slug}`);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Latest News & Updates</h1>
        <p className="text-lg text-muted-foreground">
          Stay updated with the latest features, updates, and announcements from Beagvs.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat} className="capitalize">
                {cat === 'all' ? 'All Categories' : cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 gap-8">
        {filteredNews.map(article => (
          <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="grid md:grid-cols-5 gap-0">
              {/* Image */}
              <div className="md:col-span-2 relative h-64 md:h-auto md:min-h-[300px]">
                <Image
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="md:col-span-3 flex flex-col">
                <CardHeader className="flex-shrink-0">
                  <div className="flex items-start justify-between gap-4 mb-2 flex-wrap">
                    <Badge variant="secondary">{article.category}</Badge>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground flex-shrink-0">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <time dateTime={article.publishedAt.toISOString()}>
                          {article.publishedAt.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </time>
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-2xl mb-2 break-words">
                    <Link href={`/news/${article.slug}`} className="hover:text-primary transition-colors">
                      {article.title}
                    </Link>
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span className="truncate">{article.author}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <CardDescription className="text-base leading-relaxed mb-4 break-words">
                    {article.excerpt}
                  </CardDescription>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(article.id)}
                        className="gap-2"
                      >
                        <Heart className="h-4 w-4" />
                        <span>{article.likes}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="gap-2"
                      >
                        <Link href={`/news/${article.slug}`}>
                          <MessageSquare className="h-4 w-4" />
                          <span>{article.comments}</span>
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShare(article)}
                        className="gap-2"
                      >
                        <Share2 className="h-4 w-4" />
                        <span>Share</span>
                      </Button>
                    </div>
                    <Button asChild variant="outline" size="sm" className="bg-transparent">
                      <Link href={`/news/${article.slug}`}>
                        Read More →
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No news articles found.</p>
        </div>
      )}
    </div>
  );
}
