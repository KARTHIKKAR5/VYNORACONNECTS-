import React from 'react';

export function Navbar({ activeTab, onSelectTab, onToggleMobileSidebar }) {
  return (
    <nav className="navbar">
      <div className="nav-left-section">
        <button
          className="mobile-menu-toggle"
          onClick={onToggleMobileSidebar}
          aria-label="Toggle navigation menu"
        >
          ☰
        </button>

        <div className="nav-brand" onClick={() => onSelectTab('home')} style={{ cursor: 'pointer' }}>
          <div className="brand-logo-icon">V+</div>
          <div className="brand-text-block">
            <h1 className="brand-title">VYNORA CONNECT</h1>
            <span className="brand-tagline">Campus Collaboration</span>
          </div>
        </div>
      </div>

      <div className="nav-center-tabs">
        <button
          className={`nav-tab-link ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => onSelectTab('home')}
        >
          <span>🏠</span> Home
        </button>
        <button
          className={`nav-tab-link ${activeTab === 'marketplace' ? 'active' : ''}`}
          onClick={() => onSelectTab('marketplace')}
        >
          <span>🛒</span> Marketplace
        </button>
        <button
          className={`nav-tab-link ${activeTab === 'portfolio' ? 'active' : ''}`}
          onClick={() => onSelectTab('portfolio')}
        >
          <span>👤</span> Portfolio
        </button>
        <button
          className={`nav-tab-link ${activeTab === 'permissions' ? 'active' : ''}`}
          onClick={() => onSelectTab('permissions')}
        >
          <span>🛡️</span> Permissions
        </button>
      </div>

      <div className="nav-actions">
        <div className="nav-user-preview" onClick={() => onSelectTab('portfolio')} style={{ cursor: 'pointer' }}>
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
            alt="Surya Prakash"
            className="nav-avatar"
          />
          <div className="nav-user-text">
            <span className="nav-user-name">Surya Prakash</span>
            <span className="nav-user-role">Student Provider</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
