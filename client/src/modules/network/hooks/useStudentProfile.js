import { useState, useEffect, useCallback } from 'react';
import networkApi from '../services/networkApi.js';

export function useStudentProfile(userId = null) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let res;
      if (!userId || userId === 'me') {
        res = await networkApi.getMyProfile();
        setProfile(res.profile);
      } else {
        res = await networkApi.getStudentById(userId);
        setProfile(res.student);
      }
      setIsLive(Boolean(res.isLive));
    } catch (err) {
      setError(err.message || 'Failed to load profile.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (formData) => {
    try {
      setSaving(true);
      const res = await networkApi.updateMyProfile(formData);
      setProfile(res.profile);
      return res.profile;
    } finally {
      setSaving(false);
    }
  };

  const handleConnect = async () => {
    if (!profile) return;
    await networkApi.sendConnectionRequest(profile._id);
    setProfile((prev) => ({ ...prev, connectionStatus: 'pending_sent' }));
  };

  const handleAccept = async () => {
    if (!profile?.connectionId) return;
    await networkApi.acceptConnectionRequest(profile.connectionId);
    setProfile((prev) => ({ ...prev, connectionStatus: 'connected' }));
  };

  const handleReject = async () => {
    if (!profile?.connectionId) return;
    await networkApi.rejectConnectionRequest(profile.connectionId);
    setProfile((prev) => ({ ...prev, connectionStatus: 'not_connected', connectionId: null }));
  };

  const handleCancel = async () => {
    if (!profile?.connectionId) return;
    await networkApi.cancelConnectionRequest(profile.connectionId);
    setProfile((prev) => ({ ...prev, connectionStatus: 'not_connected', connectionId: null }));
  };

  const handleRemove = async () => {
    if (!profile?.connectionId) return;
    await networkApi.removeConnection(profile.connectionId);
    setProfile((prev) => ({ ...prev, connectionStatus: 'not_connected', connectionId: null }));
  };

  const handleReport = async (category, explanation) => {
    if (!profile) return;
    return networkApi.reportUser(profile._id, category, explanation);
  };

  const handleBlock = async () => {
    if (!profile) return;
    await networkApi.blockUser(profile._id);
    setProfile(null);
  };

  return {
    profile,
    loading,
    saving,
    error,
    isLive,
    refetch: fetchProfile,
    updateProfile,
    handleConnect,
    handleAccept,
    handleReject,
    handleCancel,
    handleRemove,
    handleReport,
    handleBlock,
  };
}

export default useStudentProfile;

