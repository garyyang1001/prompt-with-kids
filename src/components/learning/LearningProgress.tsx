'use client';

interface ProgressBarProps {
  current: number;
  total: number;
  level: number;
  label?: string;
  showPercentage?: boolean;
  className?: string;
}

export function ProgressBar({ 
  current, 
  total, 
  level,
  label,
  showPercentage = true,
  className = ""
}: ProgressBarProps) {
  const percentage = Math.min((current / total) * 100, 100);
  
  const getLevelInfo = (level: number) => {
    const levels = {
      1: { name: '基礎描述', color: 'bg-primary' },
      2: { name: '環境感知', color: 'bg-secondary' },
      3: { name: '情感表達', color: 'bg-purple-500' },
      4: { name: '創意整合', color: 'bg-yellow-500' }
    };
    return levels[level as keyof typeof levels] || levels[1];
  };

  const levelInfo = getLevelInfo(level);

  return (
    <div className={`progress-bar ${className}`}>
      {/* 等級標題 */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-2">
          <div className={`w-6 h-6 rounded-full ${levelInfo.color} flex items-center justify-center text-white text-sm font-bold`}>
            {level}
          </div>
          <span className="font-medium text-gray-800">{levelInfo.name}</span>
          {label && <span className="text-sm text-gray-600">· {label}</span>}
        </div>
        {showPercentage && (
          <span className="text-sm font-medium text-gray-600">{Math.round(percentage)}%</span>
        )}
      </div>

      {/* 進度條 */}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div 
          className={`h-full ${levelInfo.color} transition-all duration-700 ease-out rounded-full relative`}
          style={{ width: `${percentage}%` }}
        >
          {/* 閃光效果 */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
        </div>
      </div>

      {/* 里程碑指示 */}
      <div className="flex justify-between mt-1 text-xs text-gray-500">
        <span>開始</span>
        <span className="text-center">進行中</span>
        <span>完成</span>
      </div>
    </div>
  );
}

interface LearningProgressProps {
  currentLevel: number;
  progress: number;
  skillsLearned: string[];
  nextSkills: string[];
  className?: string;
}

export function LearningProgress({ 
  currentLevel, 
  progress, 
  skillsLearned, 
  nextSkills,
  className = ""
}: LearningProgressProps) {
  return (
    <div className={`learning-progress bg-white rounded-lg p-6 border border-gray-200 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">🎯 學習進度</h3>
      
      {/* 當前等級進度 */}
      <ProgressBar 
        current={progress} 
        total={100} 
        level={currentLevel}
        label={`Level ${currentLevel}`}
        className="mb-6"
      />

      <div className="grid md:grid-cols-2 gap-4">
        {/* 已掌握技能 */}
        <div>
          <h4 className="font-medium text-gray-700 mb-2 flex items-center">
            ✅ 已掌握技能
          </h4>
          <div className="space-y-1">
            {skillsLearned.length > 0 ? (
              skillsLearned.map((skill, index) => (
                <div 
                  key={index}
                  className="bg-green-50 border border-green-200 rounded px-3 py-1 text-sm text-green-800"
                >
                  {skill}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">繼續練習來解鎖新技能！</p>
            )}
          </div>
        </div>

        {/* 下一步學習 */}
        <div>
          <h4 className="font-medium text-gray-700 mb-2 flex items-center">
            🎯 下一步學習
          </h4>
          <div className="space-y-1">
            {nextSkills.map((skill, index) => (
              <div 
                key={index}
                className="bg-blue-50 border border-blue-200 rounded px-3 py-1 text-sm text-blue-800"
              >
                {skill}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 鼓勵文字 */}
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800 text-center">
          {progress >= 80 ? '🎉 太棒了！你快要完成這個等級了！' :
           progress >= 60 ? '👍 做得很好！繼續保持！' :
           progress >= 40 ? '💪 不錯的開始！繼續努力！' :
           '🌟 每一步都在進步，加油！'}
        </p>
      </div>
    </div>
  );
}
