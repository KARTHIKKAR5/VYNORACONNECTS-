import React, { useState, useEffect } from 'react';
import {
  Settings,
  Sliders,
  ShieldAlert,
  Bell,
  Lock,
  LifeBuoy,
  Save,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { adminApi } from '../../services/adminApi.js';
import { useToast } from '../../context/ToastContext.jsx';

export function SettingsPage() {
  const { showToast } = useToast();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await adminApi.getSettings();
        setSettings(res.data);
      } catch (err) {
        console.error(err);
        showToast('Failed to load settings', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminApi.updateSettings(settings);
      showToast('Platform settings updated and logged to audit trail.', 'success');
    } catch (err) {
      showToast(err.message || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const updateSubSetting = (section, key, val) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: val,
      },
    }));
  };

  if (loading || !settings) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
        Loading platform configurations...
      </div>
    );
  }

  const tabs = [
    { id: 'general', label: 'General & Campus', icon: Sliders },
    { id: 'moderation', label: 'Moderation Policies', icon: ShieldAlert },
    { id: 'notifications', label: 'Notification Alerts', icon: Bell },
    { id: 'accessControl', label: 'Access & Governance', icon: Lock },
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Platform &amp; Moderation Settings</h1>
          <p className="page-header-subtitle">
            Configure global governance rules, automated moderation thresholds, and institutional security invariants.
          </p>
        </div>
      </div>

      {/* Demo State Disclaimer Banner */}
      <div className="callout-info">
        <Info size={20} style={{ flexShrink: 0 }} />
        <div>
          <strong>Demonstration Environment Notice:</strong> Modifications made here update the client demonstration state and append to the local security audit trail. In production, these parameters map to canonical backend system configuration collections via <code>PATCH /api/v1/admin/settings</code>.
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--border-default)', marginBottom: 24, overflowX: 'auto' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 18px',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid var(--color-info)' : '2px solid transparent',
              backgroundColor: 'transparent',
              color: activeTab === tab.id ? 'var(--color-info)' : 'var(--text-secondary)',
              fontWeight: activeTab === tab.id ? 700 : 500,
              fontSize: '0.88rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Form Container */}
      <form onSubmit={handleSave}>
        <div className="card">
          <div className="card-body">
            {/* General Tab */}
            {activeTab === 'general' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div className="form-group">
                  <label className="form-label">Platform Branding Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={settings.general.platformName}
                    onChange={(e) => updateSubSetting('general', 'platformName', e.target.value)}
                  />
                  <span className="form-help">Displayed across global portal headers and official system notifications.</span>
                </div>

                <div className="form-group">
                  <label className="form-label">Official Support Contact Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={settings.general.supportContactEmail}
                    onChange={(e) => updateSubSetting('general', 'supportContactEmail', e.target.value)}
                  />
                  <span className="form-help">Designated institutional escalation address for platform inquiries.</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, borderTop: '1px solid var(--border-subtle)', paddingTop: 16 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={settings.general.allowStudentRegistrations}
                      onChange={(e) => updateSubSetting('general', 'allowStudentRegistrations', e.target.checked)}
                      style={{ width: 18, height: 18, accentColor: 'var(--color-info)' }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Permit New Student Account Registrations</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>When disabled, only pre-verified campus roster imports can access accounts.</div>
                    </div>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={settings.general.requireInstitutionalEmail}
                      onChange={(e) => updateSubSetting('general', 'requireInstitutionalEmail', e.target.checked)}
                      style={{ width: 18, height: 18, accentColor: 'var(--color-info)' }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Strict Institutional Email Domain Requirement</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Require .edu / .ac.in verified domains matching verified college records.</div>
                    </div>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={settings.general.maintenanceMode}
                      onChange={(e) => updateSubSetting('general', 'maintenanceMode', e.target.checked)}
                      style={{ width: 18, height: 18, accentColor: 'var(--color-danger)' }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--color-danger-text)' }}>Global Maintenance Mode (Lock Platform)</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Restricts platform access exclusively to Platform Owner for scheduled maintenance.</div>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Moderation Tab */}
            {activeTab === 'moderation' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div className="form-group">
                  <label className="form-label">Auto-Quarantine Incident Report Threshold</label>
                  <input
                    type="number"
                    className="form-input"
                    style={{ maxWidth: 160 }}
                    min={1}
                    max={20}
                    value={settings.moderation.autoQuarantineReportThreshold}
                    onChange={(e) => updateSubSetting('moderation', 'autoQuarantineReportThreshold', parseInt(e.target.value, 10) || 5)}
                  />
                  <span className="form-help">
                    Number of distinct user reports required to automatically suppress a post or comment from the active campus discovery feed.
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, borderTop: '1px solid var(--border-subtle)', paddingTop: 16 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={settings.moderation.enableAutomatedKeywordFiltering}
                      onChange={(e) => updateSubSetting('moderation', 'enableAutomatedKeywordFiltering', e.target.checked)}
                      style={{ width: 18, height: 18, accentColor: 'var(--color-info)' }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Automated Phishing &amp; Keyword Suppression</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Automatically flags high-risk financial, exam leak, and spam vocabulary.</div>
                    </div>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={settings.moderation.autoMuteSpamBots}
                      onChange={(e) => updateSubSetting('moderation', 'autoMuteSpamBots', e.target.checked)}
                      style={{ width: 18, height: 18, accentColor: 'var(--color-info)' }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Automated Rate-Limiting &amp; Bot Quarantine</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Mutes accounts posting more than 15 messages within a 60-second window.</div>
                    </div>
                  </label>
                </div>

                <div className="form-group" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16 }}>
                  <label className="form-label">Active Prohibited Keyword Match List</label>
                  <input
                    type="text"
                    className="form-input"
                    value={settings.moderation.flaggedKeywords.join(', ')}
                    onChange={(e) => updateSubSetting('moderation', 'flaggedKeywords', e.target.value.split(',').map(s => s.trim()))}
                  />
                  <span className="form-help">Comma-separated terms checked against discussion titles and project summaries.</span>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={settings.notifications.notifyOwnerOnUrgentReports}
                      onChange={(e) => updateSubSetting('notifications', 'notifyOwnerOnUrgentReports', e.target.checked)}
                      style={{ width: 18, height: 18, accentColor: 'var(--color-info)' }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Immediate Email Alerts on Urgent Moderation Reports</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Sends real-time notification to owner inbox when harassment or impersonation is reported.</div>
                    </div>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={settings.notifications.notifyOwnerOnNewCollegeVerification}
                      onChange={(e) => updateSubSetting('notifications', 'notifyOwnerOnNewCollegeVerification', e.target.checked)}
                      style={{ width: 18, height: 18, accentColor: 'var(--color-info)' }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Institutional Intake Notifications</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Alert owner when a new college or university submits AISHE accreditation papers.</div>
                    </div>
                  </label>
                </div>

                <div className="form-group" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16 }}>
                  <label className="form-label">Platform Webhook Dispatch URL</label>
                  <input
                    type="url"
                    className="form-input"
                    value={settings.notifications.webhookAlertUrl}
                    onChange={(e) => updateSubSetting('notifications', 'webhookAlertUrl', e.target.value)}
                  />
                  <span className="form-help">HTTPS endpoint receiving JSON audit event payloads for institutional logging.</span>
                </div>
              </div>
            )}

            {/* Access & Governance Tab */}
            {activeTab === 'accessControl' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div className="form-group">
                  <label className="form-label">Maximum Concurrent Club Admin Assignments Per Student</label>
                  <input
                    type="number"
                    className="form-input"
                    style={{ maxWidth: 160 }}
                    min={1}
                    max={5}
                    value={settings.accessControl.maxClubsPerAdmin}
                    onChange={(e) => updateSubSetting('accessControl', 'maxClubsPerAdmin', parseInt(e.target.value, 10) || 2)}
                  />
                  <span className="form-help">Prevents student leadership over-commitment and centralizes accountability.</span>
                </div>

                <div className="form-group">
                  <label className="form-label">Owner &amp; Moderator Admin Session Inactivity Timeout (Minutes)</label>
                  <input
                    type="number"
                    className="form-input"
                    style={{ maxWidth: 160 }}
                    min={15}
                    max={240}
                    value={settings.accessControl.sessionTimeoutMinutes}
                    onChange={(e) => updateSubSetting('accessControl', 'sessionTimeoutMinutes', parseInt(e.target.value, 10) || 60)}
                  />
                  <span className="form-help">Forces re-authentication when the admin browser remains idle.</span>
                </div>
              </div>
            )}
          </div>

          <div className="card-header" style={{ backgroundColor: 'var(--bg-surface-elevated)', borderTop: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              All configuration changes trigger permanent <code>SETTINGS_UPDATED</code> audit log entries.
            </span>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              <Save size={16} /> {saving ? 'Saving...' : 'Save Configuration Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SettingsPage;
