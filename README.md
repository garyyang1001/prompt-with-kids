# 🌟 創想小宇宙 - 親子共創內容平台

> AI時代的親子品質時光，用創造力培養未來的創新者

## 📖 專案理念

**不是教孩子技術，而是讓AI成為創意夥伴**

在數位時代，我們相信最重要的不是讓孩子學會使用AI工具，而是幫助他們在AI輔助下保持創造力和批判思考能力。創想小宇宙專注於打造真正有意義的親子共創體驗。

## 🎯 MVP驗證目標 (3個月)

### 核心驗證假設
- 家長願意為「高品質親子時光」付費
- 6-12歲孩子能持續參與30分鐘協作創作
- 雙人協作比單人創作產生更好的教育效果

### 成功指標
- 50個核心家庭深度使用
- 平均每家庭每週使用2次以上
- 親子共同參與率85%以上
- 家長滿意度4.5/5以上

## 🛠️ 技術架構

### 核心功能 (MVP)
- ✅ 1個創作模板：「今天的冒險故事」
- ✅ 基礎AI對話引導 (Google Gemini)
- ✅ 簡單的圖文輸出 (DALL-E 3)
- ✅ 家庭檔案功能 (Supabase)

### 技術棧
- **前端**: Next.js 14 + TypeScript + Tailwind CSS
- **AI服務**: Google Gemini 2.5 Pro
- **圖片生成**: OpenAI DALL-E 3
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
# 填入 GEMINI_API_KEY, OPENAI_API_KEY, SUPABASE_URL 等

# 啟動開發服務器
npm run dev
```

### 環境變數配置
```env
# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key

# OpenAI API (for image generation)
OPENAI_API_KEY=your_openai_api_key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📁 專案結構

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # 全局佈局
│   ├── page.tsx            # 首頁
│   ├── create/             # 創作流程
│   ├── family/             # 家庭檔案
│   └── api/                # API 路由
├── components/             # React 組件
│   ├── ui/                 # 基礎UI組件
│   ├── creative/           # 創作相關組件
│   └── family/             # 家庭相關組件
├── lib/                    # 核心邏輯
│   ├── gemini-client.ts    # Gemini API封裝
│   ├── story-engine.ts     # 故事生成引擎
│   └── supabase.ts         # 數據庫連接
└── types/                  # TypeScript 類型定義
```

## 🎭 核心功能設計

### 「今天的冒險故事」創作流程

1. **角色創建** - 親子共同設計主角
2. **起點設定** - 決定冒險的開始
3. **冒險目標** - 要完成什麼任務？
4. **遇到困難** - 路上有什麼挑戰？
5. **解決方案** - 如何克服困難？
6. **意外驚喜** - 有什麼意外收穫？
7. **圓滿結局** - 故事如何結束？

### 雙人協作界面
- **孩子創作區**: 發想創意、選擇方向
- **家長引導區**: 提供引導、教育引申
- **共同決策區**: 親子一起確認故事發展

## 📊 開發進度

### Week 1-2: 基礎架構 ⏳
- [x] 項目重構和清理
- [ ] Supabase 數據庫設置
- [ ] Gemini API 整合
- [ ] 基礎 UI 組件

### Week 3-4: 核心功能 📋
- [ ] 冒險故事模板
- [ ] 親子協作界面
- [ ] AI 對話流程
- [ ] 圖片生成功能

### Week 5-6: 完整流程 📋
- [ ] 端到端創作流程
- [ ] 家庭檔案功能
- [ ] 作品展示頁面
- [ ] 基礎數據追蹤

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