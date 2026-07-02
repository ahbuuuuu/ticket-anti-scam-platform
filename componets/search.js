/**
 * 搜索模块
 * 职责：
 * - 渲染搜索界面
 * - 处理搜索逻辑
 * - 显示搜索结果
 * 
 * 后期迁移到 React：
 * - 改为 SearchPage.jsx + SearchBox.jsx + CaseList.jsx
 * - 逻辑保留在 hooks 或 services 中
 */

import { searchCases, getPlatforms } from '../data/api.js';
import { renderCaseCard } from './case.js';

const SEARCH_CONTAINER = '#search-content';

/**
 * 初始化搜索界面
 */
export function initSearch() {
    renderSearchUI();
    attachSearchEventListeners();
}

/**
 * 渲染搜索界面
 */
function renderSearchUI() {
    const platforms = getPlatforms();
    
    const html = `
        <div class="search-page">
            <div class="card">
                <div class="card-header">
                    <h1 class="card-title">🔍 搜尋詐騙案件</h1>
                </div>
                
                <div class="search-box">
                    <input 
                        type="text" 
                        id="search-input" 
                        class="search-input" 
                        placeholder="搜尋賣家ID、Email、Wallet或電話..."
                    >
                    <button class="btn btn-primary" id="search-btn">搜尋</button>
                </div>

                <div class="search-filters">
                    <button class="filter-tag" data-filter="all" data-value="">全部平台</button>
                    ${platforms.map(p => `
                        <button class="filter-tag" data-filter="platform" data-value="${p}">${p}</button>
                    `).join('')}
                </div>

                <div class="search-filters" style="margin-top: 16px;">
                    <button class="filter-tag" data-filter="risk" data-value="all">全部風險等級</button>
                    <button class="filter-tag" data-filter="risk" data-value="high_risk">🔴 極高風險</button>
                    <button class="filter-tag" data-filter="risk" data-value="medium_risk">🟡 中等風險</button>
                    <button class="filter-tag" data-filter="risk" data-value="low_risk">🟢 低風險</button>
                </div>
            </div>

            <div id="search-results"></div>
        </div>
    `;

    document.querySelector(SEARCH_CONTAINER).innerHTML = html;
}

/**
 * 执行搜索
 */
function performSearch() {
    const query = document.getElementById('search-input')?.value || '';
    
    // 获取当前选择的筛选条件
    const activePlatformFilter = document.querySelector('[data-filter="platform"].active');
    const activeRiskFilter = document.querySelector('[data-filter="risk"].active');
    
    const filters = {};
    if (activePlatformFilter?.dataset.value) {
        filters.platform = activePlatformFilter.dataset.value;
    }
    if (activeRiskFilter?.dataset.value && activeRiskFilter.dataset.value !== 'all') {
        filters.riskLevel = activeRiskFilter.dataset.value;
    }

    // 执行搜索
    const results = searchCases(query, filters);

    // 显示结果
    displaySearchResults(results, query);
}

/**
 * 显示搜索结果
 */
function displaySearchResults(cases, query) {
    const resultsContainer = document.getElementById('search-results');
    
    if (cases.length === 0) {
        resultsContainer.innerHTML = `
            <div class="alert alert-info">
                ${query ? '找不到相符的案件。' : '請輸入搜尋條件。'}
            </div>
        `;
        return;
    }

    const html = `
        <div style="margin-top: 24px;">
            <p style="color: #6b7280; margin-bottom: 16px;">
                找到 <strong>${cases.length}</strong> 個結果
            </p>
            <div style="display: grid; gap: 16px;">
                ${cases.map(caseData => renderCaseCard(caseData)).join('')}
            </div>
        </div>
    `;

    resultsContainer.innerHTML = html;

    // 为每个案件卡片附加事件监听
    cases.forEach(caseData => {
        const cardElement = document.querySelector(`[data-case-id="${caseData.id}"]`);
        if (cardElement) {
            cardElement.addEventListener('click', () => {
                // 导航到案件详情页（简单实现）
                console.log('查看案件详情:', caseData.id);
            });
        }
    });
}

/**
 * 附加事件监听
 */
function attachSearchEventListeners() {
    // 搜索按钮
    document.getElementById('search-btn')?.addEventListener('click', performSearch);
    
    // 回车键搜索
    document.getElementById('search-input')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // 平台筛选
    document.querySelectorAll('[data-filter="platform"]').forEach(btn => {
        btn.addEventListener('click', () => {
            // 移除其他平台的 active 状态
            document.querySelectorAll('[data-filter="platform"]').forEach(b => {
                b.classList.remove('active');
            });
            btn.classList.add('active');
            performSearch();
        });
    });

    // 风险等级筛选
    document.querySelectorAll('[data-filter="risk"]').forEach(btn => {
        btn.addEventListener('click', () => {
            // 移除其他风险等级的 active 状态
            document.querySelectorAll('[data-filter="risk"]').forEach(b => {
                b.classList.remove('active');
            });
            btn.classList.add('active');
            performSearch();
        });
    });

    // "全部平台"重置
    document.querySelector('[data-filter="all"]')?.addEventListener('click', () => {
        document.querySelectorAll('[data-filter="platform"], [data-filter="risk"]').forEach(b => {
            b.classList.remove('active');
        });
        document.getElementById('search-input').value = '';
        displaySearchResults([], '');
    });
}

/**
 * 获取风险等级显示文本
 */
function getRiskLevelText(status) {
    const map = {
        'high_risk': '🔴 極高風險',
        'medium_risk': '🟡 中等風險',
        'low_risk': '🟢 低風險',
        'pending': '⏳ 待驗證'
    };
    return map[status] || '未知';
}
