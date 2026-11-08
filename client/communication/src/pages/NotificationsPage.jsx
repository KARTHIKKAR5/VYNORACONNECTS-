import React from 'react';
import { NotificationList } from '../components/notifications/NotificationList';

/**
 * NotificationsPage Component
 * Full-screen notifications center with categorization and actions.
 */
export const NotificationsPage = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onNavigateToConversation,
}) => {
  return (
    <div className="flex-1 overflow-y-auto h-[calc(100vh-4rem)] bg-slate-50/60 pb-16 md:pb-6">
      <NotificationList
        notifications={notifications}
        onMarkAsRead={onMarkAsRead}
        onMarkAllAsRead={onMarkAllAsRead}
        onNavigateToConversation={onNavigateToConversation}
      />
    </div>
  );
};
