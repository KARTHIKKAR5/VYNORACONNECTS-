/**
 * Vynora Connect — Opportunities Service & Adapter Layer
 * Manages internships, hackathons, coding contests, fellowships, and scholarships.
 * Supports private personal application tracker and dashboard integration.
 */

import { apiClient } from './apiClient.js';
import { validateUrl } from './resourcesService.js';
import { getDeadlineInfo, isValidFutureDate } from '../utils/deadlineUtils.js';

export const OPPORTUNITY_TYPES = [
  { value: 'all', label: 'All Opportunities' },
  { value: 'hackathon', label: 'Hackathons' },
  { value: 'internship', label: 'Internships' },
  { value: 'contest', label: 'Coding Contests' },
  { value: 'scholarship', label: 'Scholarships' },
  { value: 'case_competition', label: 'Case Competitions' },
  { value: 'fellowship', label: 'Fellowships' },
  { value: 'other', label: 'Other Openings' },
];

export const WORK_MODES = [
  { value: 'all', label: 'All Modes' },
  { value: 'online', label: 'Online / Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'offline', label: 'On-site / In-Person' },
];

export const DEADLINE_STATUS_OPTIONS = [
  { value: 'all', label: 'All Deadlines' },
  { value: 'active', label: 'Active & Open' },
  { value: 'urgent', label: 'Closing Soon (≤ 48h)' },
  { value: 'expired', label: 'Past / Closed' },
];

export const TRACKER_STAGES = [
  { value: 'saved', label: 'Saved for Later' },
  { value: 'interested', label: 'Interested' },
  { value: 'planning', label: 'Planning Team' },
  { value: 'applied', label: 'Application Submitted' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'rejected', label: 'Not Selected' },
  { value: 'selected', label: 'Offer / Selected' },
];

export function validateOpportunityForm(data) {
  const errors = {};

  if (!data.title || data.title.trim().length < 5) {
    errors.title = 'Title must be at least 5 characters.';
  } else if (data.title.trim().length > 120) {
    errors.title = 'Title cannot exceed 120 characters.';
  }

  if (!data.organizerName || data.organizerName.trim().length < 2) {
    errors.organizerName = 'Organizer or company name is required.';
  }

  const validTypes = OPPORTUNITY_TYPES.filter(t => t.value !== 'all').map(t => t.value);
  if (!data.type || !validTypes.includes(data.type)) {
    errors.type = 'Please select a valid opportunity category.';
  }

  if (!data.description || data.description.trim().length < 20) {
    errors.description = 'Description must be at least 20 characters.';
  } else if (data.description.trim().length > 3000) {
    errors.description = 'Description cannot exceed 3000 characters.';
  }

  if (!data.eligibility || data.eligibility.trim().length < 5) {
    errors.eligibility = 'Eligibility requirements must be at least 5 characters.';
  }

  if (!data.deadlineAt || !isValidFutureDate(data.deadlineAt)) {
    errors.deadlineAt = 'Application deadline must be a valid future date.';
  }

  if (!data.applicationUrl || !validateUrl(data.applicationUrl)) {
    errors.applicationUrl = 'Must be a valid application URL (http:// or https://).';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// Curated Seed Dataset for Development Fallback
const INITIAL_MOCK_OPPORTUNITIES = [
  {
    id: 'opp-201',
    title: 'Google Summer of Code & Open Source Engineering Intern 2027',
    organizerName: 'Google Research & Open Source',
    type: 'internship',
    description: 'Work alongside software engineers on high-scale distributed systems, developer tooling, or Android/Cloud infrastructure. Mentorship, real code reviews, and housing stipend included.',
    eligibility: 'B.Tech/M.S. in Computer Science or related degree graduating in 2026/2027.',
    deadlineAt: '2026-12-15T23:59:59Z',
    mode: 'hybrid',
    city: 'Bengaluru / Hyderabad',
    stipendDescription: '₹1,25,000 / month + Relocation',
    applicationUrl: 'https://careers.google.com/students',
    isLinkUnavailable: false,
    linkStatus: 'verified',
    createdAt: '2026-10-20T08:00:00Z',
    status: 'published',
    skills: ['distributed-systems', 'c++', 'go', 'python', 'cloud'],
  },
  {
    id: 'opp-202',
    title: 'Arthaton 2026 – AI for Finance Hackathon',
    organizerName: 'Arthaton',
    type: 'hackathon',
    description: 'Online AI for finance hackathon challenging students to build intelligent fintech solutions, automated analytics, and financial workflow models. Free entry with cash awards for top teams.',
    eligibility: 'Open to student builders, developers, and fintech enthusiasts. Participate solo or in teams of up to 3 members.',
    deadlineAt: '2026-11-15T18:29:59Z',
    mode: 'online',
    city: 'Online / Remote',
    prizeDescription: '₹10,000 (1st) • ₹5,000 (2nd) • ₹3,000 (3rd)',
    teamMin: 1,
    teamMax: 3,
    applicationUrl: 'https://arthaton.com/',
    isLinkUnavailable: false,
    linkStatus: 'verified',
    createdAt: '2026-10-18T10:00:00Z',
    status: 'published',
    skills: ['ai', 'finance', 'fintech', 'python', 'machine-learning'],
  },
  {
    id: 'opp-203',
    title: 'Junior Frontend Systems Engineer (React / TypeScript)',
    organizerName: 'Zerodha Tech',
    type: 'internship',
    description: 'Build high-performance, accessible, low-latency financial web interfaces. Looking for developers who care deeply about Vanilla CSS, DOM performance, and clean code.',
    eligibility: 'Graduating batches of 2026 or self-taught developers with strong GitHub portfolios.',
    deadlineAt: '2026-11-30T23:59:59Z',
    mode: 'offline',
    city: 'Bengaluru',
    stipendDescription: '₹45,000 / month + Pre-placement offer',
    applicationUrl: 'https://careers.zerodha.com',
    isLinkUnavailable: false,
    linkStatus: 'verified',
    createdAt: '2026-10-15T12:30:00Z',
    status: 'published',
    skills: ['react', 'typescript', 'css', 'dom-performance'],
  },
  {
    id: 'opp-204',
    title: 'National Collegiate Algorithms Cup 2026',
    organizerName: 'CodeChef & ICPC Foundation',
    type: 'contest',
    description: 'Three-round algorithmic contest testing speed, memory efficiency, and mathematical optimization in C++, Java, and Python. Top coders receive direct interview referrals.',
    eligibility: 'Undergraduate college students with verified student ID.',
    deadlineAt: '2026-11-12T18:30:00Z',
    mode: 'online',
    city: 'Online',
    prizeDescription: '₹1,50,000 + Tech Referrals',
    applicationUrl: 'https://www.codechef.com/contests',
    isLinkUnavailable: false,
    linkStatus: 'verified',
    createdAt: '2026-10-12T09:00:00Z',
    status: 'published',
    skills: ['dsa', 'competitive-programming', 'c++', 'algorithms'],
  },
  {
    id: 'opp-205',
    title: 'IMC Scholarship & Mentorship Programme for Meritorious Young Women in Engineering',
    organizerName: 'Smile Foundation',
    type: 'scholarship',
    description: 'Nationwide engineering scholarship and mentorship program by Smile Foundation in collaboration with IMC supporting meritorious young women pursuing engineering degrees.',
    eligibility: 'Meritorious young women students enrolled in engineering courses. PAN India applications invited.',
    deadlineAt: '2026-11-15T18:29:59Z',
    mode: 'online',
    city: 'Pan-India',
    prizeDescription: 'Engineering Scholarship + Professional Mentorship',
    applicationUrl: 'https://sfsp.smilefoundationindia.org/register.php?s=scholarship-mentorship-programme-for-meritorious-young-women-in-engineering-courses',
    isLinkUnavailable: false,
    linkStatus: 'verified',
    createdAt: '2026-10-10T11:00:00Z',
    status: 'published',
    skills: ['scholarship', 'engineering', 'mentorship', 'women-in-tech'],
  },
];

export const SAVED_OPPORTUNITIES_STORAGE_KEY = 'vynora_saved_opportunities';

export const DEFAULT_SAVED_OPPORTUNITIES = [
  {
    opportunityId: 'opp-201',
    trackerStatus: 'planning',
    notes: 'Resume tailored for systems roles. Applying next Monday.',
    savedAt: '2026-10-22T10:00:00Z',
  },
  {
    opportunityId: 'opp-202',
    trackerStatus: 'applied',
    notes: 'Registered for Arthaton AI for Finance. Preparing project submission.',
    savedAt: '2026-10-21T14:30:00Z',
  },
];

function getStoredSavedOpportunities() {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    try {
      const stored = window.sessionStorage.getItem(SAVED_OPPORTUNITIES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Ignore storage errors
    }
  }
  return null;
}

function persistSavedOpportunities(list) {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    try {
      window.sessionStorage.setItem(SAVED_OPPORTUNITIES_STORAGE_KEY, JSON.stringify(list));
    } catch {
      // Ignore storage errors
    }
  }
}

let localOpportunitiesStore = [...INITIAL_MOCK_OPPORTUNITIES];
let localSavedOpportunities = getStoredSavedOpportunities() || [...DEFAULT_SAVED_OPPORTUNITIES];

/**
 * Fetch Opportunities with filters and pagination
 */
export async function getOpportunities(params = {}) {
  const stored = getStoredSavedOpportunities();
  if (stored) localSavedOpportunities = stored;

  const { search = '', type = 'all', mode = 'all', deadlineStatus = 'all', sortBy = 'deadline', page = 1, limit = 10 } = params;

  try {
    const res = await apiClient.get('/opportunities', {
      search: search.trim() || undefined,
      type: type !== 'all' ? type : undefined,
      mode: mode !== 'all' ? mode : undefined,
      status: deadlineStatus !== 'all' ? deadlineStatus : undefined,
      sortBy,
      page,
      limit,
    });

    if (res?.success && Array.isArray(res.data)) {
      const savedMap = new Map(localSavedOpportunities.map(s => [s.opportunityId, s]));
      return {
        data: res.data.map(item => ({
          ...item,
          id: item._id || item.id,
          isSaved: savedMap.has(item._id || item.id),
          trackerStatus: savedMap.get(item._id || item.id)?.trackerStatus || null,
        })),
        isLiveBackend: true,
        total: res.meta?.total ?? res.data.length,
        totalPages: res.meta?.totalPages ?? 1,
      };
    }
  } catch {
    // Graceful offline fallback
  }

  let filtered = [...localOpportunitiesStore];

  if (type && type !== 'all') {
    filtered = filtered.filter(item => item.type === type);
  }

  if (mode && mode !== 'all') {
    filtered = filtered.filter(item => item.mode === mode);
  }

  if (deadlineStatus && deadlineStatus !== 'all') {
    filtered = filtered.filter(item => {
      const info = getDeadlineInfo(item.deadlineAt);
      if (deadlineStatus === 'active') return !info.isExpired;
      if (deadlineStatus === 'urgent') return info.urgency === 'urgent';
      if (deadlineStatus === 'expired') return info.isExpired;
      return true;
    });
  }

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(q);
      const orgMatch = item.organizerName.toLowerCase().includes(q);
      const descMatch = item.description.toLowerCase().includes(q);
      const skillMatch = item.skills?.some(s => s.toLowerCase().includes(q));
      return titleMatch || orgMatch || descMatch || skillMatch;
    });
  }

  // Sorting
  if (sortBy === 'deadline') {
    filtered.sort((a, b) => new Date(a.deadlineAt) - new Date(b.deadlineAt));
  } else if (sortBy === 'newest') {
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  const savedMap = new Map(localSavedOpportunities.map(s => [s.opportunityId, s]));

  return {
    data: filtered.map(item => ({
      ...item,
      isSaved: savedMap.has(item.id),
      trackerStatus: savedMap.get(item.id)?.trackerStatus || null,
    })),
    isLiveBackend: false,
    total: filtered.length,
    totalPages: 1,
  };
}

