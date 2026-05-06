# Replit Import & Setup Guide

## Quick Start (5 Minutes)

### Step 1: Import to Replit
1. Visit https://replit.com/new
2. Click "Import from GitHub"
3. Paste: `https://github.com/yourusername/beagvs.git`
4. Click "Import from GitHub"

### Step 2: Install & Run
```bash
# Replit will auto-detect and install dependencies
# Click "Run" button or manually run:
npm install
npm run dev
```

### Step 3: Access Application
- Click the "Open in new tab" button or preview pane
- Application opens in Replit's browser
- Default URL: `https://[replit-name].replit.dev`

---

## Detailed Setup Instructions

### For First-Time Users

#### 1. Create Your First Account (Buyer)
```
Navigate to homepage → Sign Up
- Username: Choose any username
- Email: example@test.com
- Password: Set your password
- Role: Select "Buyer"
- Profile Picture: Upload or skip
- Bio: Add optional bio
- Click "Sign Up"
```

#### 2. Create Admin Account (Optional)
```
Go through signup again with:
- Username: admin_test
- Role: Admin
- Other fields: Fill as needed
```

#### 3. Login & Explore
- Use your credentials to login
- Homepage shows main navigation
- Profile → View your profile
- Dashboard → Access your personal dashboard

---

### Admin Features Setup

#### Access Admin Dashboard
1. Login as admin user
2. Navigate to "Dashboard" in top menu
3. Click "Admin Panel" button
4. Two main tabs: **Payments** and **Tasks**

#### Manage Payments
**Payments Tab:**
- View all pending payment requests
- Click on any payment to view details:
  - User information
  - Transaction hash
  - Payment proof (clickable image)
  - Payment amount and type
- Actions:
  - ✅ **Approve**: Verify and accept payment
  - ❌ **Reject**: Decline with optional reason
  - 👁️ **View Proof**: Open payment screenshot

#### Task Management
1. Users submit tasks via "Submit Task" page
2. Admin reviews in "Tasks" tab
3. Can approve/reject tasks
4. Approved tasks appear on "Earn Pi" page

---

### User Workflows

#### Workflow 1: Buy Something
```
1. Navigate to "Marketplace"
2. Browse products or search
3. Click product → View details
4. Click "Add to Cart"
5. Cart icon shows item count
6. Click "Checkout"
7. Complete payment process
8. Order appears in Dashboard → Orders
```

#### Workflow 2: Sell Products
```
1. Login as Seller
2. Dashboard → "New Listing"
3. Fill in:
   - Product name
   - Description
   - Price
   - Category
   - Upload images
4. Submit for admin approval
5. Admin approves in dashboard
6. Product appears on marketplace
```

#### Workflow 3: Submit Task Request
```
1. Click "Submit Task" in menu
2. Add task details:
   - Title: Task name
   - Description: What needs to be done
   - Task Type: Category
   - Region: Location
   - Participants: Number needed
   - Budget: Reward amount
3. Enter transaction hash from payment
4. Upload payment proof screenshot
5. ✓ Confirm "Payment has been made"
6. Submit for approval
7. Admin reviews and approves
8. Task appears on "Earn Pi" page
```

#### Workflow 4: Earn Pi (Participants)
```
1. Navigate to "Earn Pi"
2. View approved tasks
3. Click task → View details
4. Click "Start Task" to begin
5. Complete task requirements
6. Submit proof of completion
7. Admin reviews submission
8. Upon approval, Pi is credited
```

#### Workflow 5: Message Other Users
```
1. Go to any user's profile
2. Click "Message" button
3. Type message in chat box
4. Press send or Enter
5. Real-time message appears
6. View all messages in "Messages" page
```

#### Workflow 6: Get Account Verified
```
1. Profile page → "Get Verified" button
2. Dialog shows:
   - Admin wallet address (auto-copied)
   - Verification fee amount ($50 or π50)
3. Make payment via preferred method
4. Copy transaction hash/reference
5. Upload screenshot proof
6. ✓ Confirm payment made
7. Submit to admin
8. Admin reviews payment
9. Upon approval:
   - Blue checkmark badge appears on profile
   - Verified tag in all listings
```

---

## Data Structure Reference

### User Object
```javascript
{
  id: "user_timestamp",
  username: "john_doe",
  email: "john@example.com",
  password: "hashed_password",
  role: "buyer", // buyer, seller, admin
  profilePicture: "base64_image",
  bio: "User bio",
  followers: ["user_id_1", "user_id_2"],
  following: ["user_id_3"],
  verified: false,
  totalPoints: 0,
  createdAt: "2026-05-06T10:00:00Z"
}
```

### Post Object
```javascript
{
  id: "post_timestamp",
  userId: "user_id",
  username: "john_doe",
  content: "Post content",
  image: "base64_image",
  comments: [{
    id: "comment_id",
    userId: "user_id",
    text: "Comment text",
    createdAt: "2026-05-06T10:00:00Z"
  }],
  tips: [{
    id: "tip_id",
    amount: 5.50,
    username: "tipper_name",
    createdAt: "2026-05-06T10:00:00Z"
  }],
  createdAt: "2026-05-06T10:00:00Z"
}
```

