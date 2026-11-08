# Vynora Connects — Opportunities & Resources Module Specification

**Module Owner:** Deepu (Manideepika)  
**Feature Branch:** `feature/deepu-resources-opportunities`  
**Target Branch:** `Development`  
**Project:** Vynora Connects  

---

## 1. Module Objective & Scope

The **Opportunities & Resources** module provides a unified academic and career growth hub for students across colleges.

### Core User Capabilities:
1. **Learning Resources:** Browse, search, filter, and discover vetted study notes, roadmaps, textbooks, interview prep, and cheat sheets across engineering branches.
2. **Opportunities Hub:** Discover verified hackathons, internships, coding contests, scholarships, and case competitions with real-time deadline countdowns.
3. **Private Saved Tracker (Bookmarks):** Save both learning resources and career opportunities to a strictly private student tracker with application progress states (`saved`, `interested`, `planning`, `applied`, `shortlisted`, `rejected`, `selected`).
4. **Student Contributions & My Submissions:** Submit study materials and opportunities with strict validation. Submissions enter `pending review` for centralized moderation by Revanth's trust team.

---

## 2. Architectural Guardrails & Team Boundaries

| Area | Integration Rule |
|---|---|
| **Express & Database** | Uses shared Express router mount and shared MongoDB Atlas connection. No duplicate server or database connection. |
| **Authentication** | Authenticated actor derived from `req.user._id` (via shared JWT middleware). Never trusts `userId`, `role`, or `status` from request payload. |
| **Moderation (Revanth)** | Student submissions default to `status: 'pending'`. "Report Listing" actions forward to `POST /api/v1/moderation/reports`. |
| **Clubs & Events (Sindhu)**| Deepu owns general opportunities. Official college club events link to Sindhu's canonical event records to prevent duplicate drifting records. |
| **Home Dashboard (Karthik)**| Deepu's service exports `getFeaturedOpportunities()` matching Karthik's exact `OpportunityPreview` contract from `docs/dashboard-api-needs.md`. |
| **Notifications (Siri)** | Deadline reminder registrations emit to Siri's notification service (`/api/v1/notifications/reminders`) without building a parallel email scheduler. |
| **Data Persistence** | Full MongoDB persistence via Mongoose schemas. Mock/localStorage data is strictly a temporary offline development fallback. |
| **Privacy Isolation** | Saved items (`Bookmark`) enforce a unique compound index on `{ userId, itemType, itemId }`. Students can only view or mutate their own saved items. |

---

## 3. Definition of Done Checklist

- [x] Specifications and API contracts documented in `docs/`.
- [x] Backend Mongoose schemas, controllers, and routes in `server/`.
- [x] Unified Bookmark data model supporting both resources and opportunities.
- [x] Client services (`opportunitiesService.js`, `resourcesService.js`) with API client and offline fallback.
- [x] Full UI components for Resources, Opportunities, Saved Tracker, and Submissions.
- [x] Centralized moderation reporting dialog.
- [x] Integration into shared AppShell navigation under `resources`.
- [x] Automated unit test suite with high test coverage.
- [x] Production build validation passes.

