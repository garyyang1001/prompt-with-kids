import { GoogleGenAI } from '@google/genai';

export interface GeminiConfig {
  model: string;
  apiKey: string;
  responseMimeType?: string;
  maxTokens?: number;
  temperature?: number;
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

export class GeminiClient {
  private ai: GoogleGenAI;
  private config: GeminiConfig;

  constructor(config?: Partial<GeminiConfig>) {
    const defaultConfig: GeminiConfig = {
      model: 'gemini-2.0-flash-001',
      apiKey: process.env.GEMINI_API_KEY!,
      temperature: 0.7,
      maxTokens: 1000,
      responseMimeType: 'text/plain'
    };

    this.config = { ...defaultConfig, ...config };
    this.ai = new GoogleGenAI({
      apiKey: this.config.apiKey,
    });
  }

  /**
   * 生成文字內容
   */
  async generateText(prompt: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: this.config.model,
        contents: prompt,
      });

      return response.text || '';
    } catch (error) {
      console.error('Gemini text generation error:', error);
      throw new Error('AI服務暫時無法使用，請稍後再試');
    }
  }

  /**
   * 流式生成文字內容
   */
  async generateTextStream(
    prompt: string,
    onChunk: (chunk: string) => void
  ): Promise<string> {
    try {
      const response = await this.ai.models.generateContentStream({
        model: this.config.model,
        contents: prompt,
      });

      let fullText = '';
      for await (const chunk of response) {
        if (chunk.text) {
          fullText += chunk.text;
          onChunk(chunk.text);
        }
      }

      return fullText;
    } catch (error) {
      console.error('Gemini stream generation error:', error);
      throw new Error('AI服務暫時無法使用，請稍後再試');
    }
  }

  /**
   * 生成圖片
   */
  async generateImage(prompt: string): Promise<string> {
    try {
      const contents = [{ role: 'user', parts: [{ text: prompt }] }];
      const config = {
        // responseModalities: ['IMAGE'], // This causes an error with gemini-1.5-flash
        responseMimeType: 'text/plain', // Or 'application/json'
      };

      const response = await this.ai.models.generateContentStream({
        model: 'gemini-1.5-flash-preview-0514', // Updated model
        // @ts-ignore
        config, // Add config
        contents,
      });

      // 處理圖片回應
      for await (const chunk of response) {
        // console.log('Image gen chunk:', JSON.stringify(chunk, null, 2)); // For debugging
        if (chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
          const inlineData = chunk.candidates[0].content.parts[0].inlineData;
          
          if (!inlineData.data || !inlineData.mimeType) {
            console.warn('Received inlineData without data or mimeType:', inlineData);
            continue; // Skip if essential data is missing
          }
          const imageData = inlineData.data;
          
          // 返回base64圖片數據
          return `data:${inlineData.mimeType};base64,${imageData}`;
        }
      }

      console.error('Gemini image generation error: No image data found in stream chunks.');
      throw new Error('未能生成圖片，AI未返回有效的圖片數據');
    } catch (error: any) { // Added :any
      console.error('Gemini image generation error:', error);
      // Check if it's a specific API error
      // Added checks for error, error.message, and typeof error.message
      if (error && error.message && typeof error.message === 'string' && error.message.includes('SAFETY')) {
          throw new Error('圖片生成請求因安全限制被拒絕。請嘗試不同的描述。');
      }
      if (error && error.message && typeof error.message === 'string' && error.message.includes('quota')) {
          throw new Error('圖片生成服務的配額已用盡。請稍後再試。');
      }
      throw new Error('圖片生成失敗，請稍後再試');
    }
  }

  /**
   * 分析用戶Prompt的品質
   */
  async analyzePrompt(
    userPrompt: string,
    targetLevel: number = 1, // Standard level, e.g., 1-4
    isToddlerMode: boolean = false // New flag for toddler context
  ): Promise<AnalyzePromptResponse> {
    let analysisPrompt: string;

    if (isToddlerMode) {
      analysisPrompt = `You are analyzing a young child's story idea or choice. The child is likely 3-6 years old.
The input is: "${userPrompt}"
Focus on whether their input is understandable and if it fits the current story stage (context may be provided by user input).
Provide simple, encouraging feedback.
Score clarity (is it understandable?) and engagement (does it fit the story stage or show enthusiasm?) from 0-100.
Other scores (detail, emotion, structure, visual) can be minimal (0-30) unless clearly expressed.
Offer one very simple suggestion for the parent to help the child if needed (e.g., "Maybe ask them to pick their favorite color for the car?").
The 'optimizedPrompt' should be the child's original input.

Please respond in JSON format:
{
  "clarity": number, 
  "detail": number, 
  "emotion": number, 
  "structure": number, 
  "visual": number, 
  "overall": number, 
  "suggestions": string[],
  "optimizedPrompt": string 
}`;
    } else {
      const levelDescriptions = {
        1: "基礎描述 - 學習使用具體的形容詞描述事物",
        2: "環境感知 - 學習描述環境和氛圍",
        3: "情感表達 - 學習加入情感和動作描述",
        4: "創意整合 - 學習創造性地組合各種元素"
      };
      const currentLevelDesc = levelDescriptions[targetLevel as keyof typeof levelDescriptions] || "general creative task";

      analysisPrompt = `請分析以下用於AI圖片生成的prompt，評估其在以下維度的表現（0-100分）：

1. 清晰度 (clarity): 描述是否清楚明確
2. 細節豐富度 (detail): 是否包含足夠的細節
3. 情感表達 (emotion): 是否有情感或氛圍描述
4. 結構完整性 (structure): 描述邏輯是否完整
5. 視覺描述性 (visual): 是否有助於視覺化

用戶Prompt: "${userPrompt}"
目標學習等級: ${targetLevel} (${currentLevelDesc})

請以JSON格式回應：
{
  "clarity": number,
  "detail": number,
  "emotion": number,
  "structure": number,
  "visual": number,
  "overall": number,
  "suggestions": string[],
  "optimizedPrompt": string
}`;
    }

    try {
      const response = await this.generateText(analysisPrompt);
      
      // 嘗試解析JSON回應
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        
        // 驗證回應格式
        if (this.validateAnalysisResponse(result)) {
          return result;
        }
      }
      
      throw new Error('Invalid JSON response format');
    } catch (error) {
      console.error('Prompt analysis error:', error);
      
      // 提供降級回應
      return this.getFallbackAnalysis(userPrompt, targetLevel, isToddlerMode);
    }
  }

  /**
   * 生成學習引導
   */
  async generateGuidance(
    userInput: string,
    currentLevel: number, // For toddlers, this might represent stage order or be unused
    context: string = "", // For toddlers, this will be crucial (e.g., current stage title)
    isToddlerMode: boolean = false // New flag for toddler context
  ): Promise<string> {
    let guidancePrompt: string;

    if (isToddlerMode) {
      guidancePrompt = `You are a friendly AI assistant helping a parent and a 3-6 year old child create a story together.
Current story stage/context: "${context}"
The child said/chose: "${userInput}"

Generate a warm, encouraging, and very simple guidance message for the parent to say to the child to continue the story, make a choice, or affirm their input.
Keep it short (1-2 sentences), playful, and directly related to the child's input and the current story stage.
Example: If stage is "Choose a character" and child says "bunny!", guidance could be: "A bunny! That's a great choice! What color is our bunny?"
Example: If stage is "What happens next?" and child says "he eats a carrot", guidance could be: "Yummy carrot! And then what fun thing does he do?"
`;
    } else {
      const levelInfo = {
        1: { name: '基礎描述', skills: ['具體化描述', '基礎形容詞使用'] },
        2: { name: '環境感知', skills: ['環境描述', '感官細節', '氛圍營造'] },
        3: { name: '情感表達', skills: ['情感表達', '動作描述', '關係互動'] },
        4: { name: '創意整合', skills: ['創意想像', '多元素整合', '故事連貫性'] }
      };
      const current = levelInfo[currentLevel as keyof typeof levelInfo] || levelInfo[1];

      guidancePrompt = `你是一位親子AI教學助手，正在引導家長和孩子學習Prompt Engineering。

當前學習等級: ${current.name} (Level ${currentLevel})
要培養的技能: ${current.skills.join(', ')}

用戶輸入: "${userInput}"
上下文: ${context}

請生成溫暖、鼓勵性的引導回應，幫助用戶提升到下一個層次。
回應應該：
1. 肯定用戶的嘗試
2. 指出可以改進的地方
3. 提供具體的改進建議
4. 使用親子友善的語言`;
    }

    try {
      return await this.generateText(guidancePrompt);
    } catch (error) {
      console.error('Guidance generation error:', error);
      // Fallback more suitable for toddlers if in that mode
      if (isToddlerMode) {
        return `好棒！那接下來呢？`;
      }
      return '很棒的嘗試！讓我們試著加入更多細節來讓描述更生動吧！';
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
  private getFallbackAnalysis(
    userPrompt: string, 
    targetLevel: number,
    isToddlerMode: boolean = false
  ): AnalyzePromptResponse {
    if (isToddlerMode) {
      // Simplified fallback for toddlers
      const commonWords = ['小兔子', '公園', '玩', '開心'];
      const clarity = commonWords.some(word => userPrompt.includes(word)) ? 70 : 40;
      const engagement = userPrompt.length > 2 ? 60 : 30;
      return {
        clarity: clarity,
        detail: 20, // Renamed to engagement, but keeping field for compatibility
        emotion: 20,
        structure: 30,
        visual: 20,
        overall: Math.round((clarity + engagement) / 2),
        suggestions: ['可以問問寶寶最喜歡什麼顏色！'],
        optimizedPrompt: userPrompt
      };
    }

    const wordCount = userPrompt.split(' ').length;
    const hasAdjectives = /美麗|可愛|溫暖|明亮|開心|大|小|紅|藍|綠|白|黑/.test(userPrompt);
    const hasActions = /跑|跳|玩|笑|哭|看|聽|吃|睡/.test(userPrompt);
    const hasEmotions = /開心|快樂|興奮|溫暖|愛|喜歡|難過|生氣/.test(userPrompt);

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
      suggestions: ['嘗試加入更多具體的描述'],
      optimizedPrompt: userPrompt
    };
  }
}

// 創建全局實例
export const geminiClient = new GeminiClient();
