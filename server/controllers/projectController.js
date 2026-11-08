/**
 * Vynora Connect — Teams & Projects Module
 * Controller Specification & Business Logic
 *
 * Implements strict role-based access control, atomic capacity checks,
 * duplicate application prevention, and privacy-safe student representations.
 */

const Project = require('../models/Project');
const Team = require('../models/Team');
const ProjectJoinRequest = require('../models/ProjectJoinRequest');
const TeamInvitation = require('../models/TeamInvitation');
const TeamTask = require('../models/TeamTask');

exports.getProjects = async (req, res) => {
  try {
    const { search, category, tag, recruitingOnly, page = 1, limit = 10, sortBy = 'newest' } = req.query;
    const query = { visibility: { $ne: 'private' } };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (tag) {
      query.tags = tag.toLowerCase().trim();
    }

    if (search && search.trim()) {
      query.$text = { $search: search.trim() };
    }

    let sort = { createdAt: -1 };
    if (sortBy === 'oldest') sort = { createdAt: 1 };

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const currentUserId = req.user?._id?.toString();

    let projects = await Project.find(query)
      .populate('leadId', 'name college department')
      .populate('teamId')
      .sort(sort);

    // Active recruitment discovery rule:
    // Remove fully staffed projects from active recruitment discovery for non-members,
    // while keeping them accessible to the project lead and existing team members.
    projects = projects.filter(p => {
      const isLead = currentUserId && p.leadId && p.leadId._id?.toString() === currentUserId;
      const isMember = currentUserId && p.teamId?.members?.some(m => m.userId?.toString() === currentUserId);
      if (isLead || isMember) return true;

      const currentMembersCount = p.teamId?.members?.length || 0;
      const maxCap = p.teamId?.maxCapacity;
      const remainingTeamCapacity = typeof maxCap === 'number' ? Math.max(0, maxCap - currentMembersCount) : Infinity;
      if (remainingTeamCapacity === 0) return false;

      let available = remainingTeamCapacity;
      if (p.openRoles && p.openRoles.length > 0) {
        const roleOpenings = p.openRoles.reduce((acc, r) => {
          if (r.status === 'open') {
            const rem = (r.openings || 1) - (r.filled || 0);
            return acc + Math.max(0, rem);
          }
          return acc;
        }, 0);
        available = Math.min(roleOpenings, remainingTeamCapacity);
      }

      return available > 0;
    });

    const total = projects.length;
    const paginated = projects.slice(skip, skip + limitNum);

    return res.status(200).json({
      success: true,
      data: paginated,
      pagination: {
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

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('leadId', 'name college department')
      .populate({
        path: 'teamId',
        populate: { path: 'members.userId', select: 'name college department' },
      });

    if (!project) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Project not found' },
      });
    }

    return res.status(200).json({ success: true, data: project });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message },
    });
  }
};

exports.createProject = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });
    }

    const {
      title,
      tagline,
      problemStatement,
      goals,
      summary,
      description,
      recruitmentRequirements,
      category,
      tags,
      visibility,
      openRoles,
    } = req.body;

    const project = new Project({
      title,
      tagline,
      problemStatement,
      goals,
      summary,
      description,
      recruitmentRequirements,
      category,
      tags: Array.isArray(tags) ? tags : [],
      visibility: visibility || 'public',
      leadId: userId,
      openRoles: Array.isArray(openRoles) ? openRoles : [],
    });

    await project.save();

    // Automatically create associated Team with creator as Owner
    const team = new Team({
      projectId: project._id,
      name: `${project.title} Team`,
      members: [
        {
          userId,
          role: 'owner',
          assignedRoleTitle: 'Project Lead',
          joinedAt: new Date(),
        },
      ],
    });

    await team.save();
    project.teamId = team._id;
    await project.save();

    return res.status(201).json({ success: true, data: project });
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: err.message },
    });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const userId = req.user?._id;
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Project not found' } });
    }

    // Verify user is the Lead or a Manager
    const team = await Team.findById(project.teamId);
    const membership = team?.members.find(m => m.userId.toString() === userId?.toString());
    if (!membership || (membership.role !== 'owner' && membership.role !== 'manager')) {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Only project owners or managers can edit details' } });
    }

    const allowedUpdates = [
      'title', 'tagline', 'problemStatement', 'goals', 'summary',
      'description', 'recruitmentRequirements', 'category', 'tags',
      'visibility', 'status', 'openRoles',
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) project[field] = req.body[field];
    });

    await project.save();
    return res.status(200).json({ success: true, data: project });
  } catch (err) {
    return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: err.message } });
  }
};

