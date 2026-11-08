# Vynora Connect — Platform Owner Admin & Moderation Module

> **Role Authority:** Highest-authority Platform Owner (`Platform Owner / Revanth`)
> **Workspace:** `D:\vynora\owner-admin`
> **Working Branch:** `feature/revanth-admin`

---

## 1. Module Overview & Purpose

**Vynora Connect** is an inter-collegiate student community platform linking campus organizations, developer guilds, and project collaborations across universities.

The **Owner Admin & Moderation Module** serves as the central administrative cockpit for the **Platform Owner**. Unlike club administrators or normal students whose permissions are strictly scoped to individual student organizations, the Platform Owner oversees:
1. **Global Platform Governance:** Monitoring multi-campus user growth, platform activity telemetry, and health metrics.
2. **Institutional College Verification:** Validating AISHE codes, statutory accreditation, official university email domains, and registrar credentials before onboarding colleges.
3. **Club Verification:** Auditing student club charters, faculty advisor sponsorships, and category classifications, ensuring strict linkage to verified colleges.
4. **Club Admin Applications & Scoped Assignments:** Processing student leadership requests and granting authority strictly scoped to specific student clubs (preventing privilege escalation).
5. **User Governance:** Inspecting student directories across campuses, applying temporary/permanent account suspensions, cooling periods, and restrictions.
6. **Incident Moderation:** Resolving harassment, phishing, spam, impersonation, and policy flags with mandatory audit trail notes.
7. **Support Helpdesk:** Threaded conversation support with students and faculty coordinators.
8. **Security Audit Trail:** Immutable, append-only chronological log of all administrative actions.
9. **Platform & Safety Settings:** Managing global moderation thresholds, registration locks, and notification dispatch webhooks.

---

## 2. Technology Stack

- **Framework:** React 18.3.1
- **Build Tool:** Vite 5.4.10
- **Routing:** React Router DOM 6.28.0 (Client-side single-page application routing)
- **Icons:** Lucide React 0.460.0
- **Analytics & Data Visualizations:** Recharts 2.13.3 (AreaChart, BarChart, ResponsiveContainer)
- **Styling:** Modular CSS custom properties with SaaS charcoal-navy sidebar (`#0F172A`) and clean slate canvas (`#F8FAFC`)
- **Testing:** Node v24 built-in test runner (`node:test` & `node:assert`)

---

## 3. Project Structure

