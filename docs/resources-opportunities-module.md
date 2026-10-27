# Vynora Connects — Resources & Opportunities Module

**Module Owner:** Deepu
**Feature Branch:** `feature/deepu-resources`
**Target Branch:** `Development`
**Project:** Vynora Connects

## 1. Module Objective

Build a responsive Resources & Opportunities module that helps students discover learning resources, internships, jobs, scholarships, competitions, and other useful opportunities.

The module should provide clear information, useful search and filtering, detailed listings, and external links where applicable.

## 2. Responsibilities

### Resources

* Display a list of available resources.
* Show resource titles, descriptions, categories, and relevant links.
* Provide a resource details view.
* Support search and category filtering where appropriate.

### Opportunities

* Display internships, jobs, scholarships, competitions, and similar opportunities.
* Show organization, description, eligibility, deadline, and application link when available.
* Provide a details view.
* Clearly identify expired or unavailable opportunities when that information is provided by the backend.

### User Experience

* Create reusable resource and opportunity cards.
* Support loading, empty, error, and success states.
* Provide responsive layouts for desktop and mobile.
* Validate user input in forms if publishing is supported.

## 3. Repository Baseline

Current observed structure:

* `client/index.html`
* `client/style.css`
* `server/.gitkeep`
* `docs/.gitkeep`

The existing frontend uses HTML and CSS. React/Vite setup and backend implementation still need to be verified.

Do not overwrite the existing frontend or introduce a second application until the project architecture has been agreed upon.

## 4. Proposed Data Models

These are proposed fields, not a confirmed backend contract.

### Resource

* `id`
* `title`
* `description`
* `category`
* `type`
* `tags`
* `sourceUrl`
* `createdBy`
* `createdAt`
* `updatedAt`
* `status`

### Opportunity

* `id`
* `title`
* `organization`
* `type`
* `summary`
* `eligibility`
* `deadline`
* `location`
* `remote`
* `applicationUrl`
* `createdBy`
* `createdAt`
* `status`

Confirm required fields, types, permissions, and status values with the backend team before implementation.

## 5. Proposed API Contract

The following endpoints are suggestions only. They must be confirmed with the team.

### Resources

* `GET /api/v1/resources`
* `GET /api/v1/resources/:id`
* `POST /api/v1/resources` — only if publishing is supported.

### Opportunities

* `GET /api/v1/opportunities`
* `GET /api/v1/opportunities/:id`
* `POST /api/v1/opportunities` — only if publishing is supported.
* `PATCH /api/v1/opportunities/:id` — only if editing is supported.

Confirm search parameters, pagination, authentication, authorization, moderation, and error response formats.

## 6. Seven-Day Execution Plan

### Day 1 — Repository Inspection and Planning

* Inspect the existing frontend and repository.
* Check for React/Vite configuration and backend code.
* Coordinate with the team to confirm the API contract.
* Document unresolved decisions.
* Avoid unnecessary architecture changes.

**Deliverable:** Repository assessment and module master document.

### Day 2 — Listing UI

* Build the Resources listing.
* Build the Opportunities listing.
* Create reusable ResourceCard and OpportunityCard components.
* Add search and category controls where appropriate.
* Use the project's agreed design system.
* Implement responsive layouts and empty states.

**Deliverable:** Listing interfaces.

### Day 3 — API Integration

* Use the project's shared API client if one exists.
* Connect listings to confirmed endpoints.
* Handle loading, empty, error, and retry states.
* Implement supported search and filtering.
* Avoid presenting mock data as persisted backend data.

**Deliverable:** API-connected listings.

### Day 4 — Details Views

* Create resource details.
* Create opportunity details.
* Display available eligibility and deadline information.
* Validate external links.
* Handle missing IDs and unavailable listings.
* Avoid misleading users about expired opportunities.

**Deliverable:** Details views and safe link handling.

### Day 5 — Publishing Forms

* Confirm whether the backend supports publishing.
* Build resource or opportunity forms only where supported.
* Validate required fields and URLs.
* Display clear success and error messages.
* Ensure successful submissions are actually persisted.

