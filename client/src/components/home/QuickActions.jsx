import React from 'react';

function QuickActions() {
  const actions = [
    { title: 'Find People', icon: '👥' },
    { title: 'Create Post', icon: '✍️' },
    { title: 'Find a Team', icon: '🚀' },
    { title: 'Explore Events', icon: '📅' },
  ];

  return (
    <section className="quick-actions-section">
      <div className="quick-actions-grid">
        {actions.map((action, index) => (
          <div key={index} className="action-card">
            <span className="action-icon">{action.icon}</span>
            <span className="action-title">{action.title}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default QuickActions;
