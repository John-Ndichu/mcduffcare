'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Save } from 'lucide-react';

import { Button } from '@mcduffcare/ui/components/ui/button';
import { Input } from '@mcduffcare/ui/components/ui/input';
import { Label } from '@mcduffcare/ui/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@mcduffcare/ui/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@mcduffcare/ui/components/ui/card';
import { Separator } from '@mcduffcare/ui/components/ui/separator';
import { Alert, AlertDescription } from '@mcduffcare/ui/components/ui/alert';
import { Skeleton } from '@mcduffcare/ui/components/ui/skeleton';
import { getInitials } from '@mcduffcare/ui/lib/utils';

import { useCurrentUser, useUpdateProfile } from '@mcduffcare/api-client/hooks/use-auth';

const profileSchema = z.object({
  first_name: z.string().min(1, 'First name required'),
  last_name: z.string().min(1, 'Last name required'),
  phone: z.string().optional(),
  date_of_birth: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
});

const passwordSchema = z
  .object({
    current_password: z.string().min(1, 'Current password required'),
    password: z.string().min(8, 'At least 8 characters'),
    password_confirmation: z.string().min(1, 'Confirm your password'),
  })
  .refine((d) => d.password === d.password_confirmation, {
    message: 'Passwords do not match',
    path: ['password_confirmation'],
  });

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export function ProfilePageClient(): React.JSX.Element {
  const { data: user, isLoading } = useCurrentUser();
  const { mutate: updateProfile, isPending, error } = useUpdateProfile();

  const {
    register: regProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileForm>({ resolver: zodResolver(profileSchema) });

  const {
    register: regPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: pwErrors },
  } = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) });

  React.useEffect(() => {
    if (user !== undefined) {
      resetProfile({
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone ?? '',
        date_of_birth: user.date_of_birth ?? '',
        gender: user.gender ?? undefined,
      });
    }
  }, [user, resetProfile]);

  const onProfileSubmit = (data: ProfileForm) => {
    updateProfile(data);
  };

  const onPasswordSubmit = (_data: PasswordForm) => {
    // TODO: wire to change-password endpoint
    resetPassword();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Profile Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your personal information</p>
      </div>

      {/* Avatar section */}
      <Card>
        <CardContent className="flex items-center gap-5 p-6">
          <Avatar className="h-20 w-20 border-2 border-primary/20">
            <AvatarImage src={user?.avatar_url ?? undefined} alt={user?.full_name ?? ''} />
            <AvatarFallback className="bg-primary/10 text-primary font-heading text-xl font-bold">
              {user !== undefined ? getInitials(user.full_name) : <User />}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-heading font-semibold">{user?.full_name}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <Button variant="outline" size="sm" className="mt-2">
              Change Photo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Personal info form */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your name, phone and date of birth</CardDescription>
        </CardHeader>
        <CardContent>
          {error !== null && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                {(error as { message?: string }).message ?? 'Update failed. Please try again.'}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleProfileSubmit(onProfileSubmit)} noValidate className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  {...regProfile('first_name')}
                  error={profileErrors.first_name !== undefined}
                  errorMessage={profileErrors.first_name?.message}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  {...regProfile('last_name')}
                  error={profileErrors.last_name !== undefined}
                  errorMessage={profileErrors.last_name?.message}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                value={user?.email ?? ''}
                disabled
                className="bg-muted/40"
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed. Contact support if needed.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="0712345678"
                  {...regProfile('phone')}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  {...regProfile('date_of_birth')}
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" loading={isPending}>
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Change password */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Use a strong password with at least 8 characters</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} noValidate className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="current_password">Current Password</Label>
              <Input
                id="current_password"
                type="password"
                autoComplete="current-password"
                {...regPassword('current_password')}
                error={pwErrors.current_password !== undefined}
                errorMessage={pwErrors.current_password?.message}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="new_password">New Password</Label>
                <Input
                  id="new_password"
                  type="password"
                  autoComplete="new-password"
                  {...regPassword('password')}
                  error={pwErrors.password !== undefined}
                  errorMessage={pwErrors.password?.message}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password_confirmation">Confirm New Password</Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  autoComplete="new-password"
                  {...regPassword('password_confirmation')}
                  error={pwErrors.password_confirmation !== undefined}
                  errorMessage={pwErrors.password_confirmation?.message}
                />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button type="submit" variant="outline">
                Update Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Separator />

      {/* Danger zone */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-destructive text-base">Danger Zone</CardTitle>
          <CardDescription>Permanent actions that cannot be undone</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
            onClick={() => {
              if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
                alert('Contact support at support@mcduffcare.co.ke to delete your account.');
              }
            }}
          >
            Delete My Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
