import * as React from 'react';

import { Skeleton } from '@mcduffcare/ui/components/ui/skeleton';
import { cn } from '@mcduffcare/ui/lib/utils';

export function ProductCardSkeleton({ className }: { readonly className?: string }): React.JSX.Element {
  return (
    <div className={cn('rounded-xl border bg-white shadow-card overflow-hidden', className)}>
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex items-end justify-between pt-2">
          <div className="space-y-1">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-3 w-14" />
          </div>
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>
    </div>
  );
}
