/**
 * Vynora Connect — Network Module API Service
 * Centralized interface connecting frontend pages to backend `/api/v1/network`
 * with automatic fallback to isolated development mock service ONLY when
 * the backend server is offline/unreachable.
 *
 * Real HTTP errors (400, 401, 403, 404, 409, 429, 500) are NEVER swallowed.
 */

import { apiClient, ApiError } from '../../../services/apiClient.js';
import mockNetworkService from './mockNetworkService.js';

let forceMock = false;

function shouldFallbackToMock(err) {
  // Only fall back to mock if backend server is completely offline / network unreachable
  return err && (err.code === 'NETWORK_ERROR' || err.status === 0);
}

export const networkApi = {
  setForceMock: (val) => {
    forceMock = Boolean(val);
  },

  isUsingMock: () => forceMock,

  /**
   * Probe backend server health status
   */
  async checkBackendHealth() {
    if (forceMock) return false;
    try {
      const res = await apiClient.get('/health');
      return Boolean(res && res.status === 'ok');
    } catch {
      return false;
    }
  },

  /**
   * Search and filter student discovery
   */
  async searchStudents(params = {}) {
    if (!forceMock) {
      try {
        const res = await apiClient.get('/network/students', params);
        if (res && res.success) {
          return {
            students: res.data || [],
            meta: res.meta || { page: 1, limit: 10, total: (res.data || []).length, totalPages: 1 },
            isLive: true,
          };
        }
      } catch (err) {
        if (!shouldFallbackToMock(err)) throw err;
      }
    }
    const mockRes = await mockNetworkService.searchStudents(params);
    return { ...mockRes, isLive: false };
  },

  /**
   * Get student profile by user ID
   */
  async getStudentById(userId) {
    if (!forceMock) {
      try {
        const res = await apiClient.get(`/network/students/${userId}`);
        if (res && res.success) {
          return { student: res.data, isLive: true };
        }
      } catch (err) {
        if (!shouldFallbackToMock(err)) throw err;
      }
    }
    const student = await mockNetworkService.getStudentById(userId);
    return { student, isLive: false };
  },

  /**
   * Get current authenticated user profile
   */
  async getMyProfile() {
    if (!forceMock) {
      try {
        const res = await apiClient.get('/network/me/profile');
        if (res && res.success) {
          return { profile: res.data, isLive: true };
        }
      } catch (err) {
        if (!shouldFallbackToMock(err)) throw err;
      }
    }
    const profile = await mockNetworkService.getMyProfile();
    return { profile, isLive: false };
  },

  /**
   * Update current user profile
   */
  async updateMyProfile(payload) {
    if (!forceMock) {
      try {
        const res = await apiClient.put('/network/me/profile', payload);
        if (res && res.success) {
          return { profile: res.data, isLive: true };
        }
      } catch (err) {
        if (!shouldFallbackToMock(err)) throw err;
      }
    }
    const updated = await mockNetworkService.updateMyProfile(payload);
    return { profile: updated, isLive: false };
  },

  /**
   * Get all accepted connections
   */
  async getConnections() {
    if (!forceMock) {
      try {
        const res = await apiClient.get('/network/connections');
        if (res && res.success) {
          return { connections: res.data || [], isLive: true };
        }
      } catch (err) {
        if (!shouldFallbackToMock(err)) throw err;
      }
    }
    const connections = await mockNetworkService.getConnections();
    return { connections, isLive: false };
  },

  /**
   * Get received connection requests
   */
  async getReceivedRequests() {
    if (!forceMock) {
      try {
        const res = await apiClient.get('/network/requests/received');
        if (res && res.success) {
          return { requests: res.data || [], isLive: true };
        }
      } catch (err) {
        if (!shouldFallbackToMock(err)) throw err;
      }
    }
    const requests = await mockNetworkService.getReceivedRequests();
    return { requests, isLive: false };
  },

  /**
   * Get sent connection requests
   */
  async getSentRequests() {
    if (!forceMock) {
      try {
        const res = await apiClient.get('/network/requests/sent');
        if (res && res.success) {
          return { requests: res.data || [], isLive: true };
        }
      } catch (err) {
        if (!shouldFallbackToMock(err)) throw err;
      }
    }
    const requests = await mockNetworkService.getSentRequests();
    return { requests, isLive: false };
  },

  /**
   * Send a new connection request
   */
  async sendConnectionRequest(recipientId) {
    if (!forceMock) {
      try {
        const res = await apiClient.post('/network/requests', { recipientId });
        if (res && res.success) {
          return { ...res.data, isLive: true };
        }
      } catch (err) {
        if (!shouldFallbackToMock(err)) throw err;
      }
    }
    return mockNetworkService.sendConnectionRequest(recipientId);
  },

  /**
   * Accept an incoming connection request
   */
  async acceptConnectionRequest(requestId) {
    if (!forceMock) {
      try {
        const res = await apiClient.patch(`/network/requests/${requestId}/accept`);
        if (res && res.success) {
          return { ...res.data, isLive: true };
        }
      } catch (err) {
        if (!shouldFallbackToMock(err)) throw err;
      }
    }
    return mockNetworkService.acceptConnectionRequest(requestId);
  },

  /**
   * Reject an incoming connection request
   */
  async rejectConnectionRequest(requestId) {
    if (!forceMock) {
      try {
        const res = await apiClient.patch(`/network/requests/${requestId}/reject`);
        if (res && res.success) {
          return { ...res.data, isLive: true };
        }
      } catch (err) {
        if (!shouldFallbackToMock(err)) throw err;
      }
    }
    return mockNetworkService.rejectConnectionRequest(requestId);
  },

  /**
   * Cancel an outgoing connection request
   */
  async cancelConnectionRequest(requestId) {
    if (!forceMock) {
      try {
        const res = await apiClient.patch(`/network/requests/${requestId}/cancel`);
        if (res && res.success) {
          return { ...res.data, isLive: true };
        }
      } catch (err) {
        if (!shouldFallbackToMock(err)) throw err;
      }
    }
    return mockNetworkService.cancelConnectionRequest(requestId);
  },

  /**
   * Remove an accepted connection
   */
  async removeConnection(connectionId) {
    if (!forceMock) {
      try {
        const res = await apiClient.delete(`/network/connections/${connectionId}`);
        if (res && res.success) {
          return { ...res.data, isLive: true };
        }
      } catch (err) {
        if (!shouldFallbackToMock(err)) throw err;
      }
    }
    return mockNetworkService.removeConnection(connectionId);
  },

  /**
   * Safety Service: Report User
   */
  async reportUser(userId, category, explanation) {
    return mockNetworkService.reportUser(userId, category, explanation);
  },

  /**
   * Safety Service: Block User
   */
  async blockUser(userId) {
    return mockNetworkService.blockUser(userId);
  },
};

export default networkApi;
