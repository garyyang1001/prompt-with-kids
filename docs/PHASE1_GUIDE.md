# 🚀 第一階段開發指南

## 📋 當前進度

### ✅ 已完成
- [x] 基礎專案架構設置
- [x] TypeScript 和 Tailwind CSS 配置
- [x] 首頁和基礎 UI 設計
- [x] 類型定義系統
- [x] Google Gemini AI 客戶端封裝
- [x] 核心工具函數

### 🎯 當前狀態
專案已建立完整的基礎架構，包含：
- **前端框架**: Next.js 14 + TypeScript + Tailwind CSS
- **AI 服務**: Google Gemini 2.5 Pro 整合
- **設計系統**: 溫暖親子風格的色彩和組件
- **類型安全**: 完整的 TypeScript 類型定義

## 🛠 快速開始

### 1. 環境設置
```bash
# 克隆專案
git clone https://github.com/garyyang1001/prompt-with-kids.git
cd prompt-with-kids

# 安裝依賴
npm install

# 設置環境變數
cp .env.example .env.local
```

### 2. 配置 Gemini API
在 `.env.local` 中加入你的 API Key：
```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. 啟動開發
```bash
npm run dev
```

訪問 http://localhost:3000 查看首頁

## 🧠 核心架構說明

### Gemini AI 客戶端 (`src/lib/ai/gemini-client.ts`)
這是第一階段的核心組件，提供兩個主要功能：

#### 1. Prompt 分析 (`analyzePrompt`)
```typescript
// 分析用戶輸入的 prompt 品質
const analysis = await geminiClient.analyzePrompt("小兔子找胡蘿蔔", 1);

// 回傳結果包含：
// - 各維度評分 (clarity, detail, emotion, structure, visual)
// - 總體評分 (overall)
// - 改進建議 (suggestions)
// - 優化版本 (optimizedPrompt)
```

#### 2. 學習引導 (`generateGuidance`)
```typescript
// 生成個人化學習引導
const guidance = await geminiClient.generateGuidance(
  "小兔子找胡蘿蔔", 
  1, 
  "第一次嘗試"
);

// 回傳溫暖鼓勵的引導文字
```

### 類型系統
- `src/types/learning.ts`: 學習流程相關類型
- `src/types/ai.ts`: AI 服務相關類型

### 設計系統
- **主色調**: 溫暖橙色 (#FF8C42)
- **輔助色**: 親和藍色 (#4A90E2)
- **背景色**: 米白色系，營造溫暖感
- **組件樣式**: 卡片式設計，圓角和陰影

## 📋 下一步開發任務

### 🎯 接下來要實現的功能

#### 1. 學習流程頁面 (`/learn`)
- [ ] 建立學習主頁面 `src/app/learn/page.tsx`
- [ ] 實現四級學習進程的UI設計
- [ ] 用戶輸入組件和進度追蹤

#### 2. 學習引擎
- [ ] `src/lib/learning/learning-engine.ts`
- [ ] 會話管理和進度追蹤
- [ ] 等級升級邏輯

#### 3. API 路由
- [ ] `src/app/api/analyze-prompt/route.ts`
- [ ] `src/app/api/generate-guidance/route.ts`
- [ ] 前後端串接

#### 4. 學習組件
- [ ] `src/components/learning/PromptInput.tsx`
- [ ] `src/components/learning/LearningGuide.tsx`
- [ ] `src/components/learning/ProgressTracker.tsx`

## 💡 開發建議

### 1. 按順序開發
建議按照以下順序完成：
1. API 路由 → 2. 學習引擎 → 3. 學習頁面 → 4. 學習組件

### 2. 測試驗證
每個功能完成後，記得：
- 測試 Gemini API 回應品質
- 驗證學習流程邏輯
- 確保用戶體驗流暢

### 3. 漸進式完善
- 先實現基本功能
- 再優化用戶體驗
- 最後加入進階功能

## 🐛 常見問題

### Q: Gemini API 錯誤怎麼辦？
A: 檢查 API Key 是否正確設置，確認網路連接正常

### Q: 樣式沒有生效？
A: 確認 Tailwind CSS 配置正確，檢查類名是否拼寫正確

### Q: TypeScript 錯誤？
A: 檢查類型導入路徑，確認所有類型定義文件存在

## 🎯 成功指標

第一階段完成時應該能夠：
- ✅ 用戶可以輸入簡單描述
- ✅ 系統能分析並給出回饋
- ✅ 提供溫暖的學習引導
- ✅ 展示基本的學習進度

---

**準備好繼續開發了嗎？讓我們一起創造出色的學習體驗！** 🌟