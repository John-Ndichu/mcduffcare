import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query';

import type { User } from '@mcduffcare/ui/types';

import { queryKeys } from '../lib/query-keys';
import { authService, type LoginCredentials, type RegisterData } from '../services/auth.service';

// ─── Current user ──────────────────────────────────────────────────────────────
export function useCurrentUser(
  options?: Omit<UseQueryOptions<User>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: authService.getMe,
    staleTime: 1000 * 60 * 5,
    retry: false,
    ...options,
  });
}

// ─── Login mutation ────────────────────────────────────────────────────────────
export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      qc.setQueryData(queryKeys.auth.me(), data.user);
    },
  });
}

// ─── Register mutation ─────────────────────────────────────────────────────────
export function useRegister() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: RegisterData) => authService.register(payload),
    onSuccess: (data) => {
      qc.setQueryData(queryKeys.auth.me(), data.user);
    },
  });
}

// ─── Logout mutation ───────────────────────────────────────────────────────────
export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      qc.clear(); // wipe all cached queries on logout
    },
  });
}

// ─── Update profile mutation ───────────────────────────────────────────────────
export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<User>) => authService.updateProfile(payload),
    onSuccess: (user) => {
      qc.setQueryData(queryKeys.auth.me(), user);
    },
  });
}

// ─── Forgot password mutation ──────────────────────────────────────────────────
export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: { email: string }) => authService.forgotPassword(payload),
  });
}

// ─── Reset password mutation ───────────────────────────────────────────────────
export function useResetPassword() {
  return useMutation({
    mutationFn: (payload: { token: string; email: string; password: string; password_confirmation: string }) =>
      authService.resetPassword(payload),
  });
}
