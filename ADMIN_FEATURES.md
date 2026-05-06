# Beagvs Admin Dashboard - Feature Documentation

## Access Credentials
- **Email**: beagvsglobal@gmail.com
- **Password**: BEAGVSglobal.2024#
- **URL**: /admin

## Key Features

### 1. Wallet Management
Admins can now manage multiple Pi Network wallets directly from the dashboard:
- **Add New Wallets**: Create payment, escrow, primary, or backup wallets
- **View All Wallets**: See wallet addresses, balances, and types
- **Activate/Deactivate**: Control which wallets are active for payments
- **Delete Wallets**: Remove wallets no longer needed
- **Real-time Balance**: Monitor Pi balance for each wallet

### 2. User Management
Complete control over all platform users:
- **View All Users**: Search and filter user accounts
- **Edit User Details**: Modify user information
- **Verify Users**: Manually verify user accounts
- **Suspend/Activate**: Control user access to platform
- **Delete Users**: Permanently remove user accounts
- **Role Management**: View user roles (buyer/seller/admin)

### 3. Listing Management
Full marketplace listing control with **Real Estate** support:

#### Listing Types Supported:
- **Goods**: Physical products
- **Services**: Digital and professional services
- **Real Estate**: Properties including houses, apartments, commercial spaces, and land

#### Admin Capabilities:
- **Edit All Listings**: Modify title, description, price, category
- **Real Estate Fields**: Edit bedrooms, bathrooms, square feet, location, year built, property type
- **Approve/Reject**: Control which listings go live
- **Toggle Featured**: Mark listings as featured
- **Delete Listings**: Remove inappropriate or outdated listings
- **Search & Filter**: Find listings quickly

### 4. Dispute Resolution
Manage transaction disputes:
- **View All Disputes**: See open and resolved disputes
- **Resolution Options**:
  - Favor Buyer (full refund)
  - Favor Seller (release payment)
  - Split Payment (50/50)
- **Add Resolution Notes**: Document dispute decisions
- **Track Status**: Monitor dispute lifecycle

### 5. Escrow Management
Control transaction escrows:
- **View Escrow Transactions**: All held funds
- **Release to Seller**: Complete successful transactions
- **Refund to Buyer**: Return funds for cancelled orders
- **Transaction History**: See all escrow activity
- **Amount Tracking**: Monitor Pi amounts in escrow

### 6. Platform Settings
Configure global platform settings:
- **Platform Fee**: Set percentage charged per transaction
- **Featured Listing Price**: Set cost for featured placement
- **Save Settings**: Persist configuration changes

## Real Estate Listings

### New Category Added
Real estate is now a first-class listing type with dedicated fields:

**Property Information:**
- Property Type (House, Apartment, Commercial, Land)
- Number of Bedrooms
- Number of Bathrooms
- Square Footage
- Location/Address
- Year Built
- Price in Pi

**Mock Listings Included:**
1. Modern Downtown Apartment - 2BR/2BA, 1,200 sq ft
2. Luxury Beach House - 4BR/3BA, 3,500 sq ft
3. Commercial Office Space - 2,500 sq ft

### Creating Real Estate Listings
When editing or creating listings:
1. Select "Real Estate" as listing type
2. Additional fields appear for property details
3. All fields are optional except title, description, and price
4. Location field supports full addresses

## Dashboard Statistics

Real-time overview cards showing:
- **Total Users**: Count of registered users
- **Active Listings**: Published marketplace items
- **Pending Disputes**: Disputes awaiting resolution
- **Total Revenue**: Combined escrow + released funds in Pi

## Technical Implementation

### Database Schema Updates
- `ListingType` now includes 'real_estate'
- New optional fields on `Listing` interface:
  - `propertyType?: string`
  - `bedrooms?: number`
  - `bathrooms?: number`
  - `squareFeet?: number`
  - `location?: string`
  - `yearBuilt?: number`

### Wallet System
- Multiple wallet support
- Wallet types: primary, payment, escrow, backup
- Active/inactive status per wallet
- Future-ready for Pi payment integration

### Edit Functionality
All listing edits preserve:
- Original seller ID
- Creation timestamp
- Images and delivery methods
- Only updates modified fields
- Updates `updatedAt` timestamp

## User Experience Improvements

1. **Visual Indicators**:
   - Icons for listing types (Package, Briefcase, Building)
   - Color-coded badges for status
   - Star icons for featured listings

2. **Search Functionality**:
   - Search users by username or email
   - Search listings by title or category
   - Real-time filtering

3. **Confirmation Dialogs**:
   - Delete confirmations prevent accidents
   - Clear action descriptions
   - Cancel options available

4. **Toast Notifications**:
   - Success confirmations
   - Error messages
   - Action feedback

## Security Features

- Admin-only access with credential verification
- Logout functionality clears session
- Protected routes
- Persistent authentication state

## Future Enhancements Ready

The system is prepared for:
- Pi Network payment integration
- Real-time wallet balance updates
- Automated escrow releases
- Email notifications
- Advanced analytics
- Export functionality

## Notes

- All data currently uses mock data for demonstration
- Real Pi payment integration will be added later
- Wallet addresses are placeholders (GB... format)
- Admin verification section removed from user settings
