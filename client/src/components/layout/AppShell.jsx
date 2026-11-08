import React, { useState } from 'react';
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
  Server,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';

export function AppShell({
  activeTab,
  setActiveTab,
  isLiveBackend,
  children,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const notifications = [
    {
      id: 'n-1',
      title: 'Priya Sharma accepted your request',
      time: '25m ago',
      unread: true,
    },
    {
      id: 'n-2',
      title: 'HackVynora 2026 announced registration',
      time: '1h ago',
      unread: true,
    },
    {
      id: 'n-3',
      title: 'Varshitha invited you to Autonomous Drone project',
      time: '3h ago',
      unread: false,
    },
  ];

  const navigationItems = [
    { id: 'dashboard', label: 'Home Dashboard', icon: Compass, tag: 'Karthik' },
    { id: 'network', label: 'Network', icon: Users, tag: 'Ram' },
    { id: 'opportunities', label: 'Opportunities', icon: Briefcase, tag: 'Deepu' },
    { id: 'teams', label: 'Projects & Teams', icon: Layers, tag: 'Varsh' },
    { id: 'events', label: 'Clubs & Events', icon: GraduationCap, tag: 'Sindhu' },
    { id: 'messages', label: 'Messages', icon: MessageSquare, tag: 'Siri', unreadCount: 5 },
    { id: 'mentorship', label: 'Mentorship', icon: Sparkles, tag: 'Surya' },
    { id: 'resources', label: 'Resources', icon: BookOpen, tag: 'Deepu' },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    setNotifDropdownOpen(false);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const getBreadcrumbTitle = () => {
    const item = navigationItems.find((n) => n.id === activeTab);
    if (item) return item.label;
    if (activeTab === 'settings') return 'Settings';
    if (activeTab === 'support') return 'Help & Support';
    return 'Dashboard';
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
          <div className="logo-icon" onClick={() => handleNavClick('dashboard')} style={{ cursor: 'pointer' }}>
            V
          </div>
          <div onClick={() => handleNavClick('dashboard')} style={{ cursor: 'pointer' }}>
            <div className="logo-title">Vynora Connect</div>
            <div className="logo-tagline">CONNECT STUDENTS BEYOND CAMPUS</div>
          </div>
          <span className="logo-badge">Live</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-title">Navigation</div>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
                id={`sidebar-nav-${item.id}`}
              >
                <Icon size={18} />
                <span className="nav-label">{item.label}</span>
                {item.unreadCount && (
                  <span className="nav-badge-count">{item.unreadCount}</span>
                )}
                {item.tag && !item.unreadCount && (
                  <span
                    className="nav-counter"
                    style={{
                      backgroundColor: isActive ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-card)',
                      color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                      border: isActive ? '1px solid var(--accent-primary)' : undefined,
                    }}
                  >
                    {item.tag}
                  </span>
                )}
              </button>
            );
          })}

          <div className="nav-section-title" style={{ marginTop: '16px' }}>
            Preferences & Support
          </div>

          <button
            type="button"
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => handleNavClick('settings')}
            id="sidebar-nav-settings"
          >
            <Settings size={18} />
            <span className="nav-label">Settings</span>
          </button>

          <button
            type="button"
            className={`nav-item ${activeTab === 'support' ? 'active' : ''}`}
            onClick={() => handleNavClick('support')}
            id="sidebar-nav-support"
          >
            <HelpCircle size={18} />
            <span className="nav-label">Help & Support</span>
          </button>

          <button
            type="button"
            className="nav-item nav-logout"
            onClick={() => showToast('Session locked. Demo session active as Karthik.')}
            id="sidebar-nav-logout"
          >
            <LogOut size={18} />
            <span className="nav-label">Logout</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div
            className="user-snippet"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            style={{ cursor: 'pointer' }}
          >
            <div className="avatar">K</div>
            <div className="user-info">
              <span className="user-name">Karthik (Owner)</span>
              <span className="user-role">Home Dashboard & Pulse</span>
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
              <span onClick={() => handleNavClick('dashboard')} style={{ cursor: 'pointer' }}>
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
                    showToast(`Searching for "${searchQuery}" across campus network...`);
                  }
                }}
                id="topbar-search"
              />
            </div>
          </div>

          <div className="topbar-right">
            {/* Live Backend Indicator */}
            <div
              className="api-status-pill"
              title={
                isLiveBackend
                  ? 'Connected to live Express backend (/api/v1)'
                  : 'Running with Dev Mock Adapter (Express server offline)'
              }
            >
              <span className={`status-dot ${isLiveBackend ? 'active' : 'mock'}`} />
              <Server size={13} style={{ color: 'var(--text-muted)' }} />
              <span>{isLiveBackend ? 'Live Backend API' : 'Dev Adapter (Mock)'}</span>
            </div>

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
              onClick={() => handleNavClick('messages')}
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
                <div className="avatar-small">K</div>
                <span className="profile-btn-name">Karthik</span>
                <ChevronDown size={14} />
              </button>

              {profileDropdownOpen && (
                <div className="profile-dropdown-menu">
                  <div className="profile-menu-header">
                    <div className="profile-menu-name">Karthik</div>
                    <div className="profile-menu-sub">SR University • Computer Science</div>
                  </div>
                  <div className="profile-menu-divider" />
                  <button
                    type="button"
                    className="profile-menu-item"
                    onClick={() => handleNavClick('profile')}
                  >
                    <User size={15} />
                    <span>My Profile</span>
                  </button>
                  <button
                    type="button"
                    className="profile-menu-item"
                    onClick={() => handleNavClick('dashboard')}
                  >
                    <Compass size={15} />
                    <span>Home Dashboard</span>
                  </button>
                  <button
                    type="button"
                    className="profile-menu-item"
                    onClick={() => handleNavClick('settings')}
                  >
                    <Settings size={15} />
                    <span>Settings &amp; Privacy</span>
                  </button>
                  <div className="profile-menu-divider" />
                  <button
                    type="button"
                    className="profile-menu-item text-danger"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      showToast('Demonstration session active.');
                    }}
                  >
                    <LogOut size={15} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content View */}
        <main className="page-container">{children}</main>
      </div>
    </div>
  );
}
