/**
 * @file portfolioData.js
 * @description Demonstration data for Student Portfolio module.
 * Note: External platform stats & verifications are realistic mock models for campus testing.
 */

export const INITIAL_PORTFOLIO = {
  id: 'usr-surya-01',
  name: 'Surya Prakash',
  title: 'Full-Stack Developer & Systems Enthusiast',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
  department: 'Computer Science & Engineering',
  academicYear: '3rd Year (Class of 2026)',
  college: 'Vynora Institute of Technology',
  campusId: 'VIT-2023-CS-042',
  bio: 'Computer Science undergraduate passionate about building scalable campus web apps, distributed systems, and real-time collaboration tools. Actively exploring MERN stack and clean software architecture.',
  isVerified: true,
  verificationDetails: 'Institutional Email Verified (Mock Data)',
  socialProfiles: {
    github: 'https://github.com/surya-prakash',
    githubUsername: 'surya-prakash',
    linkedin: 'https://linkedin.com/in/surya-prakash-dev',
    linkedinUsername: 'surya-prakash-dev',
    leetcode: 'https://leetcode.com/u/surya_codes',
    leetcodeUsername: 'surya_codes',
    website: 'https://suryaprakash.dev'
  },
  skills: {
    languages: ['JavaScript (ES6+)', 'TypeScript', 'Python', 'C++', 'SQL'],
    frontend: ['React 18', 'HTML5', 'CSS3 / Modern Flex & Grid', 'Vite', 'Tailwind CSS'],
    backend: ['Node.js', 'Express.js', 'RESTful APIs', 'Socket.IO', 'JWT Auth'],
    databases: ['MongoDB', 'PostgreSQL', 'Redis', 'Mongoose'],
    tools: ['Git', 'GitHub', 'Postman', 'Docker', 'Linux / Bash', 'VS Code']
  },
  projects: [
    {
      id: 'p1',
      title: 'Vynora Campus+ (Core Platform)',
      description: 'A centralized digital campus platform designed to connect students for project recruitment, shared academic resources, and peer networking.',
      role: 'Full-Stack Developer & Module Lead',
      technologies: ['React', 'Node.js', 'Express', 'Vite', 'RBAC'],
      githubUrl: 'https://github.com/KARTHIKKAR5/VYNORACAMPUS-',
      demoUrl: 'https://vynora-campus.vercel.app',
      status: 'Active Development'
    },
    {
      id: 'p2',
      title: 'Campus Free Room Finder',
      description: 'Real-time timetable aggregator allowing students to discover unoccupied classrooms, study halls, and laboratory spaces across campus blocks.',
      role: 'Backend & Data Modeling',
      technologies: ['Node.js', 'Express', 'MongoDB', 'REST API'],
      githubUrl: 'https://github.com/surya-prakash/room-finder-vynora',
      demoUrl: 'https://rooms.vynoracampus.org',
      status: 'Completed'
    },
    {
      id: 'p3',
      title: 'Algorithmic Visualizer Studio',
      description: 'Interactive web application visually displaying pathfinding algorithms (A*, Dijkstra) and sorting mechanics with step-by-step playback.',
      role: 'Solo Developer',
      technologies: ['React', 'TypeScript', 'Canvas API', 'CSS Grid'],
      githubUrl: 'https://github.com/surya-prakash/algo-visualizer',
      demoUrl: 'https://algo-visualizer.preview.app',
      status: 'Completed'
    }
  ],
  achievements: {
    certifications: [
      {
        id: 'c1',
        title: 'Meta Frontend Developer Professional Certificate',
        issuer: 'Coursera / Meta',
        issueDate: 'August 2025',
        credentialId: 'META-FE-993812',
        verifyUrl: 'https://coursera.org/verify/META-FE-993812'
      },
      {
        id: 'c2',
        title: 'AWS Certified Cloud Practitioner (CLF-C02)',
        issuer: 'Amazon Web Services',
        issueDate: 'November 2025',
        credentialId: 'AWS-CCP-482019',
        verifyUrl: 'https://aws.amazon.com/verification'
      }
    ],
    hackathons: [
      {
        id: 'h1',
        title: '1st Place — Smart India Hackathon Campus Round',
        organization: 'Ministry of Education & VIT Hub',
        date: 'October 2025',
        description: 'Led a 4-person multidisciplinary student team to create an automated campus asset & room reservation portal.'
      },
      {
        id: 'h2',
        title: 'Top 5 Finalist — HackVynora State Ideathon',
        organization: 'Vynora Tech Council',
        date: 'January 2026',
        description: 'Developed an offline-first notes synchronization prototype for engineering students.'
      }
    ],
    awards: [
      {
        id: 'a1',
        title: "Dean's Merit List for Academic Excellence",
        institution: 'Vynora Institute of Technology',
        date: 'Academic Year 2024-2025',
        details: 'Top 2% percentile in Computer Science & Engineering department.'
      },
      {
        id: 'a2',
        title: 'Best Open Source Contributor Award',
        institution: 'Campus Developers Guild',
        date: 'September 2025',
        details: 'Recognized for contributing core components to university club tools.'
      }
    ]
  }
};
