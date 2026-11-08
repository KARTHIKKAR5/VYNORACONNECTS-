import { useState, useEffect, useCallback } from 'react';
import networkApi from '../services/networkApi.js';

export function useConnections() {
  const [connections, setConnections] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLive, setIsLive] = useState(false);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [connRes, recvRes, sentRes] = await Promise.all([
        networkApi.getConnections(),
        networkApi.getReceivedRequests(),
        networkApi.getSentRequests(),
      ]);

      setConnections(connRes.connections || []);
      setReceivedRequests(recvRes.requests || []);
      setSentRequests(sentRes.requests || []);
      setIsLive(Boolean(connRes.isLive));
    } catch (err) {
      setError(err.message || 'Failed to load connections.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const acceptRequest = async (requestId) => {
    await networkApi.acceptConnectionRequest(requestId);
    await fetchAll();
  };

  const rejectRequest = async (requestId) => {
    await networkApi.rejectConnectionRequest(requestId);
    await fetchAll();
  };

  const cancelRequest = async (requestId) => {
    await networkApi.cancelConnectionRequest(requestId);
    await fetchAll();
  };

  const removeConnection = async (connectionId) => {
    await networkApi.removeConnection(connectionId);
    await fetchAll();
  };

  return {
    connections,
    receivedRequests,
    sentRequests,
    loading,
    error,
    isLive,
    refetch: fetchAll,
    acceptRequest,
    rejectRequest,
    cancelRequest,
    removeConnection,
  };
}

export default useConnections;

