import { describe, it, expect } from 'vitest';
import {
  getDeadlineInfo,
  validateOpportunityForm,
  getOpportunities,
  getOpportunityById,
  createOpportunity,
  getFeaturedOpportunities,
} from '../services/opportunitiesService.js';

describe('opportunitiesService', () => {
  describe('getDeadlineInfo', () => {
    it('should correctly identify expired deadlines', () => {
      const pastDate = '2020-01-01T00:00:00Z';
      const info = getDeadlineInfo(pastDate);
      expect(info.isExpired).toBe(true);
      expect(info.urgency).toBe('expired');
      expect(info.label).toBe('Expired');
    });

    it('should correctly identify urgent deadlines within 3 days', () => {
      const now = new Date();
      const inTwoDays = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString();
      const info = getDeadlineInfo(inTwoDays);
      expect(info.isExpired).toBe(false);
      expect(info.urgency).toBe('urgent');
      expect(info.daysRemaining).toBeLessThanOrEqual(3);
    });

    it('should correctly identify active future deadlines', () => {
      const now = new Date();
      const inThirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
      const info = getDeadlineInfo(inThirtyDays);
      expect(info.isExpired).toBe(false);
      expect(info.urgency).toBe('active');
      expect(info.daysRemaining).toBeGreaterThan(15);
    });

    it('should handle malformed or missing dates gracefully without crashing', () => {
      const badDate = getDeadlineInfo('invalid-date-string');
      expect(badDate.urgency).toBe('unknown');

      const nullDate = getDeadlineInfo(null);
      expect(nullDate.urgency).toBe('unknown');
    });
  });

  describe('validateOpportunityForm', () => {
    it('should approve valid opportunity payload', () => {
      const futureDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const valid = {
        title: 'Open Source Summer Fellowship 2027',
        organization: 'Mozilla Foundation',
        type: 'internship',
        summary: 'Paid fellowship contributing to Rust and Gecko browser engines with senior mentors.',
        eligibility: 'Enrolled undergraduate or postgraduate student with Git proficiency.',
        deadline: futureDate,
        applicationUrl: 'https://community.mozilla.org/fellowships',
      };
      const result = validateOpportunityForm(valid);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors).length).toBe(0);
    });

    it('should reject past deadline date and invalid URLs', () => {
      const invalid = {
        title: 'Job', // too short (< 5)
        organization: 'A', // too short (< 2)
        type: 'invalidType',
        summary: 'Short', // too short (< 20)
        eligibility: '',
        deadline: '2021-05-01', // past date
        applicationUrl: 'not-a-valid-url',
      };
      const result = validateOpportunityForm(invalid);
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBeDefined();
      expect(result.errors.organization).toBeDefined();
      expect(result.errors.type).toBeDefined();
      expect(result.errors.summary).toBeDefined();
      expect(result.errors.deadline).toBe('Deadline must be a future date.');
      expect(result.errors.applicationUrl).toBeDefined();
    });
  });

  describe('getOpportunities & filtering', () => {
    it('should return initial opportunities list', async () => {
      const res = await getOpportunities();
      expect(res.data.length).toBeGreaterThan(0);
    });

    it('should filter opportunities by type', async () => {
      const res = await getOpportunities({ type: 'hackathon' });
      expect(res.data.every(o => o.type === 'hackathon')).toBe(true);
    });

    it('should filter active opportunities only', async () => {
      const res = await getOpportunities({ deadlineStatus: 'active' });
      expect(res.data.every(o => !getDeadlineInfo(o.deadline).isExpired)).toBe(true);
    });

    it('should search by title or organization', async () => {
      const res = await getOpportunities({ search: 'Google' });
      expect(res.data.length).toBeGreaterThan(0);
      expect(res.data.some(o => o.organization.includes('Google') || o.title.includes('Google'))).toBe(true);
    });
  });

  describe('getOpportunityById', () => {
    it('should retrieve existing opportunity by ID', async () => {
      const res = await getOpportunityById('opp-201');
      expect(res).not.toBeNull();
      expect(res.data.title).toContain('Summer Intern');
    });

    it('should return null for non-existent ID', async () => {
      const res = await getOpportunityById('opp-fake-999');
      expect(res).toBeNull();
    });
  });

  describe('Dashboard integration helper', () => {
    it('should return active featured opportunities up to limit', async () => {
      const featured = await getFeaturedOpportunities(2);
      expect(featured.length).toBeLessThanOrEqual(2);
      expect(featured.every(o => !getDeadlineInfo(o.deadline).isExpired)).toBe(true);
    });
  });

  describe('createOpportunity', () => {
    it('should create new student opportunity and add to store', async () => {
      const futureDate = new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const payload = {
        title: 'New College AI Sprint 2026',
        organization: 'National AI Club',
        type: 'hackathon',
        summary: 'Cross-campus student coding sprint solving accessibility problems with edge neural nets.',
        eligibility: 'All college undergraduates.',
        deadline: futureDate,
        applicationUrl: 'https://aisprint.org/apply',
      };

      const result = await createOpportunity(payload);
      expect(result.success).toBe(true);
      expect(result.data.id).toBeDefined();
      expect(result.data.title).toBe(payload.title);
      expect(result.isPersistedToDatabase).toBe(false);
    });
  });
});
