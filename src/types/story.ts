// 故事相關類型定義

export interface Character {
  id: string;
  name: string;
  description: string;
  age?: number;
  personality: string[];
  specialPowers?: string[];
  appearance: {
    color?: string;
    size?: string;
    features: string[];
  };
}

export interface Setting {
  location: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  weather?: string;
  atmosphere: string;
  details: string[];
}

export interface Adventure {
  goal: string;
  obstacles: StoryObstacle[];
  solutions: StorySolution[];
  surprises: string[];
  moralLesson?: string;
}

export interface StoryObstacle {
  type: 'physical' | 'emotional' | 'puzzle' | 'social';
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface StorySolution {
  obstacleId: string;
  approach: 'creative' | 'logical' | 'collaborative' | 'brave';
  description: string;
  parentGuidance?: string;
}

export interface StoryEnding {
  resolution: string;
  celebration: string;
  lesson?: string;
  futureAdventures?: string;
}

export interface StoryOutline {
  id: string;
  title: string;
  character: Character;
  setting: Setting;
  adventure: Adventure;
  ending: StoryEnding;
  createdBy: {
    childInput: string[];
    parentInput: string[];
  };
}

export interface FinalStory {
  id: string;
  title: string;
  text: string;
  chapters: StoryChapter[];
  images: StoryImage[];
  audioUrl?: string;
  outline: StoryOutline;
  metadata: {
    wordCount: number;
    readingTimeMinutes: number;
    ageAppropriate: boolean;
    themes: string[];
  };
  createdAt: Date;
  familyId: string;
}

export interface StoryChapter {
  id: string;
  title: string;
  content: string;
  imageId?: string;
  order: number;
}

export interface StoryImage {
  id: string;
  url: string;
  altText: string;
  prompt: string;
  chapter?: string;
  order: number;
}

export interface StoryStep {
  step: number;
  name: string;
  childQuestion: string;
  parentTips: string[];
  childSuggestions: string[];
  educationalNotes: string[];
  completed: boolean;
  childInput?: string;
  parentGuidance?: string;
}

export interface CreationSession {
  id: string;
  storyId: string;
  familyId: string;
  steps: StoryStep[];
  currentStep: number;
  status: 'draft' | 'in_progress' | 'completed' | 'abandoned';
  startedAt: Date;
  lastActiveAt: Date;
  completedAt?: Date;
  metrics: {
    totalDuration: number; // 分鐘
    parentParticipation: number; // 0-1
    childEngagement: number; // 0-1
    completionRate: number; // 0-1
  };
}

export type StoryTemplate = 'adventure' | 'friendship' | 'problem-solving' | 'fantasy';

export interface TemplateConfig {
  id: StoryTemplate;
  name: string;
  description: string;
  ageRange: [number, number];
  estimatedDuration: number;
  steps: string[];
  themes: string[];
  skills: string[];
}

// 故事生成相關
export interface StoryPrompt {
  step: string;
  questions: string[];
  suggestions: string[];
  context: string;
}

export interface AIResponse {
  text: string;
  suggestions?: string[];
  nextStep?: string;
  confidence: number;
}

// 音頻相關
export interface AudioConfig {
  voice: 'child' | 'parent' | 'narrator';
  speed: number;
  language: 'zh-TW' | 'en-US';
}

export interface GeneratedAudio {
  url: string;
  duration: number;
  transcript: string;
  config: AudioConfig;
}