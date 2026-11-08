/**
 * Vynora Connect — Teams & Projects Module
 * Adapter: Vynora Points Service & Talent Discovery Integration Boundary
 *
 * NOTE: The shared Vynora Points service API contract is pending implementation by the platform infrastructure team.
 *
 * Architectural Guarantees:
 * 1. Technical skills, portfolio history, and project suitability remain PRIMARY criteria.
 * 2. Does NOT invent arbitrary point thresholds or hardcode fake point numbers.
 * 3. Does NOT falsely claim eligibility verification when the points backend is offline.
 * 4. Provides a clean event-emitting boundary for awarding points upon milestone triggers.
 */

export const POINTS_EVENT_TRIGGERS = {
  PROJECT_LAUNCHED: 'PROJECT_LAUNCHED',
  TEAM_MEMBER_RECRUITED: 'TEAM_MEMBER_RECRUITED',
  TASK_COMPLETED: 'TASK_COMPLETED',
  PROJECT_COMPLETED: 'PROJECT_COMPLETED',
};

class PointsServiceAdapter {
  constructor() {
    this.isServiceAvailable = false; // Verified offline / pending contract
    this.dispatchedEvents = [];
  }

  /**
   * Check status of the Points Service
   */
  getIntegrationStatus() {
    return {
      available: this.isServiceAvailable,
      statusLabel: 'Awaiting Vynora Points Service Contract',
      rankingMode: 'Skills and project alignment primary',
      message: 'Points service is currently offline. Candidate review is based strictly on verified technical skills, experience, and project suitability.',
    };
  }

  /**
   * Evaluate candidate eligibility
   * Strictly evaluates skills matching without arbitrary point gates
   */
  evaluateCandidateEligibility(requiredSkills = [], candidateSkills = []) {
    const normalizedRequired = requiredSkills.map(s => s.toLowerCase().trim());
    const normalizedCandidate = candidateSkills.map(s => s.toLowerCase().trim());

    const matchingSkills = normalizedRequired.filter(req =>
      normalizedCandidate.some(cand => cand.includes(req) || req.includes(cand))
    );

    const matchRatio = normalizedRequired.length > 0
      ? matchingSkills.length / normalizedRequired.length
      : 1.0;

    return {
      isEligible: true, // Always allow application submission; owners evaluate suitability
      skillMatchRatio: matchRatio,
      matchingSkills,
      missingSkills: normalizedRequired.filter(s => !matchingSkills.includes(s)),
      pointsVerified: false,
      evaluationNote: 'Evaluated via technical skill overlap.',
    };
  }

  /**
   * Dispatch milestone event for future points listeners
   */
  emitPointsEvent(triggerType, payload) {
    const event = {
      triggerType,
      payload,
      timestamp: new Date().toISOString(),
      status: this.isServiceAvailable ? 'dispatched' : 'buffered_locally',
    };
    this.dispatchedEvents.push(event);
    return event;
  }

  getBufferedEvents() {
    return [...this.dispatchedEvents];
  }
}

export const pointsServiceAdapter = new PointsServiceAdapter();

