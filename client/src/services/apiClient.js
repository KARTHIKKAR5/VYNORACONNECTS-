/**
 * Vynora Connect — Central API Client
 * Standardized HTTP request handler with error wrapping, timeouts, and authorization headers.
 */

const API_BASE_URL =
  typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL
    : '/api/v1';

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
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('vynora_token') : null;
  const currentUserId = typeof localStorage !== 'undefined' ? localStorage.getItem('vynora_user_id') : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(currentUserId ? { 'x-user-id': currentUserId } : {}),
    ...(options.headers || {}),
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    let timeoutId = null;
    if (controller) {
      timeoutId = setTimeout(() => controller.abort(), 8000);
      config.signal = controller.signal;
    }

    const response = await fetch(url, config);
    if (timeoutId) clearTimeout(timeoutId);

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
      throw new ApiError('Request timed out. Please check your network connection.', 408, 'TIMEOUT');
    }
    throw new ApiError(
      error.message || 'Unable to connect to the Vynora backend API.',
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
  post: (endpoint, body) =>
    request(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),
  put: (endpoint, body) =>
    request(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),
  patch: (endpoint, body) =>
    request(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};

export default apiClient;

