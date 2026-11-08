import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, CheckCircle2 } from 'lucide-react';
import EventStatusBadge from './EventStatusBadge';

export default function EventCard({ event }) {
  // Format human-friendly date and time
  const startDate = new Date(event.startAt).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
  const startTime = new Date(event.startAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const percentageFilled = Math.min(100, Math.round((event.registeredCount / event.capacity) * 100));

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.15s ease, border-color 0.15s ease',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#404040';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-color)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div>
        {/* Top Bar: Category & Status */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--accent)',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              padding: '4px 10px',
              borderRadius: '6px'
            }}
          >
            {event.category}
          </span>
          <EventStatusBadge status={event.status} isOnline={event.isOnline} />
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: '18px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '8px',
            lineHeight: 1.3
          }}
        >
          {event.title}
        </h3>

        {/* Organizer */}
        <p
          style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            marginBottom: '16px'
          }}
        >
          By <strong style={{ color: '#E5E5E5' }}>{event.organizer}</strong>
        </p>

        {/* Meta Info: Date & Venue */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            <Calendar size={15} color="#A3A3A3" />
            <span>{startDate} • {startTime}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            <MapPin size={15} color="#A3A3A3" />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {event.location}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Area: Capacity & Action Button */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px', marginTop: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <Users size={14} />
            <span>
              {event.registeredCount} / {event.capacity} seats ({percentageFilled}%)
            </span>
          </div>

          {/* User Registration indicator */}
          {event.isUserRegistered && (
            <span
              style={{
                fontSize: '12px',
                color: '#34D399',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 600
              }}
            >
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
            fontWeight: 600,
            transition: 'background-color 0.15s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#262626')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-elevated)')}
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}