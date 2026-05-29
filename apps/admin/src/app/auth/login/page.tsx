'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@mcduffcare/ui/components/ui/button';
import { Input } from '@mcduffcare/ui/components/ui/input';
import { Label } from '@mcduffcare/ui/components/ui/label';
import { Alert, AlertDescription } from '@mcduffcare/ui/components/ui/alert';

import { useLogin } from '@mcduffcare/api-client/hooks/use-auth';

const schema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(1, 'Password required'),
});
type FormValues = z.infer<typeof schema>;

export default function AdminLoginPage(): React.JSX.Element {
  const router = useRouter();
  const [showPw, setShowPw] = React.useState(false);
  const { mutate: login, isPending, error } = useLogin();

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormValues) => {
    login({ email: data.email, password: data.password }, {
      onSuccess: (res) => {
        if (res.user.role === 'customer') {
          // Kick non-admins out
          router.push('/auth/login');
          return;
        }
        router.push('/dashboard');
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-navy px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-white">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-royal shadow-brand-lg">
            <Shield className="h-7 w-7" />
          </div>
          <h1 className="font-heading text-2xl font-bold">McDuffCare Admin</h1>
          <p className="mt-1 text-sm text-white/60">Authorised personnel only</p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-2xl space-y-5">
          {error !== null && (
            <Alert variant="destructive">
              <AlertDescription>
                {(error as { message?: string }).message ?? 'Invalid credentials.'}
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
  placeholder="admin@mcduffcare.co.ke"
  {...register('email')}
  error={!!errors.email}
  {...(errors.email?.message && {
    errorMessage: errors.email.message,
  })}
/>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
          <Input
  id="password"
  type={showPw ? 'text' : 'password'}
  autoComplete="current-password"
  placeholder="••••••••"
  {...register('password')}
  error={!!errors.password}
  {...(errors.password?.message && {
    errorMessage: errors.password.message,
  })}
  rightElement={
    <button
      type="button"
      onClick={() => setShowPw((p) => !p)}
      aria-label="Toggle password"
      className="text-muted-foreground hover:text-foreground"
    >
      {showPw ? (
        <EyeOff className="h-4 w-4" />
      ) : (
        <Eye className="h-4 w-4" />
      )}
    </button>
  }
/>
            </div>
            <Button type="submit" size="lg" className="w-full" loading={isPending}>
              Sign In to Admin
            </Button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-white/40">
          McDuffCare Pharmacy &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
