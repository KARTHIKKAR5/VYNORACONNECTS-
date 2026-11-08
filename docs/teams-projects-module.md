# Vynora Connects — Teams & Projects Module Specification

**Module Owner:** Varshitha  
**Feature Branch:** `feature/varsh-teams-projects`  
**Target Branch:** `Development`  
**Project:** Vynora Connects  

---

## 1. Module Objective

Empower college students to discover collaborative projects, showcase initiatives, form multidisciplinary teams across colleges, advertise skill gaps, and manage team membership with clear role permissions.

---

## 2. Core Responsibilities

1. **Project Discovery & Catalog:**
   - Display active projects with filtering by category, technology tags, and recruitment status.
   - Project cards showcasing lead contributor, tags, team size, and available openings.
   - Comprehensive project details modal.

2. **Project Creation & Management:**
   - Allow students to launch new projects with title, tagline, description, tech stack tags, and repository links.
   - Define open recruitment positions with required skills and seat counts.

3. **Application & Join Workflows:**
   - Enable students to submit join requests to open roles with tailored pitch messages.
   - Prevent duplicate active applications.

4. **Team & Applicant Management:**
   - Provide Project Leads with an Applicant Management dashboard to review pitch messages, accept candidates, and assign roles.
   - Automatically update team roster upon candidate acceptance.

---

## 3. Architecture & Service Adapter Strategy

To support seamless frontend testing and continuous delivery while the backend server is in active development:
- **`projectsService.js`** provides an adapter pattern with an active HTTP client that attempts `/api/v1/projects`.
- When backend is offline, the service falls back gracefully to a robust in-memory mock store containing realistic student hackathon and development projects.
- Clear indicator in UI communicates whether data is from the live API or local session mock.
- User inputs undergo strict client-side validation according to the contract in `docs/teams-projects-api.md`.

---

## 4. Definition of Done & Quality Checklist

- [x] React 18 + Vite frontend foundation established.
- [x] Black, white, and blue design system with CSS custom properties.
- [x] API contract and data model documented in `docs/teams-projects-api.md`.
- [ ] Dedicated `projectsService.js` adapter implemented with validation rules.
- [ ] Project cards, filter bar, details modal, and creation forms built.
- [ ] Join request modal and applicant manager interface functional.
- [ ] Zero lint warnings, zero build errors.
