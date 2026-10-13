/**
 * @file permissions.test.js
 * @description Automated verification test suite for permissions utility.
 * Can be run via `node src/utils/permissions.test.js` or `npm test`.
 */

import { ROLES, ACTIONS, canPerformAction, isProjectOwner } from './permissions.js';

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
console.log('🧪 RUNNING PERMISSION UTILITY VERIFICATION SUITE');
console.log('====================================================\n');

// 1. Test OWNER permissions (Must have all 6 actions)
console.log('--- 1. Testing OWNER Permissions ---');
assert(canPerformAction(ROLES.OWNER, ACTIONS.EDIT_PROJECT), 'OWNER can EDIT_PROJECT');
assert(canPerformAction(ROLES.OWNER, ACTIONS.MANAGE_MEMBERS), 'OWNER can MANAGE_MEMBERS');
assert(canPerformAction(ROLES.OWNER, ACTIONS.TRANSFER_OWNERSHIP), 'OWNER can TRANSFER_OWNERSHIP');
assert(canPerformAction(ROLES.OWNER, ACTIONS.DELETE_PROJECT), 'OWNER can DELETE_PROJECT');
assert(canPerformAction(ROLES.OWNER, ACTIONS.REVIEW_REQUESTS), 'OWNER can REVIEW_REQUESTS');
assert(canPerformAction(ROLES.OWNER, ACTIONS.CHANGE_RECRUITING), 'OWNER can CHANGE_RECRUITING');

// 2. Test ADMIN permissions (Can manage/edit/review/recruiting, CANNOT transfer or delete)
console.log('\n--- 2. Testing ADMIN Permissions ---');
assert(canPerformAction(ROLES.ADMIN, ACTIONS.EDIT_PROJECT), 'ADMIN can EDIT_PROJECT');
assert(canPerformAction(ROLES.ADMIN, ACTIONS.MANAGE_MEMBERS), 'ADMIN can MANAGE_MEMBERS');
assert(canPerformAction(ROLES.ADMIN, ACTIONS.REVIEW_REQUESTS), 'ADMIN can REVIEW_REQUESTS');
assert(canPerformAction(ROLES.ADMIN, ACTIONS.CHANGE_RECRUITING), 'ADMIN can CHANGE_RECRUITING');
assert(!canPerformAction(ROLES.ADMIN, ACTIONS.TRANSFER_OWNERSHIP), 'ADMIN CANNOT TRANSFER_OWNERSHIP');
assert(!canPerformAction(ROLES.ADMIN, ACTIONS.DELETE_PROJECT), 'ADMIN CANNOT DELETE_PROJECT');

// 3. Test MEMBER permissions (Restricted, can only REVIEW_REQUESTS)
console.log('\n--- 3. Testing MEMBER Permissions ---');
assert(canPerformAction(ROLES.MEMBER, ACTIONS.REVIEW_REQUESTS), 'MEMBER can REVIEW_REQUESTS');
assert(!canPerformAction(ROLES.MEMBER, ACTIONS.EDIT_PROJECT), 'MEMBER CANNOT EDIT_PROJECT');
assert(!canPerformAction(ROLES.MEMBER, ACTIONS.MANAGE_MEMBERS), 'MEMBER CANNOT MANAGE_MEMBERS');
assert(!canPerformAction(ROLES.MEMBER, ACTIONS.TRANSFER_OWNERSHIP), 'MEMBER CANNOT TRANSFER_OWNERSHIP');
assert(!canPerformAction(ROLES.MEMBER, ACTIONS.DELETE_PROJECT), 'MEMBER CANNOT DELETE_PROJECT');
assert(!canPerformAction(ROLES.MEMBER, ACTIONS.CHANGE_RECRUITING), 'MEMBER CANNOT CHANGE_RECRUITING');

// 4. Test VIEWER permissions (Denied all administrative/management actions)
console.log('\n--- 4. Testing VIEWER Permissions ---');
assert(!canPerformAction(ROLES.VIEWER, ACTIONS.EDIT_PROJECT), 'VIEWER CANNOT EDIT_PROJECT');
assert(!canPerformAction(ROLES.VIEWER, ACTIONS.MANAGE_MEMBERS), 'VIEWER CANNOT MANAGE_MEMBERS');
assert(!canPerformAction(ROLES.VIEWER, ACTIONS.TRANSFER_OWNERSHIP), 'VIEWER CANNOT TRANSFER_OWNERSHIP');
assert(!canPerformAction(ROLES.VIEWER, ACTIONS.DELETE_PROJECT), 'VIEWER CANNOT DELETE_PROJECT');
assert(!canPerformAction(ROLES.VIEWER, ACTIONS.REVIEW_REQUESTS), 'VIEWER CANNOT REVIEW_REQUESTS');
assert(!canPerformAction(ROLES.VIEWER, ACTIONS.CHANGE_RECRUITING), 'VIEWER CANNOT CHANGE_RECRUITING');

// 5. Test Unknown Roles & Unknown Actions (Must be strictly denied by default)
console.log('\n--- 5. Testing Denial by Default (Unknown Roles & Actions) ---');
assert(!canPerformAction('GUEST', ACTIONS.EDIT_PROJECT), 'Unknown role "GUEST" is DENIED');
assert(!canPerformAction('SUPER_ADMIN', ACTIONS.DELETE_PROJECT), 'Unknown role "SUPER_ADMIN" is DENIED');
assert(!canPerformAction(ROLES.OWNER, 'NON_EXISTENT_ACTION'), 'Unknown action "NON_EXISTENT_ACTION" is DENIED');
assert(!canPerformAction('', ACTIONS.EDIT_PROJECT), 'Empty string role is DENIED');
assert(!canPerformAction(ROLES.OWNER, ''), 'Empty string action is DENIED');
assert(!canPerformAction(null, ACTIONS.EDIT_PROJECT), 'Null role is DENIED');
assert(!canPerformAction(ROLES.OWNER, null), 'Null action is DENIED');
assert(!canPerformAction(undefined, undefined), 'Undefined inputs are DENIED');

// 6. Test isProjectOwner Helper
console.log('\n--- 6. Testing isProjectOwner Helper ---');
assert(isProjectOwner('usr_101', 'usr_101'), 'Matching string user IDs returns TRUE');
assert(isProjectOwner(101, 101), 'Matching numeric user IDs returns TRUE');
assert(isProjectOwner('101', 101), 'Matching coerced string and numeric IDs returns TRUE');
assert(!isProjectOwner('usr_101', 'usr_999'), 'Mismatched user IDs returns FALSE');
assert(!isProjectOwner(null, 'usr_101'), 'Null userId returns FALSE');
assert(!isProjectOwner('usr_101', null), 'Null projectOwnerId returns FALSE');
assert(!isProjectOwner(undefined, 'usr_101'), 'Undefined userId returns FALSE');
assert(!isProjectOwner('', ''), 'Empty strings returns FALSE');

console.log('\n====================================================');
console.log(`SUMMARY: ${passedTests}/${totalTests} tests passed (${failedTests} failed)`);
console.log('====================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
