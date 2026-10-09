import React from 'react';
import Welcome from '../components/home/Welcome';
import QuickActions from '../components/home/QuickActions';
import Activity from '../components/home/Activity';

function Home() {
  return (
    <div className="home-container">
      <Welcome />
      <QuickActions />
      <Activity />
    </div>
  );
}

export default Home;
