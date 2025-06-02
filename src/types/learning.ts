/**
 * 學習相關的類型定義
 */

export interface LearningSession {
  id: string;
  templateId: string;
  currentLevel: number;
  interactions: LearningInteraction[];
  startTime: Date;
  endTime?: Date;
}

export interface LearningInteraction {
  id: string;
  userInput: string;
  systemResponse: string;
  promptAnalysis: PromptAnalysis;
  timestamp: Date;
  levelProgress: number;
}

export interface PromptAnalysis {
  clarity: number;        // 清晰度 0-100
  detail: number;         // 細節豐富度 0-100
  emotion: number;        // 情感表達 0-100
  structure: number;      // 結構完整性 0-100
  visual: number;         // 視覺描述性 0-100
  overall: number;        // 總體評分 0-100
  suggestions: string[];  // 改進建議
  optimizedPrompt: string; // 優化後的prompt
}

export interface LearningLevel {
  level: 1 | 2 | 3 | 4;
  name: string;
  description: string;
  skills: string[];
}

export interface LearningTemplate {
  id: string;
  name: string;
  description: string;
  difficulty: 'basic' | 'intermediate' | 'creative';
  emoji: string;
  isActive: boolean;
}

export interface LearningProgress {
  currentLevel: number;
  progress: number;
  nextSkills: string[];
  skillsLearned: string[];
}