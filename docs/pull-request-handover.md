# GitHub Pull Request Handover Documentation

**Pull Request Title**: `feat(network): implement Student Network & Profile Module (Module 2)`  
**Source Branch**: `feature/ram-network`  
**Target Branch**: `Development`  
**Module Owner**: Ram  
**Reviewers**: Karthik (Lead Architect), Revanth (Trust & Safety / Backend Maintainer), Varshitha (Teams & Projects)  

---

## 1. Description & Overview

This PR delivers the complete full-stack implementation of **Module 2: Campus Network & Student Discovery** for the Vynora Connect platform.

The module allows students across colleges to:
1. **Discover Peers**: Cross-campus student directory searchable by name, college, department, and technical skills with filters for college, branch, study year, skill chips, and interest chips.
2. **View Profiles**: Privacy-safe profile detail views with skills, interests, portfolio links, and mutual connection status.
3. **Manage Profiles**: Dedicated self-profile manager with transparent completeness checklist, bio character counters, tag adder/remover, and server-side allowlisted updates.
4. **Configure Privacy**: Control visibility levels (`students`, `connections`, `private`) and toggle external links/project affiliations with server-enforced DTO stripping.
5. **Manage Connections**: Complete lifecycle state machine for sending, receiving, accepting, declining, cancelling, and removing connections with database engine-level duplicate prevention.
6. **Safety Triggers**: Confidential user reporting and blocking dialogs prepared for integration with the shared Trust & Safety module.

---

## 2. Key Architecture & Security Highlights

- **Shared Modular Monolith**: Implemented cleanly within the existing project structure without creating duplicate Express servers, separate database instances, or competing CSS systems.
- **Strict Identity Derivation**: Authentication derives actor identity strictly from `req.user?._id || req.user?.id`. Never trusts client-supplied headers (`x-user-id`) or request bodies.
- **Database Engine Uniqueness Guarantee**: Enforces mutual pair uniqueness at the database engine level via a deterministic `pairKey: [idA, idB].sort().join(':')` backed by a partial unique index on `{ pairKey: 1 }` filtered by `{ status: { $in: ['pending', 'accepted'] } }`. Prevents concurrent reverse duplicate requests across distributed cluster nodes.
- **Client Hard Deletion Disabled**: Connection removals execute a soft status transition (`status: 'cancelled'`, `respondedAt: new Date()`) to preserve audit trails.
- **Zero Sensitive Data Leakage**: Passwords, hashes, emails, phone numbers, and moderation notes are strictly excluded from all public DTOs.
- **Legacy Files Preserved**: Original static files are preserved in `client/legacy/index.html` and `client/legacy/style.css`.

---

## 3. Files Created & Modified

### Shared / Root Files Modified:
- `.gitignore`: Added `dist/`, `client/dist/`, `*.log` ignore rules.
- `package.json`: Configured workspace scripts (`dev`, `build`, `test`, `test:backend`, `test:all`).
- `client/index.html`: Vite root mount template (`#root`) with Jakarta Sans and JetBrains Mono fonts.

### Client Module Files (`client/src/`):
- `client/package.json` & `client/package-lock.json`: React 18, Vite 5, Lucide-React dependencies.
- `client/vite.config.js`: Vite configuration with `/api` proxy target.
- `client/legacy/index.html` & `client/legacy/style.css`: Preserved copies of original Campus Services files.
- `client/src/main.jsx`: React 18 DOM bootstrap.
- `client/src/index.css`: Vynora Obsidian Design Tokens (`--bg-main: #090909`, `--accent-primary: #6366F1`).
- `client/src/App.jsx`: Hash routing and live backend probe status synchronization.
- `client/src/components/layout/AppShell.jsx`: Shared navigation layout with Module 2 highlighted.
- `client/src/services/apiClient.js`: Central HTTP client targeting `/api/v1` with error wrapping and timeout safety.
- `client/src/__tests__/networkModule.test.js`: 17 automated frontend unit tests.
- `client/src/modules/network/schemas/profileSchema.js`: Client-side validation schema and limits.
- `client/src/modules/network/utils/profileFormatters.js`: Formatting helpers for study years, initials, and URLs.
- `client/src/modules/network/data/mockNetworkData.js`: Isolated development test profiles.
- `client/src/modules/network/services/mockNetworkService.js`: In-memory development fallback adapter.
- `client/src/modules/network/services/networkApi.js`: Central Network API client with health probe.
- `client/src/modules/network/components/`: `StudentCard`, `StudentSearchBar`, `StudentFilters`, `ProfileHeader`, `ConnectionActionButton`, `ConnectionRequestCard`, `SkillTag`, `VerificationBadge`, `PrivacySettingsForm`, `ReportUserDialog`, `BlockUserDialog`.
- `client/src/modules/network/hooks/`: `useStudentSearch`, `useStudentProfile`, `useConnections`.
- `client/src/modules/network/pages/`: `DiscoverStudentsPage`, `StudentProfilePage`, `MyProfilePage`, `EditProfilePage`, `ConnectionsPage`.

