import React from 'react';
import useStudentSearch from '../hooks/useStudentSearch.js';
import StudentCard from '../components/StudentCard.jsx';
import StudentSearchBar from '../components/StudentSearchBar.jsx';
import StudentFilters from '../components/StudentFilters.jsx';
import { Users, AlertCircle, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

export function DiscoverStudentsPage({
  onSelectStudent = () => {},
}) {
  const {
    params,
    students,
    meta,
    loading,
    error,
    isLive,
    updateFilters,
    resetFilters,
    setPage,
    refetch,
    handleConnect,
    handleCancelRequest,
    handleAcceptRequest,
    handleRejectRequest,
    handleRemoveConnection,
  } = useStudentSearch();

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Header Banner */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-glow)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-primary)',
            }}
          >
            <Users size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              Campus Network &amp; Student Discovery
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Discover peers across colleges, explore skill sets, and expand your academic network.
            </p>
          </div>
        </div>
      </div>

      {/* Search Input Bar */}
      <div style={{ marginBottom: '16px' }}>
        <StudentSearchBar
          value={params.search}
          onChange={(search) => updateFilters({ search, page: 1 })}
          placeholder="Search students by name, college, department, or technical skill..."
        />
      </div>

      {/* Filter Component */}
      <StudentFilters
        filters={params}
        onChange={updateFilters}
        onReset={resetFilters}
        totalResults={meta.total}
      />

      {/* Error State */}
      {error && (
        <div
          style={{
            background: 'var(--accent-danger-bg)',
            border: '1px solid var(--accent-danger)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertCircle size={22} style={{ color: 'var(--accent-danger)' }} />
            <div>
              <strong style={{ color: 'var(--accent-danger)', fontSize: '0.95rem' }}>Failed to load students</strong>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '2px 0 0 0' }}>{error}</p>
            </div>
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={refetch}>
            <RefreshCw size={14} />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '16px',
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="card skeleton"
              style={{
                height: '240px',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-default)',
                padding: '20px',
              }}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && students.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '48px 24px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-xl)',
            marginTop: '12px',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-elevated)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              color: 'var(--text-muted)',
            }}
          >
            <Users size={28} />
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
            No Students Found
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', maxWidth: '420px', margin: '0 auto 20px auto' }}>
            No student profiles matched your current search and filter criteria. Try adjusting your filters or clearing
            the search query.
          </p>
          <button type="button" className="btn btn-secondary" onClick={resetFilters}>
            Reset All Filters
          </button>
        </div>
      )}

      {/* Students Directory Grid */}
      {!loading && !error && students.length > 0 && (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '18px',
            }}
          >
            {students.map((student) => (
              <StudentCard
                key={student._id}
                student={student}
                onSelectStudent={onSelectStudent}
                onConnect={handleConnect}
                onCancel={handleCancelRequest}
                onAccept={handleAcceptRequest}
                onReject={handleRejectRequest}
                onRemove={handleRemoveConnection}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {meta.totalPages > 1 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                marginTop: '32px',
              }}
            >
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={meta.page <= 1}
                onClick={() => setPage(meta.page - 1)}
              >
                <ChevronLeft size={16} />
                <span>Previous</span>
              </button>

              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Page <strong>{meta.page}</strong> of <strong>{meta.totalPages}</strong>
              </span>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={meta.page >= meta.totalPages}
                onClick={() => setPage(meta.page + 1)}
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default DiscoverStudentsPage;

