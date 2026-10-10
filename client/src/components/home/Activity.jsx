import React from 'react';
import ActivityCard from './ActivityCard';

function Activity() {
  // Data separated from UI: array of activity objects
  const activities = [
    {
      id: 'act-1',
      icon: '✨',
      title: 'Joined Vynora Connect',
      description: 'Your student profile is active and verified for the campus community.',
      time: 'Just now',
      type: 'Account',
      status: 'Verified'
    },
    {
      id: 'act-2',
      icon: '💡',
      title: 'New Project Opportunity',
      description: 'Smart Attendance & Campus Navigation is looking for a React developer.',
      time: '2 hours ago',
      type: 'Project',
      status: 'Open'
    },
    {
      id: 'act-3',
      icon: '🤝',
      title: 'Network Expansion',
      description: '3 students from Computer Science & Engineering joined your network.',
      time: 'Yesterday',
      type: 'Network',
      status: 'Connected'
    },
    {
      id: 'act-4',
      icon: '🚀',
      title: 'Hackathon Team Update',
      description: 'Team CyberGrid submitted the Round 1 idea for Smart India Hackathon 2026.',
      time: '2 days ago',
      type: 'Hackathon',
      status: 'Submitted'
    }
  ];

  return (
    <section className="activity-section">
      <div className="section-header">
        <h3 className="activity-title">Recent Activity</h3>
        <span className="section-badge">{activities.length} updates</span>
      </div>

      {activities.length === 0 ? (
        <div className="empty-state-card">
          <span className="empty-state-icon">📭</span>
          <p className="empty-state-text">No recent activity found.</p>
          <span className="empty-state-sub">New campus updates will appear here.</span>
        </div>
      ) : (
        <div className="activity-cards-list">
          {activities.map((item) => (
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

export default Activity;
