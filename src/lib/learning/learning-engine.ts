import { geminiClient, AnalyzePromptResponse } from '../ai/gemini-client';
import { toddlerAdventureTemplateData, ToddlerStage } from './toddler-adventure-template'; // Import new template and ToddlerStage

// Define the new ProcessInteractionResponse interface
export interface ProcessInteractionResponse {
  systemResponse: string;
  promptAnalysis: AnalyzePromptResponse;
  // Fields for 'daily-life' or other non-toddler templates
  levelProgress?: LearningProgress;
  skillsLearned?: string[];
  nextStep?: string;
  shouldAdvanceLevel?: boolean; // This can be true if advancing stage or level
  // Fields for 'toddler_adventure'
  currentStageData_DEPRECATED?: LearningScenario; // Keep adapted LearningScenario for now if needed by existing UI parts
  nextStageData_DEPRECATED?: LearningScenario;    // Keep adapted LearningScenario for now
  currentToddlerStage?: ToddlerStage; // Full current toddler stage data
  nextToddlerStage?: ToddlerStage;    // Full next toddler stage data
  isStoryComplete?: boolean;
}

export interface LearningSession {
  id: string;
  userId: string;
  templateId: string;
  startTime: Date;
  endTime?: Date;
  currentLevel: number; // For toddlers, this is the current stage index (0-indexed)
  interactions: LearningInteraction[];
  finalScore?: number;
  stageInputs?: Record<string, string | Record<string, any>>; // For toddler mode: { [stageId]: userInput }
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
}

export interface LearningScenario {
  id: string;
  title: string;
  description: string;
  prompt: string;
  expectedElements: string[];
}

export class LearningEngine {
  private sessions: Map<string, LearningSession> = new Map();
  
  // 學習模板定義
  private templates: Map<string, LearningTemplate> = new Map([
    ['daily-life', {
      id: 'daily-life',
      name: '我的一天',
      description: '學習具體化描述、環境感知、情感表達',
      difficulty: 'basic',
      emoji: '🥛',
      scenarios: [
        {
          id: 'morning',
          title: '早晨起床',
          description: '描述小朋友早上起床的情景',
          prompt: '小朋友起床',
          expectedElements: ['時間', '動作', '環境', '情感']
        },
        {
          id: 'breakfast',
          title: '吃早餐',
          description: '描述早餐時光的溫馨場景',
          prompt: '小朋友吃早餐',
          expectedElements: ['食物', '動作', '環境', '情感']
        },
        {
          id: 'play',
          title: '快樂玩耍',
          description: '描述小朋友玩耍的開心時光',
          prompt: '小朋友玩耍',
          expectedElements: ['玩具', '動作', '環境', '情感']
        },
        {
          id: 'sleep',
          title: '晚安時光',
          description: '描述溫馨的睡前時光',
          prompt: '小朋友睡覺',
          expectedElements: ['環境', '動作', '情感', '物品']
        }
      ]
    }]
    // Removed 'adventure-story' template
  ]);

  constructor() {
    // Adapt and add the toddler adventure template
    const adaptedToddlerAdventure: LearningTemplate = {
      id: toddlerAdventureTemplateData.id,
      name: toddlerAdventureTemplateData.name,
      description: toddlerAdventureTemplateData.description,
      difficulty: 'basic', // Toddlers are generally basic level
      emoji: '🧸', // Placeholder emoji, can be refined
      scenarios: toddlerAdventureTemplateData.stages.map(stage => ({
        id: stage.id,
        title: stage.title, // Using full title for now
        description: stage.description,
        prompt: stage.childPrompt, // Mapping childPrompt to prompt
        // Mapping visualCues and suggestions to expectedElements for compatibility
        // This could be refined based on how expectedElements is used by the engine
        expectedElements: [...(stage.visualCues || []), ...(stage.suggestions || [])],
      })),
    };
    this.templates.set(toddlerAdventureTemplateData.id, adaptedToddlerAdventure);
  }

  /**
   * 獲取模板
   */
  getTemplate(templateId: string): LearningTemplate | undefined {
    return this.templates.get(templateId);
  }

  /**
   * 獲取所有模板
   */
  getAllTemplates(): LearningTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * 開始新的學習會話
   */
  async startSession(userId: string, templateId: string): Promise<LearningSession> {
    const template = this.getTemplate(templateId);
    if (!template) {
      throw new Error(`模板 ${templateId} 不存在`);
    }

    const isToddlerMode = templateId === toddlerAdventureTemplateData.id;

    const session: LearningSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      templateId,
      startTime: new Date(),
      currentLevel: isToddlerMode ? 0 : 1, // Stage index for toddlers (0-indexed), level for others
      interactions: [],
      stageInputs: isToddlerMode ? {} : undefined,
    };

