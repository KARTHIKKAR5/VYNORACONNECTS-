import React from 'react';

// Sub-component illustrating component composition and prop drilling
function EventCard({ title, date, location, category }) {
  return (
    <div className="preview-card event-card">
      <div className="preview-card-top">
        <span className="badge badge-event">{category}</span>
        <span className="preview-meta-date">📅 {date}</span>
      </div>
      <h4 className="preview-card-title">{title}</h4>
      <p className="preview-meta-location">📍 {location}</p>
    </div>
  );
}

function EventPreview({ events }) {
  // Sample events with realistic campus data
  const defaultEvents = [
    {
      id: 'evt-1',
      title: 'Vynora Campus Hackathon 2026',
      date: 'Oct 24, 2026',
      location: 'Tech Park Auditorium • Hybrid',
      category: 'Hackathon'
    },
    {
      id: 'evt-2',
      title: 'React & Frontend Placement Masterclass',
      date: 'Oct 18, 2026',
      location: 'CSE Lab 402 • Room B',
      category: 'Workshop'
    }
  ];

  const eventList = events !== undefined ? events : defaultEvents;

  return (
    <section className="preview-section">
      <div className="section-header">
        <h3 className="section-main-heading">Upcoming Events</h3>
        <span className="section-badge">{eventList.length} events</span>
      </div>

      {eventList.length === 0 ? (
        <div className="empty-state-card">
          <span className="empty-state-icon">🗓️</span>
          <p className="empty-state-text">No upcoming campus events scheduled.</p>
          <span className="empty-state-sub">New workshops and competitions will appear here soon.</span>
        </div>
      ) : (
        <div className="preview-grid">
          {eventList.map((event) => (
            <EventCard
              key={event.id}
              title={event.title}
              date={event.date}
              location={event.location}
              category={event.category}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default EventPreview;
