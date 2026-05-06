# GitHub to Replit: Complete Migration Guide

## Pre-Export Checklist

### Before pushing to GitHub:
- [ ] Remove all API keys and secrets
- [ ] Clean up console.log() statements (keep [v0] debug logs)
- [ ] Update README with your repository URL
- [ ] Test all features locally
- [ ] Verify data persistence works
- [ ] Test admin workflows
- [ ] Clear .next and node_modules (will be ignored by .gitignore)

---

## Step-by-Step Export to GitHub

### 1. Initialize Git Repository

```bash
# Navigate to project directory
cd beagvs

# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Beagvs marketplace with all features"
```

### 2. Create GitHub Repository

1. Go to https://github.com/new
2. Fill in:
   - **Repository name**: `beagvs`
   - **Description**: "Pi Network goods and services marketplace"
   - **Public/Private**: Choose based on preference
   - **Add .gitignore**: Select "Node"
   - **Add license**: Choose MIT or your preferred license
3. Click "Create repository"

### 3. Push Code to GitHub

```bash
# Add remote origin (replace with your repo URL)
git remote add origin https://github.com/yourusername/beagvs.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main

# Verify success
git log --oneline -n 5
```

### 4. Add Important Files to Repository

Ensure these files are in root:
- ✅ `README.md` - Setup instructions
- ✅ `REPLIT_SETUP.md` - Replit-specific guide
- ✅ `ARCHITECTURE.md` - Technical documentation
- ✅ `.gitignore` - Node.js standard
- ✅ `package.json` - Dependencies
- ✅ `tsconfig.json` - TypeScript config
- ✅ `next.config.mjs` - Next.js config
- ✅ `tailwind.config.ts` - Tailwind config
- ✅ `postcss.config.mjs` - PostCSS config

---

## .gitignore Configuration

Ensure `.gitignore` contains:

```
# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
.next/
out/
*.log

# IDE
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store

# Environment
.env
.env.local
.env.*.local

# Build
/dist
/build
```

---

## Complete Replit Import Process

### Method 1: Import from GitHub (Recommended)

1. **Go to Replit**
   - Visit https://replit.com/new
   - Look for import options

2. **Select Import from GitHub**
   - Click "Import from GitHub"
   - Paste: `https://github.com/yourusername/beagvs.git`
   - Choose project name (default: beagvs)
   - Click "Import from GitHub"

3. **Wait for Import**
   - Replit clones your repository
   - Takes 30-60 seconds
   - You see "Importing..." message

4. **Install Dependencies**
   ```bash
   npm install
   ```
   - Takes 2-5 minutes
   - Shows progress in console

5. **Start Development Server**
   - Click "Run" button or:
   ```bash
   npm run dev
   ```
   - Server starts on port 3000
   - Preview opens automatically

---

### Method 2: Upload ZIP File

1. **Export from GitHub**
   - Go to your GitHub repo
   - Click "Code" → "Download ZIP"
   - Extract ZIP file

2. **Create Replit Project**
   - https://replit.com/new
   - Select "Blank - Next.js" (or Node.js)
   - Name: beagvs

3. **Upload Files**
   - Replit file manager → Upload files
   - Or drag-drop all files

4. **Install & Run**
   ```bash
   npm install
   npm run dev
   ```

---

## First Run on Replit

### What Happens Automatically
- ✅ Dependencies installed
- ✅ TypeScript compiled
- ✅ Tailwind CSS processed
- ✅ Next.js optimizations
- ✅ Development server starts
- ✅ Hot reload enabled

### Initial Setup Steps

**1. Create Default Admin Account**
```
Home Page → Sign Up
- Username: admin
- Email: admin@example.com
- Password: Choose a strong password
- Role: Admin
- Click "Sign Up"
```

**2. Create Test Buyer Account**
```
Sign up again with:
- Username: buyer_test
- Email: buyer@example.com
- Role: Buyer
```

**3. Create Test Seller Account**
```
Sign up again with:
- Username: seller_test
- Email: seller@example.com
- Role: Seller
```

**4. Access Admin Dashboard**
```
Login as admin
Dashboard → Admin Panel
```

---

## Verify Installation

### Checklist After First Run

Test these features to ensure proper setup:

#### Authentication ✓
- [ ] Create new account
- [ ] Login with credentials
- [ ] Session persists on page reload
- [ ] Logout works
- [ ] Redirect to login when not authenticated

#### Data Persistence ✓
- [ ] Create post on feed
- [ ] Reload page
- [ ] Post still visible
- [ ] Profile changes saved
- [ ] Cart items persist

#### Admin Functions ✓
- [ ] Login as admin
- [ ] Access admin dashboard
- [ ] View payment requests (if any)
- [ ] Approve/reject functionality works
- [ ] User status updates after approval

#### UI/UX ✓
- [ ] Navigation menu works
- [ ] Mobile menu scrollable
- [ ] All links functional
- [ ] Responsive design works
- [ ] No console errors

#### Core Features ✓
- [ ] Create marketplace listing
- [ ] Add item to cart
- [ ] Send message to user
- [ ] Create feed post
- [ ] View and interact with posts
- [ ] Follow/unfollow users

---

## Troubleshooting Replit Import

### Issue 1: Import Fails
```
Error: "Failed to clone repository"
```
**Solutions:**
1. Check GitHub URL is correct
2. Repository is public (not private)
3. Try re-importing
4. Use upload ZIP method instead

