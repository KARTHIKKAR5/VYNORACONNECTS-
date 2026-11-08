import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, AlertCircle, RefreshCw, Plus, Users, MapPin, CheckCircle2 } from 'lucide-react';
import EventFilters from '../components/events/EventFilters';
import EventStatusBadge from '../components/events/EventStatusBadge';
import { clubsEventsApi } from '../services/clubsEventsApi';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [onlineOnly, setOnlineOnly] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await clubsEventsApi.getEvents({
        category: selectedCategory,
        search,
        onlineOnly
      });
      setEvents(res.data);
    } catch (err) {
      setError(err.message || 'Unable to load events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory, search, onlineOnly]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Calendar size={20} color="var(--accent)" />
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Campus & Events Discovery
            </span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Explore Student Activities
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
            Discover official workshops, hackathons, and competitions published by verified college clubs.
          </p>
        </div>

        <Link
          to="/clubs/admin"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            padding: '10px 18px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Plus size={16} /> Club Admin Portal
        </Link>
      </div>

      {/* Filter Component */}
      <EventFilters
        search={search}
        setSearch={setSearch}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onlineOnly={onlineOnly}
        setOnlineOnly={setOnlineOnly}
        totalCount={events.length}
      />

      {/* Content Area */}
      {loading ? (
        <div style={{ color: 'var(--text-secondary)' }}>Loading events...</div>
      ) : error ? (
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid #EF4444', borderRadius: '12px', padding: '36px', textAlign: 'center' }}>
          <AlertCircle size={36} color="#EF4444" style={{ margin: '0 auto 12px' }} />
          <h3>Failed to Load Events</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '8px 0 16px' }}>{error}</p>
          <button onClick={fetchEvents} style={{ backgroundColor: 'var(--bg-elevated)', color: '#fff', padding: '8px 16px', borderRadius: '8px' }}>
            Try Again
          </button>
        </div>
      ) : events.length === 0 ? (
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '48px 20px', textAlign: 'center' }}>
          <Calendar size={42} color="#737373" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>No events found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>
            No events match your current filter criteria.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('All');
              setOnlineOnly(false);
            }}
            style={{ backgroundColor: 'var(--accent)', color: '#FFFFFF', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600 }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
          {events.map((event) => {
            const startDate = new Date(event.startsAt).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric'
            });
            const percentageFilled = Math.min(100, Math.round(((event.registeredCount || 0) / (event.capacity || 100)) * 100));

            return (
              <div
                key={event.id}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)', backgroundColor: 'rgba(99, 102, 241, 0.1)', padding: '4px 10px', borderRadius: '6px' }}>
                      {event.category.toUpperCase()}
                    </span>
                    <EventStatusBadge status={event.status === 'published' ? 'UPCOMING' : event.status} isOnline={event.mode === 'online'} />
                  </div>

                  <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', lineHeight: 1.3 }}>
                    {event.title}
                  </h3>

                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                    By <strong style={{ color: '#E5E5E5' }}>{event.clubName || event.organizer}</strong>
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      <Calendar size={15} />
                      <span>{startDate}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      <MapPin size={15} />
                      <span>{event.venue ? (typeof event.venue === 'string' ? event.venue : event.venue.name) : 'Online'}</span>
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Users size={14} />
                      <span>{event.registeredCount || 0} / {event.capacity} seats</span>
                    </div>
                    {event.isUserRegistered && (
                      <span style={{ color: '#34D399', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={14} /> Registered
                      </span>
                    )}
                  </div>

                  <Link
                    to={`/events/${event.id}`}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'center',
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      padding: '9px 0',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 600
                    }}
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}