import React, { useState, useEffect } from 'react';
import {
  UploadCloud,
  CheckCircle2,
  Clock,
  XCircle,
  Briefcase,
  BookOpen,
  Calendar,
} from 'lucide-react';
import { getMySubmittedOpportunities } from '../../services/opportunitiesService.js';
import { getMySubmittedResources } from '../../services/resourcesService.js';

export function MySubmissionsView() {
  const [activeSubTab, setActiveSubTab] = useState('opportunities');
  const [opportunities, setOpportunities] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubmissions() {
      setLoading(true);
      try {
        const [opps, res] = await Promise.all([
          getMySubmittedOpportunities(),
          getMySubmittedResources(),
        ]);
        setOpportunities(opps);
        setResources(res);
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    }
    fetchSubmissions();
  }, []);

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'published':
        return (
          <span className="verified-pill" style={{ backgroundColor: 'var(--accent-success-bg)', color: 'var(--accent-success)' }}>
            <CheckCircle2 size={12} /> Approved &amp; Published
          </span>
        );
      case 'rejected':
        return (
          <span className="unverified-pill" style={{ backgroundColor: 'var(--accent-danger-bg)', color: 'var(--accent-danger)' }}>
            <XCircle size={12} /> Changes Requested / Declined
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="unverified-pill" style={{ backgroundColor: 'var(--accent-warning-bg)', color: 'var(--accent-warning)' }}>
            <Clock size={12} /> Under Moderation Review
          </span>
        );
    }
  };

  return (
    <div className="submissions-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Contributions &amp; Submissions</h1>
          <p className="page-subtitle">
            Track review status for opportunities and academic resources you submitted to the platform.
          </p>
        </div>
      </div>

      <div className="subtabs-bar" style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <button
          type="button"
          className={`btn ${activeSubTab === 'opportunities' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSubTab('opportunities')}
        >
          <Briefcase size={16} />
          Opportunities ({opportunities.length})
        </button>

        <button
          type="button"
          className={`btn ${activeSubTab === 'resources' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSubTab('resources')}
        >
          <BookOpen size={16} />
          Resources ({resources.length})
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading your submission history...
        </div>
      ) : activeSubTab === 'opportunities' ? (
        opportunities.length === 0 ? (
          <div className="card" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
            You haven't submitted any opportunities yet. Click "Post Opportunity" in the Opportunities Hub to share internships or hackathons.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {opportunities.map(opp => (
              <div key={opp.id} className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                      <span className={`card-type-badge badge-${opp.type || 'hackathon'}`}>{opp.type}</span>
                      {renderStatusBadge(opp.status)}
                    </div>

                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{opp.title}</h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      {opp.organizerName} &bull; <Calendar size={13} style={{ display: 'inline' }} /> Submitted on {new Date(opp.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Deadline: {new Date(opp.deadlineAt).toLocaleDateString()}
                  </div>
                </div>

                <p style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {opp.description}
                </p>

                {opp.status === 'pending' && (
                  <div style={{ marginTop: '12px', padding: '10px 14px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    ℹ️ This listing will become visible on the public Opportunities Hub once verified by Revanth's moderation team.
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      ) : (
        resources.length === 0 ? (
          <div className="card" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
            You haven't contributed any study materials or notes yet. Click "Share Resource" to upload study notes.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {resources.map(res => (
              <div key={res.id} className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                      <span className={`card-type-badge badge-${res.type || 'document'}`}>{res.type}</span>
                      <span className="tag-badge">{res.topic}</span>
                      {renderStatusBadge(res.status)}
                    </div>

                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{res.title}</h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Category: {res.category} &bull; Department: {res.branch}
                    </div>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {new Date(res.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <p style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {res.description}
                </p>

                {res.status === 'pending' && (
                  <div style={{ marginTop: '12px', padding: '10px 14px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    ℹ️ Awaiting academic moderation review before appearing in the public Resources catalog.
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

