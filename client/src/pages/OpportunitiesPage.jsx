import React, { useState, useEffect, useCallback } from 'react';
import { Plus, AlertTriangle, RotateCcw, Info } from 'lucide-react';
import { OpportunityCard } from '../components/opportunities/OpportunityCard.jsx';
import { OpportunityFilters } from '../components/opportunities/OpportunityFilters.jsx';
import { OpportunityDetails } from '../components/opportunities/OpportunityDetails.jsx';
import { CreateOpportunityModal } from '../components/opportunities/CreateOpportunityModal.jsx';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import { getOpportunities } from '../services/opportunitiesService.js';

export function OpportunitiesPage({ onStatusUpdate }) {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filters state
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const [deadlineStatus, setDeadlineStatus] = useState('all');

  const fetchOpportunities = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getOpportunities({ search, type, deadlineStatus });
      setOpportunities(result.data);
      if (onStatusUpdate) {
        onStatusUpdate(result.isLiveBackend);
      }
    } catch (err) {
      setError(err.message || 'Failed to load student opportunities.');
    } finally {
      setLoading(false);
    }
  }, [search, type, deadlineStatus, onStatusUpdate]);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  const handleResetFilters = () => {
    setSearch('');
    setType('all');
    setDeadlineStatus('all');
  };

  const handleOpportunityCreated = (newOpp) => {
    setSelectedOpportunity(newOpp);
    fetchOpportunities();
  };

  if (selectedOpportunity) {
    return (
      <OpportunityDetails
        opportunity={selectedOpportunity}
        onBack={() => setSelectedOpportunity(null)}
      />
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Student Opportunities &amp; Fellowships</h1>
          <p className="page-subtitle">
            Discover active internships, graduate tech jobs, hackathons, coding contests, and merit scholarships for college students.
          </p>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
            id="btn-open-create-opp"
          >
            <Plus size={16} />
            Post Opportunity
          </button>
        </div>
      </div>

      <div className="alert-info">
        <Info size={16} style={{ flexShrink: 0 }} />
        <span>
          Real-time deadline indicators evaluate closing dates dynamically. Expired opportunities are visibly tagged to prevent wasted applications.
        </span>
      </div>

      <OpportunityFilters
        search={search}
        setSearch={setSearch}
        type={type}
        setType={setType}
        deadlineStatus={deadlineStatus}
        setDeadlineStatus={setDeadlineStatus}
        totalResults={opportunities.length}
        onReset={handleResetFilters}
      />

      {/* States Handling */}
      {loading ? (
        <LoadingSkeleton count={6} />
      ) : error ? (
        <div className="error-banner">
          <AlertTriangle size={24} className="error-banner-icon" />
          <div style={{ flex: 1 }}>
            <div className="error-title">Unable to Load Opportunities</div>
            <div className="error-desc">{error}</div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ marginTop: '12px' }}
              onClick={fetchOpportunities}
              id="btn-retry-opps"
            >
              <RotateCcw size={14} />
              Retry Request
            </button>
          </div>
        </div>
      ) : opportunities.length === 0 ? (
        <EmptyState
          title={search || type !== 'all' || deadlineStatus !== 'all' ? 'No matching opportunities' : 'No opportunities listed yet'}
          description={
            search || type !== 'all' || deadlineStatus !== 'all'
              ? `No opportunities match your filter criteria. Try expanding your search or selecting a different opportunity type.`
              : 'Post the first internship, hackathon, or scholarship to share with your peers.'
          }
          onReset={handleResetFilters}
          actionLabel="Clear Filters"
        />
      ) : (
        <div className="cards-grid">
          {opportunities.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              onSelect={setSelectedOpportunity}
            />
          ))}
        </div>
      )}

      {/* Submission Modal */}
      <CreateOpportunityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={handleOpportunityCreated}
      />
    </div>
  );
}
