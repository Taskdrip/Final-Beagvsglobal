# Beagvs Deployment Instructions

## Final Pre-Export Checklist

Before uploading to GitHub, ensure:

### Code Quality
- [ ] No console.log() except [v0] debug logs
- [ ] No hardcoded sensitive data
- [ ] No TODO comments remaining
- [ ] Code follows existing patterns
- [ ] No duplicate files
- [ ] All imports resolved
- [ ] TypeScript no errors

### Features Tested
- [ ] Authentication works locally
- [ ] All navigation links functional
- [ ] Admin dashboard accessible
- [ ] Payments can be submitted
- [ ] Tasks can be created and approved
- [ ] Messaging works between users
- [ ] Profile functions complete
- [ ] Feed posts persist
- [ ] Data survives page reload

### Documentation Complete
- [ ] README.md updated
- [ ] REPLIT_SETUP.md added
- [ ] ARCHITECTURE.md added
- [ ] GITHUB_TO_REPLIT.md added
- [ ] QUICK_START.md added
- [ ] TESTING.md added
- [ ] This file (DEPLOYMENT.md) added

### Configuration Ready
- [ ] package.json has all dependencies
- [ ] tsconfig.json configured
- [ ] next.config.mjs configured
- [ ] tailwind.config.ts configured
- [ ] postcss.config.mjs configured
- [ ] .gitignore created

---

## GitHub Export Process

### 1. Local Repository Setup
```bash
# Initialize git repository
cd /path/to/beagvs
git init

# Configure git (one-time only)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Beagvs - Pi Network marketplace

Features:
- User authentication with role-based access
- Marketplace with product listings
- Admin payment management system
- Task submission and approval workflow
- User profiles with verification badges
- Social feed with comments and tips
- Direct messaging between users
- Shipping tracking system
- Account verification system
- Real-time Pi price ticker

Ready for Replit deployment"

# Verify commit
git log --oneline
```

### 2. Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: **beagvs**
3. Description: **Pi Network goods and services marketplace with escrow payments**
4. Visibility: **Public** (recommended for open source)
5. Add .gitignore: **Node** (already done locally)
6. Add license: **MIT** (recommended)
7. Click "Create repository"

### 3. Push to GitHub
```bash
# Add remote origin (copy from GitHub)
git remote add origin https://github.com/YOUR_USERNAME/beagvs.git

# Rename branch if needed (GitHub uses 'main')
git branch -M main

# Push to GitHub
git push -u origin main

# Verify (should show: "Branch 'main' set up to track 'origin/main'")
git branch -vv

# Verify files on GitHub
git ls-remote origin
```

### 4. Verify GitHub Repo
1. Visit https://github.com/YOUR_USERNAME/beagvs
2. Verify all files are present:
   - [ ] README.md
   - [ ] package.json
   - [ ] All source files (app/, components/, contexts/, lib/)
   - [ ] Configuration files (tailwind.config.ts, tsconfig.json, etc.)
3. Verify documentation visible on GitHub

---

## Replit Import Process

### Step 1: Navigate to Replit
1. Go to https://replit.com/
2. Click "Create" or "New Repl"
3. Look for "Import from GitHub" option

### Step 2: Import Repository
1. Click "Import from GitHub"
2. Paste: `https://github.com/YOUR_USERNAME/beagvs.git`
3. Project name: **beagvs** (default)
4. Visibility: **Private** or **Public** (your choice)
5. Click "Import from GitHub"

### Step 3: Wait for Import
- Replit clones repository
- Dependencies auto-detect
- Takes 30-60 seconds
- Shows progress messages

### Step 4: Install Dependencies
```bash
# Automatic on first run, but can manually run:
npm install

# Should see: "added X packages"
# Takes 2-5 minutes depending on connection
```

### Step 5: Start Development Server
```bash
# Option A: Click "Run" button in Replit UI
# Option B: Manual start
npm run dev

# Should see:
# ➜  Local:   http://localhost:3000
# ➜  Web:     https://[project-name].replit.dev
```

### Step 6: Access Application
- Replit opens preview automatically
- Or click "Open in new tab"
- Application loads at https://[project-name].replit.dev

---

## Initial Setup on Replit

### Create Admin Account
```
1. Page loads → Click Sign Up
2. Fill form:
   - Username: admin
   - Email: admin@example.com
   - Password: Strong password (12+ chars)
   - Role: Admin
3. Upload optional profile picture
4. Click Sign Up
5. Dashboard loads
```

