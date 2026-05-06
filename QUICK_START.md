# Quick Start Checklist

## Before Deployment
- [ ] All features tested locally
- [ ] Console errors cleared
- [ ] Sensitive data removed
- [ ] README updated with correct info
- [ ] Admin wallet address configured
- [ ] Documentation complete

## GitHub Export Steps
- [ ] Initialize git: `git init`
- [ ] Add files: `git add .`
- [ ] Initial commit: `git commit -m "Initial commit"`
- [ ] Create GitHub repo at github.com/new
- [ ] Add remote: `git remote add origin [URL]`
- [ ] Push code: `git push -u origin main`

## Replit Import Steps
1. Go to https://replit.com/new
2. Click "Import from GitHub"
3. Paste repository URL
4. Click "Import"
5. Wait for completion (30-60 seconds)
6. Click "Run" or `npm run dev`

## Initial Setup (5 minutes)
1. **Create Admin Account**
   - Sign up with username: admin
   - Set role as Admin
   
2. **Create Test Accounts**
   - Create buyer and seller test accounts
   
3. **Verify Features**
   - Test login/logout
   - Create post
   - Access admin dashboard
   - Check data persists after reload

## Critical Features to Test
- ✅ Authentication (signup/login/logout)
- ✅ Data persistence (reload page check)
- ✅ Admin dashboard access
- ✅ Payment management
- ✅ Messaging system
- ✅ Profile functions
- ✅ Feed interactions
- ✅ Navigation responsive

## If Something Breaks
```bash
# Clear everything
rm -rf .next node_modules
npm cache clean --force

# Reinstall
npm install

# Rebuild
npm run build

# Run again
npm run dev
```

## Important URLs
- **Local Dev**: http://localhost:3000
- **Replit Preview**: https://[replit-name].replit.dev
- **GitHub Repo**: https://github.com/yourusername/beagvs

## Admin Wallet Setup
Edit `/components/account-verification-dialog.tsx`:
- Line ~42: Change `ADMIN_WALLET` to your wallet address
- Line ~43: Change `VERIFICATION_FEE` to desired amount
- Line ~44: Change `CURRENCY` to your preferred currency

## Contact & Support
- Issues: GitHub Issues tab
- Questions: Check README.md and docs
- Debug: Check browser console (F12) and Replit console

---

**Save this checklist - you'll need it!**
