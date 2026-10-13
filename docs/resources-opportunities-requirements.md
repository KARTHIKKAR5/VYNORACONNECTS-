# Resources & Opportunities Module
## Software Requirements Specification (SRS)

**Project:** Vynora Connects  
**Module:** Resources & Opportunities  
**Document Version:** 1.0  
**Status:** Draft  
**Prepared By:** Deepu  
**Date:** 13 October 2026

---

## 1. Introduction

### 1.1 Purpose

The purpose of this module is to provide students with a
centralized platform to discover useful learning resources
and student opportunities.

Learning resources will help students develop technical
and professional skills. Opportunities will help students
discover internships, hackathons, scholarships, and other
career-related activities.

### 1.2 Scope

The Resources & Opportunities module will allow students to:

- Browse learning resources.
- View resource titles, descriptions, categories, and links.
- Browse student opportunities.
- View opportunity details and deadlines.
- Search opportunities using keywords.
- Filter opportunities by category.
- Reset search and category filters.
- Open external resource and application links.

The initial version focuses on displaying information and
helping students discover relevant resources and opportunities.

### 1.3 Intended Users

The primary users are:

- Students looking for learning materials.
- Students searching for internships.
- Students interested in hackathons.
- Students searching for scholarships.
- Students who want to improve their technical skills.

---

## 2. Functional Requirements

### FR-01: Display Learning Resources

The system shall display a list of learning resources.

Each resource shall contain:

- Resource title.
- Description.
- Category.
- External resource link.

### FR-02: Display Student Opportunities

The system shall display a list of student opportunities.

Each opportunity shall contain:

- Opportunity title.
- Organization name.
- Description.
- Opportunity category.
- Application deadline.
- Application link, when available.

### FR-03: Search Opportunities

The system shall allow students to search opportunities
using keywords.

Search results should match relevant opportunity
information, including titles and organization names.

### FR-04: Filter Opportunities

The system shall allow students to filter opportunities
by category.

Initial categories shall include:

- Internship.
- Hackathon.
- Scholarship.

Students shall also be able to view all opportunities.

### FR-05: Reset Search and Filters

The system shall provide a reset control that clears the
search text and restores the default category selection.

### FR-06: Open Learning Resources

The system shall allow students to open learning resource
links in a new browser tab.

### FR-07: Open Opportunity Links

The system shall allow students to open the application
link associated with an opportunity when a valid link
is available.

If an application link is unavailable, the interface
shall inform the student.

### FR-08: Display Empty Search Results

When no opportunities match the search or selected
category, the system shall display an informative message.

---

## 3. Non-Functional Requirements

### NFR-01: Usability

The interface shall be easy to understand and navigate.

### NFR-02: Responsiveness

The interface shall adapt to desktop, tablet, and mobile
screen sizes.

### NFR-03: Performance

Search and category filtering should update the displayed
results without requiring a full page reload.

### NFR-04: Maintainability

The application shall use reusable React components to
make the interface easier to maintain and extend.

### NFR-05: Accessibility

Form controls shall have meaningful labels, and interactive
elements shall be usable with a keyboard.

### NFR-06: Link Safety

External links that open in a new tab shall use appropriate
browser security attributes.

### NFR-07: Data Accuracy

Opportunity titles, organization names, deadlines, and
application links should be accurate and reviewed before
publication.

---

## 4. User Stories

### US-01: Browse Learning Resources

As a student, I want to browse learning resources so that
I can find materials to improve my skills.

### US-02: View Opportunity Details

As a student, I want to see opportunity details and
deadlines so that I can decide which opportunities
are relevant to me.

### US-03: Search Opportunities

As a student, I want to search by keyword so that I can
find relevant opportunities quickly.

### US-04: Filter by Category

As a student, I want to filter opportunities by category
so that I can focus on internships, hackathons, or
scholarships.

### US-05: Reset Filters

As a student, I want to reset my search and filters so
that I can return to the complete opportunity list.

### US-06: Open External Links

As a student, I want to open resource and application
links so that I can access the original websites.

---

## 5. Acceptance Criteria

### AC-01: Learning Resources

Given that learning resources are available,
when a student opens the module,
then the resource cards should display their titles,
descriptions, categories, and links.

### AC-02: Opportunity Cards

Given that opportunities are available,
when a student opens the module,
then each opportunity card should display its title,
organization, description, category, and deadline.

### AC-03: Search

Given that opportunities are displayed,
when a student enters a matching keyword,
then only matching opportunities should be displayed.

### AC-04: Category Filter

Given that opportunities belong to different categories,
when a student selects a category,
then only opportunities from that category should appear.

### AC-05: Reset

Given that a search or category filter is active,
when the student selects Reset Filters,
then the search field should be cleared and all categories
should be displayed.

### AC-06: Empty Results

Given that no opportunity matches the current search
and category,
when the results are displayed,
then an informative empty-results message should appear.

### AC-07: External Links

Given that a valid external link is available,
when a student selects the corresponding link,
then the destination should open successfully.

### AC-08: Responsive Layout

Given that the module is opened on different screen sizes,
when the viewport changes,
then the interface should adapt without horizontal
overflow or unusable controls.

---

## 6. Assumptions and Constraints

- The initial version uses predefined resource and
  opportunity data.
- The initial version does not require a backend API.
- Opportunity application links must be supplied and
  verified before publication.
- The initial version does not provide user registration
  or personalized recommendations within this module.
- Future versions may retrieve resources and opportunities
  from a backend database.

---

## 7. Out of Scope

The following features are outside the scope of the
initial version:

- Applying for opportunities directly inside the platform.
- Uploading resumes.
- Tracking application status.
- Personalized opportunity recommendations.
- Administrator dashboards for managing listings.
- Automated deadline notifications.
- Backend database integration.

These features may be considered for future development.

---

## 8. Future Enhancements

Possible future improvements include:

- Search resources as well as opportunities.
- Add deadline status indicators.
- Add more opportunity categories.
- Retrieve listings from a backend API.
- Allow authorized administrators to manage listings.
- Verify expired and active opportunities.
- Add bookmarking and personalized recommendations.

---

## 9. Definition of Done

The module will be considered ready for its initial release
when:

- Learning resources display correctly.
- Opportunity cards display complete information.
- Search works as specified.
- Category filtering works correctly.
- Reset Filters restores the default view.
- Empty search results display an informative message.
- External links behave correctly.
- The layout works on desktop and mobile screens.
- The requirements have been reviewed.
- The implementation has been tested against the
  acceptance criteria.