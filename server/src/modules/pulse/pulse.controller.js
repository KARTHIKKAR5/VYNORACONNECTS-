import * as pulseService from './pulse.service.js';
import { validatePulseQuery } from './pulse.validators.js';

export async function getPulse(req, res, next) {
  try {
    const validation = validatePulseQuery(req.query);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid pulse query parameters.',
          details: validation.errors,
        },
      });
    }

    const { items, pagination } = await pulseService.getPulseFeed(req.user, validation.params);

    res.status(200).json({
      success: true,
      data: items,
      meta: {
        ...pagination,
        filter: validation.params.filter,
      },
    });
  } catch (error) {
    next(error);
  }
}

