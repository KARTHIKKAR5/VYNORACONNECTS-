import React from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate, Link } from 'react-router-dom';
import { Sparkles, Calendar, Users, Ticket, Building2, ShieldCheck, UserCheck } from 'lucide-react';

import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import CampusServices from './pages/CampusServices';
import ClubDirectoryPage from './pages/ClubDirectoryPage';
import ClubDetailPage from './pages/ClubDetailPage';
import ClubAdminRequestPage from './pages/ClubAdminRequestPage';
import ClubAdminStatusPage from './pages/ClubAdminStatusPage';
import ClubAdminDashboardPage from './pages/ClubAdminDashboardPage';
import CreateEventPage from './pages/CreateEventPage';
import MyEventRegistrationsPage from './pages/MyEventRegistrationsPage';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-main)' }}>
        {/* Main Navigation Topbar */}
        <header
          style={{
            backgroundColor: 'var(--bg-sidebar)',
            borderBottom: '1px solid var(--border-color)',
            position: 'sticky',
            top: 0,
            zIndex: 100
          }}
        >
          <div
            style={{
              maxWidth: '1240px',
              margin: '0 auto',
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            {/* Logo */}
            <Link to="/clubs" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF'
                }}
              >
                <Sparkles size={18} />
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
                  VYNORA <span style={{ color: 'var(--accent)' }}>CONNECT</span>
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '0.04em' }}>
                  Explore Beyond Campus
                </div>
              </div>
            </Link>

            {/* Navigation Links */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <NavLink
                to="/clubs"
                style={({ isActive }) => ({
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  backgroundColor: isActive ? 'var(--bg-elevated)' : 'transparent',
                  color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                  border: isActive ? '1px solid var(--border-color)' : '1px solid transparent'
                })}
              >
                <Users size={15} />
                <span>Clubs</span>
              </NavLink>

              <NavLink
                to="/events"
                style={({ isActive }) => ({
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  backgroundColor: isActive ? 'var(--bg-elevated)' : 'transparent',
                  color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                  border: isActive ? '1px solid var(--border-color)' : '1px solid transparent'
                })}
              >
                <Calendar size={15} />
                <span>Events</span>
              </NavLink>

              <NavLink
                to="/my/events"
                style={({ isActive }) => ({
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  backgroundColor: isActive ? 'var(--bg-elevated)' : 'transparent',
                  color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                  border: isActive ? '1px solid var(--border-color)' : '1px solid transparent'
                })}
              >
                <Ticket size={15} />
                <span>My Passes</span>
              </NavLink>

              <NavLink
                to="/campus-services"
                style={({ isActive }) => ({
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  backgroundColor: isActive ? 'var(--bg-elevated)' : 'transparent',
                  color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                  border: isActive ? '1px solid var(--border-color)' : '1px solid transparent'
                })}
              >
                <Building2 size={15} />
                <span>Services</span>
              </NavLink>
            </nav>

            {/* Right Side: Club Admin CTA & User Pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link
                to="/clubs/admin"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(99, 102, 241, 0.15)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  color: '#A5B4FC',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 600
                }}
              >
                <ShieldCheck size={14} color="#818CF8" />
                <span>Club Admin</span>
              </Link>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border-color)',
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  color: 'var(--text-secondary)'
                }}
              >
                <UserCheck size={14} color="#34D399" />
                <span>Sindhu</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Routes */}
        <main style={{ flex: 1 }}>
          <Routes>
            {/* Clubs Routes */}
            <Route path="/clubs" element={<ClubDirectoryPage />} />
            <Route path="/clubs/:clubId" element={<ClubDetailPage />} />
            <Route path="/clubs/admin/request" element={<ClubAdminRequestPage />} />
            <Route path="/clubs/admin/status" element={<ClubAdminStatusPage />} />
            <Route path="/clubs/admin" element={<ClubAdminDashboardPage />} />
            <Route path="/clubs/admin/:clubId/events/new" element={<CreateEventPage />} />

            {/* Events & Registrations Routes */}
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/my/events" element={<MyEventRegistrationsPage />} />

            {/* Campus Services */}
            <Route path="/campus-services" element={<CampusServices />} />

            {/* Default fallback */}
            <Route path="*" element={<Navigate to="/clubs" replace />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer
          style={{
            borderTop: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-sidebar)',
            padding: '20px',
            textAlign: 'center',
            fontSize: '12px',
            color: 'var(--text-secondary)'
          }}
        >
          Vynora Connect • College Clubs & Events Module (Sindhu)
        </footer>
      </div>
    </BrowserRouter>
  );
}