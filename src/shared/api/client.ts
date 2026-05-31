/**
 * API base URL resolution.
 *
 * - In the browser we prefer a relative base (same-origin), e.g. `/api/v1`.
 * - On the server (SSR / RSC) we need an absolute URL. Use a server-only env
 *   var `API_URL` (recommended for Docker), otherwise fall back to
 *   `NEXT_PUBLIC_API_URL` or localhost.
 */
const PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL ?? '/api/v1';
const SERVER_BASE_URL =
  process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

function joinUrl(base: string, path: string) {
  const b = base.endsWith('/') ? base.slice(0, -1) : base;
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${b}${p}`;
}

const BASE_URL = typeof window === 'undefined' ? SERVER_BASE_URL : PUBLIC_BASE_URL;

export interface ApiError {
  error: string;
  message: string;
  details: Record<string, unknown>;
}

async function request<T>(
  path: string,
  options: RequestInit & { next?: NextFetchRequestConfig } = {},
): Promise<T> {
  const res = await fetch(joinUrl(BASE_URL, path), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw data as ApiError;
  }

  return data as T;
}

export function apiGet<T>(
  path: string,
  options: { token?: string; revalidate?: number } = {},
) {
  return request<T>(path, {
    headers: options.token ? { Authorization: `Bearer ${options.token}` } : {},
    next: { revalidate: options.revalidate ?? 60 },
  });
}

export function apiPost<T>(path: string, body: unknown, token?: string) {
  return request<T>(path, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: JSON.stringify(body),
  });
}

export function apiDelete<T>(path: string, token: string) {
  return request<T>(path, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}
