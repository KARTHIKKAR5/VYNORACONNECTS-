import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Home from '../../pages/Home';
import StudentPortfolio from '../portfolio/StudentPortfolio';
import OwnerPermissionsPanel from '../permissions/OwnerPermissionsPanel';
import MarketplacePage from '../../pages/MarketplacePage';

export function AppShell() {
  const [activeTab, setActiveTab] = useState('marketplace');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home onNavigate={setActiveTab} />;
      case 'marketplace':
        return <MarketplacePage />;
      case 'portfolio':
        return <StudentPortfolio isOwner={true} />;
      case 'permissions':
        return <OwnerPermissionsPanel />;
      default:
        return (
          <div className="teammate-module-placeholder">
            <div className="placeholder-card card">
              <span className="placeholder-icon">🚧</span>
              <h3>Module Under Construction</h3>
              <p>
                The <strong>{activeTab.toUpperCase()}</strong> module is currently assigned to a teammate and being developed in its dedicated feature branch.
              </p>
              <div className="placeholder-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => setActiveTab('marketplace')}
                >
                  View Marketplace
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setActiveTab('portfolio')}
                >
                  View Student Portfolio
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="app-shell">
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onToggleMobileSidebar={() => setMobileSidebarOpen(prev => !prev)}
      />

      <div className="app-layout">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />

        <main className="app-main-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default AppShell;
