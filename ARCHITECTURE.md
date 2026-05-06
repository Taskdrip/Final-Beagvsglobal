# Feature Overview & Architecture

## System Architecture

### Frontend Stack
- **Framework**: Next.js 15 (React 19)
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: React Context API
- **Storage**: Browser localStorage (with backup system)

### Data Flow
```
User Input → Component → Context → localStorage → UI Update
     ↓
  Local Backup System (Auto-saves critical data)
     ↓
  Page Reload → Restore from Backup → Display Data
```

---

## Feature Breakdown

### 1. Authentication System
**Location**: `/contexts/auth-context.tsx`

**Features:**
- Role-based access (Buyer, Seller, Admin)
- Session persistence
- Automatic data backup/restore
- Password hashing (bcrypt-ready)

**Key Functions:**
- `login(username, password)`
- `logout()`
- `signup(userData)`
- Automatic session restoration on page load

---

### 2. Marketplace System
**Location**: `/app/marketplace/page.tsx`

**Features:**
- Product browsing with filters
- Search functionality
- Category-based navigation
- Add to cart functionality
- Wishlist system

**Data Structure:**
```javascript
marketplace_listings: [
  {
    id, title, description, price, images,
    seller, category, rating, stock, status
  }
]
```

---

### 3. Admin Dashboard
**Location**: `/components/dashboard/admin-dashboard.tsx`

**Two Main Modules:**

#### Payment Management
- View all payment requests
- Review transaction hashes
- View payment proof screenshots
- Approve/Reject with comments
- Automatic user status update on approval

**Supported Payment Types:**
- Account Verification (50 USD/Pi)
- Task Listing (Variable)
- Product Listing (Variable)

#### Task Management
- View submitted tasks
- Batch approve/reject
- View task details
- Assign to users

---

### 4. Messaging System
**Location**: `/app/messages/page.tsx`

**Features:**
- Direct messaging between users
- Real-time message display
- Chat history persistence
- User search and selection
- Message timestamps

**Data Structure:**
```javascript
messages: [
  {
    id, fromUserId, toUserId, content,
    timestamp, read
  }
]
```

---

### 5. Account Verification
**Location**: `/components/account-verification-dialog.tsx`

**Process:**
1. User clicks "Get Verified"
2. Shows admin wallet address (copyable)
3. User makes manual payment
4. Uploads transaction hash
5. Uploads payment proof screenshot
6. Confirms payment made
7. Submitted to payment queue
8. Admin reviews and approves
9. Verification badge added

**Requirements:**
- Transaction hash/reference
- Payment proof screenshot
- Confirmation checkbox

---

### 6. Task System
**Location**: `/app/list-task/page.tsx` & `/app/earn/page.tsx`

**Submission Process:**
1. User creates task with details
2. Sets budget/reward
3. Enters transaction hash
4. Uploads payment proof
5. Confirms payment
6. Submitted to admin

**Approval Process:**
1. Admin reviews in dashboard
2. Verifies payment
3. Approves task
4. Task appears on Earn Pi page

**Earning Process:**
1. Users view approved tasks
2. Click task details
3. Accept task
4. Complete requirements
5. Submit proof
6. Admin verifies
7. Pi credited

---

### 7. Social Feed
**Location**: `/app/feed/page.tsx`

**Features:**
- Create posts with images
- Like/Unlike posts
- Comment on posts
- Tip creators with Pi
- View comment threads
- Real-time engagement

**Data Structure:**
```javascript
feed_posts: [
  {
    id, userId, username, content, image,
    likes: [userIds], comments: [...],
    tips: [{amount, username, date}],
    createdAt
  }
]
```

---

### 8. User Profiles
**Location**: `/app/profile/[username]/page.tsx`

**Features:**
- Profile customization
- Profile picture upload
- Bio/description
- Follower/Following lists
- Posts display
- Verification badge
- Statistics (followers, posts, tips earned)
- Follow/Unfollow button
- Message button

**Followers/Following Dialog:**
- Shows list of users
- Follow/Unfollow buttons
- Direct message button
- Verification badge display

---

### 9. Shipping System
**Location**: `/app/track-shipping/page.tsx`

**Features:**
- Real-time tracking
- Multiple delivery options
- Status updates
- Estimated delivery times
- Location tracking

**Shipping Statuses:**
- Pending
- Processing
- In Transit
- Out for Delivery
- Delivered
- Cancelled

---

### 10. Price Tracking
**Location**: `/lib/pi-price-tracker.ts`

**Features:**
- Real-time Pi Network price
- 24-hour price change percentage
- USD conversion
- CoinGecko API integration
- Auto-refresh every minute

**Display**: Shown in navigation bar

---

## Data Backup System

