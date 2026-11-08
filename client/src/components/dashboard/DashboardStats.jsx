import React from 'react';
import {
  Users,
  UserCheck,
  Bookmark,
  Calendar,
  MessageSquare,
  FolderGit2,
} from 'lucide-react';

export function DashboardStats({ stats, onStatClick }) {
  const statCards = [
    {
      id: 'connections',
      label: 'Campus Connections',
      value: stats?.connections ?? 0,
      icon: Users,
      color: '#6366F1',
      actionKey: 'network',
      subtext: '+4 this month',
    },
    {
      id: 'pendingRequests',
      label: 'Pending Requests',
      value: stats?.pendingRequests ?? 0,
      icon: UserCheck,
      color: '#3B82F6',
      actionKey: 'network',
      subtext: 'Awaiting your review',
    },
    {
      id: 'savedOpportunities',
      label: 'Saved Opportunities',
      value: stats?.savedOpportunities ?? 0,
      icon: Bookmark,
      color: '#10B981',
      actionKey: 'opportunities',
      subtext: 'Active deadlines',
    },
    {
      id: 'upcomingEvents',
      label: 'Upcoming Events',
      value: stats?.upcomingEvents ?? 0,
      icon: Calendar,
      color: '#F59E0B',
      actionKey: 'events',
      subtext: 'Confirmed passes',
    },
    {
      id: 'unreadMessages',
      label: 'Unread Messages',
      value: stats?.unreadMessages ?? 0,
      icon: MessageSquare,
      color: '#EC4899',
      actionKey: 'messages',
      subtext: 'From study peers',
    },
    {
      id: 'activeProjects',
      label: 'Active Projects',
      value: stats?.activeProjects ?? 0,
      icon: FolderGit2,
      color: '#A855F7',
      actionKey: 'teams',
      subtext: 'Collaborations',
    },
  ];

  return (
    <section className="stats-section" aria-label="Dashboard Statistics">
      <div className="stats-grid">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="stat-card"
              role="button"
              tabIndex={0}
              onClick={() => onStatClick?.(card.actionKey)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onStatClick?.(card.actionKey);
                }
              }}
              id={`stat-card-${card.id}`}
            >
              <div className="stat-header">
                <span className="stat-label">{card.label}</span>
                <div
                  className="stat-icon"
                  style={{
                    backgroundColor: `${card.color}15`,
                    color: card.color,
                  }}
                >
                  <Icon size={16} />
                </div>
              </div>

              <div className="stat-number-row">
                <span className="stat-number">{card.value}</span>
              </div>

              <div className="stat-subtext">{card.subtext}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

