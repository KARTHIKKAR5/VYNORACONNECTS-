/**
 * Vynora Connect — Resources Service & Adapter Layer
 * Manages study notes, roadmaps, textbooks, placement papers, and cheat sheets.
 * Provides transparent fallback to curated development dataset when backend is offline.
 */

import { apiClient } from './apiClient.js';

export const RESOURCE_CATEGORIES = [
  'All',
  'Study Notes',
  'Interview Preparation',
  'Placement Papers',
  'Learning Roadmaps',
  'Cheatsheets',
  'Textbooks',
  'Articles & Docs',
  'Repositories & Code',
];

export const RESOURCE_TYPES = [
  { value: 'all', label: 'All Formats' },
  { value: 'document', label: 'PDF & Notes' },
  { value: 'roadmap', label: 'Roadmaps' },
  { value: 'repository', label: 'GitHub Repos' },
  { value: 'article', label: 'Guides & Articles' },
  { value: 'video', label: 'Video Tutorials' },
  { value: 'tool', label: 'Tools & Cheat Sheets' },
];

export const ENGINEERING_BRANCHES = [
  'All',
  'CSE',
  'ECE',
  'EEE',
  'MECH',
  'CIVIL',
  'IT',
  'General',
];

export function validateUrl(url) {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function validateResourceForm(data) {
  const errors = {};

  if (!data.title || data.title.trim().length < 5) {
    errors.title = 'Title must be at least 5 characters.';
  } else if (data.title.trim().length > 150) {
    errors.title = 'Title cannot exceed 150 characters.';
  }

  if (!data.description || data.description.trim().length < 15) {
    errors.description = 'Description must be at least 15 characters.';
  } else if (data.description.trim().length > 2000) {
    errors.description = 'Description cannot exceed 2000 characters.';
  }

  if (!data.topic || data.topic.trim().length < 2) {
    errors.topic = 'Subject/topic is required.';
  }

  const validTypes = RESOURCE_TYPES.filter(t => t.value !== 'all').map(t => t.value);
  if (!data.type || !validTypes.includes(data.type)) {
    errors.type = 'Please select a valid format type.';
  }

  if (!data.sourceUrl || !validateUrl(data.sourceUrl)) {
    errors.sourceUrl = 'Must be a valid URL starting with http:// or https://.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// Curated Development Mock Dataset
const INITIAL_MOCK_RESOURCES = [
  {
    id: 'res-101',
    title: 'Operating Systems & Concurrency In-Depth College Notes',
    description: 'Comprehensive notes covering CPU scheduling algorithms, virtual memory, paging, semaphores, deadlock detection, and POSIX threads with Gate PYQs.',
    category: 'Study Notes',
    topic: 'Operating Systems',
    branch: 'CSE',
    type: 'document',
    tags: ['os', 'concurrency', 'deadlocks', 'memory-management', 'gate'],
    difficulty: 'intermediate',
    sourceUrl: 'https://github.com/vynora/os-notes',
    upvotesCount: 42,
    hasUpvoted: false,
    isBookmarked: false,
    contributor: {
      name: 'Deepu',
      college: 'Vynora Institute of Technology',
    },
    createdAt: '2026-10-21T09:30:00Z',
    status: 'published',
  },
  {
    id: 'res-102',
    title: 'Complete SDE Placement & Coding Interview Roadmap 2026',
    description: 'A 16-week structured milestone roadmap from DSA basics to dynamic programming, system design, DBMS, and behavioral interview cheat sheets.',
    category: 'Learning Roadmaps',
    topic: 'Software Engineering',
    branch: 'General',
    type: 'roadmap',
    tags: ['roadmap', 'placement', 'interview-prep', 'dsa', 'career'],
    difficulty: 'beginner',
    sourceUrl: 'https://roadmap.sh/software-design',
    upvotesCount: 88,
    hasUpvoted: true,
    isBookmarked: true,
    contributor: {
      name: 'Karthik Kavali',
      college: 'National University of Tech',
    },
    createdAt: '2026-10-18T14:15:00Z',
    status: 'published',
  },
  {
    id: 'res-103',
    title: 'Digital Signal Processing & Microprocessors Handbook',
    description: 'Concise lecture notes on FFT, IIR/FIR filter design, z-transforms, and 8086/ARM architecture assembly cheat sheets with lab solutions.',
    category: 'Study Notes',
    topic: 'Signal Processing',
    branch: 'ECE',
    type: 'document',
    tags: ['dsp', 'ece', 'signals', 'arm', 'hardware'],
    difficulty: 'advanced',
    sourceUrl: 'https://github.com/vynora/dsp-handbook',
    upvotesCount: 29,
    hasUpvoted: false,
    isBookmarked: false,
    contributor: {
      name: 'Varshitha',
      college: 'Vynora Institute of Technology',
    },
    createdAt: '2026-10-15T11:00:00Z',
    status: 'published',
  },
  {
    id: 'res-104',
    title: 'System Design Architecture Playbook & Visual Cheatsheet',
    description: 'High-level architectures for rate limiters, distributed caching (Redis), task queues (RabbitMQ/Kafka), and database sharding with CAP theorem.',
    category: 'Cheatsheets',
    topic: 'System Design',
    branch: 'CSE',
    type: 'tool',
    tags: ['system-design', 'redis', 'kafka', 'scalability', 'backend'],
    difficulty: 'intermediate',
    sourceUrl: 'https://github.com/donnemartin/system-design-primer',
    upvotesCount: 65,
    hasUpvoted: false,
    isBookmarked: true,
    contributor: {
      name: 'Arjun Mehta',
      college: 'Apex Engineering College',
    },
    createdAt: '2026-10-12T16:45:00Z',
    status: 'published',
  },
  {
    id: 'res-105',
    title: 'Standard Placement Aptitude & Verbal Reasoning Questions',
    description: 'Company-specific aptitude papers from TCS, Infosys, Wipro, and Accenture with step-by-step arithmetic, probability, and logical reasoning shortcuts.',
    category: 'Placement Papers',
    topic: 'Campus Placements',
    branch: 'General',
    type: 'document',
    tags: ['placement', 'aptitude', 'tcs', 'accenture', 'mock-tests'],
    difficulty: 'beginner',
    sourceUrl: 'https://github.com/vynora/placement-aptitude',
    upvotesCount: 34,
    hasUpvoted: false,
    isBookmarked: false,
    contributor: {
      name: 'Pooja Reddy',
      college: 'Global Institute of Computing',
    },
    createdAt: '2026-10-10T08:20:00Z',
    status: 'published',
  },
];

let localResourcesStore = [...INITIAL_MOCK_RESOURCES];
let localBookmarkedResourceIds = new Set(['res-102', 'res-104']);

/**
 * Fetch resources from API with local fallback
 */
export async function getResources(params = {}) {
  const { search = '', category = 'All', branch = 'All', type = 'all', page = 1, limit = 10 } = params;

  try {
    const res = await apiClient.get('/resources', {
      search: search.trim() || undefined,
      category: category !== 'All' ? category : undefined,
      branch: branch !== 'All' ? branch : undefined,
      type: type !== 'all' ? type : undefined,
      page,
      limit,
    });

    if (res?.success && Array.isArray(res.data)) {
      return {
        data: res.data.map(item => ({
          ...item,
          id: item._id || item.id,
          isBookmarked: localBookmarkedResourceIds.has(item._id || item.id),
        })),
        isLiveBackend: true,
        total: res.meta?.total ?? res.data.length,
        totalPages: res.meta?.totalPages ?? 1,
      };
    }
  } catch {
    // Graceful offline fallback
  }

  let filtered = [...localResourcesStore];

  if (category && category !== 'All') {
    filtered = filtered.filter(item => item.category === category);
  }

  if (branch && branch !== 'All') {
    filtered = filtered.filter(item => item.branch === branch || item.branch === 'General');
  }

  if (type && type !== 'all') {
    filtered = filtered.filter(item => item.type === type);
  }

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(q);
      const descMatch = item.description.toLowerCase().includes(q);
      const topicMatch = item.topic?.toLowerCase().includes(q);
      const tagMatch = item.tags?.some(tag => tag.toLowerCase().includes(q));
      return titleMatch || descMatch || topicMatch || tagMatch;
    });
  }

  return {
    data: filtered.map(item => ({
      ...item,
      isBookmarked: localBookmarkedResourceIds.has(item.id),
    })),
    isLiveBackend: false,
    total: filtered.length,
    totalPages: 1,
  };
}

