import { geminiClient, AnalyzePromptResponse } from '../ai/gemini-client';

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
  ]);

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

    const session: LearningSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      templateId,
      startTime: new Date(),
      currentLevel: 1,
      interactions: []
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
    scenarioId?: string
  ): Promise<{
    systemResponse: string;
    promptAnalysis: AnalyzePromptResponse;
    levelProgress: LearningProgress;
    skillsLearned: string[];
    nextStep: string;
    shouldAdvanceLevel: boolean;
  }> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('學習會話不存在');
    }

    const template = this.getTemplate(session.templateId);
    if (!template) {
      throw new Error('學習模板不存在');
    }

    // 分析用戶的prompt
    const promptAnalysis = await geminiClient.analyzePrompt(
      userInput, 
      session.currentLevel
    );

    // 生成引導回應
    const context = scenarioId ? 
      `當前情境：${template.scenarios.find(s => s.id === scenarioId)?.title || ''}` : 
      '開放練習';
    
    const systemResponse = await geminiClient.generateGuidance(
      userInput,
      session.currentLevel,
      context
    );

    // 評估學習進度
    const previousPrompts = session.interactions.map(i => i.userInput);
    const levelProgress = this.evaluateProgress(previousPrompts, userInput, session.currentLevel);

    // 確定學到的技能
    const skillsLearned = this.determineSkillsLearned(
      promptAnalysis,
      session.currentLevel
    );

    // 判斷是否應該升級
    const shouldAdvanceLevel = this.shouldAdvanceToNextLevel(
      session,
      promptAnalysis,
      levelProgress
    );

    // 更新會話
    const interaction: LearningInteraction = {
      id: `interaction_${Date.now()}`,
      timestamp: new Date(),
      userInput,
      systemResponse,
      promptAnalysis,
      skillsLearned,
      levelProgress: levelProgress.progress
    };

    session.interactions.push(interaction);

    if (shouldAdvanceLevel && session.currentLevel < 4) {
      session.currentLevel += 1;
    }

    // 確定下一步
    const nextStep = this.determineNextStep(session, levelProgress, shouldAdvanceLevel);

    return {
      systemResponse,
      promptAnalysis,
      levelProgress,
      skillsLearned,
      nextStep,
      shouldAdvanceLevel
    };
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
