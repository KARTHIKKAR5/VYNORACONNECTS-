/**
 * Vynora Connect — Network Module Input Validation & Sanitization
 *
 * Module: Module 2 (Student Network & Profiles)
 * Owner: Ram
 *
 * Enforces strict input validation, length bounds, allowed update fields,
 * and URL scheme security to prevent injection and privilege escalation.
 */

const mongoose = require('mongoose');

const FORBIDDEN_UPDATE_FIELDS = new Set([
  '_id',
  'userId',
  'email',
  'password',
  'passwordHash',
  'role',
  'isVerified',
  'moderationStatus',
  'createdAt',
  'updatedAt',
]);

/**
 * Validate MongoDB ObjectId
 */
function isValidObjectId(id) {
  if (!id || typeof id !== 'string') return false;
  return mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === id;
}

/**
 * Validate URL security (only http and https allowed)
 */
function isValidWebUrl(string) {
  if (!string || typeof string !== 'string' || !string.trim()) return true;
  try {
    const parsed = new URL(string.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Sanitize and validate profile update payload
 */
function validateProfileUpdate(body) {
  const errors = [];
  const sanitized = {};

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { isValid: false, errors: ['Request body must be a valid JSON object.'] };
  }

  // Reject forbidden/protected fields
  for (const key of Object.keys(body)) {
    if (FORBIDDEN_UPDATE_FIELDS.has(key)) {
      errors.push(`Field '${key}' is protected and cannot be modified.`);
    }
  }

  // Branch
  if (body.branch !== undefined) {
    if (typeof body.branch !== 'string' || !body.branch.trim()) {
      errors.push('Branch/Department must be a non-empty string.');
    } else if (body.branch.trim().length > 80) {
      errors.push('Branch cannot exceed 80 characters.');
    } else {
      sanitized.branch = body.branch.trim();
    }
  }

  // Study Year
  if (body.studyYear !== undefined) {
    const year = Number(body.studyYear);
    if (!Number.isInteger(year) || year < 1 || year > 5) {
      errors.push('Study year must be an integer between 1 and 5.');
    } else {
      sanitized.studyYear = year;
    }
  }

  // Bio
  if (body.bio !== undefined) {
    if (typeof body.bio !== 'string') {
      errors.push('Bio must be a string.');
    } else if (body.bio.trim().length > 300) {
      errors.push('Bio cannot exceed 300 characters.');
    } else {
      sanitized.bio = body.bio.trim();
    }
  }

  // Skills
  if (body.skills !== undefined) {
    if (!Array.isArray(body.skills)) {
      errors.push('Skills must be an array of strings.');
    } else if (body.skills.length > 15) {
      errors.push('A student can specify at most 15 skills.');
    } else {
      sanitized.skills = body.skills
        .filter((s) => typeof s === 'string' && s.trim())
        .map((s) => s.trim().slice(0, 30));
    }
  }

  // Interests
  if (body.interests !== undefined) {
    if (!Array.isArray(body.interests)) {
      errors.push('Interests must be an array of strings.');
    } else if (body.interests.length > 10) {
      errors.push('A student can specify at most 10 interests.');
    } else {
      sanitized.interests = body.interests
        .filter((i) => typeof i === 'string' && i.trim())
        .map((i) => i.trim().slice(0, 30));
    }
  }

  // Links
  if (body.links !== undefined) {
    if (typeof body.links !== 'object' || body.links === null || Array.isArray(body.links)) {
      errors.push('Links must be an object.');
    } else {
      sanitized.links = {};
      const { github, linkedin, website } = body.links;

      if (github !== undefined) {
        if (!isValidWebUrl(github)) {
          errors.push('GitHub URL must start with http:// or https://');
        } else {
          sanitized.links.github = String(github || '').trim();
        }
      }
      if (linkedin !== undefined) {
        if (!isValidWebUrl(linkedin)) {
          errors.push('LinkedIn URL must start with http:// or https://');
        } else {
          sanitized.links.linkedin = String(linkedin || '').trim();
        }
      }
      if (website !== undefined) {
        if (!isValidWebUrl(website)) {
          errors.push('Website URL must start with http:// or https://');
        } else {
          sanitized.links.website = String(website || '').trim();
        }
      }
    }
  }

  // Visibility
  if (body.visibility !== undefined) {
    if (typeof body.visibility !== 'object' || body.visibility === null) {
      errors.push('Visibility must be an object.');
    } else {
      sanitized.visibility = {};
      if (body.visibility.profile !== undefined) {
        if (!['students', 'connections', 'private'].includes(body.visibility.profile)) {
          errors.push("Visibility profile must be 'students', 'connections', or 'private'.");
        } else {
          sanitized.visibility.profile = body.visibility.profile;
        }
      }
      if (body.visibility.showProjects !== undefined) {
        sanitized.visibility.showProjects = Boolean(body.visibility.showProjects);
      }
      if (body.visibility.showLinks !== undefined) {
        sanitized.visibility.showLinks = Boolean(body.visibility.showLinks);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized,
  };
}

/**
 * Validate and bound pagination parameters
 */
function validatePagination(query) {
  let page = parseInt(query.page, 10);
  let limit = parseInt(query.limit, 10);

  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || limit < 1) limit = 10;
  if (limit > 50) limit = 50; // hard maximum 50 to prevent DoS

  return { page, limit };
}

module.exports = {
  isValidObjectId,
  isValidWebUrl,
  validateProfileUpdate,
  validatePagination,
  FORBIDDEN_UPDATE_FIELDS,
};

