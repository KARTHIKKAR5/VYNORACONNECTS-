/**
 * Vynora Connect — Opportunities & Resources Module
 * Mongoose Schema: Resource (Study Notes, Roadmaps, Textbooks, Cheat Sheets)
 *
 * NOTE: References canonical User model from the shared backend infrastructure.
 * Does not duplicate user credentials or auth logic.
 */

const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Resource title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [150, 'Title cannot exceed 150 characters'],
      index: true,
    },
    type: {
      type: String,
      required: [true, 'Resource format type is required'],
      enum: [
        'article',
        'video',
        'documentation',
        'course',
        'roadmap',
        'repository',
        'tool',
        'document',
      ],
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [15, 'Description must be at least 15 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    topic: {
      type: String,
      required: [true, 'Topic or subject is required'],
      trim: true,
      maxlength: [80, 'Topic cannot exceed 80 characters'],
      index: true,
    },
    branch: {
      type: String,
      enum: ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'General'],
      default: 'General',
      index: true,
    },
    technologies: [{
      type: String,
      trim: true,
      lowercase: true,
    }],
    tags: [{
      type: String,
      trim: true,
      lowercase: true,
    }],
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    access: {
      type: String,
      enum: ['free', 'paid', 'freemium'],
      default: 'free',
    },
    sourceUrl: {
      type: String,
      required: [true, 'Direct resource source URL is required'],
      trim: true,
    },
    thumbnailUrl: {
      type: String,
      trim: true,
      default: '',
    },
    upvotesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    upvotedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    status: {
      type: String,
      enum: ['pending', 'published', 'rejected', 'archived'],
      default: 'pending', // Submissions enter pending review by moderation
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator user reference is required'],
      index: true,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Search indexes across keyword fields
ResourceSchema.index({
  title: 'text',
  description: 'text',
  topic: 'text',
  tags: 'text',
});

// Compound feed indexes
ResourceSchema.index({ status: 1, branch: 1, topic: 1 });
ResourceSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.models.Resource || mongoose.model('Resource', ResourceSchema);

