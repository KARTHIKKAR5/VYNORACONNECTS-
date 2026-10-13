/**
 * @file marketplaceService.js
 * @description Client-side service layer for Marketplace operations.
 * 
 * ARCHITECTURE NOTE:
 * This service encapsulates all data retrieval, creation, mutation, and validation.
 * It currently operates on component state with localStorage persistence.
 * When the Express backend and MongoDB database are wired up, the internal implementation
 * of these functions can be swapped for fetch('/api/v1/marketplace/...') HTTP requests
 * without altering a single UI component.
 */

import {
  INITIAL_SERVICE_LISTINGS,
  INITIAL_INQUIRIES
} from '../data/marketplaceData';

const LISTINGS_STORAGE_KEY = 'vynora_marketplace_listings';
const INQUIRIES_STORAGE_KEY = 'vynora_marketplace_inquiries';

// Helper to load persisted or default data
function loadInitialListings() {
  try {
    const raw = localStorage.getItem(LISTINGS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn('Could not read listings from localStorage:', err);
  }
  return INITIAL_SERVICE_LISTINGS;
}

function loadInitialInquiries() {
  try {
    const raw = localStorage.getItem(INQUIRIES_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn('Could not read inquiries from localStorage:', err);
  }
  return INITIAL_INQUIRIES;
}

// In-memory runtime stores synced with localStorage
let inMemoryListings = loadInitialListings();
let inMemoryInquiries = loadInitialInquiries();

function persistListings() {
  try {
    localStorage.setItem(LISTINGS_STORAGE_KEY, JSON.stringify(inMemoryListings));
  } catch (err) {
    console.warn('Failed to persist listings:', err);
  }
}

function persistInquiries() {
  try {
    localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(inMemoryInquiries));
  } catch (err) {
    console.warn('Failed to persist inquiries:', err);
  }
}

export const marketplaceService = {
  /**
   * Reset local storage back to default mock dataset
   */
  resetToDefaults() {
    inMemoryListings = [...INITIAL_SERVICE_LISTINGS];
    inMemoryInquiries = [...INITIAL_INQUIRIES];
    persistListings();
    persistInquiries();
    return { success: true };
  },

  /**
   * GET /api/v1/marketplace/listings
   * Retrieve published listings with filtering, search, and sorting.
   */
  getListings({
    category = 'ALL',
    search = '',
    priceModel = 'ALL',
    sort = 'newest'
  } = {}) {
    let result = inMemoryListings.filter(l => l.status === 'PUBLISHED');

    // Category filter
    if (category && category !== 'ALL') {
      result = result.filter(l => l.category === category);
    }

    // Price model filter
    if (priceModel && priceModel !== 'ALL') {
      result = result.filter(l => l.pricing?.model === priceModel);
    }

    // Search query filter (title, summary, skills, tags)
    if (search && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      result = result.filter(l => {
        const inTitle = l.title.toLowerCase().includes(q);
        const inSummary = l.summary.toLowerCase().includes(q);
        const inSkills = l.skills?.some(s => s.toLowerCase().includes(q));
        const inTags = l.tags?.some(t => t.toLowerCase().includes(q));
        return inTitle || inSummary || inSkills || inTags;
      });
    }

    // Sort options
    if (sort === 'price_asc') {
      result.sort((a, b) => (a.pricing?.amount || 0) - (b.pricing?.amount || 0));
    } else if (sort === 'price_desc') {
      result.sort((a, b) => (b.pricing?.amount || 0) - (a.pricing?.amount || 0));
    } else {
      // Default: newest
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return {
      success: true,
      data: result,
      meta: {
        total: result.length,
        category,
        search
      }
    };
  },

  /**
   * GET /api/v1/marketplace/listings/:listingId
   */
  getListingById(listingId) {
    const listing = inMemoryListings.find(l => l.id === listingId);
    if (!listing) {
      return {
        success: false,
        error: { code: 'NOT_FOUND', message: 'Listing not found.' }
      };
    }
    return { success: true, data: listing };
  },

  /**
   * GET /api/v1/marketplace/me/listings
   * Retrieve listings owned by the given user.
   */
  getUserListings(userId) {
    const listings = inMemoryListings.filter(l => l.ownerId === userId);
    return {
      success: true,
      data: listings,
      meta: { total: listings.length }
    };
  },

  /**
   * POST /api/v1/marketplace/listings
   * Create a new service listing.
   */
  createListing(payload, currentUser) {
    if (!currentUser || !currentUser.id) {
      return {
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' }
      };
    }

    const newListing = {
      id: `lst-${Date.now()}`,
      ownerId: currentUser.id,
      ownerName: currentUser.name || 'Anonymous Student',
      ownerDept: currentUser.department || 'General Engineering',
      ownerYear: currentUser.year || 'Student',
      title: payload.title.trim(),
      slug: payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + `-${Date.now().toString().slice(-4)}`,
      summary: payload.summary.trim(),
      description: payload.description.trim(),
      category: payload.category,
      tags: payload.tags || [],
      providerType: 'STUDENT',
      pricing: {
        model: payload.pricing?.model || 'FIXED',
        amount: Number(payload.pricing?.amount) || 0,
        currency: payload.pricing?.currency || 'INR',
        negotiable: Boolean(payload.pricing?.negotiable)
      },
      deliveryTime: {
        value: Number(payload.deliveryTime?.value) || 1,
        unit: payload.deliveryTime?.unit || 'DAYS'
      },
      skills: payload.skills || [],
      portfolioLinks: payload.portfolioLinks || [],
      availability: 'AVAILABLE',
      status: payload.publishNow ? 'PUBLISHED' : 'DRAFT',
      moderationStatus: 'APPROVED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: payload.publishNow ? new Date().toISOString() : null
    };

    inMemoryListings = [newListing, ...inMemoryListings];
    persistListings();

    return { success: true, data: newListing };
  },

  /**
   * PATCH /api/v1/marketplace/listings/:listingId
   * Update an owned service listing.
   */
  updateListing(listingId, updates, currentUser) {
    const index = inMemoryListings.findIndex(l => l.id === listingId);
    if (index === -1) {
      return {
        success: false,
        error: { code: 'NOT_FOUND', message: 'Listing not found.' }
      };
    }

    const existing = inMemoryListings[index];
    if (existing.ownerId !== currentUser.id && !currentUser.isModerator) {
      return {
        success: false,
        error: { code: 'FORBIDDEN', message: 'You do not own this listing.' }
      };
    }

    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    inMemoryListings[index] = updated;
    persistListings();

    return { success: true, data: updated };
  },

  /**
   * DELETE /api/v1/marketplace/listings/:listingId
   * Soft-archive a listing.
   */
  archiveListing(listingId, currentUser) {
    return this.updateListing(listingId, { status: 'ARCHIVED' }, currentUser);
  },

  /**
   * POST /api/v1/marketplace/listings/:listingId/publish
   * Publish a draft listing.
   */
  publishListing(listingId, currentUser) {
    return this.updateListing(
      listingId,
      { status: 'PUBLISHED', publishedAt: new Date().toISOString() },
      currentUser
    );
  },

  /**
   * POST /api/v1/marketplace/listings/:listingId/inquiries
   * Submit an inquiry to a service provider.
   */
  createInquiry(listingId, payload, currentUser) {
    if (!currentUser || !currentUser.id) {
      return {
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' }
      };
    }

    const listing = inMemoryListings.find(l => l.id === listingId);
    if (!listing) {
      return {
        success: false,
        error: { code: 'NOT_FOUND', message: 'Listing not found.' }
      };
    }

    // Strict self-inquiry prevention
    if (listing.ownerId === currentUser.id) {
      return {
        success: false,
        error: {
          code: 'SELF_INQUIRY_DENIED',
          message: 'You cannot submit an inquiry to your own service listing.'
        }
      };
    }

    const newInquiry = {
      id: `inq-${Date.now()}`,
      listingId: listing.id,
      listingTitle: listing.title,
      listingOwnerId: listing.ownerId,
      requesterId: currentUser.id,
      requesterName: currentUser.name || 'Anonymous Student',
      requesterDept: currentUser.department || 'Student',
      recipientId: listing.ownerId,
      recipientName: listing.ownerName,
      subject: payload.subject.trim(),
      message: payload.message.trim(),
      requirements: payload.requirements?.trim() || '',
      budget: {
        amount: Number(payload.budget?.amount) || 0,
        currency: payload.budget?.currency || 'INR'
      },
      requestedDeadline: payload.requestedDeadline || null,
      status: 'PENDING',
      conversationId: null,
      lastRespondedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    inMemoryInquiries = [newInquiry, ...inMemoryInquiries];
    persistInquiries();

    return { success: true, data: newInquiry };
  },

  /**
   * GET /api/v1/marketplace/me/inquiries/received
   */
  getReceivedInquiries(userId) {
    const list = inMemoryInquiries.filter(i => i.recipientId === userId);
    return { success: true, data: list, meta: { total: list.length } };
  },

  /**
   * GET /api/v1/marketplace/me/inquiries/sent
   */
  getSentInquiries(userId) {
    const list = inMemoryInquiries.filter(i => i.requesterId === userId);
    return { success: true, data: list, meta: { total: list.length } };
  },

  /**
   * PATCH /api/v1/marketplace/inquiries/:inquiryId
   * Provider responds to an inquiry (ACCEPT / DECLINE).
   */
  respondToInquiry(inquiryId, action, currentUser) {
    const index = inMemoryInquiries.findIndex(i => i.id === inquiryId);
    if (index === -1) {
      return {
        success: false,
        error: { code: 'NOT_FOUND', message: 'Inquiry not found.' }
      };
    }

    const inquiry = inMemoryInquiries[index];
    if (inquiry.recipientId !== currentUser.id) {
      return {
        success: false,
        error: { code: 'FORBIDDEN', message: 'Only the recipient can respond to this inquiry.' }
      };
    }

    if (inquiry.status !== 'PENDING') {
      return {
        success: false,
        error: { code: 'CONFLICT', message: `Inquiry is already ${inquiry.status}.` }
      };
    }

    const newStatus = action === 'ACCEPT' ? 'ACCEPTED' : 'DECLINED';
    const updated = {
      ...inquiry,
      status: newStatus,
      lastRespondedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      conversationId: newStatus === 'ACCEPTED' ? `conv-${Date.now().toString().slice(-6)}` : null
    };

    inMemoryInquiries[index] = updated;
    persistInquiries();

    return { success: true, data: updated };
  },

  /**
   * POST /api/v1/marketplace/inquiries/:inquiryId/cancel
   * Requester cancels their pending inquiry.
   */
  cancelInquiry(inquiryId, currentUser) {
    const index = inMemoryInquiries.findIndex(i => i.id === inquiryId);
    if (index === -1) {
      return {
        success: false,
        error: { code: 'NOT_FOUND', message: 'Inquiry not found.' }
      };
    }

    const inquiry = inMemoryInquiries[index];
    if (inquiry.requesterId !== currentUser.id) {
      return {
        success: false,
        error: { code: 'FORBIDDEN', message: 'Only the requester can cancel this inquiry.' }
      };
    }

    if (inquiry.status !== 'PENDING') {
      return {
        success: false,
        error: { code: 'CONFLICT', message: `Only pending inquiries can be cancelled.` }
      };
    }

    const updated = {
      ...inquiry,
      status: 'CANCELLED',
      updatedAt: new Date().toISOString()
    };

    inMemoryInquiries[index] = updated;
    persistInquiries();

    return { success: true, data: updated };
  }
};
