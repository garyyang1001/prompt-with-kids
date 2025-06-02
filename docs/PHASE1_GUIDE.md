# 🚀 MVP 開發指南 - 「今天的小冒險」

## 📋 當前狀態 (MVP 完成)

### ✅ 已完成核心功能
- [x] **「今天的小冒險」創作模板**: 專為3-6歲幼兒設計的5階段故事模板。
- [x] **AI輔助與引導**: 使用 Google Gemini (`gemini-1.5-flash-preview-0514` 及文字模型) 提供：
    - 針對幼兒輸入的分析與回饋 (`analyzePrompt` 已適配 `isToddlerMode`)。
    - 配合家長引導的AI提示語 (`generateGuidance` 已適配 `isToddlerMode`)。
    - 故事關鍵節點的圖像生成。
- [x] **故事儲存與讀取**: 使用 Supabase 儲存完成的故事，並提供讀取界面。
- [x] **核心API路由**: 建立 `/api/story/create`, `/api/story/interact`, `/api/story/archive`。
- [x] **基礎前端界面**:
    - `/story/toddler-adventure`: 「今天的小冒險」故事創作頁面。
    - `/story/archive`: 已儲存故事的展示頁面。

### 🎯 MVP 技術棧
- **前端框架**: Next.js 14 + TypeScript + Tailwind CSS
- **AI 服務**: Google Gemini (`gemini-1.5-flash-preview-0514` for images, text models for guidance/analysis)
- **數據庫**: Supabase (PostgreSQL)
- **部署**: Vercel (預期)

## 🛠 快速開始

與主 `README.md` 中的「快速開始」章節同步。主要確保以下環境變數已在 `.env.local` 中正確配置：
```env
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000 
```
然後運行 `npm install` 和 `npm run dev`。

## 🧠 核心架構說明

### 1. `src/lib/learning/toddler-adventure-template.ts`
- 定義 `ToddlerAdventureTemplate` 和 `ToddlerStage` 接口。
- 包含 `toddlerAdventureTemplateData` 常量，詳細描述了「今天的小冒險」5個階段的所有屬性（ID, 標題, 提示語, 家長引導, 視覺提示詞等）。

### 2. `src/lib/learning/learning-engine.ts`
- **`LearningEngine` 類**:
    - 管理學習會話 (`LearningSession`)。
    - 在構造函數中加載並適配 `toddlerAdventureTemplateData` 到內部的 `templates` Map。
    - `startSession`: 初始化「今天的小冒險」會話，將 `currentLevel` 設置為0（代表階段索引）。為幼兒模式初始化 `stageInputs` 以記錄每階段輸入。
    - `processInteraction`:
        - 根據 `templateId` 判斷是否為 `isToddlerMode`。
        - **幼兒模式**:
            - 將 `currentLevel` 解讀為階段索引，推進故事階段。
            - 從 `toddlerAdventureTemplateData.stages` 獲取當前及下一階段的完整資訊 (`ToddlerStage` 對象)。
            - 在 `session.stageInputs` 中記錄用戶對當前階段的輸入。
            - 返回包含 `currentToddlerStage`, `nextToddlerStage`, `isStoryComplete` 等特定於幼兒模板的 `ProcessInteractionResponse`。
            - 舊有的 `evaluateProgress`, `determineSkillsLearned` 等方法在此模式下被繞過或簡化。
        - **其他模式**: (保留原有邏輯，當前MVP主要測試幼兒模式)
        - 調用 `geminiClient` 的 `analyzePrompt` 和 `generateGuidance` 時傳遞 `isToddlerMode` 標誌。

### 3. `src/lib/ai/gemini-client.ts`
- **`GeminiClient` 類**:
    - `generateImage`: 使用 `gemini-1.5-flash-preview-0514` 模型生成圖片。
    - `analyzePrompt`: 接收 `isToddlerMode` 標誌。
        - 若為幼兒模式，使用特製的系統提示詞，分析重點在於輸入是否清晰、是否投入，並提供簡單建議。評分維度（如detail, structure）會做簡化處理。
    - `generateGuidance`: 接收 `isToddlerMode` 標誌。
        - 若為幼兒模式，使用特製的系統提示詞，生成簡短、鼓勵性、與當前幼兒故事階段緊密相關的家長引導語。

