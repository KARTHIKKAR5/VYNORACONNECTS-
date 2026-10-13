# Vynora Campus+ Dashboard API Needs & Activity Contract Draft

**Deliverable:** Dashboard API Needs  
**Assigned Member:** Karthik (Full-Stack Developer)  
**Date:** Day 2 — Tuesday, October 13  
**Status:** Ready for Review & Team Feedback  
**Target Repository:** Vynora Campus+ (`VYNORACAMPUS-`)

---

## 1. Executive Summary & Purpose

The **Student Dashboard** is the central nervous system of Vynora Campus+. When a verified student logs in, the dashboard acts as their personalized command hub, summarizing:
* Immediate personal status and campus greeting.
* Recent personal activity stream (network, projects, submissions, account updates).
* Real-time campus-wide momentum (**Vynora Pulse**).
* Quick previews and access to core modules: **Upcoming Events**, **Recruiting Projects**, **Open Opportunities**, and **Peer Connections**.

To ensure optimal mobile and web load times while preserving modularity, this document establishes:
1. The **Activity Types Taxonomy** for both personal feeds and campus-wide pulse.
2. The specific **fields required from other domain modules** (Events, Projects, Opportunities, Connections).
3. The **API Contract draft** (Composite `GET /api/v1/dashboard` plus dedicated sub-resource endpoints).
4. Error resilience and empty-state strategies.

---

## 2. Information Architecture & Client Mapping

The API needs are modeled directly against the data requirements of the React dashboard components in `client/src/components/home/`:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Dashboard (Home.jsx)                            │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Welcome Banner (Welcome.jsx)                                        │
│    • User greeting, active streak, verified department & campus tagline│
├────────────────────────────────────────────────────────────────────────┤
│ 2. Quick Actions (QuickActions.jsx)                                    │
│    • Shortcuts: Find People, Create Post, Find a Team, Explore Events  │
├──────────────────────────────────┬─────────────────────────────────────┤
│ 3. Recent Activity (Activity.jsx) │ 4. Vynora Pulse (PulseActivity.jsx) │
│    • Personal notifications &    │    • Live campus momentum, club PRs,│
│      user-triggered milestones   │      recruitment spotlights         │
├──────────────────────────────────┼─────────────────────────────────────┤
│ 5. Events Preview                │ 6. Projects Preview                 │
│    (EventPreview.jsx)            │    (ProjectPreview.jsx)             │
│    • Hackathons & workshops      │    • Teams recruiting developers    │
├──────────────────────────────────┴─────────────────────────────────────┤
│ 7. Opportunities Preview (OpportunityPreview.jsx)                      │
│    • Internships, fellowships, and club leadership roles               │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Activity Types & Feed Taxonomy

The system defines two streams of activities:
1. **Personal Activity Feed (`recentActivities`):** Targeted to the authenticated user (e.g., your project submission, new connections accepted, profile verification).
2. **Campus Pulse Feed (`pulseFeed`):** Public/campus-wide broadcasts highlighting high-energy student initiatives (e.g., open source sprints, cross-department team searches, study material releases).

### 3.1 Activity Enum Definition

