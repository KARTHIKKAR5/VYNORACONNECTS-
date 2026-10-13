# 🛒 Marketplace Technical Specification — Vynora Connect

**Module Owner:** Surya  
**Sprint:** Day 2 — System Design & API Contracts  
**Status:** PROPOSED Specification  
**Target Integration:** Vynora Connect Platform Core  

---

## 1. Module Overview & Responsibilities

The **Marketplace** module empowers students and verified campus creators to offer peer services, discover technical skills, and initiate structured project inquiries.

### Core Responsibilities:
1. **Service Listings**: Catalog of student-provided services (e.g., full-stack development, UI/UX design, tutoring, video editing, technical writing).
2. **Inquiry Lifecycle**: Structured communication pipeline enabling interested students to request quotes, specify project scopes, and receive acceptance/declination from providers.
3. **Owner-Centric Management**: Dedicated provider portal to publish, edit, monitor, and archive listings.
4. **Access Control & Safety**: Resource-level authorization preventing self-inquiries, unauthorized tampering, and unmoderated abusive content.

### Explicit Module Boundaries:
| Feature Area | Marketplace Module Responsibility | Delegated / Shared Module Responsibility |
|---|---|---|
| **Identity & Affiliation** | References `ownerId`, `requesterId`, `recipientId` | `User` / `Authentication` module owns authentication, passwords, tokens, and university email verification. |
| **Provider Profile** | Displays public portfolio links and declared skill tags | `Student Portfolio` module owns full academic records, CGPA, certifications, and streaks. |
| **Ongoing Messaging** | Captures initial inquiry subject, requirements, and budget | `Communication / Chat` module owns real-time Socket.IO chat rooms, ongoing conversation threads, and message history. |
| **Hackathon Teams** | Individual freelance/peer service discovery | `Teams & Projects` module owns cross-department hackathon recruitment and team rosters. |
| **Monetary Transactions** | Captures proposed budget and pricing model | Future escrow / payment gateway (deferred to later releases; currently direct peer coordination). |

---

## 2. Shared Data Models

### 2.1 ServiceListing Schema (Mongoose / MongoDB)

```javascript
import mongoose from 'mongoose';

const ServiceListingSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner ID is required'],
      index: true
    },
    title: {
      type: String,
      required: [true, 'Listing title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    summary: {
      type: String,
      required: [true, 'Short summary is required'],
      trim: true,
      minlength: [10, 'Summary must be at least 10 characters'],
      maxlength: [200, 'Summary cannot exceed 200 characters']
    },
    description: {
      type: String,
      required: [true, 'Detailed description is required'],
      trim: true,
      minlength: [30, 'Description must be at least 30 characters'],
      maxlength: [3000, 'Description cannot exceed 3000 characters']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: [
          'DEVELOPMENT',
          'DESIGN',
          'CONTENT',
          'MARKETING',
          'TUTORING',
          'VIDEO_PHOTO',
          'OTHER'
        ],
        message: '{VALUE} is not a supported category'
      },
      index: true
    },
    tags: {
      type: [String],
      validate: {
        validator: (v) => v.length <= 10,
        message: 'Cannot attach more than 10 tags'
      },
      default: []
    },
    providerType: {
      type: String,
      enum: ['STUDENT', 'VERIFIED_PROVIDER', 'STUDENT_CLUB'],
      default: 'STUDENT'
    },
    pricing: {
      model: {
        type: String,
        required: true,
        enum: ['FIXED', 'HOURLY', 'NEGOTIABLE'],
        default: 'FIXED'
      },
      amount: {
        type: Number,
        min: [0, 'Amount cannot be negative'],
        validate: {
          validator: function (v) {
            // Amount is mandatory unless pricing model is strictly NEGOTIABLE
            if (this.pricing?.model === 'NEGOTIABLE') return true;
            return typeof v === 'number' && v >= 0;
          },
          message: 'Price amount is required for FIXED and HOURLY models'
        }
      },
      currency: {
        type: String,
        enum: ['INR', 'USD', 'EUR'],
        default: 'INR'
      },
      negotiable: {
        type: Boolean,
        default: false
      }
    },
    deliveryTime: {
      value: {
        type: Number,
        required: [true, 'Delivery duration value is required'],
        min: [1, 'Delivery time must be at least 1 unit']
      },
      unit: {
        type: String,
        required: true,
        enum: ['DAYS', 'WEEKS', 'MONTHS'],
        default: 'DAYS'
      }
    },
    skills: {
      type: [String],
      validate: {
        validator: (v) => v.length >= 1 && v.length <= 15,
        message: 'Must provide between 1 and 15 skills'
      }
    },
    portfolioLinks: [
      {
        label: { type: String, required: true, trim: true, maxlength: 40 },
        url: {
          type: String,
          required: true,
          match: [/^https?:\/\/[^\s$.?#].[^\s]*$/i, 'Invalid portfolio URL']
        }
      }
    ],
    coverImageUrl: {
      type: String,
      default: null,
      match: [/^https?:\/\/[^\s$.?#].[^\s]*$/i, 'Invalid image URL']
    },
    availability: {
      type: String,
      enum: ['AVAILABLE', 'BUSY', 'UNAVAILABLE'],
      default: 'AVAILABLE'
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED', 'REMOVED'],
      default: 'DRAFT',
      index: true
    },
    moderationStatus: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'FLAGGED', 'REJECTED'],
      default: 'APPROVED', // Automatic approval for initial student sandbox; flagged by moderators
      index: true
    },
    publishedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Compound & Search Indexes
ServiceListingSchema.index({ status: 1, category: 1, createdAt: -1 });
ServiceListingSchema.index({ ownerId: 1, status: 1 });
ServiceListingSchema.index({
  title: 'text',
  summary: 'text',
  description: 'text',
  skills: 'text',
  tags: 'text'
});
```

