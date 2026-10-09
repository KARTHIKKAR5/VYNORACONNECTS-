import React from 'react';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h1>VYNORA CONNECT</h1>
      </div>
      <div className="nav-actions">
        <button className="nav-icon-btn" aria-label="Search" title="Search">
          <span className="icon">🔍</span>
        </button>
        <button className="nav-icon-btn" aria-label="Profile" title="Profile">
          <span className="icon">👤</span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