```typescript
export enum ActivityType {
  // Account & Identity
  ACCOUNT_VERIFIED = 'ACCOUNT_VERIFIED',
  PROFILE_UPDATED = 'PROFILE_UPDATED',
  SKILL_ENDORSED = 'SKILL_ENDORSED',

  // Network & Connections
  CONNECTION_REQUEST = 'CONNECTION_REQUEST',
  CONNECTION_ACCEPTED = 'CONNECTION_ACCEPTED',
  NETWORK_EXPANSION = 'NETWORK_EXPANSION',

  // Projects & Hackathons
  PROJECT_CREATED = 'PROJECT_CREATED',
  PROJECT_RECRUITING = 'PROJECT_RECRUITING',
  PROJECT_APPLICATION_SENT = 'PROJECT_APPLICATION_SENT',
  PROJECT_TEAM_JOINED = 'PROJECT_TEAM_JOINED',
  PROJECT_MILESTONE_UPDATED = 'PROJECT_MILESTONE_UPDATED',
  HACKATHON_SUBMISSION = 'HACKATHON_SUBMISSION',

  // Events & Campus Life
  EVENT_PUBLISHED = 'EVENT_PUBLISHED',
  EVENT_REGISTERED = 'EVENT_REGISTERED',
  EVENT_REMINDER = 'EVENT_REMINDER',

  // Opportunities & Careers
  OPPORTUNITY_POSTED = 'OPPORTUNITY_POSTED',
  OPPORTUNITY_DEADLINE_APPROACHING = 'OPPORTUNITY_DEADLINE_APPROACHING',

  // Resources & Study Hub
  RESOURCE_UPLOADED = 'RESOURCE_UPLOADED',
  RESOURCE_TRENDING = 'RESOURCE_TRENDING',

  // Campus Pulse Highlights
  COLLABORATION_SPRINT = 'COLLABORATION_SPRINT',
  CAMPUS_ANNOUNCEMENT = 'CAMPUS_ANNOUNCEMENT'
}
```

### 3.2 Activity Schema Specification

Every activity item rendered in the dashboard follows this unified structure:

| Field Name | Type | Description | Example |
|---|---|---|---|
| `id` | `String` | Unique activity identifier (`ObjectId` string). | `"act-670c1a2e4f1a230012a9b101"` |
| `type` | `ActivityType` | Machine-readable type enum. | `"PROJECT_RECRUITING"` |
| `category` | `String` | UI grouping label shown on badge. | `"Project"`, `"Network"`, `"Hackathon"`, `"Resource"` |
| `icon` | `String` | Visual emoji or icon token for card rendering. | `"💡"`, `"🤝"`, `"🚀"`, `"📚"`, `"🔥"` |
| `title` | `String` | Short prominent headline (max 60 chars). | `"New Project Opportunity"` |
| `description` | `String` | Concise context or summary (max 140 chars). | `"Smart Attendance & Campus Navigation is looking for a React developer."` |
| `status` | `String` | State badge label. | `"Open"`, `"Connected"`, `"Submitted"`, `"Recruiting"`, `"New"` |
| `timestamp` | `String` | ISO 8601 UTC timestamp of creation. | `"2026-10-13T17:30:00.000Z"` |
| `relativeTime` | `String` | Client-formatted human-readable time. | `"2 hours ago"` |
| `targetUrl` | `String` (Optional) | Deep link destination on card click. | `"/projects/670c1a2e4f1a230012a9b155"` |
| `actor` | `Object` (Optional) | User or group triggering the activity. | `{ "id": "...", "name": "Aarav Patel", "avatarUrl": "..." }` |

---

## 4. Fields Required from Core Domain Modules

To render the dashboard widgets cleanly without over-fetching heavy relation graphs, the dashboard controller requires light projection payloads from four upstream domain modules:

### 4.1 From Events Module (`EventPreview.jsx`)

The dashboard needs a snapshot of the student's next relevant events (maximum 3 to 5 items):

| Field Required | Type | Purpose in Dashboard |
|---|---|---|
| `id` | `String` | React list key and routing to event detail page (`/events/:id`). |
| `title` | `String` | Main card headline (e.g. `"Vynora Campus Hackathon 2026"`). |
| `category` | `String` | Tag badge (e.g. `"Hackathon"`, `"Workshop"`, `"Tech Talk"`). |
| `date` | `String` | Formatted event date/time string (e.g. `"Oct 24, 2026"`). |
| `isoStartDate` | `String` | Machine timestamp for client time-left calculation. |
| `location` | `String` | Physical hall or hybrid note (e.g. `"Tech Park Auditorium • Hybrid"`). |
| `isUserRegistered` | `Boolean` | Indicator if the logged-in student has already RSVP'd. |
| `spotsRemaining` | `Number` (Optional) | Urgency counter (e.g. `12 spots left`). |

