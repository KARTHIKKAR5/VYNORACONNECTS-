import React from 'react';

export function SocialProfiles({ profiles }) {
  if (!profiles) return null;

  const socialLinks = [
    {
      name: 'GitHub',
      icon: '🐙',
      url: profiles.github,
      handle: profiles.githubUsername || 'surya-prakash',
      colorClass: 'social-github'
    },
    {
      name: 'LinkedIn',
      icon: '💼',
      url: profiles.linkedin,
      handle: profiles.linkedinUsername || 'in/surya-prakash-dev',
      colorClass: 'social-linkedin'
    },
    {
      name: 'LeetCode',
      icon: '⚡',
      url: profiles.leetcode,
      handle: profiles.leetcodeUsername || 'surya_codes',
      colorClass: 'social-leetcode'
    },
    {
      name: 'Portfolio Website',
      icon: '🌐',
      url: profiles.website,
      handle: profiles.website ? profiles.website.replace(/^https?:\/\//, '') : 'suryaprakash.dev',
      colorClass: 'social-website'
    }
  ];

  return (
    <div className="card social-profiles-card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Connect & Social Profiles</h3>
          <p className="card-subtitle">Verified external developer identities and profiles</p>
        </div>
      </div>

      <div className="social-profiles-grid">
        {socialLinks.map((item) => (
          <a
            key={item.name}
            href={item.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className={`social-link-card ${item.colorClass}`}
            title={`Visit ${item.name} profile`}
          >
            <div className="social-icon-wrapper">
              <span className="social-icon">{item.icon}</span>
            </div>
            <div className="social-info">
              <span className="social-platform-name">{item.name}</span>
              <span className="social-handle">{item.handle}</span>
            </div>
            <span className="social-arrow">↗</span>
          </a>
        ))}
      </div>
    </div>
  );
}

export default SocialProfiles;
