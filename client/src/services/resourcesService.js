/**
 * Vynora Connect — Resources Service & Adapter Layer
 * Provides data operations for learning materials, notes, roadmaps, and tutorials.
 * Supports transparent fallback to curated development dataset when backend is offline.
 */

import { apiClient } from './apiClient.js';

export const RESOURCE_CATEGORIES = [
  'All',
  'Programming',
  'Data Structures & Algorithms',
  'Web Development',
  'Artificial Intelligence & ML',
  'Databases',
  'System Design',
  'CS Fundamentals',
  'Interview Preparation',
  'DevOps & Cloud',
];

export const RESOURCE_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'notes', label: 'Study Notes' },
  { value: 'roadmap', label: 'Roadmaps' },
  { value: 'tutorial', label: 'Tutorials' },
  { value: 'documentation', label: 'Docs' },
  { value: 'website', label: 'Websites' },
  { value: 'tools', label: 'Tools & Utilities' },
];

// Curated Development Mock Dataset (Strictly typed according to docs/resources-opportunities-api.md)
const INITIAL_MOCK_RESOURCES = [
  {
    id: 'res-101',
    title: 'Complete Data Structures & Algorithms Visual Guide',
    description: 'In-depth notes, interactive diagrams, and implementation templates covering Arrays, Trees, Graphs, Heap, and Dynamic Programming with Python and Java benchmarks.',
    category: 'Data Structures & Algorithms',
    type: 'notes',
    tags: ['dsa', 'algorithms', 'trees', 'dynamic-programming', 'interview-prep'],
    sourceUrl: 'https://github.com/vynora/dsa-visual-guide',
    contributor: {
      id: 'usr-01',
      name: 'Deepu',
      college: 'Vynora Institute of Technology',
    },
    createdAt: '2026-10-21T09:30:00Z',
    status: 'published',
    isVerified: true,
  },
  {
    id: 'res-102',
    title: 'Full-Stack Modern React & Node.js Developer Roadmap 2026',
    description: 'Step-by-step career roadmap outlining modern frontend patterns, state management, REST & GraphQL APIs, MongoDB schema modeling, and microservices.',
    category: 'Learning Roadmaps',
    type: 'roadmap',
    tags: ['roadmap', 'react', 'nodejs', 'webdev', 'fullstack'],
    sourceUrl: 'https://roadmap.sh/full-stack',
    contributor: {
      id: 'usr-02',
      name: 'Karthik Kavali',
      college: 'National University of Tech',
    },
    createdAt: '2026-10-18T14:15:00Z',
    status: 'published',
    isVerified: true,
  },
  {
    id: 'res-103',
    title: 'System Design Interview Architecture Playbook',
    description: 'High-level architectures for real-time chat, rate limiters, distributed caching (Redis), distributed task queues, and database sharding with CAP theorem deep dive.',
    category: 'System Design',
    type: 'documentation',
    tags: ['system-design', 'architecture', 'scalability', 'redis', 'caching'],
    sourceUrl: 'https://github.com/donnemartin/system-design-primer',
    contributor: {
      id: 'usr-03',
      name: 'Arjun Mehta',
      college: 'Apex Engineering College',
    },
    createdAt: '2026-10-15T11:00:00Z',
    status: 'published',
    isVerified: true,
  },
  {
    id: 'res-104',
    title: 'Applied Machine Learning & Neural Networks Practical Handbook',
    description: 'Hands-on Jupyter notebooks introducing CNNs, Transformers, fine-tuning Hugging Face models, and vector database retrieval for college projects.',
    category: 'Artificial Intelligence & ML',
    type: 'tutorial',
    tags: ['ai', 'machine-learning', 'pytorch', 'transformers', 'python'],
    sourceUrl: 'https://pytorch.org/tutorials/',
    contributor: {
      id: 'usr-04',
      name: 'Pooja Reddy',
      college: 'Global Institute of Computing',
    },
    createdAt: '2026-10-12T16:45:00Z',
    status: 'published',
    isVerified: false,
  },
  {
    id: 'res-105',
    title: 'PostgreSQL & Database Indexing Internals',
    description: 'Explanations of B-Trees, GiST, GIN indexes, query execution plans (EXPLAIN ANALYZE), isolation levels, and ACID properties with benchmarks.',
    category: 'Databases',
    type: 'notes',
    tags: ['sql', 'postgres', 'databases', 'indexing', 'performance'],
    sourceUrl: 'https://use-the-index-luke.com/',
    contributor: {
      id: 'usr-05',
      name: 'Siddharth Rao',
      college: 'Vynora Institute of Technology',
    },
    createdAt: '2026-10-10T08:20:00Z',
    status: 'published',
    isVerified: true,
  },
  {
    id: 'res-106',
    title: 'Docker & Kubernetes Foundations for Student Hackathons',
    description: 'Zero-to-hero guide on containerizing MERN stack apps, Docker compose multi-service setups, secrets management, and deploying to cloud containers.',
    category: 'DevOps & Cloud',
    type: 'tutorial',
    tags: ['docker', 'devops', 'containers', 'cloud', 'deployment'],
    sourceUrl: 'https://docs.docker.com/get-started/',
    contributor: {
      id: 'usr-06',
      name: 'Aman Verma',
      college: 'State Tech University',
    },
    createdAt: '2026-10-08T18:10:00Z',
    status: 'published',
    isVerified: false,
  },
  {
    id: 'res-107',
    title: 'Cracking the Technical Coding Interview Notes',
    description: 'Curated 75 essential pattern questions covering sliding window, two pointers, fast & slow pointers, backtracking, and topological sort with complexity breakdowns.',
    category: 'Interview Preparation',
    type: 'notes',
    tags: ['interview', 'leetcode', 'patterns', 'dsa', 'placement'],
    sourceUrl: 'https://neetcode.io/roadmap',
    contributor: {
      id: 'usr-01',
      name: 'Deepu',
      college: 'Vynora Institute of Technology',
    },
    createdAt: '2026-10-05T13:00:00Z',
    status: 'published',
    isVerified: true,
  },
  {
    id: 'res-108',
    title: 'Operating Systems & Concurrency Deep Dive',
    description: 'Comprehensive study notes on process vs thread synchronization, mutexes, semaphores, deadlock conditions, virtual memory paging, and Linux scheduling.',
    category: 'CS Fundamentals',
    type: 'notes',
    tags: ['os', 'concurrency', 'fundamentals', 'threading', 'gate-prep'],
    sourceUrl: 'https://pages.cs.wisc.edu/~remzi/OSTEP/',
    contributor: {
      id: 'usr-07',
      name: 'Rohit Shenoy',
      college: 'Central Tech Academy',
    },
    createdAt: '2026-10-02T10:00:00Z',
    status: 'published',
    isVerified: true,
  },
];