### 4.2 From Projects Module (`ProjectPreview.jsx`)

The dashboard needs 2 to 4 active campus projects that have open team slots or belong to the user:

| Field Required | Type | Purpose in Dashboard |
|---|---|---|
| `id` | `String` | Routing to project detail page (`/projects/:id`). |
| `title` | `String` | Project name (e.g. `"Vynora Campus Assistant"`). |
| `description` | `String` | 1-2 sentence elevator pitch. |
| `technologies` | `String[]` | Tag chips for matching tech stack (e.g. `["React", "Node.js", "PostgreSQL"]`). |
| `teamStatus` | `String` | Recruitment status badge (e.g. `"Looking for 1 Dev"`, `"Recruiting"`). |
| `openRoles` | `String[]` (Optional) | Specific skills sought (e.g. `["Frontend Developer"]`). |
| `ownerName` | `String` | Lead student name. |

### 4.3 From Opportunities Module (`OpportunityPreview.jsx`)

The dashboard needs 2 to 4 trending career/leadership opportunities:

| Field Required | Type | Purpose in Dashboard |
|---|---|---|
| `id` | `String` | Routing to opportunity view (`/opportunities/:id`). |
| `title` | `String` | Position or post name (e.g. `"Summer Frontend Engineering Intern"`). |
| `organization` | `String` | Employer, lab, or club (e.g. `"Vynora Labs Inc."`, `"GDSC Chapter"`). |
| `type` | `String` | Category badge (e.g. `"Internship"`, `"Leadership"`, `"Fellowship"`). |
| `deadline` | `String` | Display deadline (e.g. `"Nov 15, 2026"`). |
| `isoDeadline` | `String` | ISO timestamp for expiring-soon countdowns. |
| `isExpiringSoon` | `Boolean` | Flag set to `true` if deadline is within 72 hours. |

### 4.4 From Connections Module (Networking & Stats)

The dashboard needs high-level networking counters and connection signals:

| Field Required | Type | Purpose in Dashboard |
|---|---|---|
| `totalConnections` | `Number` | Displayed in user profile metrics / stats bar. |
| `pendingIncomingRequests` | `Number` | Badge counter on header / networking icon. |
| `recentConnectedCount` | `Number` | Used to trigger network summary updates (e.g. `"3 students joined your network"`). |
| `recentConnectedUsers` | `Array` (Max 3) | Mini avatars: `{ id, name, avatarUrl, department }`. |

---

## 5. API Contracts & Specifications

### 5.1 Primary Aggregate Endpoint: `GET /api/v1/dashboard`

Provides all essential data needed to render the home dashboard in a **single HTTP round-trip**, preventing multi-request waterfall latency on campus mobile connections.

* **Method:** `GET`
* **Route:** `/api/v1/dashboard`
* **Headers:**
  ```http
  Authorization: Bearer <JWT_ACCESS_TOKEN>
  Accept: application/json
  ```
* **Status Code:** `200 OK`

#### Response Body:

