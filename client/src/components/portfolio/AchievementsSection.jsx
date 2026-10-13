import React from 'react';

export function AchievementsSection({ achievements }) {
  if (!achievements) return null;

  const { certifications = [], hackathons = [], awards = [] } = achievements;

  return (
    <div className="card achievements-section-card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Honors, Hackathons & Certifications</h3>
          <p className="card-subtitle">Verified collegiate achievements, competition results, and industry certificates</p>
        </div>
      </div>

      <div className="achievements-content-grid">
        {/* Hackathons */}
        <div className="achievement-block">
          <div className="achievement-block-header">
            <span className="block-icon">🏆</span>
            <h4 className="block-title">Hackathons & Competitions</h4>
          </div>

          <div className="achievement-items-list">
            {hackathons.map((h) => (
              <div key={h.id || h.title} className="achievement-item-box">
                <div className="item-title-row">
                  <span className="item-main-title">{h.title}</span>
                  <span className="item-date">{h.date}</span>
                </div>
                <div className="item-org">{h.organization}</div>
                <p className="item-desc">{h.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="achievement-block">
          <div className="achievement-block-header">
            <span className="block-icon">📜</span>
            <h4 className="block-title">Industry Certifications</h4>
          </div>

          <div className="achievement-items-list">
            {certifications.map((c) => (
              <div key={c.id || c.title} className="achievement-item-box">
                <div className="item-title-row">
                  <span className="item-main-title">{c.title}</span>
                  <span className="item-date">{c.issueDate}</span>
                </div>
                <div className="item-org">Issued by: {c.issuer}</div>
                {c.credentialId && (
                  <div className="item-credential font-mono">
                    Credential ID: {c.credentialId}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Awards */}
        <div className="achievement-block full-width-block">
          <div className="achievement-block-header">
            <span className="block-icon">🎖️</span>
            <h4 className="block-title">Institutional Awards & Honors</h4>
          </div>

          <div className="awards-grid">
            {awards.map((a) => (
              <div key={a.id || a.title} className="award-item-card">
                <div className="award-header">
                  <span className="award-title">{a.title}</span>
                  <span className="item-date">{a.date}</span>
                </div>
                <div className="award-institution">{a.institution}</div>
                <p className="award-details">{a.details}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AchievementsSection;
