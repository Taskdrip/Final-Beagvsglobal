"use client";

import React from "react";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';
import { ListingType, DeliveryMethod } from '@/lib/database-types';

export default function CreateListingPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Mock user premium status and listing count
  const isPremium = user?.isPremium || false;
  const listingsThisMonth = user?.listingsThisMonth || 0;
  const maxListings = isPremium ? 12 : 1;
  const canCreateListing = listingsThisMonth < maxListings;

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ListingType>('goods');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [deliveryMethods, setDeliveryMethods] = useState<DeliveryMethod[]>(['courier']);
  const [isFeatured, setIsFeatured] = useState(false);
  
  // Real estate specific fields
  const [propertyType, setPropertyType] = useState('');
  const [listingPurpose, setListingPurpose] = useState('sale'); // sale, lease, rent
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [squareFeet, setSquareFeet] = useState('');
  const [location, setLocation] = useState('');
  const [yearBuilt, setYearBuilt] = useState('');

  if (!isAuthenticated) {
    router.push('/marketplace');
    return null;
  }

  const categories = {
    goods: ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Toys', 'Books', 'Other'],
    services: ['Consulting', 'Design', 'Development', 'Writing', 'Marketing', 'Education', 'Other'],
    real_estate: ['Residential', 'Commercial', 'Land', 'Industrial', 'Mixed Use'],
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // In production, upload to cloud storage
    // For now, create mock URLs
    const newImages = Array.from(files).map((file, i) => 
      `/placeholder.svg?height=400&width=400&text=${encodeURIComponent(file.name)}`
    );
    
    setImages(prev => [...prev, ...newImages].slice(0, 5)); // Max 5 images
    toast.success(`${files.length} image(s) added`);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const toggleDeliveryMethod = (method: DeliveryMethod) => {
    setDeliveryMethods(prev => 
      prev.includes(method) 
        ? prev.filter(m => m !== method)
        : [...prev, method]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !category || !price) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (images.length === 0) {
      toast.error('Please add at least one image');
      return;
    }

    if (deliveryMethods.length === 0) {
      toast.error('Please select at least one delivery method');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('[v0] Creating listing...', {
        sellerId: user?.id,
        title,
        description,
        type,
        category,
        priceInPi: parseFloat(price),
        images,
        deliveryMethods,
        isFeatured,
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast.success('Listing created successfully!', {
        description: 'Your listing is now live on the marketplace.',
      });

      router.push('/dashboard/listings');
    } catch (error) {
      console.error('[v0] Create listing error:', error);
      toast.error('Failed to create listing', {
        description: 'Please try again or contact support.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Link href="/dashboard/listings" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to My Listings
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Create New Listing</h1>
        <p className="text-muted-foreground">
          List your goods or services on the Beagvs marketplace
        </p>
        
        {/* Listing Limit Info */}
        <Card className="mt-4">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">
                  {isPremium ? 'Premium Account' : 'Free Account'} - Monthly Listings
                </p>
                <p className="text-sm text-muted-foreground">
                  {listingsThisMonth} of {maxListings} used this month
                </p>
              </div>
              {!isPremium && (
                <Button asChild variant="outline" size="sm">
                  <Link href="/dashboard/settings">Upgrade to Premium</Link>
                </Button>
              )}
            </div>
            <div className="mt-2 w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${(listingsThisMonth / maxListings) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {canCreateListing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Provide details about what you're selling
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter a clear, descriptive title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  maxLength={100}
                />
                <p className="text-xs text-muted-foreground">
                  {title.length}/100 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your item or service in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={6}
                  maxLength={1000}
                />
                <p className="text-xs text-muted-foreground">
                  {description.length}/1000 characters
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type *</Label>
                  <RadioGroup value={type} onValueChange={(value) => {
                    setType(value as ListingType);
                    setCategory(''); // Reset category when type changes
                  }}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="goods" id="goods" />
                      <Label htmlFor="goods" className="cursor-pointer">Physical Goods</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="services" id="services" />
                      <Label htmlFor="services" className="cursor-pointer">Services</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="real_estate" id="real_estate" />
                      <Label htmlFor="real_estate" className="cursor-pointer">Real Estate</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories[type].map(cat => (
                        <SelectItem key={cat} value={cat.toLowerCase()}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (π) *</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  min="0"
                  step="0.01"
                />
                <p className="text-xs text-muted-foreground">
                  Price in Pi Network tokens
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Real Estate Specific Fields */}
          {type === 'real_estate' && (
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
                <CardDescription>
                  Provide specific details about the property
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="listingPurpose">Listing Purpose *</Label>
                    <Select value={listingPurpose} onValueChange={setListingPurpose}>
                      <SelectTrigger id="listingPurpose">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sale">For Sale</SelectItem>
                        <SelectItem value="lease">For Lease</SelectItem>
                        <SelectItem value="rent">For Rent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="propertyType">Property Type *</Label>
                    <Select value={propertyType} onValueChange={setPropertyType}>
                      <SelectTrigger id="propertyType">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="condo">Condominium</SelectItem>
                        <SelectItem value="land">Land</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="office">Office Space</SelectItem>
                        <SelectItem value="warehouse">Warehouse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Downtown, City Center"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required={type === 'real_estate'}
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      placeholder="0"
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                      min="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      placeholder="0"
                      value={bathrooms}
                      onChange={(e) => setBathrooms(e.target.value)}
                      min="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="squareFeet">Square Feet</Label>
                    <Input
                      id="squareFeet"
                      type="number"
                      placeholder="0"
                      value={squareFeet}
                      onChange={(e) => setSquareFeet(e.target.value)}
                      min="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="yearBuilt">Year Built</Label>
                    <Input
                      id="yearBuilt"
                      type="number"
                      placeholder="2024"
                      value={yearBuilt}
                      onChange={(e) => setYearBuilt(e.target.value)}
                      min="1800"
                      max={new Date().getFullYear()}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
              <CardDescription>
                Add up to 5 images of your item or service (first image is the main photo)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {images.map((img, index) => (
                  <div key={index} className="relative aspect-square border rounded-lg overflow-hidden bg-muted">
                    <img src={img || "/placeholder.svg"} alt={`Upload ${index + 1}`} className="object-cover w-full h-full" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    {index === 0 && (
                      <div className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded">
                        Main
                      </div>
                    )}
                  </div>
                ))}
                
                {images.length < 5 && (
                  <label className="aspect-square border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors flex flex-col items-center justify-center bg-muted/50">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-xs text-muted-foreground">Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Delivery Options */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Options</CardTitle>
              <CardDescription>
                Select how buyers can receive this item
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="local"
                  checked={deliveryMethods.includes('local')}
                  onCheckedChange={() => toggleDeliveryMethod('local')}
                />
                <Label htmlFor="local" className="cursor-pointer">
                  Local Pickup - Buyer collects from your location
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="courier"
                  checked={deliveryMethods.includes('courier')}
                  onCheckedChange={() => toggleDeliveryMethod('courier')}
                />
                <Label htmlFor="courier" className="cursor-pointer">
                  Courier Service - Standard shipping (3-7 days)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="freight"
                  checked={deliveryMethods.includes('freight')}
                  onCheckedChange={() => toggleDeliveryMethod('freight')}
                />
                <Label htmlFor="freight" className="cursor-pointer">
                  Freight Shipping - For large or heavy items
                </Label>
              </div>
              {type === 'services' && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="digital"
                    checked={deliveryMethods.includes('digital')}
                    onCheckedChange={() => toggleDeliveryMethod('digital')}
                  />
                  <Label htmlFor="digital" className="cursor-pointer">
                    Digital Delivery - Online service delivery
                  </Label>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Featured Listing */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Listing</CardTitle>
              <CardDescription>
                Boost your visibility with a featured listing (10π fee)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={isFeatured}
                  onCheckedChange={(checked) => setIsFeatured(checked as boolean)}
                />
                <Label htmlFor="featured" className="cursor-pointer">
                  Make this a featured listing (+10π)
                </Label>
              </div>
              {isFeatured && (
                <p className="text-sm text-muted-foreground mt-2">
                  Featured listings appear at the top of search results and the homepage
                </p>
              )}
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              size="lg"
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Listing'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <Card className="mt-4">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">
                  {isPremium ? 'Premium Account' : 'Free Account'} - Monthly Listings
                </p>
                <p className="text-sm text-muted-foreground">
                  {listingsThisMonth} of {maxListings} used this month
                </p>
              </div>
              {!isPremium && (
                <Button asChild size="lg">
                  <Link href="/dashboard/settings">Upgrade to Premium</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
