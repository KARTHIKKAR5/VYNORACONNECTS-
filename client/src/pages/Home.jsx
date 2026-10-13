import React from 'react';
import Welcome from '../components/home/Welcome';
import QuickActions from '../components/home/QuickActions';
import Activity from '../components/home/Activity';
import PulseActivity from '../components/home/PulseActivity';
import EventPreview from '../components/home/EventPreview';
import ProjectPreview from '../components/home/ProjectPreview';
import OpportunityPreview from '../components/home/OpportunityPreview';

export function Home({ onNavigate }) {
  return (
    <div className="home-container">
      {/* 1. Welcome Banner */}
      <Welcome />

      {/* 2. Quick Actions */}
      <QuickActions onNavigate={onNavigate} />

      {/* 3. Recent Activity */}
      <Activity />

      {/* 4. Vynora Pulse */}
      <PulseActivity />

      {/* 5. Upcoming Events */}
      <EventPreview />

      {/* 6. Recent Projects */}
      <ProjectPreview />

      {/* 7. Opportunities */}
      <OpportunityPreview />
    </div>
  );
}

export default Home;
