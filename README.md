# 🎨 AI親子創作坊 - Prompt Engineering學習平台

> 讓家長與孩子在創作中自然掌握AI溝通技巧

## 🎯 專案願景

不是教技術，而是創造自然掌握AI溝通技巧的學習體驗。在AI時代，prompt thinking將成為如同讀寫能力一樣的基礎技能。

## ✨ 核心特色

- 🧠 **四級學習進程**：從無意識參與到創意突破
- 👨‍👩‍👧‍👦 **親子共學體驗**：在創作過程中增進親子關係
- 🎪 **自然學習法**：在遊戲中掌握複雜的AI溝通技能
- 🚀 **未來技能培養**：為AI時代做好準備
- 🎤 **語音互動**：支援中文語音輸入與AI回應
- 📊 **智能分析**：即時評估描述品質並提供改進建議

## 📚 學習模板

### 🥛 我的一天 (基礎級) - ✅ 已實現
- **學習目標**：具體化描述、環境感知、情感表達
- **情境包含**：早晨起床、吃早餐、快樂玩耍、晚安時光
- **核心技能**：基礎形容詞使用、感官細節描述

### 🦄 夢想冒險 (進階級) - 🔄 開發中
- **學習目標**：角色設定、情節發展、衝突解決  
- **預計推出**：第二階段

### 🐻 動物朋友 (創意級) - 🔄 規劃中
- **學習目標**：互動關係、創意想像、複雜場景構建
- **預計推出**：第三階段

## 🛠 技術架構

- **前端**: Next.js 14 + TypeScript + Tailwind CSS
- **AI服務**: Google Gemini 2.5 Pro Preview
- **語音功能**: Web Speech API (語音識別與合成)
- **狀態管理**: Zustand
- **UI組件**: Headless UI + Lucide React
- **部署**: Vercel

## 🌟 功能亮點

### 🎤 語音互動系統
- 中文語音識別 (支援繁體中文)
- AI回應語音播放
- 實時語音轉文字
- 瀏覽器兼容性檢測

### 🧠 智能學習引擎
- **四級進度系統**：
  - Level 1：無意識參與 (基礎描述)
  - Level 2：引導式發現 (環境感知)  
  - Level 3：主動應用 (情感表達)
  - Level 4：創意突破 (創意整合)

### 📊 即時分析回饋
- **多維度評分**：清晰度、細節、情感、結構、視覺
- **個人化建議**：根據當前等級提供改進方向
- **技能追蹤**：記錄已掌握與待學習技能
- **進度可視化**：動態進度條與成就系統

### 🎯 場景化學習
- **情境導向**：每個模板包含多個學習場景
- **循序漸進**：從簡單到複雂的描述練習
- **即時回饋**：AI助手提供溫暖鼓勵性引導

## 🚀 快速開始

### 環境準備

```bash
# 克隆專案
git clone https://github.com/garyyang1001/prompt-with-kids.git
cd prompt-with-kids

# 安裝依賴
npm install
```

### 環境變數設置

```bash
# 複製環境變數範例
cp .env.example .env.local

# 編輯 .env.local 加入你的 API 金鑰
GEMINI_API_KEY=your_gemini_api_key_here
```

### 啟動開發服務器

```bash
npm run dev
```

