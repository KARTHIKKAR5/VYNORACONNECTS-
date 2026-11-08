import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  Search,
  ShieldAlert,
  ChevronDown,
  LogOut,
  Settings,
  History,
  LifeBuoy,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

const ROUTE_TITLES = {
  '/': 'Platform Overview',
  '/colleges': 'College Verification',
  '/clubs': 'Club Verification',
  '/club-admin-applications': 'Club Admin Applications',
  '/club-admin-assignments': 'Club Admin Assignments',
  '/users': 'User Management & Governance',
  '/moderation': 'Reports & Content Moderation',
  '/support': 'Support Tickets Helpdesk',
  '/audit-logs': 'Immutable Audit Logs',
  '/settings': 'Platform & Moderation Settings',
};

export function Topbar({ onToggleSidebar, counts = {} }) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentTitle = ROUTE_TITLES[location.pathname] || 'Administration';

  const [searchVal, setSearchVal] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGlobalSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      // Direct user to user management or relevant search view
      navigate(`/users?search=${encodeURIComponent(searchVal.trim())}`);
      setSearchVal('');
    }
  };

  const totalUrgent = (counts.openReports || 0) + (counts.pendingColleges || 0) + (counts.openTickets || 0);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="sidebar-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation sidebar"
        >
          <Menu size={20} />
        </button>

        <div className="page-breadcrumb">
          <span>Vynora Campus</span>
          <span>/</span>
          <h1 className="page-breadcrumb-active">{currentTitle}</h1>
        </div>
      </div>

      <div className="topbar-search">
        <form onSubmit={handleGlobalSearch}>
          <Search size={16} className="topbar-search-icon" />
          <input
            type="text"
            className="topbar-search-input"
            placeholder="Search students, colleges, clubs..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
          />
        </form>
      </div>

      <div className="topbar-right">
        {/* Notifications Dropdown */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            type="button"
            className="topbar-action-btn"
            onClick={() => setNotifOpen(!notifOpen)}
            aria-label="View system alerts"
          >
            <Bell size={18} />
            {totalUrgent > 0 && <span className="notification-dot" />}
          </button>

          {notifOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: 320,
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 60,
                overflow: 'hidden',
              }}
            >
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>Pending Owner Actions</span>
                <span className="badge badge-danger">{totalUrgent} Urgent</span>
              </div>
              <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                <Link
                  to="/colleges"
                  onClick={() => setNotifOpen(false)}
                  style={{ display: 'flex', gap: 10, padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', textDecoration: 'none', color: 'inherit' }}
                >
                  <AlertTriangle size={16} color="var(--color-warning)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{counts.pendingColleges || 3} College Verifications Pending</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Require statutory accreditation reviews</div>
                  </div>
                </Link>

                <Link
                  to="/moderation"
                  onClick={() => setNotifOpen(false)}
                  style={{ display: 'flex', gap: 10, padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', textDecoration: 'none', color: 'inherit' }}
                >
                  <ShieldAlert size={16} color="var(--color-danger)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{counts.openReports || 5} Unresolved Moderation Reports</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Active spam and harassment flags</div>
                  </div>
                </Link>

                <Link
                  to="/support"
                  onClick={() => setNotifOpen(false)}
                  style={{ display: 'flex', gap: 10, padding: '12px 16px', textDecoration: 'none', color: 'inherit' }}
                >
                  <LifeBuoy size={16} color="var(--color-info)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{counts.openTickets || 4} Open Support Tickets</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Awaiting administration feedback</div>
                  </div>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile Pill */}
        <div style={{ position: 'relative' }} ref={profileRef}>
          <div
            className="owner-profile-pill"
            onClick={() => setProfileOpen(!profileOpen)}
            role="button"
            tabIndex={0}
          >
            <div className="avatar-badge">PO</div>
            <div className="owner-meta">
              <span className="owner-name">Revanth</span>
              <span className="owner-role">Platform Owner</span>
            </div>
            <ChevronDown size={14} color="var(--text-muted)" />
          </div>

          {profileOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: 220,
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 60,
                overflow: 'hidden',
                padding: '6px',
              }}
            >
              <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-subtle)', marginBottom: 4 }}>
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Revanth (Owner)</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>owner@vynora.campus</div>
              </div>

              <Link
                to="/settings"
                onClick={() => setProfileOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 6, fontSize: '0.82rem', color: 'var(--text-primary)', textDecoration: 'none' }}
              >
                <Settings size={15} /> Platform Settings
              </Link>

              <Link
                to="/audit-logs"
                onClick={() => setProfileOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 6, fontSize: '0.82rem', color: 'var(--text-primary)', textDecoration: 'none' }}
              >
                <History size={15} /> Security Audit Logs
              </Link>

              <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '4px 0' }} />

              <div
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 6, fontSize: '0.82rem', color: 'var(--text-muted)', cursor: 'default' }}
              >
                <CheckCircle2 size={15} color="var(--color-success)" /> Role: Platform Owner
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Topbar;
