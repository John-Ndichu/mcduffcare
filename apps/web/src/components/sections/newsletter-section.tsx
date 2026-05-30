'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@mcduffcare/ui/components/ui/button';
import { Input } from '@mcduffcare/ui/components/ui/input';

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
});
type FormValues = z.infer<typeof schema>;

export function NewsletterSection(): React.JSX.Element {
  const [submitted, setSubmitted] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    await new Promise<void>((resolve) => setTimeout(resolve, 800));
    setSubmitted(true);
    reset();
    toast.success(`Subscribed! Check ${data.email} for a confirmation.`);
  };

  return (
    <section className="gradient-brand py-14 text-white" aria-labelledby="newsletter-heading">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
            <Mail className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2
            id="newsletter-heading"
            className="font-heading text-2xl font-bold lg:text-3xl"
          >
            Stay Healthy, Stay Informed
          </h2>
          <p className="mt-3 text-white/80">
            Subscribe for health tips, exclusive deals, and new product alerts delivered straight
            to your inbox.
          </p>

          {submitted ? (
            <div className="mt-8 flex items-center justify-center gap-2 rounded-xl bg-white/10 p-4">
              <CheckCircle className="h-5 w-5 text-emerald-300" />
              <p className="font-medium">Thank you for subscribing!</p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
              noValidate
            >
              <div className="flex-1">
                <Input
                  {...register('email')}
                  type="email"
                  placeholder="Enter your email address"
                  autoComplete="email"
                  error={errors.email !== undefined}
                  errorMessage={errors.email?.message}
                  className="h-12 border-white/30 bg-white/10 text-white placeholder:text-white/60 focus-visible:border-white focus-visible:ring-white/30"
                  aria-describedby={errors.email !== undefined ? 'newsletter-email-error' : undefined}
                />
              </div>
              <Button
                type="submit"
                loading={isSubmitting}
                className="h-12 shrink-0 bg-white text-brand-royal hover:bg-white/90 shadow-none font-semibold px-8"
              >
                Subscribe
              </Button>
            </form>
          )}

          <p className="mt-4 text-xs text-white/60">
            No spam, ever. Unsubscribe at any time. Read our{' '}
            <a href="/privacy" className="underline hover:text-white">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
