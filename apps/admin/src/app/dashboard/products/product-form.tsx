'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, ImagePlus } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@mcduffcare/ui/components/ui/button';
import { Input } from '@mcduffcare/ui/components/ui/input';
import { Label } from '@mcduffcare/ui/components/ui/label';
import { Textarea } from '@mcduffcare/ui/components/ui/textarea';
import { Switch } from '@mcduffcare/ui/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@mcduffcare/ui/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@mcduffcare/ui/components/ui/card';
import { Alert, AlertDescription } from '@mcduffcare/ui/components/ui/alert';

import { useCreateProduct, useUpdateProduct, useAdminProduct } from '@mcduffcare/api-client/hooks/use-admin';
import { useCategories, useBrands } from '@mcduffcare/api-client/hooks/use-products';

const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  sku: z.string().min(1, 'SKU is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  short_description: z.string().optional(),
  price: z.coerce.number().positive('Price must be positive'),
  compare_price: z.coerce.number().nonnegative().optional(),
  cost_price: z.coerce.number().nonnegative().optional(),
  stock_quantity: z.coerce.number().int().nonnegative('Stock must be 0 or more'),
  low_stock_threshold: z.coerce.number().int().nonnegative().default(5),
  type: z.enum(['rx', 'otc', 'supplement', 'device', 'cosmetic']),
  status: z.enum(['active', 'inactive', 'out_of_stock', 'discontinued']),
  requires_prescription: z.boolean().default(false),
  is_featured: z.boolean().default(false),
  is_new: z.boolean().default(false),
  category_id: z.coerce.number().positive('Category is required'),
  brand_id: z.coerce.number().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  tags: z.string().optional(),
  weight: z.coerce.number().nonnegative().optional(),
});
type ProductForm = z.infer<typeof productSchema>;

interface ProductFormPageProps {
  readonly productId?: number;
}