### Server Backend Files (`server/`):
- `server/package.json` & `server/package-lock.json`: Backend dependencies (`express`, `mongoose`, `cors`, `dotenv`).
- `server/src/server.js`: Shared modular Express bootstrap.
- `server/src/middleware/authMiddleware.js`: Strict `req.user` authentication derivation middleware.
- `server/routes/networkRoutes.js` & `server/src/modules/network/network.routes.js`: Express router mapping all 13 endpoints under `/api/v1/network`.
- `server/src/modules/network/profile.model.js`: Mongoose Profile model referencing User via `userId`.
- `server/src/modules/network/connection.model.js`: Mongoose Connection model with `pairKey` partial unique index.
- `server/src/modules/network/network.validation.js`: Input validation, length bounds, and allowlist enforcement.
- `server/src/modules/network/network.policy.js`: Server-side DTO stripping and actor authorization.
- `server/src/modules/network/network.service.js`: Business logic and atomic state machine transitions.
- `server/src/modules/network/network.controller.js`: Express controllers returning standard response envelopes.
- `server/__tests__/networkBackend.test.js`: 17 backend security, validation, and policy tests.
- `server/__tests__/networkHttpIntegration.test.js`: 10 Express route and middleware integration tests.
- `server/__tests__/helpers/expressTestClient.js`: In-memory Express dispatch test harness.

### Documentation Files (`docs/`):
- `docs/network-student-discovery-module.md`: Comprehensive module overview and architecture.
- `docs/network-student-discovery-api.md`: 13-endpoint API contract specification.
- `docs/pull-request-handover.md`: This pull request handover document.

---

## 4. API Endpoints Catalog (`/api/v1/network`)

| Method | Endpoint | Auth | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/students` | Optional | Search & filter students across colleges with server-side pagination |
| `GET` | `/students/:userId` | Optional | Retrieve student profile (enforces visibility: `students`, `connections`, `private`) |
| `GET` | `/me/profile` | Required | Retrieve authenticated student's profile |
| `PUT` | `/me/profile` | Required | Update allowed profile fields (rejects role, email, isVerified modifications) |
| `PUT` | `/me/privacy` | Required | Update visibility preferences (`profile`, `showProjects`, `showLinks`) |
| `GET` | `/connections` | Required | Retrieve list of accepted connections |
| `GET` | `/requests/received` | Required | Retrieve list of incoming pending connection requests |
| `GET` | `/requests/sent` | Required | Retrieve list of outgoing pending connection requests |
| `POST` | `/requests` | Required | Send a connection request (rejects self-connections and active duplicates) |
| `PATCH` | `/requests/:id/accept` | Required | Accept an incoming connection request (recipient only) |
| `PATCH` | `/requests/:id/reject` | Required | Decline an incoming connection request (recipient only) |
| `PATCH` | `/requests/:id/cancel` | Required | Cancel an outgoing connection request (requester only) |
| `DELETE` | `/connections/:id` | Required | Remove an accepted connection (executes safe soft transition) |

---

## 5. Database Schema & Index Strategy

### Profile Schema (`Profile`)
- `userId` (ObjectId, ref: 'User', unique, indexed): Unique reference to central User account.
- `college` (String, max: 120, indexed): Verified student college.
- `branch` (String, max: 80): Department / engineering branch.
- `studyYear` (Number, min: 1, max: 5, indexed): Academic study year.
- `bio` (String, max: 300): Short self-description.
- `skills` (Array of Strings, max: 15 items, max 30 chars each, indexed): Technical skill tags.
- `interests` (Array of Strings, max: 10 items, max 30 chars each): Topics and areas of interest.
- `links` (Object): Validated `github`, `linkedin`, `website` URLs.
- `visibility` (Object): `profile` (`'students'`, `'connections'`, `'private'`), `showProjects`, `showLinks`.

### Connection Schema (`Connection`)
- `requesterId` (ObjectId, ref: 'User', indexed): Initiating student.
- `recipientId` (ObjectId, ref: 'User', indexed): Target student.
- `pairKey` (String, required): Normalized deterministic sorted pair `[requesterId, recipientId].sort().join(':')`.
- `status` (Enum: `'pending'`, `'accepted'`, `'rejected'`, `'cancelled'`, indexed).
- `respondedAt` (Date): Response timestamp.
- **Indexes**:
  - `{ requesterId: 1, status: 1, createdAt: -1 }`
  - `{ recipientId: 1, status: 1, createdAt: -1 }`
  - Partial Unique Index: `{ pairKey: 1 }` where `{ status: { $in: ['pending', 'accepted'] } }`.

---

## 6. Environment Variables (NAMES ONLY)

The module conforms to standard Vynora backend and frontend configurations:

### Backend (`server/.env`):
- `PORT` (e.g. `5000`)
- `CLIENT_ORIGIN` (e.g. `http://localhost:5173`)
- `MONGODB_URI` (MongoDB Atlas connection string)
- `JWT_SECRET` (For upstream shared authentication token verification)

