# 票務防詐聯防網 - 開發指南

## 🚀 快速開始

### 安裝

```bash
# 1. 進入項目目錄
cd ticket-anti-scam-platform

# 2. 安裝依賴（只需要 Vite）
npm install

# 3. 啟動開發服務器
npm run dev

# 4. 打開瀏覽器訪問
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
├── index.html                 # 主頁面（容器）
├── package.json               # 依賴配置
├── vite.config.js             # Vite 配置
│
├── src/
│   ├── main.js                # 應用入口（初始化 + 路由）
│   │
│   ├── data/
│   │   └── api.js             # 數據層（搜索、獲取、提交邏輯）
│   │                           # 重要：這層邏輯可直接遷移到 React
│   │
│   ├── components/
│   │   ├── dashboard.js       # 首頁儀表盤
│   │   ├── search.js          # 搜索頁面
│   │   ├── case.js            # 案件卡片和詳情
│   │   ├── report.js          # 回報表單
│   │   └── profile.js         # 個人資料頁
│   │
│   └── styles/
│       ├── global.css         # 全局樣式 + CSS 變數
│       └── components.css     # 組件樣式 + 設計系統
│
└── data/
    └── cases.json             # Mock 數據
```

---

## 🏗️ 架構說明

### 模組化設計

每個功能都是獨立的模組：

```javascript
// 例：搜索模組
// src/components/search.js

import { searchCases } from '../data/api.js';

export function initSearch() {
    renderSearchUI();
    attachSearchEventListeners();
}

function renderSearchUI() {
    // 生成 HTML
}

function attachSearchEventListeners() {
    // 附加事件監聽
}
```

**關鍵特點：**
- ✅ 每個頁面/功能是獨立的 `.js` 文件
- ✅ 邏輯與 UI 分離（`api.js` 中的邏輯可複用）
- ✅ HTML 由 JavaScript 生成（易於后期轉換為 React）
- ✅ 事件監聽明確標記

---

### 數據流

```
user input
    ↓
components/search.js
    ↓
data/api.js (searchCases)
    ↓
render results
    ↓
attach event listeners
```

**重點：數據層（api.js）完全獨立**

```javascript
// api.js 中的函數可直接用於 React
export function searchCases(query, filters) {
    // 純邏輯，不涉及 DOM
    return results;
}

// 在 React 中：
// const results = searchCases(query, filters);
```

---

## 🎨 設計系統

### CSS 變數

所有樣式都使用 CSS 變數，易於主題切換：

```css
/* global.css 中定義 */
:root {
    --color-primary: #3b82f6;
    --color-text: #1f2937;
    --spacing-md: 16px;
}

/* 組件中使用 */
.card {
    padding: var(--spacing-md);
    color: var(--color-text);
}
```

### 組件樣式

```css
/* components.css 中預定義 */
.btn           /* 按鈕 */
.card          /* 卡片 */
.badge         /* 徽章 */
.alert         /* 提示框 */
.form-*        /* 表單組件 */
.case-*        /* 案件相關 */
.timeline      /* 時間線 */
.comment       /* 評論 */
```

---

## 📝 開發工作流

### 添加新功能

**例：添加「收藏案件」功能**

1. **在 `api.js` 中添加邏輯：**

```javascript
// src/data/api.js

export function favoriteCase(caseId) {
    // 實現邏輯
}

export function getFavoriteCases() {
    // 獲取收藏列表
}
```

2. **在組件中使用：**

```javascript
// src/components/case.js

import { favoriteCase } from '../data/api.js';

function attachCaseEventListeners() {
    document.querySelectorAll('.case-favorite-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const caseId = btn.dataset.caseId;
            favoriteCase(caseId);
        });
    });
}
```

3. **更新樣式（如需要）：**

```css
/* src/styles/components.css */

.btn-favorite {
    /* 樣式 */
}
```

**重點：邏輯、UI、樣式分離**

