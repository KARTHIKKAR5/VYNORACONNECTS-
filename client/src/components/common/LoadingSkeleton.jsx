import React from 'react';

export function LoadingSkeleton({ count = 6 }) {
  return (
    <div className="cards-grid" role="status" aria-label="Loading content">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="skeleton-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
            <div className="skeleton-line" style={{ height: '22px', width: '80px' }} />
            <div className="skeleton-line" style={{ height: '22px', width: '60px' }} />
          </div>
          <div className="skeleton-line" style={{ height: '24px', width: '85%' }} />
          <div className="skeleton-line" style={{ height: '16px', width: '60%' }} />
          <div className="skeleton-line" style={{ height: '48px', width: '100%' }} />
          <div style={{ display: 'flex', gap: '8px' }}>
            <div className="skeleton-line" style={{ height: '20px', width: '50px' }} />
            <div className="skeleton-line" style={{ height: '20px', width: '65px' }} />
            <div className="skeleton-line" style={{ height: '20px', width: '45px' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '16px' }}>
            <div className="skeleton-line" style={{ height: '18px', width: '90px' }} />
            <div className="skeleton-line" style={{ height: '32px', width: '110px' }} />
          </div>
        </div>
      ))}
    </div>
  );
}