### Issue 2: Dependencies Won't Install
```
npm ERR! code ERR_SOCKET_HANG_UP
```
**Solutions:**
```bash
# Clear npm cache
npm cache clean --force

# Try again
npm install

# Or use different npm version
npm use 18
npm install
```

### Issue 3: Port 3000 Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solutions:**
```bash
# Use different port
PORT=3001 npm run dev

# Or kill process
pkill -f "node.*dev"
npm run dev
```

### Issue 4: TypeScript Errors
```
Error: Type 'X' is not assignable to type 'Y'
```
**Solutions:**
```bash
# Rebuild TypeScript
rm -rf .next node_modules/.next

# Reinstall
npm install

# Run again
npm run dev
```

### Issue 5: Styles Look Broken
```
Tailwind CSS not applied
```
**Solutions:**
```bash
# Rebuild Tailwind
rm -rf .next

# Run build first
npm run build

# Then dev
npm run dev
```

### Issue 6: localStorage Not Working
```
Features like login not working
```
**Solutions:**
1. Clear browser storage: DevTools → Storage → Clear All
2. Check browser allows localStorage (not in private mode)
3. Close and reopen Replit preview
4. Try different browser

---

## Configuration for Replit

### Environment Variables (Optional)

If you need environment variables on Replit:

1. Click "Secrets" (lock icon) on left sidebar
2. Add new secret:
   - Key: `NEXT_PUBLIC_APP_NAME`
   - Value: `Beagvs`

**Available Variables:**
- `NEXT_PUBLIC_APP_NAME` - App name
- `NEXT_PUBLIC_ADMIN_EMAIL` - Admin email
- `NEXT_PUBLIC_API_URL` - API endpoint (when added)

### Replit Specific Configuration

**`.replit` file** (auto-generated):
```bash
run = "npm run dev"
modules = ["nodejs-18"]
```

**`replit.nix`** (auto-generated):
Contains package dependencies needed for Replit

---

## Updating from GitHub

To keep your Replit version updated:

```bash
# Check current branch
git status

# Pull latest changes
git pull origin main

# Reinstall if dependencies changed
npm install

# Restart dev server
npm run dev
```

---

## Deploying from Replit

### Option 1: Keep on Replit
- Free tier limited to 0.5vCPU
- Storage limited to 5GB
- Good for development/testing

### Option 2: Deploy to Vercel (Recommended)
1. Connect your GitHub account to Vercel
2. Select beagvs repository
3. Click "Deploy"
4. Vercel handles deployment automatically
5. Get production URL

### Option 3: Deploy to Render
1. Create Render account
2. New Web Service → Connect GitHub
3. Select beagvs repository
4. Deploy settings → Run: `npm run dev`
5. Deploy

### Option 4: Deploy to Railway
1. Create Railway account
2. New Project → GitHub repo
3. Link beagvs repository
4. Railway auto-detects Node.js
5. Deploy automatically

---

## Sharing Your Replit Project

### Share with Others
1. Click "Share" button (top right)
2. Choose sharing option:
   - **Edit Link**: Others can modify (with permission)
   - **View Only Link**: Read-only access

### Multiplayer Coding
1. Click "Share"
2. Copy edit link
3. Send to collaborators
4. Real-time coding together

---

## Maintenance Tasks

### Regular Checks
```bash
# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Update dependencies
npm update

# Clear cache if issues occur
npm cache clean --force
```

### Backup Important Data
```javascript
// In browser console:
// Download all localStorage data
const data = {};
for(let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  data[key] = localStorage.getItem(key);
}
console.log(JSON.stringify(data, null, 2));

// Save to file:
// Right-click console output → Copy → Paste to .json file
```

---

## Common Commands Cheat Sheet

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server

# Dependencies
npm install              # Install all dependencies
npm install <package>    # Install new package
npm update               # Update all packages
npm audit                # Check security issues

# Debugging
npm run lint             # Check code quality
npm run dev -- -p 3001  # Run on custom port

# Database (when added)
npm run db:migrate       # Run migrations
npm run db:seed          # Seed test data

# Git
git status               # Check changes
git add .                # Stage changes
git commit -m "message"  # Commit changes
git push                 # Push to GitHub
git pull                 # Pull from GitHub
```

---

## Performance Tips

### Replit Optimization
1. Use "Always on" subscription for continuous running
2. Monitor CPU usage in Replit stats
3. Close unused tabs
4. Clear browser cache regularly

### Next.js Optimization
```bash
# Enable static generation
npm run build

# Analyze bundle size
npm run build -- --analyze

# Production mode
npm run build
npm start
```

---

## Getting Help

### Resources
- **GitHub Issues**: Report bugs or ask questions
- **Replit Docs**: https://docs.replit.com/
- **Next.js Docs**: https://nextjs.org/docs
- **tailwindcss**: https://tailwindcss.com/docs

### Debugging Steps
1. Check browser console for errors (F12)
2. Check Replit console output
3. Verify data in localStorage (DevTools → Storage)
4. Search GitHub issues for similar problems
5. Check ARCHITECTURE.md for technical details

---

## Success Indicators

✅ Your setup is successful when:
- Application loads at `https://[replit-name].replit.dev`
- Can create account and login
- Can create and view posts
- Admin dashboard accessible to admin users
- Payment requests queue shows submissions
- Messages work between users
- All navigation links functional
- No console errors
- Data persists after reload

---

**Migration Guide Version**: 1.0.0  
**Last Updated**: 2026-05-06  
**Total Setup Time**: 10-15 minutes
