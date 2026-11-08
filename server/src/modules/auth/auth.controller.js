import { authService } from './auth.service.js';
import { validateRegister, validateLogin } from './auth.validators.js';

export const authController = {
  async register(req, res, next) {
    try {
      const errors = validateRegister(req.body);
      if (errors.length > 0) {
        return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: errors[0], details: errors } });
      }
      const result = await authService.register(req.body);
      return res.status(201).json({ success: true, data: result });
    } catch (err) {
      if (err.statusCode) {
        return res.status(err.statusCode).json({ success: false, error: { code: 'AUTH_ERROR', message: err.message } });
      }
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const errors = validateLogin(req.body);
      if (errors.length > 0) {
        return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: errors[0], details: errors } });
      }
      const result = await authService.login(req.body.email, req.body.password);
      return res.status(200).json({ success: true, data: result });
    } catch (err) {
      if (err.statusCode) {
        return res.status(err.statusCode).json({ success: false, error: { code: 'AUTH_ERROR', message: err.message } });
      }
      next(err);
    }
  },

  async logout(req, res) {
    return res.status(200).json({ success: true, data: { message: 'Logged out successfully.' } });
  },

  async getMe(req, res, next) {
    try {
      const user = await authService.getProfile(req.user.id);
      return res.status(200).json({ success: true, data: { user } });
    } catch (err) {
      if (err.statusCode) {
        return res.status(err.statusCode).json({ success: false, error: { code: 'NOT_FOUND', message: err.message } });
      }
      next(err);
    }
  },

  async updateMe(req, res, next) {
    try {
      const user = await authService.updateProfile(req.user.id, req.body);
      return res.status(200).json({ success: true, data: { user } });
    } catch (err) {
      if (err.statusCode) {
        return res.status(err.statusCode).json({ success: false, error: { code: 'UPDATE_ERROR', message: err.message } });
      }
      next(err);
    }
  },

  async forgotPassword(req, res) {
    // Placeholder - email service not configured
    return res.status(200).json({ success: true, data: { message: 'If that email exists, a reset link will be sent.' } });
  },
};