### 4. `src/lib/supabase/client.ts`
- 初始化並導出 Supabase 客戶端實例，使用 `NEXT_PUBLIC_SUPABASE_URL` 和 `SUPABASE_SERVICE_ROLE_KEY`。

### 5. `src/types/database.ts`
- 定義 `Story` 和 `StoryStageData` 接口，對應 Supabase 中 `stories` 表的結構，用於儲存完成的故事。

## 🔌 API 路由 (`src/app/api/story/`)

### 1. `POST /api/story/create/route.ts` (已實現 ✅)
- **請求**: `{ userId: string }`
- **處理**:
    - 強制使用 `templateId = 'toddler_adventure'`.
    - 調用 `learningEngine.startSession`。
    - 獲取 `toddlerAdventureTemplateData` 的首個階段資訊。
- **回應**: `{ session: LearningSession, currentStage: ToddlerStage }` (包含首階段的完整資訊)。

### 2. `POST /api/story/interact/route.ts` (已實現 ✅)
- **請求**: `{ sessionId: string, stageId: string, userInput: string | Record<string, any> }`
- **處理**:
    - 調用 `learningEngine.processInteraction`。
    - **圖片生成**: 若當前階段 (e.g., 'character', 'place', 'happy_solution') 配置了 `visualCues`，則調用 `geminiClient.generateImage`。
    - **故事儲存**: 若 `interactionResult.isStoryComplete` 為 `true` 且為幼兒模板：
        - 從 `LearningSession` 中提取 `userId` 和 `stageInputs`。
        - 構建 `Story` 對象，其中 `stages_data` 包含每個階段的ID、標題、用戶輸入及對應的圖片URL（目前為base64）。
        - `final_image_url` 儲存最後生成的圖片（目前為base64）。
        - 數據異步寫入 Supabase `stories` 表。
- **回應**: `ProcessInteractionResponse` 內容，包含 `currentToddlerStage`, `nextToddlerStage`, `isStoryComplete`, `systemResponse`, `imageData` 等。

### 3. `GET /api/story/archive/route.ts` (已實現 ✅)
- **請求**: Query parameter `userId=<user_id>`
- **處理**:
    - 根據 `userId` 從 Supabase `stories` 表查詢故事。
- **回應**: `Story[]` (用戶的故事列表)。

## 🖥️ 前端頁面

### 1. `/story/toddler-adventure/page.tsx` (已實現 ✅ - 基礎)
- 實現「今天的小冒險」的階段式創作流程。
- 調用 `/api/story/create` 開始故事，調用 `/api/story/interact` 推進階段。
- 根據 `currentStage.interactionType` (choice/open_ended) 展示不同輸入方式。
- 展示家長引導 (`parentGuidance`)、兒童提示 (`childPrompt`)、AI生成的圖片和回應。
- 故事完成後顯示總結和重新開始按鈕。

### 2. `/story/archive/page.tsx` (已實現 ✅ - 基礎)
- 調用 `/api/story/archive` 獲取並展示指定用戶已儲存的故事。
- 循環展示每個故事的標題、創建時間、各階段內容及相關圖片。

## 🧪 測試驗證 (初步)
- **手動測試**: 已通過 `curl` 命令對API路由進行了基本的功能驗證。
- **單元測試用例**: 已在先前步驟中為 `LearningEngine` 和 API 路由定義了詳細的測試用例列表 (見相關 subtask report)。這些用例可作為後續編寫自動化測試的基礎。
- **前端手動操作**: 已對 `/story/toddler-adventure` 和 `/story/archive` 頁面進行了基本操作測試，確保流程可以走通。

## 💡 下一步開發建議 (MVP後)
- **UI/UX 優化**: 針對幼兒和家長的操作習慣，進一步打磨界面。
- **實際用戶測試**: 邀請目標用戶群體進行測試，收集反饋。
- **圖片儲存優化**: 將圖片（base64）上傳到 Supabase Storage，數據庫中僅儲存圖片URL。
- **健壯性與錯誤處理**: 完善服務器端和客戶端的錯誤處理機制。
- **用戶認證**: 引入正式的用戶身份驗證系統，取代當前的硬編碼 `userId`。
- **更多模板**: 逐步增加更多不同主題和年齡段的創作模板。
- **自動化測試**: 基於已定義的測試用例，編寫單元測試和集成測試。

---

**MVP「今天的小冒險」核心功能已搭建完成！後續將聚焦於測試、優化和迭代。** 🌟