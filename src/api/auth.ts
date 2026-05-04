const API_URL = 'http://localhost:3000';

export const register = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw await res.json();
  return res.json();
};

export const login = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw await res.json();
  const data = await res.json();
  localStorage.setItem('token', data.token); // stocke le token
  return data;
};


export const getMe = async () => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw await res.json();
  return res.json();
};

export const logout = () => {
  localStorage.removeItem('token');
};