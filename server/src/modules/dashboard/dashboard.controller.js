import * as dashboardService from './dashboard.service.js';
import { validatePreferencesUpdate } from './dashboard.validators.js';

export async function getDashboard(req, res, next) {
  try {
    const data = await dashboardService.getDashboardData(req.user);
    res.status(200).json({
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getPreferences(req, res, next) {
  try {
    const data = await dashboardService.getUserPreferences(req.user.id);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function updatePreferences(req, res, next) {
  try {
    const validation = validatePreferencesUpdate(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid preferences payload.',
          details: validation.errors,
        },
      });
    }

    const data = await dashboardService.updateUserPreferences(req.user.id, req.body);
    res.status(200).json({
      success: true,
      data,
      message: 'Dashboard preferences updated successfully.',
    });
  } catch (error) {
    next(error);
  }
}
