// Database types for Beagvs Marketplace

export type UserRole = 'buyer' | 'seller' | 'admin';

export type ListingType = 'goods' | 'services' | 'real_estate';

export type ListingStatus = 'active' | 'sold' | 'inactive' | 'pending';

export type DeliveryMethod = 'local' | 'courier' | 'freight' | 'digital';

export type EscrowStatus = 'pending' | 'held' | 'released' | 'cancelled' | 'disputed';

export type DisputeStatus = 'open' | 'in_review' | 'resolved' | 'closed';

export interface User {
  id: string;
  piUserId: string;
  username: string;
  email: string;
  role: UserRole;
  piWalletAddress?: string;
  isPremium: boolean;
  listingsThisMonth: number;
  profilePicture?: string;
  bio?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  followers: string[]; // User IDs
  following: string[]; // User IDs
  createdAt: Date;
  updatedAt: Date;
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  images?: string[];
  isSponsored: boolean;
  likes: string[]; // User IDs who liked
  comments: PostComment[];
  tips: PostTip[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PostComment {
  id: string;
  userId: string;
  username: string;
  profilePicture?: string;
  comment: string;
  createdAt: Date;
}

export interface PostTip {
  id: string;
  fromUserId: string;
  amount: number; // Pi amount
  message?: string;
  createdAt: Date;
}

export interface Listing {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  type: ListingType;
  category: string;
  priceInPi: number;
  images: string[];
  status: ListingStatus;
  isFeatured: boolean;
  deliveryMethods: DeliveryMethod[];
  likes: string[]; // User IDs who liked
  // Real estate specific fields
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  location?: string;
  yearBuilt?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  listingId: string;
  totalPi: number;
  deliveryMethod: DeliveryMethod;
  shippingAddress?: string;
  trackingNumber?: string;
  escrowId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Escrow {
  id: string;
  orderId: string;
  amountPi: number;
  status: EscrowStatus;
  piTransactionId?: string;
  createdAt: Date;
  releasedAt?: Date;
  updatedAt: Date;
}

export interface Dispute {
  id: string;
  orderId: string;
  initiatorId: string;
  reason: string;
  status: DisputeStatus;
  resolution?: string;
  createdAt: Date;
  resolvedAt?: Date;
}

export interface AdminSettings {
  id: string;
  piWalletAddress: string;
  escrowWalletAddress: string;
  platformFeePercentage: number;
  featuredListingPricePi: number;
  updatedAt: Date;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: Date;
  updatedAt: Date;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date;
  isRead: boolean;
}

export interface Review {
  id: string;
  listingId: string;
  orderId: string;
  buyerId: string;
  sellerId: string;
  rating: number; // 1-5 stars
  comment?: string;
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  listingId?: string;
  senderId: string;
  receiverId: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export interface Comment {
  id: string;
  listingId: string;
  userId: string;
  comment: string;
  createdAt: Date;
}

export interface ShippingTracking {
  id: string;
  orderId: string;
  trackingId: string;
  status: 'pending' | 'processing' | 'shipped' | 'in_transit' | 'delivered';
  location?: string;
  notes?: string;
  updatedAt: Date;
  history: Array<{
    status: string;
    location?: string;
    timestamp: Date;
    notes?: string;
  }>;
}
