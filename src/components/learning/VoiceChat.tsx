'use client';

import { useState } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface VoiceChatProps {
  onResult: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function VoiceChat({ onResult, disabled = false, placeholder = "按住按鈕說話..." }: VoiceChatProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);

  // 檢查瀏覽器支援
  const checkSupport = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false);
      return false;
    }
    return true;
  };

  const startListening = () => {
    if (!checkSupport() || disabled) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'zh-TW';

    recognition.onstart = () => {
      setIsListening(true);
    };

    // Define more specific event types if global ones are not found
    interface CustomSpeechRecognitionEvent extends Event {
      readonly results: SpeechRecognitionResultList;
    }
    interface CustomSpeechRecognitionErrorEvent extends Event {
      readonly error: string; // Standard is SpeechRecognitionErrorCode but string is safer if type incomplete
      readonly message?: string;
    }

    recognition.onresult = (event: CustomSpeechRecognitionEvent) => {
      const results = event.results;
      const lastResult = results[results.length - 1];
      const transcript = lastResult[0].transcript;
      
      setTranscript(transcript);
      
      if (lastResult.isFinal) {
        onResult(transcript);
        setTranscript('');
        setIsListening(false);
      }
    };

    recognition.onerror = (event: CustomSpeechRecognitionErrorEvent) => {
      console.error('語音識別錯誤:', event.error, event.message);
      setIsListening(false);
      setTranscript('');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-TW';
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  if (!isSupported) {
    return (
      <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-yellow-800">您的瀏覽器不支援語音功能</p>
        <p className="text-sm text-yellow-600 mt-1">請使用Chrome、Edge或Safari瀏覽器</p>
      </div>
    );
  }

  return (
    <div className="voice-chat">
      <div className="flex flex-col items-center space-y-4">
        {/* 語音按鈕 */}
        <button
          onMouseDown={startListening}
          disabled={disabled}
          className={`
            w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200
            ${isListening 
              ? 'bg-red-500 text-white scale-110 animate-pulse' 
              : 'bg-primary text-white hover:bg-primary-dark hover:scale-105'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>

        {/* 狀態文字 */}
        <div className="text-center">
          {isListening ? (
            <p className="text-red-500 font-medium">🎤 正在聽取...</p>
          ) : (
            <p className="text-gray-600">{placeholder}</p>
          )}
        </div>

        {/* 實時轉錄 */}
        {transcript && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-md">
            <p className="text-blue-800 text-sm">{transcript}</p>
          </div>
        )}

        {/* 語音播放按鈕 */}
        <button
          onClick={() => speak("你好！我是你的AI學習助手，準備好開始學習了嗎？")}
          className="flex items-center space-x-2 text-sm text-gray-600 hover:text-primary transition-colors"
          disabled={disabled}
        >
          <Volume2 className="w-4 h-4" />
          <span>測試語音播放</span>
        </button>
      </div>
    </div>
  );
}
