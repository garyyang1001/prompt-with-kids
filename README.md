# 🌟 創想小宇宙 - 親子共創內容平台

> AI時代的親子品質時光，用創造力培養未來的創新者

## 📖 專案理念

**不是教孩子技術，而是讓AI成為創意夥伴**

在數位時代，我們相信最重要的不是讓孩子學會使用AI工具，而是幫助他們在AI輔助下保持創造力和批判思考能力。創想小宇宙專注於打造真正有意義的親子共創體驗，MVP階段特別關注3-6歲幼兒的早期創造力啟蒙。

## 🎯 MVP驗證目標 (3個月)

### 核心驗證假設
- 家長願意為「高品質親子時光」付費
- 3-6歲孩子能在家長協助下持續參與15-20分鐘的協作創作
- AI輔助下的共創能激發幼兒的語言表達和想像力

### 成功指標
- 50個核心家庭深度使用
- 平均每家庭每週使用2次以上
- 親子共同參與率85%以上 (家長引導，孩子選擇與表達)
- 家長滿意度4.5/5以上

## 🛠️ 技術架構

### 核心功能 (MVP)
- ✅ 1個創作模板：「今天的小冒險」 (專為3-6歲幼兒設計)
- ✅ AI對話引導，針對幼兒和家長互動進行優化 (Google Gemini)
- ✅ 故事流程中整合圖片生成 (Google Gemini - `gemini-1.5-flash-preview-0514`)
- ✅ 家庭檔案功能：儲存和展示完成的故事 (Supabase)

### 技術棧
- **前端**: Next.js 14 + TypeScript + Tailwind CSS
- **AI服務 (文字與引導)**: Google Gemini (e.g., `gemini-2.0-flash-001` or similar for text)
- **AI服務 (圖片生成)**: Google Gemini (`gemini-1.5-flash-preview-0514`)
- **數據存儲**: Supabase
- **部署**: Vercel

## 🚀 快速開始

### 環境設置
```bash
# 克隆專案
git clone https://github.com/garyyang1001/prompt-with-kids.git
cd prompt-with-kids

# 安裝依賴
npm install

# 設置環境變數
cp .env.example .env.local
# 根據 .env.example 填入 GEMINI_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY 等

# 啟動開發服務器
npm run dev
```

### 環境變數配置
(.env.example)
```env
# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# 應用程式配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
# ... (其他變數參考 .env.example)
```
(移除了 OPENAI_API_KEY，因為MVP使用Gemini進行圖片生成)

## 📁 專案結構

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # 全局佈局
│   ├── page.tsx            # 首頁
│   ├── story/              # 故事創作與展示相關頁面
│   │   ├── toddler-adventure/page.tsx # 「今天的小冒險」創作頁面
│   │   └── archive/page.tsx           # 已儲存故事展示頁面
│   └── api/                # API 路由
│       └── story/
│           ├── create/route.ts     # 開始新故事 Session API
│           ├── interact/route.ts   # 處理故事互動 & 保存 API
│           └── archive/route.ts    # 讀取已儲存故事 API
├── components/             # React 組件
│   ├── ui/                 # 基礎UI組件
│   ├── learning/           # 學習與創作相關組件 (e.g., VoiceChat, LearningProgress)
├── lib/                    # 核心邏輯
│   ├── ai/
│   │   └── gemini-client.ts    # Gemini API 封裝 (文字、圖片、分析、引導)
│   ├── learning/
│   │   ├── learning-engine.ts    # 學習/故事流程引擎
│   │   └── toddler-adventure-template.ts # 「今天的小冒險」模板定義
│   ├── supabase/
│   │   └── client.ts           # Supabase 客戶端初始化
└── types/                  # TypeScript 類型定義
    └── database.ts           # Supabase 表結構類型 (手動或生成)
