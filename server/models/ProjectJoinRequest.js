/**
 * Vynora Connect — Teams & Projects Module
 * Mongoose Schema: ProjectJoinRequest (Application Lifecycle)
 *
 * NOTE: References canonical User model from the shared backend maintainer.
 */

const mongoose = require('mongoose');

const ProjectJoinRequestSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    roleId: {
      type: String,
      required: true,
    },
    roleTitle: {
      type: String,
      required: true,
      trim: true,
    },
    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    introduction: {
      type: String,
      required: [true, 'Introduction / pitch is required'],
      trim: true,
      minlength: [20, 'Introduction must be at least 20 characters'],
      maxlength: [1000, 'Introduction cannot exceed 1000 characters'],
    },
    relevantSkills: [{
      type: String,
      trim: true,
      lowercase: true,
    }],
    experienceSummary: {
      type: String,
      required: [true, 'Experience summary is required'],
      trim: true,
      minlength: [10, 'Experience summary must be at least 10 characters'],
      maxlength: [1000, 'Experience summary cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
      default: 'pending',
      index: true,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
    },
    reviewerFeedback: {
      type: String,
      trim: true,
      maxlength: [500, 'Reviewer feedback cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to quickly find applicant requests for a project
ProjectJoinRequestSchema.index({ projectId: 1, applicantId: 1, status: 1 });

module.exports = mongoose.models.ProjectJoinRequest || mongoose.model('ProjectJoinRequest', ProjectJoinRequestSchema);