/**
 * Get Opportunity by ID
 */
export async function getOpportunityById(id) {
  if (!id) return null;

  const stored = getStoredSavedOpportunities();
  if (stored) localSavedOpportunities = stored;

  try {
    const res = await apiClient.get(`/opportunities/${id}`);
    if (res?.success && res.data) {
      const saved = localSavedOpportunities.find(s => s.opportunityId === (res.data._id || res.data.id));
      return {
        data: {
          ...res.data,
          id: res.data._id || res.data.id,
          isSaved: Boolean(saved),
          trackerStatus: saved?.trackerStatus || null,
        },
        isLiveBackend: true,
      };
    }
  } catch {
    // Fallback
  }

  const found = localOpportunitiesStore.find(item => item.id === id);
  if (!found) return null;

  const saved = localSavedOpportunities.find(s => s.opportunityId === found.id);
  return {
    data: {
      ...found,
      isSaved: Boolean(saved),
      trackerStatus: saved?.trackerStatus || null,
    },
    isLiveBackend: false,
  };
}

/**
 * Submit Opportunity (Strictly enters pending review)
 */
export async function createOpportunity(formData) {
  const validation = validateOpportunityForm(formData);
  if (!validation.isValid) {
    throw { name: 'ValidationError', errors: validation.errors };
  }

  try {
    const res = await apiClient.post('/opportunities', formData);
    if (res?.success && res.data) {
      return {
        success: true,
        data: res.data,
        isPersistedToDatabase: true,
        message: 'Opportunity submitted successfully! Pending moderation approval.',
      };
    }
  } catch {
    // Offline fallback
  }

  const newOpp = {
    id: `opp-local-${Date.now()}`,
    title: formData.title.trim(),
    organizerName: formData.organizerName.trim(),
    organizerUrl: formData.organizerUrl?.trim() || '',
    type: formData.type,
    description: formData.description.trim(),
    eligibility: formData.eligibility.trim(),
    deadlineAt: new Date(formData.deadlineAt).toISOString(),
    mode: formData.mode || 'online',
    city: formData.city?.trim() || '',
    prizeDescription: formData.prizeDescription?.trim() || '',
    stipendDescription: formData.stipendDescription?.trim() || '',
    teamMin: formData.teamMin || 1,
    teamMax: formData.teamMax || 1,
    applicationUrl: formData.applicationUrl.trim(),
    skills: Array.isArray(formData.skills) ? formData.skills : [],
    createdAt: new Date().toISOString(),
    status: 'pending', // Strictly pending moderation review
  };

  localOpportunitiesStore = [newOpp, ...localOpportunitiesStore];

  return {
    success: true,
    data: newOpp,
    isPersistedToDatabase: false,
    message: 'Submitted to local session queue (Pending moderation approval).',
  };
}

