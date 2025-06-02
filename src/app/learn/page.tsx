'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles, MessageCircle, Target, Volume2 } from 'lucide-react';
import { VoiceChat } from '@/components/learning/VoiceChat';
import { LearningProgress } from '@/components/learning/LearningProgress';
import { learningEngine, LearningSession, LearningTemplate, LearningScenario } from '@/lib/learning/learning-engine';
import { AnalyzePromptResponse } from '@/lib/ai/gemini-client';

interface LearningState {
  session: LearningSession | null;
  template: LearningTemplate | null;
  currentScenario: LearningScenario | null;
  scenarioIndex: number;
  userInput: string;
  isProcessing: boolean;
  systemResponse: string;
  promptAnalysis: AnalyzePromptResponse | null;
  levelProgress: { currentLevel: number; progress: number; nextSkills: string[] } | null;
  skillsLearned: string[];
  showAnalysis: boolean;
  hasAdvanced: boolean;
}

function LearnPageContent() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get('template') || 'daily-life';

  const [state, setState] = useState<LearningState>({
    session: null,
    template: null,
    currentScenario: null,
    scenarioIndex: 0,
    userInput: '',
    isProcessing: false,
    systemResponse: '',
    promptAnalysis: null,
    levelProgress: null,
    skillsLearned: [],
    showAnalysis: false,
    hasAdvanced: false
  });

  // 初始化學習會話
  useEffect(() => {
    const initializeSession = async () => {
      try {
        const template = learningEngine.getTemplate(templateId);
        if (!template) {
          console.error('模板不存在:', templateId);
          return;
        }

        const session = await learningEngine.startSession('demo-user', templateId);
        const currentScenario = template.scenarios[0];

        setState(prev => ({
          ...prev,
          session,
          template,
          currentScenario,
          scenarioIndex: 0,
          systemResponse: `歡迎來到「${template.name}」學習模板！讓我們從第一個情境開始：${currentScenario.title}。試著描述一下${currentScenario.description}吧！`
        }));

        // 語音播放歡迎詞
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(`歡迎來到${template.name}學習！準備好開始描述練習了嗎？`);
          utterance.lang = 'zh-TW';
          utterance.rate = 0.9;
          speechSynthesis.speak(utterance);
        }
      } catch (error) {
        console.error('初始化學習會話失敗:', error);
      }
    };

    initializeSession();
  }, [templateId]);

  // 處理用戶輸入
  const handleUserInput = async (input: string) => {
    if (!state.session || !input.trim()) return;

    setState(prev => ({ ...prev, userInput: input, isProcessing: true }));

    try {
      const result = await learningEngine.processInteraction(
        state.session.id,
        input,
        state.currentScenario?.id
      );

      setState(prev => ({
        ...prev,
        isProcessing: false,
        systemResponse: result.systemResponse,
        promptAnalysis: result.promptAnalysis,
        levelProgress: result.levelProgress === undefined ? null : result.levelProgress, // Ensure undefined becomes null
        skillsLearned: result.skillsLearned || [], // Ensure undefined becomes empty array
        showAnalysis: true,
        // TODO: Adapt hasAdvanced for toddler stage progression if different from levels
        hasAdvanced: !!result.shouldAdvanceLevel 
      }));

      // 語音播放系統回應
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(result.systemResponse);
        utterance.lang = 'zh-TW';
        utterance.rate = 0.9;
        speechSynthesis.speak(utterance);
      }

    } catch (error) {
      console.error('處理學習互動失敗:', error);
      setState(prev => ({
        ...prev,
        isProcessing: false,
        systemResponse: '抱歉，處理時發生錯誤，請稍後再試。'
      }));
    }
  };

  // 切換到下一個情境
  const nextScenario = () => {
    if (!state.template || state.scenarioIndex >= state.template.scenarios.length - 1) return;

    const nextIndex = state.scenarioIndex + 1;
    const nextScenario = state.template.scenarios[nextIndex];

    setState(prev => ({
      ...prev,
      scenarioIndex: nextIndex,
      currentScenario: nextScenario,
      userInput: '',
      showAnalysis: false,
      systemResponse: `很好！現在讓我們進入下一個情境：${nextScenario.title}。${nextScenario.description}`
    }));
  };

  // 重新練習當前情境
  const retryScenario = () => {
    setState(prev => ({
      ...prev,
      userInput: '',
      showAnalysis: false,
      systemResponse: state.currentScenario ? 
        `讓我們再次練習：${state.currentScenario.title}。${state.currentScenario.description}` :
        '讓我們再次練習這個情境！'
    }));
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-TW';
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  if (!state.template || !state.session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">正在初始化學習環境...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-cream">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>返回首頁</span>
            </Link>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{state.template.emoji}</span>
              <h1 className="text-xl font-bold text-gray-900">{state.template.name}</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* 主要學習區域 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 當前情境 */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-primary" />
                  {state.currentScenario?.title}
                </h2>
                <div className="text-sm text-gray-500">
                  情境 {state.scenarioIndex + 1}/{state.template.scenarios.length}
                </div>
              </div>
              <p className="text-gray-600 mb-4">{state.currentScenario?.description}</p>
              
              {/* 示例提示 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  💡 範例開始：{state.currentScenario?.prompt}
                </p>
              </div>
            </div>

            {/* 語音輸入區域 */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <MessageCircle className="w-5 h-5 mr-2 text-primary" />
                說出你的描述
              </h3>
              
              <VoiceChat 
                onResult={handleUserInput}
                disabled={state.isProcessing}
                placeholder={state.isProcessing ? "AI正在思考中..." : "按住按鈕開始說話..."}
              />

              {/* 用戶輸入顯示 */}
              {state.userInput && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">你的描述：</h4>
                  <p className="text-green-700">{state.userInput}</p>
                </div>
              )}
            </div>

            {/* AI回應區域 */}
            {state.systemResponse && (
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-primary" />
                    AI學習助手
                  </h3>
                  <button
                    onClick={() => speak(state.systemResponse)}
                    className="flex items-center space-x-1 text-sm text-gray-600 hover:text-primary transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>重新播放</span>
                  </button>
                </div>
                <div className="bg-primary-light bg-opacity-20 rounded-lg p-4">
                  <p className="text-gray-800">{state.systemResponse}</p>
                </div>

                {/* 升級慶祝 */}
                {state.hasAdvanced && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                    <h4 className="font-bold text-yellow-800 text-lg">🎉 恭喜升級！</h4>
                    <p className="text-yellow-700">你已經進入 Level {state.session?.currentLevel}！</p>
                  </div>
                )}
              </div>
            )}

            {/* Prompt分析 */}
            {state.showAnalysis && state.promptAnalysis && (
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 描述分析報告</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                  {[
                    { label: '清晰度', value: state.promptAnalysis.clarity, color: 'bg-blue-500' },
                    { label: '細節', value: state.promptAnalysis.detail, color: 'bg-green-500' },
                    { label: '情感', value: state.promptAnalysis.emotion, color: 'bg-red-500' },
                    { label: '結構', value: state.promptAnalysis.structure, color: 'bg-purple-500' },
                    { label: '視覺', value: state.promptAnalysis.visual, color: 'bg-yellow-500' }
                  ].map((item, index) => (
                    <div key={index} className="text-center">
                      <div className={`w-16 h-16 ${item.color} rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2`}>
                        {Math.round(item.value)}
                      </div>
                      <p className="text-sm text-gray-600">{item.label}</p>
                    </div>
                  ))}
                </div>

                {/* 改進建議 */}
                {state.promptAnalysis.suggestions.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2">💡 改進建議：</h4>
                    <ul className="space-y-1">
                      {state.promptAnalysis.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <span className="text-primary mr-2">•</span>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 優化版本 */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <h4 className="font-medium text-green-800 mb-2">✨ 優化版本：</h4>
                  <p className="text-green-700">{state.promptAnalysis.optimizedPrompt}</p>
                </div>
              </div>
            )}

            {/* 操作按鈕 */}
            {state.showAnalysis && (
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={retryScenario}
                  className="btn-secondary flex-1 min-w-[150px]"
                >
                  🔄 再次練習
                </button>
                {state.scenarioIndex < state.template.scenarios.length - 1 && (
                  <button
                    onClick={nextScenario}
                    className="btn-primary flex-1 min-w-[150px]"
                  >
                    ➡️ 下一個情境
                  </button>
                )}
                {state.scenarioIndex === state.template.scenarios.length - 1 && (
                  <Link href="/" className="btn-primary flex-1 min-w-[150px] text-center">
                    🎉 完成學習
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* 側邊欄 - 學習進度 */}
          <div className="space-y-6">
            {state.levelProgress && (
              <LearningProgress
                currentLevel={state.levelProgress.currentLevel}
                progress={state.levelProgress.progress}
                skillsLearned={state.skillsLearned}
                nextSkills={state.levelProgress.nextSkills}
              />
            )}

            {/* 情境列表 */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">📚 學習情境</h3>
              <div className="space-y-3">
                {state.template.scenarios.map((scenario, index) => (
                  <div 
                    key={scenario.id}
                    className={`p-3 rounded-lg border ${
                      index === state.scenarioIndex 
                        ? 'border-primary bg-primary-light bg-opacity-20' 
                        : index < state.scenarioIndex
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === state.scenarioIndex
                          ? 'bg-primary text-white'
                          : index < state.scenarioIndex
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}>
                        {index < state.scenarioIndex ? '✓' : index + 1}
                      </div>
                      <span className={`font-medium ${
                        index === state.scenarioIndex ? 'text-primary' : 'text-gray-700'
                      }`}>
                        {scenario.title}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LearnPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">正在載入...</p>
        </div>
      </div>
    }>
      <LearnPageContent />
    </Suspense>
  );
}
