# Beagvs

A Pi Network-powered secure marketplace for buying, selling, and shipping goods and services with escrow-protected transactions.

## Run & Operate

- **Dev server**: `npm run dev` (runs on port 5000)
- **Build**: `npm run build`
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
- `components/` — Shared components (navigation, footer, admin, auth)
- `contexts/` — Auth and Cart React contexts
- `lib/` — Utilities, mock data, types, config
- `components/ui/` — shadcn/ui component library

## Architecture decisions

- **LocalStorage-based persistence**: All user data, auth sessions, and feed posts live in browser localStorage (no backend DB)
- **Mock data**: Marketplace listings and orders use static mock data from `lib/mock-data.ts`
- **Admin auth**: Separate credential check in `/admin` (email+password hardcoded) independent of main auth flow
- **Pi Network**: Integration stubs in `lib/pi-network-integration.ts`; not fully live
- **Legacy peer deps**: `date-fns@3` required due to `react-day-picker@8.10.1` peer constraint

## Product

- Marketplace for goods, services, and real estate
- Pi Network escrow-protected payments
- Integrated shipping with tracking
- Feed, Discover, Earn Pi tasks, Leaderboard
- Admin dashboard: users, listings, disputes, escrow, news, shipping

## User preferences

- Admin credentials: `beagvsglobal@gmail.com` / `BEAGVSglobal.2024#`
- Default theme: dark mode

## Gotchas

- Must use `npm install --legacy-peer-deps` due to `date-fns` / `react-day-picker` conflict
- App runs on port 5000 for Replit webview
- Admin panel at `/admin` has its own independent login (not tied to regular user auth)

## Pointers

- shadcn/ui docs: https://ui.shadcn.com
- Next.js App Router: https://nextjs.org/docs/app
