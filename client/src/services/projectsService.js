/**
 * Vynora Connect — Teams & Projects Service Layer
 * Complete business logic, validation, role-based access control,
 * atomic capacity enforcement, and persistent client store.
 */

import { getStudentProfileSummary } from './studentProfileAdapter.js';
import { chatIntegrationAdapter } from './chatIntegrationAdapter.js';
import { pointsServiceAdapter } from './pointsServiceAdapter.js';

export const PROJECT_CATEGORIES = [
  'All',
  'Hackathon',
  'Web Application',
  'Mobile Application',
  'AI & Machine Learning',
  'Open Source',
  'Campus Utility',
  'Startup & Entrepreneurship',
  'Research & Academic',
];

export const PROJECT_VISIBILITY = ['public', 'campus-only', 'private'];

export const TASK_PRIORITIES = ['low', 'medium', 'high', 'urgent'];

const STORAGE_KEYS = {
  PROJECTS: 'vynora_teams_projects_v3',
  REQUESTS: 'vynora_teams_requests_v3',
  INVITATIONS: 'vynora_teams_invitations_v3',
  TASKS: 'vynora_teams_tasks_v3',
};

// Initial Seed Projects
const INITIAL_PROJECTS = [
  {
    id: 'proj-101',
    title: 'Smart Campus Patrol & Surveillance AI',
    tagline: 'Edge computer vision alert system for campus walkways and dorm security.',
    problemStatement: 'Campus walkways and remote library exits often lack active night surveillance, leading to delayed security responses during medical emergencies or safety incidents.',
    goals: 'Deploy low-power edge computer vision units that flag emergency gestures and blocked emergency exits with sub-second alert dispatch to campus dispatchers.',
    summary: 'Edge computer vision system providing automated pedestrian safety alerts and security patrol dispatching.',
    description: 'We are engineering an edge-deployed computer vision platform that monitors high-traffic campus walkways and outdoor zones. The platform detects anomalies such as blocked emergency exits and unauthorized night entries, streaming alerts directly to security personnel using WebSockets and React dashboards.',
    recruitmentRequirements: 'Looking for collaborative builders passionate about computer vision edge deployment and real-time dashboard telemetry.',
    category: 'AI & Machine Learning',
    tags: ['python', 'pytorch', 'opencv', 'react', 'fastapi'],
    visibility: 'public',
    status: 'active',
    lead: {
      id: 'usr-varsh',
      name: 'Varshitha',
      college: 'Vynora Institute of Technology',
      department: 'Computer Science',
      avatar: 'V',
    },
    team: {
      id: 'team-101',
      name: 'VisionGuard Team',
      maxCapacity: 4,
      members: [
        {
          userId: 'usr-varsh',
          name: 'Varshitha',
          college: 'Vynora Institute of Technology',
          role: 'owner',
          assignedRoleTitle: 'Project Lead & ML Architect',
          joinedAt: '2026-10-25T10:00:00Z',
        },
        {
          userId: 'usr-deep',
          name: 'Deepu',
          college: 'Vynora Institute of Technology',
          role: 'manager',
          assignedRoleTitle: 'Edge Hardware & Deployment',
          joinedAt: '2026-10-28T14:30:00Z',
        },
      ],
    },
    openRoles: [
      {
        id: 'role-101-1',
        title: 'Full-Stack Dashboard Developer',
        skillsRequired: ['React', 'Tailwind', 'WebSocket'],
        description: 'Build real-time security map views and alert dispatch modals.',
        openings: 1,
        filled: 0,
        status: 'open',
      },
      {
        id: 'role-101-2',
        title: 'Embedded Systems Engineer',
        skillsRequired: ['Raspberry Pi', 'C++', 'TensorRT'],
        description: 'Optimize lightweight model inference for on-device edge cameras.',
        openings: 1,
        filled: 0,
        status: 'open',
      },
    ],
    createdAt: '2026-10-25T10:00:00Z',
    updatedAt: '2026-11-02T16:00:00Z',
  },
  {
    id: 'proj-102',
    title: 'Inter-College Peer Mentorship Network',
    tagline: 'Bridging junior and senior engineers across universities for 1-on-1 guidance.',
    problemStatement: 'Underclassmen often face anxiety regarding placement preparation, course electives, and research projects due to lack of accessible mentorship outside their immediate circles.',
    goals: 'Connect 1000+ underclassmen with verified senior mentors across 15 engineering universities by next academic quarter.',
    summary: 'A structured cross-campus matchmaking platform connecting 1st/2nd year undergraduate students with experienced final-year seniors.',
    description: 'A structured cross-campus matchmaking platform connecting 1st/2nd year undergraduate students with experienced final-year seniors and alumni working in software and research. Features schedule matching, verified campus email onboarding, and milestone check-ins.',
    recruitmentRequirements: 'Looking for a product designer and frontend engineer with strong visual craft.',
    category: 'Web Application',
    tags: ['react', 'nodejs', 'mongodb', 'express'],
    visibility: 'public',
    status: 'active',
    lead: {
      id: 'usr-karthik',
      name: 'Karthik Kavali',
      college: 'National Engineering College',
      department: 'ECE',
      avatar: 'K',
    },
    team: {
      id: 'team-102',
      name: 'ConnectMentors',
      maxCapacity: 3,
      members: [
        {
          userId: 'usr-karthik',
          name: 'Karthik Kavali',
          college: 'National Engineering College',
          role: 'owner',
          assignedRoleTitle: 'Project Lead',
          joinedAt: '2026-10-22T08:00:00Z',
        },
      ],
    },
    openRoles: [
      {
        id: 'role-102-1',
        title: 'UI/UX Product Designer',
        skillsRequired: ['Figma', 'User Research', 'Design Systems'],
        description: 'Design intuitive onboarding and scheduling flows for students and mentors.',
        openings: 1,
        filled: 0,
        status: 'open',
      },
      {
        id: 'role-102-2',
        title: 'Backend API Developer',
        skillsRequired: ['Node.js', 'Express', 'MongoDB'],
        description: 'Build schedule matching algorithms and calendar notification triggers.',
        openings: 1,
        filled: 0,
        status: 'open',
      },
    ],
    createdAt: '2026-10-22T08:00:00Z',
    updatedAt: '2026-10-30T11:20:00Z',
  },
  {
    id: 'proj-103',
    title: 'Decentralized Micro-Grant Crowdfunder for Hackathons',
    tagline: 'Transparent student micro-grants funded by alumni and tech clubs.',
    problemStatement: 'Student teams frequently drop out of national hackathons because hardware prototypes and GPU credits require out-of-pocket expenses beyond student budgets.',
    goals: 'Provide escrowed micro-grants up to ₹15,000 to approved student hackathon teams with verifiable milestone delivery.',
    summary: 'Enables hackathon participants to obtain small micro-grants for hardware components and cloud credits.',
    description: 'Enables hackathon participants to obtain small micro-grants (₹2,000 to ₹15,000) for hardware components and cloud credits. Alumni donors vote on milestone completions before tranches are released.',
    recruitmentRequirements: 'Seeking smart contract developers familiar with Solidity and EVM tooling.',
    category: 'Startup & Entrepreneurship',
    tags: ['solidity', 'react', 'web3', 'ethersjs'],
    visibility: 'public',
    status: 'active',
    lead: {
      id: 'usr-ram',
      name: 'Ram Charan',
      college: 'City Institute of Science',
      department: 'CSE',
      avatar: 'R',
    },
    team: {
      id: 'team-103',
      name: 'EduFund Guild',
      maxCapacity: 3,
      members: [
        {
          userId: 'usr-ram',
          name: 'Ram Charan',
          college: 'City Institute of Science',
          role: 'owner',
          assignedRoleTitle: 'Blockchain Architect',
          joinedAt: '2026-10-18T12:00:00Z',
        },
      ],
    },
    openRoles: [
      {
        id: 'role-103-1',
        title: 'Smart Contract Auditor',
        skillsRequired: ['Solidity', 'Foundry', 'Slither'],
        description: 'Audit vault contracts and voting logic before testnet deployment.',
        openings: 1,
        filled: 0,
        status: 'open',
      },
      {
        id: 'role-103-2',
        title: 'Frontend Web3 Integrator',
        skillsRequired: ['React', 'Wagmi', 'Tailwind'],
        description: 'Connect wallet connections and transaction toasts in the portal.',
        openings: 1,
        filled: 0,
        status: 'open',
      },
    ],
    createdAt: '2026-10-18T12:00:00Z',
    updatedAt: '2026-10-29T14:45:00Z',
  },
  {
    id: 'proj-104',
    title: 'Offline-First Campus Exam Study Repository',
    tagline: 'P2P synchronized notes and question papers powered by WebTorrent.',
    problemStatement: 'Campus hostel networks often fail during exam weeks, leaving students without access to study materials and lecture slide decks.',
    goals: 'Create an offline mesh synchronization tool allowing localized campus study note distribution.',
    summary: 'An offline-capable progressive web application for sharing lecture audio and digitized question banks.',
    description: 'An offline-capable progressive web application allowing students in low-connectivity campus hostels to share lecture audio and digitized question banks directly over local WiFi.',
    recruitmentRequirements: 'Looking for 2 engineers to build peer transfer and offline storage caching.',
    category: 'Campus Utility',
    tags: ['pwa', 'indexeddb', 'webrtc', 'service-workers'],
    visibility: 'public',
    status: 'active',
    lead: {
      id: 'usr-siri',
      name: 'Siri Nallala',
      college: 'State Technical University',
      department: 'IT',
      avatar: 'S',
    },
    team: {
      id: 'team-104',
      name: 'P2P Study Group',
      maxCapacity: 4,
      members: [
        {
          userId: 'usr-siri',
          name: 'Siri Nallala',
          college: 'State Technical University',
          role: 'owner',
          assignedRoleTitle: 'Lead Developer',
          joinedAt: '2026-10-10T09:00:00Z',
        },
        {
          userId: 'usr-candidate-1',
          name: 'Rohit Sharma',
          college: 'Apex College of Technology',
          role: 'member',
          assignedRoleTitle: 'Frontend Engineer',
          joinedAt: '2026-10-15T15:20:00Z',
        },
      ],
    },
    openRoles: [
      {
        id: 'role-104-1',
        title: 'PWA & Offline Mesh Engineer',
        skillsRequired: ['PWA', 'WebTorrent', 'Service Workers'],
        description: 'Implement localized peer note transfer over campus local networks.',
        openings: 1,
        filled: 0,
        status: 'open',
      },
      {
        id: 'role-104-2',
        title: 'IndexedDB Storage Specialist',
        skillsRequired: ['IndexedDB', 'React', 'Local Storage'],
        description: 'Optimize offline note compression and index search.',
        openings: 1,
        filled: 0,
        status: 'open',
      },
    ],
    createdAt: '2026-10-10T09:00:00Z',
    updatedAt: '2026-10-28T18:00:00Z',
  },
  {
    id: 'proj-105',
    title: 'Autonomous Campus Drone Delivery Mesh',
    tagline: 'Automated urgent medicine and document delivery quadcopters.',
    problemStatement: 'Large multi-campus institutions struggle with timely inter-department physical document and medical sample transport.',
    goals: 'Build a 3-station autonomous drone network with automated battery swap.',
    summary: 'Autonomous quadcopter routing and safe rooftop landing network for university departments.',
    description: 'Hardware and embedded flight control software for small payload transport across university campus facilities with obstacle avoidance.',
    recruitmentRequirements: 'Team is completely staffed and conducting flight simulations.',
    category: 'Research & Academic',
    tags: ['drones', 'embedded', 'c++', 'autopilot'],
    visibility: 'public',
    status: 'active',
    lead: {
      id: 'usr-arjun',
      name: 'Arjun Mehta',
      college: 'Apex College of Technology',
      department: 'Aerospace Engineering',
      avatar: 'A',
    },
    team: {
      id: 'team-105',
      name: 'SkyDrop Engineers',
      maxCapacity: 3,
      members: [
        {
          userId: 'usr-arjun',
          name: 'Arjun Mehta',
          college: 'Apex College of Technology',
          role: 'owner',
          assignedRoleTitle: 'Flight Software Lead',
          joinedAt: '2026-10-01T10:00:00Z',
        },
        {
          userId: 'usr-deep',
          name: 'Deepu',
          college: 'Vynora Institute of Technology',
          role: 'manager',
          assignedRoleTitle: 'Hardware Systems',
          joinedAt: '2026-10-05T12:00:00Z',
        },
        {
          userId: 'usr-karthik',
          name: 'Karthik Kavali',
          college: 'National Engineering College',
          role: 'member',
          assignedRoleTitle: 'Telemetry Integrator',
          joinedAt: '2026-10-08T15:00:00Z',
        },
      ],
    },
    openRoles: [
      {
        id: 'role-105-1',
        title: 'Avionics Specialist',
        skillsRequired: ['C++', 'Pixhawk'],
        openings: 1,
        filled: 1,
        status: 'closed',
      },
      {
        id: 'role-105-2',
        title: 'Telemetry Integrator',
        skillsRequired: ['React', 'WebSocket'],
        openings: 1,
        filled: 1,
        status: 'closed',
      },
    ],
    createdAt: '2026-10-01T10:00:00Z',
    updatedAt: '2026-10-20T18:00:00Z',
  },
];

