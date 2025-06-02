// 家庭和用戶相關類型定義

export interface Family {
  id: string;
  name: string;
  parentName: string;
  parentEmail: string;
  children: Child[];
  subscription: Subscription;
  preferences: FamilyPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface Child {
  id: string;
  name: string;
  age: number;
  grade?: string;
  interests: string[];
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  creativityLevel: 'beginner' | 'intermediate' | 'advanced';
  favoriteThemes: string[];
  avatar?: string;
}

export interface Subscription {
  plan: 'free' | 'family' | 'premium';
  status: 'active' | 'inactive' | 'expired' | 'trial';
  startDate: Date;
  endDate?: Date;
  features: SubscriptionFeature[];
  usage: {
    storiesCreated: number;
    monthlyLimit: number;
    imagesGenerated: number;
    audioGenerated: number;
  };
}

export interface SubscriptionFeature {
  name: string;
  enabled: boolean;
  limit?: number;
  used?: number;
}

export interface FamilyPreferences {
  language: 'zh-TW' | 'en-US';
  contentFilters: {
    violenceLevel: 'none' | 'mild' | 'moderate';
    scaryContent: boolean;
    educationalFocus: string[];
  };
  notifications: {
    weeklyReports: boolean;
    newFeatures: boolean;
    tips: boolean;
  };
  privacy: {
    shareStories: boolean;
    allowAnalytics: boolean;
    dataRetention: 'minimal' | 'standard' | 'extended';
  };
}

// 家庭檔案和進度追蹤
export interface FamilyPortfolio {
  familyId: string;
  stories: FamilyStory[];
  achievements: Achievement[];
  statistics: FamilyStatistics;
  highlights: StoryHighlight[];
}

export interface FamilyStory {
  id: string;
  title: string;
  thumbnail?: string;
  createdAt: Date;
  participants: string[]; // child IDs
  status: 'completed' | 'draft';
  rating?: number;
  tags: string[];
  isShared: boolean;
  viewCount: number;
}

export interface Achievement {
  id: string;
  type: 'creativity' | 'collaboration' | 'storytelling' | 'milestone';
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  childId?: string; // 如果是個人成就
}

export interface FamilyStatistics {
  totalStories: number;
  totalTimeSpent: number; // 分鐘
  averageSessionTime: number;
  parentParticipationRate: number;
  childEngagementScore: number;
  favoriteThemes: { theme: string; count: number }[];
  creativityGrowth: CreativityMetric[];
  weeklyActivity: WeeklyActivity[];
}

export interface CreativityMetric {
  date: Date;
  childId: string;
  scores: {
    imagination: number;
    expression: number;
    problemSolving: number;
    collaboration: number;
  };
}

export interface WeeklyActivity {
  week: string; // YYYY-WW format
  storiesCreated: number;
  timeSpent: number;
  parentParticipation: number;
  highlights: string[];
}

export interface StoryHighlight {
  storyId: string;
  type: 'first_story' | 'creative_solution' | 'parent_favorite' | 'child_favorite';
  title: string;
  description: string;
  date: Date;
}

// 學習和成長追蹤
export interface LearningProgress {
  childId: string;
  currentLevel: number;
  skills: SkillProgress[];
  nextMilestones: Milestone[];
  recommendations: string[];
  updatedAt: Date;
}

export interface SkillProgress {
  skill: 'imagination' | 'expression' | 'problem_solving' | 'collaboration' | 'empathy';
  currentLevel: number;
  maxLevel: number;
  experiencePoints: number;
  nextLevelProgress: number; // 0-1
  recentGrowth: number;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  skill: string;
  targetLevel: number;
  estimatedWeeks: number;
  isUnlocked: boolean;
  reward?: string;
}

// 社群和分享
export interface SharedStory {
  storyId: string;
  familyId: string;
  title: string;
  thumbnail: string;
  tags: string[];
  likes: number;
  views: number;
  isPublic: boolean;
  sharedAt: Date;
  ageGroup: string;
}

export interface StoryComment {
  id: string;
  storyId: string;
  familyId: string;
  parentName: string;
  content: string;
  createdAt: Date;
  likes: number;
  isVisible: boolean;
}

// 會話和互動
export interface ParentChildSession {
  id: string;
  familyId: string;
  participants: {
    parent: string;
    children: string[];
  };
  startedAt: Date;
  endedAt?: Date;
  activities: SessionActivity[];
  mood: {
    parent: 'excited' | 'engaged' | 'tired' | 'frustrated' | 'happy';
    child: 'excited' | 'engaged' | 'tired' | 'frustrated' | 'happy';
  };
  notes?: string;
}

export interface SessionActivity {
  timestamp: Date;
  type: 'story_step' | 'discussion' | 'decision' | 'break';
  description: string;
  participantActions: {
    userId: string;
    action: string;
    duration: number;
  }[];
}

// 回饋和評估
export interface FeedbackSurvey {
  id: string;
  familyId: string;
  type: 'weekly' | 'story_completion' | 'feature_feedback';
  questions: SurveyQuestion[];
  responses: SurveyResponse[];
  completedAt?: Date;
}

export interface SurveyQuestion {
  id: string;
  text: string;
  type: 'rating' | 'multiple_choice' | 'text' | 'boolean';
  options?: string[];
  required: boolean;
}

export interface SurveyResponse {
  questionId: string;
  value: string | number | boolean;
  respondent: 'parent' | 'child';
}