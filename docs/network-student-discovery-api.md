# Vynora Connect — Student Network & Discovery API Specification (Module 2)

**Base URL**: `/api/v1/network`  
**Module Owner**: Ram  
**Feature Branch**: `feature/ram-network`  
**Target Branch**: `Development`  

---

## 1. Overview & Response Envelopes

All API endpoints return JSON conforming to the standardized Vynora envelope format:

### Success Envelope
```json
{
  "success": true,
  "data": {},
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

### Error Envelope
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error explanation.",
    "details": []
  }
}
```

---

## 2. API Endpoints Catalog

### A. Student Discovery & Public Directory

#### 1. Search & Filter Students
- **Method**: `GET`
- **URL**: `/api/v1/network/students`
- **Auth**: Optional / Authenticated (Excludes viewer from results when logged in)
- **Query Parameters**:
  - `search` (string): Search term across name, college, branch, bio, skills
  - `college` (string): College name filter
  - `branch` (string): Department/branch filter
  - `studyYear` (number): Academic year filter (1–5)
  - `skill` (string): Exact technical skill filter
  - `interest` (string): Interest area filter
  - `sortBy` (string): `'relevance'` | `'college'`
  - `page` (number, default: 1): Page number
  - `limit` (number, default: 10, max: 50): Page size
- **Success Response**: `200 OK` with array of safe student DTOs and pagination metadata.

#### 2. Get Student Profile by User ID
- **Method**: `GET`
- **URL**: `/api/v1/network/students/:userId`
- **Auth**: Optional / Authenticated
- **Path Parameters**:
  - `userId` (string): 24-char hex MongoDB ObjectId
- **Visibility Enforced**:
  - `students`: Full safe profile.
  - `connections`: Requires accepted connection between viewer and target student, otherwise masks bio and skills.
  - `private`: Returns only basic college identity for non-self viewers.
- **Success Response**: `200 OK` with safe student profile DTO.
- **Error Responses**:
  - `400 Bad Request`: `INVALID_USER_ID`
  - `404 Not Found`: `PROFILE_NOT_FOUND`

---

### B. Authenticated Profile Management

#### 3. Get Authenticated User's Profile
- **Method**: `GET`
- **URL**: `/api/v1/network/me/profile`
- **Auth**: Required (`req.user`)
- **Success Response**: `200 OK` with full profile including editable fields.
- **Error Response**: `401 Unauthorized` if unauthenticated.

#### 4. Update Profile
- **Method**: `PUT`
- **URL**: `/api/v1/network/me/profile`
- **Auth**: Required (`req.user`)
- **Body**:
  ```json
  {
    "branch": "Computer Science & Engineering",
    "studyYear": 3,
    "bio": "Full-stack developer building scalable student collaboration tools.",
    "skills": ["React.js", "Node.js", "MongoDB"],
    "interests": ["Web Development", "Open Source"],
    "links": {
      "github": "https://github.com/username",
      "linkedin": "https://linkedin.com/in/username",
      "website": "https://portfolio.dev"
    }
  }
  ```
- **Allowlist Policy**: Modifying `role`, `isVerified`, `email`, `passwordHash`, or `_id` is strictly rejected.
- **Success Response**: `200 OK` with updated profile DTO.
- **Error Responses**:
  - `400 Bad Request`: `VALIDATION_ERROR` with detailed validation failure array.
  - `401 Unauthorized`: `UNAUTHENTICATED`

#### 5. Update Privacy Preferences
- **Method**: `PUT`
- **URL**: `/api/v1/network/me/privacy`
- **Auth**: Required (`req.user`)
- **Body**:
  ```json
  {
    "visibility": {
      "profile": "students",
      "showProjects": true,
      "showLinks": true
    }
  }
  ```
- **Success Response**: `200 OK`

---

### C. Connection Lifecycle & Management

#### 6. Get Accepted Connections
- **Method**: `GET`
- **URL**: `/api/v1/network/connections`
- **Auth**: Required (`req.user`)
- **Success Response**: `200 OK` with array of active connections and partner safe profile summaries.

#### 7. Get Received Pending Requests
- **Method**: `GET`
- **URL**: `/api/v1/network/requests/received`
- **Auth**: Required (`req.user`)
- **Success Response**: `200 OK` with array of incoming requests.

#### 8. Get Sent Pending Requests
- **Method**: `GET`
- **URL**: `/api/v1/network/requests/sent`
- **Auth**: Required (`req.user`)
- **Success Response**: `200 OK` with array of outgoing requests.

#### 9. Send Connection Request
- **Method**: `POST`
- **URL**: `/api/v1/network/requests`
- **Auth**: Required (`req.user`)
- **Body**:
  ```json
  {
    "recipientId": "64b8f0c1a2e3d4c5b6a78901"
  }
  ```
- **Rules Enforced**:
  - Rejects self-connections (`400 SELF_CONNECTION_FORBIDDEN`).
  - Rejects duplicate active connections (`409 ALREADY_CONNECTED`).
  - Rejects pending outgoing requests (`409 REQUEST_ALREADY_PENDING`).
  - Prompts to accept reverse pending requests (`409 REVERSE_REQUEST_PENDING`).
  - Database-level partial unique index on deterministic `pairKey` prevents concurrent race condition duplicates.
- **Success Response**: `201 Created`

#### 10. Accept Connection Request
- **Method**: `PATCH`
- **URL**: `/api/v1/network/requests/:id/accept`
- **Auth**: Required (Must be request recipient)
- **Success Response**: `200 OK` (`status: 'accepted'`)
- **Error Responses**:
  - `403 Forbidden`: `UNAUTHORIZED_ACTION` (If caller is not the recipient)
  - `404 Not Found`: Request does not exist
  - `409 Conflict`: Request not in `'pending'` state

#### 11. Reject Connection Request
- **Method**: `PATCH`
- **URL**: `/api/v1/network/requests/:id/reject`
- **Auth**: Required (Must be request recipient)
- **Success Response**: `200 OK` (`status: 'rejected'`)

#### 12. Cancel Connection Request
- **Method**: `PATCH`
- **URL**: `/api/v1/network/requests/:id/cancel`
- **Auth**: Required (Must be request requester)
- **Success Response**: `200 OK` (`status: 'cancelled'`)

#### 13. Remove Connection
- **Method**: `DELETE`
- **URL**: `/api/v1/network/connections/:id`
- **Auth**: Required (Must be an accepted participant)
- **Policy**: Executes safe soft transition (`status: 'cancelled'`). Client hard deletion is disabled.
- **Success Response**: `200 OK` (`status: 'removed'`)

