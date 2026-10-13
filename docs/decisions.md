# 🏛️ Architecture Decision Records (ADRs) — Vynora Connect

This document tracks system-wide and module-level architectural decisions for **Vynora Connect**. Every decision has an explicit status (`PROPOSED`, `AGREED`, or `DEFERRED`) to ensure that unconfirmed team proposals are not assumed to be final until discussed and ratified.

---

## Decision Summary Table

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

## Detailed Records

### ADR-001: Frontend Framework
- **Topic:** Frontend Core Stack
- **Decision:** Use React 18 with Vite bundler and Vanilla CSS with custom property tokens.
- **Reason:** Provides fast hot-module replacement (HMR), minimal bundle size, and maximum styling flexibility without build-time CSS compilation lock-in.
- **Status:** **AGREED** (established in Core Platform sprint).
- **Owner:** Karthik / Core Platform.
- **Date:** 2026-10-10.

---

### ADR-002: Backend Framework
- **Topic:** Server Runtime & API Layer
- **Decision:** Use Node.js runtime with Express.js application framework.
- **Reason:** Standard MERN stack architecture, robust middleware ecosystem, and seamless JSON API handling.
- **Status:** **AGREED**.
- **Owner:** Core Platform / Team.
- **Date:** 2026-10-10.

---

### ADR-003: Primary Database
- **Topic:** Database Persistence Engine
- **Decision:** Use MongoDB Atlas managed cluster with Mongoose ODM for document schema validation.
- **Reason:** Schema flexibility for student profiles, listings, inquiries, and team collaboration records, coupled with JSON document alignment.
- **Status:** **AGREED**.
- **Owner:** Core Platform / Team.
- **Date:** 2026-10-10.

---

### ADR-004: API Versioning and URL Prefix
- **Topic:** REST Endpoint Routing Convention
- **Proposed Decision:** Adopt `/api/v1` as the root route prefix for all REST services (e.g., `/api/v1/marketplace/listings`).
- **Reason:** Guarantees backward compatibility for future mobile apps or web updates when breaking changes occur in v2 without disrupting production consumers.
- **Status:** **PROPOSED** (Requires team consensus before backend route mounting).
- **Owner:** Surya.
- **Date:** 2026-10-13.

---

### ADR-005: Persistent Entity Identifier (ID) Convention
- **Topic:** Primary Key and Reference Identifier Format
- **Proposed Decision:** Use standard 12-byte / 24-character hexadecimal MongoDB `ObjectId` string representations for all persistent entities (`_id`, `ownerId`, `listingId`, `requesterId`, `recipientId`).
- **Reason:** Universally supported by MongoDB/Mongoose, auto-generates timestamp components, and prevents ID collision without requiring centralized sequence generators.
- **Status:** **PROPOSED**.
- **Owner:** Surya.
- **Date:** 2026-10-13.

---

### ADR-006: Timestamp Standard
- **Topic:** Date and Time Representation
- **Proposed Decision:** All timestamps across database persistence and API JSON serialization must use ISO 8601 UTC format (`YYYY-MM-DDTHH:mm:ss.sssZ`). Models will automatically maintain `createdAt` and `updatedAt` via Mongoose `{ timestamps: true }`. Lifecycle timestamps such as `publishedAt` and `lastRespondedAt` must also be ISO 8601 UTC.
- **Reason:** Eliminates timezone ambiguity across distributed clients and campus locations.
- **Status:** **PROPOSED**.
- **Owner:** Surya.
- **Date:** 2026-10-13.

---

### ADR-007: Authentication Assumptions & Client Identity Extraction
- **Topic:** Server-Side Authentication & Session Context
- **Proposed Decision:**
  1. Requests transmit authentication tokens via HTTP header: `Authorization: Bearer <token>`.
  2. Express middleware verifies the token and mounts a sanitized user payload on `req.user` containing `{ id: ObjectId, email: String, role: String, department: String }`.
  3. The server **never** trusts client-supplied identity fields in request bodies (such as `ownerId` or `requesterId`) for authorization. The identity is derived strictly from `req.user.id`.
- **Reason:** Prevents identity spoofing and privilege escalation vulnerabilities.
- **Status:** **PROPOSED** (Final JWT payload and signature algorithm to be agreed upon with Auth module owner).
- **Owner:** Surya.
- **Date:** 2026-10-13.

---

