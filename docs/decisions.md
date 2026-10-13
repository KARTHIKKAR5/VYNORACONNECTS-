# Vynora Campus+ Architecture Decisions & Shared Data Contract

**Date:** Day 2 — Tuesday, October 13  
**Status:** Approved Consensus & Open Choices Draft  
**Target Repository:** Vynora Campus+ (MERN Stack)

---

## 1. Executive Summary & Goals

This document records the foundational system design decisions, module boundaries, shared data entity contracts, and common API conventions agreed upon for **Vynora Campus+**.

The primary objective for Day 2 is to align on:
1. A unified **frontend-backend-database** topology (Single React SPA + Single Express API + MongoDB Atlas).
2. Well-defined **shared data models and boundaries** across student profiles, networking, projects, events, opportunities, messaging, services, moderation, and activities.
3. Standardized **communication conventions** (Auth, Error Handling, Timestamps, Identifiers, and Pagination).
4. Documentation of **open / unresolved architectural choices** to be finalized as development progresses.

---

## 2. Technology Stack & Topology Consensus

```
┌────────────────────────────────────────────────────────┐
│             Single Frontend Client (SPA)               │
│               React + Vite + Modern CSS                │
└───────────────────────────┬────────────────────────────┘
                            │ HTTPS / REST (v1) + WSS
                            ▼
┌────────────────────────────────────────────────────────┐
│             Single Express Backend API                 │
│         Node.js + Express.js + Mongoose                │
│    Route Modules: Auth, Users, Dashboard, Events...    │
└──────────────┬──────────────────────────┬──────────────┘
               │                          │
               ▼                          ▼
┌──────────────────────────────┐  ┌──────────────────────┐
│     MongoDB Atlas (Cloud)    │  │  Socket.IO Server    │
│  Mongoose ODM Schemas & Rel  │  │  (Real-Time Feeds)   │
└──────────────────────────────┘  └──────────────────────┘
```

### 2.1 Unified Frontend
* **Framework:** React with Vite build tooling.
* **Component Strategy:** Data-driven presentation components with separated state/hook layers.
* **Styling:** CSS variables design tokens (`client/src/index.css`) prioritizing clean glassmorphism, campus badges, dark-mode capability, and responsive layout.
* **State Management:** React Context API / Custom hooks for localized module state, transitioning to TanStack Query (React Query) for server-state caching and background synchronization.

### 2.2 Unified Express Backend
* **Runtime:** Node.js (LTS) with Express.js.
* **Routing Structure:** Explicit modular routers organized under `/api/v1/*` (e.g., `/api/v1/auth`, `/api/v1/users`, `/api/v1/dashboard`, `/api/v1/events`, `/api/v1/projects`, `/api/v1/connections`).
* **Middleware Pipeline:**
  1. Security & CORS (`helmet`, `cors` with origin whitelisting).
  2. Request body parsing (`express.json()`, `express.urlencoded()`).
  3. Structured request logging (`morgan` / custom logger).
  4. Authentication & Context hydration (`authenticateJWT` populating `req.user`).
  5. Route handlers & domain controllers.
  6. Centralized error handling middleware (`errorHandler`).

### 2.3 MongoDB Atlas Architecture
* **Hosting:** MongoDB Atlas Cloud (Shared Tier M0 for development, migrating to dedicated cluster for production).
* **Driver / ODM:** Mongoose ODM.
* **Connection Pooling:** Default connection pool (`maxPoolSize: 10`, `serverSelectionTimeoutMS: 5000`) managed via a singleton DB connection utility.
* **Data Integrity:** Schema-level validations, unique compound indexes, and foreign reference checks (`ObjectId` with `ref`).

---

## 3. Shared Entities & Module Boundaries

The platform consists of 9 core domain entities designed with clear module boundaries:

```
                      ┌──────────────┐
                      │ User/Profile │
                      └──────┬───────┘
                             │
     ┌───────────────────────┼────────────────────────┐
     ▼                       ▼                        ▼
┌────────────┐        ┌─────────────┐          ┌──────────────┐
│ Connection │        │Project/Team │          │Event/Register│
└────────────┘        └─────────────┘          └──────────────┘
     │                       │                        │
     └───────────────────────┼────────────────────────┘
                             ▼
                    ┌─────────────────┐
                    │  Activity Feed  │
                    │   & Dashboard   │
                    └─────────────────┘
```

