import { describe, it, expect } from 'vitest';
import { validateRegister, validateLogin } from '../modules/auth/auth.validators.js';

describe('Auth Validators', () => {
  describe('validateRegister', () => {
    it('should pass on valid registration data', () => {
      const data = {
        firstName: 'Karthik',
        lastName: 'Kumar',
        email: 'karthik@vynora.edu',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      };
      const errors = validateRegister(data);
      expect(errors).toHaveLength(0);
    });

    it('should reject missing first name', () => {
      const data = {
        firstName: '',
        email: 'karthik@vynora.edu',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      };
      const errors = validateRegister(data);
      expect(errors).toContain('First name is required.');
    });

    it('should reject invalid email format', () => {
      const data = {
        firstName: 'Karthik',
        email: 'not-an-email',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      };
      const errors = validateRegister(data);
      expect(errors).toContain('Invalid email address.');
    });

    it('should reject short passwords', () => {
      const data = {
        firstName: 'Karthik',
        email: 'karthik@vynora.edu',
        password: 'short',
        confirmPassword: 'short',
      };
      const errors = validateRegister(data);
      expect(errors).toContain('Password must be at least 8 characters.');
    });

    it('should reject mismatched passwords', () => {
      const data = {
        firstName: 'Karthik',
        email: 'karthik@vynora.edu',
        password: 'Password123!',
        confirmPassword: 'DifferentPassword!',
      };
      const errors = validateRegister(data);
      expect(errors).toContain('Passwords do not match.');
    });
  });

  describe('validateLogin', () => {
    it('should pass on valid login body', () => {
      const errors = validateLogin({ email: 'karthik@vynora.edu', password: 'Password123!' });
      expect(errors).toHaveLength(0);
    });

    it('should reject missing email or password', () => {
      const errors = validateLogin({ email: '', password: '' });
      expect(errors).toContain('Email is required.');
      expect(errors).toContain('Password is required.');
    });
  });
});


import { requireAuth } from '../middleware/auth.middleware.js';
import { authService } from '../modules/auth/auth.service.js';

describe('requireAuth Middleware', () => {
  it('should return 401 if Authorization header is missing', () => {
    let statusCode = null;
    let jsonBody = null;
    const req = { headers: {} };
    const res = {
      status: (code) => {
        statusCode = code;
        return {
          json: (body) => {
            jsonBody = body;
          },
        };
      },
    };
    const next = () => {};

    requireAuth(req, res, next);
    expect(statusCode).toBe(401);
    expect(jsonBody.error.code).toBe('UNAUTHORIZED');
  });

  it('should return 401 if token is malformed', () => {
    let statusCode = null;
    let jsonBody = null;
    const req = { headers: { authorization: 'Bearer invalid-token-string' } };
    const res = {
      status: (code) => {
        statusCode = code;
        return {
          json: (body) => {
            jsonBody = body;
          },
        };
      },
    };
    const next = () => {};

    requireAuth(req, res, next);
    expect(statusCode).toBe(401);
    expect(jsonBody.error.code).toBe('UNAUTHORIZED');
  });
});

describe('Database Offline Handling', () => {
  it('should reject registration with 503 when database is offline', async () => {
    await expect(
      authService.register({
        firstName: 'Jane',
        email: 'jane@vynora.edu',
        password: 'Password123!',
      })
    ).rejects.toThrow('Database is offline');
  });

  it('should reject login for non-demo email with 503 when database is offline', async () => {
    await expect(
      authService.login('unknown@vynora.edu', 'Password123!')
    ).rejects.toThrow('Database is offline');
  });
});
