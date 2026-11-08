import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from '../../models/User.model.js';
import { isDbConnected } from '../../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'vynora-connect-dev-secret-2026';
const JWT_EXPIRES_IN = '7d';

const DEMO_USER_DTO = {
  id: 'usr-karthik',
  firstName: 'Karthik',
  lastName: 'Kumar',
  displayName: 'Karthik Kumar',
  name: 'Karthik Kumar',
  email: 'karthik@vynora.edu',
  emailType: 'college',
  college: 'SR University',
  university: 'Autonomous',
  degree: 'B.Tech',
  branch: 'Computer Science & Engineering',
  department: 'Computer Science & Engineering',
  academicYear: 'Third Year',
  graduationYear: 2026,
  city: 'Warangal',
  state: 'Telangana',
  bio: 'Full-stack builder passionate about distributed systems, student developer communities, and cloud-native architecture.',
  skills: ['React', 'Node.js', 'Express', 'MongoDB', 'System Design', 'TypeScript'],
  interests: ['Web Development', 'AI & Machine Learning', 'Distributed Systems'],
  customInterests: [],
  programmingLanguages: ['JavaScript', 'TypeScript', 'Python', 'Go'],
  tools: ['React', 'Node.js', 'Docker', 'MongoDB', 'Git'],
  portfolioUrl: 'https://karthik.vynora.dev',
  githubUrl: 'https://github.com/KARTHIKKAR5',
  linkedinUrl: 'https://linkedin.com/in/karthik',
  profileVisibility: 'students_only',
  role: 'student',
  emailVerified: true,
  isVerified: true,
  accountStatus: 'active',
};

export const authService = {
  async register(data) {
    if (!isDbConnected()) {
      const err = new Error('Database is offline. MongoDB is not connected; account cannot be persisted.');
      err.statusCode = 503;
      err.code = 'DATABASE_OFFLINE';
      throw err;
    }

    const email = (data.email || '').toLowerCase().trim();
    const existing = await User.findOne({ email });
    if (existing) {
      const err = new Error('An account with this email already exists.');
      err.statusCode = 409;
      err.code = 'DUPLICATE_ACCOUNT';
      throw err;
    }
    const passwordHash = await bcryptjs.hash(data.password, 12);
    const firstName = (data.firstName || 'Student').trim();
    const lastName = (data.lastName || '').trim();
    const displayName = `${firstName} ${lastName}`.trim();

    const user = new User({
      firstName,
      lastName,
      displayName,
      name: displayName,
      email,
      emailType: data.emailType || 'personal',
      passwordHash,
      college: data.college || 'Not specified',
      university: data.university || '',
      degree: data.degree || 'B.Tech',
      branch: data.branch || 'Computer Science & Engineering',
      department: data.branch || 'Computer Science & Engineering',
      academicYear: data.academicYear || 'Second Year',
      graduationYear: data.graduationYear || new Date().getFullYear() + 2,
      city: data.city || '',
      state: data.state || '',
      bio: data.bio || '',
      skills: data.skills || [],
      interests: data.interests || [],
      customInterests: data.customInterests || [],
      programmingLanguages: data.programmingLanguages || [],
      tools: data.tools || [],
      portfolioUrl: data.portfolioUrl || '',
      githubUrl: data.githubUrl || '',
      linkedinUrl: data.linkedinUrl || '',
      profileVisibility: data.profileVisibility || 'students_only',
      role: 'student',
      isVerified: false,
      emailVerified: false,
      accountStatus: 'active',
    });
    await user.save();
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role, name: user.displayName },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    return { user: user.toSafeDTO(), token };
  },

  async login(email, password) {
    if (!isDbConnected()) {
      // In offline mode with demo accounts, allow demo login or fail cleanly
      if (email.toLowerCase().trim() === 'karthik@vynora.edu') {
        const token = jwt.sign(
          { id: DEMO_USER_DTO.id, email: DEMO_USER_DTO.email, role: DEMO_USER_DTO.role, name: DEMO_USER_DTO.displayName },
          JWT_SECRET,
          { expiresIn: JWT_EXPIRES_IN }
        );
        return { user: DEMO_USER_DTO, token };
      }
      const err = new Error('Database is offline. MongoDB is not connected.');
      err.statusCode = 503;
      err.code = 'DATABASE_OFFLINE';
      throw err;
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      const err = new Error('Invalid email or password.');
      err.statusCode = 401;
      err.code = 'INVALID_CREDENTIALS';
      throw err;
    }
    const valid = await bcryptjs.compare(password, user.passwordHash);
    if (!valid) {
      const err = new Error('Invalid email or password.');
      err.statusCode = 401;
      err.code = 'INVALID_CREDENTIALS';
      throw err;
    }
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role, name: user.displayName },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    return { user: user.toSafeDTO(), token };
  },

  async getProfile(userId) {
    if (!isDbConnected() || !userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return { ...DEMO_USER_DTO };
    }
    const user = await User.findById(userId);
    if (!user) {
      return { ...DEMO_USER_DTO };
    }
    return user.toSafeDTO();
  },

  async updateProfile(userId, updates) {
    const allowed = [
      'firstName',
      'lastName',
      'displayName',
      'college',
      'university',
      'degree',
      'branch',
      'academicYear',
      'graduationYear',
      'city',
      'state',
      'bio',
      'skills',
      'interests',
      'customInterests',
      'programmingLanguages',
      'tools',
      'portfolioUrl',
      'githubUrl',
      'linkedinUrl',
      'profileVisibility',
      'profileImage',
      'avatar',
    ];
    const sanitized = {};
    for (const key of allowed) {
      if (updates[key] !== undefined) sanitized[key] = updates[key];
    }

    if (!isDbConnected() || !userId || !mongoose.Types.ObjectId.isValid(userId)) {
      const first = sanitized.firstName || DEMO_USER_DTO.firstName;
      const last = sanitized.lastName !== undefined ? sanitized.lastName : DEMO_USER_DTO.lastName;
      return {
        ...DEMO_USER_DTO,
        ...sanitized,
        firstName: first,
        lastName: last,
        displayName: `${first} ${last}`.trim(),
      };
    }

    if (sanitized.firstName || sanitized.lastName) {
      const existingUser = await User.findById(userId);
      const first = sanitized.firstName || existingUser?.firstName || '';
      const last = sanitized.lastName !== undefined ? sanitized.lastName : (existingUser?.lastName || '');
      sanitized.displayName = `${first} ${last}`.trim();
      sanitized.name = sanitized.displayName;
    }

    const user = await User.findByIdAndUpdate(userId, { $set: sanitized }, { new: true, runValidators: true });
    if (!user) {
      const err = new Error('User not found.');
      err.statusCode = 404;
      throw err;
    }
    return user.toSafeDTO();
  },
};

export default authService;
