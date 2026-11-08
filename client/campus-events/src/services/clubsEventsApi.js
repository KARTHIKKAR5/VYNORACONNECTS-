/**
 * Vynora Connect — Clubs & Events API Client
 * Owner: Sindhu (College Clubs & Events Module)
 * Implements full /api/v1 contract with realistic cross-campus clubs & events data.
 */

const CLUBS_KEY = 'vynora_clubs_cache';
const EVENTS_KEY = 'vynora_events_cache';
const REGISTRATIONS_KEY = 'vynora_student_registrations';
const ADMIN_REQUEST_KEY = 'vynora_club_admin_request';

// Initial verified clubs across colleges
const INITIAL_CLUBS = [
  {
    id: 'club-01',
    name: 'Google Developer Student Club (GDSC)',
    collegeName: 'SR University',
    slug: 'gdsc-sru',
    category: 'Technical',
    description: 'Community group for college students interested in Google developer technologies, open-source projects, and full-stack development.',
    logoUrl: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=150&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    verificationStatus: 'verified',
    status: 'active',
    officialLinks: {
      website: 'https://gdsc.community.dev',
      instagram: 'https://instagram.com/gdsc_sru',
      linkedin: 'https://linkedin.com/company/gdsc-sru'
    },
    memberCount: 340
  },
  {
    id: 'club-02',
    name: 'ACM & Competitive Programming Guild',
    collegeName: 'IIT Hyderabad',
    slug: 'acm-iith',
    category: 'Technical',
    description: 'Dedicated to algorithms, data structures, competitive coding contests, and hackathon training.',
    logoUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=150&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    verificationStatus: 'verified',
    status: 'active',
    officialLinks: {
      website: 'https://acm.org',
      instagram: 'https://instagram.com/acm_guild',
      linkedin: 'https://linkedin.com/company/acm-guild'
    },
    memberCount: 220
  },
  {
    id: 'club-03',
    name: 'E-Cell (Entrepreneurship & Innovation Cell)',
    collegeName: 'BITS Pilani',
    slug: 'ecell-bits',
    category: 'Entrepreneurship',
    description: 'Fostering the spirit of startup incubation, pitch decks, investor meets, and student venture building.',
    logoUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=150&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
    verificationStatus: 'verified',
    status: 'active',
    officialLinks: {
      website: 'https://ecell.in',
      instagram: 'https://instagram.com/ecell_bits',
      linkedin: 'https://linkedin.com/company/ecell-bits'
    },
    memberCount: 410
  },
  {
    id: 'club-04',
    name: 'Robotics & Automation Society (RAS)',
    collegeName: 'NIT Warangal',
    slug: 'ras-nitw',
    category: 'Technical',
    description: 'Hands-on IoT, drone development, autonomous rovers, and mechatronics design challenges.',
    logoUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=150&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
    verificationStatus: 'verified',
    status: 'active',
    officialLinks: {
      website: 'https://ieee-ras.org',
      instagram: 'https://instagram.com/ras_nitw',
      linkedin: 'https://linkedin.com'
    },
    memberCount: 180
  }
];

function getStored(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setStored(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error(e);
  }
}

