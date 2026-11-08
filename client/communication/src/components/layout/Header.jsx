import React from 'react';
import {
  Bell,
  Search,
  Menu,
  Sparkles,
  Wifi,
} from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';

/**
 * Header Component
 * Top bar displaying active view title, search, live backend status indicator, and profile quick view.
 */
export const Header = ({
  activePage,
  onOpenMobileMenu,
  onNavigate,
  unreadNotificationsCount = 0,
  currentUser,
}) => {
  const getPageTitle = () => {
    switch (activePage) {
      case 'inbox':
      case 'chat':
        return 'Student Messages & Collaboration';
      case 'groups':
        return 'Study Groups & Project Channels';
      case 'notifications':
        return 'Notification Center';
      case 'settings':
        return 'Notification Preferences';
      default:
        return 'Communication & Notifications';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 focus:outline-none"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 md:hidden">
          <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold text-slate-900 text-sm">Vynora</span>
        </div>

        <div className="hidden sm:block">
          <h1 className="text-base font-semibold text-slate-800 leading-tight">
            {getPageTitle()}
          </h1>
          <p className="text-[11px] text-slate-600 hidden md:block">
            Vynora Connect Student Networking Platform
          </p>
        </div>
      </div>

      {/* Right: Quick actions & Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Network & Platform status pill */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-600">
          <Wifi className="w-3.5 h-3.5 text-emerald-500" />
          <span className="font-medium text-[11px]">Campus Network Online</span>
        </div>

        {/* Notifications Icon Button */}
        <button
          onClick={() => onNavigate('notifications')}
          className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          title="View Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white"></span>
          )}
        </button>

        {/* User Mini Card */}
        <div className="flex items-center gap-2.5 pl-2 sm:border-l sm:border-slate-200">
          <Avatar
            src={currentUser?.avatar}
            alt={currentUser?.name}
            size="sm"
            status={currentUser?.status || 'online'}
          />
          <div className="hidden sm:block text-left">
            <span className="text-xs font-semibold text-slate-800 block leading-tight">
              {currentUser?.name || 'Alex Chen'}
            </span>
            <span className="text-[10px] text-slate-400 block leading-tight">
              {currentUser?.statusMessage || 'Student Mentor'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