### Auto-Backup Features
**Location**: `/lib/data-persistence.ts`

**Backed Up Data:**
- beagvs_users
- feed_posts
- marketplace_listings
- task_submissions
- payment_requests
- messages
- user_profiles
- shipping_orders

**Backup Process:**
```
User Action → Data Modified → Auto-Backup Triggered
     ↓
Data saved to localStorage
     ↓
Backup copy created with 'beagvs_backup_' prefix
     ↓
On App Startup: Check for data loss → Restore from backup
```

### Recovery Process
1. App detects missing data on startup
2. Checks for backup with 'beagvs_backup_' prefix
3. Restores from backup automatically
4. Notifies user if restore occurred

---

## Component Hierarchy

```
Root Layout
├── Navigation
│   ├── Desktop Menu
│   ├── Mobile Menu (Scrollable)
│   └── Pi Price Ticker
├── Auth Context Provider
├── Cart Context Provider
├── Main Content
│   ├── Home Page
│   ├── Marketplace
│   ├── Profile
│   ├── Dashboard
│   │   ├── User Dashboard
│   │   ├── Admin Dashboard
│   │   │   ├── Payment Management
│   │   │   └── Task Management
│   │   └── Settings
│   ├── Feed
│   ├── Earn Pi
│   ├── List Task
│   ├── Messages
│   ├── Track Shipping
│   └── Other Pages
└── Footer
```

---

## State Management Pattern

### Auth Context
```typescript
{
  user: User | null,
  isAuthenticated: boolean,
  isLoading: boolean,
  login: (username, password) => Promise<void>,
  logout: () => void,
  signup: (userData) => Promise<void>
}
```

### Cart Context
```typescript
{
  items: CartItem[],
  addItem: (item) => void,
  removeItem: (id) => void,
  clearCart: () => void,
  total: number
}
```

---

## API Integration Points (Future)

When migrating to backend:

### Authentication Routes
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### User Routes
```
GET    /api/users/:id
PATCH  /api/users/:id
GET    /api/users/:id/posts
GET    /api/users/:id/followers
POST   /api/users/:id/follow
```

### Marketplace Routes
```
GET    /api/listings
POST   /api/listings
PATCH  /api/listings/:id
DELETE /api/listings/:id
GET    /api/listings/:id/reviews
```

### Payment Routes
```
GET    /api/payments
POST   /api/payments
PATCH  /api/payments/:id/approve
PATCH  /api/payments/:id/reject
GET    /api/payments/:id/proof
```

### Task Routes
```
GET    /api/tasks
POST   /api/tasks
PATCH  /api/tasks/:id/approve
PATCH  /api/tasks/:id/start
POST   /api/tasks/:id/submit
```

### Messaging Routes
```
GET    /api/messages
GET    /api/messages/:conversationId
POST   /api/messages
GET    /api/conversations
```

---

## Security Considerations

### Current Implementation (localStorage)
- ✅ No sensitive data in localStorage (removed passwords)
- ✅ Automatic data backup
- ✅ Client-side validation
- ⚠️ Not suitable for production

### For Production
- [ ] Implement proper authentication (JWT tokens)
- [ ] Add HTTPS/TLS encryption
- [ ] Use secure cookies (httpOnly, secure flags)
- [ ] Implement CSRF protection
- [ ] Add rate limiting
- [ ] Validate all inputs server-side
- [ ] Implement proper access controls
- [ ] Add audit logging
- [ ] Use environment variables for secrets
- [ ] Implement data encryption at rest

---

## Performance Metrics

### Current Implementation
- **Max users**: ~50 (localStorage limit)
- **Max posts**: ~10,000 (browser storage limit)
- **Page load time**: < 2s
- **API response**: Instant (local)

### Production Targets
- **Concurrent users**: 10,000+
- **Data storage**: Unlimited
- **Page load**: < 1s
- **API response**: < 500ms

---

## Browser Compatibility

### Supported
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Features Required
- ES2020+ JavaScript
- CSS Grid & Flexbox
- localStorage API
- FileReader API
- Fetch API
- Promise support

---

## Deployment Checklist

- [ ] All environment variables configured
- [ ] Database connected (if applicable)
- [ ] Payment gateway configured
- [ ] Email service setup
- [ ] CDN configured for assets
- [ ] SSL certificate installed
- [ ] Backup system tested
- [ ] Monitoring alerts set up
- [ ] Error tracking (Sentry) configured
- [ ] Analytics integrated
- [ ] Security scan passed
- [ ] Performance optimized
- [ ] SEO meta tags configured
- [ ] Mobile responsive tested
- [ ] Cross-browser tested

---

**Documentation Version**: 1.0.0  
**Last Updated**: 2026-05-06
