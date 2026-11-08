import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar.jsx';
import Topbar from './components/layout/Topbar.jsx';
import DemoBanner from './components/layout/DemoBanner.jsx';
import { adminApi } from './services/adminApi.js';

// Pages
import OverviewPage from './pages/Overview/index.jsx';
import CollegeVerificationPage from './pages/CollegeVerification/index.jsx';
import ClubVerificationPage from './pages/ClubVerification/index.jsx';
import ClubAdminApplicationsPage from './pages/ClubAdminApplications/index.jsx';
import ClubAdminAssignmentsPage from './pages/ClubAdminAssignments/index.jsx';
import UserManagementPage from './pages/UserManagement/index.jsx';
import ReportsModerationPage from './pages/ReportsModeration/index.jsx';
import SupportTicketsPage from './pages/SupportTickets/index.jsx';
import AuditLogsPage from './pages/AuditLogs/index.jsx';
import SettingsPage from './pages/Settings/index.jsx';

export function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [counts, setCounts] = useState({
    pendingColleges: 0,
    pendingClubs: 0,
    pendingApplications: 0,
    openReports: 0,
    openTickets: 0,
  });

  const refreshCounts = useCallback(async () => {
    try {
      const res = await adminApi.getOverview();
      const m = res.data.metrics;
      setCounts({
        pendingColleges: m.pendingColleges,
        pendingClubs: m.pendingClubs,
        pendingApplications: m.pendingApplications,
        openReports: m.openReports,
        openTickets: m.openTickets,
      });
    } catch {
      // Ignored in initial mount
    }
  }, []);

  useEffect(() => {
    refreshCounts();
  }, [refreshCounts]);

  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setMobileSidebarOpen(!mobileSidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  return (
    <div className="admin-layout">
      {/* Sidebar Navigation */}
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        counts={counts}
      />

      {/* Main Content Area */}
      <div className="admin-main">
        {/* Global Demo Banner */}
        <DemoBanner onDataReset={refreshCounts} />

        {/* Topbar */}
        <Topbar
          onToggleSidebar={toggleSidebar}
          counts={counts}
        />

        {/* Main Routed Views */}
        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route
            path="/colleges"
            element={<CollegeVerificationPage onCountsChange={refreshCounts} />}
          />
          <Route
            path="/clubs"
            element={<ClubVerificationPage onCountsChange={refreshCounts} />}
          />
          <Route
            path="/club-admin-applications"
            element={<ClubAdminApplicationsPage onCountsChange={refreshCounts} />}
          />
          <Route
            path="/club-admin-assignments"
            element={<ClubAdminAssignmentsPage />}
          />
          <Route
            path="/users"
            element={<UserManagementPage onCountsChange={refreshCounts} />}
          />
          <Route
            path="/moderation"
            element={<ReportsModerationPage onCountsChange={refreshCounts} />}
          />
          <Route
            path="/support"
            element={<SupportTicketsPage onCountsChange={refreshCounts} />}
          />
          <Route path="/audit-logs" element={<AuditLogsPage />} />
          <Route path="/settings" element={<SettingsPage />} />

          {/* Catch-all redirect to overview */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
