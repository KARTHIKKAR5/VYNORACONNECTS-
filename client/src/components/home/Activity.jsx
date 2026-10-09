import React from 'react';

function Activity() {
  const activities = [
    { text: 'You joined Vynora Connect', time: 'Just now', icon: '✨' },
    { text: 'New project opportunity available', time: '2 hours ago', icon: '💡' },
    { text: '3 students joined your network', time: 'Yesterday', icon: '🤝' },
  ];

  return (
    <section className="activity-section">
      <h3 className="activity-title">Recent Activity</h3>
      <div className="activity-card">
        <ul className="activity-list">
          {activities.map((item, index) => (
            <li key={index} className="activity-item">
              <span className="activity-item-icon">{item.icon}</span>
              <div className="activity-item-content">
                <p className="activity-item-text">{item.text}</p>
                <span className="activity-item-time">{item.time}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Activity;
