/**
 * 案件卡片组件
 * 职责：
 * - 生成案件卡片 HTML
 * - 显示案件关键信息和风险分数
 * 
 * 后期迁移到 React：
 * - 改为 CaseCard.jsx
 * - 支持 onClick 回调
 */

/**
 * 渲染单个案件卡片
 * 这个函数生成 HTML 字符串，易于在不同容器中复用
 * 后期可以改成 React 组件并保留相同的渲染逻辑
 */
export function renderCaseCard(caseData) {
    const riskColor = getRiskColor(caseData.status);
    const riskText = getRiskLevelText(caseData.status);
    
    const evidenceText = `${caseData.evidence_count || 0} 份證據`;
    const votesText = `${caseData.votes || 0} 票`;

    return `
        <div class="card case-card" data-case-id="${caseData.id}">
            <div class="case-info">
                <div class="case-seller">
                    ${caseData.seller_id}
                    <span class="badge badge-platform">${caseData.platform}</span>
                </div>
                
                <div class="case-meta">
                    <span>📅 ${new Date(caseData.created_at).toLocaleDateString('zh-Hant')}</span>
                    <span>${evidenceText}</span>
                    <span>${votesText}</span>
                </div>
                
                ${caseData.description ? `
                    <p style="color: #6b7280; margin-bottom: 8px; font-size: 14px;">
                        ${caseData.description.substring(0, 100)}${caseData.description.length > 100 ? '...' : ''}
                    </p>
                ` : ''}
                
                ${caseData.related_accounts && caseData.related_accounts.length > 0 ? `
                    <div style="margin-top: 8px;">
                        <span style="font-size: 12px; color: #9ca3af;">關聯帳號：</span>
                        ${caseData.related_accounts.map(acc => `
                            <span class="badge badge-platform">${acc.platform}</span>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
            
            <div class="case-risk risk-${getStatusPrefix(caseData.status)}">
                <div class="risk-score">${caseData.risk_score}</div>
                <div class="risk-level">/100</div>
                <div style="font-size: 12px; margin-top: 4px; text-align: center;">
                    ${riskText}
                </div>
            </div>
        </div>
    `;
}

/**
 * 渲染案件详情页
 */
export function renderCaseDetail(caseData) {
    const riskText = getRiskLevelText(caseData.status);

    return `
        <div class="case-detail">
            <div class="card">
                <div class="card-header">
                    <div>
                        <h1 class="card-title">${caseData.seller_id}</h1>
                        <p style="color: #6b7280; margin-top: 8px;">
                            於 ${new Date(caseData.created_at).toLocaleString('zh-Hant')} 回報
                        </p>
                    </div>
                    <div style="text-align: right;">
                        <div class="risk-score" style="font-size: 48px;">${caseData.risk_score}</div>
                        <div style="font-size: 12px; color: #6b7280;">/ 100</div>
                    </div>
                </div>

                <div class="alert alert-${getAlertType(caseData.status)}">
                    <strong>${riskText}</strong>
                </div>

                <div class="card-body">
                    <h3 style="margin-bottom: 12px;">案件描述</h3>
                    <p style="line-height: 1.6; color: #374151;">
                        ${caseData.description}
                    </p>
                </div>
            </div>

            <!-- 基本信息 -->
            <div class="card" style="margin-top: 24px;">
                <h3 class="card-title" style="margin-bottom: 16px;">基本信息</h3>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                    <div>
                        <p style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">📱 平台</p>
                        <p style="font-weight: 600;">${caseData.platform}</p>
                    </div>
                    
                    ${caseData.email ? `
                        <div>
                            <p style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">📧 Email</p>
                            <p style="font-weight: 600; word-break: break-all;">${maskEmail(caseData.email)}</p>
                        </div>
                    ` : ''}
                    
                    ${caseData.wallet ? `
                        <div>
                            <p style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">💰 Wallet</p>
                            <p style="font-weight: 600; font-family: monospace;">${caseData.wallet}</p>
                        </div>
                    ` : ''}
                    
                    ${caseData.phone ? `
                        <div>
                            <p style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">📞 電話</p>
                            <p style="font-weight: 600;">${maskPhone(caseData.phone)}</p>
                        </div>
                    ` : ''}
                </div>
            </div>

            <!-- 社群數據 -->
            <div class="card" style="margin-top: 24px;">
                <h3 class="card-title" style="margin-bottom: 16px;">社群驗證</h3>
                
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; text-align: center;">
                    <div>
                        <p style="font-size: 32px; font-weight: 700; color: #ef4444;">${caseData.evidence_count || 0}</p>
                        <p style="font-size: 12px; color: #6b7280;">份證據</p>
                    </div>
                    <div>
                        <p style="font-size: 32px; font-weight: 700; color: #3b82f6;">${caseData.votes || 0}</p>
                        <p style="font-size: 12px; color: #6b7280;">票</p>
                    </div>
                    <div>
                        <p style="font-size: 32px; font-weight: 700; color: #f59e0b;">${caseData.comments || 0}</p>
                        <p style="font-size: 12px; color: #6b7280;">條評論</p>
                    </div>
                </div>
            </div>

            <!-- 時間線 -->
            ${renderTimeline(caseData)}

            <!-- 相關帳號 -->
            ${caseData.related_accounts && caseData.related_accounts.length > 0 ? `
                <div class="card" style="margin-top: 24px;">
                    <h3 class="card-title" style="margin-bottom: 16px;">關聯帳號</h3>
                    <div style="display: grid; gap: 12px;">
                        ${caseData.related_accounts.map(acc => `
                            <div style="padding: 12px; background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
                                <p style="font-weight: 600;">${acc.platform}</p>
                                <p style="font-size: 14px; color: #6b7280; margin-top: 4px;">
                                    ${acc.handle || acc.phone || acc.name || '無'}
                                </p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `;
}

/**
 * 渲染時間線
 */
function renderTimeline(caseData) {
    const events = [
        { 
            time: new Date(caseData.created_at).toLocaleDateString('zh-Hant'),
            title: '案件建立',
            content: `由用戶回報`
        },
        {
            time: `${caseData.evidence_count || 0} 份證據`,
            title: '證據收集',
            content: `社群貢獻的證據`
        },
        {
            time: `${caseData.votes || 0} 票`,
            title: '社群投票',
            content: `可信度驗證中`
        }
    ];

    return `
        <div class="card" style="margin-top: 24px;">
            <h3 class="card-title" style="margin-bottom: 16px;">進展時間線</h3>
            <div class="timeline">
                ${events.map(event => `
                    <div class="timeline-item">
                        <div class="timeline-time">${event.time}</div>
                        <div class="timeline-content">
                            <strong>${event.title}</strong>
                            <p style="font-size: 14px; color: #6b7280; margin-top: 4px;">${event.content}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

/**
 * 獲取風險顏色
 */
function getRiskColor(status) {
    const colors = {
        'high_risk': '#dc2626',
        'medium_risk': '#f59e0b',
        'low_risk': '#10b981',
        'pending': '#6b7280'
    };
    return colors[status] || '#6b7280';
}

/**
 * 獲取風險等級文本
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

/**
 * 獲取狀態前綴（用於 CSS 類）
 */
function getStatusPrefix(status) {
    if (status.includes('high')) return 'high';
    if (status.includes('medium')) return 'medium';
    if (status.includes('low')) return 'low';
    return 'low';
}

/**
 * 獲取警告框類型
 */
function getAlertType(status) {
    if (status === 'high_risk') return 'danger';
    if (status === 'medium_risk') return 'warning';
    if (status === 'low_risk') return 'success';
    return 'info';
}

/**
 * 遮罩 Email
 */
function maskEmail(email) {
    const [local, domain] = email.split('@');
    if (!local || !domain) return email;
    return local.substring(0, 2) + '***@' + domain;
}

/**
 * 遮罩電話
 */
function maskPhone(phone) {
    if (!phone) return phone;
    return phone.substring(0, 3) + '***' + phone.substring(phone.length - 4);
}
