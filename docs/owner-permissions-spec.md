# 🛡️ Owner Permissions & Authorization Specification — Vynora Connect

**Module Owner:** Surya  
**Sprint:** Day 2 — System Design & Authorization Rules  
**Status:** PROPOSED Specification  

---

## 1. Authorization Philosophy

In **Vynora Connect**, access control is designed according to the **Principle of Least Privilege (PoLP)** and **Denial-by-Default**:

1. **Separation of Platform vs. Resource Roles**: A user having an administrative role in a student project or campus club does **not** grant them global write privileges over another student's independent service listings or private inquiries.
2. **Attribute-Based Access Control (ABAC)**: Resource actions (e.g. updating a service listing, accepting an inquiry) evaluate resource ownership attributes (`isListingOwner`, `isInquiryRecipient`, `isInquiryRequester`) rather than crude role checks.
3. **Strict Denial by Default**: Any unmapped action, unregistered role, null argument, or unrecognized relationship returns `false` without granting implicit access.
4. **Backend Enforcement Primacy**: Client-side UI gates (`PermissionGate`) exist purely for user feedback and interface conditioning. The Express backend must enforce authorization independently on every incoming request.

---

## 2. Role Taxonomy

### 2.1 Project / Team Roles (From Day 1)
Governs access within a collaborative student project or hackathon team:
- **`OWNER`**: Creator or designated primary custodian of a project. Full authority to edit project settings, manage team members, recruit, transfer ownership, and delete the project.
- **`ADMIN`**: Elevated collaborator. Can manage members, review join requests, toggle recruitment, and update project metadata. Cannot transfer ownership or delete the project.
- **`MEMBER`**: Active contributor. Can review incoming recruitment requests. Cannot alter project metadata or manage team membership.
- **`VIEWER`**: Read-only guest or evaluator. No mutation privileges.

### 2.2 Marketplace Resource Relationships (Day 2)
Governs marketplace transactions and client-provider interactions:
- **`LISTING_OWNER`**: The authenticated student who authored the `ServiceListing`.
- **`INQUIRY_RECIPIENT`**: The provider targeted by an inquiry (who owns the referenced listing).
- **`INQUIRY_REQUESTER`**: The student who submitted the inquiry to request services.
- **`PLATFORM_MODERATOR`**: A specifically designated institutional moderation officer or platform administrator empowered to flag or remove policy-violating listings.
- **`PUBLIC_STUDENT`**: Any verified campus student browsing services.

---

## 3. Formal Permission Matrix

| Action Identifier | Public Student | Listing Owner | Other Student | Inquiry Recipient | Inquiry Requester | Platform Moderator |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| `MARKETPLACE_LISTING_CREATE` | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| `MARKETPLACE_LISTING_READ` (Published) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `MARKETPLACE_LISTING_READ` (Draft) | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| `MARKETPLACE_LISTING_UPDATE` | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `MARKETPLACE_LISTING_ARCHIVE` | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ (Moderation) |
| `MARKETPLACE_LISTING_MODERATE` | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| `MARKETPLACE_INQUIRY_CREATE` | ❌ | ❌ (No self-inquiry) | ✅ | ❌ | ❌ | ❌ |
| `MARKETPLACE_INQUIRY_READ` | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ (Audit only) |
| `MARKETPLACE_INQUIRY_RESPOND` (Accept/Decline) | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| `MARKETPLACE_INQUIRY_CANCEL` | ❌ | ❌ | ❌ | ❌ | ✅ (Pending only) | ❌ |

---

## 4. Authorization Rules & Business Constraints

### 4.1 Listing Ownership Rules
1. **Creation**: Any verified authenticated student may create a service listing. The creator's `req.user.id` is permanently assigned as `ownerId`.
2. **Mutation Guard**: Only the verified owner (`req.user.id === listing.ownerId`) may modify listing attributes (pricing, skills, delivery estimates, portfolio links).
3. **Publication**: Only the listing owner can transition a listing from `DRAFT` to `PUBLISHED`.
4. **Archiving**: The listing owner may soft-archive their listing at any time. Archived listings disappear from public search and category feeds.

### 4.2 Inquiry Access & Protection Rules
1. **Strict Self-Inquiry Prevention**: A student cannot submit an inquiry for a service listing they own:
   ```javascript
   if (String(req.user.id) === String(listing.ownerId)) {
     throw new ForbiddenError('You cannot submit an inquiry to your own listing.');
   }
   ```
