import React from 'react';

export function LoadingSkeleton({ count = 6 }) {
  return (
    <div className="cards-grid">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="card skeleton-card">
          <div className="skeleton-line" style={{ width: '40%', height: '14px', marginBottom: '16px' }} />
          <div className="skeleton-line" style={{ width: '80%', height: '22px', marginBottom: '10px' }} />
          <div className="skeleton-line" style={{ width: '100%', height: '14px', marginBottom: '6px' }} />
          <div className="skeleton-line" style={{ width: '90%', height: '14px', marginBottom: '20px' }} />
          <div className="skeleton-line" style={{ width: '50%', height: '14px' }} />
        </div>
      ))}
    </div>
  );
}

