'use client';

import * as React from 'react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@mcduffcare/ui/components/ui/accordion';
import { Switch } from '@mcduffcare/ui/components/ui/switch';
import { Label } from '@mcduffcare/ui/components/ui/label';
import { cn } from '@mcduffcare/ui/lib/utils';
import type { ProductFilters } from '@mcduffcare/ui/types';

import { useCategories, useBrands } from '@mcduffcare/api-client/hooks/use-products';

interface ProductFiltersPanelProps {
  readonly filters: Omit<ProductFilters, 'page'>;
  readonly onChange: (key: string, value: string | undefined) => void;
}

const PRICE_RANGES = [
  { label: 'Under KES 500', min: 0, max: 500 },
  { label: 'KES 500 – 1,000', min: 500, max: 1000 },
  { label: 'KES 1,000 – 2,500', min: 1000, max: 2500 },
  { label: 'KES 2,500 – 5,000', min: 2500, max: 5000 },
  { label: 'Over KES 5,000', min: 5000, max: undefined },
];

export function ProductFiltersPanel({ filters, onChange }: ProductFiltersPanelProps): React.JSX.Element {
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();

  const currentPriceKey = filters.min_price !== undefined || filters.max_price !== undefined
    ? `${filters.min_price ?? 0}-${filters.max_price ?? ''}`
    : null;

  const selectPrice = (min: number, max: number | undefined) => {
    const key = `${min}-${max ?? ''}`;
    if (currentPriceKey === key) {
      onChange('min_price', undefined);
      onChange('max_price', undefined);
    } else {
      onChange('min_price', String(min));
      onChange('max_price', max !== undefined ? String(max) : undefined);
    }
  };

  return (
    <div className="text-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-heading font-semibold text-foreground">Filters</h3>
      </div>

      <Accordion type="multiple" defaultValue={['category', 'price', 'availability']} className="space-y-0">
        <AccordionItem value="category" className="border-b">
          <AccordionTrigger className="py-3 font-heading text-sm font-semibold">
            Category
          </AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-1 pb-2">
              {(categories ?? []).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() =>
                      onChange('category', filters.category === cat.slug ? undefined : cat.slug)
                    }
                    className={cn(
                      'w-full flex items-center justify-between rounded-md px-2 py-1.5 text-left text-sm transition-colors',
                      filters.category === cat.slug
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'hover:bg-muted',
                    )}
                  >
                    <span>{cat.name}</span>
                    {cat.products_count !== undefined && (
                      <span className="text-xs text-muted-foreground">{cat.products_count}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price" className="border-b">
          <AccordionTrigger className="py-3 font-heading text-sm font-semibold">
            Price Range
          </AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-1 pb-2">
              {PRICE_RANGES.map(({ label, min, max }) => {
                const key = `${min}-${max ?? ''}`;
                const isActive = currentPriceKey === key;
                return (
                  <li key={label}>
                    <button
                      onClick={() => selectPrice(min, max)}
                      className={cn(
                        'w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors',
                        isActive ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted',
                      )}
                    >
                      {label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </AccordionContent>
        </AccordionItem>

        {brands !== undefined && brands.length > 0 && (
          <AccordionItem value="brand" className="border-b">
            <AccordionTrigger className="py-3 font-heading text-sm font-semibold">
              Brand
            </AccordionTrigger>
            <AccordionContent>
              <ul className="max-h-48 overflow-y-auto space-y-1 pb-2">
                {brands.map((brand) => (
                  <li key={brand.id}>
                    <button
                      onClick={() =>
                        onChange('brand', filters.brand === brand.slug ? undefined : brand.slug)
                      }
                      className={cn(
                        'w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors',
                        filters.brand === brand.slug
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'hover:bg-muted',
                      )}
                    >
                      {brand.name}
                    </button>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        )}

        <AccordionItem value="availability" className="border-b">
          <AccordionTrigger className="py-3 font-heading text-sm font-semibold">
            Availability
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pb-2">
              <div className="flex items-center justify-between px-2">
                <Label htmlFor="in-stock" className="text-sm font-normal cursor-pointer">
                  In stock only
                </Label>
                <Switch
                  id="in-stock"
                  checked={filters.in_stock === true}
                  onCheckedChange={(checked) =>
                    onChange('in_stock', checked ? 'true' : undefined)
                  }
                />
              </div>
              <div className="flex items-center justify-between px-2">
                <Label htmlFor="no-rx" className="text-sm font-normal cursor-pointer">
                  No prescription needed
                </Label>
                <Switch
                  id="no-rx"
                  checked={filters.requires_prescription === false}
                  onCheckedChange={(checked) =>
                    onChange('rx', checked ? 'false' : undefined)
                  }
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
