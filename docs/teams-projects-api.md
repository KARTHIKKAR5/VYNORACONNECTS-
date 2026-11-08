# Vynora Connect — Teams & Projects API Contract & Specification

**Module Owner:** Varshitha (Teams & Projects)  
**Feature Branch:** `feature/varsh-teams-projects`  
**Target Branch:** `Development`  
**Status:** Approved Specification / Frontend Adapter Baseline  
**Backend Status:** Pending Shared Backend Implementation (`server/` currently reserved)

---

## 1. Module Overview & Domain Boundaries

The **Teams & Projects** module enables college students to:
- Discover student-led projects, hackathon initiatives, open-source repositories, and startup concepts across campuses.
- Create and showcase projects with technology tags and problem statements.
- Define specific recruitment requirements (e.g. "Looking for: Backend Developer, ML Engineer").
- Manage team membership, roles, and permissions (Project Lead, Core Member, Contributor).
- Submit join requests / applications with pitch messages.
- Allow Project Leads to review, accept, or reject incoming applicants.

### Inter-Module Boundaries (No Duplication)
- **Canonical User & Authentication:** Owned by the shared backend maintainer. Projects store only `leadId` (ref `User`) and light user summaries (`{ id, name, college, avatar }`).
- **Student Profiles & Resumes:** Owned by Ram. Teams & Projects links to Ram's profile view (`/network/profile/:userId`) and does not duplicate resume storage.
- **Chat & Messaging:** Owned by Siri. Group communications and direct messaging between applicants and leads will link to Siri's communication module.
- **Dashboard Previews:** Owned by Karthik. This module exports lightweight summary methods (`getUserProjects()`, `getUserPendingRequests()`) for Karthik's dashboard widget.
- **Moderation:** Owned by Revanth. Projects feature a report flag (`POST /api/v1/projects/:id/report`) consumed by Revanth's moderation queue.

---

## 2. Data Models & Schemas

### 2.1 Project Entity Schema (`Project`)
```typescript
interface Project {
  id: string;                     // Unique identifier (UUID or Mongo ObjectId)
  title: string;                  // Min 5, max 100 characters
  tagline: string;                // Min 10, max 160 characters (brief summary)
  description: string;            // Min 30, max 3000 characters (problem statement & vision)
  category: ProjectCategory;      // Defined domain taxonomy
  tags: string[];                 // Technology tags (e.g., ['react', 'node.js', 'mongodb'])
  status: ProjectStatus;          // 'recruiting' | 'in-progress' | 'completed' | 'archived'
  repoUrl?: string;               // Optional GitHub repository URL
  demoUrl?: string;               // Optional live demo / prototype URL
  lead: ContributorSummary;       // Project creator/lead summary
  team: TeamSummary;              // Associated team reference
  openRoles: OpenRole[];          // Active recruitment roles
  createdAt: string;              // ISO 8601 timestamp
  updatedAt: string;              // ISO 8601 timestamp
}

type ProjectCategory =
  | 'Hackathon'
  | 'Web Application'
  | 'Mobile Application'
  | 'AI & Machine Learning'
  | 'Open Source'
  | 'Campus Utility'
  | 'Startup & Entrepreneurship'
  | 'Research & Academic';

type ProjectStatus = 'recruiting' | 'in-progress' | 'completed' | 'archived';

interface ContributorSummary {
  id: string;
  name: string;
  college?: string;
  department?: string;
  avatar?: string;
}

interface OpenRole {
  id: string;                     // Role identifier (e.g. 'role-01')
  title: string;                  // e.g. 'Frontend Developer', 'UI/UX Designer'
  skillsRequired: string[];       // e.g. ['React', 'Tailwind', 'Figma']
  description?: string;           // Brief expectations
  openings: number;               // Number of seats available
  filled: number;                 // Number of accepted members
  status: 'open' | 'closed';
}
```

### 2.2 Team Entity Schema (`Team`)
```typescript
interface Team {
  id: string;
  projectId: string;
  name: string;
  leadId: string;
  members: TeamMember[];
  createdAt: string;
}

interface TeamMember {
  userId: string;
  name: string;
  college?: string;
  avatar?: string;
  role: 'lead' | 'core' | 'contributor';
  assignedRoleTitle: string;      // e.g. 'Lead Architect', 'Backend Developer'
  joinedAt: string;
}
```

### 2.3 Join Request / Application Schema (`JoinRequest`)
```typescript
interface JoinRequest {
  id: string;
  projectId: string;
  projectTitle: string;
  roleId: string;
  roleTitle: string;
  applicant: ContributorSummary;
  message: string;                // Pitch message (min 20, max 600 chars)
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  createdAt: string;
  reviewedAt?: string;
  reviewerFeedback?: string;
}
```

---

## 3. REST API Contract

All endpoints follow the `/api/v1` base route and standard JSON response envelopes.

### 3.1 Project Discovery & Management

