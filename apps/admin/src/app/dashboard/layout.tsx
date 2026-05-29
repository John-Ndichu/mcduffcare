import * as React from 'react';

import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { AdminTopbar } from '@/components/layout/admin-topbar';

export default function DashboardLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