/**
 * Toggle Save / Bookmark for Opportunity
 */
export async function toggleSaveOpportunity(id) {
  const stored = getStoredSavedOpportunities();
  if (stored) localSavedOpportunities = stored;

  const existingIdx = localSavedOpportunities.findIndex(s => s.opportunityId === id);
  const isSaved = existingIdx !== -1;

  try {
    if (isSaved) {
      await apiClient.delete(`/opportunities/${id}/save`);
      localSavedOpportunities.splice(existingIdx, 1);
    } else {
      await apiClient.post(`/opportunities/${id}/save`);
      localSavedOpportunities.push({
        opportunityId: id,
        trackerStatus: 'saved',
        notes: '',
        savedAt: new Date().toISOString(),
      });
    }
  } catch {
    // Local fallback
    if (isSaved) {
      localSavedOpportunities.splice(existingIdx, 1);
    } else {
      localSavedOpportunities.push({
        opportunityId: id,
        trackerStatus: 'saved',
        notes: '',
        savedAt: new Date().toISOString(),
      });
    }
  }

  persistSavedOpportunities(localSavedOpportunities);
  return { isSaved: !isSaved };
}

/**
 * Update Application Tracker Status
 */
export async function updateOpportunityTrackerStatus(id, trackerStatus, notes) {
  const stored = getStoredSavedOpportunities();
  if (stored) localSavedOpportunities = stored;

  try {
    const res = await apiClient.patch(`/opportunities/${id}/tracker`, { trackerStatus, notes });
    if (res?.success && res.data) {
      return res.data;
    }
  } catch {
    // Fallback
  }

  let item = localSavedOpportunities.find(s => s.opportunityId === id);
  if (!item) {
    item = {
      opportunityId: id,
      trackerStatus: trackerStatus || 'saved',
      notes: notes || '',
      savedAt: new Date().toISOString(),
    };
    localSavedOpportunities.push(item);
  } else {
    if (trackerStatus) item.trackerStatus = trackerStatus;
    if (notes !== undefined) item.notes = notes;
  }

  persistSavedOpportunities(localSavedOpportunities);
  return item;
}

