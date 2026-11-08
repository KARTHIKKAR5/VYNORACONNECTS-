import React from 'react';
import { Database, RotateCcw, ShieldCheck } from 'lucide-react';
import { adminApi } from '../../services/adminApi.js';
import { useToast } from '../../context/ToastContext.jsx';

export function DemoBanner({ onDataReset }) {
  const { showToast } = useToast();

  const handleReset = async () => {
    if (window.confirm('Reset all demonstration data back to original default records?')) {
      await adminApi.resetDemoData();
      showToast('Demonstration data restored to defaults.', 'info');
      if (onDataReset) onDataReset();
      window.location.reload();
    }
  };

  return (
    <div className="demo-banner">
      <div className="demo-banner-left">
        <span className="demo-badge">SaaS Demo</span>
        <span>
          <strong>Owner Administration Mode:</strong> Operating on simulated local data store. All privileged actions append to local audit logs.
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          type="button"
          className="demo-reset-btn"
          onClick={handleReset}
          title="Restore baseline demonstration dataset"
        >
          <RotateCcw size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
          Reset Demo Store
        </button>
      </div>
    </div>
  );
}

export default DemoBanner;
