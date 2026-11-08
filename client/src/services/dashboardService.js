/**
 * Vynora Connect — Dashboard Service & Adapter Layer
 * Fetches aggregated metrics, recommendations, events, projects, and user preferences.
 * Implements seamless live backend requests with robust dev-mock fallback.
 */

import { apiClient } from './apiClient.js';

const MOCK_DASHBOARD_DATA = {
  user: {
    id: 'usr-karthik',
    name: 'Karthik',
    college: 'SR University',
    department: 'Computer Science & Engineering',
    graduationYear: 2026,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    bio: 'Full-stack builder passionate about distributed systems, student developer communities, and cloud-native architecture.',
    skills: ['React', 'Node.js', 'Express', 'MongoDB', 'System Design', 'TypeScript'],
  },
  stats: {
    connections: 48,
    pendingRequests: 3,
    savedOpportunities: 7,
    upcomingEvents: 2,
    unreadMessages: 5,
    activeProjects: 4,
  },
  upcomingEvents: [
    {
      id: 'evt-301',
      title: 'Inter-College AI & Web3 Summit 2026',
      organizer: 'Vynora Innovation Council',
      club: 'Tech Nexus Club',
      date: '2026-11-18T10:00:00.000Z',
      formattedDate: 'Nov 18, 2026 • 10:00 AM',
      location: 'Auditorium Hall A & Virtual Stream',
      type: 'Conference / Keynote',
      registrationStatus: 'open',
      registeredCount: 342,
      maxCapacity: 500,
      bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'evt-302',
      title: 'Competitive Programming Campus Clash',
      organizer: 'Coding Club & IEEE Student Branch',
      club: 'Algorand Student Society',
      date: '2026-11-22T14:30:00.000Z',
      formattedDate: 'Nov 22, 2026 • 2:30 PM',
      location: 'Lab 4 / Online Code Arena',
      type: 'Contest',
      registrationStatus: 'open',
      registeredCount: 184,
      maxCapacity: 250,
      bannerUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
    },
  ],
  collaborationProjects: [
    {
      id: 'prj-401',
      title: 'Autonomous Campus Drone Delivery System',
      description: 'Building an automated quadcopter network for urgent medical and library book dispatch between university departments.',
      creator: {
        id: 'std-204',
        name: 'Varshitha K.',
        college: 'SR University',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
      },
      technologies: ['ROS2', 'Python', 'OpenCV', 'Gazebo'],
      teamSize: '3/5 Members',
      recruitmentStatus: 'open',
      openRoles: ['Computer Vision Specialist', 'Firmware Engineer'],
    },
    {
      id: 'prj-402',
      title: 'Peer-to-Peer Notes & Question Paper Ledger',
      description: 'Decentralized document validation and indexing engine ensuring students have access to verified academic resources.',
      creator: {
        id: 'std-209',
        name: 'Rahul Sen',
        college: 'IIT Hyderabad',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80',
      },
      technologies: ['React', 'Node.js', 'PostgreSQL', 'IPFS'],
      teamSize: '2/4 Members',
      recruitmentStatus: 'open',
      openRoles: ['Frontend Developer', 'UI/UX Designer'],
    },
  ],
  recommendations: [
    {
      id: 'std-101',
      name: 'Priya Sharma',
      college: 'IIT Madras',
      department: 'Computer Science',
      graduationYear: 2026,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
      skills: ['Distributed Systems', 'Golang', 'Kubernetes'],
      mutualConnections: 6,
    },
    {
      id: 'std-102',
      name: 'Aditya Varma',
      college: 'BITS Pilani',
      department: 'Electronics & Communication',
      graduationYear: 2027,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      skills: ['Embedded Systems', 'IoT', 'Rust'],
      mutualConnections: 4,
    },
    {
      id: 'std-103',
      name: 'Sneha Reddy',
      college: 'Osmania University',
      department: 'Artificial Intelligence',
      graduationYear: 2026,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      skills: ['PyTorch', 'LLMs', 'FastAPI'],
      mutualConnections: 9,
    },
  ],
  mentors: [
    {
      id: 'mnt-501',
      name: 'Dr. Surya Teja',
      title: 'Senior Systems Architect',
      expertise: ['Cloud Architecture', 'Distributed Systems'],
      collegeOrCompany: 'Ex-Amazon / IIT Research Affiliate',
      availability: 'Available this weekend (3 slots)',
      rating: 4.9,
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80',
    },
    {
      id: 'mnt-502',
      name: 'Ananya Deshmukh',
      title: 'Software Engineer @ Microsoft',
      expertise: ['Full-Stack Engineering', 'System Design'],
      collegeOrCompany: 'Microsoft / BITS Alum',
      availability: 'Tuesdays & Thursdays',
      rating: 4.8,
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
    },
  ],
  notifications: [
    {
      id: 'notif-601',
      title: 'Connection Accepted',
      description: 'Priya Sharma accepted your campus connection request.',
      timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      read: false,
      type: 'connection',
    },
    {
      id: 'notif-602',
      title: 'New Hackathon Opportunity',
      description: 'HackVynora 2026 announced registration deadline in 5 days.',
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      read: false,
      type: 'opportunity',
    },
    {
      id: 'notif-603',
      title: 'Project Collaboration Invitation',
      description: 'Varshitha invited you to inspect Autonomous Campus Drone project.',
      timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
      read: true,
      type: 'project',
    },
  ],
  opportunities: [
    {
      id: 'opp-201',
      title: 'Software Engineering Summer Intern 2027',
      organization: 'Google Research & Engineering',
      type: 'internship',
      deadline: '2026-11-25T23:59:59Z',
      location: 'Bengaluru / Hyderabad (Hybrid)',
      stipendOrPrize: '₹1,25,000 / month',
      applicationUrl: 'https://careers.google.com/students',
      isSaved: true,
    },
    {
      id: 'opp-202',
      title: 'HackVynora 2026 — Inter-College AI Hackathon',
      organization: 'Vynora Campus Innovation Lab',
      type: 'hackathon',
      deadline: '2026-11-05T18:00:00Z',
      location: 'Bengaluru & Virtual (Hybrid)',
      stipendOrPrize: '₹3,00,000 Prize Pool',
      applicationUrl: 'https://hackvynora.devpost.com',
      isSaved: false,
    },
  ],
  resources: [
    {
      id: 'res-101',
      title: 'Clean Code & Data Structures Handbook',
      category: 'Data Structures & Algorithms',
      type: 'notes',
      description: 'Comprehensive guide covering arrays, trees, graphs, and dynamic programming patterns.',
      sourceUrl: 'https://github.com/vynora/dsa-handbook',
      contributorName: 'Manideepika',
    },
    {
      id: 'res-102',
      title: 'System Design for College Capstones',
      category: 'System Design',
      type: 'roadmap',
      description: 'Step-by-step roadmap for architecting scalable web platforms, caching layers, and database sharding.',
      sourceUrl: 'https://roadmap.sh/system-design',
      contributorName: 'Karthik',
    },
  ],
};

