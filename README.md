# Beagvs - Pi Network Marketplace

A comprehensive goods and services marketplace powered by Pi Network payments with escrow protection, shipping integration, and admin dashboard.

## Features

- **User Authentication**: Secure signup/login system with role-based access (Buyer, Seller, Admin)
- **Marketplace**: Browse, search, and purchase goods and services
- **Seller Dashboard**: List products, manage inventory, and track sales
- **Buyer Dashboard**: View orders, manage wishlist, and track shipments
- **Task System**: Submit tasks for approval and earn Pi Network payments
- **Admin Panel**: 
  - Manual payment verification system
  - User management
  - Listing approval and moderation
  - Task and payment tracking
- **Messaging**: Direct messaging between users
- **Account Verification**: User account verification with manual payment processing
- **Shipping Integration**: Multiple delivery options (local, courier, freight) with tracking
- **Real-time Pi Price**: Live cryptocurrency price tracking
- **Profile System**: User profiles with verification badges, followers/following
- **Feed**: Social feed with posts, comments, and tips

## Tech Stack

- **Frontend**: Next.js 15 with React 19
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context + localStorage
- **Form Validation**: React Hook Form + Zod
- **UI Components**: Radix UI + Lucide Icons
- **Database**: localStorage (for development)
- **Notifications**: Sonner toast notifications

## Prerequisites

- Node.js 18.17 or higher
- npm or yarn package manager
- Git

## Installation & Setup

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/beagvs.git
cd beagvs
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Replit Setup

1. **Import from GitHub**
   - Go to https://replit.com/new
   - Select "Import from GitHub"
   - Paste: `https://github.com/yourusername/beagvs.git`
   - Click "Import"

2. **Install dependencies**
```bash
npm install
```

3. **Run the development server**
```bash
npm run dev
```

4. **Access the application**
   - Click "Run" or use the web preview
   - The app will be available in Replit's built-in browser

## Default Credentials

### Test User Accounts (Pre-populated)

Create accounts directly in the app:

**Buyer Account**
- Username: buyer_john
- Email: buyer@example.com
- Role: Buyer

**Seller Account**
- Username: seller_jane
- Email: seller@example.com
- Role: Seller

**Admin Account**
- Username: admin_user
- Email: admin@example.com
- Role: Admin

All accounts start with empty passwords. Set them during first login.

## Key Features Setup

### Admin Dashboard Access

1. Login with admin credentials
2. Navigate to Dashboard → Admin Panel
3. Available tabs:
   - **Payments**: Review and approve payment requests
   - **Tasks**: Manage task submissions

### User Verification

1. Go to your Profile → Get Verified button
2. Submit payment details with transaction hash and proof screenshot
3. Admin reviews and approves
4. Upon approval, verification badge appears

### Task Submission

1. Navigate to "Submit Task"
2. Add task details (title, description, reward, etc.)
3. Submit transaction hash and payment proof
4. Admin approves before task appears on Earn Pi page

### Marketplace Listing

1. Login as Seller
2. Dashboard → New Listing
3. Add product details and images
4. Submit for admin approval
5. Upon approval, listing appears on Marketplace

## Project Structure

```
beagvs/
├── app/                          # Next.js app routes
│   ├── page.tsx                 # Home page
│   ├── marketplace/             # Marketplace pages
│   ├── profile/                 # User profiles
│   ├── dashboard/               # User dashboard
│   ├── admin/                   # Admin panel
│   ├── feed/                    # Social feed
│   ├── earn/                    # Task listings
│   ├── list-task/               # Task submission
│   ├── messages/                # Messaging
│   ├── track-shipping/          # Shipping tracking
│   └── ...                      # Other pages
├── components/
│   ├── ui/                      # Reusable UI components
│   ├── navigation.tsx           # Main navigation
│   ├── dashboard/               # Dashboard components
│   ├── account-verification-dialog.tsx
│   └── ...                      # Other components
├── contexts/                    # React contexts
│   ├── auth-context.tsx        # Authentication state
│   └── cart-context.tsx        # Shopping cart state
├── lib/                        # Utility functions
│   ├── data-persistence.ts    # Data backup/restore
│   ├── pi-network-integration.ts
│   └── ...                     # Other utilities
├── public/                     # Static assets
├── styles/                     # Global styles
└── package.json               # Dependencies
```

