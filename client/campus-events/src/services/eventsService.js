/**
 * Vynora Connect — Events Service
 * Owner: Sindhu (Campus & Events)
 *
 * Implements endpoints for events, registrations, and campus services.
 * Features an isolated mock fallback with localStorage persistence for local testing.
 */
const STORAGE_KEY = 'vynora_user_registrations';
// Mock Events Dataset representing real cross-college campus activities
const INITIAL_EVENTS = [
  {
    id: 'evt-101',
    title: 'Cross-Campus AI & Full-Stack Hackathon 2026',
    description: 'A 36-hour cross-university hackathon bringing together students to build innovative AI agents and collaborative web tools. Mentors from top tech firms will be present.',
    organizer: 'Vynora Tech Community & Developer Student Club',
    category: 'Hackathon',
    startAt: '2026-10-28T09:00:00Z',
    endAt: '2026-10-29T21:00:00Z',
    registrationDeadline: '2026-10-26T23:59:59Z',
    isOnline: false,
    location: 'Central Auditorium, Tech Block',
    capacity: 120,
    registeredCount: 88,
    status: 'UPCOMING',
    eligibility: 'All undergraduate and graduate students',
    tags: ['AI', 'React', 'Hackathon', 'Networking']
  },
  {
    id: 'evt-102',
    title: 'Hands-on React & Modern Web Architecture Workshop',
    description: 'Deep dive into component composition, state management, modern CSS variables, and API contracts. Bring your laptop with Node.js installed.',
    organizer: 'Web Craftsmen Club',
    category: 'Workshop',
    startAt: '2026-10-24T14:00:00Z',
    endAt: '2026-10-24T17:30:00Z',
    registrationDeadline: '2026-10-24T12:00:00Z',
    isOnline: true,
    location: 'Google Meet (Link sent upon registration)',
    capacity: 60,
    registeredCount: 59,
    status: 'UPCOMING',
    eligibility: 'Beginners & Intermediate developers',
    tags: ['WebDev', 'React', 'HandsOn']
  },
  {
    id: 'evt-103',
    title: 'Cloud Native & Microservices Symposium',
    description: 'Industry keynote on Docker, Kubernetes, and serverless architectures in student-led startup products.',
    organizer: 'SRU ACM Student Chapter',
    category: 'Seminar',
    startAt: '2026-10-25T11:00:00Z',
    endAt: '2026-10-25T13:30:00Z',
    registrationDeadline: '2026-10-23T18:00:00Z',
    isOnline: false,
    location: 'Seminar Hall 3, Engineering Block',
    capacity: 80,
    registeredCount: 80, // FULL EVENT demonstration
    status: 'FULL',
    eligibility: 'Engineering & CS students',
    tags: ['Cloud', 'DevOps', 'Architecture']
  },
  {
    id: 'evt-104',
    title: 'Open Source Software Meetup & Project Pairing',
    description: 'Find contributors, pitch your open source side project, or join an active team building cross-college utilities.',
    organizer: 'Vynora Community Leads',
    category: 'Meetup',
    startAt: '2026-10-31T16:00:00Z',
    endAt: '2026-10-31T18:00:00Z',
    registrationDeadline: '2026-10-30T23:59:59Z',
    isOnline: true,
    location: 'Discord Voice & Stage Room',
    capacity: 200,
    registeredCount: 42,
    status: 'UPCOMING',
    eligibility: 'Open to all',
    tags: ['OpenSource', 'Networking', 'Projects']
  },
  {
    id: 'evt-105',
    title: 'Annual Inter-College Algorithmic Coding Challenge',
    description: 'Competitive programming contest with dynamic programming, graphs, and greedy algorithm problem sets.',
    organizer: 'Competitive Coders Guild',
    category: 'Competition',
    startAt: '2026-10-18T10:00:00Z', // PAST EVENT demonstration
    endAt: '2026-10-18T14:00:00Z',
    registrationDeadline: '2026-10-17T20:00:00Z',
    isOnline: true,
    location: 'HackerRank Platform',
    capacity: 300,
    registeredCount: 245,
    status: 'PAST',
    eligibility: 'Registered college teams',
    tags: ['Algorithms', 'DSA', 'Contest']
  },
  {
    id: 'evt-106',
    title: 'Product Design & UI/UX Design Sprint',
    description: 'Learn wireframing, design tokens, and user testing with Figma. Cancelled due to guest speaker rescheduling.',
    organizer: 'Design Guild',
    category: 'Workshop',
    startAt: '2026-10-26T10:00:00Z',
    endAt: '2026-10-26T15:00:00Z',
    registrationDeadline: '2026-10-25T18:00:00Z',
    isOnline: false,
    location: 'Design Studio B, Arts & Media Block',
    capacity: 40,
    registeredCount: 22,
    status: 'CANCELLED', // CANCELLED EVENT demonstration
    eligibility: 'All students',
    tags: ['UIUX', 'Figma', 'Design']
  }
];
// Campus Services Dataset (Week 1 Day 5 Foundation)
const CAMPUS_SERVICES = [
  {
    id: 'srv-01',
    name: 'Central Library & Digital Book Bank',
    category: 'Academic Help',
    description: 'Access digital IEEE journals, quiet study spaces, reference textbooks, and book lending services.',
    location: 'Main Campus, Library Building 2nd Floor',
    hours: 'Mon - Sat: 8:00 AM - 9:00 PM',
    contact: 'library@university.edu',
    status: 'OPERATIONAL'
  },
  {
    id: 'srv-02',
    name: 'High-Performance Computing & AI Sandbox',
    category: 'Lab Access',
    description: 'GPU workstations and private cloud compute nodes available for student research and capstone projects.',
    location: 'CS Block, Room 402',
    hours: 'Mon - Fri: 9:00 AM - 7:00 PM (Reservation needed)',
    contact: 'hpc-lab@university.edu',
    status: 'OPERATIONAL'
  },
  {
    id: 'srv-03',
    name: 'Student Wellness & Academic Counseling',
    category: 'Counseling',
    description: 'Confidential peer and professional guidance for stress management, work-life balance, and academic advice.',
    location: 'Student Health & Wellness Centre',
    hours: 'Mon - Fri: 10:00 AM - 5:00 PM',
    contact: 'wellness@university.edu',
    status: 'OPERATIONAL'
  },
  {
    id: 'srv-04',
    name: 'Career & Internship Placement Cell',
    category: 'Career Guidance',
    description: 'Resume reviews, mock interview drives, industry mentorship, and off-campus internship notices.',
    location: 'Admin Block, Ground Floor',
    hours: 'Mon - Sat: 9:30 AM - 5:30 PM',
    contact: 'careers@university.edu',
    status: 'OPERATIONAL'
  }
];
// Local registration helpers
function getStoredRegistrations() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}
function saveStoredRegistrations(registrations) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
}
/**
 * Events API Service
 */
