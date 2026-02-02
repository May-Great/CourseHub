// Core types for better type safety and architecture

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'author' | 'buyer';
  avatar?: string;
}

export interface AuthorProfile {
  id: string; // authorId
  displayName: string;
  handle?: string; // @nickname
  bio: string;
  avatarUrl?: string;
  coverUrl?: string;
  highlight?: string; // короткая плашка
  tags: string[];
  directions: string[]; // можно объединить с tags, но лучше отдельно
  social?: {
    telegram?: string;
    instagram?: string;
    youtube?: string;
    website?: string;
  };
  views?: number;
  followersCount?: number;
  createdAt: number;
  updatedAt: number;
}

export interface MiniLesson {
  id: string;
  authorId: string;
  title: string;
  description: string;
  videoUrl: string;
  coverImageUrl?: string;
  aiAnalysisText: string;
  linkedCourseId?: string;
  ctaText?: string;
  status: "draft" | "published";
  createdAt: string; // Changed to string to match other types
  updatedAt: string; // Changed to string to match other types
  views?: number;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'pdf' | 'audio' | 'text' | 'quiz';
  content: string; // URL for video/audio/pdf, text content for text type
  duration?: number; // in seconds
  materials?: Material[];
  assignment?: Assignment;
  quiz?: Quiz; // New Quiz Data
  order: number;
  deadline?: string; // ISO date string
  isRequired?: boolean;
}

export interface Quiz {
  questions: QuizQuestion[];
  passingScore: number; // Percentage 0-100
}

export interface QuizQuestion {
  id: string;
  text: string;
  type: 'single_choice' | 'multiple_choice';
  options: QuizOption[];
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Material {
  type: 'pdf' | 'link' | 'text' | 'video';
  title: string;
  url?: string;
  content?: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate?: string;
  status: 'not_started' | 'in_progress' | 'submitted' | 'reviewed' | 'completed';
  maxScore?: number;
  submissionType: 'text' | 'file' | 'link' | 'quiz';
  instructions?: string;
  rubric?: AssignmentRubric[];
}

export interface AssignmentRubric {
  id: string;
  criteria: string;
  maxPoints: number;
  description: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  userId: string;
  submittedAt: string;
  content?: string;
  fileUrl?: string;
  linkUrl?: string;
  status: 'submitted' | 'reviewed' | 'needs_revision';
  score?: number;
  feedback?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  order: number;
  deadline?: string; // Module completion deadline
  isRequired?: boolean;
}

export interface CourseTheme {
  primaryColor: string;
  backgroundColor: string;
  backgroundImage?: string;
  fontFamily: 'sans' | 'serif' | 'mono';
  layout: 'default' | 'sidebar-left' | 'centered' | 'immersive';
  coverStyle: 'banner' | 'overlay' | 'minimal';
  buttonStyle: 'rounded' | 'pill' | 'sharp';
}

export interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  authorId: string;
  authorName: string;
  thumbnail: string;
  price: number;
  category: string;
  modules: Module[];
  createdAt: string;
  updatedAt: string;
  studentsCount: number;
  rating: number;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  templateId?: string; // Reference to course template
  settings: CourseSettings;
  theme?: CourseTheme; // Visual customization
}

export interface CourseSettings {
  hasDeadlines: boolean;
  autoAdvance: boolean;
  allowLateSubmissions: boolean;
  requireSequentialProgress: boolean;
  certificateEnabled: boolean;
  discussionEnabled: boolean;
}

export interface CourseTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  duration: string; // "14 дней", "4 недели"
  structure: {
    modulesCount: number;
    lessonsPerModule: number;
    suggestedSchedule: string; // "2 урока в неделю"
  };
  defaultModules: {
    title: string;
    description: string;
    suggestedLessons: string[];
  }[];
  cohortSettings: {
    defaultDuration: number; // days
    checkpointFrequency: 'daily' | 'weekly' | 'biweekly';
    hasDeadlines: boolean;
  };
}

export interface Cohort {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  participants: User[];
  maxParticipants: number;
  status: 'upcoming' | 'active' | 'completed';
  settings: CohortSettings;
  schedule: CohortSchedule[];
  checkpoints: Checkpoint[];
}

export interface CohortSettings {
  hasDeadlines: boolean;
  checkpointFrequency: 'daily' | 'weekly' | 'biweekly';
  autoAdvance: boolean;
  allowLateJoin: boolean;
  requireCompletion: boolean;
  certificateEnabled: boolean;
}

export interface CohortSchedule {
  id: string;
  lessonId: string;
  dueDate: string;
  isRequired: boolean;
  reminderSent?: boolean;
}

