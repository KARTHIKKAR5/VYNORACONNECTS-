import React, { useState, useEffect } from 'react';
import { WelcomeBanner } from '../components/dashboard/WelcomeBanner.jsx';
import { QuickActions } from '../components/dashboard/QuickActions.jsx';
import { DashboardStats } from '../components/dashboard/DashboardStats.jsx';
import { PulseFeed } from '../components/pulse/PulseFeed.jsx';
import { UpcomingEventsSection } from '../components/dashboard/UpcomingEventsSection.jsx';
import { CollaborationProjectsSection } from '../components/dashboard/CollaborationProjectsSection.jsx';
import { StudentRecommendationsSection } from '../components/dashboard/StudentRecommendationsSection.jsx';
import { MentorshipPreviewSection } from '../components/dashboard/MentorshipPreviewSection.jsx';
import { RecentOpportunitiesSection } from '../components/dashboard/RecentOpportunitiesSection.jsx';
import { RecentResourcesSection } from '../components/dashboard/RecentResourcesSection.jsx';
import {
  EventDetailModal,
  ProjectDetailModal,
  MentorDetailModal,
  CreateProjectModal,
} from '../components/dashboard/InteractiveModals.jsx';
import { getDashboardData } from '../services/dashboardService.js';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton.jsx';

export function DashboardPage({ onNavigate, onStatusUpdate }) {
  const [dashboardState, setDashboardState] = useState(null);
  const [loading, setLoading] = useState(true);

  // Active Modals
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await getDashboardData();
      if (res?.data) {
        setDashboardState(res.data);
      }
      if (typeof onStatusUpdate === 'function') {
        onStatusUpdate(res.isLiveBackend);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleQuickAction = (actionKey) => {
    if (actionKey === 'create-project-modal') {
      setIsCreateProjectOpen(true);
    } else {
      onNavigate(actionKey);
    }
  };

  const handlePulseAction = (action) => {
    if (!action) return;
    if (action.targetTab) {
      onNavigate(action.targetTab);
    }
  };

  const handleProjectCreated = (newProject) => {
    setDashboardState((prev) => ({
      ...prev,
      collaborationProjects: [newProject, ...(prev?.collaborationProjects || [])],
      stats: {
        ...(prev?.stats || {}),
        activeProjects: (prev?.stats?.activeProjects || 0) + 1,
      },
    }));
  };

  if (loading && !dashboardState) {
    return (
      <div className="dashboard-loading-wrapper">
        <LoadingSkeleton count={4} />
      </div>
    );
  }

  const {
    user,
    stats,
    upcomingEvents = [],
    collaborationProjects = [],
    recommendations = [],
    opportunities = [],
    resources = [],
    mentors = [],
  } = dashboardState || {};

  return (
    <div className="dashboard-page-container">
      {/* Top Welcome Banner */}
      <WelcomeBanner
        user={user}
        onExploreClick={() => {
          const el = document.querySelector('.pulse-feed-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Quick Action Cards */}
      <QuickActions onActionClick={handleQuickAction} />

      {/* Dashboard KPI Statistics */}
      <DashboardStats
        stats={stats}
        onStatClick={(key) => onNavigate(key)}
      />

      {/* Two-Column Responsive Grid */}
      <div className="dashboard-main-grid">
        {/* Left Column: Pulse Feed, Opportunities, Events, Projects */}
        <div className="dashboard-center-column">
          {/* Vynora Pulse Feed */}
          <PulseFeed onActivityAction={handlePulseAction} />

          {/* Opportunities Section */}
          <RecentOpportunitiesSection
            opportunities={opportunities}
            onViewAll={() => onNavigate('opportunities')}
            onSelectOpportunity={() => onNavigate('opportunities')}
          />

          {/* Upcoming Events Section */}
          <UpcomingEventsSection
            events={upcomingEvents}
            onViewAll={() => onNavigate('events')}
            onSelectEvent={(evt) => setSelectedEvent(evt)}
          />

          {/* Projects Seeking Collaborators Section */}
          <CollaborationProjectsSection
            projects={collaborationProjects}
            onViewAll={() => onNavigate('teams')}
            onSelectProject={(prj) => setSelectedProject(prj)}
          />

          {/* Shared Study Resources Section */}
          <RecentResourcesSection
            resources={resources}
            onViewAll={() => onNavigate('resources')}
            onSelectResource={() => onNavigate('resources')}
          />
        </div>

        {/* Right Column: People You May Know & Mentorship */}
        <div className="dashboard-side-column">
          {/* People You May Know */}
          <StudentRecommendationsSection
            students={recommendations}
            onViewNetwork={() => onNavigate('network')}
          />

          {/* Campus Mentorship */}
          <MentorshipPreviewSection
            mentors={mentors}
            onViewMentorship={() => onNavigate('mentorship')}
            onSelectMentor={(mnt) => setSelectedMentor(mnt)}
          />
        </div>
      </div>

      {/* Interactive Modals */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      {selectedMentor && (
        <MentorDetailModal
          mentor={selectedMentor}
          onClose={() => setSelectedMentor(null)}
        />
      )}

      {isCreateProjectOpen && (
        <CreateProjectModal
          onClose={() => setIsCreateProjectOpen(false)}
          onCreated={handleProjectCreated}
        />
      )}
    </div>
  );
}
