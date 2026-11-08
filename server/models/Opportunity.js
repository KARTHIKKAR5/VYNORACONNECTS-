/**
 * Vynora Connect — Opportunities & Resources Module
 * Mongoose Schema: Opportunity
 *
 * NOTE: References canonical User model from the shared backend infrastructure.
 * Does not duplicate user credentials or auth logic.
 */

const mongoose = require('mongoose');

const OpportunitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Opportunity title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [120, 'Title cannot exceed 120 characters'],
      index: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Opportunity type is required'],
      enum: [
        'hackathon',
        'internship',
        'contest',
        'scholarship',
        'case_competition',
        'fellowship',
        'other',
      ],
      index: true,
    },
    organizerName: {
      type: String,
      required: [true, 'Organizer or company name is required'],
      trim: true,
      maxlength: [100, 'Organizer name cannot exceed 100 characters'],
    },
    organizerUrl: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [20, 'Description must be at least 20 characters'],
      maxlength: [3000, 'Description cannot exceed 3000 characters'],
    },
    eligibility: {
      type: String,
      required: [true, 'Eligibility criteria is required'],
      trim: true,
      maxlength: [500, 'Eligibility cannot exceed 500 characters'],
    },
    eligibleYears: [{
      type: Number,
      min: 1,
      max: 5,
    }],
    skills: [{
      type: String,
      trim: true,
      lowercase: true,
    }],
    mode: {
      type: String,
      required: [true, 'Work or participation mode is required'],
      enum: ['online', 'offline', 'hybrid'],
      default: 'online',
      index: true,
    },
    city: {
      type: String,
      trim: true,
      default: '',
    },
    startsAt: {
      type: Date,
    },
    endsAt: {
      type: Date,
    },
    deadlineAt: {
      type: Date,
      required: [true, 'Application or registration deadline is required'],
      index: true,
    },
    applicationUrl: {
      type: String,
      required: [true, 'Official application URL is required'],
      trim: true,
    },
    prizeDescription: {
      type: String,
      trim: true,
      default: '',
    },
    stipendDescription: {
      type: String,
      trim: true,
      default: '',
    },
    teamMin: {
      type: Number,
      default: 1,
      min: 1,
    },
    teamMax: {
      type: Number,
      default: 1,
      min: 1,
    },
    bannerUrl: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['draft', 'pending', 'published', 'rejected', 'closed', 'expired', 'archived'],
      default: 'pending', // Submissions remain pending review by Revanth's moderation team
      index: true,
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Submitting student reference is required'],
      index: true,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Search indexes across keyword fields
OpportunitySchema.index({
  title: 'text',
  organizerName: 'text',
  description: 'text',
  skills: 'text',
});

// Compound indexes for feed querying
OpportunitySchema.index({ status: 1, deadlineAt: 1 });
OpportunitySchema.index({ type: 1, status: 1, deadlineAt: 1 });
OpportunitySchema.index({ mode: 1, status: 1, deadlineAt: 1 });

// Helper virtual for dynamic deadline urgency calculation
OpportunitySchema.virtual('urgencyStatus').get(function () {
  if (this.status !== 'published') return this.status;
  const now = new Date();
  if (this.deadlineAt && this.deadlineAt < now) {
    return 'expired';
  }
  const hoursRemaining = (this.deadlineAt - now) / (1000 * 60 * 60);
  if (hoursRemaining <= 48) {
    return 'closing-soon';
  }
  return 'open';
});

module.exports = mongoose.models.Opportunity || mongoose.model('Opportunity', OpportunitySchema);

