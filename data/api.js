/**
 * API 层 - 处理所有数据获取和管理
 * 这一层的逻辑可以直接迁移到 React 的 hooks 或 Next.js 的 API routes
 */

let mockCases = [];
let currentUser = null;

/**
 * 初始化数据 - 从 JSON 加载 mock 数据
 */
export async function initializeData() {
    try {
        const response = await fetch('/data/cases.json');
        mockCases = await response.json();
        console.log('✅ 数据已加载:', mockCases.length, '个案件');
        return mockCases;
    } catch (error) {
        console.error('❌ 数据加载失败:', error);
        return [];
    }
}

/**
 * 搜索案件
 * @param {string} query - 搜索关键词
 * @param {object} filters - 筛选条件 { platform, riskLevel, status }
 * @returns {array} 搜索结果
 */
export function searchCases(query = '', filters = {}) {
    let results = mockCases;

    // 关键词搜索
    if (query) {
        const lowerQuery = query.toLowerCase();
        results = results.filter(c =>
            c.seller_id?.toLowerCase().includes(lowerQuery) ||
            c.email?.toLowerCase().includes(lowerQuery) ||
            c.wallet?.toLowerCase().includes(lowerQuery) ||
            c.description?.toLowerCase().includes(lowerQuery)
        );
    }

    // 平台筛选
    if (filters.platform) {
        results = results.filter(c => c.platform === filters.platform);
    }

    // 风险等级筛选
    if (filters.riskLevel) {
        results = results.filter(c => c.status === filters.riskLevel);
    }

    return results;
}

/**
 * 获取单个案件详情
 * @param {string} caseId - 案件 ID
 * @returns {object} 案件详情
 */
export function getCaseDetail(caseId) {
    return mockCases.find(c => c.id === caseId);
}

/**
 * 获取相关案件（同一卖家的其他案件）
 * @param {string} sellerId - 卖家 ID
 * @param {string} excludeCaseId - 排除的案件 ID
 * @returns {array} 相关案件列表
 */
export function getRelatedCases(sellerId, excludeCaseId) {
    return mockCases.filter(c =>
        c.seller_id === sellerId && c.id !== excludeCaseId
    );
}

/**
 * 获取仪表盘统计数据
 * @returns {object} 统计信息
 */
export function getDashboardStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaysCases = mockCases.filter(c => {
        const caseDate = new Date(c.created_at);
        caseDate.setHours(0, 0, 0, 0);
        return caseDate.getTime() === today.getTime();
    });

    return {
        totalCases: mockCases.length,
        todaysCases: todaysCases.length,
        highRiskCases: mockCases.filter(c => c.status === 'high_risk').length,
        awaitingVerification: mockCases.filter(c => c.status === 'pending').length,
    };
}

/**
 * 获取热门案件（按证据数量和投票排序）
 * @param {number} limit - 返回数量
 * @returns {array} 热门案件列表
 */
export function getPopularCases(limit = 5) {
    return [...mockCases]
        .sort((a, b) => {
            const scoreA = (a.evidence_count || 0) + (a.votes || 0);
            const scoreB = (b.evidence_count || 0) + (b.votes || 0);
            return scoreB - scoreA;
        })
        .slice(0, limit);
}

/**
 * 获取最新案件
 * @param {number} limit - 返回数量
 * @returns {array} 最新案件列表
 */
export function getLatestCases(limit = 5) {
    return [...mockCases]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, limit);
}

/**
 * 回报新案件（模拟）
 * @param {object} formData - 表单数据
 * @returns {object} 新案件对象
 */
export function reportCase(formData) {
    const newCase = {
        id: `case_${Date.now()}`,
        seller_id: formData.sellerId,
        platform: formData.platform,
        description: formData.description,
        status: formData.status || 'pending',
        risk_score: formData.riskScore || 50,
        evidence_count: 0,
        votes: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...formData
    };

    mockCases.push(newCase);
    console.log('✅ 案件已回报:', newCase.id);
    return newCase;
}

/**
 * 验证用户登录（模拟）
 * @param {object} credentials - 用户凭证 { email, password }
 * @returns {object} 用户对象
 */
export function loginUser(credentials) {
    currentUser = {
        id: `user_${Date.now()}`,
        email: credentials.email,
        reputation: 100,
        createdAt: new Date().toISOString()
    };
    return currentUser;
}

/**
 * 获取当前用户
 * @returns {object} 当前用户
 */
export function getCurrentUser() {
    return currentUser;
}

/**
 * 登出用户
 */
export function logoutUser() {
    currentUser = null;
}

/**
 * 获取所有平台（用于筛选）
 * @returns {array} 平台列表
 */
export function getPlatforms() {
    const platforms = new Set(mockCases.map(c => c.platform));
    return Array.from(platforms).sort();
}
