/**
 * 個人資料模組
 * 職責：
 * - 顯示用戶信息
 * - 用戶認證（登入/登出）
 * - 用戶設置
 */

import { getCurrentUser, loginUser, logoutUser } from '../data/api.js';

const PROFILE_CONTAINER = '#profile-content';

/**
 * 初始化個人資料頁面
 */
export function initProfile() {
    renderProfileUI();
    attachProfileEventListeners();
}

/**
 * 渲染個人資料界面
 */
function renderProfileUI() {
    const currentUser = getCurrentUser();

    if (!currentUser) {
        renderLoginView();
    } else {
        renderUserProfileView(currentUser);
    }
}

/**
 * 渲染登入視圖
 */
function renderLoginView() {
    const html = `
        <div class="profile-page">
            <div class="card" style="max-width: 400px; margin: 0 auto; margin-top: 32px;">
                <div class="card-header">
                    <h1 class="card-title">👤 登入帳戶</h1>
                </div>

                <div class="alert alert-info" style="margin-bottom: 24px;">
                    <strong>為什麼需要登入？</strong>
                    <p style="margin-top: 8px; font-size: 14px;">
                        登入幫助我們建立社群信任度機制。您的貢獻（回報、投票、留言）將累積信譽積分。
                    </p>
                </div>

                <form id="login-form">
                    <div class="form-group">
                        <label class="form-label">📧 Email</label>
                        <input type="email" id="login-email" class="form-input" placeholder="your@email.com" required>
                    </div>

                    <div class="form-group">
                        <label class="form-label">🔐 密碼</label>
                        <input type="password" id="login-password" class="form-input" placeholder="••••••••" required>
                    </div>

                    <div class="form-group">
                        <label style="display: flex; align-items: center; cursor: pointer;">
                            <input type="checkbox" id="remember-me" style="margin-right: 8px;">
                            <span style="font-size: 14px;">記住我的登入資訊</span>
                        </label>
                    </div>

                    <button type="submit" class="btn btn-primary" style="width: 100%; margin-bottom: 12px;">
                        登入
                    </button>
                </form>

                <div style="text-align: center; margin-top: 16px;">
                    <p style="font-size: 14px; color: #6b7280;">
                        還沒有帳戶？
                        <a href="#" style="color: #3b82f6; text-decoration: none;">立即註冊</a>
                    </p>
                </div>

                <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;">

                <div style="margin-top: 16px;">
                    <p style="font-size: 12px; color: #6b7280; margin-bottom: 12px; text-align: center;">或使用以下方式登入</p>
                    <button type="button" class="btn btn-secondary" style="width: 100%; margin-bottom: 8px;">
                        🔵 Google 登入
                    </button>
                    <button type="button" class="btn btn-secondary" style="width: 100%;">
                        ⚫ GitHub 登入
                    </button>
                </div>
            </div>
        </div>
    `;

    document.querySelector(PROFILE_CONTAINER).innerHTML = html;
}

/**
 * 渲染用戶資料視圖
 */
