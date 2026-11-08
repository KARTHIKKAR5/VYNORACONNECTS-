/**
 * Vynora Connect — Resources Controller
 *
 * Implements public learning resource library, validated contributions (pending moderation),
 * peer upvoting, and personal bookmarks.
 */

const Resource = require('../models/Resource');
const Bookmark = require('../models/Bookmark');

function isValidUrl(string) {
  try {
    const parsed = new URL(string);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Public Learning Resources Catalog
 */
exports.getResources = async (req, res) => {
  try {
    const {
      search,
      branch,
      topic,
      type,
      difficulty,
      page = 1,
      limit = 10,
      sortBy = 'newest',
    } = req.query;

    const query = { status: 'published' };

    if (branch && branch !== 'All') {
      query.branch = branch;
    }

    if (topic && topic !== 'All') {
      query.topic = topic;
    }

    if (type && type !== 'all') {
      query.type = type;
    }

    if (difficulty && difficulty !== 'all') {
      query.difficulty = difficulty;
    }

    if (search && search.trim()) {
      query.$text = { $search: search.trim() };
    }

    let sort = { createdAt: -1 };
    if (sortBy === 'upvotes') sort = { upvotesCount: -1 };
    if (sortBy === 'oldest') sort = { createdAt: 1 };

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [resources, total] = await Promise.all([
      Resource.find(query)
        .populate('createdBy', 'name college department')
        .sort(sort)
        .skip(skip)
        .limit(limitNum),
      Resource.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      data: resources,
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
 * Get Resource by ID
 */
exports.getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('createdBy', 'name college department');

    if (!resource) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Resource not found' },
      });
    }

    const currentUserId = req.user?.id || req.user?._id;
    if (
      resource.status !== 'published' &&
      (!currentUserId || resource.createdBy?._id?.toString() !== currentUserId.toString())
    ) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'This resource is pending moderation review.' },
      });
    }

    return res.status(200).json({
      success: true,
      data: resource,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message },
    });
  }
};

/**
 * Submit Educational Resource (Enters pending review)
 */
exports.createResource = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required to contribute resources' },
      });
    }

    const {
      title,
      type,
      description,
      topic,
      branch,
      technologies,
      tags,
      difficulty,
      access,
      sourceUrl,
      thumbnailUrl,
    } = req.body;

    if (!sourceUrl || !isValidUrl(sourceUrl)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_URL', message: 'Valid source URL (http/https) is required' },
      });
    }

    const resource = new Resource({
      title,
      type,
      description,
      topic,
      branch: branch || 'General',
      technologies: Array.isArray(technologies) ? technologies : [],
      tags: Array.isArray(tags) ? tags : [],
      difficulty: difficulty || 'beginner',
      access: access || 'free',
      sourceUrl: sourceUrl.trim(),
      thumbnailUrl: thumbnailUrl || '',
      status: 'pending', // Submissions enter pending review by default
      createdBy: userId,
    });

    await resource.save();

    return res.status(201).json({
      success: true,
      data: resource,
      message: 'Resource submitted successfully. It is now pending moderation review.',
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: err.message },
    });
  }
};

/**
 * Get Authenticated Student's Own Contributions
 */
exports.getMyResources = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
      });
    }

    const contributions = await Resource.find({ createdBy: userId })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: contributions,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message },
    });
  }
};

/**
 * Toggle Upvote for a Resource
 */
exports.upvoteResource = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
      });
    }

    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Resource not found' },
      });
    }

    const alreadyUpvoted = resource.upvotedBy.some(id => id.toString() === userId.toString());

    if (alreadyUpvoted) {
      resource.upvotedBy = resource.upvotedBy.filter(id => id.toString() !== userId.toString());
      resource.upvotesCount = Math.max(0, resource.upvotesCount - 1);
    } else {
      resource.upvotedBy.push(userId);
      resource.upvotesCount += 1;
    }

    await resource.save();

    return res.status(200).json({
      success: true,
      data: {
        upvotesCount: resource.upvotesCount,
        hasUpvoted: !alreadyUpvoted,
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
 * Save Resource to Student Bookmarks
 */
exports.saveResource = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
      });
    }

    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Resource not found' },
      });
    }

    const bookmark = await Bookmark.findOneAndUpdate(
      { userId, itemType: 'resource', itemId: resource._id },
      { $setOnInsert: { trackerStatus: 'saved' } },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      success: true,
      data: bookmark,
      message: 'Resource bookmarked.',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message },
    });
  }
};

/**
 * Unsave Resource
 */
exports.unsaveResource = async (req, res) => {
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
      itemType: 'resource',
      itemId: req.params.id,
    });

    return res.status(200).json({
      success: true,
      message: 'Resource removed from bookmarks.',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message },
    });
  }
};

/**
 * Get Saved Resources for Current Student
 */
exports.getSavedResources = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
      });
    }

    const bookmarks = await Bookmark.find({ userId, itemType: 'resource' })
      .sort({ createdAt: -1 });

    const resourceIds = bookmarks.map(b => b.itemId);
    const resources = await Resource.find({ _id: { $in: resourceIds } });

    const joined = bookmarks.map(b => {
      const resItem = resources.find(r => r._id.toString() === b.itemId.toString());
      return {
        bookmarkId: b._id,
        savedAt: b.createdAt,
        resource: resItem || null,
      };
    }).filter(item => item.resource !== null);

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

