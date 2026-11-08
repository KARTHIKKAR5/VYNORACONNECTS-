import React from 'react';
import {
  MessageSquare,
  Users,
  Bell,
  Settings,
  X,
  Sparkles,
} from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';

/**
 * MobileNav Component
 * Handles the responsive mobile bottom bar and drawer menu for small screens.
 */
export const MobileNav = ({
  activePage,
  onNavigate,
  isOpen,
  onClose,
  unreadMessagesCount = 0,
  unreadNotificationsCount = 0,
  currentUser,
}) => {
  const navTabs = [
    {
      id: 'inbox',
      label: 'Inbox',
      icon: MessageSquare,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : null,
    },
    {
      id: 'groups',
      label: 'Groups',
      icon: Users,
      badge: null,
    },
    {
      id: 'notifications',
      label: 'Alerts',
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : null,
      badgeVariant: 'danger',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <>
      {/* 1. Bottom Navigation Bar for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 px-3 flex items-center justify-around z-30 shadow-lg">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            activePage === tab.id ||
            (tab.id === 'inbox' && activePage === 'chat');

          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`relative flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
                isActive ? 'text-brand-600 font-semibold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-2 px-1 py-0.2 bg-brand-500 text-white rounded-full text-[9px] font-bold">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* 2. Slide-out Drawer for Mobile */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Drawer content */}
          <div className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="font-bold text-slate-800 text-base">
                  Vynora Connect
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Student Profile summary */}
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
              <Avatar
                src={currentUser?.avatar}
                alt={currentUser?.name}
                size="md"
                status={currentUser?.status || 'online'}
              />
              <div className="min-w-0">
                <p className="font-semibold text-slate-800 text-sm truncate">
                  {currentUser?.name || 'Alex Chen'}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {currentUser?.role || 'Student'}
                </p>
              </div>
            </div>

            {/* Links */}
            <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
              {navTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activePage === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      onNavigate(tab.id);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all ${
                      isActive
                        ? 'bg-brand-50 text-brand-600 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </div>
                    {tab.badge && (
                      <Badge variant="count" size="xs">
                        {tab.badge}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
