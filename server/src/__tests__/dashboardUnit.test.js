import { describe, it, expect } from 'vitest';
import * as dashboardService from '../modules/dashboard/dashboard.service.js';
import * as pulseService from '../modules/pulse/pulse.service.js';
import { validatePreferencesUpdate } from '../modules/dashboard/dashboard.validators.js';
import { validatePulseQuery } from '../modules/pulse/pulse.validators.js';
import { mapActivityToSafeDTO } from '../modules/pulse/pulse.mapper.js';
import { DEMO_USER } from '../middleware/auth.middleware.js';

describe('Vynora Connect — Backend Unit & Service Tests', () => {
  it('aggregates dashboard data with user profile and statistics', async () => {
    const data = await dashboardService.getDashboardData(DEMO_USER);
    expect(data.user.name).toBe('Karthik');
    expect(data.stats.connections).toBeGreaterThan(0);
    expect(data.upcomingEvents.length).toBeGreaterThan(0);
    expect(data.collaborationProjects.length).toBeGreaterThan(0);
    expect(data.recommendations.length).toBeGreaterThan(0);
  });

  it('updates and retrieves user preferences', async () => {
    const updated = await dashboardService.updateUserPreferences('usr-test', {
      dismissedOnboardingTasks: ['task-1'],
    });
    expect(updated.dismissedOnboardingTasks).toContain('task-1');

    const retrieved = await dashboardService.getUserPreferences('usr-test');
    expect(retrieved.dismissedOnboardingTasks).toContain('task-1');
  });

  it('validates preference updates correctly', () => {
    const valid = validatePreferencesUpdate({ sectionOrder: ['welcome', 'stats'] });
    expect(valid.isValid).toBe(true);

    const invalid = validatePreferencesUpdate({ sectionOrder: 'invalid' });
    expect(valid.isValid).toBe(true);
    expect(invalid.isValid).toBe(false);
  });

  it('fetches and paginates pulse feed items', async () => {
    const feed = await pulseService.getPulseFeed(DEMO_USER, { page: 1, limit: 3 });
    expect(feed.items.length).toBe(3);
    expect(feed.pagination.page).toBe(1);
    expect(feed.pagination.limit).toBe(3);
    expect(feed.pagination.hasMore).toBe(true);
  });

  it('filters pulse feed by category', async () => {
    const feed = await pulseService.getPulseFeed(DEMO_USER, { filter: 'opportunity' });
    feed.items.forEach((item) => {
      expect(item.category).toBe('opportunity');
    });
  });

  it('validates pulse query filters', () => {
    const valid = validatePulseQuery({ filter: 'events', page: '2', limit: '5' });
    expect(valid.isValid).toBe(true);
    expect(valid.params.filter).toBe('events');
    expect(valid.params.page).toBe(2);
    expect(valid.params.limit).toBe(5);

    const invalid = validatePulseQuery({ filter: 'malicious', page: '-1' });
    expect(invalid.isValid).toBe(false);
  });

  it('sanitizes private activities and sensitive attributes in mapper', () => {
    const safeItem = mapActivityToSafeDTO({
      id: 'act-1',
      type: 'event_published',
      category: 'events',
      actor: { name: 'Sindhu' },
      activityDescription: 'published event',
      targetTitle: 'Tech Summit',
    });
    expect(safeItem).not.toBeNull();
    expect(safeItem.targetTitle).toBe('Tech Summit');

    const privateItem = mapActivityToSafeDTO({
      id: 'act-2',
      type: 'private_message',
      isPrivate: true,
    });
    expect(privateItem).toBeNull();
  });
});