/**
 * Get Resource Details by ID
 */
export async function getResourceById(id) {
  if (!id) return null;

  try {
    const res = await apiClient.get(`/resources/${id}`);
    if (res?.success && res.data) {
      return {
        data: {
          ...res.data,
          id: res.data._id || res.data.id,
          isBookmarked: localBookmarkedResourceIds.has(res.data._id || res.data.id),
        },
        isLiveBackend: true,
      };
    }
  } catch {
    // Fallback
  }

  const found = localResourcesStore.find(item => item.id === id);
  return found
    ? {
        data: { ...found, isBookmarked: localBookmarkedResourceIds.has(found.id) },
        isLiveBackend: false,
      }
    : null;
}

/**
 * Submit Educational Resource (Enters pending review)
 */
export async function createResource(formData) {
  const validation = validateResourceForm(formData);
  if (!validation.isValid) {
    throw { name: 'ValidationError', errors: validation.errors };
  }

  try {
    const res = await apiClient.post('/resources', formData);
    if (res?.success && res.data) {
      return {
        success: true,
        data: res.data,
        isPersistedToDatabase: true,
        message: 'Resource submitted successfully! It is now pending moderation review.',
      };
    }
  } catch {
    // Offline fallback: save into local session store with pending_moderation status
  }

  const newResource = {
    id: `res-local-${Date.now()}`,
    title: formData.title.trim(),
    description: formData.description.trim(),
    topic: formData.topic.trim(),
    category: formData.category || 'Study Notes',
    branch: formData.branch || 'General',
    type: formData.type,
    tags: Array.isArray(formData.tags)
      ? formData.tags
      : (formData.tags || '')
          .split(',')
          .map(t => t.trim().toLowerCase())
          .filter(Boolean),
    sourceUrl: formData.sourceUrl.trim(),
    difficulty: formData.difficulty || 'beginner',
    contributor: {
      name: 'Deepu (You)',
      college: 'Your Campus',
    },
    upvotesCount: 0,
    hasUpvoted: false,
    isBookmarked: false,
    createdAt: new Date().toISOString(),
    status: 'pending', // Strictly pending review
  };

  localResourcesStore = [newResource, ...localResourcesStore];

  return {
    success: true,
    data: newResource,
    isPersistedToDatabase: false,
    message: 'Submitted to local session queue (Pending moderation approval).',
  };
}

