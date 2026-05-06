# Beagvs Authentication System

## Overview
Beagvs features a comprehensive authentication system with multiple sign-in methods and role-based access control.

## Authentication Methods

### 1. Email/Password Authentication
Users can sign up or sign in using traditional email and password credentials.

**Sign Up Features:**
- Username selection
- Email validation
- Password requirements (minimum 8 characters)
- Password confirmation
- Account type selection (Buyer or Seller)

**Sign In Features:**
- Email and password validation
- Persistent sessions across page reloads
- Automatic credential storage

### 2. Pi Network Authentication
Users can authenticate using their Pi Network account for seamless integration with Pi payments.

## Account Types

### Buyer Account
- Browse marketplace listings
- Purchase goods and services
- Access cart and checkout
- View order history
- Manage profile settings

### Seller Account
- All buyer features
- Create and manage listings
- View sales analytics
- Manage inventory
- Access seller dashboard

### Admin Account
**Credentials:**
- Email: beagvsglobal@gmail.com
- Password: BEAGVSglobal.2024#

**Admin Features:**
- Full user management (view, edit, verify, suspend, delete)
- Listing moderation (approve, reject, feature)
- Dispute resolution
- Escrow management
- Platform settings configuration
- Revenue analytics

## Role Toggling

Users can switch between Buyer and Seller roles at any time:

1. Navigate to **Dashboard → Settings**
2. Scroll to **Account Type** section
3. Select desired role (Buyer or Seller)
4. Click **Upgrade to Seller** or **Switch to Buyer**
5. Changes are saved automatically

## Session Management

- User sessions persist across page reloads using localStorage
- Credentials are securely stored in the browser
- Users remain authenticated until they explicitly log out
- Admin status is automatically detected based on credentials

## Security Features

- Password validation and confirmation
- Role-based access control
- Protected admin routes
- Secure credential storage
- Automatic admin detection

## User Interface

### Authentication Modal
The authentication modal appears when users click "Sign In" and includes:
- Tabbed interface (Sign In / Sign Up)
- Form validation with real-time feedback
- Loading states during authentication
- Pi Network integration button
- Clear error messages

### Navigation Indicators
- User avatar and dropdown menu
- Role badge display (Admin, Buyer, Seller)
- Quick access to dashboard and settings
- Logout functionality

## Implementation Details

### Key Files
- `/components/auth/auth-modal.tsx` - Authentication modal component
- `/contexts/auth-context.tsx` - Authentication state management
- `/app/dashboard/settings/page.tsx` - Role management interface
- `/app/admin/page.tsx` - Admin dashboard
- `/components/navigation.tsx` - Navigation with auth integration

### State Management
Authentication state is managed through React Context API with:
- User data persistence
- Role updates
- Session restoration
- Loading states
- Error handling

## Usage Examples

### For Regular Users
1. Click "Sign In" in navigation
2. Choose "Sign Up" tab
3. Enter username, email, and password
4. Select account type (Buyer or Seller)
5. Click "Create Account"
6. Start using Beagvs!

### For Admin Access
1. Click "Sign In" in navigation
2. Enter admin email: beagvsglobal@gmail.com
3. Enter admin password: BEAGVSglobal.2024#
4. Click "Sign In"
5. Access admin panel from user dropdown menu

### For Pi Network Users
1. Click "Sign In" in navigation
2. Click "Sign in with Pi Network" button
3. Complete Pi Network authentication
4. Account is automatically created/linked

## Notes

- Admin credentials are hardcoded for demo purposes
- In production, implement proper backend authentication
- Consider adding 2FA for admin accounts
- Implement password reset functionality
- Add email verification for new accounts
