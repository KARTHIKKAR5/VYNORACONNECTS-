import React from 'react';
import {
  Users,
  Layers,
  GraduationCap,
  MessageSquare,
  Compass,
  User,
  Settings,
  HelpCircle,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

const MODULE_METADATA = {
  network: {
    title: 'Campus Network',
    owner: 'Ram',
    tagline: 'Connect with students across India based on major, interests, and colleges.',
    icon: Users,
    color: '#6366F1',
    features: [
      'Inter-college student directory with intelligent filters',
      'One-click campus connection requests and endorsements',
      'Mutual friend discovery and college network maps',
      'Department-specific study group networking',
    ],
  },
  teams: {
    title: 'Teams & Projects',
    owner: 'Varsh',
    tagline: 'Form multidisciplinary project squads and build capstone projects together.',
    icon: Layers,
    color: '#A855F7',
    features: [
      'Role-based squad recruitment (Frontend, Backend, AI, UI/UX)',
      'GitHub repository and sprint milestone syncing',
      'Team workspace with shared kanban and asset boards',
      'Inter-college hackathon team formation matchmaking',
    ],
  },
  events: {
    title: 'Clubs & Events',
    owner: 'Sindhu',
    tagline: 'Discover hackathons, guest lectures, technical symposiums, and cultural fests.',
    icon: GraduationCap,
    color: '#F59E0B',
    features: [
      'Cross-college event discovery with verified host badges',
      'Instant digital QR event passes and calendar integration',
      'Club showcase pages with student leader contacts',
      'Live attendee chat and workshop streaming links',
    ],
  },
  mentorship: {
    title: 'Mentorship & Student Services',
    owner: 'Surya',
    tagline: 'Book 1-on-1 guidance sessions with senior students, alumni, and industry engineers.',
    icon: Compass,
    color: '#EC4899',
    features: [
      'Verified alumni and senior mentor profiles',
      'Automated office-hour booking and Google Calendar sync',
      'Resume review, system design, and mock interview tracks',
      'Student feedback and verified mentor review badges',
    ],
  },
  messages: {
    title: 'Real-time Communications',
    owner: 'Siri',
    tagline: 'Direct messaging, peer study group chats, and project team channels.',
    icon: MessageSquare,
    color: '#3B82F6',
    features: [
      'End-to-end secure student messaging channels',
      'Code snippet sharing with syntax highlighting',
      'File and PDF attachment sharing for assignments',
      'Unread counters and push notification preferences',
    ],
  },
  profile: {
    title: 'My Student Profile',
    owner: 'Core Team',
    tagline: 'Showcase your college credentials, verified skills, projects, and achievements.',
    icon: User,
    color: '#10B981',
    features: [
      'Verified student college email badge and graduation year',
      'Interactive skill tags and peer endorsements',
      'Showcase of active projects, hackathon wins, and study notes',
      'Customizable campus link-in-bio profile',
    ],
  },
  settings: {
    title: 'Account & Platform Settings',
    owner: 'Core Team',
    tagline: 'Manage privacy, notification alerts, themes, and connected accounts.',
    icon: Settings,
    color: '#6B7280',
    features: [
      'Notification digest intervals and email alert controls',
      'College visibility and network privacy toggles',
      'Obsidian dark theme and typography customizations',
      'Security credentials and session management',
    ],
  },
  support: {
    title: 'Help & Campus Support',
    owner: 'Core Team',
    tagline: 'Guides, FAQs, and direct helpdesk for Vynora Connect.',
    icon: HelpCircle,
    color: '#3B82F6',
    features: [
      'Platform onboarding walkthroughs and video guides',
      'Frequently asked questions regarding cross-campus verification',
      'Report broken links, spam, or misconduct to moderators',
      'Community guidelines and student charter',
    ],
  },
};

export function ComingSoonModule({ moduleId, onBackToDashboard }) {
  const meta = MODULE_METADATA[moduleId] || {
    title: 'Module In Development',
    owner: 'Vynora Team',
    tagline: 'This section is currently undergoing active integration.',
    icon: Sparkles,
    color: '#6366F1',
    features: ['Active integration scheduled for next release.'],
  };

  const Icon = meta.icon;

  return (
    <div className="coming-soon-module-page">
      <div className="module-status-card">
        <div className="module-status-header">
          <div
            className="module-icon-large"
            style={{ backgroundColor: `${meta.color}15`, color: meta.color, border: `1px solid ${meta.color}35` }}
          >
            <Icon size={32} />
          </div>

          <div className="module-title-meta">
            <div className="module-badge-row">
              <span className="badge-pill">
                <Sparkles size={12} />
                Campus Network Rollout
              </span>
              <span className="badge-pill badge-neutral">
                In Active Preview
              </span>
            </div>

            <h1 className="module-title">{meta.title}</h1>
            <p className="module-tagline">{meta.tagline}</p>
          </div>
        </div>

        <div className="module-roadmap-box">
          <h3 className="roadmap-title">Module Capabilities &amp; Roadmap</h3>
          <div className="features-checklist">
            {meta.features.map((feat, idx) => (
              <div key={idx} className="feature-check-item">
                <div className="check-bullet" style={{ color: meta.color }}>✓</div>
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="module-actions-row">
          <button
            type="button"
            className="btn btn-primary"
            onClick={onBackToDashboard}
            id="back-to-home-btn"
          >
            <ArrowLeft size={16} />
            <span>Return to Home Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
}

