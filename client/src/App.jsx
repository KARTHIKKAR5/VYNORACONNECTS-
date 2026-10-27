import React, { useState } from 'react';
import { AppShell } from './components/layout/AppShell.jsx';
import { ResourcesPage } from './pages/ResourcesPage.jsx';
import { OpportunitiesPage } from './pages/OpportunitiesPage.jsx';

export function App() {
  const [activeTab, setActiveTab] = useState('resources');
  const [isLiveBackend, setIsLiveBackend] = useState(false);

  return (
    <AppShell
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      isLiveBackend={isLiveBackend}
    >
      {activeTab === 'resources' ? (
        <ResourcesPage onStatusUpdate={setIsLiveBackend} />
      ) : (
        <OpportunitiesPage onStatusUpdate={setIsLiveBackend} />
      )}
    </AppShell>
  );
}

export default App;
