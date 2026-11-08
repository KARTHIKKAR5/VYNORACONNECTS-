/**
 * Vynora Connect — Teams & Projects Module
 * Adapter: Ram's Student Profile & Resume Module Integration
 *
 * Provides privacy-safe retrieval of student profile information.
 * Enforces strict filtering: NEVER exposes private contact details (email, phone),
 * internal verification hashes, or sensitive academic audit records.
 */

// Safe mock profile store representing Ram's student profile directory
const MOCK_STUDENT_PROFILES = {
  'usr-varsh': {
    id: 'usr-varsh',
    name: 'Varshitha',
    college: 'Vynora Institute of Technology',
    department: 'Computer Science and Engineering',
    year: '3rd Year',
    verifiedSkills: ['Python', 'PyTorch', 'OpenCV', 'React', 'FastAPI'],
    resumeHeadline: 'Undergraduate AI & Computer Vision Enthusiast | Hackathon Builder',
    avatar: 'V',
    portfolioLinks: ['https://github.com/vynora'],
  },
  'usr-deep': {
    id: 'usr-deep',
    name: 'Deepu',
    college: 'Vynora Institute of Technology',
    department: 'Computer Science and Engineering',
    year: '4th Year',
    verifiedSkills: ['Embedded Systems', 'IoT', 'C++', 'Node.js', 'Linux'],
    resumeHeadline: 'Hardware Systems & Cloud Integration Specialist',
    avatar: 'D',
  },
  'usr-karthik': {
    id: 'usr-karthik',
    name: 'Karthik Kavali',
    college: 'National Engineering College',
    department: 'Electronics & Communication',
    year: '3rd Year',
    verifiedSkills: ['React', 'JavaScript', 'Node.js', 'MongoDB', 'System Design'],
    resumeHeadline: 'Full-Stack Developer & Community Organizer',
    avatar: 'K',
  },
  'usr-ram': {
    id: 'usr-ram',
    name: 'Ram Charan',
    college: 'City Institute of Science',
    department: 'Computer Science and Engineering',
    year: '3rd Year',
    verifiedSkills: ['Solidity', 'Web3', 'React', 'Smart Contracts'],
    resumeHeadline: 'Blockchain & Distributed Systems Researcher',
    avatar: 'R',
  },
  'usr-siri': {
    id: 'usr-siri',
    name: 'Siri Nallala',
    college: 'State Technical University',
    department: 'Information Technology',
    year: '3rd Year',
    verifiedSkills: ['PWA', 'WebRTC', 'IndexedDB', 'Service Workers'],
    resumeHeadline: 'Offline-First Web Architect',
    avatar: 'S',
  },
  'usr-candidate-1': {
    id: 'usr-candidate-1',
    name: 'Rohit Sharma',
    college: 'Apex College of Technology',
    department: 'Information Technology',
    year: '2nd Year',
    verifiedSkills: ['React', 'Tailwind', 'WebSocket', 'JavaScript'],
    resumeHeadline: 'Frontend Engineer focused on real-time reactive dashboards',
    avatar: 'R',
  },
  'usr-current-student': {
    id: 'usr-current-student',
    name: 'Varsh (Current Student)',
    college: 'Vynora Institute of Technology',
    department: 'Computer Science and Engineering',
    year: '3rd Year',
    verifiedSkills: ['React', 'Node.js', 'MongoDB', 'Python', 'UI/UX'],
    resumeHeadline: 'Full-Stack Developer & Technical Lead',
    avatar: 'V',
  },
};

/**
 * Sanitize student profile ensuring private fields are stripped
 */
export function sanitizeStudentProfile(rawProfile) {
  if (!rawProfile) return null;
  return {
    id: rawProfile.id || rawProfile._id,
    name: rawProfile.name || 'Anonymous Student',
    college: rawProfile.college || 'Campus Member',
    department: rawProfile.department || '',
    year: rawProfile.year || '',
    verifiedSkills: Array.isArray(rawProfile.verifiedSkills) ? rawProfile.verifiedSkills : [],
    resumeHeadline: rawProfile.resumeHeadline || '',
    avatar: rawProfile.avatar || (rawProfile.name ? rawProfile.name.charAt(0).toUpperCase() : 'S'),
  };
}

/**
 * Retrieve verified student profile summary for applicant inspection
 */
export async function getStudentProfileSummary(studentUserId) {
  if (!studentUserId) return null;

  // In production, this queries Ram's /api/v1/network/profiles/:studentUserId
  const profile = MOCK_STUDENT_PROFILES[studentUserId] || {
    id: studentUserId,
    name: 'Student Candidate',
    college: 'Vynora Network Campus',
    department: 'Engineering',
    year: 'Undergraduate',
    verifiedSkills: ['Software Development'],
    resumeHeadline: 'Active collaborative student contributor',
    avatar: 'S',
  };

  return sanitizeStudentProfile(profile);
}

