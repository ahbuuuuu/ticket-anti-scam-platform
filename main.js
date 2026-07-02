/**
 * 主应用入口（Main Application Entry Point）
 * 
 * 职责：
 * - 初始化应用
 * - 加载数据
 * - 处理标签页导航
 * - 协调各个模块
 * 
 * 架构说明：
 * 这个简单的实现展示了模块化架构如何工作
 * 后期迁移到 Next.js/React 时，这会变成：
 * - Router (Next.js App Router)
 * - Layout 组件
 * - 各个页面组件
 */

import { initializeData } from './data/api.js';
import { initDashboard } from './components/dashboard.js';
import { initSearch } from './components/search.js';
import { initReport } from './components/report.js';
import { initProfile } from './components/profile.js';

/**
 * 应用启动
 */
async function initApp() {
    console.log('🚀 正在初始化防詐平台...');
    
    try {
        // 加载数据
        await initializeData();

        // 初始化各个模块
        initializeNavigation();
        initDashboard();
        initSearch();
        initReport();
        initProfile();

        console.log('✅ 應用初始化完成！');
    } catch (error) {
        console.error('❌ 初始化失敗:', error);
    }
}

/**
 * 初始化导航
 */
function initializeNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const tabId = e.target.dataset.tab;
            switchTab(tabId);
            
            // 更新导航按钮状态
            navButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
        });
    });

    // 设置默认选中标签页
    const defaultTab = document.querySelector('[data-tab="dashboard"]');
    if (defaultTab) {
        defaultTab.classList.add('active');
    }
}

/**
 * 切换标签页
 */
function switchTab(tabId) {
    // 隐藏所有标签页
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('active'));

    // 显示选中的标签页
    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
        selectedTab.classList.add('active');
        
        // 根据选中的标签页重新渲染内容
        // 这个简单的实现在每次切换时重新渲染
        // 后期可以优化为缓存或按需加载
        switch (tabId) {
            case 'dashboard':
                initDashboard();
                break;
            case 'search':
                initSearch();
                break;
            case 'report':
                initReport();
                break;
            case 'profile':
                initProfile();
                break;
        }
    }
}

/**
 * 应用进入点
 * DOM 加载完成后启动应用
 */
document.addEventListener('DOMContentLoaded', initApp);
