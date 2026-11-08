import React from 'react';
import {
  MessageSquare,
  Bell,
  Settings,
  Users,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';

/**
 * Sidebar Component
 * Left desktop navigation panel for Vynora Connect student platform.
 */
export const Sidebar = ({
  activePage,
  onNavigate,
  unreadMessagesCount = 0,
  unreadNotificationsCount = 0,
  currentUser,
}) => {
  const navItems = [
    {
      id: 'inbox',
      label: 'Inbox & Direct',
      icon: MessageSquare,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : null,
      badgeVariant: 'count',
    },
    {
      id: 'groups',
      label: 'Study Groups',
      icon: Users,
      badge: null,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : null,
      badgeVariant: 'danger',
    },
    {
      id: 'settings',
      label: 'Notification Settings',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <aside className="hidden md:flex md:w-64 flex-col bg-white border-r border-slate-200 h-screen sticky top-0 flex-shrink-0 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100 gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <span className="font-bold text-slate-900 tracking-tight text-lg block leading-tight">
            Vynora<span className="text-brand-500">.</span>
          </span>
          <span className="text-[10px] font-semibold tracking-wider text-slate-600 uppercase">
            Connect
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
          Communication
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activePage === item.id ||
            (item.id === 'inbox' && activePage === 'chat');

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-brand-50 text-brand-600 font-semibold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive
                      ? 'text-brand-600'
                      : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge ? (
                <Badge variant={item.badgeVariant || 'primary'} size="xs">
                  {item.badge}
                </Badge>
              ) : (
                <ChevronRight
                  className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${
                    isActive ? 'opacity-100 text-brand-500' : 'text-slate-300'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Campus Term Banner */}
      <div className="p-3 mx-3 mb-3 bg-gradient-to-br from-brand-50 to-indigo-50/50 rounded-xl border border-brand-100/60">
        <div className="text-[11px] font-semibold text-brand-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Academic Term 2026
        </div>
        <p className="text-xs text-slate-600 leading-snug font-medium">
          Vynora Tech Student Network
        </p>
      </div>

      {/* Current Student User Profile card */}
      <div className="p-3 border-t border-slate-100">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
          <Avatar
            src={currentUser?.avatar}
            alt={currentUser?.name}
            size="md"
            status={currentUser?.status || 'online'}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">
              {currentUser?.name || 'Alex Chen'}
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              {currentUser?.role || 'Student'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
