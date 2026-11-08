/**
 * Vynora Connect — Opportunities Controller
 *
 * Implements public discovery, validated student submissions (pending moderation),
 * Karthik dashboard preview export, and private saved tracker integration.
 */

const Opportunity = require('../models/Opportunity');
const Bookmark = require('../models/Bookmark');

/**
 * Validate URL safety
 */
function isValidUrl(string) {
  try {
    const parsed = new URL(string);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Public Opportunity Discovery Feed
 */
exports.getOpportunities = async (req, res) => {
  try {
    const {
      search,
      type,
      mode,
      status = 'active',
      page = 1,
      limit = 10,
      sortBy = 'deadline',
    } = req.query;

    const query = { status: 'published' };

    // Deadline status filtering
    const now = new Date();
    if (status === 'active') {
      query.deadlineAt = { $gte: now };
    } else if (status === 'urgent') {
      const urgentCutoff = new Date(now.getTime() + 48 * 60 * 60 * 1000);
      query.deadlineAt = { $gte: now, $lte: urgentCutoff };
    } else if (status === 'expired') {
      query.deadlineAt = { $lt: now };
    }

    if (type && type !== 'all') {
      query.type = type;
    }

    if (mode && mode !== 'all') {
      query.mode = mode;
    }

    if (search && search.trim()) {
      query.$text = { $search: search.trim() };
    }

    let sort = { deadlineAt: 1 };
    if (sortBy === 'newest') sort = { createdAt: -1 };
    if (sortBy === 'deadline') sort = { deadlineAt: 1 };

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [opportunities, total] = await Promise.all([
      Opportunity.find(query)
        .populate('submittedBy', 'name college department')
        .sort(sort)
        .skip(skip)
        .limit(limitNum),
      Opportunity.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      data: opportunities,
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message },
    });
  }
};

/**
 * Get Opportunity by ID
 */
exports.getOpportunityById = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id)
      .populate('submittedBy', 'name college department');

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Opportunity not found' },
      });
    }

    // Non-published opportunities visible only to submitter or admin
    const currentUserId = req.user?.id || req.user?._id;
    if (
      opportunity.status !== 'published' &&
      (!currentUserId || opportunity.submittedBy?._id?.toString() !== currentUserId.toString())
    ) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'This listing is pending moderation review.' },
      });
    }

    return res.status(200).json({
      success: true,
      data: opportunity,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message },
    });
  }
};

/**
 * Submit Opportunity (Strictly enters pending review)
 */
exports.createOpportunity = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required to submit opportunities' },
      });
    }

    const {
      title,
      type,
      organizerName,
      organizerUrl,
      description,
      eligibility,
      eligibleYears,
      skills,
      mode,
      city,
      startsAt,
      endsAt,
      deadlineAt,
      applicationUrl,
      prizeDescription,
      stipendDescription,
      teamMin,
      teamMax,
      bannerUrl,
    } = req.body;

    if (!applicationUrl || !isValidUrl(applicationUrl)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_URL', message: 'Valid application URL (http/https) is required' },
      });
    }

    if (!deadlineAt || new Date(deadlineAt) <= new Date()) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_DEADLINE', message: 'Deadline must be a valid future date' },
      });
    }

    const opportunity = new Opportunity({
      title,
      type,
      organizerName,
      organizerUrl: organizerUrl?.trim() || '',
      description,
      eligibility,
      eligibleYears: Array.isArray(eligibleYears) ? eligibleYears : [],
      skills: Array.isArray(skills) ? skills : [],
      mode: mode || 'online',
      city: city || '',
      startsAt,
      endsAt,
      deadlineAt,
      applicationUrl: applicationUrl.trim(),
      prizeDescription: prizeDescription || '',
      stipendDescription: stipendDescription || '',
      teamMin: teamMin || 1,
      teamMax: teamMax || 1,
      bannerUrl: bannerUrl || '',
      status: 'pending', // Submissions enter pending review by default
      submittedBy: userId,
    });

    await opportunity.save();

    return res.status(201).json({
      success: true,
      data: opportunity,
      message: 'Opportunity submitted successfully. It is now pending review by moderation.',
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: err.message },
    });
  }
};

