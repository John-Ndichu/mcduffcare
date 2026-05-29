/**
 * Google Analytics 4 event helpers.
 * Import and call these from client components.
 */

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, unknown>,
    ) => void;
  }
}

function gtag(...args: Parameters<Window['gtag']>): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag(...args);
}

// ── Page view ──────────────────────────────────────────────────────────────────
export function trackPageView(url: string): void {
  const gaId = process.env['NEXT_PUBLIC_GA_ID'];
  if (gaId === undefined || gaId === '') return;
  gtag('config', gaId, { page_path: url });
}

// ── Ecommerce events ──────────────────────────────────────────────────────────
export function trackViewItem(product: {
  id: number;
  name: string;
  price: number;
  category: string;
}): void {
  gtag('event', 'view_item', {
    currency: 'KES',
    value: product.price,
    items: [
      {
        item_id: String(product.id),
        item_name: product.name,
        item_category: product.category,
        price: product.price,
        quantity: 1,
      },
    ],
  });
}

export function trackAddToCart(product: {
  id: number;
  name: string;
  price: number;
  category: string;
  quantity: number;
}): void {
  gtag('event', 'add_to_cart', {
    currency: 'KES',
    value: product.price * product.quantity,
    items: [
      {
        item_id: String(product.id),
        item_name: product.name,
        item_category: product.category,
        price: product.price,
        quantity: product.quantity,
      },
    ],
  });
}

export function trackBeginCheckout(value: number): void {
  gtag('event', 'begin_checkout', { currency: 'KES', value });
}

export function trackPurchase(order: {
  order_number: string;
  total: number;
  shipping: number;
  tax: number;
}): void {
  gtag('event', 'purchase', {
    transaction_id: order.order_number,
    currency: 'KES',
    value: order.total,
    shipping: order.shipping,
    tax: order.tax,
  });
}

export function trackSearch(query: string): void {
  gtag('event', 'search', { search_term: query });
}

export function trackLogin(method: string): void {
  gtag('event', 'login', { method });
}

export function trackSignUp(method: string): void {
  gtag('event', 'sign_up', { method });
}
