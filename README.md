# 🛡️ 票務防詐聯防網 (Ticket Anti-Scam Platform)

一個由**社群共同維護**的票務防詐資訊平台，旨在降低演唱會、活動票務交易詐騙。

**核心理念：** 建立**可信度**而非「黑名單」，透過公開透明的驗證與關聯分析建立防護網。

---

## ✨ 核心特色

### 🔍 智能搜尋
- 按賣家 ID、Email、Wallet、電話等多維度搜尋
- 模糊匹配、多關鍵字支持
- 實時篩選（平台、風險等級）

### 📊 風險評分
- 基於案件數、投票、證據動態計算
- 風險分數 0-100（一目瞭然）
- 相關帳號關聯分析

### 👥 社群驗證
- Reddit 風格的留言系統（可回覆、點讚、檢舉）
- 投票機制（可信／不可信／需更多證據）
- 信譽積分系統（高信譽用戶投票權重更高）

### 🔐 隱私優先
- 強制個資遮蔽（Email、電話、銀行帳號）
- 前端提供馬賽克、模糊、黑色遮罩工具
- 避免個資外流

### 📈 詐騙網絡分析
- 建立賣家關聯圖
- 識別專業詐騙團伙
- Scam Intelligence 特色功能

---

## 🚀 快速開始

### 安裝

```bash
# 1. 克隆或下載項目
git clone <repo-url>
cd ticket-anti-scam-platform

# 2. 安裝依賴（僅需 Vite）
npm install

# 3. 啟動開發服務器
npm run dev

# 4. 打開瀏覽器
# http://localhost:5173
```

### 構建生產版本

```bash
npm run build
# 輸出在 dist/ 目錄
```

---

## 📁 項目結構

```
project/
├── index.html                 # 主頁面
├── package.json               # 依賴配置
├── vite.config.js             # Vite 配置
│
├── src/
│   ├── main.js                # 應用入口（路由 + 初始化）
│   ├── data/
│   │   └── api.js             # 數據層（所有邏輯）
│   ├── components/
│   │   ├── dashboard.js       # 首頁儀表盤
│   │   ├── search.js          # 搜尋頁面
│   │   ├── case.js            # 案件展示
│   │   ├── report.js          # 回報表單
│   │   └── profile.js         # 個人資料
│   └── styles/
│       ├── global.css         # 全局樣式 + CSS 變數
│       └── components.css     # 組件樣式 + 設計系統
│
├── data/
│   └── cases.json             # Mock 案件數據
│
├── DEVELOPMENT.md             # 開發指南 ⭐ 必讀
├── ARCHITECTURE.md            # 架構設計文檔
└── QUICK_REFERENCE.md         # 快速參考
```

---

## 🎯 功能映射

| 功能 | 文件 | 狀態 |
|------|------|------|
| 🏠 首頁 Dashboard | `src/components/dashboard.js` | ✅ |
| 🔍 搜尋 | `src/components/search.js` | ✅ |
| 📝 案件詳情 | `src/components/case.js` | ✅ |
| ➕ 回報案件 | `src/components/report.js` | ✅ |
| 👤 個人資料 | `src/components/profile.js` | ✅ |
| 💬 留言 | `src/components/comments.js` | ⏳ |
| 🗳️ 投票 | `src/components/votes.js` | ⏳ |
| 💾 收藏 | `src/components/favorites.js` | ⏳ |

---

## 🏗️ 架構簡介

### 模組化設計

```javascript
// 數據層（api.js）- 可直接遷移到 React/Next.js
export function searchCases(query, filters) { ... }
export function reportCase(formData) { ... }

// UI 層（components/*.js）
export function initSearch() {
    renderSearchUI();
    attachEventListeners();
}
```

**優勢：**
- ✅ 邏輯與 UI 分離
- ✅ 易於測試
- ✅ 遷移到 React 時代碼複用率高（60-70%）

### 技術棧

| 層級 | 技術 | 說明 |
|------|------|------|
| 打包 | Vite | 快速開發體驗 |
| 語言 | JavaScript | 純 JS，無框架 |
| 樣式 | CSS3 + Variables | CSS 變數系統 |
| 數據 | JSON | Mock 數據（準備遷移到 Supabase） |

---

## 📖 文檔

- **[DEVELOPMENT.md](./DEVELOPMENT.md)** ← **從這裡開始！**
  - 完整開發指南
  - 項目結構詳解
  - 開發工作流
  - 常見問題