function renderUserProfileView(user) {
    const html = `
        <div class="profile-page">
            <!-- 用戶卡片 -->
            <div class="card" style="display: grid; grid-template-columns: auto 1fr auto; gap: 24px; align-items: center;">
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 32px;">
                    👤
                </div>

                <div>
                    <h1 class="card-title">${user.email}</h1>
                    <p style="color: #6b7280; margin-top: 8px;">
                        帳戶建立於 ${new Date(user.createdAt).toLocaleDateString('zh-Hant')}
                    </p>
                </div>

                <button class="btn btn-secondary" id="logout-btn">登出</button>
            </div>

            <!-- 信譽積分 -->
            <div class="card" style="margin-top: 24px;">
                <h3 class="card-title" style="margin-bottom: 16px;">⭐ 社群信譽</h3>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px;">
                    <div style="text-align: center; padding: 16px; background-color: #f0f9ff; border-radius: 8px; border: 1px solid #bae6fd;">
                        <p style="font-size: 28px; font-weight: 700; color: #0369a1;">${user.reputation}</p>
                        <p style="font-size: 12px; color: #0c4a6e; margin-top: 4px;">信譽積分</p>
                    </div>

                    <div style="text-align: center; padding: 16px; background-color: #f0fdf4; border-radius: 8px; border: 1px solid #bbf7d0;">
                        <p style="font-size: 28px; font-weight: 700; color: #15803d;">12</p>
                        <p style="font-size: 12px; color: #166534; margin-top: 4px;">回報案件數</p>
                    </div>

                    <div style="text-align: center; padding: 16px; background-color: #fef3c7; border-radius: 8px; border: 1px solid #fed7aa;">
                        <p style="font-size: 28px; font-weight: 700; color: #d97706;">48</p>
                        <p style="font-size: 12px; color: #b45309; margin-top: 4px;">投票數</p>
                    </div>
                </div>
            </div>

            <!-- 我的活動 -->
            <div class="card" style="margin-top: 24px;">
                <h3 class="card-title" style="margin-bottom: 16px;">📋 我的活動</h3>

                <div style="display: grid; gap: 12px;">
                    <div style="padding: 12px; background-color: #f9fafb; border-radius: 8px; border-left: 4px solid #3b82f6;">
                        <p style="font-weight: 600;">回報了一個案件</p>
                        <p style="font-size: 12px; color: #6b7280; margin-top: 4px;">2 天前</p>
                    </div>

                    <div style="padding: 12px; background-color: #f9fafb; border-radius: 8px; border-left: 4px solid #10b981;">
                        <p style="font-weight: 600;">對 3 個案件進行投票</p>
                        <p style="font-size: 12px; color: #6b7280; margin-top: 4px;">5 天前</p>
                    </div>

                    <div style="padding: 12px; background-color: #f9fafb; border-radius: 8px; border-left: 4px solid #f59e0b;">
                        <p style="font-weight: 600;">留言並提供證據</p>
                        <p style="font-size: 12px; color: #6b7280; margin-top: 4px;">1 週前</p>
                    </div>
                </div>
            </div>

            <!-- 設置 -->
            <div class="card" style="margin-top: 24px;">
                <h3 class="card-title" style="margin-bottom: 16px;">⚙️ 帳戶設置</h3>

                <div style="display: grid; gap: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 12px; border-bottom: 1px solid #e5e7eb;">
                        <div>
                            <p style="font-weight: 600;">📧 電子郵件通知</p>
                            <p style="font-size: 12px; color: #6b7280; margin-top: 4px;">接收相關案件的更新</p>
                        </div>
                        <input type="checkbox" checked style="width: 20px; height: 20px; cursor: pointer;">
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 12px; border-bottom: 1px solid #e5e7eb;">
                        <div>
                            <p style="font-weight: 600;">🔔 推播通知</p>
                            <p style="font-size: 12px; color: #6b7280; margin-top: 4px;">接收重要警告</p>
                        </div>
                        <input type="checkbox" checked style="width: 20px; height: 20px; cursor: pointer;">
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <p style="font-weight: 600;">🌙 深色模式</p>
                            <p style="font-size: 12px; color: #6b7280; margin-top: 4px;">切換深色主題</p>
                        </div>
                        <input type="checkbox" style="width: 20px; height: 20px; cursor: pointer;">
                    </div>
                </div>
            </div>

            <!-- 危險區 -->
            <div class="card" style="margin-top: 24px; border-color: #fee2e2;">
                <h3 class="card-title" style="margin-bottom: 16px; color: #dc2626;">🚨 危險區</h3>

                <button class="btn btn-danger">刪除帳戶</button>
                <p style="font-size: 12px; color: #991b1b; margin-top: 8px;">
                    刪除後無法恢復。您所有的回報和評論將被保留。
                </p>
            </div>
        </div>
    `;

    document.querySelector(PROFILE_CONTAINER).innerHTML = html;
}

/**
 * 附加事件監聽
 */
function attachProfileEventListeners() {
    const currentUser = getCurrentUser();

    if (!currentUser) {
        // 登入表單提交
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();

                const email = document.getElementById('login-email').value;
                const password = document.getElementById('login-password').value;

                // 模擬登入（實際應連接後端）
                try {
                    const user = loginUser({ email, password });
                    console.log('✅ 登入成功:', user);
                    
                    // 重新渲染
                    renderProfileUI();
                } catch (error) {
                    console.error('❌ 登入失敗:', error);
                    alert('登入失敗，請重試');
                }
            });
        }
    } else {
        // 登出按鈕
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (confirm('確定要登出嗎？')) {
                    logoutUser();
                    console.log('✅ 已登出');
                    renderProfileUI();
                }
            });
        }
    }
}
