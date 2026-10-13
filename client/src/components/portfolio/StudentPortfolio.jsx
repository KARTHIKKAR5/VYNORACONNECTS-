import React, { useState, useEffect } from 'react';
import PortfolioHeader from './PortfolioHeader';
import SocialProfiles from './SocialProfiles';
import SkillsSection from './SkillsSection';
import ProjectsSection from './ProjectsSection';
import AchievementsSection from './AchievementsSection';
import PortfolioEditModal from './PortfolioEditModal';
import { INITIAL_PORTFOLIO } from '../../data/portfolioData';

const LOCAL_STORAGE_KEY = 'vynora_student_portfolio_data';

export function StudentPortfolio({ isOwner = true }) {
  // Load initial state from localStorage if available, or fallback to INITIAL_PORTFOLIO
  const [portfolio, setPortfolio] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (err) {
      console.warn('Could not read portfolio from localStorage:', err);
    }
    return INITIAL_PORTFOLIO;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);

  // Sync state to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(portfolio));
    } catch (err) {
      console.warn('Could not persist portfolio to localStorage:', err);
    }
  }, [portfolio]);

  const handleSave = (updatedData) => {
    setPortfolio(updatedData);
    setIsEditing(false);
    setSaveMessage('✓ Portfolio details updated and saved successfully!');

    setTimeout(() => {
      setSaveMessage(null);
    }, 4500);
  };

  const handleResetToDemo = () => {
    if (window.confirm('Reset portfolio back to default demo data?')) {
      setPortfolio(INITIAL_PORTFOLIO);
      try {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      } catch (err) {
        // ignore
      }
      setSaveMessage('✓ Portfolio reset to default demo data.');
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  return (
    <div className="student-portfolio-container">
      {/* Portfolio Top Bar */}
      <div className="portfolio-top-bar">
        <div className="portfolio-status-notice">
          <span className="notice-icon">ℹ️</span>
          <span>
            Demonstration Student Profile • Institutional verification badge uses simulated campus data.
          </span>
        </div>

        <div className="portfolio-actions-cluster">
          <button
            className="btn btn-sm btn-secondary reset-demo-btn"
            onClick={handleResetToDemo}
            title="Reset to default initial demonstration profile"
          >
            Reset Demo Data
          </button>
          {isOwner && (
            <button
              className="btn btn-sm btn-primary"
              onClick={() => setIsEditing(true)}
            >
              <span>✏️</span> Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Save Success Banner */}
      {saveMessage && (
        <div className="notification-toast success portfolio-save-toast">
          <span className="toast-icon">✅</span>
          <span className="toast-message">{saveMessage}</span>
          <button className="toast-close" onClick={() => setSaveMessage(null)}>×</button>
        </div>
      )}

      {/* Header */}
      <PortfolioHeader
        portfolio={portfolio}
        onEditClick={() => setIsEditing(true)}
        isOwner={isOwner}
      />

      {/* Grid: Social Profiles & Skills */}
      <div className="portfolio-section-stack">
        <SocialProfiles profiles={portfolio.socialProfiles} />
        <SkillsSection skills={portfolio.skills} />
        <ProjectsSection projects={portfolio.projects} />
        <AchievementsSection achievements={portfolio.achievements} />
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <PortfolioEditModal
          portfolio={portfolio}
          onSave={handleSave}
          onClose={() => setIsEditing(false)}
        />
      )}
    </div>
  );
}

export default StudentPortfolio;
