import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Calendar, MapPin, CheckCircle2, ArrowLeft, Trash2 } from 'lucide-react';
import { clubsEventsApi } from '../services/clubsEventsApi';

export default function MyEventRegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRegistrations = async () => {
    setLoading(true);
    const res = await clubsEventsApi.getMyRegistrations();
    setRegistrations(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadRegistrations();
  }, []);

  const handleCancel = async (eventId) => {
    if (!window.confirm('Are you sure you want to cancel this event registration?')) return;
    await clubsEventsApi.cancelRegistration(eventId);
    loadRegistrations();
  };

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', padding: '32px 20px' }}>
      <Link
        to="/events"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, marginBottom: '24px' }}
      >
        <ArrowLeft size={16} /> Back to Events
      </Link>

      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Ticket size={20} color="var(--accent)" />
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Student Passes
          </span>
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 800 }}>My Event Registrations</h1>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
          Your active event passes, confirmation reference codes, and venue locations.
        </p>
      </div>

      {loading ? (
        <div style={{ color: 'var(--text-secondary)' }}>Loading your tickets...</div>
      ) : registrations.length === 0 ? (
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '48px 20px', textAlign: 'center' }}>
          <Ticket size={40} color="#737373" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>No Event Registrations Yet</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
            You haven't registered for any workshops or hackathons yet.
          </p>
          <Link
            to="/events"
            style={{
              backgroundColor: 'var(--accent)',
              color: '#FFFFFF',
              padding: '10px 18px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600
            }}
          >
            Explore Events →
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {registrations.map((reg) => (
            <div
              key={reg.id}
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '14px',
                padding: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      backgroundColor: 'rgba(16, 185, 129, 0.15)',
                      color: '#34D399',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      padding: '3px 8px',
                      borderRadius: '6px'
                    }}
                  >
                    Confirmed
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                    Ref: {reg.referenceCode}
                  </span>
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{reg.eventTitle}</h3>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} color="#A3A3A3" />
                    <span>{new Date(reg.startsAt).toLocaleDateString()}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} color="#A3A3A3" />
                    <span>{reg.venue}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Link
                  to={`/events/${reg.eventId}`}
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 600
                  }}
                >
                  Event Details
                </Link>

                <button
                  onClick={() => handleCancel(reg.eventId)}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid #EF4444',
                    color: '#EF4444',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Trash2 size={14} /> Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}