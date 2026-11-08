/**
 * Vynora Connect — Teams & Projects Module
 * Mongoose Schema: Project
 *
 * NOTE: References canonical User model from the shared backend maintainer.
 * Does not duplicate user credentials or profile attributes.
 */

const mongoose = require('mongoose');

const OpenRoleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Role title is required'],
    trim: true,
    maxlength: 80,
  },
  skillsRequired: [{
    type: String,
    trim: true,
    lowercase: true,
  }],
  description: {
    type: String,
    trim: true,
    maxlength: 300,
  },
  openings: {
    type: Number,
    required: true,
    min: [1, 'Openings must be at least 1'],
    default: 1,
  },
  filled: {
    type: Number,
    default: 0,
    min: 0,
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open',
  },
});

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      minlength: [5, 'Project title must be at least 5 characters'],
      maxlength: [100, 'Project title cannot exceed 100 characters'],
      index: true,
    },
    tagline: {
      type: String,
      required: [true, 'Tagline is required'],
      trim: true,
      minlength: [10, 'Tagline must be at least 10 characters'],
      maxlength: [160, 'Tagline cannot exceed 160 characters'],
    },
    problemStatement: {
      type: String,
      required: [true, 'Problem statement is required'],
      trim: true,
      minlength: [20, 'Problem statement must be at least 20 characters'],
      maxlength: [1000, 'Problem statement cannot exceed 1000 characters'],
    },
    goals: {
      type: String,
      required: [true, 'Project goals are required'],
      trim: true,
      minlength: [20, 'Goals must be at least 20 characters'],
      maxlength: [1000, 'Goals cannot exceed 1000 characters'],
    },
    summary: {
      type: String,
      required: [true, 'Summary is required'],
      trim: true,
      minlength: [20, 'Summary must be at least 20 characters'],
      maxlength: [500, 'Summary cannot exceed 500 characters'],
    },
    description: {
      type: String,
      required: [true, 'Full description is required'],
      trim: true,
      minlength: [30, 'Description must be at least 30 characters'],
      maxlength: [3000, 'Description cannot exceed 3000 characters'],
    },
    recruitmentRequirements: {
      type: String,
      trim: true,
      maxlength: [1000, 'Recruitment requirements cannot exceed 1000 characters'],
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Hackathon',
        'Web Application',
        'Mobile Application',
        'AI & Machine Learning',
        'Open Source',
        'Campus Utility',
        'Startup & Entrepreneurship',
        'Research & Academic',
      ],
      index: true,
    },
    tags: [{
      type: String,
      trim: true,
      lowercase: true,
    }],
    visibility: {
      type: String,
      enum: ['public', 'campus-only', 'private'],
      default: 'public',
      index: true,
    },
    status: {
      type: String,
      enum: ['planning', 'active', 'completed', 'archived'],
      default: 'planning',
      index: true,
    },
    // Reference to the canonical User model (Shared maintainer)
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Project lead is required'],
      index: true,
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
    },
    openRoles: [OpenRoleSchema],
  },
  {
    timestamps: true,
  }
);

// Compound text index for search across title, description, and tags
ProjectSchema.index({
  title: 'text',
  tagline: 'text',
  summary: 'text',
  description: 'text',
  tags: 'text',
});

// Virtual for calculating total available positions
// Correctly accounts for recruitment position openings and accepted team memberships
ProjectSchema.virtual('availablePositions').get(function () {
  const currentMembersCount = this.teamId?.members?.length || 0;
  const maxCapacity = this.teamId?.maxCapacity;
  const remainingTeamCapacity = typeof maxCapacity === 'number'
    ? Math.max(0, maxCapacity - currentMembersCount)
    : Infinity;

  // If team has reached max capacity, no positions are available
  if (remainingTeamCapacity === 0) return 0;

  if (this.openRoles && this.openRoles.length > 0) {
    const roleOpenings = this.openRoles.reduce((acc, role) => {
      if (role.status === 'open') {
        const remaining = (role.openings || 1) - (role.filled || 0);
        return acc + Math.max(0, remaining);
      }
      return acc;
    }, 0);
    // Bounded by both defined role openings and physical team capacity
    return Math.min(roleOpenings, remainingTeamCapacity);
  }

  return remainingTeamCapacity === Infinity ? 0 : remainingTeamCapacity;
});

module.exports = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

