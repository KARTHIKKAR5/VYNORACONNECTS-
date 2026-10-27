# Vynora Connect — Resources & Opportunities API Contract & Integration Specification

**Module Owner:** Deepu (Resources & Opportunities)  
**Target Integration Branch:** `Development`  
**Feature Branch:** `feature/deepu-resources`  
**Document Status:** Approved Specification / Frontend Adapter Baseline  
**Backend Status:** Pending Backend Implementation (`server/` currently contains `.gitkeep`)

---

## 1. Overview & Architectural Strategy

The Resources & Opportunities module enables college students across campuses to discover, filter, inspect, and contribute learning resources (study notes, roadmaps, tutorials, documentation, programming materials) and career/growth opportunities (internships, jobs, hackathons, coding competitions, scholarships).

### Current Backend Status & Fallback Isolation
As of Week 1 inspection:
- The backend server is not yet implemented (`server/` contains `.gitkeep`, no Node/Express server running).
- To preserve continuous delivery and allow end-to-end user experience testing without falsifying database persistence:
  - The frontend implements a dedicated service adapter layer (`services/resourcesService.js` and `services/opportunitiesService.js`).
  - The adapter contains an active HTTP client that attempts requests to `/api/v1/resources` and `/api/v1/opportunities`.
  - When backend endpoints return 404/503/Network Error or when running in local development mode without an active backend, the adapter cleanly falls back to explicit, realistic development mock datasets.
  - Submissions are validated strictly against the agreed schema. The adapter distinguishes between local memory-state simulation and confirmed server persistence, guaranteeing no false claims of database persistence are made to the user.

---

## 2. Resource Data Model & Contract

### 2.1 Entity Schema: `Resource`
```typescript
interface Resource {
  id: string;                      // Unique identifier (UUID or Mongo ObjectId)
  title: string;                   // Min 5, max 120 chars
  description: string;             // Min 20, max 2000 chars (sanitized text, no raw HTML)
  category: ResourceCategory;      // Defined taxonomy enum
  type: ResourceType;              // notes | roadmap | tutorial | documentation | website | tools
  tags: string[];                  // Max 8 tags, lowercase alphanumeric + hyphens
  sourceUrl: string;               // Validated external URL (http/https only)
  contributor: {
    id: string;
    name: string;
    college?: string;
    avatar?: string;
  };
  createdAt: string;               // ISO 8601 timestamp
  updatedAt?: string;              // ISO 8601 timestamp
  status: 'published' | 'pending_moderation' | 'archived';
  isVerified?: boolean;            // Only set by admin moderation
}

type ResourceCategory =
  | 'Programming'
  | 'Data Structures & Algorithms'
  | 'Web Development'
  | 'Artificial Intelligence & ML'
  | 'Databases'
  | 'System Design'
  | 'CS Fundamentals'
  | 'Interview Preparation'
  | 'DevOps & Cloud';

type ResourceType =
  | 'notes'
  | 'roadmap'
  | 'tutorial'
  | 'documentation'
  | 'website'
  | 'tools';
```

### 2.2 Resources Endpoints

#### `GET /api/v1/resources`
Retrieve a paginated list of published educational resources.

