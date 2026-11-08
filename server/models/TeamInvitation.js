/**
 * Vynora Connect — Teams & Projects Module
 * Mongoose Schema: TeamInvitation
 *
 * NOTE: References canonical User model from the shared backend maintainer.
 */

const mongoose = require('mongoose');

const TeamInvitationSchema = new mongoose.Schema(
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
    invitedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    invitedByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      trim: true,
      maxlength: [500, 'Invitation message cannot exceed 500 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'cancelled'],
      default: 'pending',
      index: true,
    },
    respondedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate active invitations for the same user on the same project
TeamInvitationSchema.index({ projectId: 1, invitedUserId: 1, status: 1 });

module.exports = mongoose.models.TeamInvitation || mongoose.model('TeamInvitation', TeamInvitationSchema);

