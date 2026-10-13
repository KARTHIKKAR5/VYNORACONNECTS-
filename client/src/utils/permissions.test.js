/**
 * @file permissions.test.js
 * @description Automated verification test suite for RBAC and ABAC permissions utilities.
 * Run via `node src/utils/permissions.test.js` or `npm test`.
 */

import {
  ROLES,
  ACTIONS,
  canPerformAction,
  isProjectOwner,
  isListingOwner,
  isInquiryParticipant,
  isInquiryRecipient,
  isInquiryRequester,
  canPerformMarketplaceAction
} from './permissions.js';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

console.log('====================================================');
console.log('🧪 RUNNING EXTENDED PERMISSIONS VERIFICATION SUITE');
console.log('====================================================\n');

// 1. Test Project Roles (Day 1 Regression)
console.log('--- 1. Testing Project Roles (Day 1 Preserved) ---');
assert(canPerformAction(ROLES.OWNER, ACTIONS.EDIT_PROJECT), 'OWNER can EDIT_PROJECT');
assert(canPerformAction(ROLES.OWNER, ACTIONS.MANAGE_MEMBERS), 'OWNER can MANAGE_MEMBERS');
assert(canPerformAction(ROLES.OWNER, ACTIONS.TRANSFER_OWNERSHIP), 'OWNER can TRANSFER_OWNERSHIP');
assert(canPerformAction(ROLES.OWNER, ACTIONS.DELETE_PROJECT), 'OWNER can DELETE_PROJECT');
assert(canPerformAction(ROLES.ADMIN, ACTIONS.EDIT_PROJECT), 'ADMIN can EDIT_PROJECT');
assert(!canPerformAction(ROLES.ADMIN, ACTIONS.TRANSFER_OWNERSHIP), 'ADMIN CANNOT TRANSFER_OWNERSHIP');
assert(!canPerformAction(ROLES.ADMIN, ACTIONS.DELETE_PROJECT), 'ADMIN CANNOT DELETE_PROJECT');
assert(canPerformAction(ROLES.MEMBER, ACTIONS.REVIEW_REQUESTS), 'MEMBER can REVIEW_REQUESTS');
assert(!canPerformAction(ROLES.MEMBER, ACTIONS.EDIT_PROJECT), 'MEMBER CANNOT EDIT_PROJECT');
assert(!canPerformAction(ROLES.VIEWER, ACTIONS.EDIT_PROJECT), 'VIEWER CANNOT EDIT_PROJECT');

// 2. Test Base Marketplace RBAC Actions
console.log('\n--- 2. Testing Base Marketplace RBAC Actions ---');
assert(canPerformAction(ROLES.OWNER, ACTIONS.MARKETPLACE_LISTING_CREATE), 'OWNER role can CREATE listing');
assert(canPerformAction(ROLES.ADMIN, ACTIONS.MARKETPLACE_LISTING_CREATE), 'ADMIN role can CREATE listing');
assert(canPerformAction(ROLES.MEMBER, ACTIONS.MARKETPLACE_LISTING_CREATE), 'MEMBER role can CREATE listing');
assert(!canPerformAction(ROLES.VIEWER, ACTIONS.MARKETPLACE_LISTING_CREATE), 'VIEWER role CANNOT CREATE listing');
assert(canPerformAction(ROLES.VIEWER, ACTIONS.MARKETPLACE_LISTING_READ), 'VIEWER role can READ listing');
assert(canPerformAction(ROLES.ADMIN, ACTIONS.MARKETPLACE_LISTING_MODERATE), 'ADMIN role has MODERATE permission');
assert(!canPerformAction(ROLES.MEMBER, ACTIONS.MARKETPLACE_LISTING_MODERATE), 'MEMBER role CANNOT MODERATE');

// 3. Test Denial by Default for Unknowns
console.log('\n--- 3. Testing Denial by Default ---');
assert(!canPerformAction('GUEST', ACTIONS.MARKETPLACE_LISTING_CREATE), 'Unknown role "GUEST" is DENIED');
assert(!canPerformAction(ROLES.OWNER, 'FAKE_ACTION'), 'Unknown action is DENIED');
assert(!canPerformAction(null, ACTIONS.MARKETPLACE_LISTING_READ), 'Null role is DENIED');
assert(!canPerformAction(ROLES.OWNER, null), 'Null action is DENIED');
assert(!canPerformAction('', ''), 'Empty strings are DENIED');

// 4. Test Ownership & Participant Helpers
console.log('\n--- 4. Testing Resource Ownership & Participant Helpers ---');
assert(isListingOwner('usr_100', 'usr_100'), 'isListingOwner returns TRUE for matching ID');
assert(!isListingOwner('usr_100', 'usr_200'), 'isListingOwner returns FALSE for mismatched ID');
assert(!isListingOwner(null, 'usr_100'), 'isListingOwner returns FALSE for null user');

const mockInquiry = {
  id: 'inq_01',
  listingId: 'lst_01',
  requesterId: 'usr_client_01',
  recipientId: 'usr_provider_02',
  status: 'PENDING'
};

