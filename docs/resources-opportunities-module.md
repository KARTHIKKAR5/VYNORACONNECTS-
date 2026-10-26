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

* [ ] Resources listing displays correctly.
* [ ] Opportunities listing displays correctly.
* [ ] Cards show available information accurately.
* [ ] Details views handle missing data.
* [ ] Search works if supported.
* [ ] Filters work if supported.
* [ ] Loading states are visible.
* [ ] Empty states are helpful.
* [ ] Errors are handled clearly.
* [ ] External links behave safely.
* [ ] Forms validate input if implemented.
* [ ] Authentication and authorization are enforced server-side where applicable.
* [ ] Responsive layouts work.
* [ ] Available lint, test, and build checks pass.
* [ ] Changes are pushed to the feature branch.
* [ ] Pull request targets `Development`.

## 9. Definition of Done

The module is ready for review when its agreed features are implemented, data is handled according to the confirmed API contract, user-facing states are covered, relevant checks have been run, and the changes are available in a pull request targeting `Development`.

Any unfinished backend integration or unsupported functionality must be documented honestly.

## 10. Pending Decisions

* [ ] Confirm frontend architecture.
* [ ] Confirm backend framework and API availability.
* [ ] Confirm resource and opportunity fields.
* [ ] Confirm endpoint paths and response formats.
* [ ] Confirm authentication and publishing permissions.
* [ ] Confirm search, filtering, and pagination support.
* [ ] Confirm moderation and status rules.
* [ ] Confirm whether bookmarks are in scope.

# Day 1 — Repository Inspection Record

## Objective

Inspect the existing repository, understand the current frontend structure, and identify the decisions required before implementing the Resources & Opportunities module.

## Findings

* The repository is connected to GitHub.
* The active feature branch is `feature/deepu-resources`.
* The branch tracks `origin/feature/deepu-resources`.
* The current frontend contains `client/index.html` and `client/style.css`.
* The HTML references `client/script.js`, but that file is missing.
* No `package.json` was found during the repository search.
* The `server` directory currently contains `.gitkeep`.
* The README describes React, Vite, Node.js, Express and MongoDB as the planned technology stack.
* The repository's current state does not establish whether another teammate is already implementing the shared application architecture.

## Decisions Required

1. Confirm the shared frontend architecture and application location.
2. Confirm backend ownership and API availability.
3. Agree on resource and opportunity data fields.
4. Confirm search, filtering and pagination behavior.
5. Confirm authentication, publishing permissions and moderation.
6. Confirm API error formats and listing status rules.

## Day 1 Completion Status

**Repository inspection:** Completed.

**Module documentation:** Created; update this record with team decisions.

**Frontend architecture confirmation:** Pending team confirmation.

**API contract confirmation:** Pending team confirmation.

## Next Step

After the team confirms the architecture and API contract, implement the listing interface using the agreed project structure. Do not replace existing application files or assume that proposed endpoints are available.
