import React from 'react';
import ActivityCard from './ActivityCard';

function PulseActivity() {
  // Student campus pulse data summarizing cross-campus highlights
  const pulseFeed = [
    {
      id: 'pulse-1',
      icon: '🔥',
      title: 'Dev Sprint: Open Source Week',
      description: 'Campus Coding Club merged 14 PRs into the college repository today.',
      time: '15m ago',
      type: 'Collaboration',
      status: 'Active'
    },
    {
      id: 'pulse-2',
      icon: '🏆',
      title: 'Hackathon Partner Request',
      description: 'Aarav Patel is seeking a UI/UX Figma designer for SIH 2026.',
      time: '45m ago',
      type: 'Team Match',
      status: 'Recruiting'
    },
    {
      id: 'pulse-3',
      icon: '📚',
      title: 'Resource Shared: OS Exam PYQs',
      description: 'Handwritten notes for Operating Systems Unit 4 uploaded to repository.',
      time: '3 hours ago',
      type: 'Resource',
      status: 'New'
    },
    {
      id: 'pulse-4',
      icon: '🎯',
      title: 'Internship Opportunity Posted',
      description: 'Google Summer of Code prep group formed in Central Library room 2.',
      time: '5 hours ago',
      type: 'Career',
      status: 'Trending'
    }
  ];

  return (
    <section className="pulse-section">
      <div className="section-header">
        <div className="section-title-wrap">
          <span className="pulse-indicator-dot" />
          <h3 className="section-main-heading">Vynora Pulse</h3>
        </div>
        <span className="section-tagline">Real-time campus momentum</span>
      </div>

      {pulseFeed.length === 0 ? (
        <div className="empty-state-card">
          <span className="empty-state-icon">📡</span>
          <p className="empty-state-text">No active pulse signals right now.</p>
          <span className="empty-state-sub">Check back as student projects and teams post updates.</span>
        </div>
      ) : (
        <div className="pulse-cards-grid">
          {pulseFeed.map((item) => (
            <ActivityCard
              key={item.id}
              icon={item.icon}
              title={item.title}
              description={item.description}
              time={item.time}
              type={item.type}
              status={item.status}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default PulseActivity;
