/**
 * Vynora Connect — Teams & Projects Module
 * Adapter: Revanth's Trust, Safety & Moderation Module Integration
 *
 * Dispatches content audit flags and user reports directly to the moderation pipeline.
 */

export const REPORT_REASONS = [
  'Inappropriate Content or Language',
  'Spam or Commercial Solicitation',
  'Misleading Project or Fake Team',
  'Harassment or Hate Speech',
  'Intellectual Property Infringement',
  'Other Policy Violation',
];

class ModerationAdapter {
  constructor() {
    this.reportedItems = [];
  }

  async reportProject(projectId, projectTitle, reason, details = '', reportedByUserId = 'usr-current-student') {
    const report = {
      id: `rep-${Date.now()}`,
      targetType: 'project',
      targetId: projectId,
      targetTitle: projectTitle,
      reason,
      details: details.trim(),
      reportedBy: reportedByUserId,
      createdAt: new Date().toISOString(),
      status: 'pending_review',
    };

    this.reportedItems.push(report);
    return {
      success: true,
      data: report,
      message: 'Report submitted to Trust & Safety moderation team for review.',
    };
  }

  getReports() {
    return [...this.reportedItems];
  }
}

export const moderationAdapter = new ModerationAdapter();