const INITIAL_REQUESTS = [
  {
    id: 'req-01',
    projectId: 'proj-101',
    projectTitle: 'Smart Campus Patrol & Surveillance AI',
    roleId: 'role-101-1',
    roleTitle: 'Full-Stack Dashboard Developer',
    applicant: {
      id: 'usr-candidate-1',
      name: 'Rohit Sharma',
      college: 'Apex College of Technology',
      department: 'Information Technology',
      avatar: 'R',
    },
    introduction: 'I have 2 years of experience building scalable real-time dashboards in React and Tailwind.',
    relevantSkills: ['React', 'Tailwind', 'WebSocket', 'JavaScript'],
    experienceSummary: 'Built emergency response dispatch UI for the State Hackathon 2026.',
    status: 'pending',
    createdAt: '2026-11-04T11:20:00Z',
  },
];

const INITIAL_TASKS = [
  {
    id: 'task-101',
    projectId: 'proj-101',
    title: 'Configure WebRTC Video Stream Ingestion',
    description: 'Set up low-latency camera stream parser from RTSP to WebRTC.',
    assignedToUserId: 'usr-deep',
    assignedToName: 'Deepu',
    createdByUserId: 'usr-varsh',
    priority: 'high',
    status: 'in_progress',
    dueDate: '2026-11-20',
    createdAt: '2026-11-02T10:00:00Z',
  },
  {
    id: 'task-102',
    projectId: 'proj-101',
    title: 'Audit Edge Model False Positive Rate',
    description: 'Benchmark nightly doorway detections against manual surveillance logs.',
    assignedToUserId: 'usr-varsh',
    assignedToName: 'Varshitha',
    createdByUserId: 'usr-varsh',
    priority: 'urgent',
    status: 'todo',
    dueDate: '2026-11-18',
    createdAt: '2026-11-03T14:00:00Z',
  },
];