---

## 🔄 後期遷移到 Next.js

### 遷移路徑

**第 1 步：複用 API 層（1 小時）**

```javascript
// api.js 可以直接複用到 Next.js
// src/data/api.js → lib/api.ts

export async function searchCases(query, filters) {
    // 邏輯保留 80%
    // 只需改成 async + 調用 Supabase
}
```

**第 2 步：轉換組件（1-2 天）**

```javascript
// components/search.js → app/search/page.jsx

import { searchCases } from '@/lib/api';
import SearchBox from '@/components/SearchBox';
import CaseList from '@/components/CaseList';

export default function SearchPage() {
    const [results, setResults] = useState([]);

    async function handleSearch(query) {
        const results = await searchCases(query);
        setResults(results);
    }

    return (
        <div>
            <SearchBox onSearch={handleSearch} />
            <CaseList cases={results} />
        </div>
    );
}
```

**第 3 步：連接 Supabase（2-3 天）**

```javascript
// src/data/api.js 改成調用 Supabase
import { supabase } from '@/lib/supabase';

export async function searchCases(query, filters) {
    const { data } = await supabase
        .from('cases')
        .select()
        .ilike('seller_id', `%${query}%`);
    
    return data;
}
```

**總遷移時間：1 週**

---

## 🧪 測試清單

開發時檢查以下項目：

- [ ] 搜索功能：按 Seller ID、Email、Wallet 搜索
- [ ] 搜索結果：正確顯示和篩選
- [ ] 案件詳情：風險分數、時間線、相關案件
- [ ] 回報表單：疑似/已受害 分支邏輯
- [ ] 文件上傳：拖拽和點擊上傳
- [ ] 個人資料：登入/登出
- [ ] 導航：標籤頁切換流暢
- [ ] 響應式：手機 / 平板 / 桌機

---

## 🐛 常見問題

### Q: 為什麼不直接用 React？

A: 方案 A+ 的優勢：
- 更快看到原型（1-2 週 vs 3-4 週）
- 學習曲線低
- 可以邊開發邊驗證產品假設
- 遷移成本可接受（1 週）

### Q: 如何添加新頁面？

A: 
1. 在 `src/components/` 中創建新文件（如 `newpage.js`）
2. 實現 `initNewPage()` 函數
3. 在 `index.html` 中添加新的 `<section>`
4. 在 `main.js` 中註冊新頁面
5. 在導航中添加按鈕

### Q: 如何連接真實後端？

A: 替換 `api.js` 中的 Mock 實現：

```javascript
// 原：
export function searchCases(query) {
    return mockCases.filter(...);
}

// 改為：
export async function searchCases(query) {
    const response = await fetch(`/api/search?q=${query}`);
    return await response.json();
}
```

---

## 📚 參考資源

- **Vite 文檔**：https://vitejs.dev
- **CSS 變數**：https://developer.mozilla.org/docs/Web/CSS/--*
- **JavaScript 模組**：https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules

---

## 📋 下一步

1. **本週（Week 1）**
   - [ ] 搜索功能完善
   - [ ] 案件詳情頁實現
   - [ ] 基本回報表單

2. **第二週（Week 2）**
   - [ ] 用戶認證簡單實現
   - [ ] 留言功能
   - [ ] 投票系統

3. **第三週開始**
   - [ ] 邀請內測用戶
   - [ ] 收集反馈
   - [ ] 規劃升級到 Next.js

---

## 💡 最佳實踐

1. **保持 API 層純淨**
   - 邏輯與 DOM 操作分離
   - 便於測試和遷移

2. **使用設計系統**
   - 統一的樣式變數
   - 預定義的組件類

3. **模組化文件**
   - 每個頁面獨立檔案
   - 清晰的命名規範

4. **文檔先行**
   - 在開發前寫 README
   - 記錄架構決策

---

祝開發順利！有任何問題，歡迎反饋。
