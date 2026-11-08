import React, { useState, useEffect } from 'react';
import { Search, LifeBuoy, Eye, MessageSquare, CheckCircle2, Clock } from 'lucide-react';
import { adminApi } from '../../services/adminApi.js';
import { useToast } from '../../context/ToastContext.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import TicketDrawerModal from '../../components/modals/TicketDrawerModal.jsx';

export function SupportTicketsPage({ onCountsChange }) {
  const { showToast } = useToast();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Modal
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fetchTickets = async () => {
    try {
      const res = await adminApi.getSupportTickets({
        search,
        status: statusFilter,
        category: categoryFilter,
        priority: priorityFilter,
      });
      setTickets(res.data);
      if (onCountsChange) onCountsChange();
    } catch (err) {
      console.error(err);
      showToast('Failed to load support tickets', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [search, statusFilter, categoryFilter, priorityFilter]);

  // Reply handler
  const handleReply = async (ticketId, message, newStatus) => {
    try {
      const res = await adminApi.replyToSupportTicket(ticketId, { message, newStatus });
      showToast('Official response posted to ticket thread.', 'success');
      setSelectedTicket(res.data);
      fetchTickets();
    } catch (err) {
      showToast(err.message || 'Reply failed', 'error');
    }
  };

  // Status change handler
  const handleStatusChange = async (ticketId, status) => {
    try {
      const res = await adminApi.updateTicketStatus(ticketId, { status });
      showToast(`Ticket status updated to "${status}".`, 'info');
      setSelectedTicket(res.data);
      fetchTickets();
    } catch (err) {
      showToast(err.message || 'Update failed', 'error');
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Support Tickets Helpdesk</h1>
          <p className="page-header-subtitle">
            Direct communication channel with students, club organizers, and institutional coordinators.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="filter-toolbar">
        <div className="filter-group-left">
          <div className="filter-search">
            <Search size={16} className="filter-search-icon" />
            <input
              type="text"
              className="filter-search-input"
              placeholder="Search by ticket subject, student, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          <select
            className="filter-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="Club Management">Club Management</option>
            <option value="Account">Account</option>
            <option value="Verification">Verification</option>
            <option value="Bug Report">Bug Report</option>
            <option value="General">General</option>
          </select>

          <select
            className="filter-select"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>
        </div>

        <span className="filter-summary">
          Showing <strong>{tickets.length}</strong> support tickets
        </span>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Ticket ID &amp; Subject</th>
                <th>Student Requester</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Last Activity</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.length > 0 ? (
                tickets.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <div className="table-title-cell">
                        <span className="cell-primary">{t.subject}</span>
                        <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
                          <span className="cell-code">#{t.id}</span>
                          <span className="cell-secondary">{t.collegeName}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="table-title-cell">
                        <span style={{ fontWeight: 600 }}>{t.userName}</span>
                        <span className="cell-secondary">{t.userEmail}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-purple">{t.category}</span>
                    </td>
                    <td>
                      <StatusBadge status={t.priority} />
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {new Date(t.updatedAt || t.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={t.status} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setSelectedTicket(t);
                          setDrawerOpen(true);
                        }}
                        title="View conversation and reply"
                      >
                        <MessageSquare size={14} /> Open Thread ({t.messages?.length || 1})
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>
                    <div className="empty-state">
                      <LifeBuoy size={32} className="empty-state-icon" />
                      <div className="empty-state-title">No support tickets found</div>
                      <p className="empty-state-desc">
                        No support inquiries match the current filter selection.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Drawer Modal */}
      <TicketDrawerModal
        ticket={selectedTicket}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onReply={handleReply}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}

export default SupportTicketsPage;
