import React from 'react';

export function Sidebar({ activeTab, onSelectTab, isOpen, onClose }) {
  const primaryLinks = [
    { id: 'home', label: 'HOME', icon: '🏠', badge: null },
    { id: 'marketplace', label: 'MARKETPLACE', icon: '🛒', badge: 'Day 2' },
    { id: 'portfolio', label: 'PORTFOLIO', icon: '👤', badge: 'Day 1' },
    { id: 'permissions', label: 'PERMISSIONS', icon: '🛡️', badge: 'RBAC' },
    { id: 'network', label: 'NETWORK', icon: '🌐', badge: null },
    { id: 'resources', label: 'RESOURCES', icon: '📚', badge: null },
    { id: 'teams', label: 'TEAMS & PROJECTS', icon: '👥', badge: null }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && <div className="sidebar-mobile-backdrop" onClick={onClose}></div>}

      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-group">
          <div className="sidebar-group-title">MAIN NAVIGATION</div>
          <ul className="sidebar-links">
            {primaryLinks.map((link) => (
              <li
                key={link.id}
                className={`sidebar-item ${activeTab === link.id ? 'active' : ''}`}
                onClick={() => {
                  onSelectTab(link.id);
                  if (onClose) onClose();
                }}
              >
                <span className="sidebar-icon">{link.icon}</span>
                <span className="sidebar-text">{link.label}</span>
                {link.badge && <span className="sidebar-item-badge">{link.badge}</span>}
              </li>
            ))}
          </ul>
        </div>

        <div className="sidebar-group sidebar-bottom">
          <div className="sidebar-group-title">SURYA'S WORKSPACE</div>
          <div className="sidebar-dev-box">
            <div className="dev-box-title">Active Modules</div>
            <div className="dev-box-item">✓ Marketplace & Inquiries</div>
            <div className="dev-box-item">✓ Student Portfolio</div>
            <div className="dev-box-item">✓ Owner Permissions</div>
            <div className="dev-branch-tag">feature/surya-portfolio...</div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
