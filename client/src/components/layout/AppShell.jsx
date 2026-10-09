import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Home from '../../pages/Home';

function AppShell() {
  return (
    <div className="app-shell">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Layout: Sidebar on left, Content (Home) on right */}
      <div className="app-layout">
        <Sidebar />
        <main className="app-main-content">
          <Home />
        </main>
      </div>
    </div>
  );
}

export default AppShell;
