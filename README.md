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
│   ├── web/                    
│   │   ├── src/
│   │   │   ├── app/           
│   │   │   │   ├── layout.tsx      
│   │   │   │   ├── page.tsx         
│   │   │   │   ├── sitemap.ts      
│   │   │   │   ├── robots.ts       
│   │   │   │   └── shop/
│   │   │   │       ├── layout.tsx   
│   │   │   │       ├── products/    
│   │   │   │       ├── cart/       
│   │   │   │       ├── checkout/     
│   │   │   │       ├── account/
│   │   │   │       └── search/      
│   │   │   ├── components/
│   │   │   │   ├── layout/          
│   │   │   │   ├── sections/        
│   │   │   │   ├── product/        
│   │   │   │   ├── cart/            
│   │   │   │   └── pharmacy/         
│   │   │   ├── lib/
│   │   │   │   ├── analytics/gtag.ts
│   │   │   │   ├── seo/              
│   │   │   │   └── performance/     
│   │   │   └── store/                
│   │   ├── public/
│   │   │   └── manifest.json   
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   └── tsconfig.json
│   │
│   └── admin/                   
│       ├── src/
│       │   ├── app/
│       │   │   ├── layout.tsx       
│       │   │   └── dashboard/
│       │   │       ├── layout.tsx   
│       │   │       ├── page.tsx     
│       │   │       ├── products/    
│       │   │       ├── orders/      
│       │   │       ├── customers/   
│       │   │       ├── analytics/   
│       │   │       └── settings/     
│       │   └── components/
│       │       └── layout/          
│       └── ...configs
│
└── packages/
    ├── ui/                     
    │   └── src/
    │       ├── components/ui/   
    │       ├── types/index.ts  
    │       ├── lib/utils.ts    
    │       └── styles/globals.css 
    │
    ├── api-client/             
    │   └── src/
    │       ├── lib/
    │       │   ├── http-client.ts  
    │       │   └── query-keys.ts    
    │       ├── services/           
    │       └── hooks/              
    │
    └── config/
        ├── typescript/         
        ├── tailwind/           
        └── eslint/             
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
