import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../app.js';

describe('Vynora Connect — Backend API Integration Tests', () => {
  describe('GET /api/v1/health', () => {
    it('returns operational health status and metadata', async () => {
      const res = await request(app).get('/api/v1/health');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('operational');
      expect(res.body.data.service).toBe('Vynora Connect Backend API');
    });
  });

  describe('GET /api/v1/dashboard', () => {
    it('returns full dashboard aggregation with authenticated user and stats', async () => {
      const res = await request(app).get('/api/v1/dashboard');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const { data } = res.body;
      expect(data.user).toBeDefined();
      expect(data.user.name).toBe('Karthik');
      expect(data.user.college).toBe('SR University');

      expect(data.stats).toBeDefined();
      expect(data.stats.connections).toBeGreaterThan(0);
      expect(data.stats.savedOpportunities).toBeDefined();

      expect(Array.isArray(data.upcomingEvents)).toBe(true);
      expect(Array.isArray(data.collaborationProjects)).toBe(true);
      expect(Array.isArray(data.recommendations)).toBe(true);
      expect(Array.isArray(data.opportunities)).toBe(true);
      expect(Array.isArray(data.resources)).toBe(true);
      expect(Array.isArray(data.mentors)).toBe(true);
      expect(Array.isArray(data.notifications)).toBe(true);
    });
  });

  describe('GET & PATCH /api/v1/dashboard/preferences', () => {
    it('retrieves user dashboard preferences', async () => {
      const res = await request(app).get('/api/v1/dashboard/preferences');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.sectionOrder).toBeDefined();
    });

    it('updates user dashboard preferences with validation', async () => {
      const payload = {
        dismissedOnboardingTasks: ['task-welcome', 'task-profile-setup'],
        hiddenPulseItemIds: ['pulse-act-hidden-99'],
      };

      const res = await request(app)
        .patch('/api/v1/dashboard/preferences')
        .send(payload);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.dismissedOnboardingTasks).toContain('task-welcome');
    });

    it('rejects invalid preference payloads with 400', async () => {
      const res = await request(app)
        .patch('/api/v1/dashboard/preferences')
        .send({
          dismissedOnboardingTasks: 'not-an-array',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('GET /api/v1/pulse', () => {
    it('returns paginated activity feed items', async () => {
      const res = await request(app).get('/api/v1/pulse?page=1&limit=5');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeLessThanOrEqual(5);
      expect(res.body.meta.page).toBe(1);
      expect(res.body.meta.limit).toBe(5);
    });

    it('filters activities by category (e.g., opportunities)', async () => {
      const res = await request(app).get('/api/v1/pulse?filter=opportunities');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      res.body.data.forEach((item) => {
        expect(item.category).toBe('opportunity');
      });
    });

    it('rejects disallowed filter values', async () => {
      const res = await request(app).get('/api/v1/pulse?filter=unsupported_category');
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('guarantees security rules: no private messages or contact numbers in activity items', async () => {
      const res = await request(app).get('/api/v1/pulse');
      expect(res.status).toBe(200);
      res.body.data.forEach((item) => {
        expect(item.type).not.toBe('private_message');
        expect(item.type).not.toBe('moderation_action');
        expect(item.contactPhone).toBeUndefined();
        expect(item.privateNotes).toBeUndefined();
      });
    });
  });
});
