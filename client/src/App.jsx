import React, { useState } from 'react';
import { AppShell } from './components/layout/AppShell.jsx';
import { OpportunitiesResourcesPage } from './pages/OpportunitiesResourcesPage.jsx';

export function App() {
  const [activeTab, setActiveTab] = useState('all');
  const [isLiveBackend, setIsLiveBackend] = useState(false);

  return (
    <AppShell
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      isLiveBackend={isLiveBackend}
    >
      <OpportunitiesResourcesPage onStatusUpdate={setIsLiveBackend} />
    </AppShell>
  );
}

export default App;

