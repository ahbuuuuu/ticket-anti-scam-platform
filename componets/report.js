/**
 * 回报模块
 * 职责：
 * - 提供回报表单
 * - 处理表单验证
 * - 提交案件回报
 * 
 * 注意：这里用 HTML form 是为了快速原型
 * 后期迁移到 React 时，用 React Hook Form + Zod
 */

import { reportCase, getCurrentUser } from '../data/api.js';

const REPORT_CONTAINER = '#report-content';

/**
 * 初始化回报界面
 */
export function initReport() {
    renderReportUI();
    attachReportEventListeners();
}

/**
 * 渲染回报界面
 */
function renderReportUI() {
    const currentUser = getCurrentUser();

    const html = `
        <div class="report-page">
            <div class="card">
                <div class="card-header">
                    <h1 class="card-title">➕ 回報詐騙案件</h1>
                </div>
                
                ${!currentUser ? `
                    <div class="alert alert-info">
                        <strong>⚠️ 需要登入</strong>
                        <p style="margin-top: 8px;">請先登入才能回報案件。這有助於我們建立社群信任度機制。</p>
                    </div>
                ` : ''}

                <div style="margin-bottom: 24px;">
                    <p style="color: #6b7280;">
                        您可以報告<strong>疑似詐騙</strong>或<strong>已受害</strong>。提供詳細資訊和證據能幫助更多人避免被騙。
                    </p>
                </div>

                <div id="report-form">
                    <!-- 報告類型選擇 -->
                    <div class="form-group">
                        <label class="form-label">🔴 報告類型 *</label>
                        <div style="display: flex; gap: 16px;">
                            <label style="display: flex; align-items: center; cursor: pointer;">
                                <input type="radio" name="report_type" value="suspected" checked style="margin-right: 8px;">
                                <span>疑似詐騙</span>
                            </label>
                            <label style="display: flex; align-items: center; cursor: pointer;">
                                <input type="radio" name="report_type" value="victim" style="margin-right: 8px;">
                                <span>已受害</span>
                            </label>
                        </div>
                    </div>

                    <!-- 賣家識別 -->
                    <div class="form-group">
                        <label class="form-label">💼 賣家識別 *</label>
                        <input type="text" id="seller_id" class="form-input" placeholder="例：@scammer_threads 或 Facebook 帳號名" required>
                        <p style="font-size: 12px; color: #6b7280; margin-top: 6px;">輸入您找到的賣家帳號或 ID</p>
                    </div>

                    <!-- 平台選擇 -->
                    <div class="form-group">
                        <label class="form-label">📱 平台 *</label>
                        <select id="platform" class="form-select" required>
                            <option value="">-- 選擇平台 --</option>
                            <option value="Threads">Threads</option>
                            <option value="Facebook">Facebook</option>
                            <option value="Instagram">Instagram</option>
                            <option value="Telegram">Telegram</option>
                            <option value="LINE">LINE</option>
                            <option value="Email">Email</option>
                            <option value="其他">其他</option>
                        </select>
                    </div>

                    <!-- 事件時間（僅限已受害） -->
                    <div class="form-group" id="event-time-group" style="display: none;">
                        <label class="form-label">📅 事件時間 *</label>
                        <input type="date" id="event_date" class="form-input">
                    </div>

                    <!-- 金額（僅限已受害） -->
                    <div class="form-group" id="amount-group" style="display: none;">
                        <label class="form-label">💵 被騙金額 *</label>
                        <input type="number" id="amount" class="form-input" placeholder="例：2500" min="0">
                        <p style="font-size: 12px; color: #6b7280; margin-top: 6px;">填寫被騙的金額（新台幣）</p>
                    </div>

                    <!-- 付款方式（僅限已受害） -->
                    <div class="form-group" id="payment-group" style="display: none;">
                        <label class="form-label">💳 付款方式 *</label>
                        <select id="payment_method" class="form-select">
                            <option value="">-- 選擇付款方式 --</option>
                            <option value="transfer">銀行轉帳</option>
                            <option value="cash">現金</option>
                            <option value="crypto">加密貨幣</option>
                            <option value="other">其他</option>
                        </select>
                    </div>

                    <!-- 描述 -->
                    <div class="form-group">
                        <label class="form-label">📝 詳細描述 *</label>
                        <textarea id="description" class="form-textarea" placeholder="請詳細描述詐騙情況..." required></textarea>
                        <p style="font-size: 12px; color: #6b7280; margin-top: 6px;">盡量提供詳細信息，但請不要包含個資</p>
                    </div>

                    <!-- 證據上傳 -->
                    <div class="form-group">
                        <label class="form-label">📎 證據附件</label>
                        <div style="border: 2px dashed #e5e7eb; border-radius: 8px; padding: 24px; text-align: center; cursor: pointer;" id="upload-area">
                            <p style="color: #6b7280;">📸 拖拽或點擊上傳截圖、聊天紀錄等證據</p>
                            <p style="font-size: 12px; color: #9ca3af; margin-top: 8px;">支持 JPG、PNG、PDF（請遮蔽個資）</p>
                            <input type="file" id="evidence_files" multiple style="display: none;" accept="image/*,.pdf">
                        </div>
                        <div id="file-preview" style="margin-top: 16px;"></div>
                    </div>

                    <!-- 聯絡資訊（僅限已受害） -->
                    <div class="form-group" id="contact-group" style="display: none;">
                        <label class="form-label">📧 您的 Email（選填）</label>
                        <input type="email" id="user_email" class="form-input" placeholder="example@gmail.com">
                        <p style="font-size: 12px; color: #6b7280; margin-top: 6px;">
                            如有後續相關發展，我們可能會聯絡您提供更多信息
                        </p>
                    </div>

                    <!-- 同意條款 -->
                    <div class="form-group">
                        <label style="display: flex; align-items: flex-start; cursor: pointer;">
                            <input type="checkbox" id="agree_terms" style="margin-right: 8px; margin-top: 4px;">
                            <span style="font-size: 14px;">
                                我已閱讀並同意 
                                <a href="#" style="color: #3b82f6; text-decoration: none;">隱私政策</a> 和 
                                <a href="#" style="color: #3b82f6; text-decoration: none;">使用條款</a>
                            </span>
                        </label>
                    </div>

                    <!-- 提交按鈕 -->
                    <div style="display: flex; gap: 12px;">
                        <button type="submit" class="btn btn-primary" id="submit-btn">提交回報</button>
                        <button type="reset" class="btn btn-secondary">重設</button>
                    </div>
                </div>

                <!-- 成功消息 -->
                <div id="success-message" style="display: none;">
                    <div class="alert alert-success">
                        <strong>✅ 回報成功！</strong>
                        <p style="margin-top: 8px;">感謝您的貢獻。案件已提交社群驗證，我們會儘快處理。</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.querySelector(REPORT_CONTAINER).innerHTML = html;
}

/**
 * 附加事件監聽
 */
function attachReportEventListeners() {
    const reportTypeInputs = document.querySelectorAll('[name="report_type"]');
    const submitBtn = document.getElementById('submit-btn');
    const uploadArea = document.getElementById('upload-area');
    const evidenceFiles = document.getElementById('evidence_files');

    // 報告類型切換
    reportTypeInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            const isVictim = e.target.value === 'victim';
            
            // 顯示/隱藏受害特定欄位
            document.getElementById('event-time-group').style.display = isVictim ? 'block' : 'none';
            document.getElementById('amount-group').style.display = isVictim ? 'block' : 'none';
            document.getElementById('payment-group').style.display = isVictim ? 'block' : 'none';
            document.getElementById('contact-group').style.display = isVictim ? 'block' : 'none';
            
            // 更新必填欄位
            if (isVictim) {
                document.getElementById('event_date').required = true;
                document.getElementById('amount').required = true;
                document.getElementById('payment_method').required = true;
            } else {
                document.getElementById('event_date').required = false;
                document.getElementById('amount').required = false;
                document.getElementById('payment_method').required = false;
            }
        });
    });

    // 文件上傳
    uploadArea.addEventListener('click', () => evidenceFiles.click());
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#3b82f6';
        uploadArea.style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '#e5e7eb';
        uploadArea.style.backgroundColor = 'transparent';
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#e5e7eb';
        uploadArea.style.backgroundColor = 'transparent';
        
        const files = e.dataTransfer.files;
        evidenceFiles.files = files;
        updateFilePreview(files);
    });

    evidenceFiles.addEventListener('change', (e) => {
        updateFilePreview(e.target.files);
    });

    // 表單提交
    document.getElementById('report-form').addEventListener('submit', (e) => {
        e.preventDefault();
        handleFormSubmit();
    });
}

/**
 * 更新文件預覽
 */
function updateFilePreview(files) {
    const preview = document.getElementById('file-preview');
    preview.innerHTML = '';

    if (files.length === 0) return;

    const html = `
        <div style="padding: 12px; background-color: #f0f9ff; border-radius: 8px; border: 1px solid #bae6fd;">
            <p style="font-size: 12px; color: #0369a1; margin-bottom: 8px;">✅ 已選擇 ${files.length} 個文件：</p>
            <ul style="list-style: none; padding: 0; margin: 0;">
                ${Array.from(files).map(f => `
                    <li style="font-size: 12px; color: #0c4a6e; padding: 4px 0;">
                        📄 ${f.name}
                    </li>
                `).join('')}
            </ul>
        </div>
    `;

    preview.innerHTML = html;
}

/**
 * 處理表單提交
 */
function handleFormSubmit() {
    const form = document.getElementById('report-form');
    const formData = new FormData(form);

    // 驗證必填欄位
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value) {
            isValid = false;
            field.style.borderColor = '#ef4444';
            field.addEventListener('input', () => {
                field.style.borderColor = '';
            }, { once: true });
        }
    });

    // 驗證同意條款
    if (!document.getElementById('agree_terms').checked) {
        alert('請同意隱私政策和使用條款');
        return;
    }

    if (!isValid) {
        alert('請填寫所有必填欄位');
        return;
    }

    // 構建提交數據
    const reportData = {
        reportType: formData.get('report_type'),
        sellerId: formData.get('seller_id'),
        platform: formData.get('platform'),
        description: formData.get('description'),
        eventDate: formData.get('event_date') || null,
        amount: parseInt(formData.get('amount')) || null,
        paymentMethod: formData.get('payment_method') || null,
        userEmail: formData.get('user_email') || null,
        status: formData.get('report_type') === 'victim' ? 'high_risk' : 'pending'
    };

    // 提交案件
    try {
        const newCase = reportCase(reportData);
        
        // 隱藏表單，顯示成功消息
        document.getElementById('report-form').style.display = 'none';
        document.getElementById('success-message').style.display = 'block';
        
        console.log('案件已提交:', newCase);
        
        // 3 秒後重置表單
        setTimeout(() => {
            document.getElementById('report-form').style.display = 'block';
            document.getElementById('success-message').style.display = 'none';
            document.getElementById('report-form').reset();
        }, 3000);
    } catch (error) {
        console.error('提交失敗:', error);
        alert('提交失敗，請重試');
    }
}
