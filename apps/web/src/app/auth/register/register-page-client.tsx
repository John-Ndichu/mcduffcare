'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@mcduffcare/ui/components/ui/button';
import { Input } from '@mcduffcare/ui/components/ui/input';
import { Label } from '@mcduffcare/ui/components/ui/label';
import { Checkbox } from '@mcduffcare/ui/components/ui/checkbox';
import { Alert, AlertDescription } from '@mcduffcare/ui/components/ui/alert';
import { Separator } from '@mcduffcare/ui/components/ui/separator';

import { useRegister } from '@mcduffcare/api-client/hooks/use-auth';
import { trackSignUp } from '@/lib/analytics/gtag';

const schema = z
  .object({
    first_name: z.string().min(1, 'First name required'),
    last_name: z.string().min(1, 'Last name required'),
    email: z.string().email('Valid email required'),
    phone: z.string().min(10, 'Valid phone required').optional(),
    password: z.string().min(8, 'At least 8 characters'),
    password_confirmation: z.string().min(1, 'Please confirm your password'),
    terms: z.boolean().refine((v) => v === true, 'You must accept the terms'),
  })
  .refine((d) => d.password === d.password_confirmation, {
    message: 'Passwords do not match',
    path: ['password_confirmation'],
  });
type FormValues = z.infer<typeof schema>;

export function RegisterPageClient(): React.JSX.Element {
  const router = useRouter();
  const [showPw, setShowPw] = React.useState(false);
  const { mutate: register_, isPending, error } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormValues) => {
    register_(
      {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        password_confirmation: data.password_confirmation,
      },
      {
        onSuccess: () => {
          trackSignUp('email');
          router.push('/account');
        },
      },
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20 px-4 py-12">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-card">
        <div className="text-center">
          <Link href="/" className="inline-block mb-4">
            <Image src="/logo.svg" alt="McDuffCare" width={150} height={38} />
          </Link>
          <h1 className="font-heading text-2xl font-bold">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Join thousands of Kenyans shopping for health online
          </p>
        </div>

        {error !== null && (
          <Alert variant="destructive">
            <AlertDescription>
              {(error as { message?: string }).message ?? 'Registration failed. Please try again.'}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="first_name">First Name</Label>
              <Input id="first_name" autoComplete="given-name" {...register('first_name')} error={!!errors.first_name} errorMessage={errors.first_name?.message} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="last_name">Last Name</Label>
              <Input id="last_name" autoComplete="family-name" {...register('last_name')} error={!!errors.last_name} errorMessage={errors.last_name?.message} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" {...register('email')} error={!!errors.email} errorMessage={errors.email?.message} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone Number (optional)</Label>
            <Input id="phone" type="tel" placeholder="0712345678" {...register('phone')} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type={showPw ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Min 8 characters"
              {...register('password')}
              error={!!errors.password}
              errorMessage={errors.password?.message}
              rightElement={
                <button type="button" onClick={() => setShowPw((p) => !p)} aria-label="Toggle password">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password_confirmation">Confirm Password</Label>
            <Input id="password_confirmation" type={showPw ? 'text' : 'password'} autoComplete="new-password" placeholder="Repeat your password" {...register('password_confirmation')} error={!!errors.password_confirmation} errorMessage={errors.password_confirmation?.message} />
          </div>

          <div className="flex items-start gap-2">
            <Checkbox id="terms" {...register('terms')} className="mt-0.5" />
            <Label htmlFor="terms" className="text-sm font-normal cursor-pointer leading-relaxed">
              I agree to the{' '}
              <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
            </Label>
          </div>
          {errors.terms !== undefined && <p className="text-xs text-destructive">{errors.terms.message}</p>}

          <Button type="submit" size="lg" className="w-full" loading={isPending}>
            Create Account
          </Button>
        </form>

        <Separator />
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-medium text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
