const API_BASE = '/api/v1';

async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('vynora_token');
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });
  const json = await res.json();
  if (!res.ok) {
    const err = new Error(json?.error?.message || 'Request failed');
    err.statusCode = res.status;
    throw err;
  }
  return json;
}

export const authService = {
  login: (email, password) =>
    apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (data) =>
    apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: () =>
    apiFetch('/auth/logout', {
      method: 'POST',
    }),

  getMe: () => apiFetch('/auth/me'),

  updateMe: (data) =>
    apiFetch('/auth/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

export default authService;
