'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@mcduffcare/ui/components/ui/button';
import { Input } from '@mcduffcare/ui/components/ui/input';
import { Label } from '@mcduffcare/ui/components/ui/label';
import { Alert, AlertDescription } from '@mcduffcare/ui/components/ui/alert';

import { useForgotPassword } from '@mcduffcare/api-client/hooks/use-auth';

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
});
type FormValues = z.infer<typeof schema>;

export function ForgotPasswordClient(): React.JSX.Element {
  const [submitted, setSubmitted] = React.useState(false);
  const [submittedEmail, setSubmittedEmail] = React.useState('');
  const { mutate: forgotPassword, isPending, error } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormValues) => {
    forgotPassword(
      { email: data.email },
      {
        onSuccess: () => {
          setSubmittedEmail(data.email);
          setSubmitted(true);
        },
      },
    );
  };

  return (
    <div className="bg-muted/20 flex min-h-screen items-center justify-center px-4 py-12">
      <div className="shadow-card w-full max-w-sm space-y-6 rounded-2xl bg-white p-8">
        <div className="text-center">
          <Link href="/" className="mb-4 inline-block">
            <Image src="/logo.png" alt="McDuffCare" width={150} height={38} />
          </Link>
        </div>

        {submitted ? (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <h1 className="font-heading text-xl font-bold">Check your email</h1>
            <p className="text-muted-foreground text-sm">
              We sent a password reset link to{' '}
              <strong className="text-foreground">{submittedEmail}</strong>.
              <br />
              It expires in 60 minutes.
            </p>
            <p className="text-muted-foreground text-xs">
              Didn&apos;t receive it? Check your spam folder or{' '}
              <button
                onClick={() => setSubmitted(false)}
                className="text-primary font-medium hover:underline"
              >
                try again
              </button>
              .
            </p>
            <Button asChild variant="outline" className="mt-4 w-full">
              <Link href="/auth/login">
                <ArrowLeft className="h-4 w-4" />
                Back to Sign In
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <div>
              <h1 className="font-heading text-2xl font-bold">Forgot your password?</h1>
              <p className="text-muted-foreground mt-1 text-sm">
                Enter your email and we&apos;ll send you a reset link.
              </p>
            </div>

            {error !== null && (
              <Alert variant="destructive">
                <AlertDescription>
                  {(error as { message?: string }).message ??
                    'Something went wrong. Please try again.'}
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
                  leftElement={<Mail className="h-4 w-4" />}
                  {...register('email')}
                  error={errors.email !== undefined}
                  errorMessage={errors.email?.message}
                />
              </div>

              <Button type="submit" size="lg" className="w-full" loading={isPending}>
                Send Reset Link
              </Button>
            </form>

            <Link
              href="/auth/login"
              className="text-muted-foreground hover:text-primary flex items-center justify-center gap-1 text-sm transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Sign In
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