### Payment Request Object
```javascript
{
  id: "payment_request_timestamp",
  userId: "user_id",
  username: "john_doe",
  userEmail: "john@example.com",
  type: "verification", // verification, task, listing
  amount: 50,
  currency: "USD",
  transactionHash: "0x7f4c...9a2b",
  paymentProof: "base64_image",
  description: "Account Verification for @john_doe",
  status: "pending", // pending, approved, rejected
  createdAt: "2026-05-06T10:00:00Z"
}
```

---

## Customization Guide

### Change Admin Wallet Address
**File:** `/components/account-verification-dialog.tsx`
```typescript
// Line ~42
const ADMIN_WALLET = 'YOUR_WALLET_ADDRESS_HERE';
```

### Change Verification Fee
**File:** `/components/account-verification-dialog.tsx`
```typescript
// Line ~43
const VERIFICATION_FEE = 50; // Change to any amount
```

### Modify Platform Fee
**File:** `/app/list-task/page.tsx`
```typescript
// Search for PLATFORM_FEE
const PLATFORM_FEE = 2.50; // Change as needed
```

### Update Currency
**File:** `/components/account-verification-dialog.tsx`
```typescript
// Line ~44
const CURRENCY = 'USD'; // Change to BTC, ETH, PI, etc.
```

---

## Common Issues & Solutions

### Issue 1: "Data not persisting"
**Solution:**
```javascript
// Open DevTools Console (F12)
// Check if localStorage is enabled
localStorage.setItem('test', 'value');
localStorage.getItem('test');

// If error, enable cookies in browser settings
```

### Issue 2: "Can't login after signup"
**Solution:**
```javascript
// Clear browser storage
localStorage.clear();
sessionStorage.clear();

// Reload page
location.reload();

// Try signup again
```

### Issue 3: "Images not showing"
**Solution:**
1. Ensure browser allows local image loading
2. Upload smaller files (< 5MB)
3. Use supported formats: JPG, PNG, WebP
4. Try different browser

### Issue 4: "Payment not appearing in admin dashboard"
**Solution:**
1. Ensure logged in as admin
2. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
3. Check browser localStorage size isn't exceeded
4. Try different browser

### Issue 5: "Styles looking broken"
**Solution:**
```bash
# Rebuild Tailwind CSS
rm -rf .next
npm run build

# Or restart dev server
npm run dev
```

---

## Replit-Specific Tips

### Auto-Save
- Replit auto-saves files every 2 seconds
- No manual save needed

### Running Commands
- Click "Shell" tab at bottom
- Type commands directly
- Examples:
  ```bash
  npm install
  npm run dev
  npm run build
  ```

### File Uploads
- Use Files tab on left sidebar
- Drag and drop files to upload
- Click file to view/edit

### Preview
- Click "Open in new tab" for full screen
- Right-click → "Inspect" for DevTools
- Use browser console for debugging

### Environment Variables (Advanced)
1. Click "Secrets" (lock icon) on left sidebar
2. Add new secret:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `your_value`
3. Restart app for changes

---

## Performance Optimization

### For Replit
- **Limit concurrent users**: localStorage can handle ~50 users
- **Clear old data**: Admin dashboard has cleanup tools
- **Archive old posts/tasks**: Keep data manageable
- **Backup before reset**: Download JSON of localStorage

### For Production Migration
- Migrate to PostgreSQL/MongoDB for scalability
- Implement caching layer (Redis)
- Add CDN for static assets
- Use load balancing for multiple instances

---

## Testing Checklist

Before deploying:
- [ ] User signup/login works
- [ ] Admin can approve payments
- [ ] Tasks appear on Earn Pi after approval
- [ ] Messages send/receive in real-time
- [ ] Profile pictures upload correctly
- [ ] Cart items persist across sessions
- [ ] Verification badge appears after approval
- [ ] All navigation links work
- [ ] Mobile responsive design functions
- [ ] Data persists after page reload

---

## Next Steps

### To Go Live
1. Buy custom domain
2. Deploy to Vercel/Render
3. Set up proper database
4. Add payment gateway (Stripe)
5. Set up email notifications
6. Implement backup system

### To Add Features
1. Backend API routes in `/app/api/`
2. Database queries and mutations
3. Real authentication system
4. Advanced search/filtering
5. Rating system
6. Admin analytics dashboard

---

## Support Resources

- **GitHub Issues**: Report bugs or request features
- **Documentation**: Check README.md for detailed info
- **Code Comments**: Look for [v0] comments explaining logic
- **Console Logs**: Check browser console for debug info

---

**Version**: 1.0.0  
**Last Updated**: 2026-05-06  
**Compatibility**: Node.js 18+, All Modern Browsers
