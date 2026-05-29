'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronRight,
  CreditCard,
  Smartphone,
  Package,
  CheckCircle,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@mcduffcare/ui/components/ui/button';
import { Input } from '@mcduffcare/ui/components/ui/input';
import { Label } from '@mcduffcare/ui/components/ui/label';
import {
  RadioGroup,
  RadioGroupItem,
} from '@mcduffcare/ui/components/ui/radio-group';
import { Separator } from '@mcduffcare/ui/components/ui/separator';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@mcduffcare/ui/components/ui/card';
import { Textarea } from '@mcduffcare/ui/components/ui/textarea';
import { Badge } from '@mcduffcare/ui/components/ui/badge';
import {
  Alert,
  AlertDescription,
} from '@mcduffcare/ui/components/ui/alert';
import { cn, formatPrice } from '@mcduffcare/ui/lib/utils';

import type { PaymentMethod } from '@mcduffcare/ui/types';

import { useCart } from '@mcduffcare/api-client/hooks/use-cart';
import { useCurrentUser } from '@mcduffcare/api-client/hooks/use-auth';
import {
  useCreateOrder,
  useInitiateMpesaPay,
} from '@mcduffcare/api-client/hooks/use-orders';

import {
  trackBeginCheckout,
  trackPurchase,
} from '@/lib/analytics/gtag';

const checkoutSchema = z.object({
  first_name: z.string().min(1, 'Required'),
  last_name: z.string().min(1, 'Required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone required'),
  address_line_1: z.string().min(5, 'Address required'),
  city: z.string().min(1, 'City required'),
  county: z.string().min(1, 'County required'),
  payment_method: z.enum([
    'mpesa',
    'card',
    'cash_on_delivery',
    'insurance'
  ]),
  mpesa_phone: z.string().optional(),
  notes: z.string().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

const PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    value: 'mpesa' as PaymentMethod,
    label: 'M-Pesa',
    description: 'Lipa na M-Pesa STK Push',
    icon: Smartphone,
    badge: 'Recommended',
  },
  {
    value: 'card' as PaymentMethod,
    label: 'Card',
    description: 'Visa or Mastercard',
    icon: CreditCard,
  },
  {
    value: 'cash_on_delivery' as PaymentMethod,
    label: 'Cash on Delivery',
    description: 'Pay when your order arrives',
    icon: Package,
  },
] as const;

type PaymentMethodOption = {
  value: PaymentMethod;
  label: string;
  description: string;
  icon: React.ElementType;
  badge?: string;
};

