/**
 * 獲取環境變數
 */
export function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`環境變數 ${name} 未設置`);
  }
  return value;
}

/**
 * 合併CSS類名
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * 延遲函數
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 格式化時間
 */
export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

/**
 * 計算學習時長
 */
export function calculateDuration(start: Date, end?: Date): string {
  const endTime = end || new Date();
  const diffMs = endTime.getTime() - start.getTime();
  const diffMins = Math.round(diffMs / (1000 * 60));
  
  if (diffMins < 60) {
    return `${diffMins} 分鐘`;
  }
  
  const hours = Math.floor(diffMins / 60);
  const mins = diffMins % 60;
  
  return `${hours} 小時 ${mins} 分鐘`;
}

/**
 * 生成隨機ID
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * 檢查是否為有效的prompt
 */
export function isValidPrompt(prompt: string): boolean {
  return prompt.trim().length >= 2 && prompt.trim().length <= 500;
}

/**
 * 清理用戶輸入
 */
export function sanitizeInput(input: string): string {
  return input.trim().replace(/\s+/g, ' ');
}

/**
 * 格式化評分
 */
export function formatScore(score: number): string {
  return Math.round(score).toString();
}

/**
 * 獲取評分等級
 */
export function getScoreLevel(score: number): {
  level: string;
  color: string;
  emoji: string;
} {
  if (score >= 90) {
    return { level: '優秀', color: 'text-green-600', emoji: '🌟' };
  } else if (score >= 80) {
    return { level: '很好', color: 'text-blue-600', emoji: '👍' };
  } else if (score >= 70) {
    return { level: '不錯', color: 'text-yellow-600', emoji: '😊' };
  } else if (score >= 60) {
    return { level: '還行', color: 'text-orange-600', emoji: '🙂' };
  } else {
    return { level: '需加油', color: 'text-red-600', emoji: '💪' };
  }
}

/**
 * 本地存儲工具（僅客戶端）
 */
export const storage = {
  get: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  
  set: (key: string, value: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, value);
    } catch {
      // 忽略存儲錯誤
    }
  },
  
  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch {
      // 忽略移除錯誤
    }
  }
};

/**
 * 檢查瀏覽器功能支援
 */
export function checkBrowserSupport() {
  const support = {
    speechRecognition: typeof window !== 'undefined' && 
      ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window),
    speechSynthesis: typeof window !== 'undefined' && 'speechSynthesis' in window,
    localStorage: typeof window !== 'undefined' && 'localStorage' in window
  };
  
  return support;
}

/**
 * 防抖函數
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
}

/**
 * 節流函數
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
