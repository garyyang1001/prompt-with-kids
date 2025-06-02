export interface GeminiConfig {
  model: string;
  apiKey: string;
  responseMimeType?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface ContentPart {
  text?: string;
  image?: {
    data: string;
    mimeType: string;
  };
}

export interface Message {
  role: 'user' | 'model';
  parts: ContentPart[];
}

export interface AnalyzePromptResponse {
  clarity: number;          // 清晰度 0-100
  detail: number;          // 細節豐富度 0-100
  emotion: number;         // 情感表達 0-100
  structure: number;       // 結構完整性 0-100
  visual: number;          // 視覺描述性 0-100
  overall: number;         // 總體評分 0-100
  suggestions: string[];   // 改進建議
  optimizedPrompt: string; // 優化後的prompt
}

export interface GenerateGuidanceResponse {
  guidance: string;
  nextLevel?: number;
  encouragement: string;
}

export interface LearningLevel {
  level: 1 | 2 | 3 | 4;
  name: string;
  description: string;
  skills: string[];
  color: string;
}

export interface PromptAnalysis {
  score: number;
  strengths: string[];
  improvements: string[];
  optimizedVersion: string;
}

export interface VoiceConfig {
  language: string;
  voice: string;
  speed: number;
  pitch: number;
}

export interface TranscriptionResult {
  text: string;
  confidence: number;
  language: string;
}

export interface AIError {
  message: string;
  code?: string;
  details?: any;
}

// 瀏覽器API類型擴展
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
