/**
 * @file marketplaceData.js
 * @description Demonstration data and configuration for the Vynora Connect Marketplace.
 * Note: All listings and inquiries use clearly labeled mock student data for campus prototype testing.
 */

export const MARKETPLACE_CATEGORIES = Object.freeze([
  { id: 'ALL', label: 'All Services', icon: '✦' },
  { id: 'DEVELOPMENT', label: 'Development', icon: '💻' },
  { id: 'DESIGN', label: 'UI/UX & Design', icon: '🎨' },
  { id: 'CONTENT', label: 'Content & Writing', icon: '✍️' },
  { id: 'MARKETING', label: 'Marketing & Media', icon: '📢' },
  { id: 'TUTORING', label: 'Tutoring & Academics', icon: '📚' },
  { id: 'VIDEO_PHOTO', label: 'Video & Photography', icon: '📸' },
  { id: 'OTHER', label: 'Other Services', icon: '⚡' }
]);

export const PRICING_MODELS = Object.freeze({
  FIXED: 'Fixed Price',
  HOURLY: 'Hourly Rate',
  NEGOTIABLE: 'Negotiable'
});

export const MOCK_USERS = Object.freeze({
  SURYA: {
    id: 'usr-surya-01',
    name: 'Surya Prakash',
    email: 'surya.prakash@vynora.edu',
    department: 'Computer Science & Engineering',
    year: '3rd Year',
    role: 'OWNER',
    isModerator: false,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'
  },
  AARAV: {
    id: 'usr-aarav-02',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@vynora.edu',
    department: 'AI & Data Science',
    year: '2nd Year',
    role: 'MEMBER',
    isModerator: false,
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Aarav'
  },
  PRIYA: {
    id: 'usr-priya-03',
    name: 'Priya Rao',
    email: 'priya.rao@vynora.edu',
    department: 'Information Design & Media',
    year: '4th Year',
    role: 'MEMBER',
    isModerator: false,
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Priya'
  },
  MODERATOR: {
    id: 'usr-mod-04',
    name: 'Campus Moderation Desk',
    email: 'moderator@vynora.edu',
    department: 'Campus Administration',
    year: 'Staff',
    role: 'ADMIN',
    isModerator: true,
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Moderator'
  }
});

