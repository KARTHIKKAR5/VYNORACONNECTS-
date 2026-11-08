import React, { useState, useEffect } from 'react';
import AppShell from './components/layout/AppShell.jsx';
import DiscoverStudentsPage from './modules/network/pages/DiscoverStudentsPage.jsx';
import StudentProfilePage from './modules/network/pages/StudentProfilePage.jsx';
import MyProfilePage from './modules/network/pages/MyProfilePage.jsx';
import EditProfilePage from './modules/network/pages/EditProfilePage.jsx';
import ConnectionsPage from './modules/network/pages/ConnectionsPage.jsx';
import networkApi from './modules/network/services/networkApi.js';

export default function App() {
  // Routes: 'discover' | 'connections' | 'profile' | 'profile_edit' | 'profile_privacy' | 'student_detail'
  const [currentRoute, setCurrentRoute] = useState('discover');
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [isLiveBackend, setIsLiveBackend] = useState(false);

  // Probe backend status on mount
  useEffect(() => {
    let mounted = true;
    networkApi.checkBackendHealth().then((isLive) => {
      if (mounted) {
        setIsLiveBackend(isLive);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Sync with browser hash route for direct URL support
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (!hash || hash === 'network') {
        setCurrentRoute('discover');
        setSelectedStudentId(null);
      } else if (hash === 'network/connections') {
        setCurrentRoute('connections');
        setSelectedStudentId(null);
      } else if (hash.startsWith('students/')) {
        const id = hash.replace('students/', '');
        setSelectedStudentId(id);
        setCurrentRoute('student_detail');
      } else if (hash === 'profile') {
        setCurrentRoute('profile');
        setSelectedStudentId(null);
      } else if (hash === 'profile/edit') {
        setCurrentRoute('profile_edit');
        setSelectedStudentId(null);
      } else if (hash === 'profile/privacy') {
        setCurrentRoute('profile_privacy');
        setSelectedStudentId(null);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // initial check

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (route, param = null) => {
    if (route === 'discover') {
      window.location.hash = '#network';
    } else if (route === 'connections') {
      window.location.hash = '#network/connections';
    } else if (route === 'student_detail' && param) {
      window.location.hash = `#students/${param}`;
    } else if (route === 'profile') {
      window.location.hash = '#profile';
    } else if (route === 'profile_edit') {
      window.location.hash = '#profile/edit';
    } else if (route === 'profile_privacy') {
      window.location.hash = '#profile/privacy';
    }
  };

  // Map route to AppShell active sidebar tab
  const activeSidebarTab =
    currentRoute === 'discover'
      ? 'discover'
      : currentRoute === 'connections'
      ? 'connections'
      : 'profile';

  return (
    <AppShell
      activeTab={activeSidebarTab}
      setActiveTab={(tab) => navigateTo(tab)}
      isLiveBackend={isLiveBackend}
    >
      {currentRoute === 'discover' && (
        <DiscoverStudentsPage
          onSelectStudent={(student) => navigateTo('student_detail', student._id)}
        />
      )}

      {currentRoute === 'connections' && (
        <ConnectionsPage
          onSelectStudent={(student) => navigateTo('student_detail', student._id)}
        />
      )}

      {currentRoute === 'student_detail' && (
        <StudentProfilePage
          userId={selectedStudentId}
          onBack={() => navigateTo('discover')}
          onEditClick={() => navigateTo('profile_edit')}
        />
      )}

      {currentRoute === 'profile' && (
        <MyProfilePage
          initialTab="overview"
          onEditClick={() => navigateTo('profile_edit')}
        />
      )}

      {currentRoute === 'profile_privacy' && (
        <MyProfilePage
          initialTab="privacy"
          onEditClick={() => navigateTo('profile_edit')}
        />
      )}

      {currentRoute === 'profile_edit' && (
        <EditProfilePage
          onCancel={() => navigateTo('profile')}
          onSaveSuccess={() => navigateTo('profile')}
        />
      )}
    </AppShell>
  );
}
