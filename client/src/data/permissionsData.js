/**
 * @file permissionsData.js
 * @description Demonstration data for Owner Permissions module.
 */

export const INITIAL_PROJECT = {
  id: 'proj-vynora-01',
  name: 'Vynora Campus+',
  tagline: 'Centralized Digital Campus Platform',
  description: 'Connecting students across departments for peer collaboration, shared academic resources, verified portfolios, and hackathon project team formation.',
  ownerId: 'usr-surya-01',
  ownerName: 'Surya Prakash',
  department: 'Computer Science & Engineering',
  createdAt: '2026-09-01',
  isRecruiting: true,
  tags: ['React', 'Node.js', 'MongoDB', 'Vite', 'RBAC'],
  stats: {
    stars: 48,
    forks: 12,
    activeTasks: 16
  }
};

export const INITIAL_TEAM_MEMBERS = [
  {
    id: 'usr-surya-01',
    name: 'Surya Prakash',
    email: 'surya.prakash@vynora.edu',
    role: 'OWNER',
    department: 'Computer Science & Engineering',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Surya',
    joinedAt: 'Sep 2026',
    status: 'Active'
  },
  {
    id: 'usr-karthik-02',
    name: 'Karthik Kavali',
    email: 'karthik.k@vynora.edu',
    role: 'ADMIN',
    department: 'Information Technology',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Karthik',
    joinedAt: 'Sep 2026',
    status: 'Active'
  },
  {
    id: 'usr-ram-03',
    name: 'Ram Charan',
    email: 'ram.c@vynora.edu',
    role: 'ADMIN',
    department: 'Computer Science & Engineering',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Ram',
    joinedAt: 'Sep 2026',
    status: 'Active'
  },
  {
    id: 'usr-deep-04',
    name: 'Mani Deepika',
    email: 'deepika.m@vynora.edu',
    role: 'MEMBER',
    department: 'Electronics & Communication',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Deepika',
    joinedAt: 'Oct 2026',
    status: 'Active'
  },
  {
    id: 'usr-varsh-05',
    name: 'Bala Varshitha',
    email: 'varshitha.b@vynora.edu',
    role: 'MEMBER',
    department: 'Computer Science & Engineering',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Varshitha',
    joinedAt: 'Oct 2026',
    status: 'Active'
  },
  {
    id: 'usr-sam-06',
    name: 'Sam Wilson',
    email: 'sam.w@vynora.edu',
    role: 'VIEWER',
    department: 'Mechanical Engineering',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Sam',
    joinedAt: 'Oct 2026',
    status: 'Guest Reviewer'
  }
];

export const INITIAL_JOIN_REQUESTS = [
  {
    id: 'req-01',
    studentName: 'Aarav Sharma',
    department: 'AI & Data Science',
    year: '2nd Year',
    appliedFor: 'ML Engineer',
    note: 'Built transformer models for campus text processing. Excited to contribute!',
    date: 'Yesterday'
  },
  {
    id: 'req-02',
    studentName: 'Sneha Patel',
    department: 'Computer Science',
    year: '3rd Year',
    appliedFor: 'Frontend Developer',
    note: 'Experienced with React and design tokens. Want to build the student networking UI.',
    date: '2 days ago'
  }
];
