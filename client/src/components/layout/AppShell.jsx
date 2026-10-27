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
    { id: 'network', label: '2. Campus Network', icon: Users, disabled: true },
    { id: 'teams', label: '3. Teams & Projects', icon: Layers, disabled: true },
    { id: 'chat', label: '4. Communication', icon: MessageSquare, disabled: true },
    {
      id: 'resources-module',
      label: '5. Resources & Opportunities',
      icon: BookOpen,
      active: true,
      tag: 'Deepu (Active)',
    },
    { id: 'campus', label: '6. Campus & Events', icon: GraduationCap, disabled: true },
    { id: 'marketplace', label: '7. Freelancing Market', icon: Store, disabled: true },
    { id: 'admin', label: '8. Trust & Moderation', icon: Shield, disabled: true },
  ];

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className={`app-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-icon">V</div>
          <div>
            <div className="logo-title">Vynora Connect</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Inter-College Network</div>
          </div>
          <span className="logo-badge">Week 1</span>
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
                title={item.disabled ? 'Coming in Week 2 / Owned by teammates' : 'Resources & Opportunities Module'}
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
            Module Views
          </div>
          <button
            type="button"
            className={`nav-item ${activeTab === 'resources' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('resources');
              setMobileMenuOpen(false);
            }}
            id="nav-tab-resources"
          >
            <BookOpen size={16} />
            <span>Study Resources</span>
          </button>
          <button
            type="button"
            className={`nav-item ${activeTab === 'opportunities' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('opportunities');
              setMobileMenuOpen(false);
            }}
            id="nav-tab-opportunities"
          >
            <Briefcase size={16} />
            <span>Opportunities</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-snippet">
            <div className="avatar">D</div>
            <div className="user-info">
              <span className="user-name">Deepu (Owner)</span>
              <span className="user-role">Resources &amp; Opportunities</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Container */}
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
                {activeTab === 'resources' ? 'Resources Discovery' : 'Opportunities Discovery'}
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
              <span>{isLiveBackend ? 'Live Backend API' : 'Dev Adapter (Mock)'}</span>
            </div>

            {/* Quick module view switch */}
            <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-elevated)', padding: '3px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
              <button
                type="button"
                className={`btn btn-sm ${activeTab === 'resources' ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '4px 12px', fontSize: '0.78rem', border: 'none' }}
                onClick={() => setActiveTab('resources')}
                id="topbar-switch-resources"
              >
                Resources
              </button>
              <button
                type="button"
                className={`btn btn-sm ${activeTab === 'opportunities' ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '4px 12px', fontSize: '0.78rem', border: 'none' }}
                onClick={() => setActiveTab('opportunities')}
                id="topbar-switch-opps"
              >
                Opportunities
              </button>
            </div>
          </div>
        </header>

        {/* Content View */}
        <main className="page-container">{children}</main>
      </div>
    </div>
  );
}
