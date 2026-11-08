// API Service Layer
// Prepared for seamless connection to the shared Node.js + Express backend.
// In preview mode, it falls back to mock data.

import { mockConversations, mockNotifications, defaultNotificationSettings, currentUser } from '../data/mockData';

const BASE_URL = import.meta.env.VITE_API_URL || null;

// Helper to determine whether to use real backend API or mock preview
const isBackendConnected = () => Boolean(BASE_URL);

export const communicationApi = {
  // Fetch current user details
  getCurrentUser: async () => {
    if (isBackendConnected()) {
      const response = await fetch(`${BASE_URL}/users/me`);
      if (!response.ok) throw new Error('Failed to fetch user profile');
      return response.json();
    }
    return currentUser;
  },

  // Get all conversations for current student
  getConversations: async () => {
    if (isBackendConnected()) {
      const response = await fetch(`${BASE_URL}/conversations`);
      if (!response.ok) throw new Error('Failed to fetch conversations');
      return response.json();
    }
    return mockConversations;
  },

  // Create a new conversation
  createConversation: async (convData) => {
    if (isBackendConnected()) {
      const response = await fetch(`${BASE_URL}/conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(convData),
      });
      if (!response.ok) throw new Error('Failed to create conversation');
      return response.json();
    }
    return {
      id: `conv-${Date.now()}`,
      ...convData,
      messages: [],
    };
  },

  // Delete a conversation
  deleteConversation: async (conversationId) => {
    if (isBackendConnected()) {
      const response = await fetch(`${BASE_URL}/conversations/${conversationId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete conversation');
      return response.json();
    }
    return { success: true, id: conversationId };
  },

  // Get messages for a specific conversation
  getMessages: async (conversationId) => {
    if (isBackendConnected()) {
      const response = await fetch(`${BASE_URL}/conversations/${conversationId}/messages`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      return response.json();
    }
    const conv = mockConversations.find((c) => c.id === conversationId);
    return conv ? conv.messages : [];
  },

  // Send a message
  sendMessage: async (conversationId, messageData) => {
    if (isBackendConnected()) {
      const response = await fetch(`${BASE_URL}/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData),
      });
      if (!response.ok) throw new Error('Failed to send message');
      return response.json();
    }
    // Mock preview response
    return {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      text: messageData.text,
      timestamp: 'Just now',
      status: 'sent',
    };
  },

  // Fetch student notifications
  getNotifications: async () => {
    if (isBackendConnected()) {
      const response = await fetch(`${BASE_URL}/notifications`);
      if (!response.ok) throw new Error('Failed to fetch notifications');
      return response.json();
    }
    return mockNotifications;
  },

  // Mark a notification as read
  markNotificationAsRead: async (notificationId) => {
    if (isBackendConnected()) {
      const response = await fetch(`${BASE_URL}/notifications/${notificationId}/read`, {
        method: 'PATCH',
      });
      if (!response.ok) throw new Error('Failed to update notification');
      return response.json();
    }
    return { success: true, notificationId };
  },

  // Mark all notifications as read
  markAllNotificationsAsRead: async () => {
    if (isBackendConnected()) {
      const response = await fetch(`${BASE_URL}/notifications/read-all`, {
        method: 'PATCH',
      });
      if (!response.ok) throw new Error('Failed to mark all as read');
      return response.json();
    }
    return { success: true };
  },

  // Get notification settings
  getNotificationSettings: async () => {
    if (isBackendConnected()) {
      const response = await fetch(`${BASE_URL}/notifications/settings`);
      if (!response.ok) throw new Error('Failed to fetch notification settings');
      return response.json();
    }
    return defaultNotificationSettings;
  },

  // Update notification settings
  updateNotificationSettings: async (newSettings) => {
    if (isBackendConnected()) {
      const response = await fetch(`${BASE_URL}/notifications/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      if (!response.ok) throw new Error('Failed to update settings');
      return response.json();
    }
    return newSettings;
  },
};
