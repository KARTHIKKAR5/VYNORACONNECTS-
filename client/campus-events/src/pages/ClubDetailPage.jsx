import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Globe, Share2, ExternalLink, Calendar, MapPin } from 'lucide-react';
import { clubsEventsApi } from '../services/clubsEventsApi';

export default function ClubDetailPage() {
  const { clubId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await clubsEventsApi.getClubById(clubId);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [clubId]);

  if (loading) {
    return (
      <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px', color: 'var(--text-secondary)' }}>
        Loading club profile...
      </div>
    );
  }

  if (!data || !data.club) {
    return (
      <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
        <Link to="/clubs" style={{ color: 'var(--accent)', fontSize: '14px' }}>← Back to Clubs</Link>
        <h2 style={{ marginTop: '16px' }}>Club Not Found</h2>
      </div>
    );
  }

  const { club, events } = data;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 20px' }}>
      <Link
        to="/clubs"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--text-secondary)',
          fontSize: '13px',
          fontWeight: 600,
          marginBottom: '20px'
        }}
      >
        <ArrowLeft size={16} /> Back to Clubs
      </Link>

      {/* Club Hero Card */}
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          overflow: 'hidden',
          marginBottom: '36px'
        }}
      >
        {/* Banner */}
        <div style={{ height: '180px', backgroundColor: '#1B1B1B' }}>
          {club.bannerUrl && (
            <img src={club.bannerUrl} alt={club.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          )}
        </div>

        <div style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <h1 style={{ fontSize: '26px', fontWeight: 800 }}>{club.name}</h1>
                <CheckCircle size={22} color="#34D399" />
              </div>
              <div style={{ fontSize: '15px', color: 'var(--accent)', fontWeight: 600, marginBottom: '14px' }}>
                {club.collegeName} • {club.category}
              </div>
            </div>

            {/* Official Links */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {club.officialLinks?.website && (
                <a
                  href={club.officialLinks.website}
                  target="_blank"
                  rel="noreferrer"
                  title="Official Website"
                  style={{
                    color: 'var(--text-secondary)',
                    padding: '8px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px'
                  }}
                >
                  <Globe size={16} /> Website
                </a>
              )}
              {club.officialLinks?.instagram && (
                <a
                  href={club.officialLinks.instagram}
                  target="_blank"
                  rel="noreferrer"
                  title="Social Link"
                  style={{
                    color: 'var(--text-secondary)',
                    padding: '8px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px'
                  }}
                >
                  <Share2 size={16} /> Social
                </a>
              )}
            </div>
          </div>

          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '800px', marginTop: '12px' }}>
            {club.description}
          </p>
        </div>
      </div>

      {/* Events Hosted by this Club */}
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>
          Official Events by {club.name}
        </h2>

        {events.length === 0 ? (
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No upcoming events published by this club at the moment.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {events.map((evt) => (
              <div
                key={evt.id}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent)', backgroundColor: 'rgba(99,102,241,0.1)', padding: '3px 8px', borderRadius: '6px' }}>
                    {evt.category.toUpperCase()}
                  </span>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, margin: '10px 0 6px 0' }}>{evt.title}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '14px' }}>{evt.summary}</p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    <Calendar size={14} />
                    <span>{new Date(evt.startsAt).toLocaleDateString()}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <MapPin size={14} />
                    <span>{evt.venue ? evt.venue.name : 'Online'}</span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px', marginTop: '16px' }}>
                  <Link
                    to={`/events/${evt.id}`}
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      padding: '8px 0',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 600
                    }}
                  >
                    View & Register →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}