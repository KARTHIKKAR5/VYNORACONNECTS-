import React from 'react';
import { Sparkles, GraduationCap, MapPin, ShieldCheck } from 'lucide-react';

export function WelcomeBanner({ user, onExploreClick }) {
  const studentName = user?.name || 'Student';
  const college = user?.college || 'SR University';
  const department = user?.department || 'Computer Science & Engineering';
  const graduationYear = user?.graduationYear || 2026;

  return (
    <div className="welcome-banner">
      <div className="welcome-content">
        <div className="welcome-badge">
          <Sparkles size={14} className="sparkle-icon" />
          <span>Inter-College Student Network Active</span>
        </div>

        <h1 className="welcome-title">
          Welcome back, <span className="welcome-name">{studentName}</span>
        </h1>

        <p className="welcome-subtitle">
          Your campus network is growing. Discover opportunities, connect with students and build something meaningful.
        </p>

        <div className="welcome-meta">
          <div className="meta-pill">
            <GraduationCap size={14} />
            <span>{department} • Class of {graduationYear}</span>
          </div>
          <div className="meta-pill">
            <MapPin size={14} />
            <span>{college}</span>
          </div>
          <div className="meta-pill verified-pill">
            <ShieldCheck size={14} />
            <span>Verified Student ID</span>
          </div>
        </div>
      </div>

      <div className="welcome-action-aside">
        <button
          type="button"
          className="btn btn-primary welcome-cta-btn"
          onClick={onExploreClick}
          id="welcome-explore-feed"
        >
          Explore Pulse Feed
        </button>
      </div>
    </div>
  );
}
