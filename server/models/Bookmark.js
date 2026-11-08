/**
 * Vynora Connect — Opportunities & Resources Module
 * Mongoose Schema: Bookmark (Private Personal Tracker & Saved Items)
 *
 * Supports saving both Learning Resources and Career Opportunities.
 * Enforces strict per-student isolation: One user cannot access another student's bookmarks.
 * Unique compound index on { userId, itemType, itemId } prevents duplicate saves.
 */

const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student user reference is required'],
      index: true,
    },
    itemType: {
      type: String,
      enum: ['opportunity', 'resource'],
      required: [true, 'Item type is required'],
      index: true,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Item ID reference is required'],
      index: true,
    },
    trackerStatus: {
      type: String,
      enum: ['saved', 'interested', 'planning', 'applied', 'shortlisted', 'rejected', 'selected'],
      default: 'saved',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: '',
    },
    reminderEnabled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Guarantee private isolation and duplicate save prevention
BookmarkSchema.index({ userId: 1, itemType: 1, itemId: 1 }, { unique: true });
BookmarkSchema.index({ userId: 1, itemType: 1, createdAt: -1 });

module.exports = mongoose.models.Bookmark || mongoose.model('Bookmark', BookmarkSchema);