export function ProductFormPage({ productId }: ProductFormPageProps): React.JSX.Element {
  const router = useRouter();
  const isEditing = productId !== undefined;

  const { data: existingProduct } = useAdminProduct(productId ?? 0);
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();
  const { mutate: createProduct, isPending: creating, error: createError } = useCreateProduct();
  const { mutate: updateProduct, isPending: updating, error: updateError } = useUpdateProduct();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      status: 'active',
      type: 'otc',
      requires_prescription: false,
      is_featured: false,
      is_new: false,
      low_stock_threshold: 5,
      stock_quantity: 0,
    },
  });

  // Populate form when editing
  React.useEffect(() => {
    if (existingProduct !== undefined) {
      reset({
        name: existingProduct.name,
        sku: existingProduct.sku,
        description: existingProduct.description,
        short_description: existingProduct.short_description ?? '',
        price: existingProduct.price,
        compare_price: existingProduct.compare_price ?? undefined,
        cost_price: existingProduct.cost_price ?? undefined,
        stock_quantity: existingProduct.stock_quantity,
        low_stock_threshold: existingProduct.low_stock_threshold,
        type: existingProduct.type,
        status: existingProduct.status,
        requires_prescription: existingProduct.requires_prescription,
        is_featured: existingProduct.is_featured,
        is_new: existingProduct.is_new,
        category_id: existingProduct.category.id,
        brand_id: existingProduct.brand?.id,
        meta_title: existingProduct.meta_title ?? '',
        meta_description: existingProduct.meta_description ?? '',
        tags: existingProduct.tags.join(', '),
        weight: existingProduct.weight ?? undefined,
      });
    }
  }, [existingProduct, reset]);

  const isSaving = creating || updating;
  const serverError = createError ?? updateError;

  const onSubmit = (data: ProductForm) => {
    const payload = {
      ...data,
      tags: data.tags !== undefined && data.tags !== ''
        ? data.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
    };

    if (isEditing && productId !== undefined) {
      updateProduct({ id: productId, ...payload }, {
        onSuccess: () => router.push('/dashboard/products'),
      });
    } else {
      createProduct(payload, {
        onSuccess: () => router.push('/dashboard/products'),
      });
    }
  };

  // const requiresRx = watch('requires_prescription');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/products" aria-label="Back to products">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="font-heading text-2xl font-bold">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isEditing ? `Editing: ${existingProduct?.name ?? '…'}` : 'Fill in the details below'}
          </p>
        </div>
        <Button
          type="submit"
          form="product-form"
          loading={isSaving}
          className="ml-auto"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Saving…' : 'Save Product'}
        </Button>
      </div>

      {serverError !== null && (
        <Alert variant="destructive">
          <AlertDescription>
            {(serverError as { message?: string }).message ?? 'An error occurred. Please try again.'}
          </AlertDescription>
        </Alert>
      )}

      <form id="product-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* ── Main column ──────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic info */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Product Name <span className="text-destructive">*</span></Label>
                  <Input id="name" {...register('name')} error={!!errors.name} errorMessage={errors.name?.message} placeholder="e.g. Panadol Extra 500mg" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="sku">SKU / Barcode <span className="text-destructive">*</span></Label>
                    <Input id="sku" {...register('sku')} error={!!errors.sku} errorMessage={errors.sku?.message} placeholder="e.g. PAN-500-24" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="weight">Weight (g)</Label>
                    <Input id="weight" type="number" step="0.1" {...register('weight')} placeholder="e.g. 150" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="short_description">Short Description</Label>
                  <Input id="short_description" {...register('short_description')} placeholder="Brief one-line summary" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="description">Full Description <span className="text-destructive">*</span></Label>
                  <Textarea
                    id="description"
                    {...register('description')}
                    error={!!errors.description}
                    rows={6}
                    placeholder="Detailed product description, ingredients, usage instructions…"
                  />
                  {errors.description !== undefined && (
                    <p className="text-xs text-destructive">{errors.description.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input id="tags" {...register('tags')} placeholder="e.g. analgesic, fever, headache" />
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
                <CardDescription>Set selling price and optional compare price for discounts</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label htmlFor="price">Selling Price (KES) <span className="text-destructive">*</span></Label>
                  <Input id="price" type="number" step="0.01" {...register('price')} error={!!errors.price} errorMessage={errors.price?.message} placeholder="0.00" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="compare_price">Compare Price (KES)</Label>
                  <Input id="compare_price" type="number" step="0.01" {...register('compare_price')} placeholder="0.00" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cost_price">Cost Price (KES)</Label>
                  <Input id="cost_price" type="number" step="0.01" {...register('cost_price')} placeholder="0.00" />
                </div>
              </CardContent>
            </Card>

            {/* Inventory */}
            <Card>
              <CardHeader>
                <CardTitle>Inventory</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="stock_quantity">Stock Quantity <span className="text-destructive">*</span></Label>
                  <Input id="stock_quantity" type="number" {...register('stock_quantity')} error={!!errors.stock_quantity} errorMessage={errors.stock_quantity?.message} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="low_stock_threshold">Low Stock Alert</Label>
                  <Input id="low_stock_threshold" type="number" {...register('low_stock_threshold')} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO</CardTitle>
                <CardDescription>Optional — override default meta tags</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input id="meta_title" {...register('meta_title')} placeholder="Leave blank to use product name" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea id="meta_description" {...register('meta_description')} rows={2} placeholder="Leave blank to auto-generate" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ── Sidebar column ───────────────────────────────────────────── */}
          <div className="space-y-6">
            {/* Status & type */}
            <Card>
              <CardHeader><CardTitle>Status & Type</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="status">Status <span className="text-destructive">*</span></Label>
                  <Select value={watch('status')} onValueChange={(v) => setValue('status', v as ProductForm['status'])}>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(['active', 'inactive', 'out_of_stock', 'discontinued'] as const).map((s) => (
                        <SelectItem key={s} value={s} className="capitalize">{s.replace('_', ' ')}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="type">Product Type <span className="text-destructive">*</span></Label>
                  <Select value={watch('type')} onValueChange={(v) => setValue('type', v as ProductForm['type'])}>
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(['rx', 'otc', 'supplement', 'device', 'cosmetic'] as const).map((t) => (
                        <SelectItem key={t} value={t} className="uppercase">{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Category & Brand */}
            <Card>
              <CardHeader><CardTitle>Organisation</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="category_id">Category <span className="text-destructive">*</span></Label>
                  <Select
                    value={watch('category_id')?.toString()}
                    onValueChange={(v) => setValue('category_id', Number(v))}
                  >
                    <SelectTrigger id="category_id" className={errors.category_id !== undefined ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select category…" />
                    </SelectTrigger>
                    <SelectContent>
                      {(categories ?? []).map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category_id !== undefined && (
                    <p className="text-xs text-destructive">{errors.category_id.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="brand_id">Brand</Label>
                  <Select
                    value={watch('brand_id')?.toString() ?? ''}
                    onValueChange={(v) => setValue('brand_id', v !== '' ? Number(v) : undefined)}
                  >
                    <SelectTrigger id="brand_id">
                      <SelectValue placeholder="Select brand…" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No Brand</SelectItem>
                      {(brands ?? []).map((b) => (
                        <SelectItem key={b.id} value={String(b.id)}>{b.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Flags */}
            <Card>
              <CardHeader><CardTitle>Flags</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {(
                  [
                    { id: 'requires_prescription', label: 'Requires Prescription', description: 'Customer must upload a valid Rx' },
                    { id: 'is_featured', label: 'Featured Product', description: 'Show on homepage featured section' },
                    { id: 'is_new', label: 'Mark as New', description: 'Display "New" badge' },
                  ] as const
                ).map(({ id, label, description }) => (
                  <div key={id} className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium font-heading">{label}</p>
                      <p className="text-xs text-muted-foreground">{description}</p>
                    </div>
                    <Switch
                      checked={watch(id)}
                      onCheckedChange={(v) => setValue(id, v)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Image upload placeholder */}
            <Card>
              <CardHeader><CardTitle>Images</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/30 p-8 text-center hover:border-primary/40 transition-colors cursor-pointer">
                  <ImagePlus className="h-8 w-8 text-muted-foreground/40" />
                  <p className="mt-2 text-sm font-medium text-muted-foreground">Upload images</p>
                  <p className="text-xs text-muted-foreground/60">PNG, JPG, WebP up to 5MB</p>
                  <Button type="button" variant="outline" size="sm" className="mt-3">
                    Browse Files
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
