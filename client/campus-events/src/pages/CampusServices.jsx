import React, { useState, useEffect } from 'react';
import { Building2, Search } from 'lucide-react';
import CampusServiceCard from '../components/campus/CampusServiceCard';
import { eventsService } from '../services/eventsService';

export default function CampusServices() {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await eventsService.getCampusServices();
      setServices(data);
      setLoading(false);
    }
    load();
  }, []);

  const filteredServices = services.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Building2 size={20} color="var(--accent)" />
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Campus Services Directory
          </span>
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
          University Facilities & Services
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
          Verified campus resources including labs, academic support, digital library, and student wellness centers.
        </p>
      </div>

      {/* Search Input */}
      <div style={{ marginBottom: '24px', maxWidth: '400px' }}>
        <input
          type="text"
          placeholder="Search services, labs, library..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '10px 14px',
            color: 'var(--text-primary)',
            fontSize: '14px',
            outline: 'none'
          }}
        />
      </div>

      {/* Services Grid */}
      {loading ? (
        <div style={{ color: 'var(--text-secondary)' }}>Loading campus services...</div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px'
          }}
        >
          {filteredServices.map((service) => (
            <CampusServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}