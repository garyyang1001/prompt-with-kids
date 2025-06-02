import { AnalyzePromptResponse } from './ai';

export interface LearningSession {
  id: string;
  userId: string;
  templateId: string;
  startTime: Date;
  endTime?: Date;
  currentLevel: number;
  interactions: LearningInteraction[];
  finalScore?: number;
}

export interface LearningInteraction {
  id: string;
  timestamp: Date;
  userInput: string;
  systemResponse: string;
  promptAnalysis: AnalyzePromptResponse;
  skillsLearned: string[];
  levelProgress: number;
}

export interface LearningProgress {
  currentLevel: number;
  progress: number;
  nextSkills: string[];
}

export interface LearningTemplate {
  id: string;
  name: string;
  description: string;
  difficulty: 'basic' | 'intermediate' | 'creative';
  emoji: string;
  scenarios: LearningScenario[];
  estimatedTime?: number; // 預估完成時間（分鐘）
  targetAge?: string;     // 目標年齡
  skills: string[];       // 培養的技能
}

export interface LearningScenario {
  id: string;
  title: string;
  description: string;
  prompt: string;
  expectedElements: string[];
  tips?: string[];        // 提示
  examples?: string[];    // 範例
}

export interface SkillProgress {
  skillName: string;
  level: number;
  progress: number;
  unlockedAt?: Date;
  masteredAt?: Date;
}

export interface LearningPath {
  currentLevel: number;
  nextMilestone: string;
  suggestedExercises: string[];
  skillsToLearn: string[];
  completedScenarios: string[];
  totalProgress: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

export interface LearningStats {
  totalSessions: number;
  totalTime: number;        // 總學習時間（分鐘）
  averageScore: number;
  skillsLearned: number;
  currentStreak: number;    // 連續學習天數
  longestStreak: number;
  achievements: Achievement[];
}

export interface FeedbackData {
  sessionId: string;
  rating: number;           // 1-5星評分
  comments?: string;
  suggestions?: string;
  difficulty: 'too_easy' | 'just_right' | 'too_hard';
  enjoyment: number;        // 1-5分
}

export interface LearningReport {
  period: 'week' | 'month' | 'all';
  startDate: Date;
  endDate: Date;
  stats: LearningStats;
  progressByLevel: { level: number; progress: number }[];
  skillsProgress: SkillProgress[];
  recommendations: string[];
  insights: string[];
}

export interface ParentDashboard {
  childProfiles: ChildProfile[];
  overallProgress: LearningStats;
  recentActivities: LearningActivity[];
  recommendations: ParentRecommendation[];
}

export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  avatar?: string;
  currentLevel: number;
  favoriteTemplates: string[];
  stats: LearningStats;
  lastActiveAt: Date;
}

export interface LearningActivity {
  id: string;
  childId: string;
  templateId: string;
  scenarioId: string;
  timestamp: Date;
  score: number;
  timeSpent: number;
  skillsLearned: string[];
}

export interface ParentRecommendation {
  type: 'template' | 'activity' | 'skill';
  title: string;
  description: string;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface LearningGoal {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  progress: number;
  milestones: Milestone[];
  rewards?: string[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  completedAt?: Date;
  points: number;
}

export interface NotificationPreference {
  daily_reminder: boolean;
  achievement_unlock: boolean;
  weekly_report: boolean;
  level_up: boolean;
  parent_summary: boolean;
}

export interface UserPreferences {
  notifications: NotificationPreference;
  voice_enabled: boolean;
  auto_play_feedback: boolean;
  difficulty_adjustment: 'auto' | 'manual';
  privacy_settings: PrivacySettings;
}

export interface PrivacySettings {
  data_collection: boolean;
  analytics: boolean;
  marketing_emails: boolean;
  share_progress: boolean;
}

export type LearningEventType = 
  | 'session_start'
  | 'session_end'
  | 'level_up'
  | 'skill_learned'
  | 'achievement_unlock'
  | 'scenario_complete'
  | 'feedback_given';

export interface LearningEvent {
  type: LearningEventType;
  timestamp: Date;
  sessionId: string;
  data: Record<string, any>;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  meta?: {
    timestamp: Date;
    version: string;
    requestId: string;
  };
}
