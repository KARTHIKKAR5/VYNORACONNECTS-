import React from 'react';

export function PortfolioHeader({ portfolio, onEditClick, isOwner = true }) {
  return (
    <div className="portfolio-header-card">
      <div className="portfolio-cover-band"></div>

      <div className="portfolio-header-content">
        <div className="portfolio-avatar-wrapper">
          <img
            src={portfolio.avatar}
            alt={portfolio.name}
            className="portfolio-avatar-img"
          />
          {portfolio.isVerified && (
            <div
              className="verified-badge-bubble"
              title={`Institutional Verified: ${portfolio.verificationDetails}`}
            >
              ✓
            </div>
          )}
        </div>

        <div className="portfolio-info-main">
          <div className="portfolio-title-row">
            <div>
              <div className="name-and-verification">
                <h1 className="student-name">{portfolio.name}</h1>
                {portfolio.isVerified && (
                  <span className="badge badge-verified" title={portfolio.verificationDetails}>
                    <span className="verified-check">✓</span> Verified Student
                  </span>
                )}
                <span className="badge badge-mock">Mock Data</span>
              </div>
              <p className="student-headline">{portfolio.title}</p>
            </div>

            {isOwner && (
              <button
                className="btn btn-primary edit-profile-btn"
                onClick={onEditClick}
                aria-label="Edit Portfolio"
              >
                <span>✏️</span> Edit Portfolio
              </button>
            )}
          </div>

          <div className="portfolio-meta-strip">
            <div className="meta-item">
              <span className="meta-icon">🏛️</span>
              <span className="meta-text">{portfolio.college}</span>
            </div>
            <div className="meta-item">
              <span className="meta-icon">🎓</span>
              <span className="meta-text">{portfolio.department}</span>
            </div>
            <div className="meta-item">
              <span className="meta-icon">📅</span>
              <span className="meta-text">{portfolio.academicYear}</span>
            </div>
            <div className="meta-item">
              <span className="meta-icon">🆔</span>
              <span className="meta-text font-mono">{portfolio.campusId}</span>
            </div>
          </div>

          <p className="student-bio">{portfolio.bio}</p>
        </div>
      </div>
    </div>
  );
}

export default PortfolioHeader;
