/**
 * 仪表盘模块
 * 职责：
 * - 显示统计数据
 * - 显示热门案件
 * - 显示最新案件
 * - 显示平台概览
 */

import { getDashboardStats, getPopularCases, getLatestCases } from '../data/api.js';
import { renderCaseCard } from './case.js';

const DASHBOARD_CONTAINER = '#dashboard-content';

/**
 * 初始化仪表盘
 */
export function initDashboard() {
    renderDashboard();
}

/**
 * 渲染仪表盘
 */
function renderDashboard() {
    const stats = getDashboardStats();
    const popularCases = getPopularCases(3);
    const latestCases = getLatestCases(3);

    const html = `
        <div class="dashboard">
            <!-- Header -->
            <div style="margin-bottom: 32px;">
                <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 8px;">
                    🛡️ 歡迎使用票務防詐平台
                </h1>
                <p style="color: #6b7280; font-size: 16px;">
                    由社群共同維護的演唱會票務詐騙情報交換平台
                </p>
            </div>

            <!-- 統計卡片 -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 32px;">
                <!-- 總案件數 -->
                <div class="card" style="text-align: center;">
                    <p style="color: #6b7280; font-size: 12px; margin-bottom: 8px; text-transform: uppercase;">總案件數</p>
                    <p style="font-size: 40px; font-weight: 700; color: #3b82f6;">${stats.totalCases}</p>
                    <p style="color: #6b7280; font-size: 12px; margin-top: 8px;">已建檔案件</p>
                </div>

                <!-- 今日新增 -->
                <div class="card" style="text-align: center;">
                    <p style="color: #6b7280; font-size: 12px; margin-bottom: 8px; text-transform: uppercase;">今日新增</p>
                    <p style="font-size: 40px; font-weight: 700; color: #f59e0b;">${stats.todaysCases}</p>
                    <p style="color: #6b7280; font-size: 12px; margin-top: 8px;">過去 24 小時</p>
                </div>

                <!-- 極高風險 -->
                <div class="card" style="text-align: center;">
                    <p style="color: #6b7280; font-size: 12px; margin-bottom: 8px; text-transform: uppercase;">極高風險</p>
                    <p style="font-size: 40px; font-weight: 700; color: #ef4444;">${stats.highRiskCases}</p>
                    <p style="color: #6b7280; font-size: 12px; margin-top: 8px;">風險評分 > 80</p>
                </div>

                <!-- 待驗證 -->
                <div class="card" style="text-align: center;">
                    <p style="color: #6b7280; font-size: 12px; margin-bottom: 8px; text-transform: uppercase;">待驗證</p>
                    <p style="font-size: 40px; font-weight: 700; color: #6b7280;">${stats.awaitingVerification}</p>
                    <p style="color: #6b7280; font-size: 12px; margin-top: 8px;">需要社群驗證</p>
                </div>
            </div>

            <!-- 公告 -->
            <div class="alert alert-info" style="margin-bottom: 32px;">
                <strong>📢 平台公告</strong>
                <p style="margin-top: 8px; font-size: 14px;">
                    本平台致力於建立一個透明、可信的票務詐騙情報交換平台。所有案件資訊由社群共同驗證，請勿濫用平台進行不實指控。
                </p>
            </div>

            <!-- 熱門案件 -->
            <div style="margin-bottom: 32px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <h2 style="font-size: 20px; font-weight: 600;">🔥 熱門案件</h2>
                    <a href="#search" style="color: #3b82f6; text-decoration: none; font-size: 14px;">查看全部 →</a>
                </div>
                
                ${popularCases.length > 0 ? `
                    <div style="display: grid; gap: 16px;">
                        ${popularCases.map(caseData => renderCaseCard(caseData)).join('')}
                    </div>
                ` : `
                    <div class="alert alert-info">暫無案件</div>
                `}
            </div>

            <!-- 最新案件 -->
            <div style="margin-bottom: 32px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <h2 style="font-size: 20px; font-weight: 600;">📝 最新案件</h2>
                    <a href="#search" style="color: #3b82f6; text-decoration: none; font-size: 14px;">查看全部 →</a>
                </div>
                
                ${latestCases.length > 0 ? `
                    <div style="display: grid; gap: 16px;">
                        ${latestCases.map(caseData => renderCaseCard(caseData)).join('')}
                    </div>
                ` : `
                    <div class="alert alert-info">暫無案件</div>
                `}
            </div>

            <!-- 如何使用 -->
            <div class="card" style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(99, 102, 241, 0.1));">
                <h3 class="card-title" style="margin-bottom: 16px;">❓ 如何使用</h3>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px;">
                    <div>
                        <h4 style="font-weight: 600; margin-bottom: 8px;">🔍 查詢案件</h4>
                        <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">
                            使用賣家 ID、Email、Wallet 或其他標識搜尋相關詐騙案件，快速了解風險。
                        </p>
                    </div>
                    
                    <div>
                        <h4 style="font-weight: 600; margin-bottom: 8px;">➕ 回報案件</h4>
                        <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">
                            遭遇詐騙？分享你的經驗。提供詳細資訊和證據能幫助更多人避免被騙。
                        </p>
                    </div>
                    
                    <div>
                        <h4 style="font-weight: 600; margin-bottom: 8px;">🗳️ 社群驗證</h4>
                        <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">
                            透過投票和留言幫助驗證案件真偽，建立透明的可信度機制。
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.querySelector(DASHBOARD_CONTAINER).innerHTML = html;

    // 附加事件監聽
    attachDashboardEventListeners();
}

/**
 * 附加事件监听
 */
function attachDashboardEventListeners() {
    // 點擊案件卡片導航到詳情
    document.querySelectorAll('[data-case-id]').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            const caseId = card.dataset.caseId;
            // 這裡可以實現導航到詳情頁
            console.log('查看案件:', caseId);
        });
    });
}
