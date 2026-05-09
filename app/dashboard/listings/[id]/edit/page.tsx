"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, X, Loader2, ImageIcon } from 'lucide-react';
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

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ListingType>('goods');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [deliveryMethods, setDeliveryMethods] = useState<DeliveryMethod[]>(['courier']);
  const [isFeatured, setIsFeatured] = useState(false);

  // Real estate fields
  const [propertyType, setPropertyType] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [squareFeet, setSquareFeet] = useState('');
  const [location, setLocation] = useState('');
  const [yearBuilt, setYearBuilt] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/marketplace');
      return;
    }

    // Load existing listing data
    const loadListing = async () => {
      try {
        // Mock data - in production, fetch from API
        const mockListing = {
          id: params.id,
          title: 'Vintage Camera Collection',
          description: 'High-quality vintage cameras from the 1970s-1990s',
          type: 'goods' as ListingType,
          category: 'electronics',
          priceInPi: 45.0,
          images: ['/placeholder.svg?height=400&width=400'],
          deliveryMethods: ['courier', 'local'] as DeliveryMethod[],
          isFeatured: true,
        };

        setTitle(mockListing.title);
        setDescription(mockListing.description);
        setType(mockListing.type);
        setCategory(mockListing.category);
        setPrice(mockListing.priceInPi.toString());
        setImages(mockListing.images);
        setDeliveryMethods(mockListing.deliveryMethods);
        setIsFeatured(mockListing.isFeatured);
      } catch (error) {
        console.error('[v0] Load listing error:', error);
        toast.error('Failed to load listing');
      } finally {
        setIsLoading(false);
      }
    };

    loadListing();
  }, [params.id, isAuthenticated, router]);

  const categories = {
    goods: ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Toys', 'Books', 'Other'],
    services: ['Consulting', 'Design', 'Development', 'Writing', 'Marketing', 'Education', 'Other'],
    real_estate: ['Apartments', 'Houses', 'Commercial', 'Land', 'Other'],
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages = Array.from(files).map((file) => 
      `/placeholder.svg?height=400&width=400&text=${encodeURIComponent(file.name)}`
    );
    
    setImages(prev => [...prev, ...newImages].slice(0, 5));
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

    setIsSubmitting(true);

    try {
      console.log('[v0] Updating listing...', {
        id: params.id,
        title,
        description,
        type,
        category,
        priceInPi: parseFloat(price),
        images,
        deliveryMethods,
        isFeatured,
        ...(type === 'real_estate' && {
          propertyType,
          bedrooms: bedrooms ? parseInt(bedrooms) : undefined,
          bathrooms: bathrooms ? parseInt(bathrooms) : undefined,
          squareFeet: squareFeet ? parseInt(squareFeet) : undefined,
          location,
          yearBuilt: yearBuilt ? parseInt(yearBuilt) : undefined,
        }),
      });

      await new Promise(resolve => setTimeout(resolve, 1500));

      toast.success('Listing updated successfully!');
      router.push('/dashboard/listings');
    } catch (error) {
      console.error('[v0] Update listing error:', error);
      toast.error('Failed to update listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Link href="/dashboard/listings" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to My Listings
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Edit Listing</h1>
        <p className="text-muted-foreground">
          Update your listing details
        </p>
      </div>

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
                  setCategory('');
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
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Product Images (Up to 5)</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {images.map((img, index) => (
                  <div key={index} className="relative aspect-square border-2 border-dashed rounded-lg overflow-hidden group">
                    <img
                      src={img || "/placeholder.svg"}
                      alt={`Product ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setImages(images.filter((_, i) => i !== index))}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {images.length < 5 && (
                  <div className="relative aspect-square border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setImages([...images, reader.result as string]);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <div className="text-center">
                      <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-xs text-muted-foreground">Add Image</p>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                You can add up to 5 images. Click on an image to remove it.
              </p>
            </div>

            {/* Real Estate Fields */}
            {type === 'real_estate' && (
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-semibold">Property Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="propertyType">Property Type</Label>
                    <Input
                      id="propertyType"
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      placeholder="e.g., Apartment, House"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="City, District"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Input
                      id="bedrooms"
                      type="number"
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
                      value={yearBuilt}
                      onChange={(e) => setYearBuilt(e.target.value)}
                      min="1800"
                      max={new Date().getFullYear()}
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
            <CardDescription>
              Add up to 5 images
            </CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="local"
                checked={deliveryMethods.includes('local')}
                onCheckedChange={() => toggleDeliveryMethod('local')}
              />
              <Label htmlFor="local" className="cursor-pointer">
                Local Pickup
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="courier"
                checked={deliveryMethods.includes('courier')}
                onCheckedChange={() => toggleDeliveryMethod('courier')}
              />
              <Label htmlFor="courier" className="cursor-pointer">
                Courier Service
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="freight"
                checked={deliveryMethods.includes('freight')}
                onCheckedChange={() => toggleDeliveryMethod('freight')}
              />
              <Label htmlFor="freight" className="cursor-pointer">
                Freight Shipping
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Featured */}
        <Card>
          <CardHeader>
            <CardTitle>Featured Listing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={isFeatured}
                onCheckedChange={(checked) => setIsFeatured(checked as boolean)}
              />
              <Label htmlFor="featured" className="cursor-pointer">
                Make this a featured listing
              </Label>
            </div>
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
                Saving...
              </>
            ) : (
              'Save Changes'
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
    </div>
  );
}