export const clubsEventsApi = {
  // --- CLUBS ENDPOINTS ---
  async getClubs(filters = {}) {
    await new Promise((r) => setTimeout(r, 200));
    let clubs = getStored(CLUBS_KEY, INITIAL_CLUBS);

    if (filters.category && filters.category !== 'All') {
      clubs = clubs.filter((c) => c.category.toLowerCase() === filters.category.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      clubs = clubs.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.collegeName.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      );
    }

    return {
      success: true,
      data: clubs,
      meta: { total: clubs.length }
    };
  },

  async getClubById(clubId) {
    await new Promise((r) => setTimeout(r, 150));
    const clubs = getStored(CLUBS_KEY, INITIAL_CLUBS);
    const club = clubs.find((c) => c.id === clubId);
    if (!club) throw new Error('Club not found.');

    const eventsRes = await this.getEvents({ clubId });
    return {
      success: true,
      data: {
        club,
        events: eventsRes.data
      }
    };
  },

  // --- CLUB ADMIN APPLICATION ENDPOINTS ---
  async submitAdminRequest(data) {
    await new Promise((r) => setTimeout(r, 300));
    const request = {
      id: `req-${Date.now()}`,
      ...data,
      status: 'pending', // Pending review by Revanth / platform owner
      submittedAt: new Date().toISOString()
    };
    setStored(ADMIN_REQUEST_KEY, request);
    return { success: true, data: request };
  },

  async getMyAdminRequestStatus() {
    await new Promise((r) => setTimeout(r, 150));
    const request = getStored(ADMIN_REQUEST_KEY, null);
    return { success: true, data: request };
  },

  // --- CLUB ADMIN MANAGEMENT ENDPOINTS ---
  async getManagedClubs() {
    await new Promise((r) => setTimeout(r, 150));
    // Simulated logged-in club admin assignment: GDSC SRU
    const clubs = getStored(CLUBS_KEY, INITIAL_CLUBS);
    return {
      success: true,
      data: [clubs[0]] // GDSC SRU
    };
  },

  async createClubEvent(clubId, eventData) {
    await new Promise((r) => setTimeout(r, 350));
    const events = getStored(EVENTS_KEY, []);
    const clubs = getStored(CLUBS_KEY, INITIAL_CLUBS);
    const club = clubs.find((c) => c.id === clubId);

    const newEvent = {
      id: `evt-${Date.now()}`,
      clubId,
      clubName: club ? club.name : 'College Club',
      collegeName: club ? club.collegeName : 'University',
      organizer: club ? club.name : 'Club Lead',
      registeredCount: 0,
      status: 'published', // Published directly by verified admin
      createdAt: new Date().toISOString(),
      ...eventData
    };

    events.unshift(newEvent);
    setStored(EVENTS_KEY, events);
    return { success: true, data: newEvent };
  },

  // --- EVENTS & REGISTRATION ENDPOINTS ---
  async getEvents(filters = {}) {
    await new Promise((r) => setTimeout(r, 200));
    let events = getStored(EVENTS_KEY, null);

    // Initial default events if storage empty
    if (!events || events.length === 0) {
      events = [
        {
          id: 'evt-101',
          clubId: 'club-01',
          clubName: 'Google Developer Student Club (GDSC)',
          collegeName: 'SR University',
          organizer: 'GDSC Core Team',
          title: 'Inter-College AI & Full-Stack Buildathon 2026',
          summary: 'A 36-hour cross-university hackathon bringing together students to build innovative AI agents.',
          description: 'A 36-hour cross-university hackathon bringing together students to build innovative AI agents and collaborative web tools. Mentors from top tech firms will be present.',
          category: 'hackathon',
          mode: 'offline',
          venue: { name: 'Central Auditorium', address: 'Main Tech Block', city: 'Warangal' },
          startsAt: '2026-11-20T09:00:00Z',
          endsAt: '2026-11-21T21:00:00Z',
          registrationClosesAt: '2026-11-18T23:59:00Z',
          capacity: 150,
          registeredCount: 92,
          eligibility: 'All undergraduate and graduate students',
          status: 'published'
        },
        {
          id: 'evt-102',
          clubId: 'club-02',
          clubName: 'ACM & Competitive Programming Guild',
          collegeName: 'IIT Hyderabad',
          organizer: 'ACM Chapter',
          title: 'Advanced Graph Algorithms & Dynamic Programming Sprint',
          summary: 'Deep-dive masterclass for competitive programming and ICPC qualifiers.',
          description: 'Hands-on problem solving covering segment trees, flow algorithms, and dynamic programming optimizations.',
          category: 'workshop',
          mode: 'online',
          onlineUrl: 'https://meet.google.com/xyz-demo',
          venue: { name: 'Google Meet', address: 'Online Room', city: 'Online' },
          startsAt: '2026-11-15T14:00:00Z',
          endsAt: '2026-11-15T18:00:00Z',
          registrationClosesAt: '2026-11-14T23:59:00Z',
          capacity: 80,
          registeredCount: 79,
          eligibility: 'Intermediate & Advanced Coders',
          status: 'published'
        },
        {
          id: 'evt-103',
          clubId: 'club-03',
          clubName: 'E-Cell (Entrepreneurship Cell)',
          collegeName: 'BITS Pilani',
          organizer: 'E-Cell Advisory',
          title: 'Campus Venture Pitch Deck & Angel Investor Showcase',
          summary: 'Pitch your student startup to seed investors and campus incubators.',
          description: 'Top 10 student founder teams will pitch for grant funding, incubation support, and founder mentorship.',
          category: 'competition',
          mode: 'offline',
          venue: { name: 'Incubation Center Stage', address: 'Auditorium Block', city: 'Hyderabad' },
          startsAt: '2026-11-25T10:00:00Z',
          endsAt: '2026-11-25T16:00:00Z',
          registrationClosesAt: '2026-11-22T18:00:00Z',
          capacity: 60,
          registeredCount: 60, // FULL EVENT
          eligibility: 'Student founders with an MVP',
          status: 'published'
        }
      ];
      setStored(EVENTS_KEY, events);
    }

    const myRegistrations = getStored(REGISTRATIONS_KEY, []);
    events = events.map((e) => ({
      ...e,
      isUserRegistered: myRegistrations.some((r) => r.eventId === e.id)
    }));

    if (filters.clubId) {
      events = events.filter((e) => e.clubId === filters.clubId);
    }
    if (filters.category && filters.category !== 'All') {
      events = events.filter((e) => e.category.toLowerCase() === filters.category.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      events = events.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.clubName.toLowerCase().includes(q) ||
          e.summary.toLowerCase().includes(q)
      );
    }
    if (filters.onlineOnly) {
      events = events.filter((e) => e.mode === 'online');
    }

    return { success: true, data: events };
  },

  async registerForEvent(eventId, student = { name: 'Sindhu', email: 'sindhu@vynora.edu' }) {
    await new Promise((r) => setTimeout(r, 350));
    const events = getStored(EVENTS_KEY, []);
    const event = events.find((e) => e.id === eventId);
    if (!event) throw new Error('Event not found.');

    if (new Date(event.registrationClosesAt) < new Date()) {
      throw new Error('Registration deadline has passed.');
    }
    if (event.registeredCount >= event.capacity) {
      throw new Error('This event is already at maximum capacity.');
    }

    const regList = getStored(REGISTRATIONS_KEY, []);
    if (regList.some((r) => r.eventId === eventId)) {
      throw new Error('You are already registered for this event.');
    }

    event.registeredCount += 1;
    setStored(EVENTS_KEY, events);

    const newReg = {
      id: `reg-${Date.now()}`,
      eventId,
      eventTitle: event.title,
      startsAt: event.startsAt,
      venue: event.venue ? `${event.venue.name}, ${event.venue.city}` : 'Campus',
      mode: event.mode,
      referenceCode: `VYN-${Date.now().toString(36).toUpperCase()}`,
      studentName: student.name,
      registeredAt: new Date().toISOString()
    };

    regList.push(newReg);
    setStored(REGISTRATIONS_KEY, regList);

    return { success: true, data: newReg, message: 'Registration confirmed!' };
  },

  async cancelRegistration(eventId) {
    await new Promise((r) => setTimeout(r, 250));
    let regList = getStored(REGISTRATIONS_KEY, []);
    if (!regList.some((r) => r.eventId === eventId)) {
      throw new Error('No active registration found.');
    }

    regList = regList.filter((r) => r.eventId !== eventId);
    setStored(REGISTRATIONS_KEY, regList);

    const events = getStored(EVENTS_KEY, []);
    const event = events.find((e) => e.id === eventId);
    if (event && event.registeredCount > 0) {
      event.registeredCount -= 1;
      setStored(EVENTS_KEY, events);
    }

    return { success: true, message: 'Registration successfully cancelled.' };
  },

  async getMyRegistrations() {
    await new Promise((r) => setTimeout(r, 150));
    const regList = getStored(REGISTRATIONS_KEY, []);
    return { success: true, data: regList };
  }
};