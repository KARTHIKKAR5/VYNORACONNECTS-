/**
 * Vynora Connect — Opportunities Service & Adapter Layer
 * Manages internships, jobs, hackathons, coding competitions, and scholarships.
 * Provides deadline evaluation, safe links validation, and dashboard integration hooks.
 */

import { apiClient } from './apiClient.js';
import { validateUrl } from './resourcesService.js';

export const OPPORTUNITY_TYPES = [
  { value: 'all', label: 'All Opportunities' },
  { value: 'internship', label: 'Internships' },
  { value: 'job', label: 'Graduate Jobs' },
  { value: 'hackathon', label: 'Hackathons' },
  { value: 'competition', label: 'Coding Contests' },
  { value: 'scholarship', label: 'Scholarships' },
];

export const DEADLINE_STATUS_OPTIONS = [
  { value: 'all', label: 'All Deadlines' },
  { value: 'active', label: 'Open & Active' },
  { value: 'urgent', label: 'Closing Soon (< 5 days)' },
  { value: 'expired', label: 'Past / Closed' },
];

// Curated Student Opportunities Dataset
const INITIAL_MOCK_OPPORTUNITIES = [
  {
    id: 'opp-201',
    title: 'Software Engineering Summer Intern 2027',
    organization: 'Google Research & Engineering',
    type: 'internship',
    summary: 'Work alongside software engineers on high-scale distributed systems, developer tooling, or Android/Cloud infrastructure. Mentorship, real code reviews, and housing stipend included.',
    eligibility: 'B.Tech/M.S. in Computer Science or related degree graduating between Dec 2026 and June 2027.',
    deadline: '2026-11-25T23:59:59Z',
    location: 'Bengaluru / Hyderabad (Hybrid)',
    remote: false,
    stipendOrPrize: '₹1,25,000 / month + Relocation',
    applicationUrl: 'https://careers.google.com/students',
    createdAt: '2026-10-20T08:00:00Z',
    status: 'active',
    isVerified: true,
  },
  {
    id: 'opp-202',
    title: 'HackVynora 2026 — Inter-College AI Hackathon',
    organization: 'Vynora Campus Innovation Lab',
    type: 'hackathon',
    summary: 'A 36-hour flagship inter-college hackathon empowering cross-campus student teams to build multimodal AI tools, student productivity apps, and decentralized web protocols.',
    eligibility: 'Open to all currently enrolled college students in India. Teams of 2 to 4 members.',
    deadline: '2026-11-05T18:00:00Z',
    location: 'Bengaluru & Virtual (Hybrid)',
    remote: true,
    stipendOrPrize: '₹3,00,000 Cash Pool + Cloud Credits',
    applicationUrl: 'https://hackvynora.devpost.com',
    createdAt: '2026-10-18T10:00:00Z',
    status: 'active',
    isVerified: true,
  },
  {
    id: 'opp-203',
    title: 'Junior Frontend Engineer (React / TypeScript)',
    organization: 'Zerodha Tech',
    type: 'job',
    summary: 'Build high-performance, accessible, low-latency financial web interfaces. Looking for developers who care deeply about Vanilla CSS, DOM performance, and clean code.',
    eligibility: 'Graduating batches of 2026 or self-taught developers with strong GitHub portfolios.',
    deadline: '2026-11-15T23:59:59Z',
    location: 'Bengaluru (On-site)',
    remote: false,
    stipendOrPrize: '₹14 - 18 LPA',
    applicationUrl: 'https://zerodha.tech/careers',
    createdAt: '2026-10-15T12:30:00Z',
    status: 'active',
    isVerified: true,
  },
  {
    id: 'opp-204',
    title: 'National Collegiate Algorithms Cup 2026',
    organization: 'CodeChef & ICPC Foundation',
    type: 'competition',
    summary: 'Three-round algorithmic contest testing speed, memory efficiency, and mathematical optimization in C++, Java, and Python. Top coders receive direct interview referrals.',
    eligibility: 'Undergraduate college students with verified student ID.',
    deadline: '2026-10-31T18:30:00Z',
    location: 'Online Contest',
    remote: true,
    stipendOrPrize: '₹1,50,000 + Goodies',
    applicationUrl: 'https://www.codechef.com/contests',
    createdAt: '2026-10-12T09:00:00Z',
    status: 'active',
    isVerified: true,
  },
  {
    id: 'opp-205',
    title: 'NextGen Women in Engineering Scholarship 2026',
    organization: 'Adobe Foundation',
    type: 'scholarship',
    summary: 'Merit-and-need based financial scholarship for female engineering students with demonstrated leadership in tech, open source contributions, or campus technical clubs.',
    eligibility: 'Women undergraduates pursuing B.Tech/B.E. in Computer Science, IT, or AI with CGPA >= 7.5.',
    deadline: '2026-12-10T23:59:59Z',
    location: 'Pan-India',
    remote: true,
    stipendOrPrize: '₹1,00,000 Tuition Grant + 1:1 Mentorship',
    applicationUrl: 'https://research.adobe.com/scholarship',
    createdAt: '2026-10-10T11:00:00Z',
    status: 'active',
    isVerified: true,
  },
  {
    id: 'opp-206',
    title: 'Machine Learning Research Fellowship',
    organization: 'IIT Hyderabad AI Lab',
    type: 'internship',
    summary: '6-month funded research fellowship focusing on low-resource language processing and automated speech recognition. Opportunity to co-author papers at top conferences.',
    eligibility: '3rd/4th year engineering students with prior coursework in linear algebra, probability, and PyTorch.',
    deadline: '2026-10-15T18:00:00Z', // Expired
    location: 'Hyderabad, India',
    remote: false,
    stipendOrPrize: '₹35,000 / month',
    applicationUrl: 'https://ai.iith.ac.in/fellowships',
    createdAt: '2026-09-20T10:00:00Z',
    status: 'expired',
    isVerified: false,
  },
];

