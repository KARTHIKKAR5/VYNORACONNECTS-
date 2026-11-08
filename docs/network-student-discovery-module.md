# Vynora Connect — Module 2: Campus Network & Student Discovery

## 1. Executive Summary

- **Module Name**: Campus Network & Student Discovery
- **Module ID**: Module 2
- **Module Owner**: Ram
- **Feature Branch**: `feature/ram-network`
- **Target Integration Branch**: `Development`
- **Architecture**: Modular Monolith Full-Stack (React 18 + Vite Frontend, Express.js Backend, MongoDB Atlas Mongoose Persistence)

Module 2 provides the core networking and student discovery foundation for the Vynora Connect platform, enabling students across colleges to discover peers, filter by college/department/skills, manage verified connection lifecycles, and maintain transparent, privacy-protected academic profiles.

---

## 2. Implemented Architecture & Structure

```text
VYNORA CONNECT — MODULE 2
├── client/
│   ├── legacy/                                        (Preserved original Campus Services HTML/CSS)
│   └── src/
│       ├── components/layout/AppShell.jsx             (Shared AppShell with Module 2 highlighted)
│       ├── services/apiClient.js                      (Central HTTP client targeting /api/v1)
│       ├── __tests__/networkModule.test.js            (17 automated frontend unit tests)
│       └── modules/network/
│           ├── components/                            (StudentCard, SearchBar, Filters, ProfileHeader, Badges)
│           ├── data/mockNetworkData.js                (Isolated development test profiles)
│           ├── hooks/                                 (useStudentSearch, useStudentProfile, useConnections)
│           ├── pages/                                 (DiscoverStudents, StudentProfile, MyProfile, EditProfile, Connections)
│           ├── schemas/profileSchema.js               (Client-side validation & character bounds)
│           ├── services/                              (networkApi.js, mockNetworkService.js)
│           └── utils/profileFormatters.js             (Study year, avatar initials, URL sanitization)
│
├── server/
│   ├── routes/networkRoutes.js                        (Unified route adapter)
│   ├── src/
│   │   ├── middleware/authMiddleware.js               (Strict req.user identity derivation)
│   │   ├── server.js                                  (Shared modular Express bootstrap)
│   │   └── modules/network/
│   │       ├── profile.model.js                       (Mongoose profile schema referencing User via userId)
│   │       ├── connection.model.js                    (Connection schema with normalized pairKey unique index)
│   │       ├── network.validation.js                  (Input validation, length limits, allowlist checks)
│   │       ├── network.policy.js                      (Server-side DTO stripping & actor authorization)
│   │       ├── network.service.js                     (Business logic & state machine transitions)
│   │       ├── network.controller.js                  (Standard envelope responses)
│   │       └── network.routes.js                      (Express router for /api/v1/network)
│   └── __tests__/
│       ├── networkBackend.test.js                     (17 backend validation, security & policy tests)
│       ├── networkHttpIntegration.test.js             (10 Express route & middleware integration tests)
│       └── helpers/expressTestClient.js               (In-memory Express dispatch harness)
│
└── docs/
    ├── network-student-discovery-module.md            (Module specification & architecture)
    └── network-student-discovery-api.md               (Complete 13-endpoint API contract)
```

---

## 3. Database Schema Specification

### Profile Collection (`Profile`)
- `userId` (ObjectId, ref: 'User', unique, indexed): Unique reference to central User account.
- `college` (String, max: 120, indexed): Verified student college.
- `branch` (String, max: 80): Department / engineering branch.
- `studyYear` (Number, min: 1, max: 5, indexed): Academic study year.
- `bio` (String, max: 300): Short self-description.
- `skills` (Array of Strings, max: 15 items, max 30 chars each, indexed): Technical skill tags.
- `interests` (Array of Strings, max: 10 items, max 30 chars each): Topics and areas of interest.
- `links` (Object):
  - `github` (String): Validated `http:`/`https:` URL.
  - `linkedin` (String): Validated `http:`/`https:` URL.
  - `website` (String): Validated `http:`/`https:` URL.
- `visibility` (Object):
  - `profile` (Enum: `'students'`, `'connections'`, `'private'`).
  - `showProjects` (Boolean, default: true).
  - `showLinks` (Boolean, default: true).

### Connection Collection (`Connection`)
- `requesterId` (ObjectId, ref: 'User', indexed): Student initiating request.
- `recipientId` (ObjectId, ref: 'User', indexed): Target student.
- `pairKey` (String, required): Normalized deterministic sorted pair `[requesterId, recipientId].sort().join(':')`.
- `status` (Enum: `'pending'`, `'accepted'`, `'rejected'`, `'cancelled'`, indexed).
- `respondedAt` (Date): Timestamp when recipient responded or request was cancelled.
- **Database Engine Uniqueness Guarantee**:
  Partial unique index on `{ pairKey: 1 }` where `{ status: { $in: ['pending', 'accepted'] } }`. Guarantees that only ONE active relationship can exist for any student pair in either direction.

---

## 4. Key Security & Privacy Guarantees

1. **Strict Identity Derivation**:
   - `authMiddleware.js` derives identity exclusively from `req.user?._id || req.user?.id`.
   - Never trusts client headers (`x-user-id`) or request bodies.
2. **Server-Side Allowlist Enforcement**:
   - `FORBIDDEN_UPDATE_FIELDS` (`role`, `isVerified`, `email`, `passwordHash`, `_id`, `moderationStatus`) cannot be altered by users.
3. **Zero Field Leakage in Public DTOs**:
   - Passwords, hashes, emails, phone numbers, and moderation notes are completely stripped in `toSafeProfileDTO`.
4. **Actor Authorization Rules**:
   - Only the recipient can accept or reject requests.
   - Only the requester can cancel requests.
   - Only participants can remove connections.
   - Client-controlled hard deletion is disabled; safe soft status transitions (`status: 'cancelled'`) are enforced.

---

## 5. Verification & Test Summary

- **Total Full-Stack Tests**: **44 automated tests passing** (0 failures).
  - 17 Frontend Unit Tests (`client/src/__tests__/networkModule.test.js`)
  - 17 Backend Security & Logic Tests (`server/__tests__/networkBackend.test.js`)
  - 10 Express Route & Middleware Integration Tests (`server/__tests__/networkHttpIntegration.test.js`)
- **Vite Production Build**: Passed in 2.49s (0 errors, 0 warnings).

