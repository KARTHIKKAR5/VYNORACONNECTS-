// Clean initial data for Vynora Connect student networking platform.
// No pre-baked fake chat transcripts: chats start clean, real messages appear when you send them!

export const currentUser = {
  id: 'usr-current',
  name: 'Alex Chen',
  role: 'Senior • Computer Science',
  university: 'Vynora Tech Institute',
  department: 'Department of Computing & Information Sciences',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  status: 'online',
  statusMessage: 'Final year capstone & mentoring 🚀',
};

// Active student conversations start completely empty.
// Students choose who they want to chat with from the campus directory or create a channel.
export const mockConversations = [];

// Notifications start completely clean.
// Real notifications will only arrive when someone messages, mentions, or alerts you.
export const mockNotifications = [];

export const defaultNotificationSettings = {
  email: {
    directMessages: true,
    mentions: true,
    groupUpdates: false,
    systemAnnouncements: true,
    weeklyDigest: false,
  },
  push: {
    directMessages: true,
    mentions: true,
    groupUpdates: true,
    systemAnnouncements: false,
    soundAlerts: true,
  },
  inApp: {
    desktopBanners: true,
    messagePreviews: true,
    playSoundOnReceive: true,
    showUnreadCounters: true,
  },
  quietHours: {
    enabled: true,
    startTime: '22:00',
    endTime: '07:00',
  },
};
