'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Store, Truck, CreditCard, Bell, Shield } from 'lucide-react';

import { Button } from '@mcduffcare/ui/components/ui/button';
import { Input } from '@mcduffcare/ui/components/ui/input';
import { Label } from '@mcduffcare/ui/components/ui/label';
import { Textarea } from '@mcduffcare/ui/components/ui/textarea';
import { Switch } from '@mcduffcare/ui/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@mcduffcare/ui/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@mcduffcare/ui/components/ui/card';
import { Separator } from '@mcduffcare/ui/components/ui/separator';
import { toast } from 'sonner';

const storeSchema = z.object({
  store_name: z.string().min(1, 'Required'),
  store_email: z.string().email(),
  store_phone: z.string().min(10),
  store_address: z.string().min(5),
  ppb_license: z.string().min(1, 'Required'),
  free_shipping_threshold: z.coerce.number().nonnegative(),
  standard_shipping_fee: z.coerce.number().nonnegative(),
  same_day_shipping_fee: z.coerce.number().nonnegative(),
  mpesa_shortcode: z.string().min(1, 'Required'),
  mpesa_passkey: z.string().min(1, 'Required'),
  enable_cod: z.boolean(),
  enable_card: z.boolean(),
  low_stock_alerts: z.boolean(),
  order_notifications: z.boolean(),
  prescription_notifications: z.boolean(),
});
type StoreSettings = z.infer<typeof storeSchema>;

export default function AdminSettingsPage(): React.JSX.Element {
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<StoreSettings>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      store_name: 'McDuffCare Pharmacy',
      store_email: 'info@mcduffcare.co.ke',
      store_phone: '+254700000000',
      store_address: 'Nairobi, Kenya',
      ppb_license: 'PPB/PHARM/XXXXX',
      free_shipping_threshold: 2000,
      standard_shipping_fee: 250,
      same_day_shipping_fee: 500,
      mpesa_shortcode: '174379',
      mpesa_passkey: '',
      enable_cod: true,
      enable_card: true,
      low_stock_alerts: true,
      order_notifications: true,
      prescription_notifications: true,
    },
  });

  const onSubmit = async (_data: StoreSettings) => {
    await new Promise<void>((res) => setTimeout(res, 800));
    toast.success('Settings saved successfully.');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your pharmacy store configuration</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs defaultValue="store" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 h-auto gap-1">
            {[
              { value: 'store', label: 'Store', icon: Store },
              { value: 'shipping', label: 'Shipping', icon: Truck },
              { value: 'payments', label: 'Payments', icon: CreditCard },
              { value: 'notifications', label: 'Notifications', icon: Bell },
              { value: 'security', label: 'Security', icon: Shield },
            ].map(({ value, label, icon: Icon }) => (
              <TabsTrigger key={value} value={value} className="flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5" />{label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Store tab */}
          <TabsContent value="store">
            <Card>
              <CardHeader>
                <CardTitle>Store Information</CardTitle>
                <CardDescription>Basic details shown to customers and regulators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="store_name">Store Name</Label>
                    <Input id="store_name" {...register('store_name')} error={!!errors.store_name} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="ppb_license">PPB License Number</Label>
                    <Input id="ppb_license" {...register('ppb_license')} error={!!errors.ppb_license} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="store_email">Contact Email</Label>
                    <Input id="store_email" type="email" {...register('store_email')} error={!!errors.store_email} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="store_phone">Contact Phone</Label>
                    <Input id="store_phone" {...register('store_phone')} error={!!errors.store_phone} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="store_address">Physical Address</Label>
                  <Textarea id="store_address" {...register('store_address')} rows={2} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shipping tab */}
          <TabsContent value="shipping">
            <Card>
              <CardHeader>
                <CardTitle>Shipping & Delivery</CardTitle>
                <CardDescription>Configure delivery fees and thresholds</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="free_shipping_threshold">Free Shipping Above (KES)</Label>
                    <Input id="free_shipping_threshold" type="number" {...register('free_shipping_threshold')} />
                    <p className="text-xs text-muted-foreground">Set 0 to always charge shipping</p>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="standard_shipping_fee">Standard Delivery Fee (KES)</Label>
                    <Input id="standard_shipping_fee" type="number" {...register('standard_shipping_fee')} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="same_day_shipping_fee">Same-Day Delivery (KES)</Label>
                    <Input id="same_day_shipping_fee" type="number" {...register('same_day_shipping_fee')} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments tab */}
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Payment Configuration</CardTitle>
                <CardDescription>M-Pesa and card gateway settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-heading font-semibold text-sm">M-Pesa (Lipa na M-Pesa)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="mpesa_shortcode">Business Shortcode</Label>
                      <Input id="mpesa_shortcode" {...register('mpesa_shortcode')} error={!!errors.mpesa_shortcode} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="mpesa_passkey">Passkey</Label>
                      <Input id="mpesa_passkey" type="password" {...register('mpesa_passkey')} placeholder="••••••••••" />
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-3">
                  <h4 className="font-heading font-semibold text-sm">Payment Methods</h4>
                  {[
                    { id: 'enable_cod', label: 'Cash on Delivery', description: 'Allow customers to pay on delivery' },
                    { id: 'enable_card', label: 'Card Payments', description: 'Accept Visa and Mastercard' },
                  ].map(({ id, label, description }) => (
                    <div key={id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{label}</p>
                        <p className="text-xs text-muted-foreground">{description}</p>
                      </div>
                      <Switch
                        checked={watch(id as keyof StoreSettings) as boolean}
                        onCheckedChange={(v) => setValue(id as keyof StoreSettings, v)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose which alerts you receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { id: 'low_stock_alerts', label: 'Low Stock Alerts', description: 'Notify when product stock falls below threshold' },
                  { id: 'order_notifications', label: 'New Order Alerts', description: 'Email alert for every new order placed' },
                  { id: 'prescription_notifications', label: 'Prescription Uploads', description: 'Alert when a customer uploads a prescription' },
                ].map(({ id, label, description }) => (
                  <div key={id} className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="text-sm font-heading font-semibold">{label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                    </div>
                    <Switch
                      checked={watch(id as keyof StoreSettings) as boolean}
                      onCheckedChange={(v) => setValue(id as keyof StoreSettings, v)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Account and API security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-muted/40 p-4 text-sm text-muted-foreground">
                  API key management, 2FA, and session controls are handled via the Laravel backend admin panel.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button type="submit" loading={isSubmitting} size="lg">
            <Save className="h-4 w-4" />
            Save All Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
