# McDuffCare – Monorepo Setup & Development Guide

## Tech Stack

| Concern | Technology |
|---------|-----------|
| Monorepo | Turborepo 2 + pnpm workspaces |
| Framework | Next.js 15 (App Router, PPR, React 19) |
| Language | TypeScript 5.7 – very strict mode |
| Styling | Tailwind CSS 3.4 + shared brand config |
| Components | shadcn/ui (Radix primitives) |
| Data fetching | TanStack Query v5 (optimistic updates, infinite scroll) |
| HTTP | Axios (token refresh interceptor, retry) |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Icons | Lucide React |
| State | Zustand (cart/auth slices – add as needed) |
| SEO | Next.js Metadata API, JSON-LD, dynamic sitemap |
| Analytics | Google Analytics 4 (gtag) |
| Fonts | Jost (headings) + Helvetica Neue (body) |

---

## Colour Palette

```
Brand Navy    #0A1F6B   --brand-navy
Royal Blue    #1A3FA8   --brand-royal   (primary)
Vivid Blue    #1A4BDB   --brand-blue
Sky Blue      #2E7CF6   --brand-sky
Light Blue    #E8F0FE   --brand-light-blue  (secondary)
Red Accent    #C8102E   --brand-red     (destructive / Rx badge)
```

---

## Prerequisites

```bash
node >= 20.0.0
pnpm >= 9.0.0
```

Install pnpm if needed:
```bash
npm install -g pnpm@latest
```

---

## Quick Start

```bash
# 1. Clone / copy the repo
cd mcduffcare

# 2. Install all dependencies
pnpm install

# 3. Copy env files
cp apps/web/.env.example apps/web/.env.local
cp apps/admin/.env.example apps/admin/.env.local

# 4. Edit .env.local files and set:
#    NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
#    NEXT_PUBLIC_SITE_URL=http://localhost:3000   (web)
#    NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX              (optional)

# 5. Run both apps in parallel
pnpm dev

# OR run individually:
pnpm web    # storefront  → http://localhost:3000
pnpm admin  # dashboard   → http://localhost:3001
```

---

## Monorepo Structure

```
mcduffcare/
├── apps/
│   ├── web/                     ← Customer storefront (Next.js 15)
│   │   ├── src/
│   │   │   ├── app/             ← App Router pages & layouts
│   │   │   │   ├── layout.tsx        ← Root layout (SEO, analytics, providers)
│   │   │   │   ├── page.tsx          ← Homepage
│   │   │   │   ├── sitemap.ts        ← Dynamic sitemap
│   │   │   │   ├── robots.ts         ← Robots.txt
│   │   │   │   └── shop/
│   │   │   │       ├── layout.tsx    ← Header + Footer wrapper
│   │   │   │       ├── products/     ← Product listing (infinite scroll)
│   │   │   │       ├── cart/         ← Cart page (add next)
│   │   │   │       ├── checkout/     ← Checkout (add next)
│   │   │   │       ├── account/      ← User account (add next)
│   │   │   │       └── search/       ← Search results (add next)
│   │   │   ├── components/
│   │   │   │   ├── layout/           ← Header, Footer, Providers, SearchBar
│   │   │   │   ├── sections/         ← Hero, CategoryGrid, FeaturedProducts…
│   │   │   │   ├── product/          ← ProductCard, ProductCardSkeleton, Filters
│   │   │   │   ├── cart/             ← CartDrawer, CartItem (add next)
│   │   │   │   └── pharmacy/         ← PrescriptionUpload (add next)
│   │   │   ├── lib/
│   │   │   │   ├── analytics/gtag.ts ← GA4 event helpers
│   │   │   │   ├── seo/              ← JSON-LD generators (add next)
│   │   │   │   └── performance/      ← Resource hints (add next)
│   │   │   └── store/                ← Zustand slices (add next)
│   │   ├── public/
│   │   │   └── manifest.json    ← PWA manifest
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   └── tsconfig.json
│   │
│   └── admin/                   ← Admin dashboard (Next.js 15)
│       ├── src/
│       │   ├── app/
│       │   │   ├── layout.tsx        ← Root layout (no nav, no SEO indexing)
│       │   │   └── dashboard/
│       │   │       ├── layout.tsx    ← Sidebar + Topbar wrapper
│       │   │       ├── page.tsx      ← Dashboard overview (stats + charts)
│       │   │       ├── products/     ← Products DataTable (TanStack Table)
│       │   │       ├── orders/       ← Orders management (add next)
│       │   │       ├── customers/    ← Customers list (add next)
│       │   │       ├── analytics/    ← Advanced analytics (add next)
│       │   │       └── settings/     ← Settings (add next)
│       │   └── components/
│       │       └── layout/           ← AdminSidebar, AdminTopbar, Providers
│       └── ...configs
│
└── packages/
    ├── ui/                      ← Shared component library
    │   └── src/
    │       ├── components/ui/   ← All shadcn/ui components (Button, Card…)
    │       ├── types/index.ts   ← All domain TypeScript types
    │       ├── lib/utils.ts     ← cn(), formatPrice(), debounce()…
    │       └── styles/globals.css ← CSS vars, brand tokens, base styles
    │
    ├── api-client/              ← Shared API layer
    │   └── src/
    │       ├── lib/
    │       │   ├── http-client.ts   ← Axios instance (auth, refresh, retry)
    │       │   └── query-keys.ts    ← Centralised TanStack Query keys
    │       ├── services/            ← products, auth, cart, orders, admin
    │       └── hooks/               ← use-products, use-auth, use-cart, use-admin
    │
    └── config/
        ├── typescript/          ← base.json, nextjs.json
        ├── tailwind/            ← Shared brand Tailwind config
        └── eslint/              ← Strict ESLint config
```

