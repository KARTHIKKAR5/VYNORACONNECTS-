import React from 'react';
import {
  Users,
  Briefcase,
  PlusCircle,
  Calendar,
  Compass,
  BookOpen,
} from 'lucide-react';

export function QuickActions({ onActionClick }) {
  const actions = [
    {
      id: 'discover-students',
      label: 'Discover Students',
      description: 'Expand your network across campuses',
      icon: Users,
      color: '#6366F1',
      actionKey: 'network',
    },
    {
      id: 'explore-opportunities',
      label: 'Explore Opportunities',
      description: 'Internships, hackathons & jobs',
      icon: Briefcase,
      color: '#10B981',
      actionKey: 'opportunities',
    },
    {
      id: 'create-project',
      label: 'Create a Project',
      description: 'Recruit teammates across colleges',
      icon: PlusCircle,
      color: '#A855F7',
      actionKey: 'create-project-modal',
    },
    {
      id: 'explore-events',
      label: 'Explore Events',
      description: 'Campus hackathons, summits & fests',
      icon: Calendar,
      color: '#F59E0B',
      actionKey: 'events',
    },
    {
      id: 'find-mentor',
      label: 'Find a Mentor',
      description: '1-on-1 guidance from seniors & alumni',
      icon: Compass,
      color: '#EC4899',
      actionKey: 'mentorship',
    },
    {
      id: 'browse-resources',
      label: 'Browse Resources',
      description: 'Curated notes, roadmaps & tools',
      icon: BookOpen,
      color: '#3B82F6',
      actionKey: 'resources',
    },
  ];

  return (
    <section className="quick-actions-section" aria-label="Quick Actions">
      <div className="section-header">
        <div>
          <h2 className="section-title">Quick Actions</h2>
          <p className="section-subtitle">Jump straight into high-impact campus collaboration</p>
        </div>
      </div>

      <div className="quick-actions-grid">
        {actions.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              className="quick-action-card"
              onClick={() => onActionClick(item.actionKey)}
              id={`quick-action-${item.id}`}
            >
              <div
                className="action-icon-wrapper"
                style={{
                  backgroundColor: `${item.color}15`,
                  color: item.color,
                  border: `1px solid ${item.color}30`,
                }}
              >
                <Icon size={20} />
              </div>
              <div className="action-text-content">
                <div className="action-title">{item.label}</div>
                <div className="action-description">{item.description}</div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