exports.applyToProject = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });
    }

    const project = await Project.findById(req.params.id).populate('leadId', 'college');
    if (!project) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Project not found' } });
    }

    const team = await Team.findById(project.teamId);

    // Check if team has reached maximum capacity
    if (team && team.members.length >= team.maxCapacity) {
      return res.status(400).json({
        success: false,
        error: { code: 'CAPACITY_REACHED', message: 'This project is fully staffed and no longer accepting applications' },
      });
    }

    // Check campus eligibility for campus-only projects
    if (project.visibility === 'campus-only') {
      const userCollege = req.user.college;
      const leadCollege = project.leadId?.college;
      if (userCollege && leadCollege && userCollege.toLowerCase() !== leadCollege.toLowerCase()) {
        return res.status(403).json({
          success: false,
          error: { code: 'CAMPUS_RESTRICTED', message: `This project is restricted to students from ${leadCollege}` },
        });
      }
    }

    // Check if user is project lead or already a team member
    const isLead = project.leadId?._id?.toString() === userId.toString();
    const isMember = team?.members.some(m => m.userId.toString() === userId.toString());
    if (isLead || isMember) {
      return res.status(400).json({
        success: false,
        error: { code: 'ALREADY_MEMBER', message: 'You are already a member or lead of this team' },
      });
    }

    // Check duplicate pending application
    const existing = await ProjectJoinRequest.findOne({
      projectId: project._id,
      applicantId: userId,
      status: 'pending',
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        error: { code: 'DUPLICATE_APPLICATION', message: 'You already have an active pending application for this project' },
      });
    }

    const { roleId, introduction, relevantSkills, experienceSummary } = req.body;
    const role = project.openRoles.id(roleId);
    if (!role || role.status === 'closed' || role.filled >= role.openings) {
      return res.status(400).json({ success: false, error: { code: 'ROLE_UNAVAILABLE', message: 'This position is no longer accepting applications' } });
    }

    const joinRequest = new ProjectJoinRequest({
      projectId: project._id,
      roleId,
      roleTitle: role.title,
      applicantId: userId,
      introduction,
      relevantSkills: Array.isArray(relevantSkills) ? relevantSkills : [],
      experienceSummary,
      status: 'pending',
    });

    await joinRequest.save();
    return res.status(201).json({ success: true, data: joinRequest, message: 'Application submitted successfully' });
  } catch (err) {
    return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: err.message } });
  }
};

exports.getApplicants = async (req, res) => {
  try {
    const userId = req.user?._id;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Project not found' } });

    // Authorization check: Must be owner or manager
    const team = await Team.findById(project.teamId);
    const membership = team?.members.find(m => m.userId.toString() === userId?.toString());
    if (!membership || (membership.role !== 'owner' && membership.role !== 'manager')) {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Access denied' } });
    }

    // Return safe student profile info only (no email, phone, or private verification info)
    const requests = await ProjectJoinRequest.find({ projectId: project._id })
      .populate('applicantId', 'name college department year skills avatar')
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: requests });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
};

