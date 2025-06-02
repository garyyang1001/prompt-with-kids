/**
 * AI服務相關的類型定義
 */

export interface GeminiConfig {
  model: string;
  apiKey: string;
  temperature?: number;
  maxTokens?: number;
}

export interface GenerateTextRequest {
  prompt: string;
  systemInstruction?: string;
}

export interface GenerateTextResponse {
  text: string;
  finishReason?: string;
  usageMetadata?: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}

export interface AnalyzePromptRequest {
  userPrompt: string;
  targetLevel: number;
}

export interface AnalyzePromptResponse {
  clarity: number;
  detail: number;
  emotion: number;
  structure: number;
  visual: number;
  overall: number;
  suggestions: string[];
  optimizedPrompt: string;
}

export interface GenerateGuidanceRequest {
  userInput: string;
  currentLevel: number;
  context?: string;
}

export interface GenerateGuidanceResponse {
  guidance: string;
  nextStep?: string;
  encouragement?: string;
}