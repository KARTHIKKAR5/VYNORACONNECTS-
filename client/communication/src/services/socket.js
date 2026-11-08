// Real-time Socket.IO Service Interface
// Connects to the Vynora Connect Socket.IO backend server.
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  // Connect to the Socket.IO backend
  connect(userId = 'usr-current') {
    if (this.socket && this.socket.connected) return;

    try {
      this.socket = io(SOCKET_URL, {
        query: { userId },
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      this.socket.on('connect', () => {
        console.log('⚡ [Socket.IO Client] Connected to real-time server with id:', this.socket.id);
      });

      this.socket.on('disconnect', (reason) => {
        console.log('⚠️ [Socket.IO Client] Disconnected:', reason);
      });

      this.socket.on('connect_error', (error) => {
        console.warn('⚠️ [Socket.IO Client] Connection error:', error.message);
      });

      // Re-attach any registered event listeners to the new socket instance
      this.listeners.forEach((callbacks, event) => {
        callbacks.forEach((cb) => this.socket.on(event, cb));
      });
    } catch (err) {
      console.warn('[Vynora Socket] Failed to connect to Socket.IO backend:', err);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Join a specific conversation room for real-time messaging
  joinConversation(conversationId) {
    if (!conversationId) return;
    this.emit('join_conversation', { conversationId });
  }

  // Leave conversation room
  leaveConversation(conversationId) {
    if (!conversationId) return;
    this.emit('leave_conversation', { conversationId });
  }

  // Send message through socket
  sendMessage(messageData) {
    this.emit('send_message', messageData);
  }

  // Subscribe to real-time events
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);

    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  // Unsubscribe
  off(event, callback) {
    if (!this.listeners.has(event)) return;
    const callbacks = this.listeners.get(event).filter((cb) => cb !== callback);
    this.listeners.set(event, callbacks);

    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  // Emit event to server
  emit(event, data) {
    if (this.socket && this.socket.connected) {
      this.socket.emit(event, data);
    } else {
      // Echo to local subscribers if disconnected
      const callbacks = this.listeners.get(event) || [];
      callbacks.forEach((cb) => cb(data));
    }
  }
}

export const socketService = new SocketService();