- **[ARCHITECTURE.md](./ARCHITECTURE.md)**
  - 技術架構設計
  - 數據模型
  - API 詳細說明
  - 遷移規劃

- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)**
  - 常用命令
  - 代碼片段
  - 設計系統速查

---

## 🎨 設計系統

採用現代 SaaS 風格，參考：
- GitHub
- Linear
- Notion
- Discord
- Material Design 3

**特色：**
- 大量留白
- 卡片化設計
- 柔和陰影
- 深色模式支持
- Mobile First 響應式

---

## 🔄 開發流程

### Week 1️⃣: 核心功能

- [x] 搜尋（支持多字段）
- [x] 案件詳情
- [x] 回報表單（疑似/已受害分支）
- [x] 首頁統計

### Week 2️⃣: 社群功能

- [ ] 用戶認證（簡單版）
- [ ] 留言系統
- [ ] 投票機制
- [ ] 信譽積分

### Week 3️⃣: 測試優化

- [ ] 邀請內測用戶
- [ ] 收集反饋
- [ ] 優化 UX
- [ ] 性能調整

### Week 4️⃣+: 升級規劃

- [ ] 遷移到 Next.js
- [ ] 連接 Supabase
- [ ] 真實用戶系統
- [ ] AI 輔助驗證

---

## 🚀 未來路線圖

### v1.0（當前）

基礎搜尋和回報功能

```
搜尋 → 案件詳情 → 回報 → 首頁
```

### v1.1（下週）

社群參與

```
+ 留言 + 投票 + 信譽系統
```

### v2.0（遷移到 Next.js）

```
Vite + Mock → Next.js + Supabase
邏輯複用 70%，UI 改寫 100%
預計 1 週遷移
```

### v3.0+

- 詐騙網絡分析（Scam Graph）
- AI 輔助驗證
- 多語言支持
- 瀏覽器擴展
- API 開放

---

## 🤝 貢獻指南

### 開發者須知

1. **閱讀文檔**
   - 先讀 `DEVELOPMENT.md`
   - 再讀 `ARCHITECTURE.md`
   - 查閱 `QUICK_REFERENCE.md`

2. **代碼規範**
   - 模組化文件
   - 使用 CSS 變數
   - 明確的函數文檔
   - 邏輯與 UI 分離

3. **提交 PR**
   - 描述清楚改動
   - 對應的文檔更新
   - 測試截圖

### 非開發者貢獻

- 回報案件（在應用中使用）
- 提供反饋和建議
- 幫助翻譯（v2.0+）
- 測試和回報 Bug

---

## 🐛 已知限制

### 當前版本（Mock 數據）

- ❌ 無真實用戶認證
- ❌ 數據不持久化
- ❌ 無實時更新
- ❌ 文件上傳不可用

### 升級後修復

遷移到 Next.js + Supabase 時全部解決

---

## 📊 統計

- **文件數**：10+
- **代碼行數**：~2000
- **組件數**：5 (+ 100+ CSS 類)
- **API 函數**：15+
- **CSS 變數**：20+

---

## 🔐 隱私和安全

### 數據保護

- ✅ 強制個資遮蔽
- ✅ 前端工具支持（馬賽克、模糊、遮罩）
- ✅ 禁止發佈真實姓名、完整電話、完整銀行帳號
- ✅ 所有案件都需證據支持

### 後期安全強化

- [ ] HTTPS
- [ ] 速率限制
- [ ] IP 檢測
- [ ] 審計日誌

---

## 📞 聯絡方式

- **Issue 追蹤**：GitHub Issues
- **討論**：GitHub Discussions
- **貢獻**：Pull Requests

---

## 📝 授權

MIT License - 自由使用和修改

---

## 🙏 致謝

感謝所有貢獻者和社群支持。

---

## 🎯 核心願景

**建立一個透明、可信、隱私優先的票務防詐情報平台，降低演唱會票務詐騙，保護交易雙方。**

---

## 🚀 準備好了嗎？

1. **新開發者？**
   → 閱讀 [DEVELOPMENT.md](./DEVELOPMENT.md)

2. **想了解架構？**
   → 查看 [ARCHITECTURE.md](./ARCHITECTURE.md)

3. **需要快速參考？**
   → 使用 [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)

4. **想測試應用？**
   → 執行 `npm run dev`

---

**祝你開發順利！🎉**
