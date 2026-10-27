import { describe, it, expect } from 'vitest';
import {
  validateUrl,
  validateResourceForm,
  getResources,
  getResourceById,
  createResource,
} from '../services/resourcesService.js';

describe('resourcesService', () => {
  describe('validateUrl', () => {
    it('should approve valid https and http URLs', () => {
      expect(validateUrl('https://github.com/vynora/resources')).toBe(true);
      expect(validateUrl('http://example.com/notes')).toBe(true);
    });

    it('should reject unsafe protocols and invalid URLs', () => {
      expect(validateUrl('javascript:alert(1)')).toBe(false);
      expect(validateUrl('data:text/html,malicious')).toBe(false);
      expect(validateUrl('not-a-url')).toBe(false);
      expect(validateUrl('')).toBe(false);
      expect(validateUrl(null)).toBe(false);
    });
  });

  describe('validateResourceForm', () => {
    it('should validate complete valid resource payload', () => {
      const valid = {
        title: 'Mastering Graph Algorithms',
        description: 'Comprehensive study notes on Dijkstra, Bellman-Ford, and Prim algorithms with code examples in C++.',
        category: 'Data Structures & Algorithms',
        type: 'notes',
        sourceUrl: 'https://vynora.org/dsa/graphs',
      };
      const result = validateResourceForm(valid);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors).length).toBe(0);
    });

    it('should report field errors for invalid inputs', () => {
      const invalid = {
        title: 'DSA', // too short (< 5)
        description: 'Short', // too short (< 20)
        category: 'NonExistentCategory',
        type: 'invalidType',
        sourceUrl: 'ftp://ftp.example.com', // not http/https
      };
      const result = validateResourceForm(invalid);
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBeDefined();
      expect(result.errors.description).toBeDefined();
      expect(result.errors.category).toBeDefined();
      expect(result.errors.type).toBeDefined();
      expect(result.errors.sourceUrl).toBeDefined();
    });
  });

  describe('getResources & filtering', () => {
    it('should retrieve default list of resources', async () => {
      const res = await getResources();
      expect(res.data.length).toBeGreaterThan(0);
      expect(res.isLiveBackend).toBe(false); // offline fallback
    });

    it('should filter resources by category', async () => {
      const res = await getResources({ category: 'Data Structures & Algorithms' });
      expect(res.data.every(r => r.category === 'Data Structures & Algorithms')).toBe(true);
    });

    it('should search resources by keyword in title, description, or tags', async () => {
      const res = await getResources({ search: 'roadmap' });
      expect(res.data.length).toBeGreaterThan(0);
      expect(
        res.data.some(
          r =>
            r.title.toLowerCase().includes('roadmap') ||
            r.tags.includes('roadmap')
        )
      ).toBe(true);
    });
  });

  describe('getResourceById', () => {
    it('should return resource by existing ID', async () => {
      const res = await getResourceById('res-101');
      expect(res).not.toBeNull();
      expect(res.data.title).toContain('Data Structures');
    });

    it('should return null for non-existent ID', async () => {
      const res = await getResourceById('non-existent-id-999');
      expect(res).toBeNull();
    });
  });

  describe('createResource', () => {
    it('should create new resource and add to store', async () => {
      const newPayload = {
        title: 'New Distributed Systems Patterns 2026',
        description: 'Detailed analysis of raft consensus and Paxos replication models for college student study.',
        category: 'System Design',
        type: 'documentation',
        sourceUrl: 'https://github.com/vynora/consensus-notes',
        tags: 'raft, paxos, distributed-systems',
      };

      const result = await createResource(newPayload);
      expect(result.success).toBe(true);
      expect(result.data.id).toBeDefined();
      expect(result.data.title).toBe(newPayload.title);
      expect(result.isPersistedToDatabase).toBe(false); // Honest offline fallback
    });

    it('should reject duplicate resource titles', async () => {
      const duplicatePayload = {
        title: 'Complete Data Structures & Algorithms Visual Guide',
        description: 'Another duplicate description with more than twenty characters to pass length check.',
        category: 'Data Structures & Algorithms',
        type: 'notes',
        sourceUrl: 'https://vynora.org/dsa',
      };

      await expect(createResource(duplicatePayload)).rejects.toMatchObject({
        name: 'ValidationError',
        errors: expect.objectContaining({ title: expect.any(String) }),
      });
    });
  });
});