let localOpportunitiesStore = [...INITIAL_MOCK_OPPORTUNITIES];

/**
 * Calculates human-readable deadline information with accurate urgency
 */
export function getDeadlineInfo(deadlineIso) {
  if (!deadlineIso) {
    return { label: 'No deadline specified', urgency: 'unknown', isExpired: false, daysRemaining: null };
  }

  const deadlineDate = new Date(deadlineIso);
  if (isNaN(deadlineDate.getTime())) {
    return { label: 'Invalid deadline date', urgency: 'unknown', isExpired: false, daysRemaining: null };
  }

  const now = new Date();
  const diffMs = deadlineDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs <= 0) {
    return {
      label: 'Expired',
      formattedDate: deadlineDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      urgency: 'expired',
      isExpired: true,
      daysRemaining: 0,
    };
  }

  if (diffDays <= 3) {
    return {
      label: diffDays === 1 ? 'Closes in 1 day!' : `Closes in ${diffDays} days!`,
      formattedDate: deadlineDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      urgency: 'urgent',
      isExpired: false,
      daysRemaining: diffDays,
    };
  }

  return {
    label: `${diffDays} days left`,
    formattedDate: deadlineDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    urgency: 'active',
    isExpired: false,
    daysRemaining: diffDays,
  };
}

