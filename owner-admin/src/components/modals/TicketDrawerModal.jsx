import React, { useState } from 'react';
import { X, Send, LifeBuoy, User, Shield, CheckCircle2, Clock } from 'lucide-react';
import StatusBadge from '../common/StatusBadge.jsx';

export function TicketDrawerModal({
  ticket,
  isOpen,
  onClose,
  onReply,
  onStatusChange,
}) {
  const [replyText, setReplyText] = useState('');
  const [statusVal, setStatusVal] = useState(ticket?.status || 'open');

  if (!isOpen || !ticket) return null;

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onReply(ticket.id, replyText.trim(), statusVal);
    setReplyText('');
  };

  const handleStatusUpdate = (newStatus) => {
    setStatusVal(newStatus);
    onStatusChange(ticket.id, newStatus);
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="ticket-modal-title">
      <div className="modal-container modal-lg" style={{ height: '85vh' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: 'var(--color-info-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LifeBuoy size={20} color="var(--color-info)" />
            </div>
            <div>
              <h2 className="modal-title" id="ticket-modal-title">Ticket #{ticket.id}: {ticket.subject}</h2>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '2px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{ticket.userName} ({ticket.collegeName})</span>
                <StatusBadge status={ticket.category} customLabel={ticket.category} />
                <StatusBadge status={ticket.priority} customLabel={`${ticket.priority.toUpperCase()} PRIORITY`} />
                <StatusBadge status={ticket.status} />
              </div>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Quick status bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: 12 }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Created: <strong>{new Date(ticket.createdAt).toLocaleString()}</strong>
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Ticket State:</label>
              <select
                className="form-select"
                style={{ padding: '4px 8px', fontSize: '0.8rem', width: 'auto' }}
                value={statusVal}
                onChange={(e) => handleStatusUpdate(e.target.value)}
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          {/* Conversation Thread */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14, padding: '10px 4px' }}>
            {ticket.messages && ticket.messages.map((msg) => {
              const isOwner = msg.sender === 'owner';
              return (
                <div
                  key={msg.id}
                  style={{
                    alignSelf: isOwner ? 'flex-end' : 'flex-start',
                    maxWidth: '82%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-muted)', justifyContent: isOwner ? 'flex-end' : 'flex-start' }}>
                    {isOwner ? <Shield size={12} color="var(--color-info)" /> : <User size={12} />}
                    <strong>{msg.senderName}</strong>
                    <span>• {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div
                    style={{
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-lg)',
                      fontSize: '0.88rem',
                      lineHeight: 1.5,
                      backgroundColor: isOwner ? 'var(--color-info)' : 'var(--bg-surface-elevated)',
                      color: isOwner ? '#FFFFFF' : 'var(--text-primary)',
                      border: isOwner ? 'none' : '1px solid var(--border-subtle)',
                      boxShadow: 'var(--shadow-xs)',
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reply Form */}
          <form onSubmit={handleSendReply} style={{ marginTop: 'auto', borderTop: '1px solid var(--border-subtle)', paddingTop: 14 }}>
            <div className="form-group">
              <label className="form-label">Post Official Admin Response</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Type your response to the student..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!replyText.trim()}
              >
                <Send size={15} /> Send Reply &amp; Update State
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TicketDrawerModal;
