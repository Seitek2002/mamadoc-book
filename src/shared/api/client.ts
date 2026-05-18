const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

export interface ApiError {
  error: string;
  message: string;
  details: Record<string, unknown>;
}

async function request<T>(
  path: string,
  options: RequestInit & { next?: NextFetchRequestConfig } = {},
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
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
