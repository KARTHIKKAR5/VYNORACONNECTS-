import React, { useState, useEffect } from 'react';
import { PulseFilters } from './PulseFilters.jsx';
import { PulseCard } from './PulseCard.jsx';
import { getPulseFeed } from '../../services/pulseService.js';
import { EmptyState } from '../common/EmptyState.jsx';
import { LoadingSkeleton } from '../common/LoadingSkeleton.jsx';
import { Activity, RefreshCw, ChevronDown } from 'lucide-react';

export function PulseFeed({ onActivityAction }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchFeed = async (filterId, pageNum = 1, append = false) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const res = await getPulseFeed({ filter: filterId, page: pageNum, limit: 4 });
      if (append) {
        setItems((prev) => [...prev, ...(res.data || [])]);
      } else {
        setItems(res.data || []);
      }
      setHasMore(res.pagination?.hasMore || false);
      setPage(pageNum);
    } catch (err) {
      console.error('Pulse feed error:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchFeed(activeFilter, 1, false);
  }, [activeFilter]);

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchFeed(activeFilter, page + 1, true);
    }
  };

  return (
    <section className="pulse-feed-section" aria-label="Vynora Pulse Activity Feed">
      <div className="section-header">
        <div>
          <div className="section-title-with-badge">
            <h2 className="section-title">Vynora Pulse</h2>
            <span className="live-indicator-pill">
              <span className="live-dot" />
              Live Campus Feed
            </span>
          </div>
          <p className="section-subtitle">Real-time collaboration across participating student colleges</p>
        </div>

        <button
          type="button"
          className="btn-icon"
          onClick={() => fetchFeed(activeFilter, 1, false)}
          title="Refresh feed"
          aria-label="Refresh feed"
        >
          <RefreshCw size={15} className={loading ? 'spin-animation' : ''} />
        </button>
      </div>

      <PulseFilters activeFilter={activeFilter} onFilterChange={handleFilterChange} />

      <div className="pulse-feed-list">
        {loading ? (
          <div className="pulse-skeleton-container">
            <LoadingSkeleton count={3} />
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon={Activity}
            title="No activity yet in this channel"
            description="Be the first to publish a project, share study notes, or announce a campus event!"
          />
        ) : (
          <>
            {items.map((activity) => (
              <PulseCard
                key={activity.id}
                activity={activity}
                onActionClick={onActivityAction}
              />
            ))}

            {hasMore && (
              <div className="pulse-pagination-wrapper">
                <button
                  type="button"
                  className="btn btn-outline pulse-load-more-btn"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  id="pulse-load-more"
                >
                  <ChevronDown size={16} />
                  <span>{loadingMore ? 'Loading Activities...' : 'Load Older Activities'}</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
