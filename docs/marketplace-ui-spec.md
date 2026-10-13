# 🎨 Marketplace UI Specification & Design System — Vynora Connect

**Module Owner:** Surya  
**Sprint:** Day 2 — System Design & Interactive UI  
**Visual Theme:** Premium Minimalist Black-and-White  

---

## 1. Design Direction: Premium Minimalist Black-and-White

The Vynora Connect Marketplace is designed with an **editorial, monochrome aesthetic** inspired by high-end design engineering tools. It avoids noisy gradients, neon colors, and bloated dashboard widgets, focusing instead on stark contrast, typography hierarchy, and deliberate spacing.

### Grayscale Design Tokens
```css
:root {
  /* Surface Layers */
  --mono-bg-canvas: #000000;         /* True black background */
  --mono-bg-surface: #0a0a0a;        /* Deep surface layer */
  --mono-bg-elevated: #121212;       /* Elevated cards & modals */
  --mono-bg-muted: #1c1c1c;          /* Inputs, active chips, subtle fills */
  --mono-bg-hover: #262626;          /* Hover states */

  /* Structural Borders */
  --mono-border-subtle: #1f1f1f;     /* Subtle panel division */
  --mono-border-strong: #333333;     /* Card borders & inputs */
  --mono-border-highlight: #ffffff;  /* High-contrast focus outlines */

  /* Typography Colors */
  --mono-text-primary: #ffffff;      /* Pure white headers & prominent text */
  --mono-text-secondary: #a3a3a3;    /* Cool gray body text */
  --mono-text-tertiary: #666666;     /* Subtle metadata & timestamps */
  --mono-text-inverse: #000000;      /* Dark text on white buttons */

  /* Semantic Monochrome Accents */
  --mono-accent-white: #ffffff;      /* Primary action buttons */
  --mono-accent-dark: #171717;       /* Secondary actions */
  --mono-badge-bg: #141414;          /* Pill backgrounds */
}
```

### Contrast & Typography Principles
- **Header Font:** `Plus Jakarta Sans` (ExtraBold 800, Bold 700) with tight letter-spacing (`-0.02em`).
- **Data & Code:** `JetBrains Mono` for IDs, prices, and status constants.
- **Micro-Interactions:** Subtle, quick `cubic-bezier(0.16, 1, 0.3, 1)` transitions (150ms) for button hovers and drawer expansion.
- **Accessibility:** Text on black surfaces strictly exceeds WCAG AAA (contrast ratio > 7:1 for body copy).

---

## 2. Page Architecture & Component Tree

```text
MarketplacePage
 ├── MarketplaceNav (Explore Services | My Listings | My Inquiries | Create Listing)
 ├── MarketplaceHero (Headline, Search Bar, Quick Stats, CTA Buttons)
 ├── ViewRouter:
 │    ├── [View: EXPLORE]
 │    │    ├── MarketplaceFilters (Categories, Price Model, Sorting)
 │    │    ├── ServiceListingGrid (List of ListingCard components)
 │    │    └── ListingDetailsModal (Full description, skills, portfolio links, inquiry trigger)
 │    │
 │    ├── [View: MY_LISTINGS]
 │    │    ├── MyListingsView (Draft, Published, Archived filters)
 │    │    └── ActionButtons (Edit, Toggle Publish/Archive)
 │    │
 │    ├── [View: MY_INQUIRIES]
 │    │    ├── InquiriesTabs (Received vs. Sent)
 │    │    ├── InquiriesTable / InquiriesList
 │    │    └── InquiryDetailsModal (Accept, Decline, Cancel actions)
 │    │
 │    ├── [View: CREATE_LISTING]
 │    │    └── CreateListingModal (Form inputs, Draft save, Publication validation)
 │    │
 │    └── [View: PERMISSIONS]
 │         └── MarketplacePermissionsPanel (Role switcher, ABAC simulator, access checks)
 └── NotificationToast (Feedback alerts for operations)
```

---

## 3. Screen Specifications & User Interactions

### 3.1 Explore Services (Catalog View)
1. **Hero Section**:
   - Refined monochrome title: `CAMPUS MARKETPLACE`.
   - Subtitle: *Peer freelance services, technical development, and academic expertise by verified campus students.*
   - Real-time search bar with instant client-side text filtering across title, summary, skills, and tags.
