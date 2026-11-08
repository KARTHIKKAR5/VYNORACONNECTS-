/**
 * Vynora Connect — Profile Validation Schema & Limits
 * Centralized client-side rules enforcing character limits, safe URL protocols, and allowed update fields.
 */

export const PROFILE_LIMITS = {
  BIO_MAX_LENGTH: 300,
  SKILL_MAX_COUNT: 15,
  SKILL_NAME_MAX_LENGTH: 30,
  INTEREST_MAX_COUNT: 10,
  INTEREST_NAME_MAX_LENGTH: 30,
  HEADLINE_MAX_LENGTH: 100,
  BRANCH_MAX_LENGTH: 60,
};

export const ALLOWED_STUDY_YEARS = [1, 2, 3, 4, 5];

export const ALLOWED_VISIBILITY_LEVELS = ['students', 'connections', 'private'];

export const ALLOWED_COLLEGES = [
  'All Colleges',
  'VNR VJIET',
  'IIT Hyderabad',
  'NIT Warangal',
  'BITS Pilani (Hyderabad)',
  'CBIT Hyderabad',
  'Vasavi College of Engineering',
  'JNTU Hyderabad',
  'Osmania University',
];

export const ALLOWED_BRANCHES = [
  'All Branches',
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication Engineering',
  'Electrical & Electronics Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Data Science & AI',
];

export const COMMON_SKILLS = [
  'JavaScript',
  'TypeScript',
  'React.js',
  'Node.js',
  'Python',
  'Express.js',
  'MongoDB',
  'SQL',
  'Tailwind CSS',
  'Git & GitHub',
  'Docker',
  'Figma',
  'Machine Learning',
  'Data Structures',
  'REST APIs',
  'Next.js',
];

export const COMMON_INTERESTS = [
  'Web Development',
  'Open Source',
  'Competitive Programming',
  'Artificial Intelligence',
  'UI/UX Design',
  'Cloud Computing',
  'Hackathons',
  'Cybersecurity',
  'Product Management',
  'Mobile Apps',
];

/**
 * Validate HTTP/HTTPS URL
 */
export function isValidWebUrl(string) {
  if (!string || !string.trim()) return true; // Optional fields are valid if empty
  try {
    const url = new URL(string.trim());
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Validate Profile Edit Payload
 */
export function validateProfileInput(profile) {
  const errors = {};

  if (!profile.branch || !profile.branch.trim()) {
    errors.branch = 'Branch/Department is required.';
  } else if (profile.branch.length > PROFILE_LIMITS.BRANCH_MAX_LENGTH) {
    errors.branch = `Branch cannot exceed ${PROFILE_LIMITS.BRANCH_MAX_LENGTH} characters.`;
  }

  if (!profile.studyYear || !ALLOWED_STUDY_YEARS.includes(Number(profile.studyYear))) {
    errors.studyYear = 'Please select a valid study year (1 to 5).';
  }

  if (profile.bio && profile.bio.length > PROFILE_LIMITS.BIO_MAX_LENGTH) {
    errors.bio = `Bio cannot exceed ${PROFILE_LIMITS.BIO_MAX_LENGTH} characters.`;
  }

  if (profile.skills && profile.skills.length > PROFILE_LIMITS.SKILL_MAX_COUNT) {
    errors.skills = `You can list up to ${PROFILE_LIMITS.SKILL_MAX_COUNT} skills.`;
  }

  if (profile.interests && profile.interests.length > PROFILE_LIMITS.INTEREST_MAX_COUNT) {
    errors.interests = `You can list up to ${PROFILE_LIMITS.INTEREST_MAX_COUNT} interests.`;
  }

  if (profile.links) {
    if (profile.links.github && !isValidWebUrl(profile.links.github)) {
      errors.github = 'GitHub link must start with http:// or https://';
    }
    if (profile.links.linkedin && !isValidWebUrl(profile.links.linkedin)) {
      errors.linkedin = 'LinkedIn link must start with http:// or https://';
    }
    if (profile.links.website && !isValidWebUrl(profile.links.website)) {
      errors.website = 'Portfolio link must start with http:// or https://';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

