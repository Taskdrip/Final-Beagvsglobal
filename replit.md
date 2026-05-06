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
- `components/hero-slider.tsx` — Full-screen hero slider with Unsplash background images (5 slides)
- `components/feature-slider.tsx` — Legacy slider (no longer used on home page)
- `components/` — Shared components (navigation, footer, admin, auth)
- `contexts/` — Auth and Cart React contexts
- `lib/` — Utilities, mock data, types, config
- `components/ui/` — shadcn/ui component library
- `railway.toml` — Railway deployment config
- `nixpacks.toml` — Nixpacks build config for Railway

## Architecture decisions

- **LocalStorage-based persistence**: All user data, auth sessions, feed posts, and cart live in browser localStorage (no backend DB)
- **Feed seeding**: `app/feed/page.tsx` seeds 5 default community posts to localStorage on first visit (only if empty)
- **Hero slider**: Full-screen hero replaces old static hero + removed FeatureSlider; uses Unsplash real background images with 6s autoplay, progress bar, dot indicators
- **Admin auth**: Separate credential check in `/admin` (email+password hardcoded) independent of main auth flow
- **Pi Network**: Integration stubs in `lib/pi-network-integration.ts`; not fully live
- **Legacy peer deps**: `date-fns@3` required due to `react-day-picker@8.10.1` peer constraint
- **Railway deployment**: `railway.toml` + `nixpacks.toml` configured; `output: 'standalone'` enabled only when `RAILWAY_ENVIRONMENT` env var is set

## Product

- Marketplace for goods, services, and real estate
- Pi Network escrow-protected payments
- Integrated shipping with tracking
- Full-screen hero slider with 5 slides (Marketplace, Earn Pi, Escrow, Community, Shipping)
- Community feed: create posts, like, comment, tip Pi, share (Facebook/Twitter/link copy)
- Feed, Discover, Earn Pi tasks, Leaderboard
- Admin dashboard: users, listings, disputes, escrow, news, shipping

## User preferences

- Admin credentials: `beagvsglobal@gmail.com` / `BEAGVSglobal.2024#`
- Default theme: dark mode

## Gotchas

- Must use `npm install --legacy-peer-deps` due to `date-fns` / `react-day-picker` conflict
- App runs on port 5000 for Replit webview (dev); Railway uses `$PORT` via `next start`
- Admin panel at `/admin` has its own independent login (not tied to regular user auth)
- ChunkLoadErrors after server restart are transient — hard refresh clears them
- `duration-[8000ms]` Tailwind class is ambiguous (harmless warning from `hero-slider.tsx`)

## Pointers

- shadcn/ui docs: https://ui.shadcn.com
- Next.js App Router: https://nextjs.org/docs/app
- Railway deployment: https://docs.railway.com/guides/nextjs