---

## Key Patterns

### TanStack Query – query key factory
All query keys are centralised in `packages/api-client/src/lib/query-keys.ts`.
Use them everywhere to ensure consistent cache invalidation:
```ts
import { queryKeys } from '@mcduffcare/api-client/lib/query-keys';
queryKeys.products.detail('aspirin-500mg')  // ['products', 'detail', 'aspirin-500mg']
queryKeys.admin.orders.list({ status: 'pending' })
```

### Optimistic updates (cart)
The cart hooks in `use-cart.ts` implement optimistic updates – the UI
updates instantly and rolls back on error. See `useUpdateCartItem` and
`useRemoveCartItem`.

### Axios token refresh
`http-client.ts` queues all failed 401 requests while refreshing the
access token, then replays them. No duplicate refresh calls.

### CSS variables + Tailwind
All colours are defined as CSS custom properties in `globals.css` using
HSL channel values so shadcn/ui semantic tokens work correctly in dark
mode. Raw hex values are also available as `brand-*` Tailwind utilities.

### SEO
- `layout.tsx` sets full `Metadata` including OpenGraph, Twitter, and JSON-LD
- `sitemap.ts` fetches products + categories at build time for a complete XML sitemap
- `robots.ts` blocks account/auth/api routes from crawlers
- Product pages should add their own `generateMetadata()` function

---

## Adding More Pages (Checklist)

1. **Product detail page** – `apps/web/src/app/shop/products/[slug]/page.tsx`
   - `generateMetadata()` for dynamic title/OG/JSON-LD
   - Use `useProduct(slug)` hook
   - Add image gallery, add-to-cart, reviews section

2. **Cart page** – `apps/web/src/app/shop/cart/page.tsx`
   - Use `useCart()`, `useUpdateCartItem()`, `useRemoveCartItem()`

3. **Checkout** – `apps/web/src/app/shop/checkout/page.tsx`
   - M-Pesa STK Push via `ordersService.inititateMpesaPay()`
   - Poll status with `ordersService.checkMpesaStatus()`

4. **Auth pages** – `apps/web/src/app/auth/login/page.tsx` etc.
   - Use `useLogin()`, `useRegister()`, `useForgotPassword()` hooks

5. **Admin orders** – `apps/admin/src/app/dashboard/orders/page.tsx`
   - Use `useAdminOrders()` and `useUpdateOrderStatus()` hooks

---

## Build & Deployment

```bash
# Type-check all packages
pnpm type-check

# Lint all packages
pnpm lint

# Production build (both apps)
pnpm build

# Analyse bundle (web only)
cd apps/web && ANALYZE=true pnpm build
```

Both apps output `standalone` builds. Deploy each to separate services
(Vercel, Railway, Fly.io). Set environment variables per-service.

---

## Backend API Contract

All requests go to `NEXT_PUBLIC_API_URL` (Laravel).
Expected response shapes are typed in `packages/ui/src/types/index.ts`.

| Endpoint | Description |
|----------|-------------|
| `POST /auth/login` | Returns `AuthResponse` with tokens |
| `POST /auth/register` | Creates account + tokens |
| `POST /auth/refresh` | Refreshes access token |
| `GET /products` | Paginated product list |
| `GET /products/:slug` | Single product |
| `GET /products/featured` | Featured products |
| `GET /products/search?q=` | Search |
| `GET /categories` | Category tree |
| `GET /brands` | Brands list |
| `GET /cart` | Current cart |
| `POST /cart/items` | Add item |
| `PUT /cart/items/:id` | Update quantity |
| `DELETE /cart/items/:id` | Remove item |
| `POST /orders` | Create order |
| `POST /payments/mpesa/stkpush` | M-Pesa STK |
| `GET /payments/mpesa/status/:id` | Poll M-Pesa |
| `GET /admin/dashboard/stats` | Admin stats |
| `GET /admin/products` | Admin product list |
| `GET /admin/orders` | Admin order list |
| `GET /admin/customers` | Admin customer list |
