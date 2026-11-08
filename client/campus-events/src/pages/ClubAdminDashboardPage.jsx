import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Plus, Calendar, Users, Eye, ArrowUpRight } from 'lucide-react';
import { clubsEventsApi } from '../services/clubsEventsApi';

export default function ClubAdminDashboardPage() {
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [clubsRes, eventsRes] = await Promise.all([
        clubsEventsApi.getManagedClubs(),
        clubsEventsApi.getEvents()
      ]);
      setClubs(clubsRes.data);
      setEvents(eventsRes.data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <ShieldCheck size={20} color="#34D399" />
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#34D399', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Scoped Club Admin Console
            </span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Club Leadership Dashboard</h1>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
            Manage official events, registrations, and publish announcements for your assigned college club.
          </p>
        </div>

        {clubs[0] && (
          <Link
            to={`/clubs/admin/${clubs[0].id}/events/new`}
            style={{
              backgroundColor: 'var(--accent)',
              color: '#FFFFFF',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Plus size={16} /> Publish New Event
          </Link>
        )}
      </div>

      {loading ? (
        <div style={{ color: 'var(--text-secondary)' }}>Loading admin console...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Assigned Club Card */}
          {clubs.map((club) => {
            const clubEvents = events.filter((e) => e.clubId === club.id);
            const totalRegistrations = clubEvents.reduce((acc, curr) => acc + (curr.registeredCount || 0), 0);

            return (
              <div
                key={club.id}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '24px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
                  <div>
                    <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>{club.name}</h2>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{club.collegeName} • Active Verified Club</p>
                  </div>
                  <Link
                    to={`/clubs/${club.id}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '13px',
                      color: 'var(--accent)',
                      fontWeight: 600
                    }}
                  >
                    View Public Page <ArrowUpRight size={14} />
                  </Link>
                </div>

                {/* Metrics Bar */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '16px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Active Published Events</div>
                    <div style={{ fontSize: '24px', fontWeight: 800 }}>{clubEvents.length}</div>
                  </div>
                  <div style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '16px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Total Student Registrations</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#34D399' }}>{totalRegistrations}</div>
                  </div>
                  <div style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '16px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Registered Club Members</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent)' }}>{club.memberCount || 340}</div>
                  </div>
                </div>

                {/* Events Managed By This Club */}
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px' }}>Managed Events</h3>
                  {clubEvents.length === 0 ? (
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>No events published yet.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {clubEvents.map((evt) => (
                        <div
                          key={evt.id}
                          style={{
                            backgroundColor: 'var(--bg-elevated)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '10px',
                            padding: '16px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '12px'
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>{evt.title}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                              {new Date(evt.startsAt).toLocaleDateString()} • {evt.mode.toUpperCase()} • Capacity: {evt.registeredCount}/{evt.capacity}
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '10px' }}>
                            <Link
                              to={`/events/${evt.id}`}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                backgroundColor: 'var(--bg-card)',
                                border: '1px solid var(--border-color)',
                                color: 'var(--text-primary)',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: 600
                              }}
                            >
                              <Eye size={13} /> View Live
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}