#### Lifecycle & Editability Rules:
1. **DRAFT**: Created by owner; visible only to owner. Full edits permitted.
2. **PUBLISHED**: Visible to all students. Edits permitted to description, pricing, skills, portfolio links, and availability. Title and slug changes trigger re-validation.
3. **ARCHIVED**: Soft-retired by owner. Hidden from public exploration. Can be restored to `DRAFT` or `PUBLISHED`.
4. **REMOVED**: Deactivated due to moderation or permanent owner deletion. Retained for referential integrity with past inquiries.

---

### 2.2 Inquiry Schema (Mongoose / MongoDB)

```javascript
import mongoose from 'mongoose';

const InquirySchema = new mongoose.Schema(
  {
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceListing',
      required: [true, 'Listing ID is required'],
      index: true
    },
    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Requester ID is required'],
      index: true
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recipient ID is required'],
      index: true
    },
    subject: {
      type: String,
      required: [true, 'Inquiry subject is required'],
      trim: true,
      minlength: [5, 'Subject must be at least 5 characters'],
      maxlength: [120, 'Subject cannot exceed 120 characters']
    },
    message: {
      type: String,
      required: [true, 'Initial message is required'],
      trim: true,
      minlength: [20, 'Message must be at least 20 characters'],
      maxlength: [2000, 'Message cannot exceed 2000 characters']
    },
    requirements: {
      type: String,
      trim: true,
      maxlength: [1500, 'Requirements cannot exceed 1500 characters'],
      default: ''
    },
    budget: {
      amount: {
        type: Number,
        min: [0, 'Budget amount cannot be negative']
      },
      currency: {
        type: String,
        enum: ['INR', 'USD', 'EUR'],
        default: 'INR'
      }
    },
    requestedDeadline: {
      type: Date,
      validate: {
        validator: function (v) {
          if (!v) return true;
          return v > new Date();
        },
        message: 'Requested deadline must be a future date'
      }
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'DECLINED', 'CANCELLED', 'COMPLETED'],
      default: 'PENDING',
      index: true
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      default: null
    },
    lastRespondedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Indexes
InquirySchema.index({ recipientId: 1, status: 1, createdAt: -1 });
InquirySchema.index({ requesterId: 1, status: 1, createdAt: -1 });
InquirySchema.index({ listingId: 1, requesterId: 1, status: 1 });
```