## Data Persistence

The app uses browser localStorage for data storage:

- **Data automatically backed up** on creation/modification
- **Auto-restore** from backup on app startup if data is missing
- **Key data structures**:
  - `beagvs_users`: User accounts
  - `feed_posts`: Social feed posts
  - `marketplace_listings`: Products
  - `payment_requests`: Payment submissions
  - `task_submissions`: Task requests
  - `messages`: User messages

## Important Notes

### For Replit Deployment

1. **Environment Variables**: Currently using default values (can be customized in components)
2. **Storage Persistence**: Uses localStorage - data persists during session but resets on full app rebuild
3. **For Production**: Migrate to a proper database (Firebase, MongoDB, PostgreSQL)

### Admin Wallet Configuration

Update admin wallet address in:
- `/components/account-verification-dialog.tsx` (line ~42)
- `/app/list-task/page.tsx` (payment section)

Change the `ADMIN_WALLET` constant to your actual wallet address.

### Customization

**Change Platform Fee:**
- Edit `/app/list-task/page.tsx` → Search for `PLATFORM_FEE`

**Change Verification Fee:**
- Edit `/components/account-verification-dialog.tsx` → Search for `VERIFICATION_FEE`

**Change Pi Price Ticker Interval:**
- Edit `/lib/pi-price-tracker.ts` → Search for `PRICE_UPDATE_INTERVAL`

## Troubleshooting

### Data Not Persisting

1. Check browser localStorage is enabled
2. Clear browser cache: DevTools → Application → Clear storage
3. Restart the application

### Login Issues

1. Clear localStorage: `localStorage.clear()` in DevTools console
2. Refresh the page
3. Create a new account

### Payment Not Showing in Admin Dashboard

1. Ensure you're logged in as admin
2. Navigate to Admin → Payments tab
3. Check if status is "pending"
4. Hard refresh the page (Ctrl+Shift+R)

### Styling Issues

1. Ensure Tailwind CSS is properly compiled
2. Clear `.next` folder: `rm -rf .next`
3. Rebuild: `npm run build`

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## API Endpoints (If Backend Added Later)

```
POST   /api/auth/register     - User registration
POST   /api/auth/login        - User login
GET    /api/users/:id         - Get user profile
GET    /api/marketplace       - List products
POST   /api/listings          - Create listing
GET    /api/payments          - Get payments (admin)
PATCH  /api/payments/:id      - Approve/reject payment (admin)
GET    /api/tasks             - Get tasks
POST   /api/messages          - Send message
```

## Migration to Production Database

To migrate from localStorage to a real database:

1. **Choose a database**: Firebase, MongoDB, PostgreSQL, Supabase
2. **Update `/contexts/auth-context.tsx`**: Replace localStorage calls with API calls
3. **Create `/app/api/` routes**: Implement backend endpoints
4. **Update components**: Replace direct localStorage access with API calls
5. **Deploy**: Use Vercel, Render, or your preferred hosting

## Contributing

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open a Pull Request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues, questions, or suggestions:
1. Open an issue on GitHub
2. Check existing documentation
3. Review troubleshooting section above

## Roadmap

- [ ] Backend API integration
- [ ] Real database migration
- [ ] Payment gateway integration (Stripe, Pi Network)
- [ ] Advanced search and filtering
- [ ] Ratings and reviews system
- [ ] Dispute resolution system
- [ ] Mobile app (React Native)
- [ ] Push notifications
- [ ] Advanced analytics (admin)
- [ ] Multi-language support

---

**Built with ❤️ using Next.js and Pi Network**

Last Updated: 2026-05-06