2. **Private Participant Enclosure**: Inquiries are strictly confidential between the requester and recipient:
   ```javascript
   const isParticipant =
     String(req.user.id) === String(inquiry.requesterId) ||
     String(req.user.id) === String(inquiry.recipientId);

   if (!isParticipant && !req.user.isModerator) {
     throw new ForbiddenError('Access restricted to inquiry participants.');
   }
   ```
3. **Unilateral Response Rights**: Only the recipient (listing owner) has the authority to change status to `ACCEPTED` or `DECLINED`.
4. **Requester Cancellation**: The requester may cancel an inquiry only while it is in the `PENDING` state. Once accepted or declined, it cannot be canceled.

### 4.3 Moderation Guardrails
- **No Blanket Platform Admin Override**: An `ADMIN` role in a student project cannot delete or edit other students' marketplace listings.
- Dedicated `PLATFORM_MODERATOR` permissions can flag listings (`moderationStatus = 'FLAGGED'`) or hide abusive listings (`moderationStatus = 'REJECTED'`), but cannot alter service prices or description contents on behalf of the provider.

---

## 5. Backend Authorization Architecture (Express Middleware Pattern)

When integrating the Express backend, authorization must follow a layered middleware architecture:

```
[Incoming Request]
       │
       ▼
[authenticateToken]  --> Validates JWT; populates req.user
       │
       ▼
[resolveResource]    --> Fetches listing or inquiry by ID; populates req.resource
       │
       ▼
[authorizeMarketplace(action)] --> Executes ABAC check; enforces permissions
       │
       ▼
[Controller Handler] --> Performs business logic & database mutation
```

### Reference Express Authorization Middleware:
```javascript
export function authorizeMarketplace(action) {
  return (req, res, next) => {
    const user = req.user;
    const resource = req.resource;

    if (!user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' }
      });
    }

    switch (action) {
      case 'MARKETPLACE_LISTING_UPDATE':
      case 'MARKETPLACE_LISTING_ARCHIVE':
        if (String(user.id) !== String(resource.ownerId) && !user.isModerator) {
          return res.status(403).json({
            success: false,
            error: { code: 'FORBIDDEN', message: 'Only the listing owner can perform this action.' }
          });
        }
        break;

      case 'MARKETPLACE_INQUIRY_CREATE':
        if (String(user.id) === String(resource.ownerId)) {
          return res.status(400).json({
            success: false,
            error: { code: 'SELF_INQUIRY_DENIED', message: 'Cannot inquire on your own listing.' }
          });
        }
        break;

      case 'MARKETPLACE_INQUIRY_RESPOND':
        if (String(user.id) !== String(resource.recipientId)) {
          return res.status(403).json({
            success: false,
            error: { code: 'FORBIDDEN', message: 'Only the inquiry recipient can respond.' }
          });
        }
        break;

      case 'MARKETPLACE_INQUIRY_CANCEL':
        if (String(user.id) !== String(resource.requesterId)) {
          return res.status(403).json({
            success: false,
            error: { code: 'FORBIDDEN', message: 'Only the requester can cancel this inquiry.' }
          });
        }
        if (resource.status !== 'PENDING') {
          return res.status(409).json({
            success: false,
            error: { code: 'CONFLICT', message: 'Only pending inquiries can be cancelled.' }
          });
        }
        break;

      default:
        return res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN', message: 'Action not permitted by authorization policy.' }
        });
    }

    next();
  };
}
```

---

## 6. Edge Cases & Risk Mitigations

1. **Orphaned Listings (Deleted/Deactivated User)**: If a user account is removed, their published listings are automatically transitioned to `status = 'ARCHIVED'` via Mongoose pre-remove hooks.
2. **Concurrent Inquiry Status Updates**: MongoDB conditional atomic updates (`findOneAndUpdate({ _id, status: 'PENDING' }, { $set: { status: 'ACCEPTED' } })`) ensure race conditions between requester cancellation and recipient acceptance are resolved deterministically.
3. **Spam & Flooding Inquiries**: Rate limiting middleware (maximum 5 inquiries per student per hour) and unique pending index constraints (`{ listingId: 1, requesterId: 1, status: 1 }`) mitigate abusive inquiry spamming.