---

## 3. Inquiry Lifecycle State Machine

```
              ┌─────────────────────────────┐
              │           PENDING           │
              └──────────────┬──────────────┘
                             │
            ┌────────────────┼────────────────┐
            │ (Recipient)    │ (Recipient)    │ (Requester)
            ▼                ▼                ▼
     ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
     │   ACCEPTED   │ │   DECLINED   │ │  CANCELLED   │
     └──────┬───────┘ └──────────────┘ └──────────────┘
            │ (Provider/Client)
            ▼
     ┌──────────────┐
     │  COMPLETED   │
     └──────────────┘
```

### State Transition Validation Table:
| Current Status | Next Status | Allowed Actor | Conditions & Business Rules |
|---|---|---|---|
| *None* | `PENDING` | Authenticated Student | `requesterId !== recipientId`. Listing must be `status === 'PUBLISHED'`. No duplicate active `PENDING` inquiry for same `(listingId, requesterId)`. |
| `PENDING` | `ACCEPTED` | Recipient (Listing Owner) | Sets `lastRespondedAt = now`. If chat integration is ready, instantiates `conversationId`. |
| `PENDING` | `DECLINED` | Recipient (Listing Owner) | Sets `lastRespondedAt = now`. Ends inquiry pipeline. |
| `PENDING` | `CANCELLED` | Requester | Requester withdraws before recipient decision. |
| `ACCEPTED` | `COMPLETED` | Recipient or Requester | Marked when service delivery and agreement are fulfilled. |
| *Any* | *Invalid* | Unauthorized Actor | **HTTP 403 Forbidden** or **HTTP 409 Conflict** (Invalid transition). |

---

## 4. Marketplace API Specifications

Root Prefix: `/api/v1/marketplace` (per ADR-004)

### Summary Matrix of Endpoints

| # | Method | Endpoint | Access Level | Description |
|---|---|---|---|---|
| **1** | `POST` | `/listings` | Authenticated | Create a service listing (Draft) |
| **2** | `GET` | `/listings` | Public / Students | List published service listings with filters |
| **3** | `GET` | `/listings/:listingId` | Public / Students | Retrieve listing details by ID or slug |
| **4** | `PATCH` | `/listings/:listingId` | Listing Owner | Update listing fields |
| **5** | `DELETE` | `/listings/:listingId` | Listing Owner | Archive or delete a listing |
| **6** | `GET` | `/me/listings` | Authenticated Owner | Retrieve all listings owned by current user |
| **7** | `POST` | `/listings/:listingId/publish` | Listing Owner | Transition listing from `DRAFT` to `PUBLISHED` |
| **8** | `POST` | `/listings/:listingId/inquiries` | Authenticated (Non-Owner) | Create and submit an inquiry |
| **9** | `GET` | `/me/inquiries/received` | Authenticated Recipient | Retrieve inquiries received by current user |
| **10** | `GET` | `/me/inquiries/sent` | Authenticated Requester | Retrieve inquiries sent by current user |
| **11** | `GET` | `/inquiries/:inquiryId` | Authorized Participant | Retrieve inquiry details |
| **12** | `PATCH` | `/inquiries/:inquiryId` | Recipient | Accept or decline inquiry |
| **13** | `POST` | `/inquiries/:inquiryId/cancel` | Requester | Cancel a pending inquiry |

---

### Detailed Endpoint Contracts

