import React from 'react';
import { NotificationPreferences } from '../components/settings/NotificationPreferences';

/**
 * NotificationSettingsPage Component
 * Full-screen settings page for managing push, email, sound, and quiet hour preferences.
 */
export const NotificationSettingsPage = ({
  settings,
  onSaveSettings,
}) => {
  return (
    <div className="flex-1 overflow-y-auto h-[calc(100vh-4rem)] bg-slate-50/60 pb-16 md:pb-6">
      <NotificationPreferences
        initialSettings={settings}
        onSaveSettings={onSaveSettings}
      />
    </div>
  );
};