// Helper to access storage safely in browser and Node environments
function getStorageItem(key, defaultVal) {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
  }
  return defaultVal;
}

function setStorageItem(key, value) {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Fallback
    }
  }
}

// In-Memory state initialized from storage
let projectsStore = getStorageItem(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
let requestsStore = getStorageItem(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
let invitationsStore = getStorageItem(STORAGE_KEYS.INVITATIONS, []);
let tasksStore = getStorageItem(STORAGE_KEYS.TASKS, INITIAL_TASKS);

function persistStores() {
  setStorageItem(STORAGE_KEYS.PROJECTS, projectsStore);
  setStorageItem(STORAGE_KEYS.REQUESTS, requestsStore);
  setStorageItem(STORAGE_KEYS.INVITATIONS, invitationsStore);
  setStorageItem(STORAGE_KEYS.TASKS, tasksStore);
}

/**
 * Robust, consistent available positions calculation
 * Correctly accounts for recruitment position openings and accepted team memberships.
 */
export function calculateAvailablePositions(project) {
  if (!project) return 0;
  const currentMembersCount = project.team?.members?.length || 0;
  const maxCapacity = project.team?.maxCapacity || 0;
  const remainingTeamCapacity = Math.max(0, maxCapacity - currentMembersCount);

  // If the team has reached max capacity, no positions can be available
  if (remainingTeamCapacity === 0) return 0;

  // Calculate remaining openings across open recruitment positions
  if (project.openRoles && project.openRoles.length > 0) {
    const roleOpenings = project.openRoles.reduce((acc, role) => {
      if (role.status === 'open') {
        const remaining = (role.openings || 1) - (role.filled || 0);
        return acc + Math.max(0, remaining);
      }
      return acc;
    }, 0);
    // Bounded by both defined role openings and physical team capacity
    return Math.min(roleOpenings, remainingTeamCapacity);
  }

  // If no specific openRoles array is configured, available positions is the remaining team capacity
  return remainingTeamCapacity;
}

// Form validation: Project creation / editing
export function validateProjectForm(formData) {
  const errors = {};

  if (!formData.title || formData.title.trim().length < 5) {
    errors.title = 'Project title must be at least 5 characters.';
  } else if (formData.title.trim().length > 100) {
    errors.title = 'Project title cannot exceed 100 characters.';
  }

  if (!formData.tagline || formData.tagline.trim().length < 10) {
    errors.tagline = 'Tagline must be at least 10 characters.';
  } else if (formData.tagline.trim().length > 160) {
    errors.tagline = 'Tagline cannot exceed 160 characters.';
  }

  if (!formData.problemStatement || formData.problemStatement.trim().length < 20) {
    errors.problemStatement = 'Problem statement must be at least 20 characters.';
  } else if (formData.problemStatement.trim().length > 1000) {
    errors.problemStatement = 'Problem statement cannot exceed 1000 characters.';
  }

  if (!formData.goals || formData.goals.trim().length < 20) {
    errors.goals = 'Project goals must be at least 20 characters.';
  } else if (formData.goals.trim().length > 1000) {
    errors.goals = 'Goals cannot exceed 1000 characters.';
  }

  if (!formData.summary || formData.summary.trim().length < 20) {
    errors.summary = 'Summary must be at least 20 characters.';
  } else if (formData.summary.trim().length > 500) {
    errors.summary = 'Summary cannot exceed 500 characters.';
  }

  if (!formData.description || formData.description.trim().length < 30) {
    errors.description = 'Full description must be at least 30 characters.';
  } else if (formData.description.trim().length > 3000) {
    errors.description = 'Description cannot exceed 3000 characters.';
  }

  const validCategories = PROJECT_CATEGORIES.filter(c => c !== 'All');
  if (!formData.category || !validCategories.includes(formData.category)) {
    errors.category = 'Please select a valid project category.';
  }

  if (!formData.visibility || !PROJECT_VISIBILITY.includes(formData.visibility)) {
    errors.visibility = 'Please choose visibility (public, campus-only, or private).';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// Form validation: Join request application
export function validateJoinRequestForm(formData) {
  const errors = {};

  if (!formData.roleId) {
    errors.roleId = 'Please select an open position.';
  }

  if (!formData.introduction || formData.introduction.trim().length < 20) {
    errors.introduction = 'Introduction must be at least 20 characters.';
  } else if (formData.introduction.trim().length > 1000) {
    errors.introduction = 'Introduction cannot exceed 1000 characters.';
  }

  if (!formData.experienceSummary || formData.experienceSummary.trim().length < 10) {
    errors.experienceSummary = 'Experience summary must be at least 10 characters.';
  } else if (formData.experienceSummary.trim().length > 1000) {
    errors.experienceSummary = 'Experience summary cannot exceed 1000 characters.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// Form validation: Task creation / editing
export function validateTaskForm(formData) {
  const errors = {};

  if (!formData.title || formData.title.trim().length < 3) {
    errors.title = 'Task title must be at least 3 characters.';
  } else if (formData.title.trim().length > 120) {
    errors.title = 'Task title cannot exceed 120 characters.';
  }

  if (!formData.assignedToUserId) {
    errors.assignedToUserId = 'Please assign this task to an active team member.';
  }

  if (formData.priority && !TASK_PRIORITIES.includes(formData.priority)) {
    errors.priority = 'Invalid priority level.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * 1. PROJECT DISCOVERY & LISTING
 * Enforces active recruitment discovery rule:
 * Fully staffed projects (0 available positions) are removed from active recruitment discovery for non-members,
 * but remain accessible to their creator and existing members.
 */
export async function getProjects(params = {}) {
  const {
    search = '',
    category = 'All',
    tag = '',
    recruitingOnly = false,
    includeStaffed = false,
    sortBy = 'newest',
    page = 1,
    limit = 9,
    currentUserId = 'usr-current-student',
  } = params;

  let filtered = [...projectsStore];

  // Visibility check: visitors only see public / campus-only; creator/members see private
  filtered = filtered.filter(p => {
    if (p.visibility === 'private') {
      const isLead = p.lead?.id === currentUserId;
      const isMember = p.team?.members?.some(m => m.userId === currentUserId);
      return isLead || isMember;
    }
    return true;
  });

  // Category filter
  if (category && category !== 'All') {
    filtered = filtered.filter(p => p.category === category);
  }

  // Technology stack tag filter
  if (tag && tag.trim()) {
    const normalizedTag = tag.trim().toLowerCase();
    filtered = filtered.filter(p => p.tags && p.tags.some(t => t.toLowerCase() === normalizedTag));
  }

  // Active recruitment discovery rule:
  // If recruitingOnly is true OR if general discovery without includeStaffed:
  // Projects with 0 available positions MUST NOT appear for non-members.
  // Preserves access for creator and existing members.
  filtered = filtered.filter(p => {
    const available = calculateAvailablePositions(p);
    if (available > 0) return true;
    // Always preserve access for creator and existing team members
    const isLead = p.lead?.id === currentUserId;
    const isMember = p.team?.members?.some(m => m.userId === currentUserId);
    if (isLead || isMember) return true;
    // If recruitingOnly is explicitly requested, staffed projects are never shown to non-members
    if (recruitingOnly) return false;
    // Otherwise show only if includeStaffed is explicitly true
    return Boolean(includeStaffed);
  });

  // Search keyword across title, tagline, description, problemStatement, and tags
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(p => {
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchTagline = p.tagline.toLowerCase().includes(q);
      const matchSummary = p.summary.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchTags = p.tags && p.tags.some(t => t.toLowerCase().includes(q));
      return matchTitle || matchTagline || matchSummary || matchDesc || matchTags;
    });
  }

  // Sorting
  if (sortBy === 'newest') {
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sortBy === 'openings') {
    filtered.sort((a, b) => calculateAvailablePositions(b) - calculateAvailablePositions(a));
  } else if (sortBy === 'members') {
    filtered.sort((a, b) => (b.team?.members?.length || 0) - (a.team?.members?.length || 0));
  }

  const total = filtered.length;
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, parseInt(limit, 10) || 9);
  const startIndex = (pageNum - 1) * limitNum;
  const paginated = filtered.slice(startIndex, startIndex + limitNum);

  return {
    data: paginated,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum) || 1,
    isLiveBackend: false,
  };
}

/**
 * 2. GET PROJECT BY ID
 */
export async function getProjectById(id) {
  if (!id) return null;
  const project = projectsStore.find(p => p.id === id);
  if (!project) return null;
  return {
    ...project,
    availablePositions: calculateAvailablePositions(project),
  };
}

/**
 * 3. CREATE PROJECT & INITIALIZE TEAM
 */
export async function createProject(formData, creatorUser = null) {
  const validation = validateProjectForm(formData);
  if (!validation.isValid) {
    throw { name: 'ValidationError', errors: validation.errors };
  }

  const currentStudent = creatorUser || {
    id: 'usr-current-student',
    name: 'Varsh (Current Student)',
    college: 'Vynora Institute of Technology',
    department: 'Computer Science',
    avatar: 'V',
  };

  // Check duplicate title
  const isDuplicate = projectsStore.some(
    p => p.title.trim().toLowerCase() === formData.title.trim().toLowerCase()
  );
  if (isDuplicate) {
    throw {
      name: 'ValidationError',
      errors: { title: 'A project with this title already exists in the catalog.' },
    };
  }

  // Parse open roles
  const parsedRoles = (formData.openRoles || []).map((r, idx) => ({
    id: `role-${Date.now()}-${idx}`,
    title: r.title.trim(),
    skillsRequired: Array.isArray(r.skillsRequired)
      ? r.skillsRequired
      : (r.skillsRequired || '').split(',').map(s => s.trim()).filter(Boolean),
    description: (r.description || '').trim(),
    openings: Math.max(1, parseInt(r.openings, 10) || 1),
    filled: 0,
    status: 'open',
  }));

  const projectId = `proj-${Date.now()}`;
  const teamId = `team-${Date.now()}`;

  const newProject = {
    id: projectId,
    title: formData.title.trim(),
    tagline: formData.tagline.trim(),
    problemStatement: formData.problemStatement.trim(),
    goals: formData.goals.trim(),
    summary: formData.summary.trim(),
    description: formData.description.trim(),
    recruitmentRequirements: (formData.recruitmentRequirements || '').trim(),
    category: formData.category,
    tags: Array.isArray(formData.tags)
      ? formData.tags
      : (formData.tags || '').split(',').map(t => t.trim().toLowerCase()).filter(Boolean),
    visibility: formData.visibility || 'public',
    status: 'active',
    lead: {
      id: currentStudent.id,
      name: currentStudent.name,
      college: currentStudent.college,
      department: currentStudent.department,
      avatar: currentStudent.avatar,
    },
    team: {
      id: teamId,
      name: `${formData.title.trim()} Team`,
      maxCapacity: Math.max(3, parseInt(formData.maxCapacity, 10) || 8),
      members: [
        {
          userId: currentStudent.id,
          name: currentStudent.name,
          college: currentStudent.college,
          role: 'owner',
          assignedRoleTitle: 'Project Lead',
          joinedAt: new Date().toISOString(),
        },
      ],
    },
    openRoles: parsedRoles,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  projectsStore = [newProject, ...projectsStore];
  persistStores();

  // Initialize Siri's team chat room
  chatIntegrationAdapter.initializeTeamChatRoom(
    teamId,
    projectId,
    newProject.title,
    [currentStudent.id]
  );

  // Emit points event
  pointsServiceAdapter.emitPointsEvent('PROJECT_LAUNCHED', {
    projectId,
    leadId: currentStudent.id,
  });

  return {
    success: true,
    data: newProject,
    message: 'Project and team workspace created successfully!',
  };
}

/**
 * 4. EDIT PROJECT
 */
export async function updateProject(id, updates, callerUserId = 'usr-current-student') {
  const project = projectsStore.find(p => p.id === id);
  if (!project) throw new Error('Project not found.');

  // Role check: Only Owner or Manager can edit
  const member = project.team.members.find(m => m.userId === callerUserId);
  if (!member || (member.role !== 'owner' && member.role !== 'manager')) {
    throw new Error('Access denied: Only project owners or managers can edit project details.');
  }

  const allowedFields = [
    'title', 'tagline', 'problemStatement', 'goals', 'summary',
    'description', 'recruitmentRequirements', 'category', 'tags',
    'visibility', 'status',
  ];

  allowedFields.forEach(field => {
    if (updates[field] !== undefined) {
      project[field] = updates[field];
    }
  });

  if (updates.openRoles) {
    // Preserve existing filled counts when modifying roles
    project.openRoles = updates.openRoles.map((r, idx) => {
      const existing = project.openRoles.find(er => er.id === r.id);
      return {
        id: r.id || `role-${Date.now()}-${idx}`,
        title: r.title.trim(),
        skillsRequired: Array.isArray(r.skillsRequired)
          ? r.skillsRequired
          : (r.skillsRequired || '').split(',').map(s => s.trim()).filter(Boolean),
        description: (r.description || '').trim(),
        openings: Math.max(1, parseInt(r.openings, 10) || 1),
        filled: existing ? existing.filled : 0,
        status: existing && existing.filled >= r.openings ? 'closed' : 'open',
      };
    });
  }

  project.updatedAt = new Date().toISOString();
  persistStores();

  return {
    success: true,
    data: project,
    message: 'Project updated successfully!',
  };
}

/**
 * 5. SUBMIT JOIN REQUEST (APPLICATION)
 * Enforces campus eligibility rules, duplicate application prevention, and capacity availability.
 */
export async function submitJoinRequest(projectId, applicationData, applicantUser = null) {
  const validation = validateJoinRequestForm(applicationData);
  if (!validation.isValid) {
    throw { name: 'ValidationError', errors: validation.errors };
  }

  const project = projectsStore.find(p => p.id === projectId);
  if (!project) throw new Error('Project not found.');

  const applicant = applicantUser || {
    id: 'usr-current-student',
    name: 'Varsh (Current Student)',
    college: 'Vynora Institute of Technology',
    department: 'Computer Science',
    avatar: 'V',
  };

  // Rule: Creator / Member cannot apply
  const isMember = project.team.members.some(m => m.userId === applicant.id);
  if (isMember) {
    throw {
      name: 'ValidationError',
      errors: { message: 'You are already an active member of this project team.' },
    };
  }

  // Rule: Prevent duplicate pending applications
  const hasPending = requestsStore.some(
    r => r.projectId === projectId && r.applicant.id === applicant.id && r.status === 'pending'
  );
  if (hasPending) {
    throw {
      name: 'ValidationError',
      errors: { message: 'You already have an active pending application for this project.' },
    };
  }

  // Rule: Campus eligibility for campus-only projects
  if (project.visibility === 'campus-only') {
    const leadCollege = project.lead?.college || '';
    const applicantCollege = applicant.college || '';
    if (leadCollege && applicantCollege && leadCollege.toLowerCase() !== applicantCollege.toLowerCase()) {
      throw {
        name: 'ValidationError',
        errors: { message: `This project is restricted to students from ${leadCollege}.` },
      };
    }
  }

  // Rule: Project must have available positions
  const availablePositions = calculateAvailablePositions(project);
  if (availablePositions <= 0) {
    throw {
      name: 'ValidationError',
      errors: { message: 'This project is currently fully staffed and no longer accepting applications.' },
    };
  }

  // Verify role availability
  const role = project.openRoles.find(r => r.id === applicationData.roleId);
  if (!role || role.status === 'closed' || role.filled >= role.openings) {
    throw {
      name: 'ValidationError',
      errors: { roleId: 'This role is no longer accepting applications.' },
    };
  }

  const newRequest = {
    id: `req-${Date.now()}`,
    projectId,
    projectTitle: project.title,
    roleId: role.id,
    roleTitle: role.title,
    applicant: {
      id: applicant.id,
      name: applicant.name,
      college: applicant.college,
      department: applicant.department,
      avatar: applicant.avatar,
    },
    introduction: applicationData.introduction.trim(),
    relevantSkills: Array.isArray(applicationData.relevantSkills)
      ? applicationData.relevantSkills
      : (applicationData.relevantSkills || '').split(',').map(s => s.trim()).filter(Boolean),
    experienceSummary: applicationData.experienceSummary.trim(),
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  requestsStore = [newRequest, ...requestsStore];
  persistStores();

  return {
    success: true,
    data: newRequest,
    message: 'Application submitted successfully to Project Lead!',
  };
}

/**
 * 6. RETRIEVE APPLICANTS FOR A PROJECT (Lead / Manager View)
 * Enriches applicants with privacy-safe profile summaries from Ram's module
 */
export async function getProjectApplicants(projectId, callerUserId = 'usr-current-student') {
  const project = projectsStore.find(p => p.id === projectId);
  if (!project) throw new Error('Project not found.');

  const member = project.team.members.find(m => m.userId === callerUserId);
  if (!member || (member.role !== 'owner' && member.role !== 'manager')) {
    throw new Error('Access denied: Only project owners or managers can view applicants.');
  }

  const requests = requestsStore.filter(r => r.projectId === projectId);

  // Retrieve sanitized profile data for each applicant
  const enriched = await Promise.all(
    requests.map(async req => {
      const profile = await getStudentProfileSummary(req.applicant.id);
      return {
        ...req,
        applicantProfile: profile,
      };
    })
  );

  return enriched;
}

/**
 * 7. REVIEW APPLICANT (Accept / Reject) with Atomic Capacity Enforcement
 */
export async function reviewApplicant(requestId, decision, feedback = '', reviewerUserId = 'usr-current-student') {
  if (!['accepted', 'rejected'].includes(decision)) {
    throw new Error('Decision must be either accepted or rejected.');
  }

  const request = requestsStore.find(r => r.id === requestId);
  if (!request) throw new Error('Application not found.');

  if (request.status !== 'pending') {
    throw new Error('This application has already been processed.');
  }

  const project = projectsStore.find(p => p.id === request.projectId);
  if (!project) throw new Error('Project associated with application not found.');

  // Authorization check
  const member = project.team.members.find(m => m.userId === reviewerUserId);
  if (!member || (member.role !== 'owner' && member.role !== 'manager')) {
    throw new Error('Access denied: Only project owners or managers can review applications.');
  }

  if (decision === 'accepted') {
    // Atomic capacity enforcement: Team maximum
    if (project.team.members.length >= project.team.maxCapacity) {
      throw new Error(`Team capacity reached (${project.team.maxCapacity} members maximum).`);
    }

    // Atomic capacity enforcement: Role openings
    const role = project.openRoles.find(r => r.id === request.roleId);
    if (!role || role.filled >= role.openings) {
      throw new Error(`Position '${request.roleTitle}' has already been filled.`);
    }

    // Add applicant as team member
    project.team.members.push({
      userId: request.applicant.id,
      name: request.applicant.name,
      college: request.applicant.college,
      role: 'member',
      assignedRoleTitle: request.roleTitle,
      joinedAt: new Date().toISOString(),
    });

    // Increment filled count; close position if fully staffed
    role.filled = (role.filled || 0) + 1;
    if (role.filled >= role.openings) {
      role.status = 'closed';
    }

    // Authorize new member in Siri's chat module
    chatIntegrationAdapter.authorizeMemberInChat(project.team.id, request.applicant.id);

    // Emit Points event
    pointsServiceAdapter.emitPointsEvent('TEAM_MEMBER_RECRUITED', {
      projectId: project.id,
      memberId: request.applicant.id,
      roleTitle: request.roleTitle,
    });
  }

  request.status = decision;
  request.reviewedAt = new Date().toISOString();
  request.reviewerFeedback = feedback.trim();
  persistStores();

  return {
    success: true,
    data: request,
    message: `Application ${decision === 'accepted' ? 'accepted' : 'rejected'}.`,
  };
}

/**
 * 8. TEAM MEMBER REMOVAL
 */
export async function removeTeamMember(projectId, targetUserId, callerUserId = 'usr-current-student') {
  const project = projectsStore.find(p => p.id === projectId);
  if (!project) throw new Error('Project not found.');

  const caller = project.team.members.find(m => m.userId === callerUserId);
  const target = project.team.members.find(m => m.userId === targetUserId);

  if (!caller || !target) throw new Error('Member or caller not found on this team.');

  // Role permissions:
  // - Members cannot remove anyone
  // - Managers cannot remove Owners or other Managers
  // - Owners cannot be removed
  if (caller.role === 'member') {
    throw new Error('Access denied: Regular members cannot remove teammates.');
  }
  if (caller.role === 'manager' && (target.role === 'owner' || target.role === 'manager')) {
    throw new Error('Access denied: Managers cannot remove other managers or the owner.');
  }
  if (target.role === 'owner') {
    throw new Error('The project owner cannot be removed. Transfer ownership first.');
  }

  // Remove member from team
  project.team.members = project.team.members.filter(m => m.userId !== targetUserId);

  // Deauthorize in chat
  chatIntegrationAdapter.deauthorizeMemberInChat(project.team.id, targetUserId);

  persistStores();

  return {
    success: true,
    message: `${target.name} has been removed from the team.`,
  };
}

/**
 * 9. LEAVE TEAM
 */
export async function leaveTeam(projectId, userId = 'usr-current-student') {
  const project = projectsStore.find(p => p.id === projectId);
  if (!project) throw new Error('Project not found.');

  const member = project.team.members.find(m => m.userId === userId);
  if (!member) throw new Error('You are not a member of this team.');

  if (member.role === 'owner') {
    throw new Error('Project owners cannot leave without transferring ownership to another member first.');
  }

  project.team.members = project.team.members.filter(m => m.userId !== userId);
  chatIntegrationAdapter.deauthorizeMemberInChat(project.team.id, userId);

  persistStores();

  return {
    success: true,
    message: 'You have left the team.',
  };
}

/**
 * 10. TRANSFER OWNERSHIP
 */
export async function transferOwnership(projectId, newOwnerUserId, callerUserId = 'usr-current-student') {
  const project = projectsStore.find(p => p.id === projectId);
  if (!project) throw new Error('Project not found.');

  const caller = project.team.members.find(m => m.userId === callerUserId);
  if (!caller || caller.role !== 'owner') {
    throw new Error('Access denied: Only the current project owner can transfer ownership.');
  }

  const target = project.team.members.find(m => m.userId === newOwnerUserId);
  if (!target) {
    throw new Error('Target user must be an active team member.');
  }

  if (target.userId === caller.userId) {
    throw new Error('You are already the owner of this project.');
  }

  // Safe swap: previous owner becomes manager, target becomes owner
  caller.role = 'manager';
  target.role = 'owner';
  project.lead = {
    id: target.userId,
    name: target.name,
    college: target.college,
    avatar: target.name.charAt(0).toUpperCase(),
  };

  persistStores();

  return {
    success: true,
    message: `Project ownership successfully transferred to ${target.name}.`,
  };
}

/**
 * 11. INVITATIONS
 */
export async function sendInvitation(projectId, inviteData, callerUserId = 'usr-current-student') {
  const project = projectsStore.find(p => p.id === projectId);
  if (!project) throw new Error('Project not found.');

  const caller = project.team.members.find(m => m.userId === callerUserId);
  if (!caller || (caller.role !== 'owner' && caller.role !== 'manager')) {
    throw new Error('Access denied: Only project owners or managers can send invitations.');
  }

  const { invitedUserId, invitedStudentName, roleId, message } = inviteData;

  // Prevent inviting current members
  if (project.team.members.some(m => m.userId === invitedUserId)) {
    throw new Error(`${invitedStudentName} is already an active member of this team.`);
  }

  // Prevent duplicate pending invitations
  const existing = invitationsStore.find(
    i => i.projectId === projectId && i.invitedUserId === invitedUserId && i.status === 'pending'
  );
  if (existing) {
    throw new Error(`An active pending invitation has already been sent to ${invitedStudentName}.`);
  }

  const role = project.openRoles.find(r => r.id === roleId);

  const invitation = {
    id: `inv-${Date.now()}`,
    projectId,
    projectTitle: project.title,
    roleId,
    roleTitle: role ? role.title : 'Team Member',
    invitedUserId,
    invitedStudentName: invitedStudentName || 'Student',
    invitedByUserId: callerUserId,
    invitedByName: caller.name,
    message: (message || '').trim(),
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  invitationsStore = [invitation, ...invitationsStore];
  persistStores();

  return {
    success: true,
    data: invitation,
    message: `Invitation successfully sent to ${invitation.invitedStudentName}.`,
  };
}

export async function respondToInvitation(invitationId, decision, userId = 'usr-current-student') {
  if (!['accepted', 'rejected'].includes(decision)) {
    throw new Error('Decision must be accepted or rejected.');
  }

  const invitation = invitationsStore.find(i => i.id === invitationId);
  if (!invitation || invitation.invitedUserId !== userId) {
    throw new Error('Invitation not found or unauthorized.');
  }

  if (invitation.status !== 'pending') {
    throw new Error('This invitation has already been processed.');
  }

  if (decision === 'accepted') {
    const project = projectsStore.find(p => p.id === invitation.projectId);
    if (!project) throw new Error('Project not found.');

    if (project.team.members.length >= project.team.maxCapacity) {
      throw new Error('Team has reached maximum capacity.');
    }

    project.team.members.push({
      userId,
      name: invitation.invitedStudentName,
      college: 'Vynora Campus',
      role: 'member',
      assignedRoleTitle: invitation.roleTitle,
      joinedAt: new Date().toISOString(),
    });

    const role = project.openRoles.find(r => r.id === invitation.roleId);
    if (role) {
      role.filled = (role.filled || 0) + 1;
      if (role.filled >= role.openings) role.status = 'closed';
    }

    chatIntegrationAdapter.authorizeMemberInChat(project.team.id, userId);
  }

  invitation.status = decision;
  invitation.respondedAt = new Date().toISOString();
  persistStores();

  return {
    success: true,
    data: invitation,
    message: `Invitation ${decision}.`,
  };
}

export async function getUserInvitations(userId = 'usr-current-student') {
  return invitationsStore.filter(i => i.invitedUserId === userId);
}

/**
 * 12. TASK MANAGEMENT (Basic Team Task Checklist)
 */
export async function getProjectTasks(projectId, callerUserId = 'usr-current-student') {
  const project = projectsStore.find(p => p.id === projectId);
  if (!project) throw new Error('Project not found.');

  // Access check: Only verified team members can view tasks
  const isMember = project.team.members.some(m => m.userId === callerUserId);
  if (!isMember) {
    throw new Error('Access denied: Task lists are restricted to active team members.');
  }

  return tasksStore.filter(t => t.projectId === projectId);
}

export async function createProjectTask(projectId, taskData, callerUserId = 'usr-current-student') {
  const validation = validateTaskForm(taskData);
  if (!validation.isValid) {
    throw { name: 'ValidationError', errors: validation.errors };
  }

  const project = projectsStore.find(p => p.id === projectId);
  if (!project) throw new Error('Project not found.');

  const isMember = project.team.members.some(m => m.userId === callerUserId);
  if (!isMember) {
    throw new Error('Access denied: Only team members can create tasks.');
  }

  // Validate assignee is on the team
  const assignee = project.team.members.find(m => m.userId === taskData.assignedToUserId);
  if (!assignee) {
    throw new Error('Task assignee must be an active member of this project team.');
  }

  const newTask = {
    id: `task-${Date.now()}`,
    projectId,
    title: taskData.title.trim(),
    description: (taskData.description || '').trim(),
    assignedToUserId: assignee.userId,
    assignedToName: assignee.name,
    createdByUserId: callerUserId,
    priority: taskData.priority || 'medium',
    status: 'todo',
    dueDate: taskData.dueDate || '',
    createdAt: new Date().toISOString(),
  };

  tasksStore = [newTask, ...tasksStore];
  persistStores();

  return {
    success: true,
    data: newTask,
    message: 'Task created successfully!',
  };
}

export async function updateProjectTask(projectId, taskId, updates, callerUserId = 'usr-current-student') {
  const project = projectsStore.find(p => p.id === projectId);
  if (!project) throw new Error('Project not found.');

  const isMember = project.team.members.some(m => m.userId === callerUserId);
  if (!isMember) {
    throw new Error('Access denied: Only team members can update tasks.');
  }

  const task = tasksStore.find(t => t.id === taskId && t.projectId === projectId);
  if (!task) throw new Error('Task not found.');

  const allowed = ['title', 'description', 'priority', 'status', 'dueDate', 'assignedToUserId'];
  allowed.forEach(field => {
    if (updates[field] !== undefined) {
      task[field] = updates[field];
    }
  });

  if (updates.assignedToUserId) {
    const assignee = project.team.members.find(m => m.userId === updates.assignedToUserId);
    if (assignee) task.assignedToName = assignee.name;
  }

  if (task.status === 'completed' && !task.completedAt) {
    task.completedAt = new Date().toISOString();
    pointsServiceAdapter.emitPointsEvent('TASK_COMPLETED', { taskId: task.id, projectId });
  } else if (task.status !== 'completed') {
    task.completedAt = null;
  }

  persistStores();

  return {
    success: true,
    data: task,
    message: 'Task updated successfully!',
  };
}

/**
 * 13. USER SUMMARY HELPERS
 */
export async function getUserProjects(userId = 'usr-current-student') {
  return projectsStore.filter(p => {
    const isLead = p.lead?.id === userId;
    const isMember = p.team?.members?.some(m => m.userId === userId);
    return isLead || isMember;
  });
}

export async function getUserPendingRequests(userId = 'usr-current-student') {
  return requestsStore.filter(r => r.applicant.id === userId);
}