```json
{
  "success": true,
  "data": {
    "userSummary": {
      "id": "670c1a2e4f1a230012a9b101",
      "firstName": "Karthik",
      "fullName": "Karthik R.",
      "avatarUrl": "https://avatars.githubusercontent.com/u/1010101?v=4",
      "department": "Computer Science & Engineering",
      "yearOfStudy": "3rd Year",
      "stats": {
        "connectionsCount": 42,
        "activeProjectsCount": 2,
        "upcomingEventsCount": 3,
        "codingStreakDays": 14
      }
    },
    "recentActivities": [
      {
        "id": "act-1",
        "icon": "✨",
        "type": "ACCOUNT_VERIFIED",
        "category": "Account",
        "title": "Joined Vynora Connect",
        "description": "Your student profile is active and verified for the campus community.",
        "status": "Verified",
        "timestamp": "2026-10-13T18:25:00.000Z",
        "relativeTime": "Just now",
        "targetUrl": "/profile"
      },
      {
        "id": "act-2",
        "icon": "💡",
        "type": "PROJECT_RECRUITING",
        "category": "Project",
        "title": "New Project Opportunity",
        "description": "Smart Attendance & Campus Navigation is looking for a React developer.",
        "status": "Open",
        "timestamp": "2026-10-13T16:30:00.000Z",
        "relativeTime": "2 hours ago",
        "targetUrl": "/projects/proj-1"
      },
      {
        "id": "act-3",
        "icon": "🤝",
        "type": "NETWORK_EXPANSION",
        "category": "Network",
        "title": "Network Expansion",
        "description": "3 students from Computer Science & Engineering joined your network.",
        "status": "Connected",
        "timestamp": "2026-10-12T14:00:00.000Z",
        "relativeTime": "Yesterday",
        "targetUrl": "/network"
      },
      {
        "id": "act-4",
        "icon": "🚀",
        "type": "HACKATHON_SUBMISSION",
        "category": "Hackathon",
        "title": "Hackathon Team Update",
        "description": "Team CyberGrid submitted the Round 1 idea for Smart India Hackathon 2026.",
        "status": "Submitted",
        "timestamp": "2026-10-11T10:15:00.000Z",
        "relativeTime": "2 days ago",
        "targetUrl": "/projects/proj-cybergrid"
      }
    ],
    "pulseFeed": [
      {
        "id": "pulse-1",
        "icon": "🔥",
        "type": "COLLABORATION_SPRINT",
        "category": "Collaboration",
        "title": "Dev Sprint: Open Source Week",
        "description": "Campus Coding Club merged 14 PRs into the college repository today.",
        "status": "Active",
        "timestamp": "2026-10-13T18:15:00.000Z",
        "relativeTime": "15m ago"
      },
      {
        "id": "pulse-2",
        "icon": "🏆",
        "type": "PROJECT_RECRUITING",
        "category": "Team Match",
        "title": "Hackathon Partner Request",
        "description": "Aarav Patel is seeking a UI/UX Figma designer for SIH 2026.",
        "status": "Recruiting",
        "timestamp": "2026-10-13T17:45:00.000Z",
        "relativeTime": "45m ago"
      },
      {
        "id": "pulse-3",
        "icon": "📚",
        "type": "RESOURCE_UPLOADED",
        "category": "Resource",
        "title": "Resource Shared: OS Exam PYQs",
        "description": "Handwritten notes for Operating Systems Unit 4 uploaded to repository.",
        "status": "New",
        "timestamp": "2026-10-13T15:30:00.000Z",
        "relativeTime": "3 hours ago"
      },
      {
        "id": "pulse-4",
        "icon": "🎯",
        "type": "OPPORTUNITY_POSTED",
        "category": "Career",
        "title": "Internship Opportunity Posted",
        "description": "Google Summer of Code prep group formed in Central Library room 2.",
        "status": "Trending",
        "timestamp": "2026-10-13T13:30:00.000Z",
        "relativeTime": "5 hours ago"
      }
    ],
    "upcomingEvents": [
      {
        "id": "evt-1",
        "title": "Vynora Campus Hackathon 2026",
        "category": "Hackathon",
        "date": "Oct 24, 2026",
        "isoStartDate": "2026-10-24T09:00:00.000Z",
        "location": "Tech Park Auditorium • Hybrid",
        "isUserRegistered": true
      },
      {
        "id": "evt-2",
        "title": "React & Frontend Placement Masterclass",
        "category": "Workshop",
        "date": "Oct 18, 2026",
        "isoStartDate": "2026-10-18T14:00:00.000Z",
        "location": "CSE Lab 402 • Room B",
        "isUserRegistered": false
      }
    ],
    "recentProjects": [
      {
        "id": "proj-1",
        "title": "Vynora Campus Assistant",
        "description": "An AI-powered timetable scheduler and campus navigation mobile app.",
        "technologies": ["React", "Node.js", "PostgreSQL", "Tailwind"],
        "teamStatus": "Looking for 1 Dev",
        "openRoles": ["React Developer"]
      },
      {
        "id": "proj-2",
        "title": "Decentralized Peer Study Hub",
        "description": "Web3 verified course note-sharing network with tokenized contributor karma.",
        "technologies": ["Solidity", "React", "IPFS", "Ethers.js"],
        "teamStatus": "Team Full",
        "openRoles": []
      }
    ],
    "opportunities": [
      {
        "id": "opp-1",
        "title": "Summer Frontend Engineering Intern",
        "organization": "Vynora Labs Inc.",
        "type": "Internship",
        "deadline": "Nov 15, 2026",
        "isoDeadline": "2026-11-15T23:59:59.000Z",
        "isExpiringSoon": false
      },
      {
        "id": "opp-2",
        "title": "Google Developer Student Club Core Team Lead",
        "organization": "GDSC Campus Chapter",
        "type": "Leadership",
        "deadline": "Oct 30, 2026",
        "isoDeadline": "2026-10-30T23:59:59.000Z",
        "isExpiringSoon": false
      }
    ]
  }
}
```