```

## 🎭 核心功能設計

### 「今天的小冒險」創作流程 (5階段)

專為3-6歲幼兒設計，強調家長引導、孩子參與的互動模式：

1.  **選擇朋友 (角色創建)** - 孩子選擇故事的主角 (例如：小兔子、小熊)。家長引導孩子描述主角的特點。
2.  **要去哪裡玩 (地點設定)** - 孩子選擇故事發生的地點 (例如：公園、沙灘)。家長幫助孩子想像該地點的環境。
3.  **想做什麼 (活動設計)** - 孩子描述主角在該地點進行的活動 (例如：堆沙堡、盪鞦韆)。家長鼓勵孩子發揮創意。
4.  **小小困難 (問題出現)** - 故事中出現一個簡單的小挑戰 (例如：找不到玩具、突然下雨)。家長引導孩子思考問題。
5.  **開心解決 (解決方案)** - 孩子想出或在家長提示下找到解決方法，故事圓滿結束。家長給予肯定。

AI在流程中提供：
-   **家長引導建議**: 根據當前階段和孩子輸入，給予家長提示，輔助親子互動。
-   **圖像生成**: 在關鍵階段（如角色確認、場景設定、快樂結局）生成符合情境的圖片，增強故事的趣味性和視覺效果。

### 雙人協作界面 (概念)
- **孩子主要互動區**: 透過簡單選擇（按鈕）、少量語音/文字輸入來表達想法。
- **家長輔助區**: 查看AI提供的引導建議、教育目標，並口頭引導孩子。
- **故事進展展示**: 即時顯示已選擇的內容、生成的圖片，讓親子共同見證故事的誕生。

## 📊 開發進度 (MVP - 「今天的小冒險」)

### 階段一：核心引擎與模板 (已完成 ✅)
- [x] **項目重構和清理**: 調整專案結構以適應新需求。
- [x] **「今天的小冒險」模板設計**: 詳細定義5個階段的互動流程、提示語、教育目標 (`toddler-adventure-template.ts`)。
- [x] **學習引擎 (`LearningEngine`) 改造**:
    - [x] 支援新模板的階段式進程管理。
    - [x] 初始化幼兒故事Session (`currentLevel`作為stage index)。
    - [x] 處理幼兒故事互動，記錄各階段用戶輸入 (`stageInputs`)。
- [x] **Gemini API 整合 (`gemini-client.ts`)**:
    - [x] 實現文字生成、圖片生成 (`gemini-1.5-flash-preview-0514`)。
    - [x] 實現 `analyzePrompt` 和 `generateGuidance` 方法，並針對幼兒模式 (`isToddlerMode`) 定制化提示與回應。

### 階段二：後端與數據存儲 (已完成 ✅)
- [x] **Supabase 數據庫設置**:
    - [x] 初始化Supabase客戶端 (`supabase/client.ts`)。
    - [x] 定義故事儲存的表結構 (`Story`, `StoryStageData` in `types/database.ts`)。
- [x] **核心API路由 (`/api/story/*`)**:
    - [x] `POST /api/story/create`: 開始新的「今天的小冒險」故事，返回Session及首階段資訊。
    - [x] `POST /api/story/interact`: 處理每階段互動，返回AI引導、圖片(如果生成)、下一階段資訊；故事完成時自動儲存至Supabase。
    - [x] `GET /api/story/archive`: 根據 `userId` 讀取已儲存的故事列表。

### 階段三：前端用戶界面 (已完成 ✅ - 基礎功能)
- [x] **「今天的小冒險」創作頁面 (`/story/toddler-adventure`)**:
    - [x] 實現階段式故事創作界面。
    - [x] 根據當前階段顯示提示語、家長引導。
    - [x] 支援選擇題和簡單文字輸入。
    - [x] 展示AI生成的圖片和引導。
    - [x] 處理故事完成狀態。
- [x] **已儲存故事展示頁面 (`/story/archive`)**:
    - [x] 列表展示用戶已儲存的故事。
    - [x] 顯示故事標題、創建時間、各階段內容及圖片。

### 下一步/待優化 (MVP後)
- [ ] 更精細的UI/UX設計與優化。
- [ ] 實際幼兒與家長測試，並根據反饋迭代。
- [ ] 圖片上傳至Supabase Storage，而非直接儲存base64。
- [ ] 錯誤處理與系統穩定性加強。
- [ ] 用戶身份驗證與管理。
- [ ] 更多創作模板。

## 👥 參與貢獻

目前處於 MVP 驗證階段，如果你是：
- 👨‍👩‍👧‍👦 想參與測試的家長
- 👩‍🏫 對創新教育感興趣的教育工作者
- 💻 希望貢獻代碼的開發者

歡迎聯繫我們！

## 📞 聯繫方式

- **GitHub**: [@garyyang1001](https://github.com/garyyang1001)
- **Email**: [聯繫郵箱]
- **專案討論**: GitHub Issues

## 📄 授權

MIT License - 詳見 [LICENSE](LICENSE) 文件

---

**讓每個家庭都能在數位時代保持真摯的親子連結，用創造力對抗同質化，用想像力培育未來的創新者。**

⭐ 如果這個專案對你有幫助，請給我們一個 Star！