export const INITIAL_SERVICE_LISTINGS = [
  {
    id: 'lst-mern-01',
    ownerId: 'usr-surya-01',
    ownerName: 'Surya Prakash',
    ownerDept: 'Computer Science & Engineering',
    ownerYear: '3rd Year',
    title: 'Full-Stack Web App Development (MERN)',
    slug: 'full-stack-web-app-development-mern',
    summary: 'Custom React, Vite, and Node.js web applications tailored for campus teams and hackathons.',
    description: 'I offer end-to-end full-stack web development for student projects, college portals, and hackathon prototypes. Stack includes React, Vite, Node.js, Express, and MongoDB. Includes responsive layout, modular REST APIs, clean database schema design, and deployment walkthrough.',
    category: 'DEVELOPMENT',
    tags: ['React', 'Node.js', 'Express', 'MongoDB', 'Vite'],
    providerType: 'STUDENT',
    pricing: {
      model: 'FIXED',
      amount: 3500,
      currency: 'INR',
      negotiable: true
    },
    deliveryTime: {
      value: 7,
      unit: 'DAYS'
    },
    skills: ['React', 'Node.js', 'Express', 'MongoDB', 'REST APIs', 'Git'],
    portfolioLinks: [
      { label: 'GitHub Repository', url: 'https://github.com/surya-prakash' },
      { label: 'Live Demo Site', url: 'https://vynora-campus.vercel.app' }
    ],
    availability: 'AVAILABLE',
    status: 'PUBLISHED',
    moderationStatus: 'APPROVED',
    createdAt: '2026-10-10T10:00:00.000Z',
    updatedAt: '2026-10-12T14:30:00.000Z',
    publishedAt: '2026-10-10T12:00:00.000Z'
  },
  {
    id: 'lst-design-02',
    ownerId: 'usr-priya-03',
    ownerName: 'Priya Rao',
    ownerDept: 'Information Design & Media',
    ownerYear: '4th Year',
    title: 'UI/UX Interface Design & Figma Design Systems',
    slug: 'ui-ux-interface-design-figma-systems',
    summary: 'High-fidelity Figma wireframes, interactive prototypes, and scalable component design systems.',
    description: 'Specialized in turning complex software ideas into intuitive user interfaces. I design web and mobile layouts, define typography and spacing tokens, build interactive Figma prototypes, and produce developer-ready asset specifications.',
    category: 'DESIGN',
    tags: ['Figma', 'UI/UX', 'Wireframing', 'Design System'],
    providerType: 'STUDENT',
    pricing: {
      model: 'FIXED',
      amount: 2800,
      currency: 'INR',
      negotiable: false
    },
    deliveryTime: {
      value: 5,
      unit: 'DAYS'
    },
    skills: ['Figma', 'UI Design', 'Wireframing', 'Prototyping', 'Accessibility'],
    portfolioLinks: [
      { label: 'Behance Portfolio', url: 'https://behance.net/priyarao-design' }
    ],
    availability: 'AVAILABLE',
    status: 'PUBLISHED',
    moderationStatus: 'APPROVED',
    createdAt: '2026-10-11T09:15:00.000Z',
    updatedAt: '2026-10-11T09:15:00.000Z',
    publishedAt: '2026-10-11T10:00:00.000Z'
  },
  {
    id: 'lst-tutoring-03',
    ownerId: 'usr-surya-01',
    ownerName: 'Surya Prakash',
    ownerDept: 'Computer Science & Engineering',
    ownerYear: '3rd Year',
    title: 'DSA & Technical Interview Problem Solving Tutoring',
    slug: 'dsa-technical-interview-tutoring',
    summary: '1-on-1 problem-solving sessions covering Trees, Graphs, Dynamic Programming, and complexity analysis.',
    description: 'Targeted peer tutoring sessions for campus placements and coding competitions. We analyze patterns, optimize time and space complexity, and build intuition for LeetCode medium/hard challenges in C++ or Java.',
    category: 'TUTORING',
    tags: ['DSA', 'Algorithms', 'C++', 'Placement Prep'],
    providerType: 'STUDENT',
    pricing: {
      model: 'HOURLY',
      amount: 400,
      currency: 'INR',
      negotiable: true
    },
    deliveryTime: {
      value: 1,
      unit: 'DAYS'
    },
    skills: ['Data Structures', 'Algorithms', 'C++', 'Python', 'System Basics'],
    portfolioLinks: [
      { label: 'LeetCode Profile', url: 'https://leetcode.com/u/surya_codes' }
    ],
    availability: 'AVAILABLE',
    status: 'PUBLISHED',
    moderationStatus: 'APPROVED',
    createdAt: '2026-10-11T16:00:00.000Z',
    updatedAt: '2026-10-11T16:00:00.000Z',
    publishedAt: '2026-10-11T16:30:00.000Z'
  },
  {
    id: 'lst-photo-04',
    ownerId: 'usr-rohan-05',
    ownerName: 'Rohan Verma',
    ownerDept: 'Mechanical Engineering',
    ownerYear: '2nd Year',
    title: 'Campus Event & Club Activity Photography',
    slug: 'campus-event-club-photography',
    summary: 'High-resolution coverage of technical symposiums, club workshops, and student fest activities.',
    description: 'Equipped with Sony mirrorless gear for indoor and outdoor campus gatherings. Service includes candid event photography, stage coverage, professional color grading, and delivery of raw and web-optimized JPGs within 72 hours.',
    category: 'VIDEO_PHOTO',
    tags: ['Photography', 'Lightroom', 'Event Coverage', 'Sony'],
    providerType: 'STUDENT',
    pricing: {
      model: 'HOURLY',
      amount: 600,
      currency: 'INR',
      negotiable: false
    },
    deliveryTime: {
      value: 3,
      unit: 'DAYS'
    },
    skills: ['Event Photography', 'Adobe Lightroom', 'Portraiture', 'Color Grading'],
    portfolioLinks: [
      { label: 'Photo Stream', url: 'https://unsplash.com/@rohan_clicks' }
    ],
    availability: 'AVAILABLE',
    status: 'PUBLISHED',
    moderationStatus: 'APPROVED',
    createdAt: '2026-10-12T11:00:00.000Z',
    updatedAt: '2026-10-12T11:00:00.000Z',
    publishedAt: '2026-10-12T11:45:00.000Z'
  },
  {
    id: 'lst-content-05',
    ownerId: 'usr-ananya-06',
    ownerName: 'Ananya Deshmukh',
    ownerDept: 'Electrical Engineering',
    ownerYear: '4th Year',
    title: 'Technical Documentation & Research Paper Formatting',
    slug: 'technical-documentation-ieee-formatting',
    summary: 'LaTeX formatting, IEEE compliance checks, and clear technical write-ups for conference submissions.',
    description: 'Ensure your college project reports, capstone write-ups, or conference papers meet academic standards. I assist with LaTeX typesetting, bibliography management with BibTeX, diagram alignment, and technical grammar refinement.',
    category: 'CONTENT',
    tags: ['LaTeX', 'IEEE', 'Technical Writing', 'Research'],
    providerType: 'STUDENT',
    pricing: {
      model: 'FIXED',
      amount: 1200,
      currency: 'INR',
      negotiable: true
    },
    deliveryTime: {
      value: 4,
      unit: 'DAYS'
    },
    skills: ['LaTeX', 'Overleaf', 'Technical Writing', 'IEEE Format', 'Markdown'],
    portfolioLinks: [
      { label: 'Google Scholar', url: 'https://scholar.google.com' }
    ],
    availability: 'AVAILABLE',
    status: 'PUBLISHED',
    moderationStatus: 'APPROVED',
    createdAt: '2026-10-12T15:00:00.000Z',
    updatedAt: '2026-10-12T15:00:00.000Z',
    publishedAt: '2026-10-12T15:30:00.000Z'
  },
  {
    id: 'lst-draft-06',
    ownerId: 'usr-surya-01',
    ownerName: 'Surya Prakash',
    ownerDept: 'Computer Science & Engineering',
    ownerYear: '3rd Year',
    title: 'Docker & Microservices Architecture Consultation',
    slug: 'docker-microservices-consultation',
    summary: 'Containerization, docker-compose orchestration, and environment configuration for multi-service apps.',
    description: 'Draft listing for containerizing student full-stack projects using Docker, multi-stage builds, and environment variable isolation for local development.',
    category: 'DEVELOPMENT',
    tags: ['Docker', 'DevOps', 'Containers', 'Linux'],
    providerType: 'STUDENT',
    pricing: {
      model: 'NEGOTIABLE',
      amount: 0,
      currency: 'INR',
      negotiable: true
    },
    deliveryTime: {
      value: 3,
      unit: 'DAYS'
    },
    skills: ['Docker', 'Linux', 'Bash', 'Containers', 'Git'],
    portfolioLinks: [],
    availability: 'AVAILABLE',
    status: 'DRAFT', // Unfinished draft owned by Surya
    moderationStatus: 'APPROVED',
    createdAt: '2026-10-13T08:00:00.000Z',
    updatedAt: '2026-10-13T08:00:00.000Z',
    publishedAt: null
  }
];

