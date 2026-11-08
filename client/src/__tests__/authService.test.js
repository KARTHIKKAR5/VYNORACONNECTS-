import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '../services/authService.js';

const mockStorage = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = String(value);
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

global.localStorage = mockStorage;

describe('authService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    global.localStorage.clear();
  });

  it('should call login and return data', async () => {
    const mockResponse = {
      success: true,
      data: {
        token: 'test-token',
        user: { id: 'usr-1', email: 'student@vynora.edu', name: 'Student' },
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockResponse,
    });

    const res = await authService.login('student@vynora.edu', 'secret123');
    expect(res.data.token).toBe('test-token');
    expect(global.fetch).toHaveBeenCalledWith('/api/v1/auth/login', expect.objectContaining({
      method: 'POST',
    }));
  });

  it('should call register with student details', async () => {
    const mockResponse = {
      success: true,
      data: {
        token: 'reg-token',
        user: { id: 'usr-2', email: 'new@vynora.edu', firstName: 'Karthik' },
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => mockResponse,
    });

    const res = await authService.register({
      firstName: 'Karthik',
      email: 'new@vynora.edu',
      password: 'Password123!',
    });
    expect(res.data.user.firstName).toBe('Karthik');
  });

  it('should attach token header if present in localStorage', async () => {
    global.localStorage.setItem('vynora_token', 'saved-jwt-token');

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true, data: { user: { id: 'usr-3' } } }),
    });

    await authService.getMe();
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/v1/auth/me',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer saved-jwt-token',
        }),
      })
    );
  });
});