```
owner-admin/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   │   ├── ConfirmModal.jsx        # Reusable action confirmation modal
│   │   │   ├── Pagination.jsx          # Accessible table pagination
│   │   │   ├── ReasonModal.jsx         # Mandatory audit reason modal
│   │   │   └── StatusBadge.jsx         # Uniform color-coded status badges
│   │   ├── layout/
│   │   │   ├── DemoBanner.jsx          # Global demonstration status banner
│   │   │   ├── Sidebar.jsx             # Collapsible / mobile responsive drawer
│   │   │   └── Topbar.jsx              # Search, notification center, profile menu
│   │   └── modals/
│   │       ├── ApplicationDetailModal.jsx # Review candidate & approve assignment
│   │       ├── AuditDetailModal.jsx       # Read-only audit log payload viewer
│   │       ├── ClubDetailModal.jsx        # Club charter and advisor reviewer
│   │       ├── CollegeDetailModal.jsx     # Institutional AISHE & document viewer
│   │       ├── GrantAssignmentModal.jsx   # Scoped club admin assignment form
│   │       ├── ReportDetailModal.jsx      # Moderation incident action console
│   │       ├── TicketDrawerModal.jsx      # Support ticket conversation thread
│   │       └── UserDetailModal.jsx        # Student profile & suspension controls
│   ├── context/
│   │   └── ToastContext.jsx            # Global floating toast notifications
│   ├── data/
│   │   └── mockData.js                 # Realistic demonstration mock database
│   ├── pages/
│   │   ├── Overview/                   # 10 summary cards + Recharts analytics
│   │   ├── CollegeVerification/        # Institutional onboarding queue
│   │   ├── ClubVerification/           # Student club verification directory
│   │   ├── ClubAdminApplications/      # Leadership application reviews
│   │   ├── ClubAdminAssignments/       # Scoped privilege assignment governance
│   │   ├── UserManagement/             # Directory, suspension & restrictions
│   │   ├── ReportsModeration/          # Flagged content & incident resolution
│   │   ├── SupportTickets/             # Interactive student helpdesk threads
│   │   ├── AuditLogs/                  # Immutable tamper-evident audit trail
│   │   └── Settings/                   # Global moderation & platform policies
│   ├── services/
│   │   └── adminApi.js                 # Abstraction layer & simulated REST API
│   ├── __tests__/
│   │   └── adminModule.test.js         # Automated end-to-end verification suite
│   ├── App.jsx                         # Main application layout & route tree
│   ├── index.css                       # SaaS design system and CSS tokens
│   └── main.jsx                        # React root entry point
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 4. How to Install and Run Locally

### Prerequisites
- Node.js version 18 or higher (tested on Node v24.11.0)
- npm version 9 or higher (tested on npm 11.6.1)

### Installation
From the repository root (`D:\vynora`), navigate into the module folder:
```bash
cd owner-admin
npm install
```

### Development Server
Start the local Vite development server:
```bash
npm run dev
```
The application will launch at:
```
http://localhost:5174/
```
*(Configured on port 5174 to avoid collision with standard student client port 5173).*

### Production Build
Create an optimized production bundle:
```bash
npm run build
```
Preview the production build:
```bash
npm run preview
```

### Running Automated Verification Tests
Execute the comprehensive test suite:
```bash
npm test
```

---

## 5. Demonstration Mode & Persistence

Because the shared Vynora backend authentication and database infrastructure have not yet been stabilized, this frontend runs in **Demonstration Mode**:
- All operations are processed through an abstracted service layer (`src/services/adminApi.js`).
- State changes (approving a college, rejecting a club, suspending a user, revoking an assignment, or replying to a ticket) update the in-memory store and persist to browser `localStorage` (`vynora_owner_admin_state_v1`).
- All privileged actions automatically append structured entries to the **Security Audit Trail**.
- The top banner provides a **Reset Demo Store** button to restore baseline data at any time.
- **Honest Feedback:** The UI never pretends that changes have been committed to a remote production MongoDB cluster.

---

## 6. Proposed Shared Backend API Integration Contracts

When integrating with the canonical Express + MongoDB backend maintainer, the `adminApi.js` service layer will map directly to the following endpoints:

| Endpoint | Method | Description | Required Server-Side Authorization |
| :--- | :--- | :--- | :--- |
| `/api/v1/admin/overview` | `GET` | Fetches aggregate metrics and chart data | `Platform Owner` |
| `/api/v1/admin/verifications?type=college` | `GET` | Lists college submissions with filters | `Platform Owner`, `Moderator` |
| `/api/v1/admin/verifications/colleges/:id` | `PATCH` | Updates college status (`approved`, `rejected`, `needs_info`) | `Platform Owner` |
| `/api/v1/admin/verifications?type=club` | `GET` | Lists club submissions with filters | `Platform Owner`, `Moderator` |
| `/api/v1/admin/verifications/clubs/:id` | `PATCH` | Updates club status | `Platform Owner` |
| `/api/v1/admin/club-admin-applications` | `GET` | Lists student leadership applications | `Platform Owner` |
| `/api/v1/admin/club-admin-applications/:id` | `PATCH` | Approves/rejects application | `Platform Owner` |
| `/api/v1/admin/club-admin-assignments` | `GET` | Lists active and historical club admin roles | `Platform Owner` |
| `/api/v1/admin/club-admin-assignments` | `POST` | Grants a scoped club admin assignment | `Platform Owner` |
| `/api/v1/admin/club-admin-assignments/:id` | `PATCH` | Revokes a club admin assignment | `Platform Owner` |
| `/api/v1/admin/users` | `GET` | Paginated directory of student and admin accounts | `Platform Owner` |
| `/api/v1/admin/users/:id/actions` | `POST` | Executes `suspend`, `restore`, or `restrict` | `Platform Owner` |
| `/api/v1/admin/reports` | `GET` | Lists moderation incidents and spam reports | `Platform Owner`, `Moderator` |
| `/api/v1/admin/reports/:id` | `PATCH` | Updates report status, assign mod, or resolve | `Platform Owner`, `Moderator` |
| `/api/v1/admin/support-tickets` | `GET` | Lists support tickets | `Platform Owner`, `Support Staff` |
| `/api/v1/admin/support-tickets/:id/reply` | `POST` | Appends admin reply message | `Platform Owner`, `Support Staff` |
| `/api/v1/admin/audit-logs` | `GET` | Read-only stream of security audit events | `Platform Owner` |
| `/api/v1/admin/settings` | `GET`/`PATCH`| Retrieves or updates global platform settings | `Platform Owner` |

---

## 7. Critical Security Invariants & Governance Rules

1. **Server-Side Authorization Invariant:**
   Frontend role checks and route guards are for navigation UX only. Every protected API request must be validated by the backend verifying cryptographic session cookies / JWT tokens against the canonical User collection.
2. **Strict Club Admin Scope Invariant:**
   A Club Admin has authority **strictly limited** to the specific club assigned to them. A Club Admin must **NEVER** inherit platform-owner, cross-club, or moderation permissions.
3. **No Public Privileged Registration:**
   Public signup flows must never allow students to self-select privileged roles (`Platform Owner`, `Moderator`, `Club Admin`). Privileged roles can only be granted via authorized administrative assignments or direct database provisioning.
4. **Mandatory Action Rationale:**
   All destructive, punitive, or rejection actions (rejecting a college/club, suspending a user, revoking an assignment, dismissing a report) require an explicit text justification that is permanently written to the audit log.
5. **Audit Log Immutability:**
   Audit logs are strictly append-only. No administrative interface or database role should expose update or delete methods on audit collections.
