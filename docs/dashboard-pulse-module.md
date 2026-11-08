# Vynora Connect — Home Dashboard & Vynora Pulse Module Overview

**Module Owner:** Karthik  
**Target Delivery:** Demonstration Ready (Week 1 / Week 2 Milestone)  
**Status:** Feature Complete, Verified & Tested

---

## 1. Module Scope

The module delivers the core student experience:
1. **Shared AppShell:** High-tier desktop and mobile responsive layout with navigation, search entry, unread counters, notification popovers, live backend indicators, and user session management.
2. **Home Dashboard:** Personalized command center showing the student's identity, key metrics, quick navigation actions, campus events, team collaborations, opportunities, resources, recommendations, and mentorship.
3. **Vynora Pulse:** Living, interactive campus feed showing real-time achievements, announcements, and milestones from across connected universities.
4. **Resilient Backend Integration:** A fully realized Node.js + Express backend with MongoDB Atlas persistence, safe DTO projections, robust in-memory fallbacks, and comprehensive automated test suites.

---

## 2. Component Architecture

```
client/src/
├── components/
│   ├── dashboard/
│   │   ├── WelcomeBanner.jsx
│   │   ├── QuickActions.jsx
│   │   ├── DashboardStats.jsx
│   │   ├── UpcomingEventsSection.jsx
│   │   ├── CollaborationProjectsSection.jsx
│   │   ├── StudentRecommendationsSection.jsx
│   │   ├── MentorshipPreviewSection.jsx
│   │   ├── RecentOpportunitiesSection.jsx
│   │   ├── RecentResourcesSection.jsx
│   │   └── InteractiveModals.jsx
│   ├── pulse/
│   │   ├── PulseFeed.jsx
│   │   ├── PulseCard.jsx
│   │   └── PulseFilters.jsx
│   └── layout/
│       └── AppShell.jsx
├── pages/
│   ├── DashboardPage.jsx
│   └── ComingSoonModule.jsx
└── services/
    ├── dashboardService.js
    └── pulseService.js
```

---

## 3. Demonstration Script & Verification

1. **Start Backend Server:**
   ```bash
   npm --prefix server run dev
   ```
   *Logs confirm Express server listening on port 5000 and MongoDB connection status.*
2. **Start Client Application:**
   ```bash
   npm --prefix client run dev
   ```
   *AppShell loads on port 3000 with `Live Backend API` status indicator active.*
3. **Demonstrate Dashboard:**
   - Review personalized welcome banner for `Karthik`.
   - Inspect quick actions (click *Create a Project* to trigger modal).
   - Review 6 KPI statistic cards and verify navigation links.
   - Interact with Pulse feed filters (*For You*, *Opportunities*, *Events*, *Projects*).
   - Click *Cheer* (like) on any pulse item to show stateful feedback.
   - Click *Connect* on student recommendations to trigger *Request Sent* toggle.
   - Click *View Event* to launch interactive free pass registration modal.
   - Click *View Project* to inspect team tech stack and apply for open roles.
   - Click *View Profile* on mentors to book an office hour session.
4. **Demonstrate Partner Modules:**
   - Click *Opportunities* in the sidebar to review Deepu's opportunities module.
   - Click *Resources* in the sidebar to review Deepu's study materials module.
   - Click *Network*, *Teams*, or *Events* to review polished teammate status pages with clear return-to-dashboard controls.