export const INITIAL_INQUIRIES = [
  {
    id: 'inq-symp-01',
    listingId: 'lst-mern-01',
    listingTitle: 'Full-Stack Web App Development (MERN)',
    listingOwnerId: 'usr-surya-01',
    requesterId: 'usr-aarav-02',
    requesterName: 'Aarav Sharma',
    requesterDept: 'AI & Data Science',
    recipientId: 'usr-surya-01',
    recipientName: 'Surya Prakash',
    subject: 'Campus Symposium Registration Portal',
    message: 'Hey Surya, our AI club is hosting a machine learning hackathon next month. We need a clean registration portal with Google OAuth and CSV attendee exports. Could you help build this?',
    requirements: 'Frontend form with verification check, backend MongoDB collection for attendees, and basic admin table.',
    budget: {
      amount: 4000,
      currency: 'INR'
    },
    requestedDeadline: '2026-11-10T00:00:00.000Z',
    status: 'PENDING',
    conversationId: null,
    lastRespondedAt: null,
    createdAt: '2026-10-13T09:30:00.000Z',
    updatedAt: '2026-10-13T09:30:00.000Z'
  },
  {
    id: 'inq-dsa-02',
    listingId: 'lst-tutoring-03',
    listingTitle: 'DSA & Technical Interview Problem Solving Tutoring',
    listingOwnerId: 'usr-surya-01',
    requesterId: 'usr-sneha-07',
    requesterName: 'Sneha Patel',
    requesterDept: 'Information Technology',
    recipientId: 'usr-surya-01',
    recipientName: 'Surya Prakash',
    subject: 'Dynamic Programming Mentorship for On-Campus OA',
    message: 'Hi Surya! I struggle with 2D DP table transitions and Knapsack variations. Looking for 3-4 weekend problem review sessions before our campus drive begins.',
    requirements: 'Targeting 1D and 2D DP problems in C++, step-by-step state transition explanations.',
    budget: {
      amount: 1600,
      currency: 'INR'
    },
    requestedDeadline: '2026-10-25T00:00:00.000Z',
    status: 'ACCEPTED',
    conversationId: 'conv-mock-889',
    lastRespondedAt: '2026-10-12T18:00:00.000Z',
    createdAt: '2026-10-12T14:00:00.000Z',
    updatedAt: '2026-10-12T18:00:00.000Z'
  },
  {
    id: 'inq-design-03',
    listingId: 'lst-design-02',
    listingTitle: 'UI/UX Interface Design & Figma Design Systems',
    listingOwnerId: 'usr-priya-03',
    requesterId: 'usr-surya-01', // Sent by Surya
    requesterName: 'Surya Prakash',
    requesterDept: 'Computer Science & Engineering',
    recipientId: 'usr-priya-03',
    recipientName: 'Priya Rao',
    subject: 'Design System Polish for Vynora Marketplace',
    message: 'Hi Priya! I am refining the frontend architecture for our campus marketplace. Would love to collaborate on a minimalist high-contrast design system and Figma component tokens.',
    requirements: 'Monochrome component library, badge guidelines, and mobile responsiveness specs.',
    budget: {
      amount: 3000,
      currency: 'INR'
    },
    requestedDeadline: '2026-10-28T00:00:00.000Z',
    status: 'PENDING',
    conversationId: null,
    lastRespondedAt: null,
    createdAt: '2026-10-13T07:15:00.000Z',
    updatedAt: '2026-10-13T07:15:00.000Z'
  }
];
