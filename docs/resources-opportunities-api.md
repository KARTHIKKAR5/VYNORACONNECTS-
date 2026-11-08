# Vynora Connects — Resources & Opportunities API Specification

**Base Path:** `/api/v1`  
**Protocol:** RESTful JSON over HTTPS  
**Module:** Resources & Opportunities (`feature/deepu-resources-opportunities`)  
**Shared Conventions:** Follows canonical Vynora Connect response envelope and error format.

---

## 1. Response & Error Envelopes

### Standard Success Response
```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully.",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 35,
    "totalPages": 4
  }
}
```

### Standard Error Response
```json
{
  "success": false,
  "error": {
    "code": "OPPORTUNITY_CLOSED",
    "message": "This opportunity has reached its deadline and is no longer accepting applications."
  }
}
```

---

## 2. Data Models & Schemas

### 2.1 Opportunity Schema (`server/models/Opportunity.js`)
```javascript
{
  title: { type: String, required: true, trim: true, minlength: 5, maxlength: 120 },
  slug: { type: String, lowercase: true, trim: true },
  type: {
    type: String,
    required: true,
    enum: ['hackathon', 'internship', 'contest', 'scholarship', 'case_competition', 'fellowship', 'other']
  },
  organizerName: { type: String, required: true, trim: true, maxlength: 100 },
  organizerUrl: { type: String, trim: true },
  description: { type: String, required: true, trim: true, minlength: 20, maxlength: 3000 },
  eligibility: { type: String, required: true, trim: true, maxlength: 500 },
  eligibleYears: [{ type: Number }],
  skills: [{ type: String, trim: true, lowercase: true }],
  mode: { type: String, required: true, enum: ['online', 'offline', 'hybrid'], default: 'online' },
  city: { type: String, trim: true, default: '' },
  startsAt: { type: Date },
  endsAt: { type: Date },
  deadlineAt: { type: Date, required: true, index: true },
  applicationUrl: { type: String, required: true, trim: true },
  prizeDescription: { type: String, trim: true, default: '' },
  stipendDescription: { type: String, trim: true, default: '' },
  teamMin: { type: Number, default: 1, min: 1 },
  teamMax: { type: Number, default: 1, min: 1 },
  bannerUrl: { type: String, trim: true, default: '' },
  status: {
    type: String,
    enum: ['draft', 'pending', 'published', 'rejected', 'closed', 'expired', 'archived'],
    default: 'pending' // Submissions default to pending review
  },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: { type: Date },
  timestamps: true
}
```

### 2.2 Resource Schema (`server/models/Resource.js`)
```javascript
{
  title: { type: String, required: true, trim: true, minlength: 5, maxlength: 150 },
  type: {
    type: String,
    required: true,
    enum: ['article', 'video', 'documentation', 'course', 'roadmap', 'repository', 'tool', 'document']
  },
  description: { type: String, required: true, trim: true, minlength: 15, maxlength: 2000 },
  topic: { type: String, required: true, trim: true, maxlength: 80 },
  branch: {
    type: String,
    enum: ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'General'],
    default: 'General'
  },
  technologies: [{ type: String, trim: true, lowercase: true }],
  tags: [{ type: String, trim: true, lowercase: true }],
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  access: { type: String, enum: ['free', 'paid', 'freemium'], default: 'free' },
  sourceUrl: { type: String, required: true, trim: true },
  thumbnailUrl: { type: String, trim: true, default: '' },
  upvotesCount: { type: Number, default: 0, min: 0 },
  upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: {
    type: String,
    enum: ['pending', 'published', 'rejected', 'archived'],
    default: 'pending' // Submissions enter pending moderation
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timestamps: true
}
```

### 2.3 Bookmark Schema (`server/models/Bookmark.js`)
```javascript
{
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  itemType: { type: String, enum: ['opportunity', 'resource'], required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  trackerStatus: {
    type: String,
    enum: ['saved', 'interested', 'planning', 'applied', 'shortlisted', 'rejected', 'selected'],
    default: 'saved'
  },
  notes: { type: String, maxlength: 500, default: '' },
  reminderEnabled: { type: Boolean, default: false },
  timestamps: true
}
```
* **Compound Index (Unique):** `{ userId: 1, itemType: 1, itemId: 1 }`

---

## 3. RESTful API Endpoints

### 3.1 Opportunities Endpoints (`/api/v1/opportunities`)

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/opportunities` | No | Public feed of `published` opportunities with search, category, mode, sort, pagination |
| `GET` | `/api/v1/opportunities/:id` | No | Detail view of published opportunity |
| `POST` | `/api/v1/opportunities` | Yes | Submit new opportunity. Sets `status: 'pending'` |
| `GET` | `/api/v1/opportunities/mine` | Yes | List submissions submitted by authenticated student |
| `GET` | `/api/v1/opportunities/featured`| No | Export for Karthik's dashboard preview |

### 3.2 Resources Endpoints (`/api/v1/resources`)

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/resources` | No | Public catalog of `published` resources |
| `GET` | `/api/v1/resources/:id` | No | Detail view of published resource |
| `POST` | `/api/v1/resources` | Yes | Submit new resource. Sets `status: 'pending'` |
| `GET` | `/api/v1/resources/mine` | Yes | List resources contributed by authenticated student |
| `POST` | `/api/v1/resources/:id/upvote`| Yes | Toggle upvote for a resource |

### 3.3 Bookmarks Endpoints (`/api/v1/bookmarks`)

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/bookmarks` | Yes | Get current user's saved opportunities & resources |
| `POST` | `/api/v1/bookmarks/toggle` | Yes | Save or unsave an opportunity or resource |
| `PATCH` | `/api/v1/bookmarks/:id/tracker`| Yes | Update tracker status (`saved` -> `applied`, etc.) |

---

## 4. Teammate Integration Endpoints

- **Karthik (Dashboard):** `GET /api/v1/opportunities/featured?limit=3` returns preview cards formatted to match `OpportunityPreview.jsx`.
- **Revanth (Moderation):** `POST /api/v1/moderation/reports` receives `{ targetType, targetId, targetTitle, reason, details }`.
- **Siri (Notifications):** `POST /api/v1/notifications/reminders` receives deadline alert requests.

