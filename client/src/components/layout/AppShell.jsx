import React, { useState } from 'react';
import {
  BookOpen,
  Briefcase,
  Compass,
  Users,
  MessageSquare,
  GraduationCap,
  Store,
  Shield,
  Menu,
  X,
  Server,
  Layers,
} from 'lucide-react';

export function AppShell({
  activeTab,
  setActiveTab,
  isLiveBackend,
  children,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { id: 'dashboard', label: '1. Dashboard & Pulse', icon: Compass, disabled: true, tag: 'Karthik' },
    { id: 'network', label: '2. Campus Network', icon: Users, disabled: true, tag: 'Ram' },
    { id: 'teams', label: '3. Teams & Projects', icon: Layers, disabled: true, tag: 'Varshitha' },
    { id: 'chat', label: '4. Communication', icon: MessageSquare, disabled: true, tag: 'Siri' },
    {
      id: 'resources-module',
      label: '5. Resources & Opportunities',
      icon: BookOpen,
      active: true,
      tag: 'Deepu (Active)',
    },
    { id: 'campus', label: '6. Campus & Events', icon: GraduationCap, disabled: true, tag: 'Sindhu' },
    { id: 'marketplace', label: '7. Freelancing Market', icon: Store, disabled: true, tag: 'Surya' },
    { id: 'admin', label: '8. Trust & Moderation', icon: Shield, disabled: true, tag: 'Revanth' },
  ];

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className={`app-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-icon">V</div>
          <div>
            <div className="logo-title">Vynora Connect</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Inter-College Platform</div>
          </div>
          <span className="logo-badge">Module 5</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-title">Core Modules</div>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isCurrentModule = item.id === 'resources-module';
            return (
              <button
                key={item.id}
                type="button"
                className={`nav-item ${isCurrentModule ? 'active' : ''}`}
                style={{ opacity: item.disabled ? 0.6 : 1, cursor: item.disabled ? 'not-allowed' : 'pointer' }}
                onClick={() => {
                  if (!item.disabled) {
                    setMobileMenuOpen(false);
                  }
                }}
                title={item.disabled ? 'Teammate Feature Branch' : 'Active Module: Deepu'}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {item.tag && (
                  <span
                    className="nav-counter"
                    style={{
                      backgroundColor: isCurrentModule ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-card)',
                      color: isCurrentModule ? 'var(--accent-primary)' : 'var(--text-muted)',
                      border: isCurrentModule ? '1px solid var(--accent-primary)' : undefined,
                      fontSize: '0.68rem',
                    }}
                  >
                    {item.tag}
                  </span>
                )}
              </button>
            );
          })}

          <div className="nav-section-title" style={{ marginTop: '16px' }}>
            Module 5 Navigation
          </div>
          <button
            type="button"
            className={`nav-item ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('all');
              setMobileMenuOpen(false);
            }}
            id="nav-tab-all"
          >
            <BookOpen size={16} />
            <span>Opportunities &amp; Resources</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-snippet">
            <div className="avatar">D</div>
            <div className="user-info">
              <span className="user-name">Deepu (Module Owner)</span>
              <span className="user-role">Resources &amp; Opportunities</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main App Container */}
      <div className="app-main">
        {/* Topbar */}
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
              <span>Vynora Connect</span>
              <span>/</span>
              <span>Module 5</span>
              <span>/</span>
              <span className="breadcrumb-active">
                Resources &amp; Opportunities Hub
              </span>
            </div>
          </div>

          <div className="topbar-right">
            <div
              className="api-status-pill"
              title={
                isLiveBackend
                  ? 'Connected to live Express backend (/api/v1)'
                  : 'Backend server is currently offline; using isolated Development Mock Adapter'
              }
            >
              <span className={`status-dot ${isLiveBackend ? 'active' : 'mock'}`} />
              <Server size={13} style={{ color: 'var(--text-muted)' }} />
              <span>{isLiveBackend ? 'Live MongoDB API' : 'Dev Adapter (Mock)'}</span>
            </div>
          </div>
        </header>

        {/* Content View */}
        <main className="page-container">{children}</main>
      </div>
    </div>
  );
}
export default AppShell;