#### `GET /api/v1/projects`
Retrieve paginated list of projects with filtering.
- **Auth:** Public / Optional.
- **Query Parameters:**
  - `search` (string, optional): Keyword search matching `title`, `tagline`, and `tags`.
  - `category` (string, optional): Filter by `ProjectCategory`.
  - `tag` (string, optional): Single technology tag filter.
  - `recruitingOnly` (boolean, optional): If `true`, only returns projects with active `openRoles`.
  - `page` (integer, default: 1): Page number.
  - `limit` (integer, default: 10): Items per page.
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": [
    {
      "id": "proj-101",
      "title": "Campus Security & Patrol Monitor",
      "tagline": "AI-powered edge computer vision alert system for campus safety",
      "category": "AI & Machine Learning",
      "tags": ["python", "pytorch", "opencv", "react"],
      "status": "recruiting",
      "lead": {
        "id": "usr-10",
        "name": "Varshitha",
        "college": "Vynora Institute of Technology"
      },
      "team": {
        "id": "team-101",
        "memberCount": 3,
        "maxMembers": 5
      },
      "openRoles": [
        {
          "id": "role-01",
          "title": "Backend API Developer",
          "skillsRequired": ["Node.js", "Express", "MongoDB"],
          "openings": 1,
          "filled": 0,
          "status": "open"
        }
      ],
      "createdAt": "2026-11-01T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 24,
    "totalPages": 3
  }
}
```

#### `GET /api/v1/projects/:id`
Retrieve full project details, including full team roster and open positions.
- **Auth:** Public.
- **Success Response (`200 OK`):** `{ "success": true, "data": Project }`.
- **Error Response (`404 Not Found`):**
```json
{
  "success": false,
  "error": {
    "code": "PROJECT_NOT_FOUND",
    "message": "Project 'proj-999' was not found or has been archived."
  }
}
```

#### `POST /api/v1/projects`
Create a new project and initialize its team.
- **Auth:** Required (`Bearer <JWT>`).
- **Payload:**
```json
{
  "title": "Inter-College Hackathon Portal",
  "tagline": "Centralized submission and judging platform for cross-college building sprints",
  "description": "Comprehensive platform providing live judging dashboards, real-time leaderboard sync, and automatic certificate generation for multi-college hackathons.",
  "category": "Web Application",
  "tags": ["react", "nodejs", "mongodb", "socket.io"],
  "repoUrl": "https://github.com/vynora/hack-portal",
  "demoUrl": "",
  "openRoles": [
    {
      "title": "UI/UX Designer",
      "skillsRequired": ["Figma", "Design Systems"],
      "openings": 1
    }
  ]
}
```

#### `PATCH /api/v1/projects/:id`
Update project details, status, or open roles.
- **Auth:** Required (Must be Project Lead).

---

### 3.2 Join Requests & Recruitment

#### `POST /api/v1/projects/:id/apply`
Submit a join request for an open role.
- **Auth:** Required (`Bearer <JWT>`).
- **Payload:**
```json
{
  "roleId": "role-01",
  "message": "I have 2 years of experience building scalable Node.js services and would love to contribute to the campus alert architecture."
}
```
- **Validation Rules:**
  - Applicant cannot apply to their own project.
  - Applicant cannot have an existing `pending` application on the same project.
  - `message`: 20 to 600 characters required.

#### `GET /api/v1/projects/:id/applicants`
Retrieve incoming join requests.
- **Auth:** Required (Must be Project Lead).
- **Success Response (`200 OK`):** Array of `JoinRequest` items.

#### `PATCH /api/v1/projects/:id/applicants/:requestId`
Accept or reject an applicant.
- **Auth:** Required (Must be Project Lead).
- **Payload:**
```json
{
  "status": "accepted",
  "reviewerFeedback": "Welcome aboard! Let's schedule our first sync."
}
```
- **Side Effects on `accepted`:**
  - Adds applicant to `Team.members` with role `'contributor'` or `'core'`.
  - Increments `OpenRole.filled`. If `filled === openings`, marks role status as `'closed'`.

---

## 4. Role Hierarchy & Permission Matrix

| Action | Project Lead (Owner) | Core Member | Contributor | Non-Member / Visitor |
|---|---|---|---|---|
| View Project & Open Roles | Yes | Yes | Yes | Yes |
| Apply to Open Role | No (Already Lead) | No | No | Yes |
| Edit Project Details | Yes | No | No | No |
| Add / Close Open Roles | Yes | No | No | No |
| Review / Accept Applicants | Yes | No | No | No |
| Leave Team | No (Must transfer lead) | Yes | Yes | N/A |
| Report Project | Yes | Yes | Yes | Yes |

---

## 5. Future Integration Points

1. **Vynora Points:**
   - Emits domain event `PROJECT_LAUNCHED`, `MEMBER_RECRUITED`, and `PROJECT_COMPLETED`.
   - The future points engine listens to these events to reward points without mutating project code.
2. **Talent Discovery (Ram):**
   - Query endpoint: `GET /api/v1/projects?lookingForSkill=:skill`.
   - Projects expose normalized `skillsRequired` arrays that can be cross-matched against student profile skills.