### Frontend (`client/.env`):
- `VITE_API_BASE_URL` (Defaults to `/api/v1`)

---

## 7. Verification & Automated Test Results

### Automated Tests Execution:
```bash
npm run test:all
```

**Results**:
- **Frontend Unit Tests**: 17 tests passed (0 failures)
- **Backend Security & Policy Tests**: 17 tests passed (0 failures)
- **Express Route & Middleware Integration Tests**: 10 tests passed (0 failures)
- **Total: 44 automated tests passing (0 failures).**

### Production Build Execution:
```bash
npm run build
```
- **Output**: Built in 4.05s, 0 errors, 0 warnings.
- Output artifacts: `dist/index.html` (0.76 kB), `dist/assets/index-*.css` (18.59 kB), `dist/assets/index-*.js` (254.38 kB).

---

## 8. Local Setup & Manual Testing Instructions

### Step 1: Install Dependencies
```bash
npm --prefix client install
npm --prefix server install
```

### Step 2: Run Full-Stack Tests
```bash
npm run test:all
```

### Step 3: Start Development Servers
In terminal 1 (Frontend):
```bash
npm --prefix client run dev
```
In terminal 2 (Backend):
```bash
npm --prefix server run dev
```
Open `http://localhost:5173` in your browser.

### Step 4: Manual Feature Walkthrough
1. **Student Discovery**: Navigate to `#/network`. Type search queries (e.g. "Varshitha", "Python", "IIT"). Select filter dropdowns and click skill tags. Observe real-time filtering and pagination.
2. **Student Profile**: Click on any student card to navigate to `#/students/:userId`. Verify display of college, branch, study year, bio, and skill chips.
3. **Connection Lifecycle**:
   - On an unconnected student, click **Connect**. Status changes to **Pending**.
   - Navigate to `#/network/connections` and switch to the **Sent Requests** tab to verify the outgoing request. Click **Cancel Request** to withdraw.
   - Switch to **Received Requests** tab. Click **Accept** or **Decline**.
   - Switch to **My Connections** tab to view accepted connections. Click **Remove** and verify confirmation prompt.
4. **Self Profile & Editing**:
   - Navigate to `#/profile`. Review the Profile Completeness Checklist.
   - Click **Edit Profile** (`#/profile/edit`). Modify bio (observe character counter $\le 300$), add a new skill tag, and click **Save Profile**.
   - Modify a field and click **Cancel** to verify the "Discard Unsaved Changes?" modal.
5. **Privacy Controls**:
   - Switch to the **Privacy & Visibility** tab (`#/profile/privacy`). Select visibility levels (`students`, `connections`, `private`) and toggle link/project visibility.

---

## 9. Pending Cross-Module Dependencies & Deferred Items

The following items are isolated in our codebase and await teammate merges:
1. **Central JWT Auth Verification**: Revanth (Module 8 maintainer) owns central JWT token decoding. Our `authMiddleware.js` is built to consume `req.user` directly once central auth is mounted upstream.
2. **Shared Safety Endpoints**: Calling live `POST /api/v1/safety/reports` and `POST /api/v1/safety/blocks` is ready for connection once Revanth merges Module 8.
3. **Unverified Student Connection Policy**: Product Owner confirmation pending on whether unverified students can initiate connection requests (hook isolated in `network.policy.js`).

---

## 10. Pull Request Checklist

- [x] Tested full-stack locally with all 44 automated tests passing.
- [x] Production build passes with zero errors and zero warnings.
- [x] Legacy files preserved in `client/legacy/`.
- [x] No secrets, passwords, or credentials committed.
- [x] No unrelated teammate files modified.
- [x] Database models, indexes, and constraints documented.
- [x] API contract fully documented in `docs/network-student-discovery-api.md`.
- [x] Ready for merge into `Development`.