let localSavedOpportunities = new Set(['opp-201']);
let localConnectedStudents = new Set();
let localDismissedNotifications = new Set();

export async function getDashboardData() {
  try {
    const response = await apiClient.get('/dashboard');
    if (response?.success && response.data) {
      return {
        success: true,
        data: response.data,
        isLiveBackend: true,
      };
    }
  } catch {
    // Graceful offline fallback
  }

  return {
    success: true,
    data: {
      ...MOCK_DASHBOARD_DATA,
      stats: {
        ...MOCK_DASHBOARD_DATA.stats,
        connections: MOCK_DASHBOARD_DATA.stats.connections + localConnectedStudents.size,
        savedOpportunities: localSavedOpportunities.size,
      },
    },
    isLiveBackend: false,
  };
}

export async function toggleSaveOpportunity(oppId) {
  if (localSavedOpportunities.has(oppId)) {
    localSavedOpportunities.delete(oppId);
    return { saved: false, count: localSavedOpportunities.size };
  } else {
    localSavedOpportunities.add(oppId);
    return { saved: true, count: localSavedOpportunities.size };
  }
}

export function isOpportunitySaved(oppId) {
  return localSavedOpportunities.has(oppId);
}

export async function toggleConnectStudent(studentId) {
  if (localConnectedStudents.has(studentId)) {
    localConnectedStudents.delete(studentId);
    return { connected: false };
  } else {
    localConnectedStudents.add(studentId);
    return { connected: true };
  }
}

export function isStudentConnected(studentId) {
  return localConnectedStudents.has(studentId);
}

export async function dismissNotification(notifId) {
  localDismissedNotifications.add(notifId);
  return { success: true };
}

export function isNotificationDismissed(notifId) {
  return localDismissedNotifications.has(notifId);
}

export async function updatePreferences(preferences) {
  try {
    const response = await apiClient.patch('/dashboard/preferences', preferences);
    if (response?.success) {
      return response.data;
    }
  } catch {
    // Offline simulation
  }
  return preferences;
}
