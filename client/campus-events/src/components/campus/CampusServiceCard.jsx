import React from 'react';
import { Clock, MapPin, Mail } from 'lucide-react';

export default function CampusServiceCard({ service }) {
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
        transition: 'border-color 0.15s ease'
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#404040')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-color)')}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
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
            {service.category}
          </span>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              padding: '3px 8px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              color: '#34D399',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}
          >
            {service.status}
          </span>
        </div>

        <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
          {service.name}
        </h3>

        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
          {service.description}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={14} color="#A3A3A3" />
            <span>{service.location}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={14} color="#A3A3A3" />
            <span>{service.hours}</span>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px', marginTop: '16px' }}>
        <a
          href={`mailto:${service.contact}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            padding: '8px 0',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 600
          }}
        >
          <Mail size={14} /> Contact Service
        </a>
      </div>
    </div>
  );
}