    this.sessions.set(session.id, session);
    return session;
  }

  /**
   * 獲取會話
   */
  getSession(sessionId: string): LearningSession | undefined {
    return this.sessions.get(sessionId);
  }

  /**
   * 處理用戶輸入並生成回應
   */
  async processInteraction(
    sessionId: string,
    userInput: string,
    scenarioId?: string // Corresponds to ToddlerStage.id for toddler mode
  ): Promise<ProcessInteractionResponse> { // Updated return type
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('學習會話不存在');
    }

    const isToddlerMode = session.templateId === toddlerAdventureTemplateData.id;
    const originalTemplate = this.getTemplate(session.templateId); // This is the adapted one
     if (!originalTemplate) {
      throw new Error('學習模板不存在');
    }

    // Determine context for AI guidance
    let guidanceContext: string;
    let currentToddlerStage: ToddlerStage | undefined = undefined;
    let currentAdaptedScenario: LearningScenario | undefined = undefined;

    if (isToddlerMode) {
      // scenarioId is ToddlerStage.id, session.currentLevel is the current stage index
      currentToddlerStage = toddlerAdventureTemplateData.stages.find(s => s.id === scenarioId);
      if (!currentToddlerStage || currentToddlerStage.order -1 !== session.currentLevel) {
         // Fallback or error if scenarioId from client doesn't match session's current stage
         currentToddlerStage = toddlerAdventureTemplateData.stages[session.currentLevel];
         if (!currentToddlerStage) {
            throw new Error(`Invalid currentLevel ${session.currentLevel} for toddler template.`);
         }
         // It's an error if scenarioId was provided but doesn't match expected stage
         if (scenarioId && scenarioId !== currentToddlerStage.id) {
             throw new Error(`Provided scenarioId ${scenarioId} does not match current stage ${currentToddlerStage.id}`);
         }
      }
      guidanceContext = currentToddlerStage.title; // Use full title for context
      currentAdaptedScenario = originalTemplate.scenarios.find(s => s.id === currentToddlerStage!.id);
    } else {
      currentAdaptedScenario = scenarioId ? originalTemplate.scenarios.find(s => s.id === scenarioId) : undefined;
      guidanceContext = currentAdaptedScenario ? `當前情境：${currentAdaptedScenario.title}` : '開放練習';
    }
    
    // For toddlers, currentLevel is stage index. GeminiClient's analyzePrompt for toddlers
    // doesn't heavily rely on targetLevel, so passing stage index is acceptable.
    const promptAnalysis = await geminiClient.analyzePrompt(
      userInput,
      session.currentLevel, // For toddlers, this is stage index; for others, it's level 1-4
      isToddlerMode
    );

    const systemResponse = await geminiClient.generateGuidance(
      userInput,
      session.currentLevel, // Same as above
      guidanceContext,
      isToddlerMode
    );
    
    const interaction: LearningInteraction = {
      id: `interaction_${Date.now()}`,
      timestamp: new Date(),
      userInput,
      systemResponse,
      promptAnalysis,
      skillsLearned: [], // Default, will be populated for non-toddler
      levelProgress: 0   // Default, will be populated for non-toddler
    };

    if (isToddlerMode) {
      interaction.levelProgress = 100; // Each step is "complete"
      
      // Store user input for the current stage
      if (currentToddlerStage && session.stageInputs) {
        session.stageInputs[currentToddlerStage.id] = userInput;
      }

      session.interactions.push(interaction);
      const currentStageIndex = toddlerAdventureTemplateData.stages.findIndex(s => s.id === currentToddlerStage!.id); // currentToddlerStage is guaranteed to be defined here
      const isLastStage = currentStageIndex >= toddlerAdventureTemplateData.stages.length - 1;
      let nextToddlerStageFull: ToddlerStage | undefined = undefined;
      
      if (!isLastStage) {
        session.currentLevel += 1; // Advance to next stage index
        nextToddlerStageFull = toddlerAdventureTemplateData.stages[session.currentLevel];
      }
      
      return {
        systemResponse,
        promptAnalysis,
        currentToddlerStage: currentToddlerStage,
        nextToddlerStage: nextToddlerStageFull,
        isStoryComplete: isLastStage,
        shouldAdvanceLevel: !isLastStage, // True if there's a next stage
        // Optional: include adapted scenario data if UI still uses it for some parts
        currentStageData_DEPRECATED: currentAdaptedScenario, 
        nextStageData_DEPRECATED: nextToddlerStageFull ? originalTemplate.scenarios.find(s => s.id === nextToddlerStageFull!.id) : undefined,
      };

    } else {
      // Existing logic for non-toddler templates
      const previousPrompts = session.interactions.map(i => i.userInput);
      const levelProgress = this.evaluateProgress(previousPrompts, userInput, session.currentLevel);
      interaction.skillsLearned = this.determineSkillsLearned(promptAnalysis, session.currentLevel);
      interaction.levelProgress = levelProgress.progress;
      
      session.interactions.push(interaction);

      const shouldAdvance = this.shouldAdvanceToNextLevel(session, promptAnalysis, levelProgress);
      if (shouldAdvance && session.currentLevel < 4) { // Assuming max 4 levels for others
        session.currentLevel += 1;
      }
      const nextStepMessage = this.determineNextStep(session, levelProgress, shouldAdvance);

      return {
        systemResponse,
        promptAnalysis,
        levelProgress,
        skillsLearned: interaction.skillsLearned,
        nextStep: nextStepMessage,
        shouldAdvanceLevel: shouldAdvance,
        isStoryComplete: (shouldAdvance && session.currentLevel >= 4) 
      };
    }
  }

  /**
   * 評估用戶學習進度
   */
  private evaluateProgress(
    previousPrompts: string[], 
    currentPrompt: string,
    currentLevel: number
  ): LearningProgress {
    const wordCount = currentPrompt.split(' ').length;
    const hasAdjectives = /美麗|可愛|溫暖|明亮|開心|大|小|紅|藍|綠|白|黑/.test(currentPrompt);
    const hasEnvironment = /在|裡|中|環境|場景|房間|公園|學校/.test(currentPrompt);
    const hasEmotion = /開心|快樂|興奮|溫暖|愛|喜歡|難過|生氣/.test(currentPrompt);
    const hasAction = /跳|跑|玩|笑|擁抱|看|聽|唱|畫/.test(currentPrompt);

    let progress = 0;
    let nextSkills: string[] = [];

    switch (currentLevel) {
      case 1:
        progress = hasAdjectives ? 75 : 25;
        if (wordCount >= 5) progress += 15;
        nextSkills = hasAdjectives ? 
          ['環境描述', '感官細節'] : 
          ['具體形容詞', '豐富描述'];
        break;
        
      case 2:
        progress = (hasAdjectives ? 25 : 0) + (hasEnvironment ? 50 : 0) + (wordCount >= 8 ? 25 : 0);
        nextSkills = hasEnvironment ? 
          ['情感表達', '動作描述'] : 
          ['環境描述', '場景設定'];
        break;
        
      case 3:
        progress = (hasAdjectives ? 20 : 0) + (hasEnvironment ? 20 : 0) + 
                  (hasEmotion ? 30 : 0) + (hasAction ? 30 : 0);
        nextSkills = (hasEmotion && hasAction) ? 
          ['創意想像', '多元素整合'] : 
          ['情感表達', '動作描述'];
        break;
        
      case 4:
        const complexity = (hasAdjectives ? 1 : 0) + (hasEnvironment ? 1 : 0) + 
                          (hasEmotion ? 1 : 0) + (hasAction ? 1 : 0);
        progress = Math.min(complexity * 25, 100);
        nextSkills = ['創意突破', 'master級描述'];
        break;
    }

    return {
      currentLevel,
      progress: Math.min(progress, 100),
      nextSkills
    };
  }

  /**
   * 確定學到的技能
   */
  private determineSkillsLearned(
    analysis: AnalyzePromptResponse,
    currentLevel: number
  ): string[] {
    const skills: string[] = [];

    if (analysis.clarity >= 70) skills.push('清晰表達');
    if (analysis.detail >= 70) skills.push('細節描述');
    if (analysis.emotion >= 70) skills.push('情感表達');
    if (analysis.visual >= 70) skills.push('視覺化描述');
    if (analysis.structure >= 70) skills.push('結構組織');

    return skills;
  }

  /**
   * 判斷是否應該升級到下一級
   */
  private shouldAdvanceToNextLevel(
    session: LearningSession,
    analysis: AnalyzePromptResponse,
    progress: LearningProgress
  ): boolean {
    // 需要滿足以下條件：
    // 1. 當前級別的進度超過80%
    // 2. 總體評分超過75
    // 3. 至少有3次互動
    return progress.progress >= 80 && 
           analysis.overall >= 75 && 
           session.interactions.length >= 2;
  }

  /**
   * 確定下一步行動
   */
  private determineNextStep(
    session: LearningSession,
    progress: LearningProgress,
    shouldAdvanceLevel: boolean
  ): string {
    if (shouldAdvanceLevel) {
      return session.currentLevel >= 4 ? 
        '太棒了！你已經是prompt小專家了！準備挑戰更複雜的創作吧！' :
        `恭喜升級到 Level ${session.currentLevel + 1}！準備學習新技能了！`;
    }
    
    if (progress.progress >= 70) {
      return '很好！再練習一次來鞏固技能吧！';
    } else if (progress.progress >= 50) {
      return `讓我們專注練習：${progress.nextSkills[0] || '描述技巧'}`;
    } else {
      return '不要著急，我們一步步來練習基礎技能！';
    }
  }

  /**
   * 完成學習會話
   */
  finishSession(sessionId: string): LearningSession {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('學習會話不存在');
    }

    session.endTime = new Date();
    session.finalScore = this.calculateFinalScore(session);

    return session;
  }

  /**
   * 計算最終分數
   */
  private calculateFinalScore(session: LearningSession): number {
    if (session.interactions.length === 0) return 0;

    const avgAnalysis = session.interactions.reduce((acc, interaction) => {
      const analysis = interaction.promptAnalysis;
      return {
        overall: acc.overall + analysis.overall
      };
    }, { overall: 0 });

    return Math.round(avgAnalysis.overall / session.interactions.length);
  }
}

// 創建全局實例
export const learningEngine = new LearningEngine();
