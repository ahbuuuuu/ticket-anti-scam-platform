# 票務防詐聯防網 - 快速參考

## 🚀 命令

```bash
# 開發
npm run dev        # 啟動開發服務器 (localhost:5173)
npm run build      # 構建生產版本 (dist/)
npm run preview    # 預覽生產構建

# 安裝
npm install        # 安裝依賴
```

---

## 📁 文件快速定位

| 需求 | 文件 | 說明 |
|------|------|------|
| 添加新頁面 | `src/components/*.js` | 創建新模組 |
| 數據邏輯 | `src/data/api.js` | 所有數據函數 |
| 樣式 | `src/styles/*.css` | CSS 變數和組件樣式 |
| HTML 容器 | `index.html` | 主頁面結構 |
| 應用入口 | `src/main.js` | 初始化和路由 |
| Mock 數據 | `data/cases.json` | 案件數據 |

---

## 🔧 常用代碼片段

### 1️⃣ 添加 API 函數

在 `src/data/api.js` 中：

```javascript
/**
 * 功能描述
 * @param {type} param1 - 參數說明
 * @returns {type} 返回值說明
 */
export function myFunction(param1) {
    // 實現邏輯
    return result;
}
```

### 2️⃣ 創建新組件

在 `src/components/mycomponent.js` 中：

```javascript
const CONTAINER = '#my-container-id';

export function initMyComponent() {
    renderUI();
    attachEventListeners();
}

function renderUI() {
    const html = `
        <div class="card">
            <h2>My Component</h2>
        </div>
    `;
    document.querySelector(CONTAINER).innerHTML = html;
}

function attachEventListeners() {
    document.querySelector('button')?.addEventListener('click', () => {
        // 事件處理
    });
}
```

### 3️⃣ 添加新樣式

在 `src/styles/components.css` 中：

```css
.my-component {
    padding: var(--spacing-md);
    background-color: var(--color-white);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
}

@media (max-width: 768px) {
    .my-component {
        padding: var(--spacing-sm);
    }
}
```

### 4️⃣ 使用 CSS 變數

```javascript
// 在 HTML 中
document.querySelector('.element').style.color = 'var(--color-primary)';

// 或直接在 CSS 中
.element {
    color: var(--color-primary);
    padding: var(--spacing-md);
}
```

### 5️⃣ 調用 API 函數

```javascript
import { searchCases, getCaseDetail } from '../data/api.js';

// 搜索案件
const results = searchCases('scammer@gmail.com', {
    platform: 'Threads'
});

// 獲取案件詳情
const detail = getCaseDetail('case_001');
```

### 6️⃣ 模組導入導出

```javascript
// 導出
export function myFunction() { ... }
export const MY_CONSTANT = 100;

// 導入
import { myFunction, MY_CONSTANT } from './module.js';

// 導入整個模組
import * as api from '../data/api.js';
api.searchCases(...);
```

---

## 🎨 設計系統速查

### 顏色

```javascript
/* CSS 變數 */
--color-primary: #3b82f6        // 主色（藍）
--risk-high: #dc2626            // 紅（高風險）
--risk-medium: #f59e0b          // 黃（中風險）
--risk-low: #10b981             // 綠（低風險）
--color-white: #ffffff
--color-bg: #f9fafb
--color-border: #e5e7eb
--color-text: #1f2937
--color-text-secondary: #6b7280
```

### 預定義類名

```html
<!-- 按鈕 -->
<button class="btn btn-primary">主按鈕</button>
<button class="btn btn-secondary">次按鈕</button>
<button class="btn btn-danger">危險按鈕</button>
<button class="btn btn-sm">小按鈕</button>

<!-- 卡片 -->
<div class="card">
    <div class="card-header"><h2 class="card-title">標題</h2></div>
    <div class="card-body">內容</div>
    <div class="card-footer">頁腳</div>
</div>

<!-- 徽章 -->
<span class="badge badge-risk-high">極高風險</span>
<span class="badge badge-platform">Threads</span>

<!-- 警告框 -->
<div class="alert alert-info">信息</div>
<div class="alert alert-warning">警告</div>
<div class="alert alert-danger">危險</div>
<div class="alert alert-success">成功</div>

<!-- 表單 -->
<div class="form-group">
    <label class="form-label">標籤</label>
    <input type="text" class="form-input">
</div>
```