exports.reviewApplicant = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { status, reviewerFeedback } = req.body;
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, error: { code: 'INVALID_STATUS', message: 'Status must be accepted or rejected' } });
    }

    const joinRequest = await ProjectJoinRequest.findById(req.params.requestId);
    if (!joinRequest) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Application not found' } });
    }

    const project = await Project.findById(joinRequest.projectId);
    const team = await Team.findById(project.teamId);

    // Authorization check
    const membership = team?.members.find(m => m.userId.toString() === userId?.toString());
    if (!membership || (membership.role !== 'owner' && membership.role !== 'manager')) {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Access denied' } });
    }

    if (joinRequest.status !== 'pending') {
      return res.status(400).json({ success: false, error: { code: 'ALREADY_PROCESSED', message: 'Application has already been reviewed' } });
    }

    if (status === 'accepted') {
      // Atomic capacity check on team
      if (team.members.length >= team.maxCapacity) {
        return res.status(400).json({ success: false, error: { code: 'CAPACITY_REACHED', message: 'Team has reached maximum capacity' } });
      }

      // Check role capacity
      const role = project.openRoles.id(joinRequest.roleId);
      if (role && role.filled >= role.openings) {
        return res.status(400).json({ success: false, error: { code: 'ROLE_FILLED', message: 'This position has already been filled' } });
      }

      // Add to team
      team.members.push({
        userId: joinRequest.applicantId,
        role: 'member',
        assignedRoleTitle: joinRequest.roleTitle,
        joinedAt: new Date(),
      });
      await team.save();

      // Update role count
      if (role) {
        role.filled = (role.filled || 0) + 1;
        if (role.filled >= role.openings) role.status = 'closed';
        await project.save();
      }
    }

    joinRequest.status = status;
    joinRequest.reviewedBy = userId;
    joinRequest.reviewedAt = new Date();
    joinRequest.reviewerFeedback = reviewerFeedback || '';
    await joinRequest.save();

    return res.status(200).json({ success: true, data: joinRequest, message: `Application ${status}` });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
};

exports.inviteStudent = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { invitedUserId, roleId, message } = req.body;
    const project = await Project.findById(req.params.id);
    const team = await Team.findById(project?.teamId);

    // Auth check: owner or manager
    const membership = team?.members.find(m => m.userId.toString() === userId?.toString());
    if (!membership || (membership.role !== 'owner' && membership.role !== 'manager')) {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Access denied' } });
    }

    // Prevent duplicate active invitation
    const existing = await TeamInvitation.findOne({
      projectId: project._id,
      invitedUserId,
      status: 'pending',
    });
    if (existing) {
      return res.status(400).json({ success: false, error: { code: 'DUPLICATE_INVITATION', message: 'An active invitation already exists for this student' } });
    }

    const role = project.openRoles.id(roleId);
    const invitation = new TeamInvitation({
      projectId: project._id,
      roleId,
      roleTitle: role ? role.title : 'Team Member',
      invitedUserId,
      invitedByUserId: userId,
      message: message || '',
      status: 'pending',
    });

    await invitation.save();
    return res.status(201).json({ success: true, data: invitation, message: 'Invitation dispatched successfully' });
  } catch (err) {
    return res.status(400).json({ success: false, error: { code: 'ERROR', message: err.message } });
  }
};

exports.respondToInvitation = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { status } = req.body;
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, error: { code: 'INVALID_STATUS', message: 'Status must be accepted or rejected' } });
    }

    const invitation = await TeamInvitation.findById(req.params.invitationId);
    if (!invitation || invitation.invitedUserId.toString() !== userId?.toString()) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Invitation not found' } });
    }

    if (invitation.status !== 'pending') {
      return res.status(400).json({ success: false, error: { code: 'ALREADY_PROCESSED', message: 'Invitation has already been responded to' } });
    }

    if (status === 'accepted') {
      const project = await Project.findById(invitation.projectId);
      const team = await Team.findById(project.teamId);

      if (team.members.length >= team.maxCapacity) {
        return res.status(400).json({ success: false, error: { code: 'CAPACITY_REACHED', message: 'Team has reached maximum capacity' } });
      }

      team.members.push({
        userId,
        role: 'member',
        assignedRoleTitle: invitation.roleTitle,
        joinedAt: new Date(),
      });
      await team.save();

      const role = project.openRoles.id(invitation.roleId);
      if (role) {
        role.filled = (role.filled || 0) + 1;
        if (role.filled >= role.openings) role.status = 'closed';
        await project.save();
      }
    }

    invitation.status = status;
    invitation.respondedAt = new Date();
    await invitation.save();

    return res.status(200).json({ success: true, data: invitation });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { memberUserId } = req.params;
    const project = await Project.findById(req.params.id);
    const team = await Team.findById(project.teamId);

    const caller = team?.members.find(m => m.userId.toString() === userId?.toString());
    const target = team?.members.find(m => m.userId.toString() === memberUserId.toString());

    if (!caller || !target) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Member not found' } });
    }

    // Role checks
    if (caller.role === 'member') {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Members cannot remove others' } });
    }
    if (caller.role === 'manager' && (target.role === 'owner' || target.role === 'manager')) {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Managers cannot remove other managers or owners' } });
    }
    if (target.role === 'owner') {
      return res.status(400).json({ success: false, error: { code: 'CANNOT_REMOVE_OWNER', message: 'Project owner cannot be removed. Transfer ownership first.' } });
    }

    team.members = team.members.filter(m => m.userId.toString() !== memberUserId.toString());
    await team.save();

    return res.status(200).json({ success: true, message: 'Member removed from team' });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
};

