/**
 * Zustand store – lightweight client state (UI only).
 * Server/async data lives in TanStack Query.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ── Cart UI state (drawer open/close) ──────────────────────────────────────────
interface CartUIState {
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

export const useCartUI = create<CartUIState>()((set) => ({
  isOpen: false,
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
}));

// ── Recently viewed products (persisted) ──────────────────────────────────────
interface RecentlyViewedState {
  productIds: number[];
  addProduct: (id: number) => void;
  clear: () => void;
}

export const useRecentlyViewed = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      productIds: [],
      addProduct: (id) =>
        set((s) => ({
          productIds: [id, ...s.productIds.filter((p) => p !== id)].slice(0, 12),
        })),
      clear: () => set({ productIds: [] }),
    }),
    {
      name: 'mcduff-recently-viewed',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

// ── Wishlist (persisted) ────────────────────────────────────────────────────────
interface WishlistState {
  productIds: number[];
  toggle: (id: number) => void;
  isWishlisted: (id: number) => boolean;
  clear: () => void;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],
      toggle: (id) =>
        set((s) => ({
          productIds: s.productIds.includes(id)
            ? s.productIds.filter((p) => p !== id)
            : [...s.productIds, id],
        })),
      isWishlisted: (id) => get().productIds.includes(id),
      clear: () => set({ productIds: [] }),
    }),
    {
      name: 'mcduff-wishlist',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

// ── UI preferences ─────────────────────────────────────────────────────────────
interface UIPrefsState {
  productListLayout: 'grid' | 'list';
  setProductListLayout: (layout: 'grid' | 'list') => void;
}

export const useUIPrefs = create<UIPrefsState>()(
  persist(
    (set) => ({
      productListLayout: 'grid',
      setProductListLayout: (layout) => set({ productListLayout: layout }),
    }),
    {
      name: 'mcduff-ui-prefs',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
