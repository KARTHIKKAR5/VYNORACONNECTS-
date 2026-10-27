import React, { useState, useEffect, useCallback } from 'react';
import { Plus, AlertTriangle, RotateCcw, Info } from 'lucide-react';
import { ResourceCard } from '../components/resources/ResourceCard.jsx';
import { ResourceFilters } from '../components/resources/ResourceFilters.jsx';
import { ResourceDetails } from '../components/resources/ResourceDetails.jsx';
import { CreateResourceModal } from '../components/resources/CreateResourceModal.jsx';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import { getResources } from '../services/resourcesService.js';

export function ResourcesPage({ onStatusUpdate }) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filters state
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [type, setType] = useState('all');

  const fetchResources = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getResources({ search, category, type });
      setResources(result.data);
      if (onStatusUpdate) {
        onStatusUpdate(result.isLiveBackend);
      }
    } catch (err) {
      setError(err.message || 'Failed to load educational resources.');
    } finally {
      setLoading(false);
    }
  }, [search, category, type, onStatusUpdate]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setType('all');
  };

  const handleResourceCreated = (newResource) => {
    setSelectedResource(newResource);
    fetchResources();
  };

  // If viewing details
  if (selectedResource) {
    return (
      <ResourceDetails
        resource={selectedResource}
        onBack={() => setSelectedResource(null)}
      />
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Educational Resources &amp; Roadmaps</h1>
          <p className="page-subtitle">
            Curated student notes, structured learning roadmaps, system design guides, and DSA cheat sheets shared across colleges.
          </p>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
            id="btn-open-create-resource"
          >
            <Plus size={16} />
            Share Resource
          </button>
        </div>
      </div>

      <div className="alert-info">
        <Info size={16} style={{ flexShrink: 0 }} />
        <span>
          Week 1 resources module is live. Search by topic or filter by category. All external documentation and notes links are validated.
        </span>
      </div>

      <ResourceFilters
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        type={type}
        setType={setType}
        totalResults={resources.length}
        onReset={handleResetFilters}
      />

      {/* States handling */}
      {loading ? (
        <LoadingSkeleton count={6} />
      ) : error ? (
        <div className="error-banner">
          <AlertTriangle size={24} className="error-banner-icon" />
          <div style={{ flex: 1 }}>
            <div className="error-title">Unable to Load Resources</div>
            <div className="error-desc">{error}</div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ marginTop: '12px' }}
              onClick={fetchResources}
              id="btn-retry-resources"
            >
              <RotateCcw size={14} />
              Retry Request
            </button>
          </div>
        </div>
      ) : resources.length === 0 ? (
        <EmptyState
          title={search || category !== 'All' || type !== 'all' ? 'No matching resources' : 'No resources available yet'}
          description={
            search || category !== 'All' || type !== 'all'
              ? `No resources match your search "${search || category}". Try resetting your filters to explore more topics.`
              : 'Be the first student to publish notes or a roadmap to help your peers.'
          }
          onReset={handleResetFilters}
          actionLabel="Clear Filters"
        />
      ) : (
        <div className="cards-grid">
          {resources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onSelect={setSelectedResource}
            />
          ))}
        </div>
      )}

      {/* Submission Modal */}
      <CreateResourceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={handleResourceCreated}
      />
    </div>
  );
}
