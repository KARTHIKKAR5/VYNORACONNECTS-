/**
 * Vynora Connect — Cross-Module Integration Adapter Layer
 * Aggregates live domain data from team modules:
 * - Ram: Student networking, profiles, connection recommendations
 * - Deepu: Opportunities and Educational Resources
 * - Varsh: Projects, teams, and collaboration requests
 * - Sindhu: Campus events and registrations
 * - Surya: Mentorship and student services
 * - Siri: Notifications and unread counts
 * - Revanth: Content moderation and public visibility rules
 *
 * Fault-tolerant design: every module call is isolated with safe defaults.
 */

// In-memory backing dataset for development and demonstrations
const MODULE_DATA = {
  stats: {
    connections: 48,
    pendingRequests: 3,
    savedOpportunities: 7,
    upcomingEvents: 2,
    unreadMessages: 5,
    activeProjects: 4,
  },

  students: [
    {
      id: 'std-101',
      name: 'Priya Sharma',
      college: 'IIT Madras',
      department: 'Computer Science',
      graduationYear: 2026,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
      skills: ['Distributed Systems', 'Golang', 'Kubernetes'],
      mutualConnections: 6,
      bio: 'Cloud architecture enthusiast, currently building inter-college microservices.',
    },
    {
      id: 'std-102',
      name: 'Aditya Varma',
      college: 'BITS Pilani',
      department: 'Electronics & Communication',
      graduationYear: 2027,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      skills: ['Embedded Systems', 'IoT', 'Rust', 'C++'],
      mutualConnections: 4,
      bio: 'Building low-latency hardware interfaces and edge intelligence.',
    },
    {
      id: 'std-103',
      name: 'Sneha Reddy',
      college: 'Osmania University',
      department: 'Artificial Intelligence',
      graduationYear: 2026,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      skills: ['PyTorch', 'LLMs', 'FastAPI', 'MLOps'],
      mutualConnections: 9,
      bio: 'Researching multi-agent reasoning and prompt compression algorithms.',
    },
    {
      id: 'std-104',
      name: 'Rohan Mehta',
      college: 'NIT Warangal',
      department: 'Information Technology',
      graduationYear: 2026,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
      skills: ['React Native', 'Mobile UX', 'TailwindCSS'],
      mutualConnections: 3,
      bio: 'Mobile dev focusing on campus productivity and peer mentorship.',
    },
  ],

  events: [
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
      isPublic: true,
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
      isPublic: true,
    },
    {
      id: 'evt-303',
      title: 'Cross-Campus Open Source Showcase',
      organizer: 'Open Source Community',
      club: 'FOSS Club',
      date: '2026-11-29T16:00:00.000Z',
      formattedDate: 'Nov 29, 2026 • 4:00 PM',
      location: 'Virtual Discord Stage',
      type: 'Showcase',
      registrationStatus: 'registered',
      registeredCount: 95,
      maxCapacity: 200,
      bannerUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80',
      isPublic: true,
    },
  ],

  projects: [
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
      technologies: ['ROS2', 'Python', 'OpenCV', 'Gazebo', 'Raspberry Pi'],
      teamSize: '3/5 Members',
      recruitmentStatus: 'open',
      openRoles: ['Computer Vision Specialist', 'Firmware Engineer'],
      isPublic: true,
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
      isPublic: true,
    },
    {
      id: 'prj-403',
      title: 'Student Mood & Burnout Detection Assistant',
      description: 'Empathetic conversational agent integrating wearable sensor metrics to recommend workload balancing and study pauses.',
      creator: {
        id: 'std-311',
        name: 'Meera Iyer',
        college: 'NIT Trichy',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
      },
      technologies: ['FastAPI', 'Next.js', 'HuggingFace', 'TailwindCSS'],
      teamSize: '4/4 Members',
      recruitmentStatus: 'filled',
      openRoles: [],
      isPublic: true,
    },
  ],

  mentors: [
    {
      id: 'mnt-501',
      name: 'Dr. Surya Teja',
      title: 'Senior Systems Architect & Research Mentor',
      expertise: ['Cloud Architecture', 'Distributed Systems', 'M.S. & PhD Guidance'],
      collegeOrCompany: 'Ex-Amazon / IIT Research Affiliate',
      availability: 'Available this weekend (3 slots)',
      rating: 4.9,
      reviewsCount: 38,
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80',
      isVerified: true,
    },
    {
      id: 'mnt-502',
      name: 'Ananya Deshmukh',
      title: 'Software Engineer @ Microsoft',
      expertise: ['Full-Stack Engineering', 'System Design Interviews', 'Resume Review'],
      collegeOrCompany: 'Microsoft / BITS Alum',
      availability: 'Tuesdays & Thursdays',
      rating: 4.8,
      reviewsCount: 29,
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
      isVerified: true,
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
      category: 'Software Engineering',
      deadline: '2026-11-25T23:59:59Z',
      location: 'Bengaluru / Hyderabad (Hybrid)',
      remote: false,
      stipendOrPrize: '₹1,25,000 / month',
      applicationUrl: 'https://careers.google.com/students',
      isSaved: true,
      isVerified: true,
    },
    {
      id: 'opp-202',
      title: 'HackVynora 2026 — Inter-College AI Hackathon',
      organization: 'Vynora Campus Innovation Lab',
      type: 'hackathon',
      category: 'Hackathon',
      deadline: '2026-11-05T18:00:00Z',
      location: 'Bengaluru & Virtual (Hybrid)',
      remote: true,
      stipendOrPrize: '₹3,00,000 Prize Pool',
      applicationUrl: 'https://hackvynora.devpost.com',
      isSaved: false,
      isVerified: true,
    },
    {
      id: 'opp-203',
      title: 'Junior Frontend Engineer (React / TypeScript)',
      organization: 'Zerodha Tech',
      type: 'job',
      category: 'Full-time Job',
      deadline: '2026-11-15T23:59:59Z',
      location: 'Bengaluru (On-site)',
      remote: false,
      stipendOrPrize: '₹14 - 18 LPA',
      applicationUrl: 'https://zerodha.tech/careers',
      isSaved: false,
      isVerified: true,
    },
  ],

  resources: [
    {
      id: 'res-101',
      title: 'Clean Code & Data Structures Handbook',
      category: 'Data Structures & Algorithms',
      type: 'notes',
      description: 'Comprehensive guide covering arrays, trees, graphs, and dynamic programming patterns with visual explanations.',
      sourceUrl: 'https://github.com/vynora/dsa-handbook',
      contributorName: 'Manideepika',
      college: 'Vynora Institute of Technology',
      createdAt: '2026-10-20T10:00:00Z',
      isVerified: true,
    },
    {
      id: 'res-102',
      title: 'System Design for College Capstones',
      category: 'System Design',
      type: 'roadmap',
      description: 'Step-by-step roadmap for architecting scalable web platforms, caching layers, and database sharding.',
      sourceUrl: 'https://roadmap.sh/system-design',
      contributorName: 'Karthik',
      college: 'SR University',
      createdAt: '2026-10-22T14:30:00Z',
      isVerified: true,
    },
    {
      id: 'res-103',
      title: 'Modern React & Vite Performance Blueprint',
      category: 'Web Development',
      type: 'tutorial',
      description: 'Production strategies for bundle optimization, code splitting, memoization, and fast navigation states.',
      sourceUrl: 'https://react.dev/learn',
      contributorName: 'Aditya',
      college: 'BITS Pilani',
      createdAt: '2026-10-24T09:15:00Z',
      isVerified: true,
    },
  ],
};