- **Auth:** Optional / Public for viewing published resources.
- **Query Parameters:**
  - `search` (string, optional): Keyword query against `title`, `description`, and `tags`.
  - `category` (string, optional): Exact match filter by `ResourceCategory`.
  - `type` (string, optional): Filter by `ResourceType`.
  - `tag` (string, optional): Single tag filter.
  - `page` (integer, default: 1): Page number.
  - `limit` (integer, default: 12, max: 50): Items per page.
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": [
    {
      "id": "res-101",
      "title": "Clean Code & Data Structures Handbook",
      "description": "Comprehensive guide covering arrays, trees, graphs, and dynamic programming patterns with visual explanations and Python/Java implementations.",
      "category": "Data Structures & Algorithms",
      "type": "notes",
      "tags": ["dsa", "algorithms", "interview", "python"],
      "sourceUrl": "https://github.com/vynora/dsa-handbook",
      "contributor": {
        "id": "usr-01",
        "name": "Manideepika",
        "college": "Vynora Institute of Technology"
      },
      "createdAt": "2026-10-20T10:30:00Z",
      "status": "published",
      "isVerified": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 48,
    "totalPages": 4
  }
}
```

#### `GET /api/v1/resources/:id`
Retrieve detailed information for a single resource.

- **Auth:** Optional / Public.
- **Success Response (`200 OK`):** Single resource object wrapped in `{ "success": true, "data": Resource }`.
- **Error Response (`404 Not Found`):**
```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Resource with ID 'res-999' was not found or has been removed."
  }
}
```

#### `POST /api/v1/resources`
Submit a new community resource.

- **Auth:** Required (`Bearer <JWT>`).
- **Request Headers:** `Content-Type: application/json`
- **Payload:**
```json
{
  "title": "Interactive Modern CSS & Layouts Guide",
  "description": "Deep dive into Flexbox, CSS Grid, container queries, and subgrid with interactive codepens and real-world responsive layouts.",
  "category": "Web Development",
  "type": "tutorial",
  "tags": ["css", "frontend", "responsive"],
  "sourceUrl": "https://developer.vynora.org/css-guide"
}
```
- **Validation Rules:**
  - `title`: 5 to 120 characters, required.
  - `description`: 20 to 2000 characters, required. Sanitized plain text; raw HTML stripped.
  - `category`: Must match one of the predefined taxonomy values.
  - `type`: Must match one of `notes`, `roadmap`, `tutorial`, `documentation`, `website`, `tools`.
  - `sourceUrl`: Must be a valid absolute URI with `http:` or `https:` scheme. `javascript:` schemes rejected.
  - `tags`: Array of 1 to 8 strings, each 2-25 characters.
- **Success Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Resource submitted successfully and is pending moderation.",
  "data": {
    "id": "res-new-55",
    "status": "pending_moderation"
  }
}
```

---

## 3. Opportunity Data Model & Contract

### 3.1 Entity Schema: `Opportunity`
```typescript
interface Opportunity {
  id: string;                      // Unique identifier
  title: string;                   // Min 5, max 120 chars
  organization: string;            // Min 2, max 80 chars
  type: OpportunityType;           // internship | job | hackathon | competition | scholarship
  summary: string;                 // Min 20, max 2000 chars
  eligibility: string;             // Min 5, max 300 chars
  deadline: string;                // ISO 8601 date string (e.g., "2026-11-15T23:59:59Z")
  location: string;                // e.g., "Bengaluru, India" | "Remote"
  remote: boolean;                 // boolean flag
  applicationUrl: string;          // Validated absolute URL (http/https only)
  stipendOrPrize?: string;         // e.g. "₹40,000 / month" or "$10,000 Prize Pool"
  createdAt: string;               // ISO 8601 timestamp
  status: 'active' | 'expired' | 'closed';
  isVerified: boolean;             // Authoritative server-side verification status
}

type OpportunityType =
  | 'internship'
  | 'job'
  | 'hackathon'
  | 'competition'
  | 'scholarship';
```

### 3.2 Opportunities Endpoints

#### `GET /api/v1/opportunities`
Retrieve listings of active student opportunities.

