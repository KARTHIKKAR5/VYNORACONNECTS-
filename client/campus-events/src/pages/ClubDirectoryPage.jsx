import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Search, CheckCircle, ShieldAlert, ArrowRight, ExternalLink } from 'lucide-react';
import { clubsEventsApi } from '../services/clubsEventsApi';

const CATEGORIES = ['All', 'Technical', 'Entrepreneurship', 'Cultural', 'Sports'];

export default function ClubDirectoryPage() {
  const [clubs, setClubs] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClubs() {
      setLoading(true);
      const res = await clubsEventsApi.getClubs({ category: selectedCategory, search });
      setClubs(res.data);
      setLoading(false);
    }
    fetchClubs();
  }, [selectedCategory, search]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>
      {/* Header Banner with Club-Admin Apply CTA */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '32px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Users size={20} color="var(--accent)" />
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Verified College Clubs
            </span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Campus Club Directory
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '650px' }}>
            Explore official student-led communities, technical guilds, and innovation clubs across partner universities.
          </p>
        </div>

        {/* Club Admin CTAs */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link
            to="/clubs/admin/request"
            style={{
              backgroundColor: 'var(--accent)',
              color: '#FFFFFF',
              padding: '10px 18px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            Apply for Club Admin
          </Link>
          <Link
            to="/clubs/admin/status"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              padding: '10px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600
            }}
          >
            Track Status
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={16} color="#737373" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by club name, university, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '10px 12px 10px 36px',
              color: 'var(--text-primary)',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  backgroundColor: isActive ? 'var(--accent)' : 'var(--bg-elevated)',
                  color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                  border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border-color)'}`,
                  borderRadius: '9999px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: 600
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Club Grid */}
      {loading ? (
        <div style={{ color: 'var(--text-secondary)' }}>Loading verified clubs...</div>
      ) : clubs.length === 0 ? (
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '40px', textAlign: 'center' }}>
          <h3>No clubs found matching your search.</h3>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '24px'
          }}
        >
          {clubs.map((club) => (
            <div
              key={club.id}
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '14px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'border-color 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#404040')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-color)')}
            >
              {/* Club Banner */}
              <div style={{ height: '110px', backgroundColor: '#1B1B1B', position: 'relative' }}>
                {club.bannerUrl && (
                  <img
                    src={club.bannerUrl}
                    alt={club.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
                {/* Category Badge */}
                <span
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    backdropFilter: 'blur(4px)'
                  }}
                >
                  {club.category}
                </span>
              </div>

              {/* Club Content */}
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {club.name}
                  </h3>
                  <CheckCircle size={16} color="#34D399" />
                </div>

                <div style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: 600, marginBottom: '12px' }}>
                  {club.collegeName}
                </div>

                <p
                  style={{
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                    marginBottom: '18px',
                    flex: 1
                  }}
                >
                  {club.description}
                </p>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
                  <Link
                    to={`/clubs/${club.id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      padding: '9px 0',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 600
                    }}
                  >
                    View Club & Events <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}