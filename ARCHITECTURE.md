# 票務防詐聯防網 - 架構文檔

## 🏛️ 整體架構

```
┌─────────────────────────────────────────────────────────────┐
│                     客户端（Client）                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  HTML (index.html)                                           │
│    ↓ 初始化                                                  │
│  main.js (路由 + 协调)                                       │
│    ├─ dashboard.js      (首页)                              │
│    ├─ search.js         (搜索)                              │
│    ├─ case.js           (案件展示)                          │
│    ├─ report.js         (回报表单)                          │
│    └─ profile.js        (个人资料)                          │
│         ↓                                                     │
│  data/api.js (数据层)                                        │
│    ├─ searchCases()                                         │
│    ├─ getCaseDetail()                                       │
│    ├─ reportCase()                                          │
│    ├─ getDashboardStats()                                   │
│    └─ ...                                                    │
│         ↓                                                     │
│  styles/ (样式)                                              │
│    ├─ global.css        (全局 + CSS 变量)                   │
│    └─ components.css    (组件样式)                          │
│                                                               │
└─────────────────────────────────────────────────────────────┘

未来迁移：Vite → Next.js + Supabase
```

---

## 📊 數據模型

### 當前（Mock 数据）

```json
{
  "id": "case_001",
  "seller_id": "@scammer_threads",
  "platform": "Threads",
  "email": "scammer***@gmail.com",
  "wallet": "0x1234...5678",
  "phone": "098***5432",
  "description": "...",
  "status": "high_risk",
  "risk_score": 92,
  "evidence_count": 8,
  "votes": 15,
  "created_at": "2024-06-01T10:30:00Z",
  "updated_at": "2024-06-15T14:22:00Z",
  "tags": ["演唱会", "消失"],
  "related_accounts": [...]
}
```

### 未來（Supabase）

```sql
-- 案件表
CREATE TABLE cases (
    id UUID PRIMARY KEY,
    seller_id TEXT NOT NULL,
    platform TEXT NOT NULL,
    email TEXT,
    wallet TEXT,
    phone TEXT,
    description TEXT,
    status TEXT,
    risk_score INT,
    evidence_count INT,
    votes INT,
    created_by UUID,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- 用户表
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email TEXT UNIQUE,
    reputation INT DEFAULT 100,
    created_at TIMESTAMP
);

-- 证据表
CREATE TABLE evidence (
    id UUID PRIMARY KEY,
    case_id UUID REFERENCES cases,
    user_id UUID REFERENCES users,
    content TEXT,
    file_url TEXT,
    created_at TIMESTAMP
);

-- 投票表
CREATE TABLE votes (
    id UUID PRIMARY KEY,
    case_id UUID REFERENCES cases,
    user_id UUID REFERENCES users,
    vote_type TEXT, -- 'credible', 'not_credible', 'needs_more_evidence'
    created_at TIMESTAMP
);

-- 留言表
CREATE TABLE comments (
    id UUID PRIMARY KEY,
    case_id UUID REFERENCES cases,
    user_id UUID REFERENCES users,
    content TEXT,
    likes INT DEFAULT 0,
    created_at TIMESTAMP
);
```

---

## 🔄 數據流

### 搜索流程

```
用户输入 "scammer@gmail.com"
    ↓
search.js: performSearch()
    ↓
api.js: searchCases(query, filters)
    ↓
过滤 mockCases 数组
    ↓
返回匹配的案件列表
    ↓
search.js: displaySearchResults()
    ↓
渲染 HTML（使用 case.js renderCaseCard()）
    ↓
附加事件监听
    ↓
用户看到结果
```

### 回報流程

```
用户填写表单 → 点击提交
    ↓
report.js: handleFormSubmit()
    ↓
验证表单数据
    ↓
api.js: reportCase(formData)
    ↓
创建新 case 对象，添加到 mockCases
    ↓
返回新案件 ID
    ↓
显示成功消息
    ↓
3秒后清空表单
```

---

## 🎯 核心API

### data/api.js 公开接口

```javascript
// 初始化
initializeData()                    // 加载 mock 数据

// 搜索 & 获取
searchCases(query, filters)        // 搜索案件
getCaseDetail(caseId)              // 获取案件详情
getRelatedCases(sellerId)          // 获取相关案件
getDashboardStats()                // 获取统计数据
getPopularCases(limit)             // 热门案件
getLatestCases(limit)              // 最新案件
getPlatforms()                     // 获取平台列表

// 用户操作
reportCase(formData)               // 提交案件回报
loginUser(credentials)             // 登入
logoutUser()                       // 登出
getCurrentUser()                   // 获取当前用户
```

---

## 🎨 设计系统

### 颜色

```css
/* 品牌色 */
--color-primary: #3b82f6      /* 蓝色 */

/* 风险等级 */
--risk-high: #dc2626           /* 红色 */
--risk-medium: #f59e0b         /* 黄色 */
--risk-low: #10b981            /* 绿色 */

/* 中性色 */
--color-white: #ffffff
--color-bg: #f9fafb            /* 浅灰 */
--color-border: #e5e7eb        /* 边框灰 */
--color-text: #1f2937          /* 深灰 */
```