export interface Checkpoint {
  id: string;
  cohortId: string;
  title: string;
  description: string;
  scheduledDate: string;
  type: 'weekly_review' | 'milestone' | 'feedback' | 'celebration';
  status: 'upcoming' | 'active' | 'completed';
  responses: CheckpointResponse[];
}

export interface CheckpointResponse {
  id: string;
  checkpointId: string;
  userId: string;
  submittedAt: string;
  responses: {
    question: string;
    answer: string;
  }[];
  mood?: 'great' | 'good' | 'okay' | 'struggling' | 'stuck';
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: string;
  cohortId?: string;
  courseId?: string;
  type: 'message' | 'system' | 'checkpoint' | 'assignment' | 'celebration';
  metadata?: {
    assignmentId?: string;
    checkpointId?: string;
    achievementId?: string;
  };
}

export interface UserProgress {
  userId: string;
  courseId: string;
  cohortId?: string;
  completedLessons: string[];
  completedAssignments: string[];
  currentLesson?: string;
  lastWatched?: {
    lessonId: string;
    position: number; // in seconds
  };
  enrolledAt: string;
  notes: VideoNote[];
  bookmarks: VideoBookmark[];
  streak: number; // days of consecutive activity
  totalTimeSpent: number; // in minutes
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  type: 'lesson_completed' | 'module_completed' | 'assignment_submitted' | 'streak' | 'participation' | 'helping_others';
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
  points?: number;
}

export interface VideoNote {
  id: string;
  lessonId: string;
  timestamp: number;
  content: string;
  createdAt: string;
  isPrivate: boolean;
}

export interface VideoBookmark {
  id: string;
  lessonId: string;
  timestamp: number;
  title: string;
  createdAt: string;
}

// Quick Create types
export interface QuickCreateFile {
  name: string;
  type: 'video' | 'pdf' | 'audio' | 'text';
  url: string;
  duration?: number;
  size?: number;
}

export interface QuickCreateData {
  files: QuickCreateFile[];
  templateId?: string;
  autoGenerate: {
    titles: boolean;
    descriptions: boolean;
    structure: boolean;
  };
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: 'deadline_reminder' | 'assignment_graded' | 'new_message' | 'checkpoint_due' | 'achievement_earned';
  title: string;
  message: string;
  createdAt: string;
  readAt?: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

// Analytics types
export interface CourseAnalytics {
  courseId: string;
  totalStudents: number;
  activeStudents: number;
  completionRate: number;
  averageProgress: number;
  averageTimeSpent: number;
  dropoffPoints: {
    lessonId: string;
    dropoffRate: number;
  }[];
  engagementMetrics: {
    messagesPerDay: number;
    assignmentSubmissionRate: number;
    checkpointParticipationRate: number;
  };
}

// Pricing and subscription types
export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: PlanFeature[];
  limits: PlanLimits;
  isPopular?: boolean;
  isCurrentPlan?: boolean;
}

export interface PlanFeature {
  id: string;
  name: string;
  description: string;
  included: boolean;
  limit?: number;
}

export interface PlanLimits {
  courses: number; // -1 for unlimited
  miniLessons: number; // -1 for unlimited
  cohorts: number; // -1 for unlimited
  studentsPerCohort: number;
  totalStudents: number; // -1 for unlimited
  storage: number; // in GB, -1 for unlimited
  analytics: boolean;
  prioritySupport: boolean;
  customBranding: boolean;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'canceled' | 'expired' | 'trial';
  startDate: string;
  endDate?: string;
  trialEndDate?: string;
  autoRenew: boolean;
}

export interface UsageStats {
  userId: string;
  coursesCreated: number;
  miniLessonsCreated: number;
  cohortsCreated: number;
  totalStudents: number;
  storageUsed: number; // in GB
  lastUpdated: string;
}

export interface LeadForm {
  id: string;
  userId: string;
  planId: string;
  email: string;
  name: string;
  company?: string;
  message?: string;
  submittedAt: string;
  status: 'new' | 'contacted' | 'converted' | 'declined';
}

export interface ProductFeedback {
  id: string;
  userId: string;
  type: 'feature_request' | 'bug_report' | 'general_feedback' | 'pricing_feedback';
  title: string;
  description: string;
  rating?: number; // 1-5 stars
  submittedAt: string;
  status: 'new' | 'reviewed' | 'in_progress' | 'completed';
}

// Social Features
export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  lessonId: string;
  content: string;
  createdAt: string;
  replies?: Comment[];
}

export interface Review {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5
  content: string;
  createdAt: string;
}