#### 1. Create a Service Listing
- **Endpoint:** `POST /api/v1/marketplace/listings`
- **Auth:** Required (Bearer Token)
- **Role:** Any authenticated student.
- **Request Body:**
  ```json
  {
    "title": "Full-Stack Web App Development (MERN)",
    "summary": "Custom React and Node.js web application development for campus projects.",
    "description": "I offer complete frontend and backend development using React, Express, and MongoDB. Includes responsive styling, REST API setup, and deployment assistance.",
    "category": "DEVELOPMENT",
    "tags": ["React", "Node", "MongoDB", "MERN"],
    "pricing": {
      "model": "FIXED",
      "amount": 3500,
      "currency": "INR",
      "negotiable": true
    },
    "deliveryTime": {
      "value": 7,
      "unit": "DAYS"
    },
    "skills": ["React", "Express", "MongoDB", "Node.js"],
    "portfolioLinks": [
      {
        "label": "GitHub Profile",
        "url": "https://github.com/surya-prakash"
      }
    ],
    "publishNow": false
  }
  ```
- **Responses:**
  - `201 Created`: Listing initialized (status `DRAFT` or `PUBLISHED` based on `publishNow`).
  - `400 Bad Request`: Validation failure on required fields.
  - `401 Unauthorized`: Missing or invalid bearer token.

---

#### 2. List Published Service Listings
- **Endpoint:** `GET /api/v1/marketplace/listings`
- **Auth:** Optional / Public (Browsing permitted)
- **Query Parameters:**
  - `page`: Integer (default: 1)
  - `limit`: Integer (default: 12, max: 50)
  - `category`: String (e.g., `DEVELOPMENT`, `DESIGN`)
  - `search`: String (text query matching title, summary, skills)
  - `priceModel`: String (`FIXED`, `HOURLY`, `NEGOTIABLE`)
  - `sort`: String (`newest`, `price_asc`, `price_desc`)