/**
 * Revanth moderation filter: strips restricted or non-public data
 */
function applyModerationFilter(items, options = {}) {
  if (!Array.isArray(items)) return [];
  return items.filter((item) => {
    // If moderation requires isPublic flag
    if (options.requirePublic && item.isPublic === false) return false;
    // Strip sensitive fields
    if (item.contactPhone) delete item.contactPhone;
    if (item.privateNotes) delete item.privateNotes;
    return true;
  });
}

export const modulesAdapter = {
  getDashboardStats: async (_userId) => {
    try {
      return { ...MODULE_DATA.stats };
    } catch {
      return {
        connections: 0,
        pendingRequests: 0,
        savedOpportunities: 0,
        upcomingEvents: 0,
        unreadMessages: 0,
        activeProjects: 0,
      };
    }
  },

  getRecommendedStudents: async (_userId, limit = 4) => {
    try {
      return MODULE_DATA.students.slice(0, limit);
    } catch {
      return [];
    }
  },

  getUpcomingEvents: async (limit = 3) => {
    try {
      const publicEvents = applyModerationFilter(MODULE_DATA.events, { requirePublic: true });
      return publicEvents.slice(0, limit);
    } catch {
      return [];
    }
  },

  getCollaborationProjects: async (limit = 3) => {
    try {
      const publicProjects = applyModerationFilter(MODULE_DATA.projects, { requirePublic: true });
      return publicProjects.slice(0, limit);
    } catch {
      return [];
    }
  },

  getMentors: async (limit = 2) => {
    try {
      return MODULE_DATA.mentors.slice(0, limit);
    } catch {
      return [];
    }
  },

  getNotifications: async (_userId, limit = 5) => {
    try {
      return MODULE_DATA.notifications.slice(0, limit);
    } catch {
      return [];
    }
  },

  getRecentOpportunities: async (limit = 3) => {
    try {
      return MODULE_DATA.opportunities.slice(0, limit);
    } catch {
      return [];
    }
  },

  getRecentResources: async (limit = 3) => {
    try {
      return MODULE_DATA.resources.slice(0, limit);
    } catch {
      return [];
    }
  },
};