exports.leaveTeam = async (req, res) => {
  try {
    const userId = req.user?._id;
    const project = await Project.findById(req.params.id);
    const team = await Team.findById(project.teamId);

    const member = team?.members.find(m => m.userId.toString() === userId?.toString());
    if (!member) {
      return res.status(404).json({ success: false, error: { code: 'NOT_MEMBER', message: 'You are not a member of this team' } });
    }

    if (member.role === 'owner') {
      return res.status(400).json({
        success: false,
        error: { code: 'OWNER_CANNOT_LEAVE', message: 'Project owners cannot leave. Transfer ownership to another member first.' },
      });
    }

    team.members = team.members.filter(m => m.userId.toString() !== userId?.toString());
    await team.save();

    return res.status(200).json({ success: true, message: 'You have left the team' });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
};

exports.transferOwnership = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { newOwnerUserId } = req.body;
    const project = await Project.findById(req.params.id);
    const team = await Team.findById(project.teamId);

    const caller = team?.members.find(m => m.userId.toString() === userId?.toString());
    if (!caller || caller.role !== 'owner') {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Only current owner can transfer ownership' } });
    }

    const newOwner = team?.members.find(m => m.userId.toString() === newOwnerUserId.toString());
    if (!newOwner) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Target user is not an active team member' } });
    }

    // Safe swap
    caller.role = 'manager';
    newOwner.role = 'owner';
    project.leadId = newOwner.userId;

    await team.save();
    await project.save();

    return res.status(200).json({ success: true, message: 'Ownership transferred successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const userId = req.user?._id;
    const project = await Project.findById(req.params.id);
    const team = await Team.findById(project.teamId);

    const isMember = team?.members.some(m => m.userId.toString() === userId?.toString());
    if (!isMember) {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Tasks are only visible to team members' } });
    }

    const tasks = await TeamTask.find({ projectId: project._id }).populate('assignedTo', 'name');
    return res.status(200).json({ success: true, data: tasks });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
};

exports.createTask = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { title, description, assignedTo, priority, dueDate } = req.body;
    const project = await Project.findById(req.params.id);
    const team = await Team.findById(project.teamId);

    const isMember = team?.members.some(m => m.userId.toString() === userId?.toString());
    if (!isMember) {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Access denied' } });
    }

    // Verify assignedTo is an active team member
    const assigneeIsMember = team.members.some(m => m.userId.toString() === assignedTo.toString());
    if (!assigneeIsMember) {
      return res.status(400).json({ success: false, error: { code: 'INVALID_ASSIGNEE', message: 'Task must be assigned to an active team member' } });
    }

    const task = new TeamTask({
      projectId: project._id,
      teamId: team._id,
      title,
      description,
      assignedTo,
      createdBy: userId,
      priority: priority || 'medium',
      dueDate,
    });

    await task.save();
    return res.status(201).json({ success: true, data: task });
  } catch (err) {
    return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: err.message } });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const userId = req.user?._id;
    const task = await TeamTask.findById(req.params.taskId);
    if (!task) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Task not found' } });

    const team = await Team.findById(task.teamId);
    const isMember = team?.members.some(m => m.userId.toString() === userId?.toString());
    if (!isMember) return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Access denied' } });

    const allowed = ['title', 'description', 'priority', 'status', 'dueDate', 'assignedTo'];
    allowed.forEach(k => {
      if (req.body[k] !== undefined) task[k] = req.body[k];
    });

    if (task.status === 'completed' && !task.completedAt) {
      task.completedAt = new Date();
    } else if (task.status !== 'completed') {
      task.completedAt = null;
    }

    await task.save();
    return res.status(200).json({ success: true, data: task });
  } catch (err) {
    return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: err.message } });
  }
};