- **Success Response (`200 OK`):**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "670c2f81156820ef0a9e701a",
        "title": "Full-Stack Web App Development (MERN)",
        "slug": "full-stack-web-app-development-mern-670c",
        "summary": "Custom React and Node.js web application development.",
        "category": "DEVELOPMENT",
        "pricing": {
          "model": "FIXED",
          "amount": 3500,
          "currency": "INR",
          "negotiable": true
        },
        "deliveryTime": { "value": 7, "unit": "DAYS" },
        "skills": ["React", "Node.js", "Express"],
        "owner": {
          "id": "670c2a11156820ef0a9e7001",
          "name": "Surya Prakash",
          "department": "Computer Science & Engineering"
        },
        "createdAt": "2026-10-13T10:00:00.000Z"
      }
    ],
    "meta": {
      "total": 24,
      "page": 1,
      "limit": 12,
      "totalPages": 2,
      "hasNext": true,
      "hasPrev": false
    }
  }
  ```

---

#### 3. Retrieve a Listing by ID
- **Endpoint:** `GET /api/v1/marketplace/listings/:listingId`
- **Auth:** Public for `PUBLISHED` listings; Owner/Admin only for `DRAFT` or `ARCHIVED`.
- **Responses:**
  - `200 OK`: Listing document with populated owner summary.
  - `404 Not Found`: Listing ID does not exist or is marked `REMOVED`.

---

#### 4. Update a Listing
- **Endpoint:** `PATCH /api/v1/marketplace/listings/:listingId`
- **Auth:** Required (Bearer Token)
- **Authorization:** `isListingOwner(req.user.id, listing.ownerId) === true`.
- **Request Body:** Partial update fields (`summary`, `description`, `pricing`, `skills`, `portfolioLinks`, `availability`).
- **Responses:**
  - `200 OK`: Updated listing payload.
  - `403 Forbidden`: Authenticated user is not the listing owner.
  - `422 Unprocessable Entity`: Validation failure on updated fields.

---

#### 5. Archive or Remove a Listing
- **Endpoint:** `DELETE /api/v1/marketplace/listings/:listingId`
- **Auth:** Required
- **Authorization:** Listing Owner or Platform Moderator.
- **Behavior:** Sets `status = 'ARCHIVED'` (Soft-delete preserving referential history).
- **Responses:**
  - `200 OK`: `{ "success": true, "message": "Listing archived successfully." }`
  - `403 Forbidden`: Unauthorized user.

---

#### 6. Retrieve Authenticated User's Listings
- **Endpoint:** `GET /api/v1/marketplace/me/listings`
- **Auth:** Required
- **Returns:** All listings (`DRAFT`, `PUBLISHED`, `ARCHIVED`) owned by `req.user.id`.

---

#### 7. Publish a Draft Listing
- **Endpoint:** `POST /api/v1/marketplace/listings/:listingId/publish`
- **Auth:** Required
- **Authorization:** Listing Owner only.
- **Behavior:** Validates all required fields for publication and sets `status = 'PUBLISHED'` and `publishedAt = new Date()`.
- **Responses:**
  - `200 OK`: Published listing.
  - `400 Bad Request`: Incomplete listing details preventing publication.

---

#### 8. Create an Inquiry
- **Endpoint:** `POST /api/v1/marketplace/listings/:listingId/inquiries`
- **Auth:** Required (Authenticated student)
- **Authorization Rule:** `req.user.id !== listing.ownerId` (Strict self-inquiry rejection).
- **Request Body:**
  ```json
  {
    "subject": "Inquiry: Campus Event Registration Portal",
    "message": "Hi Surya! We need a clean React dashboard for our college symposium next month. We would love to discuss your availability.",
    "requirements": "Need Google OAuth login and CSV export of attendees.",
    "budget": {
      "amount": 4000,
      "currency": "INR"
    },
    "requestedDeadline": "2026-11-15T00:00:00.000Z"
  }
  ```
- **Responses:**
  - `201 Created`: Created inquiry record with status `PENDING`.
  - `400 Bad Request`: Self-inquiry attempt or invalid date bounds.
  - `409 Conflict`: Active pending inquiry already exists from this student for this listing.

---

#### 9 & 10. List Inquiries (Received & Sent)
- **Endpoints:**
  - `GET /api/v1/marketplace/me/inquiries/received` (Filter: `recipientId === req.user.id`)
  - `GET /api/v1/marketplace/me/inquiries/sent` (Filter: `requesterId === req.user.id`)
- **Query Params:** `status` (`PENDING`, `ACCEPTED`, `DECLINED`, `CANCELLED`), `page`, `limit`.
- **Responses:** `200 OK` with paginated inquiry summaries.

---

#### 11. Retrieve Inquiry by ID
- **Endpoint:** `GET /api/v1/marketplace/inquiries/:inquiryId`
- **Authorization:** `isInquiryParticipant(req.user.id, inquiry) === true` (Only `requesterId` or `recipientId`).
- **Responses:**
  - `200 OK`: Full inquiry details.
  - `403 Forbidden`: User is neither requester nor recipient.

---

#### 12. Respond to an Inquiry (Accept / Decline)
- **Endpoint:** `PATCH /api/v1/marketplace/inquiries/:inquiryId`
- **Authorization:** Recipient only (`req.user.id === inquiry.recipientId`).
- **Request Body:**
  ```json
  {
    "action": "ACCEPT" // or "DECLINE"
  }
  ```
- **Validation:** Inquiry must currently be in `PENDING` status.
- **Responses:**
  - `200 OK`: Updated inquiry status (`ACCEPTED` or `DECLINED`).
  - `403 Forbidden`: Not authorized recipient.
  - `409 Conflict`: Inquiry is not in `PENDING` state.

---

#### 13. Cancel an Inquiry
- **Endpoint:** `POST /api/v1/marketplace/inquiries/:inquiryId/cancel`
- **Authorization:** Requester only (`req.user.id === inquiry.requesterId`).
- **Condition:** Inquiry must be `PENDING`.
- **Responses:**
  - `200 OK`: Status updated to `CANCELLED`.
  - `403 Forbidden`: Not requester.

---

## 5. Security & Authorization Matrix

See companion specification [`docs/owner-permissions-spec.md`](file:///c:/Users/surya/OneDrive/Desktop/vynoraconnects+/VYNORACAMPUS-/docs/owner-permissions-spec.md) for full formal matrix, role bounds, and backend enforcement architecture.
