import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Compass,
  Users,
  Briefcase,
  Layers,
  GraduationCap,
  MessageSquare,
  Sparkles,
  BookOpen,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  CheckCircle2,
  ChevronDown,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const displayName = user ? (user.displayName || user.name || user.firstName || 'Student') : 'Student';
  const firstName = user ? (user.firstName || displayName.split(' ')[0]) : 'Student';
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const college = user ? (user.college || 'Vynora') : 'Vynora';
  const branch = user ? (user.branch || user.department || 'Student') : 'Student';

  const notifications = [
    { id: 'n-1', title: 'Connection request accepted', time: '25m ago', unread: true },
    { id: 'n-2', title: 'HackVynora 2026 registration open', time: '1h ago', unread: true },
    { id: 'n-3', title: 'New project invite received', time: '3h ago', unread: false },
  ];

  const navigationItems = [
    { path: '/app', label: 'Home Dashboard', icon: Compass, exact: true },
    { path: '/app/network', label: 'Campus Network', icon: Users },
    { path: '/app/opportunities', label: 'Opportunities', icon: Briefcase },
    { path: '/app/projects', label: 'Projects & Teams', icon: Layers },
    { path: '/app/clubs', label: 'Clubs & Events', icon: GraduationCap },
    { path: '/app/messages', label: 'Messages', icon: MessageSquare, badge: 5 },
    { path: '/app/mentorship', label: 'Mentorship', icon: Sparkles },
    { path: '/app/resources', label: 'Study Resources', icon: BookOpen },
    { path: '/app/profile', label: 'My Profile', icon: User },
  ];

  const handleNavClick = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    setNotifDropdownOpen(false);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogout = () => {
    setProfileDropdownOpen(false);
    logout();
    navigate('/', { replace: true });
  };

  const getBreadcrumbTitle = () => {
    const matched = navigationItems.find(item =>
      item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path) && item.path !== '/app'
    );
    if (location.pathname === '/app') return 'Home Dashboard';
    return matched ? matched.label : 'Dashboard';
  };

  const isNavActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="app-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar */}
      <aside className={`app-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-icon" onClick={() => handleNavClick('/app')} style={{ cursor: 'pointer' }}>
            <Zap size={16} />
          </div>
          <div onClick={() => handleNavClick('/app')} style={{ cursor: 'pointer' }}>
            <div className="logo-title">Vynora Connect</div>
            <div className="logo-tagline">CONNECT STUDENTS BEYOND CAMPUS</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-title">Navigation</div>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isNavActive(item);
            return (
              <button
                key={item.path}
                type="button"
                className={`nav-item ${active ? 'active' : ''}`}
                onClick={() => handleNavClick(item.path)}
                id={`sidebar-nav-${item.path.replace('/app/', '').replace('/app', 'dashboard')}`}
              >
                <Icon size={18} />
                <span className="nav-label">{item.label}</span>
                {item.badge && (
                  <span className="nav-badge-count">{item.badge}</span>
                )}
              </button>
            );
          })}

          <div className="nav-section-title" style={{ marginTop: '16px' }}>
            Preferences & Support
          </div>

          <button
            type="button"
            className={`nav-item ${location.pathname === '/app/settings' ? 'active' : ''}`}
            onClick={() => handleNavClick('/app/settings')}
            id="sidebar-nav-settings"
          >
            <Settings size={18} />
            <span className="nav-label">Settings</span>
          </button>

          <button
            type="button"
            className="nav-item"
            onClick={() => showToast('Help & Support coming soon!')}
            id="sidebar-nav-support"
          >
            <HelpCircle size={18} />
            <span className="nav-label">Help & Support</span>
          </button>

          <button
            type="button"
            className="nav-item nav-logout"
            onClick={handleLogout}
            id="sidebar-nav-logout"
          >
            <LogOut size={18} />
            <span className="nav-label">Logout</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div
            className="user-snippet"
            onClick={() => handleNavClick('/app/profile')}
            style={{ cursor: 'pointer' }}
          >
            {user?.profileImage || user?.avatar ? (
              <img src={user.profileImage || user.avatar} className="avatar" alt={displayName} style={{ objectFit: 'cover' }} />
            ) : (
              <div className="avatar">{initials}</div>
            )}
            <div className="user-info">
              <span className="user-name">{displayName}</span>
              <span className="user-role">{college} &bull; {branch}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main App Container */}
      <div className="app-main">
        {/* Top Navigation Bar */}
        <header className="app-topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <div className="topbar-breadcrumbs">
              <span onClick={() => handleNavClick('/app')} style={{ cursor: 'pointer' }}>
                Vynora Connect
              </span>
              <span>/</span>
              <span className="breadcrumb-active">{getBreadcrumbTitle()}</span>
            </div>

            {/* Quick Search Entry */}
            <div className="topbar-search-wrapper">
              <Search size={15} className="search-icon" />
              <input
                type="text"
                className="topbar-search-input"
                placeholder="Search students, skills, hackathons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    showToast(`Searching for "${searchQuery}"...`);
                  }
                }}
                id="topbar-search"
              />
            </div>
          </div>

          <div className="topbar-right">
            {/* Notifications Button & Dropdown */}
            <div className="topbar-popover-anchor">
              <button
                type="button"
                className={`topbar-icon-btn ${notifDropdownOpen ? 'active' : ''}`}
                onClick={() => {
                  setNotifDropdownOpen(!notifDropdownOpen);
                  setProfileDropdownOpen(false);
                }}
                aria-label="Notifications"
                id="topbar-notif-btn"
              >
                <Bell size={18} />
                <span className="icon-badge">2</span>
              </button>

              {notifDropdownOpen && (
                <div className="notifications-dropdown">
                  <div className="dropdown-header">
                    <span>Recent Notifications</span>
                    <button
                      type="button"
                      className="link-text-btn"
                      onClick={() => showToast('All notifications marked as read')}
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="dropdown-list">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`dropdown-item ${n.unread ? 'unread' : ''}`}
                        onClick={() => {
                          setNotifDropdownOpen(false);
                          showToast(n.title);
                        }}
                      >
                        <div className="dropdown-item-title">{n.title}</div>
                        <div className="dropdown-item-time">{n.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Direct Messages Icon */}
            <button
              type="button"
              className="topbar-icon-btn"
              onClick={() => handleNavClick('/app/messages')}
              title="Messages"
              aria-label="Messages"
              id="topbar-messages-btn"
            >
              <MessageSquare size={18} />
              <span className="icon-badge">5</span>
            </button>

            {/* User Profile Avatar & Dropdown */}
            <div className="topbar-popover-anchor">
              <button
                type="button"
                className="user-profile-btn"
                onClick={() => {
                  setProfileDropdownOpen(!profileDropdownOpen);
                  setNotifDropdownOpen(false);
                }}
                aria-label="User profile menu"
                id="topbar-user-menu-btn"
              >
                {user?.profileImage || user?.avatar ? (
                  <img src={user.profileImage || user.avatar} className="avatar-small" alt={firstName} style={{ objectFit: 'cover', borderRadius: '50%' }} />
                ) : (
                  <div className="avatar-small">{initials}</div>
                )}
                <span className="profile-btn-name">{firstName}</span>
                <ChevronDown size={14} />
              </button>

              {profileDropdownOpen && (
                <div className="profile-dropdown-menu">
                  <div className="profile-menu-header">
                    <div className="profile-menu-name">{displayName}</div>
                    <div className="profile-menu-sub">{college} &bull; {branch}</div>
                  </div>
                  <div className="profile-menu-divider" />
                  <button
                    type="button"
                    className="profile-menu-item"
                    onClick={() => handleNavClick('/app/profile')}
                  >
                    <User size={15} />
                    <span>My Profile</span>
                  </button>
                  <button
                    type="button"
                    className="profile-menu-item"
                    onClick={() => handleNavClick('/app')}
                  >
                    <Compass size={15} />
                    <span>Home Dashboard</span>
                  </button>
                  <button
                    type="button"
                    className="profile-menu-item"
                    onClick={() => handleNavClick('/app/settings')}
                  >
                    <Settings size={15} />
                    <span>Settings & Privacy</span>
                  </button>
                  <div className="profile-menu-divider" />
                  <button
                    type="button"
                    className="profile-menu-item text-danger"
                    onClick={handleLogout}
                  >
                    <LogOut size={15} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content View — rendered via React Router Outlet */}
        <main className="page-container">
          <Outlet />
        </main>
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
