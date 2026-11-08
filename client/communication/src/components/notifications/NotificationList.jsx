import React, { useState } from 'react';
import { Bell, CheckCheck, Filter, Inbox } from 'lucide-react';
import { NotificationItem } from './NotificationItem';
import { Button } from '../common/Button';

/**
 * NotificationList Component
 * Renders filter tabs, action bar, and the feed of student notifications.
 */
export const NotificationList = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onNavigateToConversation,
}) => {
  const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'mentions' | 'messages' | 'system'

  // Filter notifications
  const filteredNotifications = notifications.filter((item) => {
    if (filter === 'unread') return !item.isRead;
    if (filter === 'mentions') return item.type === 'mention';
    if (filter === 'messages') return item.type === 'message';
    if (filter === 'system') return item.type === 'system' || item.type === 'deadline';
    return true;
  });

  const unreadTotal = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-800">
              Notification Center
            </h2>
            {unreadTotal > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-200">
                {unreadTotal} new
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Stay updated with study group mentions, project deadines, and mentor feedback.
          </p>
        </div>

        {unreadTotal > 0 && (
          <Button
            variant="outline"
            size="sm"
            icon={CheckCheck}
            onClick={onMarkAllAsRead}
          >
            Mark all as read
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', label: 'All Notifications' },
          { id: 'unread', label: `Unread (${unreadTotal})` },
          { id: 'mentions', label: 'Mentions' },
          { id: 'messages', label: 'Messages' },
          { id: 'system', label: 'System & Deadlines' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-3.5 py-2 rounded-xl font-medium whitespace-nowrap transition-colors ${
              filter === tab.id
                ? 'bg-brand-500 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notification Cards Stream */}
      <div className="space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => (
            <NotificationItem
              key={notif.id}
              notification={notif}
              onMarkAsRead={onMarkAsRead}
              onActionClick={(convId) => {
                if (convId && onNavigateToConversation) {
                  onNavigateToConversation(convId);
                }
              }}
            />
          ))
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
              <Inbox className="w-7 h-7" />
            </div>
            <h3 className="text-base font-semibold text-slate-800">
              No notifications here
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              You are all caught up! New peer collaboration and project notices will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
