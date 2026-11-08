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
