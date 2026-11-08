import React from 'react';
import {
  Bell,
  MessageSquare,
  AtSign,
  Users,
  Calendar,
  Check,
  ArrowRight,
} from 'lucide-react';
import { Avatar } from '../common/Avatar';

/**
 * NotificationItem Component
 * Single notification card with categorized icons, status, and quick action.
 */
export const NotificationItem = ({
  notification,
  onMarkAsRead,
  onActionClick,
}) => {
  const {
    id,
    type,
    title,
    description,
    timestamp,
    isRead,
    avatar,
    actionLink,
  } = notification;

  // Icon mapping according to notification type
  const getTypeIcon = () => {
    switch (type) {
      case 'mention':
        return <AtSign className="w-3.5 h-3.5 text-brand-500" />;
      case 'message':
        return <MessageSquare className="w-3.5 h-3.5 text-blue-500" />;
      case 'group':
        return <Users className="w-3.5 h-3.5 text-emerald-500" />;
      case 'deadline':
        return <Calendar className="w-3.5 h-3.5 text-amber-500" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-indigo-500" />;
    }
  };

  return (
    <div
      className={`group relative flex items-start gap-3.5 p-4 rounded-xl border transition-all duration-150 ${
        isRead
          ? 'bg-white border-slate-200/80 hover:border-slate-300'
          : 'bg-brand-50/40 border-brand-200/70 shadow-xs'
      }`}
    >
      {/* Avatar or Icon with type badge */}
      <div className="relative flex-shrink-0">
        {avatar ? (
          <Avatar src={avatar} alt={title} size="md" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
            <Bell className="w-5 h-5 text-brand-500" />
          </div>
        )}

        <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-xs border border-slate-100">
          {getTypeIcon()}
        </div>
      </div>

      {/* Main notification body */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h4
            className={`text-sm font-semibold truncate ${
              isRead ? 'text-slate-800' : 'text-brand-950 font-bold'
            }`}
          >
            {title}
          </h4>
          <span className="text-[11px] text-slate-400 whitespace-nowrap flex-shrink-0">
            {timestamp}
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed mb-2">
          {description}
        </p>

        {/* Action row */}
        <div className="flex items-center gap-3 pt-1">
          {actionLink && (
            <button
              onClick={() => onActionClick && onActionClick(actionLink)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
            >
              <span>View details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {!isRead && (
            <button
              onClick={() => onMarkAsRead(id)}
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mark as read</span>
            </button>
          )}
        </div>
      </div>

      {/* Unread dot */}
      {!isRead && (
        <span className="w-2.5 h-2.5 rounded-full bg-brand-500 flex-shrink-0 mt-1" />
      )}
    </div>
  );
};
