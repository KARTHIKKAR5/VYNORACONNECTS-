import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'vynora-connect-dev-secret-2026';

export const DEMO_USER = {
  id: 'usr-karthik',
  name: 'Karthik',
  email: 'karthik@vynora.edu',
  college: 'SR University',
  department: 'Computer Science & Engineering',
  graduationYear: 2026,
  role: 'student',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
  bio: 'Full-stack builder passionate about distributed systems, student developer communities, and cloud-native architecture.',
  skills: ['React', 'Node.js', 'Express', 'MongoDB', 'System Design', 'TypeScript'],
};

/**
 * Authentication middleware for general endpoints (e.g. Dashboard)
 * Validates JWT if provided, or provides default authenticated Karthik profile in demo mode.
 */
export function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = {
        id: decoded.id || decoded.sub || 'usr-karthik',
        name: decoded.name || 'Karthik',
        email: decoded.email || 'karthik@vynora.edu',
        college: decoded.college || 'SR University',
        department: decoded.department || 'Computer Science & Engineering',
        role: decoded.role || 'student',
      };
      return next();
    } catch {
      if (process.env.NODE_ENV === 'production') {
        return res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Invalid or expired session token.',
          },
        });
      }
    }
  }

  // Authoritative server-side authenticated user for demo / dev session
  req.user = { ...DEMO_USER };
  next();
}

/**
 * Strict authentication middleware for sensitive user account endpoints (e.g. /auth/me)
 * Requires a valid, cryptographically verified Bearer JWT token.
 */
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication token required.',
      },
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = {
      id: decoded.id || decoded.sub,
      name: decoded.name,
      email: decoded.email,
      college: decoded.college,
      department: decoded.department,
      role: decoded.role || 'student',
    };
    return next();
  } catch (_err) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid or expired session token.',
      },
    });
  }
}