2. **Category Chips**:
   - Filterable pill bar: `All`, `Development`, `Design`, `Content`, `Marketing`, `Tutoring`, `Video & Photo`, `Other`.
   - Single-click toggle updates grid without full-page reloads.
3. **Service Card Structure**:
   - Provider name and department tag (clearly labeled mock student data).
   - Category badge with minimalist border.
   - Price display: `₹3,500` (Fixed) or `₹400 / hr` (Hourly) or `Negotiable`.
   - Delivery badge: `⏱️ 7 Days Delivery`.
   - Skill tag pills (up to 4 tags with `+N more`).
   - Action buttons: `View Details` and `Inquire`.

### 3.2 Service Listing Details (Modal / Drawer)
- Displays complete 3000-character description.
- Portfolio verification links (opens external student work in new tab).
- Estimated delivery timeline and pricing negotiability disclaimer.
- Provider credential card (references student department and graduation year).
- Direct `Send Inquiry` button (disabled if current mock user is the listing owner).

### 3.3 Create & Edit Service Listing
- Form split into clear logical blocks:
  - **General**: Title, Short Summary, Category, Detailed Description.
  - **Pricing & Delivery**: Model (`FIXED`, `HOURLY`, `NEGOTIABLE`), Amount, Currency, Negotiable checkbox, Duration (Value + Unit).
  - **Skills & Portfolio**: Comma-separated skill tags, Portfolio link pairs (label + URL).
- Client-side validation enforcing min-lengths, URL formatting, and non-negative numbers.
- Dual actions: `Save as Draft` or `Publish Immediately`.

### 3.4 My Listings (Provider Management View)
- Filterable by `All`, `Published`, `Draft`, `Archived`.
- Action controls per listing:
  - `Edit Details`: Opens edit form populated with existing values.
  - `Publish Draft`: Immediately validates and transitions draft to live public catalog.
  - `Archive Listing`: Prompts confirmation and retires the listing from public view.
  - `Restore`: Restores archived listing to draft or published state.

### 3.5 Send Inquiry Flow
- Modal triggered from any listing card or details view.
- Validates that the active user is **not** the listing owner.
- Input fields:
  - Subject (min 5 chars)
  - Detailed project requirements & message (min 20 chars)
  - Proposed budget (optional numeric)
  - Requested completion deadline (future date picker)
- On submission, creates a mock `Inquiry` record with status `PENDING` and displays a confirmation toast.

### 3.6 My Inquiries (Received vs. Sent)
- **Tab 1: Inquiries Received (Provider Inbox)**:
  - Lists incoming inquiries from peers seeking the provider's services.
  - Interactive actions: `Accept` (moves to `ACCEPTED`), `Decline` (moves to `DECLINED`), or `View Requirements`.
- **Tab 2: Inquiries Sent (Client Outbox)**:
  - Lists inquiries sent by the current student to other providers.
  - Interactive actions: `Cancel Inquiry` (allowed only while `PENDING`).

### 3.7 Marketplace Permissions Panel
- Dedicated black-and-white permission testing tool.
- Switch simulated identity between:
  - `Surya Prakash` (Listing Owner & Provider)
  - `Aarav Sharma` (Client / Other Student)
  - `Campus Moderator` (Administrative Moderation Role)
- Demonstrates real-time `<PermissionGate>` evaluations, self-inquiry prevention, and unauthorized mutation blocks.

---

## 4. Frontend & Backend Separation Architecture

To ensure zero friction when connecting the Express backend in subsequent sprints, the UI does **not** hardcode component-level storage:

```
[UI Components]
       │
       ▼ (Calls Service Functions)
[marketplaceService.js]
       │
       ├── CURRENT: Reads/Writes to component state & localStorage cache
       │
       └── FUTURE: Standard fetch('/api/v1/marketplace/...') HTTP calls
```

The data contracts, schemas, and parameter names in `marketplaceService.js` strictly mirror the Mongoose models defined in [`docs/marketplace-spec.md`](file:///c:/Users/surya/OneDrive/Desktop/vynoraconnects+/VYNORACAMPUS-/docs/marketplace-spec.md).
