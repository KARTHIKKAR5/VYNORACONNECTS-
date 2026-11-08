import mongoose from 'mongoose';

const DashboardPreferenceSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    dismissedOnboardingTasks: {
      type: [String],
      default: [],
    },
    hiddenPulseItemIds: {
      type: [String],
      default: [],
    },
    sectionOrder: {
      type: [String],
      default: [
        'welcome',
        'stats',
        'quickActions',
        'pulse',
        'opportunities',
        'events',
        'projects',
        'recommendations',
        'resources',
        'mentorship',
      ],
    },
    filterPreferences: {
      defaultPulseFilter: {
        type: String,
        default: 'all',
      },
    },
  },
  {
    timestamps: true,
  }
);

export const DashboardPreference =
  mongoose.models.DashboardPreference ||
  mongoose.model('DashboardPreference', DashboardPreferenceSchema);
