import { describe, it, expect } from 'vitest';
import {
  getDashboardData,
  toggleSaveOpportunity,
  isOpportunitySaved,
  toggleConnectStudent,
  isStudentConnected,
} from '../services/dashboardService.js';
import { getPulseFeed, PULSE_FILTERS } from '../services/pulseService.js';

describe('Vynora Connect — Client Dashboard & Pulse Service Tests', () => {
  describe('dashboardService', () => {
    it('fetches aggregated dashboard state with valid stats and profile', async () => {
      const res = await getDashboardData();
      expect(res.success).toBe(true);
      expect(res.data).toBeDefined();
      expect(res.data.user.name).toBe('Karthik');
      expect(res.data.stats.connections).toBeGreaterThan(0);
      expect(Array.isArray(res.data.upcomingEvents)).toBe(true);
      expect(Array.isArray(res.data.collaborationProjects)).toBe(true);
      expect(Array.isArray(res.data.recommendations)).toBe(true);
    });

    it('toggles opportunity saved state reliably in memory session', async () => {
      const initial = isOpportunitySaved('test-opp-999');
      expect(initial).toBe(false);

      const savedRes = await toggleSaveOpportunity('test-opp-999');
      expect(savedRes.saved).toBe(true);
      expect(isOpportunitySaved('test-opp-999')).toBe(true);

      const unsavedRes = await toggleSaveOpportunity('test-opp-999');
      expect(unsavedRes.saved).toBe(false);
      expect(isOpportunitySaved('test-opp-999')).toBe(false);
    });

    it('toggles student connection state reliably', async () => {
      const initial = isStudentConnected('std-999');
      expect(initial).toBe(false);

      const connectedRes = await toggleConnectStudent('std-999');
      expect(connectedRes.connected).toBe(true);
      expect(isStudentConnected('std-999')).toBe(true);

      const disconnectedRes = await toggleConnectStudent('std-999');
      expect(disconnectedRes.connected).toBe(false);
      expect(isStudentConnected('std-999')).toBe(false);
    });
  });

  describe('pulseService', () => {
    it('defines expected filter categories for student activities', () => {
      expect(PULSE_FILTERS.length).toBeGreaterThanOrEqual(4);
      const filterIds = PULSE_FILTERS.map((f) => f.id);
      expect(filterIds).toContain('all');
      expect(filterIds).toContain('connections');
      expect(filterIds).toContain('opportunities');
      expect(filterIds).toContain('events');
      expect(filterIds).toContain('projects');
    });

    it('fetches paginated pulse feed items', async () => {
      const feed = await getPulseFeed({ filter: 'all', page: 1, limit: 3 });
      expect(feed.success).toBe(true);
      expect(feed.data.length).toBe(3);
      expect(feed.pagination.page).toBe(1);
    });

    it('filters pulse items by opportunities', async () => {
      const feed = await getPulseFeed({ filter: 'opportunities', page: 1, limit: 10 });
      expect(feed.success).toBe(true);
      feed.data.forEach((item) => {
        expect(item.category).toBe('opportunity');
      });
    });

    it('filters pulse items by events', async () => {
      const feed = await getPulseFeed({ filter: 'events', page: 1, limit: 10 });
      expect(feed.success).toBe(true);
      feed.data.forEach((item) => {
        expect(item.category).toBe('events');
      });
    });
  });
});

