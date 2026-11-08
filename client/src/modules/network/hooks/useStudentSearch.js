import { useState, useEffect, useCallback, useRef } from 'react';
import networkApi from '../services/networkApi.js';

export function useStudentSearch(initialParams = {}) {
  const [params, setParams] = useState({
    search: '',
    college: 'All Colleges',
    branch: 'All Branches',
    studyYear: '',
    skill: '',
    interest: '',
    sortBy: 'relevance',
    page: 1,
    limit: 6,
    ...initialParams,
  });

  const [students, setStudents] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 6, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLive, setIsLive] = useState(false);

  // Request race condition guard: discard older stale responses
  const activeRequestId = useRef(0);

  const fetchStudents = useCallback(async () => {
    const currentReq = ++activeRequestId.current;
    try {
      setLoading(true);
      setError(null);
      const res = await networkApi.searchStudents(params);
      if (currentReq === activeRequestId.current) {
        setStudents(res.students || []);
        setMeta(res.meta || { page: 1, limit: params.limit, total: 0, totalPages: 1 });
        setIsLive(Boolean(res.isLive));
      }
    } catch (err) {
      if (currentReq === activeRequestId.current) {
        setError(err.message || 'Failed to fetch student directory.');
      }
    } finally {
      if (currentReq === activeRequestId.current) {
        setLoading(false);
      }
    }
  }, [params]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const updateFilters = (newFilters) => {
    setParams((prev) => ({ ...prev, ...newFilters, page: newFilters.page || 1 }));
  };

  const resetFilters = () => {
    setParams({
      search: '',
      college: 'All Colleges',
      branch: 'All Branches',
      studyYear: '',
      skill: '',
      interest: '',
      sortBy: 'relevance',
      page: 1,
      limit: 6,
    });
  };

  const setPage = (page) => {
    setParams((prev) => ({ ...prev, page }));
  };

  // Immediate local update handlers for connection actions
  const handleConnect = async (studentId) => {
    await networkApi.sendConnectionRequest(studentId);
    setStudents((prev) =>
      prev.map((s) => (s._id === studentId ? { ...s, connectionStatus: 'pending_sent' } : s))
    );
  };

  const handleCancelRequest = async (connectionId) => {
    await networkApi.cancelConnectionRequest(connectionId);
    setStudents((prev) =>
      prev.map((s) =>
        s.connectionId === connectionId ? { ...s, connectionStatus: 'not_connected', connectionId: null } : s
      )
    );
  };

  const handleAcceptRequest = async (connectionId) => {
    await networkApi.acceptConnectionRequest(connectionId);
    setStudents((prev) =>
      prev.map((s) => (s.connectionId === connectionId ? { ...s, connectionStatus: 'connected' } : s))
    );
  };

  const handleRejectRequest = async (connectionId) => {
    await networkApi.rejectConnectionRequest(connectionId);
    setStudents((prev) =>
      prev.map((s) =>
        s.connectionId === connectionId ? { ...s, connectionStatus: 'not_connected', connectionId: null } : s
      )
    );
  };

  const handleRemoveConnection = async (connectionId) => {
    await networkApi.removeConnection(connectionId);
    setStudents((prev) =>
      prev.map((s) =>
        s.connectionId === connectionId ? { ...s, connectionStatus: 'not_connected', connectionId: null } : s
      )
    );
  };

  return {
    params,
    students,
    meta,
    loading,
    error,
    isLive,
    updateFilters,
    resetFilters,
    setPage,
    refetch: fetchStudents,
    handleConnect,
    handleCancelRequest,
    handleAcceptRequest,
    handleRejectRequest,
    handleRemoveConnection,
  };
}

export default useStudentSearch;

