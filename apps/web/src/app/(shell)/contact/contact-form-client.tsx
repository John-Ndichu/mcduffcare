'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';

import { Button } from '@mcduffcare/ui/components/ui/button';
import { Input } from '@mcduffcare/ui/components/ui/input';
import { Label } from '@mcduffcare/ui/components/ui/label';
import { Textarea } from '@mcduffcare/ui/components/ui/textarea';
import { Card, CardContent } from '@mcduffcare/ui/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@mcduffcare/ui/components/ui/select';
import { toast } from 'sonner';

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Please select a subject'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});
type FormValues = z.infer<typeof schema>;

const SUBJECTS = [
  'Order Inquiry',
  'Prescription Upload',
  'Product Availability',
  'Delivery Issue',
  'Pharmacist Consultation',
  'Returns & Refunds',
  'Partnership / B2B',
  'Other',
];

const CONTACT_INFO = [
  { Icon: Phone, label: 'Phone', value: '+254 700 000 000', href: 'tel:+254700000000' },
  { Icon: Mail, label: 'Email', value: 'info@mcduffcare.co.ke', href: 'mailto:info@mcduffcare.co.ke' },
  { Icon: MapPin, label: 'Location', value: 'Nairobi, Kenya', href: null },
  { Icon: Clock, label: 'Hours', value: 'Mon–Sat: 8am – 8pm', href: null },
];

export function ContactFormClient() {
  const [sent, setSent] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (_data: FormValues) => {
    await new Promise<void>((r) => setTimeout(r, 1000));
    setSent(true);
    reset();
    toast.success("Message sent! We'll respond within 2 business hours.");
  };

  return (
    <div className="py-12 lg:py-20">
      <div className="container">
        <div className="mb-12 text-center">
          <h1 className="font-heading text-3xl font-bold lg:text-4xl">Contact Us</h1>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Got a question, need a consultation, or have a concern? Our team is ready to help.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="space-y-4">
            {CONTACT_INFO.map(({ Icon, label, value, href }) => (
              <Card key={label}>
                <CardContent className="flex items-start gap-4 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
                    {href !== null ? (
                      <a href={href} className="font-heading font-semibold hover:text-primary transition-colors">
                        {value}
                      </a>
                    ) : (
                      <p className="font-heading font-semibold">{value}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6 sm:p-8">
                {sent ? (
                  <div className="flex flex-col items-center py-12 text-center">
                    <CheckCircle className="h-14 w-14 text-emerald-500" />
                    <h3 className="mt-4 font-heading text-xl font-bold">Message Sent!</h3>
                    <p className="mt-2 text-muted-foreground">
                      We&apos;ll get back to you within 2 business hours.
                    </p>
                    <Button variant="outline" className="mt-6" onClick={() => setSent(false)}>
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
                      <Input
  id="name"
  placeholder="Jane Doe"
  {...register('name')}
  error={!!errors.name}
  {...(errors.name?.message
    ? { errorMessage: errors.name.message }
    : {})}
/>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
                      <Input
  id="email"
  type="email"
  placeholder="jane@example.com"
  {...register('email')}
  error={!!errors.email}
  {...(errors.email?.message
    ? { errorMessage: errors.email.message }
    : {})}
/>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="phone">Phone (optional)</Label>
                        <Input id="phone" type="tel" placeholder="0712345678" {...register('phone')} />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="subject">Subject <span className="text-destructive">*</span></Label>
                        <Select value={watch('subject')} onValueChange={(v) => setValue('subject', v)}>
                          <SelectTrigger id="subject" className={errors.subject ? 'border-destructive' : ''}>
                            <SelectValue placeholder="Select subject…" />
                          </SelectTrigger>
                          <SelectContent>
                            {SUBJECTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        {errors.subject && <p className="text-xs text-destructive">{errors.subject.message}</p>}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="message">Message <span className="text-destructive">*</span></Label>
                      <Textarea id="message" placeholder="How can we help you?" rows={5} {...register('message')} error={!!errors.message} />
                      {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
                    </div>
                    <Button type="submit" size="lg" className="w-full sm:w-auto" loading={isSubmitting}>
                      <Send className="h-4 w-4" />
                      Send Message
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
