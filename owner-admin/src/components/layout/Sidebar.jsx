import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  Building2,
  UserCheck,
  KeyRound,
  Users,
  Flag,
  LifeBuoy,
  History,
  Settings,
  Shield,
  Radio,
} from 'lucide-react';

export function Sidebar({ collapsed, mobileOpen, onCloseMobile, counts = {} }) {
  const navItems = [
    {
      to: '/',
      label: 'Overview',
      icon: LayoutDashboard,
      badge: null,
      section: 'Dashboard',
    },
    {
      to: '/colleges',
      label: 'College Verification',
      icon: GraduationCap,
      badge: counts.pendingColleges > 0 ? counts.pendingColleges : null,
      section: 'Verifications',
    },
    {
      to: '/clubs',
      label: 'Club Verification',
      icon: Building2,
      badge: counts.pendingClubs > 0 ? counts.pendingClubs : null,
      section: 'Verifications',
    },
    {
      to: '/club-admin-applications',
      label: 'Club Admin Applications',
      icon: UserCheck,
      badge: counts.pendingApplications > 0 ? counts.pendingApplications : null,
      section: 'Privileges',
    },
    {
      to: '/club-admin-assignments',
      label: 'Club Admin Assignments',
      icon: KeyRound,
      badge: null,
      section: 'Privileges',
    },
    {
      to: '/users',
      label: 'User Management',
      icon: Users,
      badge: null,
      section: 'Access & Governance',
    },
    {
      to: '/moderation',
      label: 'Reports & Moderation',
      icon: Flag,
      badge: counts.openReports > 0 ? counts.openReports : null,
      section: 'Access & Governance',
    },
    {
      to: '/support',
      label: 'Support Tickets',
      icon: LifeBuoy,
      badge: counts.openTickets > 0 ? counts.openTickets : null,
      section: 'Access & Governance',
    },
    {
      to: '/audit-logs',
      label: 'Audit Logs',
      icon: History,
      badge: null,
      section: 'Platform Operations',
    },
    {
      to: '/settings',
      label: 'Platform Settings',
      icon: Settings,
      badge: null,
      section: 'Platform Operations',
    },
  ];

  // Group items by section
  let currentSection = '';

  return (
    <>
      {mobileOpen && (
        <div
          className="modal-backdrop"
          style={{ zIndex: 35, backdropFilter: 'none' }}
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-header">
          <div className="brand-logo-icon">
            <Shield size={20} />
          </div>
          {!collapsed && (
            <div className="brand-title">
              <span className="brand-name">VYNORA CONNECT</span>
              <span className="brand-tag">Owner Admin Console</span>
            </div>
          )}
        </div>

        {/* Navigation list */}
        <nav className="sidebar-nav">
          {navItems.map((item, idx) => {
            const showSection = !collapsed && item.section !== currentSection;
            if (showSection) currentSection = item.section;

            return (
              <React.Fragment key={item.to}>
                {showSection && (
                  <div className="sidebar-section-label">{item.section}</div>
                )}
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                  onClick={onCloseMobile}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className="nav-item-icon" />
                  {!collapsed && <span className="nav-item-text">{item.label}</span>}
                  {!collapsed && item.badge !== null && (
                    <span className="nav-item-counter">{item.badge}</span>
                  )}
                </NavLink>
              </React.Fragment>
            );
          })}
        </nav>

        {/* Footer Status */}
        {!collapsed && (
          <div className="sidebar-footer">
            <div className="system-status-indicator">
              <span className="status-dot" />
              <span>Platform Staging: Live</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

export default Sidebar;
