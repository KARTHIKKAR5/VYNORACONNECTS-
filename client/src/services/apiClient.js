/**
 * Vynora Connect — Shared API Client
 * Centralized HTTP request handler with error wrapping and timeout safety.
 */

const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || '/api/v1';

export class ApiError extends Error {
  constructor(message, status, code = 'API_ERROR', details = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    config.signal = controller.signal;

    const response = await fetch(url, config);
    clearTimeout(timeoutId);

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const message = data?.error?.message || `Request failed with status ${response.status}`;
      const code = data?.error?.code || 'HTTP_ERROR';
      const details = data?.error?.details || [];
      throw new ApiError(message, response.status, code, details);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error.name === 'AbortError') {
      throw new ApiError('Request timed out. Please check your connection.', 408, 'TIMEOUT');
    }
    throw new ApiError(
      error.message || 'Unable to connect to Vynora backend server.',
      0,
      'NETWORK_ERROR'
    );
  }
}

export const apiClient = {
  get: (endpoint, params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.append(key, val);
      }
    });
    const queryString = searchParams.toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return request(url, { method: 'GET' });
  },
  post: (endpoint, body) => request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  patch: (endpoint, body) => request(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};
