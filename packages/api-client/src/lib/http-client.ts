import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

import type { ApiError } from '@mcduffcare/ui/types';

// ─── Constants ─────────────────────────────────────────────────────────────────
const API_BASE_URL = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:8000/api/v1';
const TIMEOUT_MS = 30_000;

// ─── Token helpers (browser-safe) ──────────────────────────────────────────────
function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('mcduff_access_token');
}

function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('mcduff_refresh_token');
}

function setTokens(access: string, refresh: string): void {
  localStorage.setItem('mcduff_access_token', access);
  localStorage.setItem('mcduff_refresh_token', refresh);
}

function clearTokens(): void {
  localStorage.removeItem('mcduff_access_token');
  localStorage.removeItem('mcduff_refresh_token');
}

// ─── Axios instance ────────────────────────────────────────────────────────────
const httpClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
});

// ─── Request interceptor – attach bearer token ─────────────────────────────────
httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token !== null && token !== '') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => Promise.reject(error),
);

// ─── Response interceptor – handle 401 / token refresh ────────────────────────
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null): void {
  failedQueue.forEach((prom) => {
    if (error !== null) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

httpClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) return Promise.reject(error);

    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && originalRequest._retry !== true) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (typeof token === 'string') {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return httpClient(originalRequest);
          })
          .catch((err: unknown) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refresh = getRefreshToken();
      if (refresh === null || refresh === '') {
        clearTokens();
        processQueue(error, null);
        isRefreshing = false;
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        return Promise.reject(error);
      }

      try {
        const response = await axios.post<{ access_token: string; refresh_token: string }>(
          `${API_BASE_URL}/auth/refresh`,
          { refresh_token: refresh },
        );
        const { access_token, refresh_token } = response.data;
        setTokens(access_token, refresh_token);
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        processQueue(null, access_token);
        return httpClient(originalRequest);
      } catch (refreshError) {
        clearTokens();
        processQueue(refreshError, null);
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Normalise error shape
    const apiError: ApiError = {
      message:
        (error.response?.data as { message?: string } | undefined)?.message ??
        error.message ??
        'An unexpected error occurred',
      errors: (error.response?.data as { errors?: Record<string, string[]> } | undefined)?.errors,
      status: error.response?.status ?? 0,
    };

    return Promise.reject(apiError);
  },
);

export { httpClient, setTokens, clearTokens, getAccessToken };
