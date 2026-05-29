'use client';

import * as React from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Input } from '@mcduffcare/ui/components/ui/input';
import { Badge } from '@mcduffcare/ui/components/ui/badge';
import { cn, formatPrice, debounce } from '@mcduffcare/ui/lib/utils';
import { useProductSearch } from '@mcduffcare/api-client/hooks/use-products';

export function SearchBar({ className }: { readonly className?: string }): React.JSX.Element {
  const router = useRouter();
  const [query, setQuery] = React.useState('');
  const [debouncedQuery, setDebouncedQuery] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const debouncedSetQuery = React.useMemo(
    () => debounce((q: string) => setDebouncedQuery(q), 300),
    [],
  );

  const { data: results, isLoading } = useProductSearch(debouncedQuery, 6);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    debouncedSetQuery(val);
    setIsOpen(val.trim().length >= 2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length > 0) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleClear = () => {
    setQuery('');
    setDebouncedQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  // Close on outside click
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current !== null && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={cn('relative w-full max-w-2xl', className)}>
      <form onSubmit={handleSubmit} role="search">
        <Input
          ref={inputRef}
          type="search"
          value={query}
          onChange={handleChange}
          onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
          placeholder="Search medicines, vitamins, health products..."
          aria-label="Search products"
          autoComplete="off"
          leftElement={
            isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )
          }
          rightElement={
            query.length > 0 ? (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear search"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            ) : undefined
          }
          className="pr-8 h-10 rounded-lg border-2 border-primary/20 focus-visible:border-primary focus-visible:ring-0"
        />
      </form>

      {/* Dropdown results */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-xl border bg-popover shadow-xl animate-fade-in overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          ) : results !== undefined && results.length > 0 ? (
            <>
              <ul role="listbox" aria-label="Search results">
                {results.map((product) => (
                  <li key={product.id} role="option" aria-selected={false}>
                    <Link
                      href={`/shop/products/${product.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors"
                    >
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border bg-muted">
                        {product.primary_image !== null ? (
                          <Image
                            src={product.primary_image.url}
                            alt={product.primary_image.alt}
                            fill
                            className="object-contain"
                            sizes="40px"
                          />
                        ) : (
                          <div className="h-full w-full bg-muted" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.category.name}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold text-primary font-heading">
                          {formatPrice(product.price)}
                        </p>
                        {product.requires_prescription && (
                          <Badge variant="rx" className="text-2xs px-1 py-0">Rx</Badge>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="border-t px-4 py-2 bg-muted/40">
                <Link
                  href={`/search?q=${encodeURIComponent(query)}`}
                  onClick={() => setIsOpen(false)}
                  className="text-sm text-primary font-medium hover:underline"
                >
                  See all results for &ldquo;{query}&rdquo; →
                </Link>
              </div>
            </>
          ) : (
            debouncedQuery.trim().length >= 2 && (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                No products found for &ldquo;{debouncedQuery}&rdquo;
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
