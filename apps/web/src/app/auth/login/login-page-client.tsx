'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@mcduffcare/ui/components/ui/button';
import { Input } from '@mcduffcare/ui/components/ui/input';
import { Label } from '@mcduffcare/ui/components/ui/label';
import { Checkbox } from '@mcduffcare/ui/components/ui/checkbox';
import { Separator } from '@mcduffcare/ui/components/ui/separator';
import { Alert, AlertDescription } from '@mcduffcare/ui/components/ui/alert';

import { useLogin } from '@mcduffcare/api-client/hooks/use-auth';
import { trackLogin } from '@/lib/analytics/gtag';

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional(),
});
type FormValues = z.infer<typeof schema>;

export function LoginPageClient(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') ?? '/account';
  const [showPw, setShowPw] = React.useState(false);
  const { mutate: login, isPending, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormValues) => {
    login(
      { email: data.email, password: data.password, remember: data.remember },
      {
        onSuccess: () => {
          trackLogin('email');
          router.push(redirect);
        },
      },
    );
  };

  return (
    <div className="flex min-h-screen">
      {/* ── Left panel – brand ─────────────────────────────────────────── */}
      <div className="hidden gradient-brand lg:flex lg:w-1/2 flex-col items-center justify-center p-12 text-white">
        <Link href="/" className="mb-10">
          <Image src="/logo-white.svg" alt="McDuffCare" width={180} height={45} />
        </Link>
        <h2 className="font-heading text-3xl font-bold text-center leading-tight">
          Your Health Partner in Kenya
        </h2>
        <p className="mt-4 text-white/80 text-center max-w-sm leading-relaxed">
          Access your prescriptions, track orders, and manage your health profile — all in one place.
        </p>
      </div>

      {/* ── Right panel – form ─────────────────────────────────────────── */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-sm space-y-6">
          {/* Mobile logo */}
          <Link href="/" className="flex justify-center lg:hidden">
            <Image src="/logo.svg" alt="McDuffCare" width={160} height={40} />
          </Link>

          <div className="text-center lg:text-left">
            <h1 className="font-heading text-2xl font-bold">Welcome back</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          {error !== null && (
            <Alert variant="destructive">
              <AlertDescription>
                {(error as { message?: string }).message ?? 'Invalid email or password.'}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                {...register('email')}
                error={!!errors.email}
                errorMessage={errors.email?.message}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type={showPw ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                {...register('password')}
                error={!!errors.password}
                errorMessage={errors.password?.message}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPw((p) => !p)}
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox id="remember" {...register('remember')} />
              <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                Remember me for 30 days
              </Label>
            </div>

            <Button type="submit" size="lg" className="w-full" loading={isPending}>
              Sign In
            </Button>
          </form>

          <Separator />

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="font-medium text-primary hover:underline">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
