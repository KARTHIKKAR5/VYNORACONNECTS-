import React from 'react';

function ActivityCard({ icon, title, description, time, type, status }) {
  return (
    <div className="activity-card-item">
      <div className="activity-card-header">
        <div className="activity-card-icon-title">
          {icon && <span className="activity-card-icon">{icon}</span>}
          <div>
            <h4 className="activity-card-title">{title}</h4>
            {type && <span className="activity-card-type">{type}</span>}
          </div>
        </div>
        {status && <span className="activity-card-status">{status}</span>}
      </div>

      {description && (
        <p className="activity-card-desc">{description}</p>
      )}

      {time && (
        <div className="activity-card-footer">
          <span className="activity-card-time">{time}</span>
        </div>
      )}
    </div>
  );
}

export default ActivityCard;
