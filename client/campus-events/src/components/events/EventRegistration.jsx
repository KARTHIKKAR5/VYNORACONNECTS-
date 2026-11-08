import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { clubsEventsApi } from '../../services/clubsEventsApi';

export default function EventRegistration({ event, onRegistrationChange }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const isPast = event.status === 'PAST';
  const isCancelled = event.status === 'CANCELLED';
  const deadlineDate = new Date(event.registrationClosesAt || event.registrationDeadline);
  const isDeadlinePassed = deadlineDate < new Date();
  const isFull = (event.registeredCount || 0) >= event.capacity;

  const handleRegister = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await clubsEventsApi.registerForEvent(event.id);
      setSuccessMsg(res.message || 'Registration confirmed successfully!');
      onRegistrationChange(true);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to complete registration.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel your registration for this event?')) {
      return;
    }

    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await clubsEventsApi.cancelRegistration(event.id);
      setSuccessMsg(res.message || 'Registration successfully cancelled.');
      onRegistrationChange(false);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to cancel registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-elevated)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}
    >
      <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
        Registration Status
      </h3>

      {errorMsg && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '12px', color: '#FCA5A5', fontSize: '13px' }}>
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', padding: '12px', color: '#6EE7B7', fontSize: '13px' }}>
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {event.isUserRegistered ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34D399', fontSize: '14px', fontWeight: 600 }}>
            <CheckCircle2 size={18} />
            <span>You have a confirmed registration for this event.</span>
          </div>

          <button
            onClick={handleCancel}
            disabled={loading}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #EF4444',
              color: '#EF4444',
              borderRadius: '8px',
              padding: '10px 16px',
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            {loading && <Loader2 size={16} className="spinner" />}
            Cancel My Registration
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {isCancelled ? (
            <p style={{ fontSize: '13px', color: '#F87171' }}>This event was cancelled by the organizer.</p>
          ) : isPast ? (
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>This event has already ended.</p>
          ) : isDeadlinePassed ? (
            <p style={{ fontSize: '13px', color: '#F87171' }}>Registration closed on {deadlineDate.toLocaleDateString()}.</p>
          ) : isFull ? (
            <p style={{ fontSize: '13px', color: '#F87171' }}>This event is at maximum capacity ({event.capacity} seats filled).</p>
          ) : (
            <button
              onClick={handleRegister}
              disabled={loading}
              style={{
                backgroundColor: 'var(--accent)',
                color: '#FFFFFF',
                borderRadius: '8px',
                padding: '12px 18px',
                fontSize: '14px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 2px 10px rgba(99, 102, 241, 0.3)'
              }}
            >
              {loading && <Loader2 size={16} className="spinner" />}
              Register for Event (Free)
            </button>
          )}
        </div>
      )}
    </div>
  );
}