### Test Core Features
```
1. Click on Feed → Create Post
   - Type test message
   - Click Post
   - Verify post appears

2. Click on Profile
   - Verify user info visible
   - Click Edit
   - Change bio
   - Save changes

3. Click Dashboard
   - Verify admin dashboard link visible
   - Click Admin Panel
   - Verify Payments tab shows

4. Reload page (Ctrl+R)
   - Verify logged in still
   - Verify post and changes persist
```

---

## Configuration for Production

### Update Admin Wallet Address
**File**: `/components/account-verification-dialog.tsx`
```typescript
// Find this section (around line 42):
const ADMIN_WALLET = 'GDR7XQKP9XWJF8ZMHVQP4KXNR2YMTS3L';

// Replace with your actual wallet:
const ADMIN_WALLET = 'YOUR_ACTUAL_WALLET_ADDRESS';
```

### Update Platform Settings
**File**: `/app/list-task/page.tsx`
```typescript
// Find PLATFORM_FEE and update to your amount
const PLATFORM_FEE = 2.50; // Adjust as needed

// Find currency references and update
```

### Update Verification Fee
**File**: `/components/account-verification-dialog.tsx`
```typescript
const VERIFICATION_FEE = 50; // Change if needed
const CURRENCY = 'USD'; // Change to your currency
```

---

## Deployment Checklist

### Before Going Live
- [ ] All features tested on Replit
- [ ] Admin wallet address updated
- [ ] Platform fees configured
- [ ] Documentation read by team
- [ ] Backup system verified working
- [ ] Mobile responsiveness checked
- [ ] All console errors fixed
- [ ] Admin accounts created
- [ ] Test user accounts created
- [ ] Data persists after reload
- [ ] Messaging system functional
- [ ] Payment approval workflow tested

### Monitoring
- [ ] Check console logs for errors
- [ ] Monitor localStorage usage
- [ ] Track user account creation
- [ ] Review payment submissions
- [ ] Monitor system performance

---

## Troubleshooting

### Import Fails
```bash
# GitHub URL wrong format
# Correct: https://github.com/username/repo.git
# Wrong: https://github.com/username/repo

# Solution: Use correct HTTPS URL from Code button on GitHub
```

### Dependencies Won't Install
```bash
# Clear npm cache
npm cache clean --force

# Try again
npm install

# Or use specific version
npm install --no-save
```

### Port Already in Use
```bash
# Use different port
PORT=3001 npm run dev

# Or find and kill process
lsof -i :3000
kill -9 [PID]
```

### Styles Broken
```bash
# Clear build files
rm -rf .next

# Rebuild
npm run dev
```

### Data Not Persisting
```bash
# Open browser DevTools (F12)
# Check Application → LocalStorage
# If empty, data backed up but not restored

# Solution: Reload page again or create new data
```

---

## Post-Deployment Tasks

### Week 1
- [ ] Monitor user signups
- [ ] Check for errors in logs
- [ ] Verify payment submissions working
- [ ] Test admin approval workflow
- [ ] Check data persistence

### Week 2
- [ ] Review user feedback
- [ ] Optimize performance if needed
- [ ] Add any missing features
- [ ] Update documentation
- [ ] Promote platform

### Week 3+
- [ ] Regular maintenance
- [ ] Feature updates
- [ ] Bug fixes
- [ ] Performance monitoring
- [ ] Security updates

---

## Scaling Considerations

### Current Limitations
- localStorage: ~5-10MB max
- ~50 users before slowdown
- No real backend database
- Single-browser testing

### For Production Scale
- Migrate to PostgreSQL/MongoDB
- Implement backend API
- Add authentication service (Firebase/Auth0)
- Use CDN for static assets
- Implement caching layer
- Add monitoring/analytics
- Set up automated backups

---

## Support & Maintenance

### Bug Reports
1. Check existing GitHub issues
2. Create new issue with:
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser/device info
   - Screenshots if applicable

### Feature Requests
1. GitHub Issues → New Issue
2. Label as "enhancement"
3. Describe requested feature
4. Include use case

### Security Issues
1. Do NOT create public issue
2. Email security team privately
3. Include details and reproduction steps
4. Allow time for patch before disclosure

---

## Version History

### v1.0.0 (Current)
- [x] User authentication
- [x] Marketplace system
- [x] Admin dashboard
- [x] Payment management
- [x] Task system
- [x] Messaging
- [x] Social feed
- [x] Verification badges

### Planned v1.1.0
- [ ] Backend API
- [ ] Real database
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Mobile app

### Planned v2.0.0
- [ ] Blockchain integration
- [ ] Smart contracts for escrow
- [ ] Decentralized storage
- [ ] Cross-chain payments

---

**Deployment Guide Version**: 1.0.0  
**Last Updated**: 2026-05-06  
**Status**: Ready for Production
