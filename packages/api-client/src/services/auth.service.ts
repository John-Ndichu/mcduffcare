import type { ApiResponse, AuthResponse, User } from '@mcduffcare/ui/types';

import { httpClient, setTokens, clearTokens } from '../lib/http-client';

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  password: string;
  password_confirmation: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await httpClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    const authData = data.data;
    setTokens(authData.tokens.access_token, authData.tokens.refresh_token);
    return authData;
  },

  async register(payload: RegisterData): Promise<AuthResponse> {
    const { data } = await httpClient.post<ApiResponse<AuthResponse>>('/auth/register', payload);
    const authData = data.data;
    setTokens(authData.tokens.access_token, authData.tokens.refresh_token);
    return authData;
  },

  async logout(): Promise<void> {
    try {
      await httpClient.post('/auth/logout');
    } finally {
      clearTokens();
    }
  },

  async getMe(): Promise<User> {
    const { data } = await httpClient.get<ApiResponse<User>>('/auth/me');
    return data.data;
  },

  async updateProfile(payload: Partial<User>): Promise<User> {
    const { data } = await httpClient.put<ApiResponse<User>>('/auth/profile', payload);
    return data.data;
  },

  async forgotPassword(payload: ForgotPasswordData): Promise<{ message: string }> {
    const { data } = await httpClient.post<ApiResponse<{ message: string }>>(
      '/auth/forgot-password',
      payload,
    );
    return data.data;
  },

  async resetPassword(payload: ResetPasswordData): Promise<{ message: string }> {
    const { data } = await httpClient.post<ApiResponse<{ message: string }>>(
      '/auth/reset-password',
      payload,
    );
    return data.data;
  },

  async verifyEmail(token: string): Promise<{ message: string }> {
    const { data } = await httpClient.post<ApiResponse<{ message: string }>>(
      `/auth/verify-email/${token}`,
    );
    return data.data;
  },
} as const;