- **Auth:** Optional / Public.
- **Query Parameters:**
  - `search` (string, optional): Keyword query against `title`, `organization`, and `summary`.
  - `type` (string, optional): `internship`, `job`, `hackathon`, `competition`, `scholarship`.
  - `status` (string, optional): `active` or `expired` (defaults to all or active based on filter).
  - `remote` (boolean, optional): `true` or `false`.
  - `page` (integer, default: 1)
  - `limit` (integer, default: 12)
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": [
    {
      "id": "opp-201",
      "title": "Summer AI & Software Engineering Internship 2027",
      "organization": "Google DeepMind Research Lab",
      "type": "internship",
      "summary": "Join our research team to build next-generation multimodal neural models and evaluation platforms. Mentorship provided by senior research scientists.",
      "eligibility": "Pre-final or final year B.Tech/M.S. in CS or related quantitative discipline.",
      "deadline": "2026-11-30T23:59:59Z",
      "location": "Bengaluru / Hybrid",
      "remote": true,
      "stipendOrPrize": "Competitive monthly stipend + housing allowance",
      "applicationUrl": "https://careers.google.com/jobs/results/opp-201",
      "createdAt": "2026-10-18T08:00:00Z",
      "status": "active",
      "isVerified": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 32,
    "totalPages": 3
  }
}
```

#### `GET /api/v1/opportunities/:id`
Retrieve detailed listing for a specific opportunity.

- **Auth:** Optional / Public.
- **Success Response (`200 OK`):** Single opportunity object.
- **Error Response (`404 Not Found`):**
```json
{
  "success": false,
  "error": {
    "code": "OPPORTUNITY_NOT_FOUND",
    "message": "Opportunity 'opp-999' not found or listing has been archived."
  }
}
```

#### `POST /api/v1/opportunities`
Submit a student-discovered or student-led opportunity.

- **Auth:** Required (`Bearer <JWT>`).
- **Payload:**
```json
{
  "title": "National Inter-College Hackathon 2026",
  "organization": "ACM Student Chapter",
  "type": "hackathon",
  "summary": "36-hour cross-campus building sprint focusing on sustainable tech, AI assistants, and decentralized social networks. Over ₹2.5L in prize pools.",
  "eligibility": "Undergraduate and postgraduate students enrolled in accredited universities.",
  "deadline": "2026-11-20T18:00:00Z",
  "location": "Hyderabad / Hybrid",
  "remote": true,
  "stipendOrPrize": "₹2,50,000 Prize Pool",
  "applicationUrl": "https://acm-vynora-hack.devpost.com"
}
```
- **Validation Rules:**
  - `title`: 5 to 120 chars, required.
  - `organization`: 2 to 80 chars, required.
  - `type`: Must match one of `internship`, `job`, `hackathon`, `competition`, `scholarship`.
  - `summary`: 20 to 2000 chars, required.
  - `eligibility`: 5 to 300 chars, required.
  - `deadline`: Valid future date string; must pass ISO 8601 parsing.
  - `applicationUrl`: Must be a valid HTTP/HTTPS URL.
  - `isVerified`: Ignored on client input. Server always defaults to `false` until verified by administrators.

---

## 4. Error Response Envelope

All API endpoints follow a consistent error structure:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed for one or more fields.",
    "details": [
      { "field": "applicationUrl", "message": "Must be a valid HTTPS URL." },
      { "field": "deadline", "message": "Deadline must be a future date." }
    ]
  }
}
```

Common error codes:
- `VALIDATION_ERROR` (400)
- `UNAUTHORIZED` (401)
- `FORBIDDEN` (403)
- `RESOURCE_NOT_FOUND` / `OPPORTUNITY_NOT_FOUND` (404)
- `RATE_LIMITED` (429)
- `INTERNAL_SERVER_ERROR` (500)

---

## 5. Trust, Verification, and Safe Link Security

1. **Verification Badges:**
   - The `isVerified` attribute is solely authoritative from the backend.
   - Frontend forms explicitly do not allow users to submit `isVerified: true`.
   - Cards display "Verified" only when `isVerified === true`. If unverified, the UI states "Community Submitted" or "Unverified" to protect student trust.
2. **Safe External Navigation:**
   - All external application and resource links render with `target="_blank"` and `rel="noopener noreferrer"`.
   - Protocol check: Only URLs beginning with `http://` or `https://` are permitted. Any URL with `javascript:`, `data:`, or `vbscript:` is blocked and flagged as invalid.
3. **Deadline Honesty:**
   - Deadlines are evaluated against current client time (`Date.now()`).
   - If `deadline < Date.now()`, the opportunity is flagged with an explicit "Expired" badge and warning styling, preventing students from applying past the cut-off.

---

## 6. Dashboard Integration Coordination (Karthik Kavali)

The dashboard module displays an "Opportunity Preview / Recommendations" widget.
- **Contract Alignment:** Karthik's dashboard module consumes the shared `opportunitiesService.js` method `getFeaturedOpportunities(limit = 3)` or `getOpportunities({ limit: 3 })`.
- **Shared Type Definition:** Both modules share the same `Opportunity` model definition, ensuring consistent field names (`title`, `organization`, `type`, `deadline`, `location`, `applicationUrl`, `isVerified`).
- No duplicate data store or divergent schema is created.

---

## 7. Dependencies & Pending Decisions

| Item | Status | Action Required |
|---|---|---|
| Backend Server | Blocked / Pending | Backend team to implement Express routes and MongoDB models |
| Shared Routing & AppShell | Implemented in Client | React + Vite architecture with shared sidebar/nav and Vynora Obsidian palette |
| Moderation Queue | Future scope | Currently submissions enter `pending_moderation` status |
| Bookmark / Save action | Clarified | Bookmarks marked as "Coming Soon / Saved locally" without false DB claims |
