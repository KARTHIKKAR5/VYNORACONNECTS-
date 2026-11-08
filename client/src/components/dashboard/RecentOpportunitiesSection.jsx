import React, { useState } from 'react';
import { MapPin, Bookmark, ArrowRight, Clock } from 'lucide-react';
import { toggleSaveOpportunity, isOpportunitySaved } from '../../services/dashboardService.js';

export function RecentOpportunitiesSection({ opportunities = [], onViewAll, onSelectOpportunity }) {
  const [savedMap, setSavedMap] = useState({});

  const handleSaveToggle = async (e, oppId) => {
    e.stopPropagation();
    const res = await toggleSaveOpportunity(oppId);
    setSavedMap((prev) => ({
      ...prev,
      [oppId]: res.saved,
    }));
  };

  const formatDeadline = (iso) => {
    try {
      const date = new Date(iso);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Rolling';
    }
  };

  return (
    <div className="dashboard-card opportunities-widget-card">
      <div className="card-header-row">
        <div>
          <h3 className="card-title">Latest Student Opportunities</h3>
          <p className="card-subtitle">Curated internships, hackathons & research grants</p>
        </div>
        <button
          type="button"
          className="link-btn"
          onClick={onViewAll}
        >
          <span>All Opportunities</span>
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="opportunities-card-list">
        {opportunities.map((opp) => {
          const isSaved = savedMap[opp.id] ?? isOpportunitySaved(opp.id);

          return (
            <div key={opp.id} className="opportunity-preview-item" id={`opp-preview-${opp.id}`}>
              <div className="opp-header">
                <div className="opp-meta-top">
                  <span className="opp-type-badge">{opp.type || opp.category}</span>
                  <span className="opp-deadline">
                    <Clock size={11} />
                    Deadline: {formatDeadline(opp.deadline)}
                  </span>
                </div>

                <button
                  type="button"
                  className={`btn-icon save-btn ${isSaved ? 'saved' : ''}`}
                  onClick={(e) => handleSaveToggle(e, opp.id)}
                  title={isSaved ? 'Remove from saved' : 'Save opportunity'}
                  aria-label="Save opportunity"
                >
                  <Bookmark size={15} fill={isSaved ? '#10B981' : 'none'} color={isSaved ? '#10B981' : 'currentColor'} />
                </button>
              </div>

              <h4 className="opp-title">{opp.title}</h4>
              <div className="opp-org-line">{opp.organization}</div>

              <div className="opp-footer">
                <div className="opp-location-stipend">
                  <span className="opp-location">
                    <MapPin size={12} />
                    {opp.location || 'Remote / Hybrid'}
                  </span>
                  {opp.stipendOrPrize && (
                    <span className="opp-stipend">{opp.stipendOrPrize}</span>
                  )}
                </div>

                <div className="opp-actions">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline"
                    onClick={() => onSelectOpportunity(opp)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