---

### 5.2 Standalone Feed Endpoint: `GET /api/v1/dashboard/activities`

Enables infinite scrolling or tab switching between **personal** activities and **campus pulse**.

* **Route:** `/api/v1/dashboard/activities`
* **Query Parameters:**
  * `feedType`: `"personal"` | `"pulse"` (default: `"personal"`)
  * `limit`: Number of items (default: `10`, max: `50`)
  * `cursor`: Last received activity ID for cursor pagination

#### Response Body:

```json
{
  "success": true,
  "data": [
    {
      "id": "act-670c1a2e4f1a230012a9b101",
      "icon": "✨",
      "type": "ACCOUNT_VERIFIED",
      "category": "Account",
      "title": "Joined Vynora Connect",
      "description": "Your student profile is active and verified for the campus community.",
      "status": "Verified",
      "timestamp": "2026-10-13T18:25:00.000Z",
      "relativeTime": "Just now",
      "targetUrl": "/profile"
    }
  ],
  "pagination": {
    "limit": 10,
    "hasMore": true,
    "nextCursor": "act-670c1a2e4f1a230012a9b101"
  }
}
```

---

## 6. Resilience, Caching & Edge Case Strategies

### 6.1 Partial Failure Resilience in Composite Endpoint
If one upstream service query encounters an unexpected error (e.g. the external opportunities catalog or LeetCode stats fetcher fails):
* The backend dashboard controller wraps sub-queries in `Promise.allSettled()`.
* Failed sub-sections return empty arrays `[]` rather than failing the entire dashboard request with HTTP 500.
* A lightweight `"warnings"` field may be returned for debugging:
  ```json
  {
    "warnings": [
      { "module": "opportunities", "message": "Failed to retrieve opportunities; serving empty preview." }
    ]
  }
  ```

### 6.2 Zero-State / Empty States
When a new student logs in:
* `recentActivities`: Returns `[]`. The client displays the empty state card (`"No recent activity found. New campus updates will appear here."`).
* `pulseFeed`: Always falls back to general college announcement activity objects.
* `upcomingEvents`: Displays `"No upcoming campus events scheduled."` with a link to the events directory.

### 6.3 Performance & Caching
* **Campus Pulse (`pulseFeed`):** Public across the university; cached in server memory (TTL: 60 seconds) to avoid database hammering.
* **Personal Dashboard:** Dynamic per student; database queries leverage compound indexed lookups (`{ actorId: 1, createdAt: -1 }`).

---

## 7. Summary for Team Review

* **Compatibility with Current Code:** Matches the exact props and data structures used in `client/src/components/home/`.
* **Action Item for Express Backend:** Implement `controllers/dashboardController.js` and `routes/dashboardRoutes.js` using the schema and response shapes defined above.
