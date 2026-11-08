/**
 * Vynora Connect — Pulse Service & Adapter Layer
 * Manages inter-college activity feed, category filters, and pagination.
 */

import { apiClient } from './apiClient.js';

const INITIAL_PULSE_ACTIVITIES = [
  {
    id: 'pulse-act-01',
    type: 'opportunity_published',
    category: 'opportunity',
    actor: {
      id: 'org-google',
      name: 'Google University Relations',
      college: 'Industry Partner',
      avatar: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=120&q=80',
    },
    activityDescription: 'published a new summer engineering internship',
    targetTitle: 'Software Engineering Summer Intern 2027',
    summary: 'High-scale distributed systems and Android/Cloud infrastructure roles with direct team mentorship and stipend.',
    badge: 'Internship',
    previewImage: null,
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    action: {
      label: 'View Opportunity',
      actionType: 'navigate',
      targetTab: 'opportunities',
      targetId: 'opp-201',
    },
    metrics: { likes: 34, comments: 5 },
  },
  {
    id: 'pulse-act-02',
    type: 'hackathon_announced',
    category: 'opportunity',
    actor: {
      id: 'org-innovation-lab',
      name: 'Deepika Avunoori',
      college: 'Campus Innovation Lab',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    },
    activityDescription: 'announced registrations for flagship inter-college hackathon',
    targetTitle: 'HackVynora 2026 — 36hr AI & System Challenge',
    summary: 'Cross-campus student teams building next-gen multimodal productivity tools. ₹3,00,000 cash pool + cloud credits.',
    badge: 'Hackathon',
    previewImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    action: {
      label: 'Explore Hackathon',
      actionType: 'navigate',
      targetTab: 'opportunities',
      targetId: 'opp-202',
    },
    metrics: { likes: 78, comments: 16 },
  },
  {
    id: 'pulse-act-03',
    type: 'project_recruitment_opened',
    category: 'projects',
    actor: {
      id: 'std-varsh',
      name: 'Varshitha K.',
      college: 'SR University',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
    },
    activityDescription: 'opened collaborator recruitment for capstone project',
    targetTitle: 'Autonomous Campus Drone Delivery System',
    summary: 'Seeking 2 enthusiastic team members: Computer Vision specialist (OpenCV/Python) and Firmware engineer (Raspberry Pi/ROS2).',
    badge: 'Recruitment Open',
    previewImage: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=600&q=80',
    timestamp: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    action: {
      label: 'Inspect & Join Team',
      actionType: 'navigate',
      targetTab: 'teams',
      targetId: 'prj-401',
    },
    metrics: { likes: 42, comments: 8 },
  },
  {
    id: 'pulse-act-04',
    type: 'connection_accepted',
    category: 'connections',
    actor: {
      id: 'std-priya',
      name: 'Priya Sharma',
      college: 'IIT Madras',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    },
    activityDescription: 'connected with Karthik and joined the inter-college network',
    targetTitle: 'Campus Network Connection Formed',
    summary: 'Priya and Karthik are now connected across SR University and IIT Madras networks.',
    badge: 'New Connection',
    previewImage: null,
    timestamp: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
    action: {
      label: 'View Network',
      actionType: 'navigate',
      targetTab: 'network',
      targetId: 'std-101',
    },
    metrics: { likes: 19, comments: 2 },
  },
  {
    id: 'pulse-act-05',
    type: 'event_published',
    category: 'events',
    actor: {
      id: 'std-sindhu',
      name: 'Sindhu P. (Events Chair)',
      college: 'Tech Nexus Club',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
    },
    activityDescription: 'scheduled keynote session for annual tech convention',
    targetTitle: 'Inter-College AI & Web3 Summit 2026',
    summary: 'Keynotes from alumni and founders, panel discussion on open-source career pathways, and project stalls.',
    badge: 'Campus Event',
    previewImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    action: {
      label: 'Register for Event',
      actionType: 'navigate',
      targetTab: 'events',
      targetId: 'evt-301',
    },
    metrics: { likes: 53, comments: 7 },
  },
  {
    id: 'pulse-act-06',
    type: 'resource_published',
    category: 'resources',
    actor: {
      id: 'std-manideepika',
      name: 'Manideepika',
      college: 'Vynora Institute of Technology',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
    },
    activityDescription: 'shared a verified study handbook with the community',
    targetTitle: 'Clean Code & Data Structures Handbook',
    summary: 'Comprehensive compilation of algorithmic problem patterns, interview cheat sheets, and Python/Java starter templates.',
    badge: 'Study Notes',
    previewImage: null,
    timestamp: new Date(Date.now() - 1000 * 60 * 320).toISOString(),
    action: {
      label: 'Open Handbook',
      actionType: 'navigate',
      targetTab: 'resources',
      targetId: 'res-101',
    },
    metrics: { likes: 61, comments: 9 },
  },
  {
    id: 'pulse-act-07',
    type: 'collaboration_update',
    category: 'projects',
    actor: {
      id: 'std-rahul',
      name: 'Rahul Sen',
      college: 'IIT Hyderabad',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80',
    },
    activityDescription: 'published Sprint 2 milestone release',
    targetTitle: 'Peer-to-Peer Notes & Question Paper Ledger',
    summary: 'Completed IPFS document hashing protocol and verified indexing with 4 campus student testers.',
    badge: 'Milestone',
    previewImage: null,
    timestamp: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
    action: {
      label: 'View Project Repo',
      actionType: 'navigate',
      targetTab: 'teams',
      targetId: 'prj-402',
    },
    metrics: { likes: 27, comments: 4 },
  },
  {
    id: 'pulse-act-08',
    type: 'mentorship_updated',
    category: 'mentorship',
    actor: {
      id: 'mnt-surya',
      name: 'Dr. Surya Teja',
      college: 'Ex-Amazon / Research Mentor',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80',
    },
    activityDescription: 'opened 3 free weekend office hour slots for student architecture reviews',
    targetTitle: 'Distributed Systems & Capstone Design Mentorship',
    summary: 'Bring your architecture diagrams, database schema designs, or graduate research proposals for 1-on-1 feedback.',
    badge: 'Mentorship',
    previewImage: null,
    timestamp: new Date(Date.now() - 1000 * 60 * 620).toISOString(),
    action: {
      label: 'Book 1-on-1 Slot',
      actionType: 'navigate',
      targetTab: 'mentorship',
      targetId: 'mnt-501',
    },
    metrics: { likes: 45, comments: 12 },
  },
];

export const PULSE_FILTERS = [
  { id: 'all', label: 'For You' },
  { id: 'connections', label: 'Connections' },
  { id: 'opportunities', label: 'Opportunities' },
  { id: 'events', label: 'Events' },
  { id: 'projects', label: 'Projects' },
];

export async function getPulseFeed({ filter = 'all', page = 1, limit = 5 } = {}) {
  try {
    const res = await apiClient.get('/pulse', { filter, page, limit });
    if (res?.success && res.data) {
      return {
        success: true,
        data: res.data,
        pagination: res.meta || { page, limit, hasMore: false },
        isLiveBackend: true,
      };
    }
  } catch {
    // Graceful offline fallback
  }

  let filtered = [...INITIAL_PULSE_ACTIVITIES];
  if (filter && filter !== 'all') {
    filtered = filtered.filter(
      (item) => item.category === filter || (filter === 'opportunities' && item.category === 'opportunity')
    );
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const startIndex = (page - 1) * limit;
  const paginatedData = filtered.slice(startIndex, startIndex + limit);

  return {
    success: true,
    data: paginatedData,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasMore: page < totalPages,
    },
    isLiveBackend: false,
  };
}

