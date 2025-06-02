import { GoogleGenerativeAI } from '@google/generative-ai';
import { getEnvVar } from '../utils';
import type { 
  GeminiConfig, 
  AnalyzePromptResponse,
  GenerateGuidanceResponse 
} from '@/types/ai';

/**
 * Google Gemini API 客戶端封裝
 * 提供 Prompt 分析和學習引導功能
 */
export class GeminiClient {
  private genAI: GoogleGenerativeAI;
  private config: GeminiConfig;

  constructor(config?: Partial<GeminiConfig>) {
    const defaultConfig: GeminiConfig = {
      model: 'gemini-1.5-pro',
      apiKey: getEnvVar('GEMINI_API_KEY'),
      temperature: 0.7,
      maxTokens: 1000,
    };

    this.config = { ...defaultConfig, ...config };
    this.genAI = new GoogleGenerativeAI(this.config.apiKey);
  }

  /**
   * 生成文字回應的基礎方法
   */
  async generateText(
    prompt: string, 
    systemInstruction?: string
  ): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ 
        model: this.config.model,
        systemInstruction,
        generationConfig: {
          temperature: this.config.temperature,
          maxOutputTokens: this.config.maxTokens,
        }
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API 錯誤:', error);
      throw new Error('AI服務暫時無法使用，請稍後再試');
    }
  }

  /**
   * 分析用戶Prompt的品質
   * 這是核心功能：評估用戶描述的各個維度
   */
  async analyzePrompt(
    userPrompt: string, 
    targetLevel: number = 1
  ): Promise<AnalyzePromptResponse> {
    const levelDescriptions = {
      1: "基礎描述 - 學習使用具體的形容詞描述事物",
      2: "環境感知 - 學習描述環境和氛圍",
      3: "情感表達 - 學習加入情感和動作描述", 
      4: "創意整合 - 學習創造性地組合各種元素"
    };

    const analysisPrompt = `
你是專業的Prompt Engineering教學助手，專門評估親子學習中的描述品質。

請分析以下用於AI創作的prompt，針對${levelDescriptions[targetLevel as keyof typeof levelDescriptions] || '基礎練習'}進行評估：

用戶Prompt: "${userPrompt}"
目標學習等級: Level ${targetLevel}

請評估以下維度（0-100分）：
1. 清晰度 (clarity): 描述是否清楚明確，容易理解
2. 細節豐富度 (detail): 是否包含足夠的具體細節
3. 情感表達 (emotion): 是否有情感或氛圍的描述
4. 結構完整性 (structure): 描述邏輯是否完整有序
5. 視覺描述性 (visual): 是否有助於視覺化想像

評估原則：
- 考慮這是親子學習環境，用鼓勵性的角度評估
- 根據目標等級調整評分標準
- 提供具體、可操作的改進建議
- 優化版本要保持原意但更豐富

請嚴格按照以下JSON格式回應：
{
  "clarity": number,
  "detail": number,
  "emotion": number,
  "structure": number,
  "visual": number,
  "overall": number,
  "suggestions": ["具體建議1", "具體建議2"],
  "optimizedPrompt": "優化後的prompt文字"
}
`;

    const systemInstruction = "你是溫暖、專業的親子AI教學助手，擅長評估和優化創作描述。回應必須是有效的JSON格式。";
    
    try {
      const response = await this.generateText(analysisPrompt, systemInstruction);
      
      // 嘗試解析JSON回應
      const jsonMatch = response.match(/\\{[\\s\\S]*\\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        
        // 驗證回應格式
        if (this.validateAnalysisResponse(result)) {
          return result;
        }
      }
      
      throw new Error('Invalid JSON response format');
    } catch (error) {
      console.error('Prompt分析錯誤:', error);
      
      // 提供降級回應
      return this.getFallbackAnalysis(userPrompt, targetLevel);
    }
  }

  /**
   * 生成學習引導回應
   * 根據用戶輸入和當前等級提供個人化引導
   */
  async generateGuidance(
    userInput: string,
    currentLevel: number,
    context: string = ""
  ): Promise<string> {
    const levelGuidance = {
      1: {
        focus: "具體化描述和基礎形容詞",
        example: "試著加入更多具體的形容詞，比如顏色、大小、形狀"
      },
      2: {
        focus: "環境描述和感官細節", 
        example: "想想看周圍的環境是什麼樣子？有什麼聲音、氣味或感覺？"
      },
      3: {
        focus: "情感表達和動作描述",
        example: "角色的心情如何？他們在做什麼動作？"
      },
      4: {
        focus: "創意想像和元素整合",
        example: "試著結合不同的元素，創造獨特的場景"
      }
    };

    const currentGuidance = levelGuidance[currentLevel as keyof typeof levelGuidance] || levelGuidance[1];

    const guidancePrompt = `
你是溫暖的親子AI教學助手，正在引導家長和孩子學習Prompt描述技巧。

當前情況：
- 學習等級: Level ${currentLevel}
- 學習重點: ${currentGuidance.focus}
- 用戶輸入: "${userInput}"
- 學習背景: ${context}

請生成溫暖、鼓勵性的引導回應：

引導原則：
1. 先真心肯定用戶的嘗試和創意
2. 指出已經做得好的地方
3. 溫和地提出可以改進的方向
4. 提供具體、容易理解的建議
5. 用親子友善的語言，避免技術術語
6. 保持鼓勵和支持的語調
7. 長度控制在80-120字

範例引導風格：
"太棒了！你已經..." + "我發現..." + "如果我們再加上..." + "你覺得怎麼樣？"

直接回應引導內容，不要使用額外格式或標記。
`;

    const systemInstruction = "你是專業的親子教育AI助手，擅長用溫暖鼓勵的方式指導學習。回應要自然親切，像朋友一樣交流。";
    
    try {
      const guidance = await this.generateText(guidancePrompt, systemInstruction);
      return guidance.trim();
    } catch (error) {
      console.error('學習引導生成錯誤:', error);
      
      // 提供降級回應
      return this.getFallbackGuidance(currentLevel);
    }
  }

  /**
   * 驗證分析回應格式
   */
  private validateAnalysisResponse(response: any): boolean {
    const requiredFields = ['clarity', 'detail', 'emotion', 'structure', 'visual', 'overall', 'suggestions', 'optimizedPrompt'];
    
    return requiredFields.every(field => field in response) &&
           typeof response.overall === 'number' &&
           Array.isArray(response.suggestions) &&
           typeof response.optimizedPrompt === 'string';
  }

  /**
   * 提供降級分析結果
   */
  private getFallbackAnalysis(userPrompt: string, targetLevel: number): AnalyzePromptResponse {
    // 簡單的基於關鍵詞的分析
    const wordCount = userPrompt.split(' ').length;
    const hasAdjectives = /美麗|可愛|溫暖|明亮|開心|大|小|紅|藍|綠/.test(userPrompt);
    const hasActions = /跑|跳|玩|笑|哭|看|聽|吃|睡/.test(userPrompt);
    const hasEmotions = /開心|快樂|興奮|溫暖|愛|喜歡/.test(userPrompt);

    let baseScore = Math.min(40 + wordCount * 5, 70);
    if (hasAdjectives) baseScore += 10;
    if (hasActions) baseScore += 10; 
    if (hasEmotions) baseScore += 10;

    return {
      clarity: Math.min(baseScore + 5, 85),
      detail: Math.min(baseScore, 80),
      emotion: hasEmotions ? Math.min(baseScore + 15, 90) : Math.max(baseScore - 20, 30),
      structure: Math.min(baseScore + 5, 75),
      visual: hasAdjectives ? Math.min(baseScore + 10, 85) : Math.max(baseScore - 15, 35),
      overall: baseScore,
      suggestions: this.getFallbackSuggestions(targetLevel, hasAdjectives, hasActions, hasEmotions),
      optimizedPrompt: this.generateSimpleOptimization(userPrompt, hasAdjectives, hasActions)
    };
  }

  /**
   * 生成降級建議
   */
  private getFallbackSuggestions(level: number, hasAdjectives: boolean, hasActions: boolean, hasEmotions: boolean): string[] {
    const suggestions = [];
    
    if (!hasAdjectives) {
      suggestions.push("試著加入一些形容詞，像是顏色、大小或形狀");
    }
    
    if (level >= 2 && !hasActions) {
      suggestions.push("可以描述一下正在發生什麼動作");
    }
    
    if (level >= 3 && !hasEmotions) {
      suggestions.push("加入一些情感描述會讓故事更生動");
    }
    
    suggestions.push("試著讓描述更具體一些");
    
    return suggestions.slice(0, 3);
  }

  /**
   * 簡單的prompt優化
   */
  private generateSimpleOptimization(original: string, hasAdjectives: boolean, hasActions: boolean): string {
    if (hasAdjectives && hasActions) {
      return original;
    }
    
    // 簡單的優化邏輯
    if (!hasAdjectives && original.includes('小朋友')) {
      return original.replace('小朋友', '可愛的小朋友');
    }
    
    if (!hasActions && !original.includes('在')) {
      return original + '，開心地玩耍';
    }
    
    return original;
  }

  /**
   * 提供降級引導回應
   */
  private getFallbackGuidance(level: number): string {
    const fallbackResponses = {
      1: "很棒的開始！讓我們試著加入更多具體的描述，比如顏色或大小，這樣畫面會更清楚喔！",
      2: "太好了！現在試試描述一下周圍的環境，想像一下是在什麼地方發生的？",
      3: "很有創意！如果加上一些情感和動作描述，故事會更生動有趣呢！",
      4: "很棒的想像力！試著把不同的元素組合起來，創造出獨特的場景吧！"
    };
    
    return fallbackResponses[level as keyof typeof fallbackResponses] || fallbackResponses[1];
  }
}

// 建立全域實例
export const geminiClient = new GeminiClient();