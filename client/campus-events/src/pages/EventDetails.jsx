import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Users, Clock, ShieldCheck, Tag } from 'lucide-react';
import EventStatusBadge from '../components/events/EventStatusBadge';
import EventRegistration from '../components/events/EventRegistration';
import { clubsEventsApi } from '../services/clubsEventsApi';

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvent = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await clubsEventsApi.getEvents();
      const found = res.data.find((e) => e.id === id);
      if (!found) throw new Error('Event not found.');
      setEvent(found);
    } catch (err) {
      setError(err.message || 'Event not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  if (loading) {
    return <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px', color: 'var(--text-secondary)' }}>Loading event details...</div>;
  }

  if (error || !event) {
    return (
      <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>
        <Link to="/events" style={{ color: 'var(--accent)', fontSize: '14px' }}>← Back to Events</Link>
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '32px', marginTop: '16px' }}>
          <h2>Event Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{error}</p>
        </div>
      </div>
    );
  }

  const startDate = new Date(event.startsAt).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' });
  const endDate = new Date(event.endsAt).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' });
  const deadline = new Date(event.registrationClosesAt || event.registrationDeadline).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
  const percentageFilled = Math.min(100, Math.round(((event.registeredCount || 0) / (event.capacity || 100)) * 100));

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 20px' }}>
      <Link to="/events" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, marginBottom: '24px' }}>
        <ArrowLeft size={16} /> Back to all events
      </Link>

      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)', backgroundColor: 'rgba(99, 102, 241, 0.1)', padding: '4px 10px', borderRadius: '6px' }}>
              {event.category.toUpperCase()}
            </span>
            <EventStatusBadge status={event.status === 'published' ? 'UPCOMING' : event.status} isOnline={event.mode === 'online'} />
          </div>

          <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>{event.title}</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Organized by <strong style={{ color: '#FFFFFF' }}>{event.clubName || event.organizer}</strong>
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <Calendar size={18} color="var(--accent)" />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>Start Date & Time</div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{startDate}</div>
                <div style={{ fontSize: '12px', color: '#737373' }}>Ends: {endDate}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <MapPin size={18} color="var(--accent)" />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>Venue</div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {event.venue ? (typeof event.venue === 'string' ? event.venue : `${event.venue.name}, ${event.venue.city}`) : 'Online Room'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <Clock size={18} color="var(--accent)" />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>Registration Deadline</div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{deadline}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <ShieldCheck size={18} color="var(--accent)" />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>Eligibility</div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{event.eligibility}</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <EventRegistration
              event={event}
              onRegistrationChange={(isRegistered) => {
                setEvent((prev) => ({
                  ...prev,
                  isUserRegistered: isRegistered,
                  registeredCount: isRegistered ? (prev.registeredCount || 0) + 1 : Math.max(0, (prev.registeredCount || 0) - 1)
                }));
              }}
            />

            <div style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Capacity Filled</span>
                <span style={{ fontWeight: 600 }}>
                  {event.registeredCount || 0} / {event.capacity} seats ({percentageFilled}%)
                </span>
              </div>
              <div style={{ height: '8px', backgroundColor: '#262626', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${percentageFilled}%`, backgroundColor: percentageFilled >= 100 ? '#EF4444' : 'var(--accent)' }} />
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '12px' }}>About this Event</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
            {event.description}
          </p>
        </div>
      </div>
    </div>
  );
}