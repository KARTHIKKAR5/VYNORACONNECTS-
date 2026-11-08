import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import { ProtectedRoute } from './components/auth/ProtectedRoute.jsx';
import { AppShell } from './components/layout/AppShell.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { ResourcesPage } from './pages/ResourcesPage.jsx';
import { OpportunitiesPage } from './pages/OpportunitiesPage.jsx';
import { ComingSoonModule } from './pages/ComingSoonModule.jsx';
import { LandingPage } from './pages/landing/LandingPage.jsx';
import { LoginPage } from './pages/auth/LoginPage.jsx';
import { RegisterPage } from './pages/auth/RegisterPage.jsx';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage.jsx';
import { ProfilePage } from './pages/profile/ProfilePage.jsx';

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/app" replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/app" replace /> : <RegisterPage />}
      />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected app routes */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppShellWrapper />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="network" element={<ComingSoonModule moduleId="network" />} />
        <Route path="opportunities" element={<OpportunitiesPage />} />
        <Route path="projects" element={<ComingSoonModule moduleId="projects" />} />
        <Route path="clubs" element={<ComingSoonModule moduleId="clubs" />} />
        <Route path="messages" element={<ComingSoonModule moduleId="messages" />} />
        <Route path="mentorship" element={<ComingSoonModule moduleId="mentorship" />} />
        <Route path="resources" element={<ResourcesPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<ComingSoonModule moduleId="settings" />} />
        <Route path="pulse" element={<DashboardPage defaultTab="pulse" />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function AppShellWrapper() {
  return <AppShell />;
}

export function App() {
  return <AppRoutes />;
}

export default App;
