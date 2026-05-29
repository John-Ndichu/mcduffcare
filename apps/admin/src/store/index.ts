import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SidebarState {
  collapsed: boolean;
  toggle: () => void;
  setCollapsed: (v: boolean) => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      collapsed: false,
      toggle: () => set((s) => ({ collapsed: !s.collapsed })),
      setCollapsed: (v) => set({ collapsed: v }),
    }),
    {
      name: 'mcduff-admin-sidebar',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

interface TablePrefsState {
  pageSize: number;
  setPageSize: (n: number) => void;
}

export const useTablePrefs = create<TablePrefsState>()(
  persist(
    (set) => ({
      pageSize: 20,
      setPageSize: (n) => set({ pageSize: n }),
    }),
    {
      name: 'mcduff-admin-table-prefs',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
