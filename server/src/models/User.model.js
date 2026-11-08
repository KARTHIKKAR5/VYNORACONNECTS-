import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      default: '',
      trim: true,
    },
    displayName: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    emailType: {
      type: String,
      enum: ['college', 'personal'],
      default: 'college',
    },
    passwordHash: {
      type: String,
      required: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    profileImage: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      default: '',
    },
    college: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    university: {
      type: String,
      default: '',
      trim: true,
    },
    degree: {
      type: String,
      default: 'B.Tech',
      trim: true,
    },
    branch: {
      type: String,
      default: 'Computer Science & Engineering',
      trim: true,
    },
    department: {
      type: String,
      default: 'Computer Science & Engineering',
      trim: true,
    },
    academicYear: {
      type: String,
      enum: ['First Year', 'Second Year', 'Third Year', 'Fourth Year', 'Other'],
      default: 'Third Year',
    },
    graduationYear: {
      type: Number,
      default: 2026,
    },
    city: {
      type: String,
      default: '',
      trim: true,
    },
    state: {
      type: String,
      default: '',
      trim: true,
    },
    bio: {
      type: String,
      default: '',
      maxlength: 1000,
    },
    skills: {
      type: [String],
      default: [],
    },
    interests: {
      type: [String],
      default: [],
    },
    customInterests: {
      type: [String],
      default: [],
    },
    programmingLanguages: {
      type: [String],
      default: [],
    },
    tools: {
      type: [String],
      default: [],
    },
    portfolioUrl: {
      type: String,
      default: '',
      trim: true,
    },
    githubUrl: {
      type: String,
      default: '',
      trim: true,
    },
    linkedinUrl: {
      type: String,
      default: '',
      trim: true,
    },
    profileVisibility: {
      type: String,
      enum: ['public', 'students_only', 'limited'],
      default: 'students_only',
    },
    role: {
      type: String,
      enum: ['student', 'mentor', 'club_lead', 'admin'],
      default: 'student',
    },
    accountStatus: {
      type: String,
      enum: ['active', 'pending_verification', 'restricted'],
      default: 'active',
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for full name
UserSchema.pre('save', function (next) {
  if (!this.name) {
    this.name = `${this.firstName} ${this.lastName}`.trim();
  }
  if (!this.displayName) {
    this.displayName = this.name;
  }
  if (!this.avatar && this.profileImage) {
    this.avatar = this.profileImage;
  } else if (!this.profileImage && this.avatar) {
    this.profileImage = this.avatar;
  }
  next();
});

// Safe DTO method
UserSchema.methods.toSafeDTO = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.__v;
  return obj;
};

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
