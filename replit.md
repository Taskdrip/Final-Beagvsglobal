# Beagvs

A Pi Network-powered secure marketplace for buying, selling, and shipping goods and services with escrow-protected transactions.

## Run & Operate

- **Dev server**: `npm run dev` (runs on port 5000)
- **Build**: `npm run build`
- **Start (prod)**: `npm run start`
- **Install deps**: `npm install --legacy-peer-deps`

**Admin login**: `beagvsglobal@gmail.com` / `BEAGVSglobal.2024#` → visit `/admin`

## Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: Tailwind CSS + shadcn/ui (Radix primitives)
- **Language**: TypeScript
- **State/Auth**: React Context (localStorage-based)
- **Charts**: Recharts
- **Notifications**: Sonner

## Where things live

- `app/` — Next.js App Router pages
- `app/admin/` — Admin dashboard (requires admin login)
- `app/marketplace/` — Product listings
- `app/dashboard/` — User dashboard (listings, orders, messages, settings)
- `app/feed/` — Community feed with seeded posts, social interactions
- `app/ship-with-pi/` — Shipping request form with login gate + My Requests history
- `app/earn/` — Earn Pi tasks (seeds 8 default tasks to localStorage on first visit)
- `app/messages/` — Real-time-ish messaging with client-side redirect guard
- `components/hero-slider.tsx` — Full-screen hero slider with Unsplash background images (5 slides)
- `components/auth/auth-modal.tsx` — Sign In / Sign Up dialog (email+password, role select)
- `contexts/auth-context.tsx` — Auth state, handleAuthSuccess with proper error toasts
- `components/` — Shared components (navigation, footer, admin, auth)
- `contexts/` — Auth and Cart React contexts
- `lib/` — Utilities, mock data, types, config
- `components/ui/` — shadcn/ui component library
- `railway.toml` — Railway deployment config
- `nixpacks.toml` — Nixpacks build config for Railway

## Architecture decisions

- **LocalStorage-based persistence**: All user data, auth sessions, feed posts, and cart live in browser localStorage (no backend DB)
- **Feed seeding**: `app/feed/page.tsx` seeds 5 default community posts to localStorage on first visit (only if empty)
- **Earn tasks seeding**: `app/earn/page.tsx` seeds 8 default tasks on first visit if `earn_tasks` is empty
- **Hero slider**: Full-screen hero replaces old static hero; uses Unsplash real background images with 6s autoplay, progress bar, dot indicators
- **Admin auth**: Accepts both `BEAGVSglobal.2024#` and legacy `TRInity.123` as admin passwords; admin role enforced in `handleAuthSuccess`
- **Pi Network button**: Shows "coming soon" toast — not wired to real Pi SDK (stubs in `lib/pi-network-integration.ts`)
- **Client-side redirects**: Protected pages (`/dashboard`, `/messages`, `/list-task`) use `useEffect` + `router.push` (not server `redirect()`)
- **Legacy peer deps**: `date-fns@3` required due to `react-day-picker@8.10.1` peer constraint
- **Railway deployment**: `railway.toml` + `nixpacks.toml` configured; `output: 'standalone'` enabled only when `RAILWAY_ENVIRONMENT` env var is set

## Product

- Marketplace for goods, services, and real estate
- Pi Network escrow-protected payments
- Integrated shipping with tracking; Ship with Pi page shows login banner + My Requests for signed-in users
- Full-screen hero slider with 5 slides (Marketplace, Earn Pi, Escrow, Community, Shipping)
- Community feed: create posts, like, comment, tip Pi, share (Facebook/Twitter/link copy)
- Earn Pi tasks (8 seeded tasks with difficulty, time estimate, and Pi reward)
- Feed, Discover, Earn Pi tasks, Leaderboard
- Admin dashboard: users, listings, disputes, escrow, news, shipping
- Auth modal: email sign-in/sign-up with role selection (buyer/seller), duplicate email detection, password error toasts

## User preferences

- Admin credentials: `beagvsglobal@gmail.com` / `BEAGVSglobal.2024#`
- Default theme: dark mode

## Gotchas

- Must use `npm install --legacy-peer-deps` due to `date-fns` / `react-day-picker` conflict
- App runs on port 5000 for Replit webview (dev); Railway uses `$PORT` via `next start`
- Admin panel at `/admin` has its own independent login (not tied to regular user auth)
- ChunkLoadErrors after server restart are transient — hard refresh clears them
- `duration-[8000ms]` Tailwind class is ambiguous (harmless warning from `hero-slider.tsx`)
- Auth context `handleAuthSuccess` shows toast errors and keeps modal open on wrong password (does NOT silently close)
- Earn tasks / feed posts are seeded client-side in useEffect — initial SSR render shows empty, populates on hydration

## Pointers

- shadcn/ui docs: https://ui.shadcn.com
- Next.js App Router: https://nextjs.org/docs/app
- Railway deployment: https://docs.railway.com/guides/nextjs
