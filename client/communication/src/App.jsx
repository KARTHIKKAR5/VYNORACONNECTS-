import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { InboxPage } from './pages/InboxPage';
import { ChatPage } from './pages/ChatPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { NotificationSettingsPage } from './pages/NotificationSettingsPage';
import {
  currentUser,
  mockConversations,
  mockNotifications,
  defaultNotificationSettings,
} from './data/mockData';
import { communicationApi } from './services/api';
import { socketService } from './services/socket';

export function App() {
  // Navigation & View state
  const [activePage, setActivePage] = useState('inbox'); // 'inbox' | 'groups' | 'notifications' | 'settings'
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Application Data States (Starts empty — students select who they chat with)
  const [conversations, setConversations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState(defaultNotificationSettings);
  const [user, setUser] = useState(currentUser);

  // Initialize data and socket listeners
  useEffect(() => {
    // Load initial data through API layer
    communicationApi.getCurrentUser().then(setUser).catch(console.error);
    communicationApi.getConversations().then((data) => {
      setConversations(data || []);
      if (data && data.length > 0 && !selectedConversationId) {
        setSelectedConversationId(data[0].id || data[0]._id);
      }
    }).catch(console.error);
    communicationApi.getNotifications().then(setNotifications).catch(console.error);
    communicationApi.getNotificationSettings().then(setSettings).catch(console.error);

    // Socket.IO service connection setup
    socketService.connect(currentUser.id);

    // Listen for incoming live real-time messages
    const handleIncomingMessage = (msg) => {
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === msg.conversationId || conv._id === msg.conversationId) {
            const isCurrentlyOpen = selectedConversationId === msg.conversationId;
            return {
              ...conv,
              unreadCount: isCurrentlyOpen ? 0 : (conv.unreadCount || 0) + 1,
              lastMessage: {
                text: msg.text,
                senderId: msg.senderId,
                timestamp: msg.timestamp,
                isRead: isCurrentlyOpen,
              },
              messages: [...(conv.messages || []), msg],
            };
          }
          return conv;
        })
      );
    };

    // Listen for incoming live notifications
    const handleIncomingNotification = (notif) => {
      setNotifications((prev) => [notif, ...prev]);
    };

    socketService.on('new_message', handleIncomingMessage);
    socketService.on('new_notification', handleIncomingNotification);

    return () => {
      socketService.off('new_message', handleIncomingMessage);
      socketService.off('new_notification', handleIncomingNotification);
      socketService.disconnect();
    };
  }, [selectedConversationId]);

  // Join active conversation room whenever selected conversation changes
  useEffect(() => {
    if (selectedConversationId) {
      socketService.joinConversation(selectedConversationId);

      // Fetch message history for the selected conversation from backend API
      communicationApi.getMessages(selectedConversationId).then((msgs) => {
        if (msgs && msgs.length > 0) {
          setConversations((prev) =>
            prev.map((c) =>
              c.id === selectedConversationId || c._id === selectedConversationId
                ? { ...c, messages: msgs }
                : c
            )
          );
        }
      }).catch(console.error);
    }
  }, [selectedConversationId]);

  // Compute unread totals
  const totalUnreadMessages = conversations.reduce(
    (acc, curr) => acc + (curr.unreadCount || 0),
    0
  );
  const totalUnreadNotifications = notifications.filter((n) => !n.isRead).length;

  // Handle selecting a conversation
  const handleSelectConversation = (conversationId) => {
    setSelectedConversationId(conversationId);

    // Automatically mark the selected conversation as read
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId || c._id === conversationId
          ? { ...c, unreadCount: 0 }
          : c
      )
    );
  };

  // Handle sending a new message
  const handleSendMessage = async (conversationId, text) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const localId = `msg-${Date.now()}`;

    const newMessage = {
      id: localId,
      conversationId,
      senderId: user.id,
      senderName: user.name,
      text,
      timestamp,
      status: 'sent',
    };

    // 1. Optimistically update local conversation state
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId || conv._id === conversationId) {
          return {
            ...conv,
            lastMessage: {
              text,
              senderId: user.id,
              timestamp,
              isRead: true,
            },
            messages: [...(conv.messages || []), newMessage],
          };
        }
        return conv;
      })
    );

    // 2. Broadcast via Socket.IO
    socketService.sendMessage(newMessage);

    // 3. Persist via backend REST API
    try {
      await communicationApi.sendMessage(conversationId, { text });
    } catch (err) {
      console.warn('API error sending message:', err.message);
    }
  };

  // Handle creating a new conversation
  const handleCreateNewConversation = async (data) => {
    try {
      const created = await communicationApi.createConversation(data);
      const newConv = {
        id: created.id || created._id,
        _id: created._id || created.id,
        type: created.type || data.type,
        name: created.name || data.name,
        avatar: created.avatar || (data.type === 'group'
          ? 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'),
        title: created.title || (data.type === 'group' ? 'New Study Group' : 'Peer Student'),
        department: data.department || '',
        status: 'online',
        unreadCount: 0,
        pinned: false,
        lastMessage: null,
        messages: [],
      };

      setConversations((prev) => [newConv, ...prev]);
      setSelectedConversationId(newConv.id);
      setActivePage('inbox');
    } catch (err) {
      console.error('Failed to create conversation:', err);
    }
  };

  // Handle Notification actions
  const handleMarkNotificationAsRead = async (notificationId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
    try {
      await communicationApi.markNotificationAsRead(notificationId);
    } catch (err) {
      // Ignored in preview
    }
  };

  const handleMarkAllNotificationsAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await communicationApi.markAllNotificationsAsRead();
    } catch (err) {
      // Ignored in preview
    }
  };

  const handleNavigateFromNotification = (convId) => {
    if (convId) {
      setSelectedConversationId(convId);
      setActivePage('inbox');
    }
  };

  // Handle removing a conversation from active list
  const handleDeleteConversation = async (conversationId) => {
    setConversations((prev) =>
      prev.filter((c) => c.id !== conversationId && c._id !== conversationId)
    );
    if (selectedConversationId === conversationId) {
      setSelectedConversationId(null);
    }
    try {
      await communicationApi.deleteConversation(conversationId);
    } catch (err) {
      console.warn('Error deleting conversation:', err);
    }
  };

  const handleSaveSettings = async (updatedSettings) => {
    setSettings(updatedSettings);
    try {
      await communicationApi.updateNotificationSettings(updatedSettings);
    } catch (err) {
      // Ignored in preview
    }
  };

  // Render Page content according to active route
  const renderActivePage = () => {
    switch (activePage) {
      case 'inbox':
        return (
          <InboxPage
            conversations={conversations}
            selectedId={selectedConversationId}
            onSelectConversation={handleSelectConversation}
            onSendMessage={handleSendMessage}
            onNewConversation={handleCreateNewConversation}
            onDeleteConversation={handleDeleteConversation}
            currentUserId={user.id}
          />
        );
      case 'groups':
        // Study Groups filter view
        return (
          <InboxPage
            conversations={conversations.filter((c) => c.type === 'group')}
            selectedId={selectedConversationId}
            onSelectConversation={handleSelectConversation}
            onSendMessage={handleSendMessage}
            onNewConversation={handleCreateNewConversation}
            onDeleteConversation={handleDeleteConversation}
            currentUserId={user.id}
          />
        );
      case 'notifications':
        return (
          <NotificationsPage
            notifications={notifications}
            onMarkAsRead={handleMarkNotificationAsRead}
            onMarkAllAsRead={handleMarkAllNotificationsAsRead}
            onNavigateToConversation={handleNavigateFromNotification}
          />
        );
      case 'settings':
        return (
          <NotificationSettingsPage
            settings={settings}
            onSaveSettings={handleSaveSettings}
          />
        );
      default:
        return (
          <InboxPage
            conversations={conversations}
            selectedId={selectedConversationId}
            onSelectConversation={handleSelectConversation}
            onSendMessage={handleSendMessage}
            onNewConversation={handleCreateNewConversation}
            currentUserId={user.id}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      {/* 1. Desktop Sidebar */}
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        unreadMessagesCount={totalUnreadMessages}
        unreadNotificationsCount={totalUnreadNotifications}
        currentUser={user}
      />

      {/* 2. Main Layout Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <Header
          activePage={activePage}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onNavigate={setActivePage}
          unreadNotificationsCount={totalUnreadNotifications}
          currentUser={user}
        />

        {/* Dynamic Page Container */}
        <main className="flex-1 min-h-0 relative">
          {renderActivePage()}
        </main>
      </div>

      {/* 3. Mobile Navigation & Drawer */}
      <MobileNav
        activePage={activePage}
        onNavigate={setActivePage}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        unreadMessagesCount={totalUnreadMessages}
        unreadNotificationsCount={totalUnreadNotifications}
        currentUser={user}
      />
    </div>
  );
}

export default App;