// In-memory store for session additions
let localResourcesStore = [...INITIAL_MOCK_RESOURCES];

export function validateUrl(url) {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function validateResourceForm(data) {
  const errors = {};

  if (!data.title || data.title.trim().length < 5) {
    errors.title = 'Title must be at least 5 characters.';
  } else if (data.title.trim().length > 120) {
    errors.title = 'Title cannot exceed 120 characters.';
  }

  if (!data.description || data.description.trim().length < 20) {
    errors.description = 'Description must be at least 20 characters.';
  } else if (data.description.trim().length > 2000) {
    errors.description = 'Description cannot exceed 2000 characters.';
  }

  const validCategories = RESOURCE_CATEGORIES.filter(c => c !== 'All');
  if (!data.category || !validCategories.includes(data.category)) {
    errors.category = 'Please select a valid resource category.';
  }

  const validTypes = RESOURCE_TYPES.filter(t => t.value !== 'all').map(t => t.value);
  if (!data.type || !validTypes.includes(data.type)) {
    errors.type = 'Please select a valid resource type.';
  }

  if (!data.sourceUrl || !validateUrl(data.sourceUrl)) {
    errors.sourceUrl = 'Must be a valid URL starting with http:// or https://.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Fetch resources with server attempt and graceful fallback to mock data
 */
export async function getResources(params = {}) {
  const { search = '', category = 'All', type = 'all' } = params;

  try {
    const res = await apiClient.get('/resources', {
      search: search.trim() || undefined,
      category: category !== 'All' ? category : undefined,
      type: type !== 'all' ? type : undefined,
    });

    if (res?.success && Array.isArray(res.data)) {
      return {
        data: res.data,
        isLiveBackend: true,
        total: res.pagination?.total ?? res.data.length,
      };
    }
  } catch {
    // Expected in Week 1 before backend server is implemented
  }

  // Graceful local adapter search and filter
  let filtered = [...localResourcesStore];

  if (category && category !== 'All') {
    filtered = filtered.filter(item => item.category === category);
  }

  if (type && type !== 'all') {
    filtered = filtered.filter(item => item.type === type);
  }

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(q);
      const descMatch = item.description.toLowerCase().includes(q);
      const tagMatch = item.tags.some(tag => tag.toLowerCase().includes(q));
      return titleMatch || descMatch || tagMatch;
    });
  }

  return {
    data: filtered,
    isLiveBackend: false,
    total: filtered.length,
  };
}

/**
 * Get single resource by ID
 */
export async function getResourceById(id) {
  if (!id) return null;

  try {
    const res = await apiClient.get(`/resources/${id}`);
    if (res?.success && res.data) {
      return { data: res.data, isLiveBackend: true };
    }
  } catch {
    // Fallback to local store
  }

  const found = localResourcesStore.find(item => item.id === id);
  return found ? { data: found, isLiveBackend: false } : null;
}

/**
 * Submit resource
 */
export async function createResource(formData) {
  const validation = validateResourceForm(formData);
  if (!validation.isValid) {
    throw { name: 'ValidationError', errors: validation.errors };
  }

  // Check for duplicate title in current store
  const isDuplicate = localResourcesStore.some(
    r => r.title.trim().toLowerCase() === formData.title.trim().toLowerCase()
  );
  if (isDuplicate) {
    throw {
      name: 'ValidationError',
      errors: { title: 'A resource with this title already exists in the catalog.' },
    };
  }

  try {
    const res = await apiClient.post('/resources', formData);
    if (res?.success && res.data) {
      return {
        success: true,
        data: res.data,
        isPersistedToDatabase: true,
        message: 'Resource published to database successfully!',
      };
    }
  } catch {
    // Backend offline fallback: store in local session memory
  }

  const newResource = {
    id: `res-local-${Date.now()}`,
    title: formData.title.trim(),
    description: formData.description.trim(),
    category: formData.category,
    type: formData.type,
    tags: Array.isArray(formData.tags)
      ? formData.tags
      : (formData.tags || '')
          .split(',')
          .map(t => t.trim().toLowerCase())
          .filter(Boolean),
    sourceUrl: formData.sourceUrl.trim(),
    contributor: {
      id: 'usr-student',
      name: 'You (Student Contributor)',
      college: 'Your Campus',
    },
    createdAt: new Date().toISOString(),
    status: 'pending_moderation',
    isVerified: false,
  };

  localResourcesStore = [newResource, ...localResourcesStore];

  return {
    success: true,
    data: newResource,
    isPersistedToDatabase: false,
    message: 'Submitted to local session queue (Pending backend database persistence).',
  };
}