/**
 * Toggle Upvote for a resource
 */
export async function upvoteResource(id) {
  try {
    const res = await apiClient.post(`/resources/${id}/upvote`);
    if (res?.success && res.data) {
      return res.data;
    }
  } catch {
    // Local fallback
  }

  const item = localResourcesStore.find(r => r.id === id);
  if (item) {
    item.hasUpvoted = !item.hasUpvoted;
    item.upvotesCount += item.hasUpvoted ? 1 : -1;
    return {
      upvotesCount: Math.max(0, item.upvotesCount),
      hasUpvoted: item.hasUpvoted,
    };
  }

  return { upvotesCount: 0, hasUpvoted: false };
}

/**
 * Toggle Bookmark for a resource
 */
export async function toggleBookmarkResource(id) {
  const isBookmarked = localBookmarkedResourceIds.has(id);

  try {
    if (isBookmarked) {
      await apiClient.delete(`/resources/${id}/bookmark`);
      localBookmarkedResourceIds.delete(id);
    } else {
      await apiClient.post(`/resources/${id}/bookmark`);
      localBookmarkedResourceIds.add(id);
    }
  } catch {
    // Local fallback
    if (isBookmarked) {
      localBookmarkedResourceIds.delete(id);
    } else {
      localBookmarkedResourceIds.add(id);
    }
  }

  return { isBookmarked: localBookmarkedResourceIds.has(id) };
}

/**
 * Get Saved Resources for Current Student
 */
export async function getBookmarkedResources() {
  try {
    const res = await apiClient.get('/resources/bookmarks/all');
    if (res?.success && Array.isArray(res.data)) {
      return res.data.map(b => ({
        ...b.resource,
        id: b.resource._id || b.resource.id,
        savedAt: b.savedAt,
        isBookmarked: true,
      }));
    }
  } catch {
    // Local fallback
  }

  return localResourcesStore
    .filter(r => localBookmarkedResourceIds.has(r.id))
    .map(r => ({ ...r, isBookmarked: true }));
}

/**
 * Get Submissions by Current Student
 */
export async function getMySubmittedResources() {
  try {
    const res = await apiClient.get('/resources/mine');
    if (res?.success && Array.isArray(res.data)) {
      return res.data;
    }
  } catch {
    // Local fallback: returns resources where contributor is current student
  }

  return localResourcesStore.filter(
    r => r.contributor?.name?.includes('Deepu') || r.status === 'pending'
  );
}

