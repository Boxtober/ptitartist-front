const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export type ApiUser = {
  id: string;
  email: string;
  createdAt: string;
  firstName?: string | null;
  lastName?: string | null;
  age?: number | null;
  avatarUrl?: string | null;
};

export type ApiImage = {
  id: string;
  url: string;
  description?: string | null;
  createdAt: string;
  userId: string;
  childId?: string | null;
  child?: {
    id: string;
    firstName: string;
  } | null;
};

export type ApiChild = {
  id: string;
  firstName: string;
  birthDate?: string | null;
  avatarUrl?: string | null;
  color?: string | null;
  createdAt?: string;
};

type ApiError = { error?: string; message?: string };

function getToken() {
  return localStorage.getItem('token');
}

function buildHeaders(withAuth = false, extraHeaders: Record<string, string> = {}) {
  const headers: Record<string, string> = { ...extraHeaders };
  if (withAuth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function parseResponse<T>(res: Response): Promise<T> {
  if (res.ok) return res.json() as Promise<T>;

  let payload: ApiError | undefined;
  try {
    payload = await res.json();
  } catch {
    payload = undefined;
  }
  throw new Error(payload?.error ?? payload?.message ?? `Erreur HTTP ${res.status}`);
}

export async function register(email: string, password: string) {
  const res = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return parseResponse<ApiUser>(res);
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await parseResponse<{ token: string }>(res);
  localStorage.setItem('token', data.token);
  return data;
}

export async function getMe() {
  const res = await fetch(`${API_URL}/me`, {
    headers: buildHeaders(true),
  });
  return parseResponse<ApiUser>(res);
}

export async function getImages() {
  const res = await fetch(`${API_URL}/images`, {
    headers: buildHeaders(true),
  });
  return parseResponse<ApiImage[]>(res);
}

export async function getChildren() {
  const res = await fetch(`${API_URL}/children`, {
    headers: buildHeaders(true),
  });
  return parseResponse<ApiChild[]>(res);
}

export async function createChild(payload: {
  firstName: string;
  birthDate?: string;
  avatarUrl?: string;
  color?: string;
}) {
  const res = await fetch(`${API_URL}/children`, {
    method: 'POST',
    headers: buildHeaders(true, { 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  });
  return parseResponse<ApiChild>(res);
}

export async function deleteChild(childId: string) {
  const res = await fetch(`${API_URL}/children/${childId}`, {
    method: 'DELETE',
    headers: buildHeaders(true),
  });
  return parseResponse<{ success: boolean }>(res);
}

export async function uploadImage(
  file: File,
  options?: { description?: string; childId?: string },
) {
  const form = new FormData();
  form.append('file', file);
  if (options?.description) form.append('description', options.description);
  if (options?.childId) form.append('childId', options.childId);

  const res = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    headers: buildHeaders(
      true,
      options?.description ? { 'x-description': options.description } : {},
    ),
    body: form,
  });
  return parseResponse<ApiImage>(res);
}

export const logout = () => localStorage.removeItem('token');