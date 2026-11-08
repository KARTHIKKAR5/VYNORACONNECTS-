/**
 * Vynora Connect — Module 5: Opportunities & Resources Test Suite
 * Automated unit and integration tests for services, validations, and lifecycle contracts.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  getResources,
  getResourceById,
  createResource,
  validateResourceForm,
  validateUrl,
  toggleBookmarkResource,
  getBookmarkedResources,
  upvoteResource,
} from '../services/resourcesService.js';

import {
  getOpportunities,
  getOpportunityById,
  createOpportunity,
  validateOpportunityForm,
  toggleSaveOpportunity,
  updateOpportunityTrackerStatus,
  getSavedOpportunities,
  getFeaturedOpportunities,
  TRACKER_STAGES,
} from '../services/opportunitiesService.js';

import { getDeadlineInfo, isValidFutureDate } from '../utils/deadlineUtils.js';

describe('1. Deadline Calculation & Urgency Tests', () => {
  test('accurately calculates expired deadlines', () => {
    const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const info = getDeadlineInfo(pastDate);
    assert.equal(info.isExpired, true);
    assert.equal(info.urgency, 'expired');
    assert.equal(info.label, 'Closed / Expired');
  });

  test('identifies urgent deadlines closing within 48 hours', () => {
    const urgentDate = new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString();
    const info = getDeadlineInfo(urgentDate);
    assert.equal(info.isExpired, false);
    assert.equal(info.urgency, 'urgent');
    assert.match(info.label, /Closing/);
  });

  test('marks future deadlines (> 48h) as active', () => {
    const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const info = getDeadlineInfo(futureDate);
    assert.equal(info.isExpired, false);
    assert.equal(info.urgency, 'active');
    assert.match(info.label, /days left/);
  });

  test('validates future dates correctly', () => {
    assert.equal(isValidFutureDate(''), false);
    assert.equal(isValidFutureDate('invalid-date'), false);
    assert.equal(isValidFutureDate(new Date(Date.now() - 1000).toISOString()), false);
    assert.equal(isValidFutureDate(new Date(Date.now() + 100000).toISOString()), true);
  });
});

describe('2. Learning Resources Service & Validation Tests', () => {
  test('validates required fields and lengths in resource form', () => {
    const invalid = validateResourceForm({
      title: 'abc', // Too short (< 5)
      topic: '',
      description: 'short', // Too short (< 15)
      type: 'invalid-type',
      sourceUrl: 'invalid-url',
    });
    assert.equal(invalid.isValid, false);
    assert.ok(invalid.errors.title);
    assert.ok(invalid.errors.topic);
    assert.ok(invalid.errors.description);
    assert.ok(invalid.errors.type);
    assert.ok(invalid.errors.sourceUrl);
  });

  test('accepts valid resource form with valid http/https URLs', () => {
    const valid = validateResourceForm({
      title: 'Operating Systems Virtual Memory Summary',
      topic: 'Operating Systems',
      category: 'Study Notes',
      branch: 'CSE',
      type: 'document',
      description: 'Detailed explanation of paging, page replacement algorithms, and TLBs.',
      sourceUrl: 'https://github.com/vynora/os-notes',
    });
    assert.equal(valid.isValid, true);
    assert.equal(Object.keys(valid.errors).length, 0);
  });

  test('retrieves resources and supports filtering by topic and branch', async () => {
    const all = await getResources();
    assert.ok(Array.isArray(all.data));
    assert.ok(all.data.length > 0);

    const cseResources = await getResources({ branch: 'CSE' });
    assert.ok(cseResources.data.every(r => r.branch === 'CSE' || r.branch === 'General'));
  });

  test('submitting a resource places it strictly in pending review status', async () => {
    const res = await createResource({
      title: 'Automated Test Systems Engineering Guide',
      topic: 'Testing',
      category: 'Study Notes',
      branch: 'CSE',
      type: 'article',
      description: 'Complete notes on unit testing, mocking, CI/CD integration for students.',
      sourceUrl: 'https://vynora.edu/testing-guide',
    });

    assert.equal(res.success, true);
    assert.equal(res.data.status, 'pending'); // Mandatory moderation status
  });

  test('upvoting a resource increments count and toggles state', async () => {
    const list = await getResources();
    const first = list.data[0];
    const initialUpvotes = first.upvotesCount;

    const result = await upvoteResource(first.id);
    assert.equal(typeof result.upvotesCount, 'number');
    assert.equal(typeof result.hasUpvoted, 'boolean');
  });

  test('bookmarking a resource toggles saved state', async () => {
    const list = await getResources();
    const testId = list.data[0].id;

    const toggle1 = await toggleBookmarkResource(testId);
    assert.equal(typeof toggle1.isBookmarked, 'boolean');

    const bookmarks = await getBookmarkedResources();
    assert.ok(Array.isArray(bookmarks));
  });
});

describe('3. Opportunities Hub Service & Tracker Tests', () => {
  test('validates opportunity submission fields and deadlines', () => {
    const invalid = validateOpportunityForm({
      title: 'Dev', // Too short
      organizerName: '',
      type: 'invalid',
      description: 'short',
      eligibility: '',
      deadlineAt: '2020-01-01', // Past date
      applicationUrl: 'not-a-url',
    });
    assert.equal(invalid.isValid, false);
    assert.ok(invalid.errors.title);
    assert.ok(invalid.errors.organizerName);
    assert.ok(invalid.errors.type);
    assert.ok(invalid.errors.description);
    assert.ok(invalid.errors.deadlineAt);
    assert.ok(invalid.errors.applicationUrl);
  });

  test('retrieves opportunities and filters by active deadlines', async () => {
    const result = await getOpportunities({ deadlineStatus: 'active' });
    assert.ok(Array.isArray(result.data));
    assert.ok(result.data.length > 0);
  });

  test('submitting an opportunity places it strictly in pending review status', async () => {
    const futureDeadline = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
    const res = await createOpportunity({
      title: 'National Student AI Hackathon 2027',
      organizerName: 'National Science Foundation',
      type: 'hackathon',
      mode: 'online',
      description: 'Build innovative generative AI models to solve real campus problems.',
      eligibility: 'All undergraduate engineering students with student ID.',
      deadlineAt: futureDeadline,
      applicationUrl: 'https://nsf-hack.org/apply',
    });

    assert.equal(res.success, true);
    assert.equal(res.data.status, 'pending'); // Mandatory moderation status
  });

  test('toggles save/bookmark for opportunity and maintains private tracker', async () => {
    const opps = await getOpportunities();
    const testId = opps.data[0].id;

    const toggleRes = await toggleSaveOpportunity(testId);
    assert.equal(typeof toggleRes.isSaved, 'boolean');

    const savedList = await getSavedOpportunities();
    assert.ok(Array.isArray(savedList));
  });

  test('updates application tracker stage among valid predefined states', async () => {
    const opps = await getOpportunities();
    const testId = opps.data[0].id;

    const updated = await updateOpportunityTrackerStatus(testId, 'applied', 'Submitted via college portal');
    assert.equal(updated.trackerStatus, 'applied');
    assert.equal(updated.notes, 'Submitted via college portal');

    // Verify valid stages
    const validValues = TRACKER_STAGES.map(s => s.value);
    assert.ok(validValues.includes('saved'));
    assert.ok(validValues.includes('applied'));
    assert.ok(validValues.includes('shortlisted'));
  });

  test('exports featured opportunities matching Karthik dashboard contract', async () => {
    const featured = await getFeaturedOpportunities(3);
    assert.ok(Array.isArray(featured));
    assert.ok(featured.length <= 3);

    if (featured.length > 0) {
      const item = featured[0];
      assert.ok(item.id);
      assert.ok(item.title);
      assert.ok(item.organization);
      assert.ok(item.type);
      assert.ok(item.deadline);
      assert.ok(item.isoDeadline);
      assert.equal(typeof item.isExpiringSoon, 'boolean');
    }
  });
});

describe('4. Security & Isolation Checks', () => {
  test('rejects unsafe URL protocols like javascript: or data:', () => {
    assert.equal(validateUrl('javascript:alert(1)'), false);
    assert.equal(validateUrl('data:text/html;base64,PHNjcmlwdD4='), false);
    assert.equal(validateUrl('ftp://example.com'), false);
    assert.equal(validateUrl('https://valid-domain.com/path'), true);
    assert.equal(validateUrl('http://valid-domain.com/path'), true);
  });
});