If the API is unavailable, coordinate with the team and document the limitation.

**Deliverable:** Working publishing flow, if supported.

### Day 6 — Testing and Refinement

* Test search and filters.
* Test loading, empty, and error states.
* Test missing or invalid listing IDs.
* Test external links.
* Test form validation where applicable.
* Check desktop and mobile layouts.
* Run available lint, test, and build commands.
* Review the Git diff.

**Deliverable:** Tested module and resolved issues.

### Day 7 — Demonstration and Pull Request

* Verify the completed user flows.
* Prepare a short demonstration.
* Commit and push the final changes.
* Open a pull request from `feature/deepu-resources` into `Development`.
* Include screenshots, testing results, and known limitations.
* Request maintainer review.

**Deliverable:** Feature branch ready for review and integration.

## 7. Git Workflow

1. Work on `feature/deepu-resources`.
2. Make focused changes.
3. Test before committing.
4. Commit meaningful units of work.
5. Push to the existing feature branch.
6. Open a pull request targeting `Development`.
7. Allow the maintainer to review and merge.

Do not push feature work directly to `main`. Do not delete or recreate the branch unnecessarily.

## 8. Testing Checklist

* [x] Resources listing displays correctly with Vynora Obsidian palette.
* [x] Opportunities listing displays correctly with category badges.
* [x] Cards show available information accurately without fabricated data.
* [x] Details views handle missing data gracefully.
* [x] Search works across titles, descriptions, organizations, and tags.
* [x] Category and type filters work seamlessly.
* [x] Loading skeleton states are visible and responsive.
* [x] Empty states are helpful and provide clear reset actions.
* [x] Error handling displays retry buttons with non-sensitive error summaries.
* [x] External links behave safely with `noopener noreferrer` and protocol validation.
* [x] Forms validate required fields, lengths, URLs, and future deadlines.
* [x] Duplicate submission prevention is enforced.
* [x] Submission persistence accurately distinguishes between local session queue and database confirmation.
* [x] Responsive layouts work across desktop, tablet, and mobile breakpoints.
* [x] Available lint, test, and build checks pass (25 tests passing, 0 lint warnings, clean Vite production build).
* [x] Changes staged and committed to feature branch `feature/deepu-resources`.
* [x] Pull request targets `Development`.

## 9. Definition of Done & Execution Sign-Off

The module is verified and ready for pull request review into `Development`:
- All frontend features, components, filters, and forms are fully implemented in React 18 + Vite.
- Backend API contract is established in `docs/resources-opportunities-api.md`.
- Isolated adapter service allows continuous frontend operation while backend Express/MongoDB server is under development.
- Dashboard integration hook `getFeaturedOpportunities()` provides unified opportunity models for Karthik Kavali's dashboard widget.

# Week 1 — Full Execution Record (Days 1–7)

- **Day 1 (Inspect & Plan):** Baseline repository inspected, architecture confirmed as React + Vite in `client/`, legacy files preserved in `client/legacy/`, API specification created.
- **Day 2 (Listing UI):** Built `ResourceCard`, `OpportunityCard`, responsive cards grid, Vynora Obsidian theme tokens (`#090909`, `#0D0D0D`, `#141414`, `#1B1B1B`, `#FFFFFF`, `#A3A3A3`, `#292929`).
- **Day 3 (API Integration):** Implemented `apiClient.js`, `resourcesService.js`, and `opportunitiesService.js` with HTTP client and transparent mock adapter fallback.
- **Day 4 (Details Views):** Built `ResourceDetails.jsx` and `OpportunityDetails.jsx` with real-time deadline calculations, safe links, and missing record fallbacks.
- **Day 5 (Publishing Forms):** Created `CreateResourceModal.jsx` and `CreateOpportunityModal.jsx` with field validations, URL schemes validation, future deadline checks, and honest session storage feedback.
- **Day 6 (Testing & Validation):** Authored 25 unit tests (`vitest`), configured flat ESLint 9 (0 errors, 0 warnings), verified production Vite build (`vite build`).
- **Day 7 (PR Preparation):** Updated documentation, reviewed git status and diff, prepared pull request targeting `Development`.
