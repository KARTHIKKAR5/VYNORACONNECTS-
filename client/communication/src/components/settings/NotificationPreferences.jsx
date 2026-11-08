import React, { useState } from 'react';
import { Mail, Smartphone, Moon, Volume2, Save, Check } from 'lucide-react';
import { ToggleSwitch } from './ToggleSwitch';
import { Button } from '../common/Button';

/**
 * NotificationPreferences Component
 * Fine-grained student notification settings: Email, Push, Sound, and Quiet Hours.
 */
export const NotificationPreferences = ({
  initialSettings,
  onSaveSettings,
}) => {
  const [settings, setSettings] = useState(initialSettings);
  const [savedBanner, setSavedBanner] = useState(false);

  const handleToggle = (category, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const handleSave = () => {
    if (onSaveSettings) {
      onSaveSettings(settings);
    }
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Notification Preferences
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Choose how and when you receive communications from peers, mentors, and campus clubs.
          </p>
        </div>

        <Button
          onClick={handleSave}
          icon={Save}
          size="sm"
          className="shadow-sm"
        >
          Save Changes
        </Button>
      </div>

      {savedBanner && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Preferences updated successfully! Ready to sync to backend.</span>
        </div>
      )}

      {/* 1. Direct Messages & Mentions (In-App & Push) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-brand-600 flex items-center justify-center">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Push & In-App Alerts
            </h3>
            <p className="text-xs text-slate-500">
              Real-time popups while using Vynora Connect on desktop or mobile.
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          <ToggleSwitch
            label="Direct Message Notifications"
            description="Receive immediate alerts when student peers or mentors message you."
            checked={settings.push?.directMessages}
            onChange={(val) => handleToggle('push', 'directMessages', val)}
          />
          <ToggleSwitch
            label="Mentions & Tags (@Name)"
            description="Alert when someone tags you in a study group or team channel."
            checked={settings.push?.mentions}
            onChange={(val) => handleToggle('push', 'mentions', val)}
          />
          <ToggleSwitch
            label="Study Group Channel Updates"
            description="Notify whenever new discussion starts in joined course channels."
            checked={settings.push?.groupUpdates}
            onChange={(val) => handleToggle('push', 'groupUpdates', val)}
          />
          <ToggleSwitch
            label="Sound Effects on New Message"
            description="Play an auditory chime when an incoming message arrives."
            checked={settings.push?.soundAlerts}
            onChange={(val) => handleToggle('push', 'soundAlerts', val)}
          />
        </div>
      </div>

      {/* 2. Email Notifications */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Campus Email Digests
            </h3>
            <p className="text-xs text-slate-500">
              Forwarded updates to your student institutional email address.
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          <ToggleSwitch
            label="Unread Direct Message Reminders"
            description="Email summary when messages remain unread for more than 2 hours."
            checked={settings.email?.directMessages}
            onChange={(val) => handleToggle('email', 'directMessages', val)}
          />
          <ToggleSwitch
            label="Important Campus & System Announcements"
            description="Notices regarding hackathons, career matchmaking, and scheduled platform updates."
            checked={settings.email?.systemAnnouncements}
            onChange={(val) => handleToggle('email', 'systemAnnouncements', val)}
          />
          <ToggleSwitch
            label="Weekly Networking & Mentorship Digest"
            description="Curated weekly highlight of recommended peers, mentors, and active groups."
            checked={settings.email?.weeklyDigest}
            onChange={(val) => handleToggle('email', 'weeklyDigest', val)}
          />
        </div>
      </div>

      {/* 3. Quiet Hours / Study Mode */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Moon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Quiet Hours & Exam Focus Mode
            </h3>
            <p className="text-xs text-slate-500">
              Silence all non-urgent notifications during scheduled study and sleep hours.
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          <ToggleSwitch
            label="Enable Quiet Hours"
            description="Mute sounds and banners during specified hours."
            checked={settings.quietHours?.enabled}
            onChange={(val) => handleToggle('quietHours', 'enabled', val)}
          />

          {settings.quietHours?.enabled && (
            <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <span className="font-medium">Mute from:</span>
                <input
                  type="time"
                  value={settings.quietHours?.startTime || '22:00'}
                  onChange={(e) => handleToggle('quietHours', 'startTime', e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Until:</span>
                <input
                  type="time"
                  value={settings.quietHours?.endTime || '07:00'}
                  onChange={(e) => handleToggle('quietHours', 'endTime', e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
