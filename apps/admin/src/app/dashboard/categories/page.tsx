'use client';

import * as React from 'react';
import { Plus, Pencil, Trash2, Folder } from 'lucide-react';

import { Button } from '@mcduffcare/ui/components/ui/button';
import { Badge } from '@mcduffcare/ui/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@mcduffcare/ui/components/ui/card';
import { Skeleton } from '@mcduffcare/ui/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@mcduffcare/ui/components/ui/dialog';
import { Input } from '@mcduffcare/ui/components/ui/input';
import { Label } from '@mcduffcare/ui/components/ui/label';
import { Textarea } from '@mcduffcare/ui/components/ui/textarea';
import type { ProductCategory } from '@mcduffcare/ui/types';

import { useCategories } from '@mcduffcare/api-client/hooks/use-products';
import Image from 'next/image';

export default function AdminCategoriesPage(): React.JSX.Element {
  const { data: categories, isLoading } = useCategories();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ProductCategory | null>(null);
  const [form, setForm] = React.useState({ name: '', description: '' });

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', description: '' });
    setDialogOpen(true);
  };

  const openEdit = (cat: ProductCategory) => {
    setEditing(cat);
    setForm({ name: cat.name, description: cat.description ?? '' });
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Categories</h1>
          <p className="text-sm text-muted-foreground">Manage product categories and hierarchy</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            All Categories
            {categories !== undefined && (
              <Badge variant="secondary">{categories.length}</Badge>
            )}
          </CardTitle>
          <CardDescription>
            Categories help customers find products faster
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="divide-y">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-4">
                  <Skeleton className="h-9 w-9 rounded-lg" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="h-6 w-12" />
                  <Skeleton className="h-8 w-16" />
                </div>
              ))}
            </div>
          ) : categories === undefined || categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Folder className="h-12 w-12 text-muted-foreground/30" />
              <p className="mt-3 font-heading font-semibold">No categories yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Create your first category to organise products.
              </p>
              <Button className="mt-4" onClick={openCreate}>
                <Plus className="h-4 w-4" />
                Add Category
              </Button>
            </div>
          ) : (
            <ul className="divide-y" role="list">
              {categories.map((cat) => (
                <li
                  key={cat.id}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-muted/30 transition-colors"
                >
                  {/* Icon */}
                  {cat.image_url !== null ? (
                    <Image
                      src={cat.image_url}
                      alt={cat.name}
                      className="h-9 w-9 rounded-lg object-cover border"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Folder className="h-5 w-5" />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-heading font-semibold text-sm">{cat.name}</p>
                      {cat.parent_id !== null && (
                        <Badge variant="outline" className="text-xs">Sub-category</Badge>
                      )}
                    </div>
                    {cat.description !== null && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {cat.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">
                      /{cat.slug}
                    </p>
                  </div>

                  {/* Product count */}
                  {cat.products_count !== undefined && (
                    <Badge variant="secondary" className="shrink-0">
                      {cat.products_count} products
                    </Badge>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => openEdit(cat)}
                      aria-label={`Edit ${cat.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      aria-label={`Delete ${cat.name}`}
                      onClick={() => {
                        if (confirm(`Delete "${cat.name}"? Products in this category will be uncategorised.`)) {
                          // TODO: wire to API
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Create / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing !== null ? 'Edit Category' : 'Add Category'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="cat-name">Name <span className="text-destructive">*</span></Label>
              <Input
                id="cat-name"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Vitamins & Supplements"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cat-desc">Description</Label>
              <Textarea
                id="cat-desc"
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Brief description shown to customers"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={() => {
                // TODO: wire create/update to API
                setDialogOpen(false);
              }}
            >
              {editing !== null ? 'Save Changes' : 'Create Category'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
