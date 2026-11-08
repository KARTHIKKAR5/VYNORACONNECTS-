import React from 'react';
import { Star, Calendar, ArrowRight } from 'lucide-react';

export function MentorshipPreviewSection({ mentors = [], onViewMentorship, onSelectMentor }) {
  return (
    <div className="dashboard-card mentorship-card">
      <div className="card-header-row">
        <div>
          <h3 className="card-title">Campus Mentorship</h3>
          <p className="card-subtitle">Connect with verified seniors & alumni</p>
        </div>
        <button
          type="button"
          className="link-btn"
          onClick={onViewMentorship}
        >
          <span>All Mentors</span>
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="mentors-list">
        {mentors.map((mentor) => (
          <div key={mentor.id} className="mentor-item" id={`mentor-item-${mentor.id}`}>
            <div className="mentor-header">
              {mentor.avatar ? (
                <img src={mentor.avatar} alt={mentor.name} className="mentor-avatar" />
              ) : (
                <div className="mentor-avatar-fallback">{mentor.name.charAt(0)}</div>
              )}

              <div className="mentor-title-block">
                <div className="mentor-name-line">
                  <span className="mentor-name">{mentor.name}</span>
                  {mentor.rating && (
                    <span className="mentor-rating">
                      <Star size={12} fill="#F59E0B" color="#F59E0B" />
                      {mentor.rating}
                    </span>
                  )}
                </div>
                <span className="mentor-org">{mentor.collegeOrCompany}</span>
              </div>
            </div>

            <div className="mentor-expertise-tags">
              {mentor.expertise?.map((exp) => (
                <span key={exp} className="expertise-badge">
                  {exp}
                </span>
              ))}
            </div>

            <div className="mentor-footer">
              <div className="mentor-availability">
                <Calendar size={12} />
                <span>{mentor.availability}</span>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-outline"
                onClick={() => onSelectMentor(mentor)}
              >
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

