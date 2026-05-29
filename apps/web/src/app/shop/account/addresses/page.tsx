'use client';

import * as React from 'react';
import { Plus, Pencil, Trash2, MapPin, Star } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@mcduffcare/ui/components/ui/button';
import { Input } from '@mcduffcare/ui/components/ui/input';
import { Label } from '@mcduffcare/ui/components/ui/label';
import { Card, CardContent } from '@mcduffcare/ui/components/ui/card';
import { Badge } from '@mcduffcare/ui/components/ui/badge';
import { Skeleton } from '@mcduffcare/ui/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@mcduffcare/ui/components/ui/dialog';
import type { Address } from '@mcduffcare/ui/types';

import { useCurrentUser } from '@mcduffcare/api-client/hooks/use-auth';

const addressSchema = z.object({
  label: z.string().min(1, 'Label required (e.g. Home, Work)'),
  first_name: z.string().min(1, 'Required'),
  last_name: z.string().min(1, 'Required'),
  phone: z.string().min(10, 'Valid phone required'),
  address_line_1: z.string().min(5, 'Address required'),
  address_line_2: z.string().optional(),
  city: z.string().min(1, 'Required'),
  county: z.string().min(1, 'Required'),
  postal_code: z.string().optional(),
});
type AddressForm = z.infer<typeof addressSchema>;

export default function AddressesPage() {
  const { data: user, isLoading } = useCurrentUser();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Address | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddressForm>({ resolver: zodResolver(addressSchema) });

  const openCreate = () => {
    setEditing(null);
    reset({ label: '', first_name: '', last_name: '', phone: '', address_line_1: '', city: '', county: '' });
    setDialogOpen(true);
  };

  const openEdit = (addr: Address) => {
    setEditing(addr);
    reset({
      label: addr.label,
      first_name: addr.first_name,
      last_name: addr.last_name,
      phone: addr.phone,
      address_line_1: addr.address_line_1,
      address_line_2: addr.address_line_2 ?? '',
      city: addr.city,
      county: addr.county,
      postal_code: addr.postal_code ?? '',
    });
    setDialogOpen(true);
  };

  const onSubmit = async (_data: AddressForm) => {
    // TODO: wire to API – POST /addresses or PUT /addresses/:id
    await new Promise<void>((r) => setTimeout(r, 600));
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">My Addresses</h1>
        <Button onClick={openCreate} size="sm">
          <Plus className="h-4 w-4" />
          Add Address
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      ) : !user || user.addresses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground/20" />
            <p className="mt-3 font-heading font-semibold">No addresses saved</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add a delivery address to speed up checkout.
            </p>
            <Button className="mt-4" onClick={openCreate}>
              <Plus className="h-4 w-4" />
              Add Address
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {user.addresses.map((addr) => (
            <Card key={addr.id} className={addr.is_default ? 'border-primary ring-1 ring-primary' : ''}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                    <span className="font-heading font-semibold text-sm">{addr.label}</span>
                    {addr.is_default && (
                      <Badge variant="default" className="text-xs">
                        <Star className="h-3 w-3 mr-0.5" />
                        Default
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon-sm" onClick={() => openEdit(addr)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="mt-3 space-y-0.5 text-sm text-muted-foreground">
                  <p>{addr.first_name} {addr.last_name}</p>
                  <p>{addr.phone}</p>
                  <p>{addr.address_line_1}</p>
                  {addr.address_line_2 && <p>{addr.address_line_2}</p>}
                  <p>{addr.city}, {addr.county}</p>
                  {addr.postal_code && <p>{addr.postal_code}</p>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Address' : 'Add New Address'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="label">Label (e.g. Home, Work, Office)</Label>
              <Input id="label" placeholder="Home" {...register('label')} error={!!errors.label} errorMessage={errors.label?.message} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="first_name">First Name</Label>
                <Input id="first_name" {...register('first_name')} error={!!errors.first_name} errorMessage={errors.first_name?.message} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="last_name">Last Name</Label>
                <Input id="last_name" {...register('last_name')} error={!!errors.last_name} errorMessage={errors.last_name?.message} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" placeholder="0712345678" {...register('phone')} error={!!errors.phone} errorMessage={errors.phone?.message} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="address_line_1">Street Address</Label>
              <Input id="address_line_1" placeholder="123 Kimathi Street" {...register('address_line_1')} error={!!errors.address_line_1} errorMessage={errors.address_line_1?.message} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="address_line_2">Apartment / Suite (optional)</Label>
              <Input id="address_line_2" placeholder="Apt 4B" {...register('address_line_2')} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="Nairobi" {...register('city')} error={!!errors.city} errorMessage={errors.city?.message} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="county">County</Label>
                <Input id="county" placeholder="Nairobi" {...register('county')} error={!!errors.county} errorMessage={errors.county?.message} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="postal_code">Postal Code (optional)</Label>
              <Input id="postal_code" placeholder="00100" {...register('postal_code')} />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" loading={isSubmitting}>
                {editing ? 'Save Changes' : 'Add Address'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