| Module / Entity | Boundary Scope & Responsibilities | Key Fields & Relationships |
|---|---|---|
| **1. User / Profile** | Identity, authentication details, academic metadata, technical profile, bio, skills, and portfolio statistics. | `_id`, `email`, `fullName`, `avatarUrl`, `department`, `yearOfStudy`, `skills[]`, `interests[]`, `githubUsername`, `leetcodeUsername`, `role`, `status` |
| **2. Connection** | Peer-to-peer networking, connection states, relationship graph. | `_id`, `requesterId` (ref: User), `recipientId` (ref: User), `status` (`pending`, `accepted`, `rejected`, `blocked`), `connectedAt` |
| **3. Project / Team** | Collaborative projects, hackathon teams, recruitment requirements, applicant requests. | `_id`, `title`, `description`, `ownerId` (ref: User), `technologies[]`, `teamMembers[]` (`{ userId, role, joinedAt }`), `openRoles[]`, `teamStatus`, `deadline` |
| **4. Event / Registration** | Campus workshops, hackathons, club meetings, student signups. | `_id`, `title`, `category`, `description`, `organizerId` (ref: User/Club), `startDate`, `endDate`, `location`, `mode` (`in-person`, `virtual`, `hybrid`), `capacity`, `registrations[]` (`{ userId, registeredAt, status }`) |
| **5. Resource / Opportunity** | Study notes, past papers, external internships, fellowships, and career openings. | `_id`, `title`, `type` (`notes`, `internship`, `leadership`, `fellowship`), `organization`, `fileUrl`, `externalUrl`, `department`, `authorId`, `deadline`, `tags[]` |
| **6. Message / Conversation** | Direct 1:1 messaging, project team channels, unread counters. | `_id`, `type` (`direct`, `group`), `participants[]` (ref: User), `lastMessage`, `messages[]` (`{ senderId, text, attachments, readBy[], createdAt }`) |
| **7. Service / Inquiry** | Campus order assistance, student errands, peer support questions. | `_id`, `requesterId` (ref: User), `serviceType`, `description`, `location`, `rewardPoints`, `assignedTo` (ref: User), `status` (`open`, `in_progress`, `completed`, `cancelled`) |
| **8. Report / ModerationAction** | Content flagging, harassment reports, community safety actions. | `_id`, `reporterId` (ref: User), `targetType` (`user`, `project`, `message`, `resource`), `targetId`, `reason`, `status` (`pending`, `under_review`, `resolved`), `moderationAction` |
| **9. Activity** | Action audit trail and aggregated event stream driving the Dashboard & Pulse. | `_id`, `actorId` (ref: User), `verb` (`created`, `joined`, `registered`, `posted`, `connected`), `objectType`, `objectId`, `metadata`, `visibility`, `createdAt` |

---

## 4. API Standards & System Conventions

### 4.1 Authentication Assumptions
1. **Bearer JWT Token:**
   * Frontend transmits the token in HTTP headers: `Authorization: Bearer <JWT_ACCESS_TOKEN>`.
   * Access Token lifetime: 15 minutes; Refresh Token lifetime: 7 days stored in `httpOnly` secure cookie.
2. **Google OAuth 2.0 Flow:**
   * Student initiates Google sign-in.
   * Backend verifies the Google ID token and enforces campus email domain constraint (e.g., must end with `@university.edu` or verified student whitelist).
3. **Decoded User Context (`req.user`):**
   * Express authentication middleware verifies the token and binds:
     ```json
     {
       "id": "670c1a2e4f1a230012a9b101",
       "email": "karthik@university.edu",
       "role": "student",
       "department": "CSE"
     }
     ```

### 4.2 Standard Error Response Format
All API errors return a uniform JSON schema with appropriate HTTP status codes (400, 401, 403, 404, 409, 422, 500):

```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested project could not be found or has been archived.",
    "details": {
      "projectId": "670c1a2e4f1a230012a9b199"
    },
    "timestamp": "2026-10-13T18:30:00.000Z",
    "path": "/api/v1/projects/670c1a2e4f1a230012a9b199"
  }
}
```

