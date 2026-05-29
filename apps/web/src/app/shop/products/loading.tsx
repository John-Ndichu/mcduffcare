import { Skeleton } from '@mcduffcare/ui/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="container py-10 space-y-8" aria-busy="true" aria-label="Loading page content">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-xl border overflow-hidden">
            <Skeleton className="aspect-square w-full rounded-none" />
            <div className="p-3 space-y-2">
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-5 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
