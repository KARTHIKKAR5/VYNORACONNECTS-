import React from 'react';

export function Home({ onNavigate }) {
  return (
    <div className="home-container">
      {/* Welcome Banner */}
      <div className="welcome-section">
        <span className="welcome-tagline">Vynora Connect • Day 1 Sprint</span>
        <h1 className="welcome-title">Student Portfolio & Owner Permissions</h1>
        <p className="welcome-subtitle">
          Welcome to Surya's Day 1 implementation module. Explore the verified Student Portfolio showcase and the Role-Based Access Control (RBAC) Owner Permissions foundation below.
        </p>
      </div>

      {/* Quick Action Feature Cards */}
      <div className="quick-actions-section">
        <div className="section-header">
          <div className="section-title-wrap">
            <h3 className="section-main-heading">Assigned Modules</h3>
            <span className="section-badge">Sprint 1</span>
          </div>
          <span className="section-tagline">Click to launch active module</span>
        </div>

        <div className="module-feature-cards-grid">
          {/* Card 1: Student Portfolio */}
          <div className="feature-launch-card" onClick={() => onNavigate('portfolio')}>
            <div className="feature-card-badge">Module 1</div>
            <div className="feature-card-icon">👤</div>
            <h4 className="feature-card-title">Student Portfolio</h4>
            <p className="feature-card-desc">
              Comprehensive student profile showcasing institutional verification, external coding accounts (GitHub, LinkedIn, LeetCode), categorized skills, featured projects, and achievements with an interactive edit form.
            </p>
            <div className="feature-card-footer">
              <span className="launch-text">Launch Portfolio</span>
              <span className="launch-arrow">→</span>
            </div>
          </div>

          {/* Card 2: Owner Permissions */}
          <div className="feature-launch-card" onClick={() => onNavigate('permissions')}>
            <div className="feature-card-badge">Module 2</div>
            <div className="feature-card-icon">🛡️</div>
            <h4 className="feature-card-title">Owner Permissions & RBAC</h4>
            <p className="feature-card-desc">
              Complete permissions utility supporting OWNER, ADMIN, MEMBER, and VIEWER roles, permission gate enforcement, and an interactive role simulation panel with project ownership controls.
            </p>
            <div className="feature-card-footer">
              <span className="launch-text">Launch Permissions Panel</span>
              <span className="launch-arrow">→</span>
            </div>
          </div>
        </div>
      </div>

      {/* Architecture & Highlights Card */}
      <div className="card sprint-highlights-card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Day 1 Architecture Highlights</h3>
            <p className="card-subtitle">Engineered for clean modularity and collaborative Git integration</p>
          </div>
          <span className="badge badge-accent">Developer: Surya</span>
        </div>

        <div className="highlights-grid">
          <div className="highlight-item">
            <div className="highlight-icon">🔒</div>
            <div className="highlight-text-block">
              <h5>Strict Denial-by-Default</h5>
              <p>Unknown roles, unknown actions, and empty inputs are strictly denied by <code>canPerformAction()</code>.</p>
            </div>
          </div>

          <div className="highlight-item">
            <div className="highlight-icon">🛡️</div>
            <div className="highlight-text-block">
              <h5>PermissionGate Component</h5>
              <p>Declarative UI guarding for buttons, actions, and sections based on active user privileges.</p>
            </div>
          </div>

          <div className="highlight-item">
            <div className="highlight-icon">💾</div>
            <div className="highlight-text-block">
              <h5>Persistence & Validation</h5>
              <p>Portfolio edits validate required fields and URL schemas, persisting locally with seamless fallback.</p>
            </div>
          </div>

          <div className="highlight-item">
            <div className="highlight-icon">🎨</div>
            <div className="highlight-text-block">
              <h5>Responsive Dark Theme</h5>
              <p>Engineered using Vynora standard CSS tokens, Plus Jakarta Sans typography, and fluid mobile/desktop layouts.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
