/**
 * Vynora Connect — Teams & Projects Module
 * Mongoose Schema: Team & Team Membership
 *
 * NOTE: References canonical User model from the shared backend maintainer.
 */

const mongoose = require('mongoose');

const TeamMemberSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  role: {
    type: String,
    enum: ['owner', 'manager', 'member'],
    default: 'member',
  },
  assignedRoleTitle: {
    type: String,
    trim: true,
    default: 'Team Member',
    maxlength: 80,
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

const TeamSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Team name is required'],
      trim: true,
      maxlength: 120,
    },
    maxCapacity: {
      type: Number,
      default: 10,
      min: [2, 'Team capacity must be at least 2'],
      max: [30, 'Team capacity cannot exceed 30'],
    },
    members: [TeamMemberSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Team || mongoose.model('Team', TeamSchema);

