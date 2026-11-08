import React from 'react';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { Users, Pin, X } from 'lucide-react';

/**
 * ConversationItem Component
 * Renders an individual conversation in the left sidebar list.
 * Clean, modern student messaging design.
 */
export const ConversationItem = ({
  conversation,
  isSelected,
  onSelect,
  onDelete,
}) => {
  const {
    id,
    type,
    name,
    avatar,
    title,
    status,
    unreadCount,
    pinned,
    lastMessage,
  } = conversation;

  return (
    <div
      onClick={() => onSelect(id)}
      className={`group relative flex items-start gap-3 p-3.5 rounded-xl cursor-pointer transition-all duration-150 ${
        isSelected
          ? 'bg-brand-50/90 border border-brand-200/90 shadow-xs'
          : 'hover:bg-slate-100/70 border border-transparent'
      }`}
    >
      {/* Avatar with online status */}
      <div className="relative flex-shrink-0">
        <Avatar
          src={avatar}
          alt={name}
          size="md"
          status={type === 'direct' ? status : null}
        />
        {type === 'group' && (
          <span className="absolute -bottom-1 -right-1 bg-brand-500 text-white p-0.5 rounded-full ring-2 ring-white">
            <Users className="w-2.5 h-2.5" />
          </span>
        )}
      </div>

      {/* Main Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <h4
              className={`text-sm font-semibold truncate ${
                isSelected ? 'text-brand-900' : 'text-slate-800'
              }`}
            >
              {name}
            </h4>
            {pinned && (
              <Pin className="w-3 h-3 text-brand-500 flex-shrink-0" />
            )}
          </div>
          {lastMessage?.timestamp && (
            <span
              className={`text-[11px] flex-shrink-0 ${
                unreadCount > 0 ? 'text-brand-600 font-semibold' : 'text-slate-400'
              }`}
            >
              {lastMessage.timestamp}
            </span>
          )}
        </div>

        {/* Subtitle / Role or Group members */}
        <p className="text-[11px] text-slate-400 truncate mb-1">
          {title}
        </p>

        {/* Last Message Preview & Actions */}
        <div className="flex items-center justify-between gap-2">
          {lastMessage?.text ? (
            <p
              className={`text-xs truncate ${
                unreadCount > 0
                  ? 'font-medium text-slate-800'
                  : 'text-slate-500'
              }`}
            >
              {lastMessage.text}
            </p>
          ) : (
            <p className="text-xs text-slate-400 italic">
              No messages yet
            </p>
          )}

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Badge variant="count" size="xs">
                {unreadCount}
              </Badge>
            )}

            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(id);
                }}
                className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-rose-500 rounded transition-opacity"
                title="Remove conversation"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