export function validateOpportunityForm(data) {
  const errors = {};

  if (!data.title || data.title.trim().length < 5) {
    errors.title = 'Title must be at least 5 characters.';
  } else if (data.title.trim().length > 120) {
    errors.title = 'Title cannot exceed 120 characters.';
  }

  if (!data.organization || data.organization.trim().length < 2) {
    errors.organization = 'Organization name must be at least 2 characters.';
  } else if (data.organization.trim().length > 80) {
    errors.organization = 'Organization cannot exceed 80 characters.';
  }

  const validTypes = OPPORTUNITY_TYPES.filter(t => t.value !== 'all').map(t => t.value);
  if (!data.type || !validTypes.includes(data.type)) {
    errors.type = 'Please select a valid opportunity type.';
  }

  if (!data.summary || data.summary.trim().length < 20) {
    errors.summary = 'Summary must be at least 20 characters.';
  } else if (data.summary.trim().length > 2000) {
    errors.summary = 'Summary cannot exceed 2000 characters.';
  }

  if (!data.eligibility || data.eligibility.trim().length < 5) {
    errors.eligibility = 'Eligibility requirements must be at least 5 characters.';
  }

  if (!data.deadline) {
    errors.deadline = 'Please provide an application deadline.';
  } else {
    const deadlineTime = new Date(data.deadline).getTime();
    if (isNaN(deadlineTime)) {
      errors.deadline = 'Please provide a valid deadline date.';
    } else if (deadlineTime < Date.now()) {
      errors.deadline = 'Deadline must be a future date.';
    }
  }

  if (!data.applicationUrl || !validateUrl(data.applicationUrl)) {
    errors.applicationUrl = 'Must be a valid application URL (http:// or https://).';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Fetch opportunities with filters
 */
export async function getOpportunities(params = {}) {
  const { search = '', type = 'all', deadlineStatus = 'all' } = params;

  try {
    const res = await apiClient.get('/opportunities', {
      search: search.trim() || undefined,
      type: type !== 'all' ? type : undefined,
      status: deadlineStatus !== 'all' ? deadlineStatus : undefined,
    });

    if (res?.success && Array.isArray(res.data)) {
      return {
        data: res.data,
        isLiveBackend: true,
        total: res.pagination?.total ?? res.data.length,
      };
    }
  } catch {
    // Backend offline fallback
  }

  let filtered = [...localOpportunitiesStore];

  if (type && type !== 'all') {
    filtered = filtered.filter(item => item.type === type);
  }

  if (deadlineStatus && deadlineStatus !== 'all') {
    filtered = filtered.filter(item => {
      const info = getDeadlineInfo(item.deadline);
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
      const orgMatch = item.organization.toLowerCase().includes(q);
      const summaryMatch = item.summary.toLowerCase().includes(q);
      return titleMatch || orgMatch || summaryMatch;
    });
  }

  return {
    data: filtered,
    isLiveBackend: false,
    total: filtered.length,
  };
}

/**
 * Get opportunity by ID
 */
export async function getOpportunityById(id) {
  if (!id) return null;

  try {
    const res = await apiClient.get(`/opportunities/${id}`);
    if (res?.success && res.data) {
      return { data: res.data, isLiveBackend: true };
    }
  } catch {
    // Fallback to local
  }

  const found = localOpportunitiesStore.find(item => item.id === id);
  return found ? { data: found, isLiveBackend: false } : null;
}

/**
 * Submit opportunity
 */
export async function createOpportunity(formData) {
  const validation = validateOpportunityForm(formData);
  if (!validation.isValid) {
    throw { name: 'ValidationError', errors: validation.errors };
  }

  const isDuplicate = localOpportunitiesStore.some(
    o => o.title.trim().toLowerCase() === formData.title.trim().toLowerCase() &&
         o.organization.trim().toLowerCase() === formData.organization.trim().toLowerCase()
  );
  if (isDuplicate) {
    throw {
      name: 'ValidationError',
      errors: { title: 'An opportunity with this title from this organization already exists.' },
    };
  }

  try {
    const res = await apiClient.post('/opportunities', formData);
    if (res?.success && res.data) {
      return {
        success: true,
        data: res.data,
        isPersistedToDatabase: true,
        message: 'Opportunity published to database successfully!',
      };
    }
  } catch {
    // Offline fallback
  }

  const newOpp = {
    id: `opp-local-${Date.now()}`,
    title: formData.title.trim(),
    organization: formData.organization.trim(),
    type: formData.type,
    summary: formData.summary.trim(),
    eligibility: formData.eligibility.trim(),
    deadline: new Date(formData.deadline).toISOString(),
    location: formData.location?.trim() || (formData.remote ? 'Remote' : 'Location TBA'),
    remote: Boolean(formData.remote),
    stipendOrPrize: formData.stipendOrPrize?.trim() || undefined,
    applicationUrl: formData.applicationUrl.trim(),
    createdAt: new Date().toISOString(),
    status: 'active',
    isVerified: false, // Authoritative verification must be set by backend admin
  };

  localOpportunitiesStore = [newOpp, ...localOpportunitiesStore];

  return {
    success: true,
    data: newOpp,
    isPersistedToDatabase: false,
    message: 'Submitted to local session queue (Pending backend database persistence).',
  };
}

/**
 * Shared hook / helper for Karthik's Dashboard module
 */
export async function getFeaturedOpportunities(limit = 3) {
  const result = await getOpportunities({ deadlineStatus: 'active' });
  return result.data.slice(0, limit);
}
