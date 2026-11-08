import React, { useState } from 'react';
import { AppShell } from './components/layout/AppShell.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { ResourcesPage } from './pages/ResourcesPage.jsx';
import { OpportunitiesPage } from './pages/OpportunitiesPage.jsx';
import { ComingSoonModule } from './pages/ComingSoonModule.jsx';

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLiveBackend, setIsLiveBackend] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardPage
            onNavigate={setActiveTab}
            onStatusUpdate={setIsLiveBackend}
          />
        );
      case 'resources':
        return <ResourcesPage onStatusUpdate={setIsLiveBackend} />;
      case 'opportunities':
        return <OpportunitiesPage onStatusUpdate={setIsLiveBackend} />;
      default:
        return (
          <ComingSoonModule
            moduleId={activeTab}
            onBackToDashboard={() => setActiveTab('dashboard')}
          />
        );
    }
  };

  return (
    <AppShell
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      isLiveBackend={isLiveBackend}
    >
      {renderContent()}
    </AppShell>
  );
}

export default App;