export const eventsService = {
  // GET /api/v1/events
  async getEvents(filters = {}) {
    // Simulate real network delay (300ms)
    await new Promise((resolve) => setTimeout(resolve, 300));
    let results = [...INITIAL_EVENTS];
    const registeredIds = getStoredRegistrations();
    // Mark registered status dynamically
    results = results.map((evt) => ({
      ...evt,
      isUserRegistered: registeredIds.includes(evt.id)
    }));
    if (filters.category && filters.category !== 'All') {
      results = results.filter((evt) => evt.category.toLowerCase() === filters.category.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(
        (evt) =>
          evt.title.toLowerCase().includes(q) ||
          evt.organizer.toLowerCase().includes(q) ||
          evt.description.toLowerCase().includes(q)
      );
    }
    if (filters.onlineOnly) {
      results = results.filter((evt) => evt.isOnline);
    }
    return results;
  },
  // GET /api/v1/events/:id
  async getEventById(id) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const event = INITIAL_EVENTS.find((evt) => evt.id === id);
    if (!event) throw new Error('Event not found');
    const registeredIds = getStoredRegistrations();
    return {
      ...event,
      isUserRegistered: registeredIds.includes(event.id)
    };
  },
  // POST /api/v1/events/:id/registrations
  async registerForEvent(eventId) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const event = INITIAL_EVENTS.find((evt) => evt.id === eventId);
    if (!event) throw new Error('Event not found');
    // Server-side validation rules
    if (event.status === 'CANCELLED') {
      throw new Error('This event has been cancelled by the organizer.');
    }
    if (new Date(event.registrationDeadline) < new Date()) {
      throw new Error('Registration deadline has passed.');
    }
    if (event.registeredCount >= event.capacity) {
      throw new Error('This event has reached full capacity.');
    }
    const currentRegistrations = getStoredRegistrations();
    if (currentRegistrations.includes(eventId)) {
      throw new Error('You are already registered for this event.');
    }
    currentRegistrations.push(eventId);
    saveStoredRegistrations(currentRegistrations);
    return {
      success: true,
      message: 'Registration confirmed successfully!',
      eventId,
      registeredAt: new Date().toISOString()
    };
  },
  // DELETE /api/v1/events/:id/registrations
  async cancelRegistration(eventId) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    let currentRegistrations = getStoredRegistrations();
    if (!currentRegistrations.includes(eventId)) {
      throw new Error('No active registration found to cancel.');
    }
    currentRegistrations = currentRegistrations.filter((id) => id !== eventId);
    saveStoredRegistrations(currentRegistrations);
    return {
      success: true,
      message: 'Registration successfully cancelled.',
      eventId
    };
  },
  // GET /api/v1/campus-services
  async getCampusServices() {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return [...CAMPUS_SERVICES];
  }
};