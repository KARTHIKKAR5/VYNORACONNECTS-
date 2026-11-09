import React, { useState, useEffect } from 'react';
import {
  Bookmark,
  Briefcase,
  BookOpen,
  Clock,
  ExternalLink,
  Trash2,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import {
  getSavedOpportunities,
  toggleSaveOpportunity,
  updateOpportunityTrackerStatus,
  TRACKER_STAGES,
} from '../../services/opportunitiesService.js';
import {
  getBookmarkedResources,
  toggleBookmarkResource,
} from '../../services/resourcesService.js';
import { getDeadlineInfo } from '../../utils/deadlineUtils.js';

export function SavedTrackerView({ onSelectOpportunity, onSelectResource }) {
  const [activeSubTab, setActiveSubTab] = useState('opportunities'); // 'opportunities' | 'resources'
  const [savedOpportunities, setSavedOpportunities] = useState([]);
  const [savedResources, setSavedResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [opps, res] = await Promise.all([
        getSavedOpportunities(),
        getBookmarkedResources(),
      ]);
      setSavedOpportunities(opps);
      setSavedResources(res);
    } catch {
      // Graceful fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUnsaveOpportunity = async (oppId) => {
    await toggleSaveOpportunity(oppId);
    setSavedOpportunities(prev => prev.filter(item => (item.opportunity?.id || item.opportunityId) !== oppId));
  };

  const handleUnsaveResource = async (resId) => {
    await toggleBookmarkResource(resId);
    setSavedResources(prev => prev.filter(item => item.id !== resId));
  };

  const handleStageChange = async (oppId, newStage) => {
    await updateOpportunityTrackerStatus(oppId, newStage);
    setSavedOpportunities(prev => prev.map(item => {
      if ((item.opportunity?.id || item.opportunityId) === oppId) {
        return { ...item, trackerStatus: newStage };
      }
      return item;
    }));
  };

  // Partition opportunities by upcoming vs expired
  const upcomingOpps = savedOpportunities.filter(
    item => !getDeadlineInfo(item.opportunity?.deadlineAt).isExpired
  );
  const expiredOpps = savedOpportunities.filter(
    item => getDeadlineInfo(item.opportunity?.deadlineAt).isExpired
  );

  return (
    <div className="saved-tracker-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Personal Saved &amp; Application Tracker</h1>
          <p className="page-subtitle">
            Private workspace tracking your bookmarked study roadmaps, notes, and career opportunity deadlines.
          </p>
        </div>
      </div>

      {/* Sub-Tabs: Saved Opportunities vs Saved Resources */}
      <div className="subtabs-bar" style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <button
          type="button"
          className={`btn ${activeSubTab === 'opportunities' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSubTab('opportunities')}
        >
          <Briefcase size={16} />
          Saved Opportunities ({savedOpportunities.length})
        </button>

        <button
          type="button"
          className={`btn ${activeSubTab === 'resources' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSubTab('resources')}
        >
          <BookOpen size={16} />
          Bookmarked Resources ({savedResources.length})
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading your private bookmarks...
        </div>
      ) : activeSubTab === 'opportunities' ? (
        <div>
          {/* Section: Upcoming Deadlines */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} style={{ color: 'var(--accent-warning)' }} />
              Active Deadlines ({upcomingOpps.length})
            </h3>

            {upcomingOpps.length === 0 ? (
              <div className="card" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No active saved opportunities. Browse the Opportunities Hub to bookmark internships and hackathons.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {upcomingOpps.map(item => {
                  const opp = item.opportunity;
                  const deadlineInfo = getDeadlineInfo(opp?.deadlineAt);
                  return (
                    <div key={opp.id} className="card tracker-card" style={{ padding: '18px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                        <div>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '4px' }}>
                            <span className={`card-type-badge badge-${opp.type || 'internship'}`}>{opp.type}</span>
                            <span className={`deadline-badge urgency-${deadlineInfo.urgency}`}>
                              <Clock size={11} /> {deadlineInfo.label}
                            </span>
                            {opp.isLinkUnavailable && (
                              <span className="link-unavailable-pill" title={opp.linkUnavailableReason || 'External link has not been verified.'}>
                                <AlertTriangle size={11} /> Link unavailable
                              </span>
                            )}
                          </div>

                          <h3
                            style={{ fontSize: '1.05rem', fontWeight: 600, cursor: 'pointer', margin: '4px 0' }}
                            onClick={() => onSelectOpportunity(opp)}
                          >
                            {opp.title}
                          </h3>

                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            {opp.organizerName} &bull; <Calendar size={12} style={{ display: 'inline' }} /> Deadline: {deadlineInfo.formattedDate}
                          </div>
                        </div>

                        {/* Tracker Stage Selector */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <select
                            className="form-select tracker-stage-select"
                            value={item.trackerStatus || 'saved'}
                            onChange={e => handleStageChange(opp.id, e.target.value)}
                            id={`select-stage-${opp.id}`}
                            aria-label={`Application stage for ${opp.title}`}
                            style={{
                              colorScheme: 'dark',
                              backgroundColor: 'var(--bg-card)',
                              color: '#FFFFFF',
                              border: '1px solid var(--border-default)',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.82rem',
                              fontWeight: 600,
                              padding: '6px 30px 6px 12px',
                              minWidth: '175px',
                              cursor: 'pointer',
                              appearance: 'none',
                              WebkitAppearance: 'none',
                              MozAppearance: 'none',
                              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23A3A3A3' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                              backgroundRepeat: 'no-repeat',
                              backgroundPosition: 'right 10px center',
                            }}
                          >
                            {TRACKER_STAGES.map(s => (
                              <option
                                key={s.value}
                                value={s.value}
                                style={{
                                  backgroundColor: '#1B1B1B',
                                  color: '#FFFFFF',
                                }}
                              >
                                {s.label}
                              </option>
                            ))}
                          </select>

                          <button
                            type="button"
                            className="btn-icon"
                            onClick={() => handleUnsaveOpportunity(opp.id)}
                            title="Remove from tracker"
                            style={{ color: 'var(--accent-danger)' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {item.notes && (
                        <div style={{ marginTop: '10px', padding: '8px 12px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                          📝 <em>"{item.notes}"</em>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section: Expired Opportunities */}
          {expiredOpps.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '14px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={16} />
                Past / Closed Deadlines ({expiredOpps.length})
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', opacity: 0.75 }}>
                {expiredOpps.map(item => {
                  const opp = item.opportunity;
                  return (
                    <div key={opp.id} className="card" style={{ padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong>{opp.title}</strong> &bull; {opp.organizerName}
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Closed on {new Date(opp.deadlineAt).toLocaleDateString()} &bull; Stage: {item.trackerStatus}
                        </div>
                      </div>

                      <button
                        type="button"
                        className="btn-icon"
                        onClick={() => handleUnsaveOpportunity(opp.id)}
                        title="Remove expired item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Saved Resources Section */
        <div>
          {savedResources.length === 0 ? (
            <div className="card" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No bookmarked study notes or roadmaps yet. Browse Learning Resources to bookmark materials.
            </div>
          ) : (
            <div className="cards-grid">
              {savedResources.map(resource => (
                <div key={resource.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span className={`card-type-badge badge-${resource.type || 'document'}`}>{resource.type || 'Resource'}</span>
                        {resource.isLinkUnavailable && (
                          <span className="link-unavailable-pill" title={resource.linkUnavailableReason || 'External link has not been verified.'}>
                            <AlertTriangle size={11} /> Link unavailable
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        className="btn-icon"
                        onClick={() => handleUnsaveResource(resource.id)}
                        title="Remove bookmark"
                        style={{ color: 'var(--accent-primary)' }}
                      >
                        <Bookmark size={16} fill="currentColor" />
                      </button>
                    </div>

                    <h3
                      style={{ fontSize: '1rem', fontWeight: 600, cursor: 'pointer', marginBottom: '6px' }}
                      onClick={() => onSelectResource(resource)}
                    >
                      {resource.title}
                    </h3>

                    <div style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', marginBottom: '8px' }}>
                      {resource.category}
                    </div>

                    <p className="card-description" style={{ fontSize: '0.82rem' }}>
                      {resource.description}
                    </p>
                  </div>

                  <div className="card-footer" style={{ marginTop: '14px' }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => onSelectResource(resource)}
                    >
                      View Notes
                    </button>

                    {resource.sourceUrl && (
                      resource.isLinkUnavailable ? (
                        <button
                          type="button"
                          className="btn btn-outline btn-sm btn-disabled-link"
                          disabled
                          title={resource.linkUnavailableReason || 'External link has not been verified.'}
                          aria-disabled="true"
                        >
                          <ExternalLink size={13} /> Link unavailable
                        </button>
                      ) : (
                        <a
                          href={resource.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline btn-sm"
                        >
                          <ExternalLink size={13} /> Open
                        </a>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

