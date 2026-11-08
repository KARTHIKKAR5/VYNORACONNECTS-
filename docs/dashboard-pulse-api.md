# Vynora Connect — Dashboard & Pulse API Contract & Integration Specification

**Module Owner:** Karthik (Home Dashboard & Vynora Pulse)  
**Target Integration Branch:** `Development`  
**Feature Branch:** `feature/karthik-dashboard`  
**Document Status:** Approved Specification & Live Implementation Baseline  
**Backend Status:** Implemented in `server/` (Node.js + Express + MongoDB Mongoose)

---

## 1. Overview & Architectural Strategy

The Home Dashboard & Vynora Pulse module serves as the primary entry point and living heartbeat of Vynora Connect. It aggregates core statistics, opportunities, upcoming campus events, multidisciplinary projects seeking teammates, mentorship bookings, notifications, and student recommendations from across partner campuses into a unified SaaS experience.

### Fault-Tolerant Cross-Module Aggregation
1. **Domain Isolation:** Each integrated module domain (Ram, Deepu, Varsh, Sindhu, Surya, Siri, Revanth) is called independently inside `modules.adapter.js`. If any partner API is temporarily offline, the dashboard provides a graceful fallback rather than failing the page request.
2. **Authoritative Auth:** All requests validate the authenticated user from the server context (via JWT or development demo context). Client-supplied user IDs are never trusted blindly.
3. **Privacy Sanitization:** Revanth's trust and moderation rules are strictly enforced at the controller and mapper levels: private messages, confidential projects, and contact numbers are stripped before payloads leave the server.

---

## 2. API Endpoints

### 2.1 System Health
`GET /api/v1/health`
- **Auth:** Public
- **Response:**
```json
{
  "success": true,
  "data": {
    "status": "operational",
    "service": "Vynora Connect Backend API",
    "version": "1.0.0",
    "database": "connected | offline_memory_mode",
    "uptime": 128.4,
    "timestamp": "2026-11-09T00:00:00.000Z"
  }
}
```

### 2.2 Home Dashboard Aggregation
`GET /api/v1/dashboard`
- **Auth:** Required (`Authorization: Bearer <token>`)
- **Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr-karthik",
      "name": "Karthik",
      "college": "SR University",
      "department": "Computer Science & Engineering",
      "graduationYear": 2026,
      "avatar": "https://...",
      "skills": ["React", "Node.js", "Express", "MongoDB", "System Design"]
    },
    "stats": {
      "connections": 48,
      "pendingRequests": 3,
      "savedOpportunities": 7,
      "upcomingEvents": 2,
      "unreadMessages": 5,
      "activeProjects": 4
    },
    "upcomingEvents": [...],
    "collaborationProjects": [...],
    "recommendations": [...],
    "opportunities": [...],
    "resources": [...],
    "mentors": [...],
    "notifications": [...],
    "preferences": {...}
  },
  "meta": {
    "timestamp": "2026-11-09T00:00:00.000Z",
    "version": "1.0.0"
  }
}
```

### 2.3 User Preferences
`GET /api/v1/dashboard/preferences`  
`PATCH /api/v1/dashboard/preferences`
- **Payload (`PATCH`):**
```json
{
  "dismissedOnboardingTasks": ["task-1"],
  "hiddenPulseItemIds": ["act-hidden-1"],
  "sectionOrder": ["welcome", "stats", "pulse", "opportunities", "events", "projects"]
}
```

### 2.4 Vynora Pulse Activity Stream
`GET /api/v1/pulse`
- **Query Parameters:**
  - `filter` (optional): `all` | `connections` | `opportunities` | `events` | `projects` | `resources`
  - `page` (optional, default: 1)
  - `limit` (optional, default: 10, max: 50)
- **Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "pulse-act-01",
      "type": "opportunity_published",
      "category": "opportunity",
      "actor": {
        "id": "org-google",
        "name": "Google University Relations",
        "college": "Industry Partner",
        "avatar": "https://..."
      },
      "activityDescription": "published a new summer engineering internship",
      "targetTitle": "Software Engineering Summer Intern 2027",
      "summary": "High-scale distributed systems roles...",
      "badge": "Internship",
      "previewImage": null,
      "timestamp": "2026-11-08T23:42:00.000Z",
      "action": {
        "label": "View Opportunity",
        "actionType": "navigate",
        "targetTab": "opportunities",
        "targetId": "opp-201"
      },
      "metrics": {
        "likes": 34,
        "comments": 5
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 8,
    "totalPages": 1,
    "hasMore": false,
    "filter": "all"
  }
}
```
