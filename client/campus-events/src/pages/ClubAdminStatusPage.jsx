import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, XCircle, ArrowLeft, Shield, Building2 } from 'lucide-react';
import { clubsEventsApi } from '../services/clubsEventsApi';

export default function ClubAdminStatusPage() {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await (clubsEventsApi.getMyAdminRequestStatus 
          ? clubsEventsApi.getMyAdminRequestStatus() 
          : clubsEventsApi.getMyClubAdminRequest());
        setRequest(res.data);
      } catch (err) {
        console.error('Failed to load status:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', padding: '32px 20px' }}>
      <Link
        to="/clubs"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, marginBottom: '24px' }}
      >
        <ArrowLeft size={16} /> Back to Club Directory
      </Link>

      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '32px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Shield size={22} color="var(--accent)" />
          <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Your Club Admin Status</h1>
        </div>

        {loading ? (
          <div style={{ color: 'var(--text-secondary)' }}>Loading status...</div>
        ) : !request ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Building2 size={40} color="#737373" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>No Application on File</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
              You haven't submitted a club administrator verification request yet.
            </p>
            <Link
              to="/clubs/admin/request"
              style={{
                backgroundColor: 'var(--accent)',
                color: '#FFFFFF',
                padding: '10px 18px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600
              }}
            >
              Apply to Manage a Club
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Status Card Banner */}
            <div
              style={{
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '24px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Current Review State:</span>
                {request.status === 'pending' && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: 'rgba(245, 158, 11, 0.15)',
                      color: '#FBBF24',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      fontSize: '12px',
                      fontWeight: 700,
                      textTransform: 'uppercase'
                    }}
                  >
                    <Clock size={14} /> Pending Owner Review
                  </span>
                )}
                {request.status === 'approved' && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: 'rgba(16, 185, 129, 0.15)',
                      color: '#34D399',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      fontSize: '12px',
                      fontWeight: 700,
                      textTransform: 'uppercase'
                    }}
                  >
                    <CheckCircle2 size={14} /> Verified & Approved
                  </span>
                )}
                {request.status === 'rejected' && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: 'rgba(239, 68, 68, 0.15)',
                      color: '#F87171',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      fontSize: '12px',
                      fontWeight: 700,
                      textTransform: 'uppercase'
                    }}
                  >
                    <XCircle size={14} /> Rejected
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                <div>
                  <strong style={{ color: 'var(--text-secondary)' }}>Proposed Club: </strong>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{request.proposedClubName}</span>
                </div>
                <div>
                  <strong style={{ color: 'var(--text-secondary)' }}>College: </strong>
                  <span>{request.collegeName}</span>
                </div>
                <div>
                  <strong style={{ color: 'var(--text-secondary)' }}>Your Role: </strong>
                  <span>{request.applicantRole}</span>
                </div>
                <div>
                  <strong style={{ color: 'var(--text-secondary)' }}>Submitted on: </strong>
                  <span>{new Date(request.submittedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Vynora Connect policy requires that approval decisions and scoped role assignments are exclusively performed by the platform owner (Revanth) in the central audit module. Once approved, your assigned club will appear in your <strong>Club Admin Dashboard</strong>.
            </p>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', gap: '12px' }}>
              <Link
                to="/clubs/admin"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  padding: '9px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600
                }}
              >
                Go to Club Admin Dashboard →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}