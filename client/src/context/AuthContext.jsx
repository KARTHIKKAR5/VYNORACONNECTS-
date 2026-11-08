import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

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

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('vynora_token'));
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = Boolean(user && token);

  const fetchMe = useCallback(async (tok) => {
    try {
      const json = await apiFetch('/auth/me', {
        headers: { Authorization: `Bearer ${tok}` },
      });
      setUser(json.data.user);
    } catch {
      localStorage.removeItem('vynora_token');
      setToken(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('vynora_token');
    if (stored) {
      setToken(stored);
      fetchMe(stored).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [fetchMe]);

  const login = useCallback(async (email, password) => {
    const json = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const { user: u, token: tok } = json.data;
    localStorage.setItem('vynora_token', tok);
    setToken(tok);
    setUser(u);
    return u;
  }, []);

  const register = useCallback(async (data) => {
    const json = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    const { user: u, token: tok } = json.data;
    localStorage.setItem('vynora_token', tok);
    setToken(tok);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('vynora_token');
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((data) => {
    setUser(prev => ({ ...prev, ...data }));
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
