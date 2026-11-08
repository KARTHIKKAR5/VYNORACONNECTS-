import React from 'react';
import { MapPin, Users, ArrowRight } from 'lucide-react';

export function UpcomingEventsSection({ events = [], onViewAll, onSelectEvent }) {
  return (
    <div className="dashboard-card events-widget-card">
      <div className="card-header-row">
        <div>
          <h3 className="card-title">Upcoming Campus Events</h3>
          <p className="card-subtitle">Hackathons, summits & inter-college workshops</p>
        </div>
        <button
          type="button"
          className="link-btn"
          onClick={onViewAll}
        >
          <span>View All</span>
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="events-card-list">
        {events.length === 0 ? (
          <p className="empty-hint">No scheduled campus events right now.</p>
        ) : (
          events.map((event) => (
            <div key={event.id} className="event-list-item" id={`event-item-${event.id}`}>
              <div className="event-date-badge">
                <span className="date-month">
                  {new Date(event.date).toLocaleString('default', { month: 'short' }).toUpperCase()}
                </span>
                <span className="date-day">
                  {new Date(event.date).getDate()}
                </span>
              </div>

              <div className="event-info">
                <div className="event-title-row">
                  <h4 className="event-name">{event.title}</h4>
                  <span className="event-tag">{event.type}</span>
                </div>

                <div className="event-meta-line">
                  <span className="event-meta-item">
                    <Users size={12} />
                    {event.club || event.organizer}
                  </span>
                  <span className="dot-separator">•</span>
                  <span className="event-meta-item">
                    <MapPin size={12} />
                    {event.location}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-sm btn-outline event-action-btn"
                onClick={() => onSelectEvent(event)}
              >
                View Event
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