/**
 * Get Authenticated Student's Own Submissions
 */
exports.getMySubmissions = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
      });
    }

    const submissions = await Opportunity.find({ submittedBy: userId })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: submissions,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message },
    });
  }
};

/**
 * Export for Karthik's Home Dashboard Preview
 */
exports.getFeaturedOpportunities = async (req, res) => {
  try {
    const limit = Math.min(10, parseInt(req.query.limit, 10) || 3);
    const now = new Date();

    const opportunities = await Opportunity.find({
      status: 'published',
      deadlineAt: { $gte: now },
    })
      .sort({ deadlineAt: 1 })
      .limit(limit);

    // Format to match Karthik's exact OpportunityPreview component contract
    const formatted = opportunities.map(opp => ({
      id: opp._id.toString(),
      title: opp.title,
      organization: opp.organizerName,
      type: opp.type.charAt(0).toUpperCase() + opp.type.slice(1),
      deadline: new Date(opp.deadlineAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      isoDeadline: opp.deadlineAt.toISOString(),
      isExpiringSoon: (opp.deadlineAt - now) <= (48 * 60 * 60 * 1000),
    }));

    return res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message },
    });
  }
};

/**
 * Save Opportunity to Private Tracker
 */
exports.saveOpportunity = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required to save items' },
      });
    }

    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Opportunity not found' },
      });
    }

    const bookmark = await Bookmark.findOneAndUpdate(
      { userId, itemType: 'opportunity', itemId: opportunity._id },
      { $setOnInsert: { trackerStatus: 'saved' } },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      success: true,
      data: bookmark,
      message: 'Opportunity saved to personal tracker.',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message },
    });
  }
};

/**
 * Unsave Opportunity
 */
exports.unsaveOpportunity = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
      });
    }

    await Bookmark.findOneAndDelete({
      userId,
      itemType: 'opportunity',
      itemId: req.params.id,
    });

    return res.status(200).json({
      success: true,
      message: 'Opportunity removed from personal tracker.',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message },
    });
  }
};

/**
 * Update Application Tracker Status
 */
exports.updateTrackerStatus = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { trackerStatus, notes } = req.body;

    const allowed = ['saved', 'interested', 'planning', 'applied', 'shortlisted', 'rejected', 'selected'];
    if (trackerStatus && !allowed.includes(trackerStatus)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_STATUS', message: 'Invalid tracker status' },
      });
    }

    const updateFields = {};
    if (trackerStatus) updateFields.trackerStatus = trackerStatus;
    if (notes !== undefined) updateFields.notes = notes;

    const bookmark = await Bookmark.findOneAndUpdate(
      { userId, itemType: 'opportunity', itemId: req.params.id },
      { $set: updateFields },
      { new: true }
    );

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Saved opportunity not found in your tracker' },
      });
    }

    return res.status(200).json({
      success: true,
      data: bookmark,
      message: 'Tracker status updated.',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message },
    });
  }
};

/**
 * Get Current Student's Saved Opportunities
 */
exports.getSavedOpportunities = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
      });
    }

    const bookmarks = await Bookmark.find({ userId, itemType: 'opportunity' })
      .sort({ createdAt: -1 });

    const opportunityIds = bookmarks.map(b => b.itemId);
    const opportunities = await Opportunity.find({ _id: { $in: opportunityIds } });

    // Join tracker status with opportunity object
    const joined = bookmarks.map(b => {
      const opp = opportunities.find(o => o._id.toString() === b.itemId.toString());
      return {
        bookmarkId: b._id,
        trackerStatus: b.trackerStatus,
        notes: b.notes,
        savedAt: b.createdAt,
        opportunity: opp || null,
      };
    }).filter(item => item.opportunity !== null);

    return res.status(200).json({
      success: true,
      data: joined,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message },
    });
  }
};