### ADR-008: Standard REST Error Response Format
- **Topic:** Error Envelope Schema
- **Proposed Decision:** All non-2xx responses must return a standardized JSON structure:
  ```json
  {
    "success": false,
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Human-readable description of what went wrong.",
      "details": [
        {
          "field": "pricing.amount",
          "message": "Price amount must be greater than or equal to 0."
        }
      ]
    },
    "requestId": "req-98f24b-172883"
  }
  ```
  - `code`: Machine-readable error constant (e.g., `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `VALIDATION_ERROR`, `CONFLICT`, `INTERNAL_ERROR`).
  - `message`: User-friendly message suitable for UI display.
  - `details`: Array of specific field failures (for 400/422).
  - `requestId`: Unique correlation identifier for server log tracing.
  - **Security Rule:** Stack traces and internal database errors must never leak into client responses.
- **Reason:** Guarantees uniform client-side error handling across all frontend modules.
- **Status:** **PROPOSED**.
- **Owner:** Surya.
- **Date:** 2026-10-13.

---

### ADR-009: Standard REST Success Response Format
- **Topic:** Success Envelope Schema
- **Proposed Decision:** All 2xx responses return:
  ```json
  {
    "success": true,
    "data": { ... },
    "meta": { ... }
  }
  ```
  - For single entities, `data` contains the entity object.
  - For lists, `data` contains the array, and `meta` contains pagination information.
- **Reason:** Consistency across frontend services and predictable response parsing.
- **Status:** **PROPOSED**.
- **Owner:** Surya.
- **Date:** 2026-10-13.

---

### ADR-010: Pagination Convention
- **Topic:** Collection Query Pagination
- **Proposed Decision:** Use offset-based pagination with query parameters `page` (default: 1, minimum: 1) and `limit` (default: 12, maximum: 50).
  Response `meta` object must include:
  ```json
  {
    "total": 48,
    "page": 1,
    "limit": 12,
    "totalPages": 4,
    "hasNext": true,
    "hasPrev": false
  }
  ```
- **Reason:** Perfectly suited for standard catalog grid browsing and page selection in the UI.
- **Status:** **PROPOSED**.
- **Owner:** Surya.
- **Date:** 2026-10-13.

---

### ADR-011: Shared Entity References
- **Topic:** Document Relationship Architecture
- **Proposed Decision:** Store only foreign reference identifiers (`ownerId`, `requesterId`, `recipientId`) pointing to the shared `User` / `StudentProfile` model. Do not duplicate or snapshot user documents into listings or inquiries, with the exception of lightweight denormalized summary fields (e.g. `ownerName`) if necessary for display optimization.
- **Reason:** Prevents stale student data (names, avatars, departments) and minimizes database document size.
- **Status:** **PROPOSED**.
- **Owner:** Surya.
- **Date:** 2026-10-13.

---

### ADR-012: Marketplace Ownership & Authorization Model
- **Topic:** Resource-Level vs. Platform-Level Permissions
- **Proposed Decision:**
  1. **Strict separation:** Platform roles (`OWNER`, `ADMIN`, `MEMBER`, `VIEWER`) govern platform/project management, while resource ownership (`isListingOwner`, `isInquiryParticipant`) governs Marketplace access.
  2. Platform `ADMIN` is not granted blanket write/delete privileges over individual student service listings.
  3. Only the listing creator may edit or archive their listing.
  4. Only the inquiry recipient can accept or decline an inquiry; only the requester may cancel a pending inquiry.
  5. Any unknown role, action, or resource relation is denied by default.
- **Reason:** Protects student autonomy, prevents administrative overreach, and maintains strict principle of least privilege.
- **Status:** **PROPOSED**.
- **Owner:** Surya.
- **Date:** 2026-10-13.

---

### ADR-013: Real-Time Messaging Boundary
- **Topic:** Boundary Between Marketplace Inquiries and Real-Time Chat
- **Proposed Decision:**
  1. The Marketplace `Inquiry` model captures initial interest, scoped requirements, and budget agreement.
  2. The `Inquiry` document does not store ongoing chat messages or message history.
  3. When an inquiry is accepted, it transitions to `ACCEPTED` and stores a reference `conversationId` managed by the future `Messages` module.
- **Reason:** Avoids duplication of chat schema and prevents coupling the Marketplace module to Socket.IO connection pools.
- **Status:** **PROPOSED**.
- **Owner:** Surya / Team.
- **Date:** 2026-10-13.
