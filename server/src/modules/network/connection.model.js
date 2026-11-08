/**
 * Vynora Connect — Connection Mongoose Model
 *
 * Module: Module 2 (Student Network & Profiles)
 * Owner: Ram
 *
 * Implements the student-to-student connection graph state machine:
 * 'pending' -> 'accepted' | 'rejected' | 'cancelled'
 *
 * Enforces mutual pair uniqueness at the database engine level via `pairKey`
 * to prevent concurrent reverse duplicate requests (e.g. A->B while B->A).
 */

const mongoose = require('mongoose');

const ConnectionSchema = new mongoose.Schema(
  {
    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // Normalized pair key: sorted IDs joined by ':' (e.g. "minId:maxId")
    // Enforces that only ONE active connection ('pending' or 'accepted') can exist
    // between two students in either direction simultaneously.
    pairKey: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'cancelled'],
      default: 'pending',
      required: true,
      index: true,
    },
    respondedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Performance compound indexes for query patterns
ConnectionSchema.index({ requesterId: 1, status: 1, createdAt: -1 });
ConnectionSchema.index({ recipientId: 1, status: 1, createdAt: -1 });

// Database-level partial unique index:
// Guarantees that across all distributed nodes and concurrent requests,
// only ONE active ('pending' or 'accepted') connection can exist for any student pair!
ConnectionSchema.index(
  { pairKey: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $in: ['pending', 'accepted'] } },
  }
);

// Pre-save hook: compute pairKey and reject self-connections
ConnectionSchema.pre('validate', function (next) {
  if (this.requesterId && this.recipientId) {
    const rId = this.requesterId.toString();
    const tId = this.recipientId.toString();

    if (rId === tId) {
      return next(new Error('Students cannot create connections to themselves.'));
    }

    // Deterministic sorted pairKey ensures (A, B) and (B, A) generate identical pairKey
    this.pairKey = [rId, tId].sort().join(':');
  }
  next();
});

module.exports = mongoose.models.Connection || mongoose.model('Connection', ConnectionSchema);
