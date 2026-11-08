/**
 * Vynora Connect — Profile Mongoose Model
 *
 * Module: Module 2 (Student Network & Profiles)
 * Owner: Ram
 *
 * Implements persistent profile storage referencing central User through `userId`.
 * Enforces data boundaries: does not store passwords, tokens, roles, or canonical email.
 */

const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    college: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    branch: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    studyYear: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 300,
      default: '',
    },
    skills: {
      type: [String],
      default: [],
      validate: {
        validator: (skills) => Array.isArray(skills) && skills.length <= 15,
        message: 'A student cannot list more than 15 skills.',
      },
    },
    interests: {
      type: [String],
      default: [],
      validate: {
        validator: (interests) => Array.isArray(interests) && interests.length <= 10,
        message: 'A student cannot list more than 10 interests.',
      },
    },
    links: {
      github: { type: String, trim: true, default: '' },
      linkedin: { type: String, trim: true, default: '' },
      website: { type: String, trim: true, default: '' },
    },
    avatarUrl: {
      type: String,
      trim: true,
      default: '',
    },
    visibility: {
      profile: {
        type: String,
        enum: ['students', 'connections', 'private'],
        default: 'students',
      },
      showProjects: {
        type: Boolean,
        default: true,
      },
      showLinks: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Performance compound indexes for discovery and search
ProfileSchema.index({ college: 1, studyYear: 1 });
ProfileSchema.index({ skills: 1 });

module.exports = mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);

