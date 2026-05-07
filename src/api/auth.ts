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
  isFavorite?: boolean;
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

export async function deleteImage(imageId: string) {
  const url = `${API_URL}/images/${imageId}`;
  let res = await fetch(url, {
    method: 'DELETE',
    headers: buildHeaders(true),
  });

  if (!res.ok) {
    console.warn(`deleteImage: primary DELETE ${url} returned ${res.status}`);
    try {
      const text = await res.text();
      console.warn('deleteImage: response body:', text);
    } catch (e) {
      // ignore
    }

    const fallback = `${API_URL}/upload/${imageId}`;
    console.warn(`deleteImage: attempting fallback DELETE ${fallback}`);
    const res2 = await fetch(fallback, {
      method: 'DELETE',
      headers: buildHeaders(true),
    });
    if (res2.ok) return parseResponse<{ success: boolean; deleted: any }>(res2);

    return parseResponse<{ success: boolean; deleted: any }>(res);
  }
  return parseResponse<{ success: boolean; deleted: any }>(res);
}

export async function addFavorite(imageId: string) {
  const res = await fetch(`${API_URL}/images/${imageId}/favorite`, {
    method: 'POST',
    headers: buildHeaders(true),
  });

  if (res.ok) return parseResponse<{ success: boolean }>(res);

  if (res.status === 400) {
    try {
      const payload = await res.json();
      if (payload?.error === 'Already favorited') {
        return { success: true } as { success: boolean };
      }
    } catch {
      // fallthrough to error
    }
  }

  return parseResponse<{ success: boolean }>(res);
}

export async function removeFavorite(imageId: string) {
  const res = await fetch(`${API_URL}/images/${imageId}/favorite`, {
    method: 'DELETE',
    headers: buildHeaders(true),
  });
  return parseResponse<{ success: boolean }>(res);
}

// Settings API helpers
export type Settings = {
  isPrivateProfile?: boolean;
  emailReminders?: boolean;
  autoBackup?: boolean;
};

export async function getSettings() {
  const res = await fetch(`${API_URL}/settings`, {
    method: 'GET',
    headers: buildHeaders(true),
  });
  return parseResponse<Settings>(res);
}

export async function updateSettings(payload: Partial<Settings>) {
  const res = await fetch(`${API_URL}/settings`, {
    method: 'PUT',
    headers: buildHeaders(true, { 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  });
  return parseResponse<{ success: boolean; settings: Settings }>(res);
}

// Export all artwork -> returns blob
export async function exportAll(): Promise<Blob> {
  const res = await fetch(`${API_URL}/export`, {
    method: 'POST',
    headers: buildHeaders(true), // IMPORTANT: no Content-Type since no body
  });

  if (!res.ok) {
    try {
      const err = await res.json();
      throw new Error(err?.error ?? err?.message ?? `Erreur export ${res.status}`);
    } catch {
      throw new Error(`Erreur export ${res.status}`);
    }
  }

  const blob = await res.blob();
  return blob;
}

// Delete account
export async function deleteAccount() {
  const res = await fetch(`${API_URL}/me`, {
    method: 'DELETE',
    headers: buildHeaders(true),
  });
  return parseResponse<{ success: boolean }>(res);
}

// Avatar upload/delete
export async function uploadAvatar(file: File) {
  const form = new FormData();
  form.append('file', file);

  const res = await fetch(`${API_URL}/profile/avatar`, {
    method: 'POST',
    headers: buildHeaders(true), // do not set Content-Type for FormData
    body: form,
  });

  return parseResponse<ApiUser>(res);
}

export async function deleteAvatar() {
  const res = await fetch(`${API_URL}/profile/avatar`, {
    method: 'DELETE',
    headers: buildHeaders(true),
  });
  return parseResponse<{ success: true; user?: ApiUser }>(res);
}