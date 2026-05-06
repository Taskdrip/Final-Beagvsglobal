"use client";

import React from "react"

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockListings } from '@/lib/mock-data';
import { useCart } from '@/contexts/cart-context';
import { toast } from 'sonner';

export function MarketplaceContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  const { addItem } = useCart();

  const categories = Array.from(new Set(mockListings.map(l => l.category)));
  const types = ['goods', 'services', 'real_estate'];

  const filteredListings = useMemo(() => {
    let filtered = mockListings.filter(listing => listing.status === 'active');

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        listing =>
          listing.title.toLowerCase().includes(query) ||
          listing.description.toLowerCase().includes(query)
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(listing => selectedCategories.includes(listing.category));
    }

    if (selectedTypes.length > 0) {
      filtered = filtered.filter(listing => selectedTypes.includes(listing.type));
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.priceInPi - b.priceInPi);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.priceInPi - a.priceInPi);
        break;
      case 'newest':
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        break;
    }

    return filtered;
  }, [searchQuery, selectedCategories, selectedTypes, sortBy]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleAddToCart = (e: React.MouseEvent, listing: typeof mockListings[0]) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(listing);
    toast.success('Added to cart', {
      description: `${listing.title} has been added to your cart.`,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Filters Sidebar */}
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search */}
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search listings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div className="space-y-2">
              <Label>Type</Label>
              <div className="space-y-2">
                {types.map(type => (
                  <div key={type} className="flex items-center gap-2">
                    <Checkbox
                      id={`type-${type}`}
                      checked={selectedTypes.includes(type)}
                      onCheckedChange={() => handleTypeToggle(type)}
                    />
                    <Label htmlFor={`type-${type}`} className="capitalize cursor-pointer">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <Label>Categories</Label>
              <div className="space-y-2">
                {categories.map(category => (
                  <div key={category} className="flex items-center gap-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => handleCategoryToggle(category)}
                    />
                    <Label htmlFor={`category-${category}`} className="cursor-pointer">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {(selectedCategories.length > 0 || selectedTypes.length > 0 || searchQuery) && (
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => {
                  setSelectedCategories([]);
                  setSelectedTypes([]);
                  setSearchQuery('');
                }}
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Listings Grid */}
      <div className="md:col-span-3 space-y-4">
        {/* Sort and Count */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {filteredListings.length} {filteredListings.length === 1 ? 'listing' : 'listings'} found
          </p>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Listings */}
        {filteredListings.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">No listings found matching your criteria.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCategories([]);
                  setSelectedTypes([]);
                  setSearchQuery('');
                }}
              >
                Clear Filters
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map(listing => (
              <Link key={listing.id} href={`/marketplace/${listing.id}`}>
                <Card className="overflow-hidden hover:border-primary transition-colors h-full flex flex-col">
                  <div className="aspect-square bg-muted relative">
                    <img
                      src={listing.images[0] || '/placeholder.svg'}
                      alt={listing.title}
                      className="object-cover w-full h-full"
                    />
                    {listing.isFeatured && (
                      <Badge className="absolute top-2 right-2">Featured</Badge>
                    )}
                  </div>
                  <CardHeader className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <CardTitle className="line-clamp-2 text-lg">{listing.title}</CardTitle>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {listing.description}
                    </CardDescription>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="capitalize">{listing.type}</Badge>
                      <Badge variant="secondary">{listing.category}</Badge>
                    </div>
                  </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">{listing.priceInPi} π</div>
                      <div className="text-sm text-muted-foreground">≈ ${(listing.priceInPi * 0.62).toFixed(2)} USD</div>
                    </div>
                      <Button
                        size="sm"
                        onClick={(e) => handleAddToCart(e, listing)}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
