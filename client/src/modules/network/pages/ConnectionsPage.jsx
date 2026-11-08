import React, { useState } from 'react';
import useConnections from '../hooks/useConnections.js';
import ConnectionRequestCard from '../components/ConnectionRequestCard.jsx';
import { UserCheck, UserPlus, Send, AlertCircle, RefreshCw, Users } from 'lucide-react';

export function ConnectionsPage({
  onSelectStudent = () => {},
}) {
  const {
    connections,
    receivedRequests,
    sentRequests,
    loading,
    error,
    refetch,
    acceptRequest,
    rejectRequest,
    cancelRequest,
    removeConnection,
  } = useConnections();

  const [activeTab, setActiveTab] = useState('accepted'); // 'accepted' | 'received' | 'sent'

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Page Header */}
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
            <UserCheck size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              Connections &amp; Network Requests
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Manage your verified connections and pending requests across colleges.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--border-default)',
          marginBottom: '24px',
          overflowX: 'auto',
        }}
      >
        <button
          type="button"
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'accepted' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            color: activeTab === 'accepted' ? 'var(--text-primary)' : 'var(--text-muted)',
            fontWeight: activeTab === 'accepted' ? '600' : '400',
            padding: '10px 16px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
          }}
          onClick={() => setActiveTab('accepted')}
        >
          <UserCheck size={16} />
          <span>My Connections</span>
          <span
            style={{
              fontSize: '0.725rem',
              padding: '2px 7px',
              borderRadius: 'var(--radius-full)',
              background: activeTab === 'accepted' ? 'var(--accent-glow)' : 'var(--bg-elevated)',
              color: activeTab === 'accepted' ? 'var(--accent-primary)' : 'var(--text-muted)',
            }}
          >
            {connections.length}
          </span>
        </button>

        <button
          type="button"
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'received' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            color: activeTab === 'received' ? 'var(--text-primary)' : 'var(--text-muted)',
            fontWeight: activeTab === 'received' ? '600' : '400',
            padding: '10px 16px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
          }}
          onClick={() => setActiveTab('received')}
        >
          <UserPlus size={16} />
          <span>Received Requests</span>
          {receivedRequests.length > 0 && (
            <span
              style={{
                fontSize: '0.725rem',
                padding: '2px 7px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--accent-warning-bg)',
                color: 'var(--accent-warning)',
                fontWeight: '700',
              }}
            >
              {receivedRequests.length}
            </span>
          )}
        </button>

        <button
          type="button"
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'sent' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            color: activeTab === 'sent' ? 'var(--text-primary)' : 'var(--text-muted)',
            fontWeight: activeTab === 'sent' ? '600' : '400',
            padding: '10px 16px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
          }}
          onClick={() => setActiveTab('sent')}
        >
          <Send size={15} />
          <span>Sent Requests</span>
          <span
            style={{
              fontSize: '0.725rem',
              padding: '2px 7px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-elevated)',
              color: 'var(--text-muted)',
            }}
          >
            {sentRequests.length}
          </span>
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div
          style={{
            background: 'var(--accent-danger-bg)',
            border: '1px solid var(--accent-danger)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={20} style={{ color: 'var(--accent-danger)' }} />
            <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{error}</span>
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={refetch}>
            <RefreshCw size={13} />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1, 2, 3].map((idx) => (
            <div
              key={idx}
              className="card skeleton"
              style={{ height: '76px', borderRadius: 'var(--radius-lg)' }}
            />
          ))}
        </div>
      )}

      {/* Tab 1: Accepted Connections */}
      {!loading && activeTab === 'accepted' && (
        <div>
          {connections.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '48px 24px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-xl)',
              }}
            >
              <Users size={36} style={{ color: 'var(--text-muted)', margin: '0 auto 12px auto' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
                No Connections Yet
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '380px', margin: '0 auto' }}>
                You have not connected with any students yet. Visit the Discovery tab to find peers and send your first
                request!
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {connections.map((conn) => (
                <ConnectionRequestCard
                  key={conn._id}
                  item={conn}
                  type="connection"
                  onRemove={removeConnection}
                  onSelectStudent={onSelectStudent}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Received Requests */}
      {!loading && activeTab === 'received' && (
        <div>
          {receivedRequests.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '48px 24px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-xl)',
              }}
            >
              <UserPlus size={36} style={{ color: 'var(--text-muted)', margin: '0 auto 12px auto' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
                No Received Requests
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                You do not have any pending connection requests from other students.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {receivedRequests.map((req) => (
                <ConnectionRequestCard
                  key={req._id}
                  item={req}
                  type="received"
                  onAccept={acceptRequest}
                  onReject={rejectRequest}
                  onSelectStudent={onSelectStudent}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Sent Requests */}
      {!loading && activeTab === 'sent' && (
        <div>
          {sentRequests.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '48px 24px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-xl)',
              }}
            >
              <Send size={36} style={{ color: 'var(--text-muted)', margin: '0 auto 12px auto' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
                No Sent Requests
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                You have not sent any pending requests.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {sentRequests.map((req) => (
                <ConnectionRequestCard
                  key={req._id}
                  item={req}
                  type="sent"
                  onCancel={cancelRequest}
                  onSelectStudent={onSelectStudent}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ConnectionsPage;