### 4.3 Standard Success Response Format
Successful single-resource or action responses follow:

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully."
}
```

### 4.4 Timestamps
* All timestamps stored and transmitted must be **ISO 8601 UTC strings**:  
  `YYYY-MM-DDTHH:mm:ss.sssZ` (e.g. `2026-10-13T18:45:00.000Z`).
* Mongoose schemas utilize `{ timestamps: true }`, generating `createdAt` and `updatedAt` automatically.
* Display formatting (e.g. "2 hours ago", "Oct 18, 2026") is computed on the frontend client.

### 4.5 Identifier Standard
* Database identity uses MongoDB **ObjectId** (12-byte / 24-character hexadecimal).
* Express API surfaces JSON responses with standard string format:
  * Top-level identifier serialized as `"id": "670c1a2e4f1a230012a9b101"` (or normalized Mongoose virtual `.id`).
  * Foreign relationships explicitly named with camelCase `${entity}Id` (e.g. `userId`, `projectId`, `eventId`).

### 4.6 Pagination Standard
Endpoints returning collections support both **Offset Pagination** (for tables/catalog search) and **Cursor Pagination** (for activity feeds and infinite scroll):

```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 48,
    "totalPages": 5,
    "hasMore": true,
    "nextCursor": "670c1a2e4f1a230012a9b155"
  }
}
```

---

## 5. Unresolved Choices & Architecture Decisions Log

| Decision ID | Area | Options Considered | Current Consensus / Recommendation | Unresolved Trade-off / Notes | Target Finalization |
|---|---|---|---|---|---|
| **DEC-01** | Feed Pagination | A. Offset (`page`/`limit`)<br>B. Cursor (`before`/`after` ObjectId) | **Cursor pagination** for Activity & Pulse feeds; **Offset pagination** for Opportunities & Events directory. | Offset pagination can miss or duplicate items in real-time feeds when new items are added at the top. | Day 3 |
| **DEC-02** | Real-time Protocol | A. Socket.IO exclusively<br>B. SSE (Server-Sent Events) for feeds + Socket.IO for chat<br>C. REST polling initially | **REST polling initially with short interval**, transitioning to **Socket.IO** for both chat and live campus pulse. | Socket.IO server requires persistent connection management and redis adapter when horizontally scaled. | Day 4 |
| **DEC-03** | Team Members Schema | A. Embedded array in Project doc<br>B. Separate `TeamMember` junction collection | **Embedded array** with `userId`, `role`, and `status` inside `Project` document. | If team size exceeds 20 or requires complex application workflows, a junction collection might be needed later. | Day 3 |
| **DEC-04** | User Verification | A. Instant registration with college email OTP<br>B. Google OAuth restricted by domain<br>C. Manual admin ID card approval | **Google OAuth restricted to university workspace domain** for MVP. | Non-institutional emails cannot sign up without manual override or guest mode. | Day 3 |
| **DEC-05** | Dashboard Aggregation | A. Single monolithic `/api/v1/dashboard` endpoint<br>B. Separate micro-endpoints for each widget<br>C. Composite endpoint with fallback micro-endpoints | **Composite `/api/v1/dashboard`** for primary screen load, supplemented by standalone endpoints (`/api/v1/dashboard/activities`, etc.) for pagination and refresh. | Balances single-request initial render speed with lazy-loading performance. | Day 2 (Karthik) |

---

## 6. Architecture Decision Records (ADRs) Summary Table

| ID | Topic | Proposed Decision | Status | Owner | Date |
|---|---|---|---|---|---|
| **ADR-001** | Frontend Framework | React 18 with Vite & Vanilla CSS Tokens | **AGREED** | Core Platform / Team | 2026-10-10 |
| **ADR-002** | Backend Framework | Node.js + Express with Modular Routers | **AGREED** | Core Platform / Team | 2026-10-10 |
| **ADR-003** | Primary Database | MongoDB Atlas with Mongoose ODM | **AGREED** | Core Platform / Team | 2026-10-10 |
| **ADR-004** | API Versioning & URL Prefix | Use `/api/v1` prefix for all REST endpoints | **PROPOSED** | Surya (Marketplace / Permissions) | 2026-10-13 |
| **ADR-005** | Persistent Entity Identifier (ID) | 24-character hexadecimal MongoDB `ObjectId` string | **PROPOSED** | Surya (Marketplace / Permissions) | 2026-10-13 |
| **ADR-006** | Timestamp Standard | ISO 8601 UTC (`YYYY-MM-DDTHH:mm:ss.sssZ`) via Mongoose timestamps | **PROPOSED** | Surya (Marketplace / Permissions) | 2026-10-13 |
| **ADR-007** | Client Authentication Context | Bearer JWT header verified via Express middleware populating `req.user` | **PROPOSED** | Surya (Marketplace / Permissions) | 2026-10-13 |
| **ADR-008** | Standard REST Error Response Format | Unified envelope `{ success: false, error: { code, message, details }, requestId }` | **PROPOSED** | Surya (Marketplace / Permissions) | 2026-10-13 |
| **ADR-009** | Standard REST Success Response Format | Unified envelope `{ success: true, data: {}, meta: {} }` | **PROPOSED** | Surya (Marketplace / Permissions) | 2026-10-13 |
| **ADR-010** | Pagination Standard | Page & Limit query parameters with total record metadata | **PROPOSED** | Surya (Marketplace / Permissions) | 2026-10-13 |
| **ADR-011** | Shared Entity References | Foreign key references (`ownerId`, `requesterId`) without embedding full User documents | **PROPOSED** | Surya (Marketplace / Permissions) | 2026-10-13 |
| **ADR-012** | Marketplace Ownership & Authorization Model | Separation of resource-level ownership from platform roles; denial-by-default | **PROPOSED** | Surya (Marketplace / Permissions) | 2026-10-13 |
| **ADR-013** | Real-Time Messaging Boundary | Inquiries trigger chat handoff; ongoing conversation owned by Messages module | **PROPOSED** | Surya (Marketplace / Permissions) | 2026-10-13 |

---

## 7. Next Steps & Individual Assignments

* **Karthik:** Complete the detailed **Dashboard API Needs** specification ([`docs/dashboard-api-needs.md`](file:///c:/Users/KARTHIK/Desktop/VYNORAA-CONNECTS/VYNORACAMPUS-/docs/dashboard-api-needs.md)), establishing the activity taxonomy, data contracts, and required fields from Events, Projects, Opportunities, and Connections.
* **Ram:** Complete Auth & User/Profile API specifications.
* **Deep:** Complete Events & Registration module schema.
* **Varshitha:** Complete Projects & Team matching module schema.
* **SR:** Complete Opportunities & Resource sharing contract.