### 间距系统

```css
--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 16px        /* 默认 */
--spacing-lg: 24px
--spacing-xl: 32px
```

### 圆角

```css
--radius-sm: 8px
--radius-md: 12px         /* 默认 */
--radius-lg: 16px
```

---

## 📱 响应式设计

### 断点

```css
/* 手机 (< 640px) */
/* 默认 */

/* 平板 (640px - 1024px) */
@media (max-width: 768px)

/* 桌机 (> 1024px) */
max-width: 1200px;
```

### 例子

```css
/* 导航栏 */
.navbar-menu {
    display: flex;
    gap: 16px;
}

@media (max-width: 768px) {
    .navbar-menu {
        flex-direction: column;
        gap: 8px;
    }
}
```

---

## 🔐 安全考慮

### 當前（Mock）

- 在客户端处理（仅演示）
- 无真实数据泄露风险

### 遷移到 Supabase 時

```javascript
// ❌ 不要这样做
fetch('/api/cases', {
    body: JSON.stringify({ password: '123456' })
});

// ✅ 这样做
// 使用 Supabase Auth
const { user } = await supabase.auth.signUp({
    email,
    password
});

// 服务器端验证
// 不要在客户端暴露敏感信息
```

### 隱私保護

```javascript
// 遮罩個資
maskEmail('scammer@gmail.com')        // 返回 'sc***@gmail.com'
maskPhone('0987654321')               // 返回 '098***4321'
```

---

## 🧪 測試策略

### 單元測試（api.js）

```javascript
// 测试 searchCases
describe('searchCases', () => {
    test('应该按关键词搜索', () => {
        const results = searchCases('scammer');
        expect(results.length).toBeGreaterThan(0);
    });

    test('应该支持平台筛选', () => {
        const results = searchCases('', { platform: 'Threads' });
        expect(results.every(c => c.platform === 'Threads')).toBe(true);
    });
});
```

### 集成测試（組件）

```javascript
// 测试搜索组件
describe('Search Component', () => {
    test('应该在用户输入后显示结果', () => {
        initSearch();
        document.getElementById('search-input').value = 'test';
        document.getElementById('search-btn').click();
        
        const results = document.getElementById('search-results');
        expect(results.children.length).toBeGreaterThan(0);
    });
});
```

### E2E 測試（Playwright）

```javascript
// 完整流程测试
test('用户可以搜索案件', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.click('[data-tab="search"]');
    await page.fill('#search-input', 'scammer');
    await page.click('#search-btn');
    
    const results = await page.locator('[data-case-id]').count();
    expect(results).toBeGreaterThan(0);
});
```

---

## 📈 性能考慮

### 當前

- 使用 Vite（快速）
- 簡單的 JavaScript（无框架開銷）
- 模块化加載

### 優化建議

1. **代碼分割**

```javascript
// 按需加载组件
import('./components/search.js').then(mod => mod.initSearch());
```

2. **圖片優化**

```html
<!-- 使用 WebP + 后备方案 -->
<picture>
    <source srcset="image.webp" type="image/webp">
    <img src="image.png" alt="">
</picture>
```

3. **缓存策略**

```javascript
// 缓存搜索结果
const cache = new Map();

export function searchCases(query, filters) {
    const key = JSON.stringify({ query, filters });
    if (cache.has(key)) {
        return cache.get(key);
    }
    
    const results = performSearch(query, filters);
    cache.set(key, results);
    return results;
}
```

---

## 🚀 部署

### Vite 当前方案

```bash
# 构建
npm run build

# 输出 → dist/
# 部署到 GitHub Pages、Vercel、Netlify
```

### Next.js 未来方案

```bash
# 构建
npm run build

# 部署到 Vercel（推荐）
vercel deploy
```

---

## 🔮 未來路線圖

### v1.0（當前）

- ✅ 搜索功能
- ✅ 案件詳情
- ✅ 回報表單
- ✅ Mock 數據

### v1.1（下周）

- [ ] 用戶認證（簡單）
- [ ] 留言功能
- [ ] 投票系統

### v2.0（遷移到 Next.js）

- [ ] Supabase 集成
- [ ] 真實用戶系統
- [ ] 信譽機制
- [ ] 實時更新

### v2.5

- [ ] 案件關聯分析
- [ ] AI 輔助驗證
- [ ] 多語言支持

### v3.0

- [ ] 開放 API
- [ ] 瀏覽器擴展
- [ ] 社群機器人

---

## 📚 關鍵文件閱讀順序

對於新開發者，建議按此順序閱讀：

1. `DEVELOPMENT.md`（本文件）← 你在這裡
2. `src/main.js`（應用入口）
3. `src/data/api.js`（數據層）
4. `src/components/dashboard.js`（簡單組件）
5. `src/components/search.js`（複雜組件）
6. `src/styles/components.css`（設計系統）

---

## 💬 討論

有任何架構問題，歡迎提出 Issue 或 PR。
