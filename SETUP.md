# McDuffCare – Setup & Build

## Prerequisites
- Node.js >= 20.0.0  
- pnpm >= 9.0.0 (`npm install -g pnpm@latest`)
- Git Bash / WSL on Windows (recommended), or PowerShell

---

## Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Copy env files and fill in values
cp apps/web/.env.example apps/web/.env.local
cp apps/admin/.env.example apps/admin/.env.local

# 3. Edit .env.local files:
#    NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
#    NEXT_PUBLIC_SITE_URL=http://localhost:3000   (web)
#    NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX              (optional)

# 4. Start development
pnpm dev                  # starts both apps (web :3000, admin :3001)
pnpm web                  # web only
pnpm admin                # admin only
```

---

## Build for Production

```bash
# Both apps
pnpm build

# Individual
pnpm turbo build --filter=web
pnpm turbo build --filter=admin
```

**Note for Windows users:** Build scripts already include `cross-env NODE_OPTIONS="--max-old-space-size=4096"` to prevent OOM crashes on large Next.js builds.

---

## Environment Variables

### apps/web/.env.local
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_SITE_URL=https://www.mcduffcare.co.ke
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_ENABLE_MPESA=true
NEXT_PUBLIC_ENABLE_PRESCRIPTION_UPLOAD=true
```

### apps/admin/.env.local
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_SITE_URL=https://admin.mcduffcare.co.ke
```

---

## Common Build Errors & Fixes

### "React error #143 – Invalid hook call during prerender"
**Cause:** A client component using hooks was being statically pre-rendered.  
**Fix:** All dynamic pages already have `export const dynamic = 'force-dynamic'`.  
If you add a new page that uses hooks, add this line at the top of `page.tsx`:
```ts
export const dynamic = 'force-dynamic';
```

### "Cannot use 'use client' with metadata exports"
**Cause:** `page.tsx` had both `'use client'` and `export const metadata`.  
**Fix:** Split into:
- `page.tsx` – server component with metadata + renders the client component
- `my-page-client.tsx` – `'use client'` component with all hooks/state

### "useSearchParams() hook needs Suspense boundary"
**Fix:** Pages using `useSearchParams` are already wrapped in `<Suspense>`.  
If adding a new page, wrap the client component:
```tsx
import { Suspense } from 'react';
export default function Page() {
  return <Suspense fallback={<div>Loading…</div>}><MyClientComponent /></Suspense>;
}
```

### "Next.js build worker exited with code 3221225786" (Windows OOM)
**Fix:** Already handled via `cross-env NODE_OPTIONS="--max-old-space-size=4096"` in build scripts.  
If still failing, try closing other apps and re-running.

### pnpm workspace package not found
**Fix:** Ensure `pnpm-workspace.yaml` includes `packages/config/*`:
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'packages/config/*'
```
Then run `pnpm install` again.

---

## Architecture: Server vs Client Components

| Type | Rule | Example |
|------|------|---------|
| **Server page** | No hooks, no browser APIs | `about/page.tsx`, `blog/page.tsx` |
| **Dynamic server page** | Wraps client component, add `force-dynamic` | `cart/page.tsx`, `account/page.tsx` |
| **Client page** | Has `'use client'`, uses hooks directly | `wishlist/page.tsx`, admin pages |
| **Client component** | `'use client'` + hooks | `product-card.tsx`, `header.tsx` |

---

## Adding New Pages (Checklist)

1. Create `apps/web/src/app/my-route/page.tsx` (server component)
2. Add `export const dynamic = 'force-dynamic';` if it renders a client component
3. If using `useSearchParams`, wrap client in `<Suspense>`
4. Add metadata export for SEO
5. Create `my-route/my-client.tsx` for the actual UI with `'use client'`

---

## API Contract

The frontend expects a Laravel API at `NEXT_PUBLIC_API_URL` with these endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Returns `{ data: { user, tokens } }` |
| POST | `/auth/register` | Creates account |
| POST | `/auth/refresh` | Refreshes JWT |
| GET | `/auth/me` | Current user |
| GET | `/products` | Paginated product list |
| GET | `/products/:slug` | Single product |
| GET | `/products/featured` | Featured products |
| GET | `/products/search?q=` | Search |
| GET | `/categories` | Category tree |
| GET | `/brands` | Brands list |
| GET | `/cart` | Current cart |
| POST | `/cart/items` | Add item |
| PUT | `/cart/items/:id` | Update qty |
| DELETE | `/cart/items/:id` | Remove item |
| POST | `/cart/coupon` | Apply coupon |
| POST | `/orders` | Create order |
| GET | `/orders` | Order history |
| GET | `/orders/:id` | Single order |
| POST | `/payments/mpesa/stkpush` | M-Pesa STK Push |
| GET | `/admin/dashboard/stats` | Dashboard stats |
| GET | `/admin/products` | Admin product list |
| GET | `/admin/orders` | Admin orders |
| GET | `/admin/customers` | Admin customers |

All list endpoints return: `{ data: [], meta: { current_page, last_page, per_page, total } }`