---

## 🧩 數據結構

### 案件對象

```javascript
{
    id: "case_001",
    seller_id: "@scammer_threads",
    platform: "Threads",
    email: "scammer***@gmail.com",
    wallet: "0x1234...5678",
    phone: "098***5432",
    description: "詳細描述",
    status: "high_risk",           // high_risk, medium_risk, low_risk, pending
    risk_score: 92,                // 0-100
    evidence_count: 8,
    votes: 15,
    created_at: "2024-06-01T10:30:00Z",
    updated_at: "2024-06-15T14:22:00Z",
    tags: ["演唱會", "消失"],
    related_accounts: [
        { platform: "Instagram", handle: "@similar_name" }
    ]
}
```

### 用戶對象

```javascript
{
    id: "user_123",
    email: "user@gmail.com",
    reputation: 100,
    createdAt: "2024-01-01T00:00:00Z"
}
```

---

## 🔄 工作流

### 新增功能流程

```
1. 在 src/data/api.js 添加邏輯
   ↓
2. 在 src/components/*.js 中使用
   ↓
3. 在 src/styles/components.css 添加樣式
   ↓
4. 在 index.html 添加 HTML 容器（如需要）
   ↓
5. 在 src/main.js 中註冊初始化函數
   ↓
6. 測試功能
```

### 調試技巧

```javascript
// 在瀏覽器控制台查看數據
console.log('案件數據:', mockCases);

// 查看當前用戶
console.log('當前用戶:', getCurrentUser());

// 測試搜索
console.log('搜索結果:', searchCases('test'));
```

---

## 📱 響應式斷點

```css
/* 手機 < 640px */
@media (max-width: 640px) { ... }

/* 平板 640px - 1024px */
@media (max-width: 768px) { ... }

/* 大屏 > 1024px */
@media (min-width: 1024px) { ... }
```

---

## 🚀 部署檢查清單

- [ ] 所有功能已測試
- [ ] 移動端響應式正常
- [ ] 沒有控制台錯誤
- [ ] 性能可接受（Lighthouse > 90）
- [ ] 隱私：Email、電話已遮罩
- [ ] 使用了 CSS 變數（便於主題切換）
- [ ] 文檔已更新

```bash
npm run build
npm run preview    # 檢查生產構建
```

---

## 🔗 導航菜單添加

在 `index.html` 中：

```html
<button class="nav-btn" data-tab="mypage">📍 我的頁面</button>
```

在 `src/main.js` 中：

```javascript
case 'mypage':
    initMyPage();
    break;
```

---

## 📊 常用查詢

```javascript
// 獲取統計數據
const stats = getDashboardStats();
console.log(`今日新增: ${stats.todaysCases}`);

// 獲取所有平台
const platforms = getPlatforms();
console.log('可用平台:', platforms);

// 搜索特定賣家
const cases = searchCases('scammer_id');

// 獲取高風險案件
const highRisk = searchCases('', { riskLevel: 'high_risk' });
```

---

## 🎯 優先級標記

在代碼中使用：

```javascript
// TODO: 待實現
// FIXME: 需要修復
// HACK: 臨時解決方案
// NOTE: 重要說明
// PERF: 性能優化
```

---

## 📞 需要幫助？

1. 檢查 `DEVELOPMENT.md`（詳細指南）
2. 檢查 `ARCHITECTURE.md`（架構說明）
3. 查看現有代碼示例
4. 提出 Issue 或 PR

祝開發順利！🎉
