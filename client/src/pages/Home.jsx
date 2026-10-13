import React from 'react';

export function Home({ onNavigate }) {
  return (
    <div className="home-container">
      {/* Welcome Banner */}
      <div className="welcome-section">
        <span className="welcome-tagline">Vynora Connect • Day 2 Architecture</span>
        <h1 className="welcome-title">Campus Marketplace & System Design</h1>
        <p className="welcome-subtitle">
          Welcome to Surya's workspace. Explore the verified Student Portfolio, Role-Based Access Control (RBAC), and the new Day 2 Peer Service Marketplace and Inquiry contracts below.
        </p>
      </div>

      {/* Quick Action Feature Cards */}
      <div className="quick-actions-section">
        <div className="section-header">
          <div className="section-title-wrap">
            <h3 className="section-main-heading">Active Modules</h3>
            <span className="section-badge">Sprint 2</span>
          </div>
          <span className="section-tagline">Click card to launch active module</span>
        </div>

        <div className="module-feature-cards-grid">
          {/* Card 1: Marketplace (Day 2 Deliverable) */}
          <div className="feature-launch-card" onClick={() => onNavigate('marketplace')}>
            <div className="feature-card-badge">Day 2 • Marketplace</div>
            <div className="feature-card-icon">🛒</div>
            <h4 className="feature-card-title">Campus Service Marketplace</h4>
            <p className="feature-card-desc">
              Peer freelance catalog with ServiceListing and Inquiry contracts, search and category filtering, inquiry workflows, provider management, and a premium black-and-white interface.
            </p>
            <div className="feature-card-footer">
              <span className="launch-text">Launch Marketplace</span>
              <span className="launch-arrow">→</span>
            </div>
          </div>

          {/* Card 2: Student Portfolio (Day 1 Deliverable) */}
          <div className="feature-launch-card" onClick={() => onNavigate('portfolio')}>
            <div className="feature-card-badge">Day 1 • Portfolio</div>
            <div className="feature-card-icon">👤</div>
            <h4 className="feature-card-title">Student Portfolio</h4>
            <p className="feature-card-desc">
              Comprehensive student profile showcasing institutional verification, external coding accounts (GitHub, LinkedIn, LeetCode), categorized skills, featured projects, and achievements.
            </p>
            <div className="feature-card-footer">
              <span className="launch-text">Launch Portfolio</span>
              <span className="launch-arrow">→</span>
            </div>
          </div>

          {/* Card 3: Owner Permissions & RBAC */}
          <div className="feature-launch-card" onClick={() => onNavigate('permissions')}>
            <div className="feature-card-badge">Day 1 & 2 • Security</div>
            <div className="feature-card-icon">🛡️</div>
            <h4 className="feature-card-title">Owner Permissions & ABAC</h4>
            <p className="feature-card-desc">
              Comprehensive authorization rules supporting OWNER, ADMIN, MEMBER, and VIEWER roles, resource-level ownership evaluation, self-inquiry prevention, and permission gates.
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
            <h3 className="card-title">Day 2 System Design Deliverables</h3>
            <p className="card-subtitle">Formalized API contracts and documented architecture in <code>docs/</code></p>
          </div>
          <span className="badge badge-accent">Developer: Surya</span>
        </div>

        <div className="highlights-grid">
          <div className="highlight-item">
            <div className="highlight-icon">📄</div>
            <div className="highlight-text-block">
              <h5>Data Schemas & Contracts</h5>
              <p>Mongoose-compatible <code>ServiceListing</code> and <code>Inquiry</code> models specified in <code>docs/marketplace-spec.md</code>.</p>
            </div>
          </div>

          <div className="highlight-item">
            <div className="highlight-icon">🔌</div>
            <div className="highlight-text-block">
              <h5>13 RESTful API Endpoints</h5>
              <p>Full HTTP contracts under <code>/api/v1/marketplace</code> with standard status codes and JSON error format.</p>
            </div>
          </div>

          <div className="highlight-item">
            <div className="highlight-icon">🏛️</div>
            <div className="highlight-text-block">
              <h5>Architecture Decisions</h5>
              <p>13 Architecture Decision Records (ADRs) recorded and status-tracked in <code>docs/decisions.md</code>.</p>
            </div>
          </div>

          <div className="highlight-item">
            <div className="highlight-icon">🎨</div>
            <div className="highlight-text-block">
              <h5>Monochrome Design System</h5>
              <p>Minimalist black-and-white UI prototype with client-side search, filters, modals, and inquiry state machines.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
