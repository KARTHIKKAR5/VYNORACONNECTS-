/**
 * Socket.IO Real-Time Chat & Notification Engine
 * Manages conversation rooms, live message broadcasts, typing indicators, and presence.
 */

// Active connected users map: userId -> Set of socket IDs
const onlineUsers = new Map();

export const setupChatSocket = (io) => {
  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId || 'usr-current';
    console.log(`🔌 [Socket.IO] Student connected: ${socket.id} (User: ${userId})`);

    // Track online presence
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId).add(socket.id);

    // Broadcast updated online presence
    io.emit('presence_update', {
      userId,
      status: 'online',
      onlineUsersCount: onlineUsers.size,
    });

    // 1. Join a specific conversation room
    socket.on('join_conversation', ({ conversationId }) => {
      if (!conversationId) return;
      const room = `conversation:${conversationId}`;
      socket.join(room);
      console.log(`💬 [Socket.IO] Socket ${socket.id} joined room: ${room}`);
    });

    // 2. Leave a conversation room
    socket.on('leave_conversation', ({ conversationId }) => {
      if (!conversationId) return;
      const room = `conversation:${conversationId}`;
      socket.leave(room);
      console.log(`👋 [Socket.IO] Socket ${socket.id} left room: ${room}`);
    });

    // 3. Live Message Broadcast
    socket.on('send_message', (messageData) => {
      const { conversationId, text, senderId, senderName } = messageData;
      if (!conversationId || !text) return;

      const room = `conversation:${conversationId}`;
      const payload = {
        id: messageData.id || `msg-${Date.now()}`,
        conversationId,
        senderId: senderId || userId,
        senderName: senderName || 'Student',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'delivered',
      };

      // Broadcast to everyone in the room except the sender
      socket.to(room).emit('new_message', payload);
      // Echo confirmation back to sender
      socket.emit('message_sent', { ...payload, status: 'sent' });

      // Also emit a live notification alert to all members of the room
      socket.to(room).emit('new_notification', {
        id: `notif-${Date.now()}`,
        type: 'message',
        category: 'messages',
        title: `New message from ${senderName || 'Peer'}`,
        description: text.slice(0, 60),
        actionLink: conversationId,
        timestamp: 'Just now',
        isRead: false,
      });
    });

    // 4. Typing Indicators
    socket.on('typing_start', ({ conversationId, userName }) => {
      const room = `conversation:${conversationId}`;
      socket.to(room).emit('user_typing', {
        conversationId,
        userId,
        userName: userName || 'Peer',
        isTyping: true,
      });
    });

    socket.on('typing_stop', ({ conversationId }) => {
      const room = `conversation:${conversationId}`;
      socket.to(room).emit('user_typing', {
        conversationId,
        userId,
        isTyping: false,
      });
    });

    // 5. Read Receipt Broadcast
    socket.on('mark_read', ({ conversationId, messageIds }) => {
      const room = `conversation:${conversationId}`;
      socket.to(room).emit('messages_read', {
        conversationId,
        userId,
        messageIds,
      });
    });

    // 6. Handle Disconnect
    socket.on('disconnect', () => {
      console.log(`❌ [Socket.IO] Student disconnected: ${socket.id}`);
      if (onlineUsers.has(userId)) {
        onlineUsers.get(userId).delete(socket.id);
        if (onlineUsers.get(userId).size === 0) {
          onlineUsers.delete(userId);
          io.emit('presence_update', {
            userId,
            status: 'offline',
            onlineUsersCount: onlineUsers.size,
          });
        }
      }
    });
  });
};
