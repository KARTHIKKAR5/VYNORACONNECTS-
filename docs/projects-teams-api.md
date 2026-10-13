# Vynora Projects & Teams API Draft

## 1. Purpose

This document defines the proposed API endpoints for creating and managing projects and teams, handling membership, controlling recruitment, and processing join requests.

**Status:** Draft for team review. These endpoints are proposed designs, not yet implemented backend routes.

## 2. Project Schema

| Field | Type | Description |
|---|---|---|
| `id` | String | Unique project ID |
| `ownerId` | String | ID of the project owner |
| `title` | String | Project name |
| `description` | String | Project details |
| `technologies` | String array | Technologies used |
| `category` | String | Project category |
| `visibility` | Enum | `Public`, `CollegeOnly`, `Private` |
| `recruitingStatus` | Enum | `Open`, `Paused`, `Closed` |
| `teamId` | String or null | Associated team ID |
| `createdAt` | DateTime | Creation timestamp |
| `updatedAt` | DateTime | Last update timestamp |

## 3. Team Schema

| Field | Type | Description |
|---|---|---|
| `id` | String | Unique team ID |
| `ownerId` | String | ID of the team owner |
| `name` | String | Team name |
| `description` | String | Team purpose |
| `collegeId` | String | Associated college ID |
| `visibility` | Enum | `Public`, `CollegeOnly`, `Private` |
| `status` | Enum | `Active`, `Forming` |
| `createdAt` | DateTime | Creation timestamp |
| `updatedAt` | DateTime | Last update timestamp |

## 4. Member Roles

Supported roles:

- `Owner` — owns and manages the team or project.
- `Admin` — manages permitted team/project activities.
- `Member` — participates in the team or project.
- `Viewer` — has read-only access where permitted.

A membership record should contain `userId`, `teamId` or `projectId`, `role`, and `joinedAt`.

The owner should be represented consistently in the membership records or ownership fields. The backend must prevent unauthorized role changes and accidental removal of the final owner.

## 5. Project Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/projects` | Create a project |
| GET | `/projects` | List projects visible to the current user |
| GET | `/projects/:id` | Get project details |
| PATCH | `/projects/:id` | Update permitted project fields |
| DELETE | `/projects/:id` | Delete a project if authorized |

## 6. Team Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/teams` | Create a team |
| GET | `/teams` | List teams visible to the current user |
| GET | `/teams/:id` | Get team details |
| PATCH | `/teams/:id` | Update permitted team fields |
| DELETE | `/teams/:id` | Delete a team if authorized |

## 7. Membership Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/teams/:id/members` | List team members |
| POST | `/teams/:id/members` | Add a member when authorized |
| PATCH | `/teams/:id/members/:userId` | Update a member's role |
| DELETE | `/teams/:id/members/:userId` | Remove a member |
| GET | `/projects/:id/members` | List project members |
| POST | `/projects/:id/members` | Add a project member when authorized |
| PATCH | `/projects/:id/members/:userId` | Update a project member's role |
| DELETE | `/projects/:id/members/:userId` | Remove a project member |

The backend must verify permissions for every membership operation. A user must not be able to grant themselves an Owner or Admin role.

## 8. Recruiting Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| PATCH | `/projects/:id/recruiting-status` | Set status to `Open`, `Paused`, or `Closed` |

Only an authorized owner or admin should be allowed to change recruiting status. A join request should be accepted only when recruitment is open and the requester is eligible.

## 9. Join-Request Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/projects/:id/join-requests` | Submit a join request |
| GET | `/projects/:id/join-requests` | View requests if authorized |
| PATCH | `/projects/:id/join-requests/:requestId` | Accept or reject a request |
| DELETE | `/projects/:id/join-requests/:requestId` | Withdraw a pending request |


| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/teams/:id/join-requests` | Submit a team join request |
| `GET` | `/teams/:id/join-requests` | View join requests (authorized users only) |
| `PATCH` | `/teams/:id/join-requests/:requestId` | Accept or reject a join request |
| `DELETE` | `/teams/:id/join-requests/:requestId` | Withdraw a pending join request |


Supported states: `Pending`, `Accepted`, `Rejected`, `Withdrawn`.

Rules:
- Only eligible users can submit requests.
- Duplicate pending requests should be prevented.
- Only authorized owners/admins can accept or reject requests.
- A user can withdraw their own pending request.
- Acceptance should create membership and assign an allowed role.
- The backend must check recruiting status and visibility before processing a request.
- Team join requests must follow the team's visibility and membership rules. Only authorized owners/admins can accept or reject requests.

## 10. Request and Response Examples

### Create a project

`POST /projects`

Request body:

```json
{
  "title": "Smart Campus Assistant",
  "description": "A platform for finding campus services.",
  "technologies": ["React", "Python"],
  "visibility": "Public",
  "recruitingStatus": "Open"
}
```

The authenticated user's ID should be used as `ownerId` by the backend. The client must not be trusted to choose another user's ID.

Example response:

```json
{
  "id": "project_101",
  "ownerId": "user_42",
  "title": "Smart Campus Assistant",
  "description": "A platform for finding campus services.",
  "technologies": ["React", "Python"],
  "visibility": "Public",
  "recruitingStatus": "Open"
}
```

### Submit a join request

`POST /projects/project_101/join-requests`

Request body:

```json
{
  "message": "I would like to contribute to the project."
}
```

The authenticated user's ID and the initial `Pending` state should be set by the backend.

## 11. Validation and Error Handling

- `400 Bad Request` — invalid fields or enum values.
- `401 Unauthorized` — missing or invalid authentication.
- `403 Forbidden` — insufficient permissions.
- `404 Not Found` — project, team, or request does not exist or is not accessible.
- `409 Conflict` — duplicate pending request or conflicting membership operation.
- `201 Created` — resource or request created successfully.
- `200 OK` — successful read or update.
- `204 No Content` — successful deletion.

## 12. Security and Access Rules

- Authenticate users before protected operations.
- Derive `ownerId` and requester IDs from the authenticated session/token.
- Enforce visibility and college-access rules on the backend, not just in the frontend.
- Check authorization for every update, deletion, membership change, and join-request decision.
- Validate all inputs and allowed enum values.
- Keep the final implementation consistent with the team's authentication and database design.

## 13. Implementation Status

This document is an API draft for review. It does not mean the endpoints or database have been implemented. Route names, database relationships, authentication details, and team conventions must be confirmed before implementation.