/**
 * Get Current Student's Saved Opportunities with Full Details
 */
export async function getSavedOpportunities() {
  try {
    const res = await apiClient.get('/opportunities/saved');
    if (res?.success && Array.isArray(res.data)) {
      return res.data;
    }
  } catch {
    // Local fallback
  }

  const stored = getStoredSavedOpportunities();
  if (stored) {
    localSavedOpportunities = stored;
  }

  return localSavedOpportunities.map(saved => {
    const opp = localOpportunitiesStore.find(o => o.id === saved.opportunityId);
    return {
      opportunityId: saved.opportunityId,
      trackerStatus: saved.trackerStatus,
      notes: saved.notes,
      savedAt: saved.savedAt,
      opportunity: opp || null,
    };
  }).filter(item => item.opportunity !== null);
}

/**
 * Get Submissions by Current Student
 */
export async function getMySubmittedOpportunities() {
  try {
    const res = await apiClient.get('/opportunities/mine');
    if (res?.success && Array.isArray(res.data)) {
      return res.data;
    }
  } catch {
    // Local fallback: returns opportunities created in this session
  }

  return localOpportunitiesStore.filter(o => o.status === 'pending');
}

/**
 * Export for Karthik's Home Dashboard Preview
 */
export async function getFeaturedOpportunities(limit = 3) {
  try {
    const res = await apiClient.get('/opportunities/featured', { limit });
    if (res?.success && Array.isArray(res.data)) {
      return res.data;
    }
  } catch {
    // Fallback
  }

  const result = await getOpportunities({ deadlineStatus: 'active', limit });
  return result.data.slice(0, limit).map(opp => ({
    id: opp.id,
    title: opp.title,
    organization: opp.organizerName,
    type: opp.type.charAt(0).toUpperCase() + opp.type.slice(1),
    deadline: getDeadlineInfo(opp.deadlineAt).formattedDate,
    isoDeadline: opp.deadlineAt,
    isExpiringSoon: getDeadlineInfo(opp.deadlineAt).urgency === 'urgent',
  }));
}

