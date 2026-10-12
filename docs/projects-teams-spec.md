# Projects and Teams — Specification

## 1. Project Fields

Each project must contain the following information.

| Field | Purpose | Example |
|---|---|---|
| `id` | Unique project ID | `PRJ001` |
| `title` | Project name | Smart Campus Assistant |
| `description` | Project details | Helps students find campus services |
| `ownerId` | ID of the student who created it | `STU101` |
| `collegeName` | Owner's college | SR University |
| `technologies` | Languages and tools used | Python, React |
| `category` | Project type | AI/ML |
| `visibility` | Who can view the project | Public |
| `recruitingStatus` | Whether new members are accepted | Open |
| `teamId` | ID of the associated team | TEAM001 |
| `createdAt` | Creation date and time | Timestamp |
| `updatedAt` | Last update date and time | Timestamp |

These fields help students discover projects across colleges and understand the project's purpose, technologies, and recruitment status.

## 2. Team Roles

| Role | Responsibilities |
|---|---|
| Owner | Creates the project, manages settings, invites members, and reviews join requests |
| Admin | Helps manage team members and project details within assigned permissions |
| Member | Participates in project work |
| Viewer | Can view permitted project information but cannot edit it |

### Team Rules

- Every project must have one owner.
- A project can have multiple admins and members.
- Only authorized users can edit project details or manage membership.
- Ownership must be transferred before the owner leaves an active project.

## 3. Project Visibility States

Visibility determines who can view a project.

| State | Meaning |
|---|---|
| `Public` | Students from any college can discover the project |
| `CollegeOnly` | Only students from the selected college can view it |
| `Private` | Only authorized team members and permitted users can view it |

Visibility is separate from recruiting status. A public project can be closed to new members.

## 4. Recruiting States

Recruiting determines whether a project accepts new team members.

| State | Meaning |
|---|---|
| `Open` | Eligible students can submit join requests |
| `Paused` | Recruitment is temporarily stopped |
| `Closed` | No new members are being accepted |

### Recruiting Rules

- Only projects with `Open` recruiting status accept new requests.
- Paused or closed projects must reject new join requests.
- Existing requests keep their current status unless explicitly updated.
- Only the owner or an authorized admin can change recruiting status.

## 5. Join-Request States

| State | Meaning |
|---|---|
| `Pending` | Waiting for a decision |
| `Accepted` | Request approved |
| `Rejected` | Request declined |
| `Withdrawn` | Student cancelled the request |

### Join-Request Fields

| Field | Purpose |
|---|---|
| `id` | Unique request ID |
| `projectId` | Project the student wants to join |
| `studentId` | Student submitting the request |
| `message` | Reason for joining |
| `status` | Current request state |
| `createdAt` | Request submission date and time |
| `reviewedBy` | User who reviewed the request |
| `reviewedAt` | Review date and time |

### Join-Request Rules

- A student cannot have duplicate active requests for the same project.
- The owner or an authorized admin can accept or reject a pending request.
- A student can withdraw their pending request.
- When accepted, the student becomes a team member.
- New requests must be blocked when recruiting is paused or closed.

## 6. Basic Workflow

1. A student discovers a project they are allowed to view.
2. The system checks whether recruiting is open.
3. The student submits a join request.
4. The request status becomes `Pending`.
5. The owner or authorized admin reviews the request.
6. If accepted, the student becomes a team member.
7. If rejected, the student is not added to the team.

## 7. Scope of This Task

This document defines the project fields, team roles, visibility states, recruiting states, join-request states, and their rules.

**Note:** This is a design specification. Backend APIs, database integration, authentication, and actual join-request functionality will be implemented in later tasks.