assert(isInquiryParticipant('usr_client_01', mockInquiry), 'Requester is inquiry participant');
assert(isInquiryParticipant('usr_provider_02', mockInquiry), 'Recipient is inquiry participant');
assert(!isInquiryParticipant('usr_stranger_03', mockInquiry), 'Stranger is NOT inquiry participant');
assert(isInquiryRecipient('usr_provider_02', mockInquiry), 'Provider is inquiry recipient');
assert(!isInquiryRecipient('usr_client_01', mockInquiry), 'Client is NOT inquiry recipient');
assert(isInquiryRequester('usr_client_01', mockInquiry), 'Client is inquiry requester');
assert(!isInquiryRequester('usr_provider_02', mockInquiry), 'Provider is NOT inquiry requester');

// 5. Test Marketplace ABAC Matrix Logic
console.log('\n--- 5. Testing Marketplace ABAC Matrix Logic ---');
const provider = { id: 'usr_provider_02', isModerator: false };
const client = { id: 'usr_client_01', isModerator: false };
const stranger = { id: 'usr_stranger_03', isModerator: false };
const moderator = { id: 'usr_admin_99', isModerator: true };

const listingPublished = {
  id: 'lst_01',
  ownerId: 'usr_provider_02',
  status: 'PUBLISHED'
};

const listingDraft = {
  id: 'lst_02',
  ownerId: 'usr_provider_02',
  status: 'DRAFT'
};

// Listing Reading
assert(canPerformMarketplaceAction(stranger, ACTIONS.MARKETPLACE_LISTING_READ, listingPublished), 'Public can read PUBLISHED listing');
assert(!canPerformMarketplaceAction(stranger, ACTIONS.MARKETPLACE_LISTING_READ, listingDraft), 'Stranger CANNOT read DRAFT listing');
assert(canPerformMarketplaceAction(provider, ACTIONS.MARKETPLACE_LISTING_READ, listingDraft), 'Owner CAN read own DRAFT listing');
assert(canPerformMarketplaceAction(moderator, ACTIONS.MARKETPLACE_LISTING_READ, listingDraft), 'Moderator CAN read DRAFT listing');

// Listing Updating & Archiving
assert(canPerformMarketplaceAction(provider, ACTIONS.MARKETPLACE_LISTING_UPDATE, listingPublished), 'Owner can UPDATE listing');
assert(!canPerformMarketplaceAction(client, ACTIONS.MARKETPLACE_LISTING_UPDATE, listingPublished), 'Non-owner CANNOT update listing');
assert(!canPerformMarketplaceAction(moderator, ACTIONS.MARKETPLACE_LISTING_UPDATE, listingPublished), 'Moderator CANNOT update listing details');
assert(canPerformMarketplaceAction(provider, ACTIONS.MARKETPLACE_LISTING_ARCHIVE, listingPublished), 'Owner can ARCHIVE listing');
assert(canPerformMarketplaceAction(moderator, ACTIONS.MARKETPLACE_LISTING_ARCHIVE, listingPublished), 'Moderator can ARCHIVE listing');
assert(!canPerformMarketplaceAction(stranger, ACTIONS.MARKETPLACE_LISTING_ARCHIVE, listingPublished), 'Stranger CANNOT archive listing');

// Self-Inquiry Prevention
assert(canPerformMarketplaceAction(client, ACTIONS.MARKETPLACE_INQUIRY_CREATE, listingPublished), 'Peer student can INQUIRE on listing');
assert(!canPerformMarketplaceAction(provider, ACTIONS.MARKETPLACE_INQUIRY_CREATE, listingPublished), 'Owner strictly CANNOT inquire on own listing (Self-Inquiry blocked)');

// Inquiry Actions
assert(canPerformMarketplaceAction(provider, ACTIONS.MARKETPLACE_INQUIRY_RESPOND, mockInquiry), 'Recipient can RESPOND to pending inquiry');
assert(!canPerformMarketplaceAction(client, ACTIONS.MARKETPLACE_INQUIRY_RESPOND, mockInquiry), 'Requester CANNOT respond/accept own inquiry');
assert(canPerformMarketplaceAction(client, ACTIONS.MARKETPLACE_INQUIRY_CANCEL, mockInquiry), 'Requester can CANCEL pending inquiry');
assert(!canPerformMarketplaceAction(provider, ACTIONS.MARKETPLACE_INQUIRY_CANCEL, mockInquiry), 'Recipient CANNOT cancel inquiry (Must decline instead)');

// Inquiry Status Transition Guard
const acceptedInquiry = { ...mockInquiry, status: 'ACCEPTED' };
assert(!canPerformMarketplaceAction(client, ACTIONS.MARKETPLACE_INQUIRY_CANCEL, acceptedInquiry), 'Requester CANNOT cancel non-pending inquiry');
assert(!canPerformMarketplaceAction(provider, ACTIONS.MARKETPLACE_INQUIRY_RESPOND, acceptedInquiry), 'Recipient CANNOT respond to already accepted inquiry');

console.log('\n====================================================');
console.log(`SUMMARY: ${passedTests}/${totalTests} tests passed (${failedTests} failed)`);
console.log('====================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