開啟瀏覽器訪問 [http://localhost:3000](http://localhost:3000)

## 📖 使用指南

### 開始學習

1. **選擇模板**：從首頁選擇「我的一天」模板
2. **語音互動**：點擊麥克風按鈕，說出你對情境的描述
3. **獲得回饋**：AI助手會分析你的描述並提供引導
4. **查看分析**：檢視五個維度的評分和改進建議
5. **進入下一關**：完成當前情境後，進入下一個場景

### 語音功能使用

- **支援瀏覽器**：Chrome、Edge、Safari
- **麥克風權限**：首次使用需授權麥克風訪問
- **語音播放**：點擊播放按鈕聽取AI回應
- **文字輸入**：不支援語音的環境下可直接輸入文字

### 學習進度追蹤

- **等級系統**：4個學習等級，逐步提升
- **技能解鎖**：完成特定任務解鎖新技能
- **進度指標**：實時顯示當前等級完成度
- **成就系統**：獲得學習里程碑獎勵

## 🔧 開發指南

### 專案結構

```
src/
├── app/                          # Next.js App Router
│   ├── learn/                    # 學習頁面
│   ├── globals.css              # 全局樣式
│   └── page.tsx                 # 首頁
├── components/                   # React組件
│   └── learning/                # 學習相關組件
│       ├── VoiceChat.tsx        # 語音聊天
│       └── LearningProgress.tsx # 學習進度
├── lib/                         # 核心業務邏輯
│   ├── ai/                      # AI相關服務
│   │   └── gemini-client.ts     # Gemini API客戶端
│   ├── learning/                # 學習系統
│   │   └── learning-engine.ts   # 學習引擎
│   └── utils/                   # 工具函數
├── types/                       # TypeScript類型
│   ├── ai.ts                    # AI相關類型
│   └── learning.ts              # 學習相關類型
```

### 核心組件說明

#### VoiceChat 語音聊天組件
- 語音識別功能
- 即時轉錄顯示
- 瀏覽器兼容性檢測
- 語音播放控制

#### LearningProgress 學習進度組件  
- 四級進度顯示
- 技能追蹤
- 動態進度條
- 鼓勵性回饋

#### LearningEngine 學習引擎
- 會話管理
- 進度評估
- 技能判定
- 等級升級邏輯

### API 整合

#### Gemini API 配置
```typescript
// 使用新的 @google/genai 套件
import { GoogleGenAI } from '@google/genai';

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// 支援的模型
const model = 'gemini-2.5-pro-preview-05-06';
```

#### 語音 API 使用
```typescript
// 語音識別
const recognition = new webkitSpeechRecognition();
recognition.lang = 'zh-TW';

// 語音合成
const synthesis = window.speechSynthesis;
const utterance = new SpeechSynthesisUtterance(text);
utterance.lang = 'zh-TW';
```

## 📋 開發里程碑

### ✅ Phase 1: 核心功能實現 (已完成)
- [x] Next.js + TypeScript 基礎架構
- [x] Gemini API 整合
- [x] 語音輸入輸出功能
- [x] 四級學習引擎
- [x] "我的一天"模板完整實現
- [x] 學習進度追蹤系統
- [x] UI/UX 設計實現

### 🔄 Phase 2: 功能擴展 (進行中)
- [ ] 第二、三個學習模板
- [ ] 用戶系統與資料持久化
- [ ] 學習報告與分析
- [ ] 家長儀表板

### 🔄 Phase 3: 產品化 (規劃中)  
- [ ] 付費功能與會員系統
- [ ] 社群分享功能
- [ ] 多語言支援
- [ ] 行動端優化

### 🔄 Phase 4: 生態建設 (未來)
- [ ] 教師後台管理
- [ ] 客製化模板編輯器
- [ ] API 開放平台
- [ ] 國際化推廣

## 🤝 貢獻指南

我們歡迎社群貢獻！請遵循以下步驟：

1. Fork 此專案
2. 創建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 開啟 Pull Request

### 開發規範

- **代碼風格**：使用 ESLint + Prettier
- **提交訊息**：使用conventional commits格式
- **測試要求**：新功能需包含測試
- **文檔更新**：重要變更需更新README

## 📄 授權條款

本專案採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 文件

## 🙏 致謝

- [Google Gemini](https://deepmind.google/technologies/gemini/) - 強大的AI語言模型
- [Next.js](https://nextjs.org/) - 優秀的React框架
- [Tailwind CSS](https://tailwindcss.com/) - 實用的CSS框架
- [Lucide](https://lucide.dev/) - 美觀的圖標庫

## 📞 聯絡我們

- **專案地址**：https://github.com/garyyang1001/prompt-with-kids
- **問題回報**：[Issues](https://github.com/garyyang1001/prompt-with-kids/issues)
- **功能建議**：[Discussions](https://github.com/garyyang1001/prompt-with-kids/discussions)

---

**讓我們一起為孩子的AI未來做準備！** 🌟

## 🔄 最新更新

### v0.2.0 (2025-06-02)
- ✨ 完整實現四級學習流程引擎
- 🎤 整合語音輸入輸出功能
- 📊 新增即時prompt分析與回饋系統
- 🎨 全新UI設計與用戶體驗
- 🧠 Gemini 2.5 Pro API深度整合
- 📱 響應式設計，支援多設備

### v0.1.0 (初始版本)
- 🏗️ 基礎專案架構建立
- 🎯 核心概念與設計確立
- 📝 技術架構文檔完成