export function CheckoutPageClient(): React.JSX.Element {
  const { data: cart } = useCart();

  const { data: user } = useCurrentUser({
    retry: false,
  });

  const {
    mutate: createOrder,
    isPending: creatingOrder,
  } = useCreateOrder();

  const {
    mutate: initiateMpesa,
    isPending: initiatingMpesa,
  } = useInitiateMpesaPay();

  const [orderSuccess, setOrderSuccess] =
    React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      first_name: user?.first_name ?? '',
      last_name: user?.last_name ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      payment_method: 'mpesa',
    },
  });

  const paymentMethod = watch('payment_method');

  React.useEffect(() => {
    if (cart !== undefined) {
      trackBeginCheckout(cart.total);
    }
  }, [cart]);

  const onSubmit = (data: CheckoutForm) => {
    createOrder(
       {
    shipping_address_id: 1,
    payment_method: data.payment_method,
    ...(data.notes ? { notes: data.notes } : {}),
  },
      {
        onSuccess: (order) => {
          trackPurchase({
            order_number: order.order_number,
            total: order.total,
            shipping: order.shipping_cost,
            tax: order.tax,
          });

          if (
            data.payment_method === 'mpesa' &&
            data.mpesa_phone
          ) {
            initiateMpesa(
              {
                orderId: order.id,
                phone: data.mpesa_phone,
              },
              {
                onSuccess: () => {
                  setOrderSuccess(order.order_number);
                },
              },
            );
          } else {
            setOrderSuccess(order.order_number);
          }
        },
      },
    );
  };

  if (orderSuccess !== null) {
    return (
      <div className="container flex flex-col items-center justify-center py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle className="h-10 w-10 text-emerald-600" />
        </div>

        <h1 className="mt-6 font-heading text-2xl font-bold">
          Order Placed!
        </h1>

        <p className="mt-2 text-muted-foreground">
          Order <strong>#{orderSuccess}</strong> confirmed.
          You&apos;ll receive a confirmation SMS shortly.
        </p>

        <div className="mt-8 flex gap-3">
          <Button asChild variant="outline">
            <Link href="/account/orders">
              View Orders
            </Link>
          </Button>

          <Button asChild>
            <Link href="/shop/products">
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 lg:py-12">
      <nav
        aria-label="Breadcrumb"
        className="mb-6"
      >
        <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <li>
            <Link
              href="/"
              className="hover:text-primary"
            >
              Home
            </Link>
          </li>

          <li>
            <ChevronRight className="h-3.5 w-3.5" />
          </li>

          <li>
            <Link
              href="/shop/cart"
              className="hover:text-primary"
            >
              Cart
            </Link>
          </li>

          <li>
            <ChevronRight className="h-3.5 w-3.5" />
          </li>

          <li className="font-medium text-foreground">
            Checkout
          </li>
        </ol>
      </nav>

      <h1 className="mb-8 font-heading text-2xl font-bold">
        Checkout
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 xl:gap-10">
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  Contact Information
                </CardTitle>
              </CardHeader>

              <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="first_name">
                    First Name
                  </Label>

                  <Input
                    id="first_name"
                    {...register('first_name')}
                    error={!!errors.first_name}
                    {...(errors.first_name?.message && {
                      errorMessage:
                        errors.first_name.message,
                    })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="last_name">
                    Last Name
                  </Label>

                  <Input
                    id="last_name"
                    {...register('last_name')}
                    error={!!errors.last_name}
                    {...(errors.last_name?.message && {
                      errorMessage:
                        errors.last_name.message,
                    })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email">
                    Email
                  </Label>

                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    error={!!errors.email}
                    {...(errors.email?.message && {
                      errorMessage:
                        errors.email.message,
                    })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone">
                    Phone (M-Pesa)
                  </Label>

                  <Input
                    id="phone"
                    type="tel"
                    placeholder="0712345678"
                    {...register('phone')}
                    error={!!errors.phone}
                    {...(errors.phone?.message && {
                      errorMessage:
                        errors.phone.message,
                    })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  Delivery Address
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="address_line_1">
                    Street Address
                  </Label>

                  <Input
                    id="address_line_1"
                    placeholder="e.g. 123 Kimathi Street, Apt 4"
                    {...register('address_line_1')}
                    error={!!errors.address_line_1}
                    {...(errors.address_line_1
                      ?.message && {
                      errorMessage:
                        errors.address_line_1.message,
                    })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="city">
                      City
                    </Label>

                    <Input
                      id="city"
                      placeholder="Nairobi"
                      {...register('city')}
                      error={!!errors.city}
                      {...(errors.city?.message && {
                        errorMessage:
                          errors.city.message,
                      })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="county">
                      County
                    </Label>

                    <Input
                      id="county"
                      placeholder="Nairobi"
                      {...register('county')}
                      error={!!errors.county}
                      {...(errors.county?.message && {
                        errorMessage:
                          errors.county.message,
                      })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="notes">
                    Order Notes (optional)
                  </Label>

                  <Textarea
                    id="notes"
                    placeholder="Delivery instructions, gate code, etc."
                    {...register('notes')}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  Payment Method
                </CardTitle>
              </CardHeader>

              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value) => {
                    setValue(
                      'payment_method',
                      value as PaymentMethod,
                    );
                  }}
                  className="space-y-3"
                >
                  {PAYMENT_METHODS.map(
                    ({
                      value,
                      label,
                      description,
                      icon: Icon,
                      badge,
                    }) => (
                      <div key={value}>
                        <label
                          htmlFor={`pay-${value}`}
                          className={cn(
                            'flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors',
                            paymentMethod === value
                              ? 'border-primary bg-primary/5'
                              : 'border-input hover:border-primary/40',
                          )}
                        >
                          <RadioGroupItem
                            value={value}
                            id={`pay-${value}`}
                          />

                          <div
                            className={cn(
                              'flex h-10 w-10 items-center justify-center rounded-lg',
                              paymentMethod === value
                                ? 'bg-primary text-white'
                                : 'bg-muted',
                            )}
                          >
                            <Icon className="h-5 w-5" />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-heading text-sm font-semibold">
                                {label}
                              </p>

                              {badge !== undefined && (
                                <Badge
                                  variant="new"
                                  className="px-1.5 py-0 text-2xs"
                                >
                                  {badge}
                                </Badge>
                              )}
                            </div>

                            <p className="text-xs text-muted-foreground">
                              {description}
                            </p>
                          </div>
                        </label>

                        {value === 'mpesa' &&
                          paymentMethod ===
                            'mpesa' && (
                            <div className="mt-2 pl-[3.75rem]">
                              <Input
                                placeholder="M-Pesa number (e.g. 0712345678)"
                                type="tel"
                                {...register(
                                  'mpesa_phone',
                                )}
                                className="h-9 text-sm"
                              />
                            </div>
                          )}
                      </div>
                    ),
                  )}
                </RadioGroup>

                {paymentMethod === 'mpesa' && (
                  <Alert
                    variant="info"
                    className="mt-4"
                  >
                    <Smartphone className="h-4 w-4" />

                    <AlertDescription className="text-xs">
                      You&apos;ll receive an STK Push
                      prompt on your phone. Enter
                      your M-Pesa PIN to complete
                      payment.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>
                  Order Summary
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                {cart?.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 text-sm"
                  >
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border bg-muted">
                      {item.product.primary_image !==
                        null && (
                        <Image
                          src={
                            item.product
                              .primary_image.url
                          }
                          alt={
                            item.product
                              .primary_image.alt
                          }
                          fill
                          className="object-contain p-1"
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium leading-tight">
                        {item.product.name}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <p className="shrink-0 font-heading font-semibold">
                      {formatPrice(item.subtotal)}
                    </p>
                  </div>
                ))}

                <Separator />

                {cart !== undefined && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Subtotal
                      </span>

                      <span>
                        {formatPrice(cart.subtotal)}
                      </span>
                    </div>

                    {cart.discount > 0 && (
                      <div className="flex justify-between text-sm text-emerald-600">
                        <span>Discount</span>

                        <span>
                          -
                          {formatPrice(
                            cart.discount,
                          )}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Shipping
                      </span>

                      <span
                        className={
                          cart.shipping === 0
                            ? 'font-medium text-emerald-600'
                            : ''
                        }
                      >
                        {cart.shipping === 0
                          ? 'FREE'
                          : formatPrice(
                              cart.shipping,
                            )}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Tax (VAT)
                      </span>

                      <span>
                        {formatPrice(cart.tax)}
                      </span>
                    </div>

                    <Separator />

                    <div className="flex justify-between font-heading font-bold">
                      <span>Total</span>

                      <span className="text-lg text-primary">
                        {formatPrice(cart.total)}
                      </span>
                    </div>
                  </>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  loading={
                    creatingOrder ||
                    initiatingMpesa
                  }
                >
                  Place Order
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  By placing your order you agree
                  to our{' '}
                  <Link
                    href="/terms"
                    className="underline hover:text-primary"
                  >
                    Terms
                  </Link>{' '}
                  and{' '}
                  <Link
                    href="/privacy"
                    className="underline hover:text-primary"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}