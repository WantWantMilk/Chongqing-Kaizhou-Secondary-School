// script.js —— 开州中学交互逻辑
(function(){
    'use strict';
    const body = document.body;
    const STORAGE_KEY = 'kxzx_prefs';
    
    // DOM元素
    const modal = document.getElementById('complianceModal');
    const acceptBtn = document.getElementById('acceptModal');
    const declineBtn = document.getElementById('declineModal');
    const settingsPanel = document.getElementById('settingsPanel');
    const settingsToggle = document.getElementById('settingsToggle');
    const closeSettingsBtn = document.getElementById('closeSettingsBtn');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const slideMenu = document.getElementById('slideMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const highContrastToggle = document.getElementById('highContrastToggle');
    const reduceMotionToggle = document.getElementById('reduceMotionToggle');
    const modeBtns = document.querySelectorAll('[data-mode]');
    const resetSettings = document.getElementById('resetSettings');
    const showComplianceAgain = document.getElementById('showComplianceAgain');
    const a11yTrigger = document.getElementById('a11ySettingsTrigger');

    // 初始化: 加载设置、合规弹窗
    function init() {
        // 第一次访问弹窗
        if (!localStorage.getItem('complianceAccepted')) {
            modal.style.display = 'flex';
        } else {
            modal.style.display = 'none';
        }
        
        // 加载偏好
        const saved = localStorage.getItem(STORAGE_KEY);
        let prefs = { mode: 'desktop', highContrast: false, reduceMotion: false };
        if (saved) {
            try { prefs = { ...prefs, ...JSON.parse(saved) }; } catch(e){}
        }
        applyMode(prefs.mode);
        if (prefs.highContrast) body.classList.add('high-contrast');
        if (prefs.reduceMotion) body.classList.add('reduce-motion');
        highContrastToggle.checked = prefs.highContrast;
        reduceMotionToggle.checked = prefs.reduceMotion;
        highlightActiveMode(prefs.mode);
        
        // 生成动态新闻 (模拟)
        renderNews();
    }

    function renderNews() {
        const grid = document.getElementById('newsGrid');
        if (!grid) return;
        const items = [
            {title:'秋季运动会圆满落幕', desc:'高三(3)班破校纪录', date:'2025.04'},
            {title:'缤纷节海选启动', desc:'歌手、舞蹈、话剧报名中', date:'2025.04'},
            {title:'校园摄影展征稿', desc:'用镜头记录开中瞬间', date:'2025.03'},
        ];
        grid.innerHTML = items.map(item => `
            <div class="highlight-card" style="padding:20px">
                <h4>${item.title}</h4>
                <p>${item.desc}</p>
                <small>${item.date}</small>
            </div>
        `).join('');
    }

    function applyMode(mode) {
        body.classList.remove('mode-ios', 'mode-android', 'mode-desktop', 'mode-touch');
        body.classList.add(`mode-${mode}`);
        // 调整汉堡菜单aria
        if (mode === 'android') {
            hamburgerBtn.style.display = 'flex';
        }
    }

    function highlightActiveMode(mode) {
        modeBtns.forEach(btn => {
            btn.style.background = btn.dataset.mode === mode ? 'var(--primary)' : '#f0f0f0';
            btn.style.color = btn.dataset.mode === mode ? 'white' : 'black';
        });
    }

    function savePreferences() {
        const prefs = {
            mode: body.className.match(/mode-(\w+)/)?.[1] || 'desktop',
            highContrast: body.classList.contains('high-contrast'),
            reduceMotion: body.classList.contains('reduce-motion')
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    }

    // 事件绑定
    function bindEvents() {
        acceptBtn?.addEventListener('click', (e) => {
            localStorage.setItem('complianceAccepted', 'true');
            modal.style.display = 'none';
        });
        declineBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            alert('请关注微信公众号: 重庆市开州中学');
            window.location.href = 'https://weixin.qq.com';
        });
        showComplianceAgain?.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'flex';
        });

        // 设置面板
        settingsToggle?.addEventListener('click', () => settingsPanel.classList.add('open'));
        closeSettingsBtn?.addEventListener('click', () => settingsPanel.classList.remove('open'));
        
        // 模式切换
        modeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const mode = btn.dataset.mode;
                applyMode(mode);
                highlightActiveMode(mode);
                savePreferences();
            });
        });

        highContrastToggle.addEventListener('change', (e) => {
            body.classList.toggle('high-contrast', e.target.checked);
            savePreferences();
        });
        reduceMotionToggle.addEventListener('change', (e) => {
            body.classList.toggle('reduce-motion', e.target.checked);
            savePreferences();
        });
        resetSettings.addEventListener('click', () => {
            body.classList.remove('high-contrast', 'reduce-motion');
            highContrastToggle.checked = false;
            reduceMotionToggle.checked = false;
            applyMode('desktop');
            highlightActiveMode('desktop');
            savePreferences();
        });

        // 汉堡菜单 (Android)
        hamburgerBtn?.addEventListener('click', () => {
            slideMenu.classList.add('open');
            menuOverlay.style.display = 'block';
            hamburgerBtn.setAttribute('aria-expanded', 'true');
        });
        closeMenuBtn?.addEventListener('click', closeMenu);
        menuOverlay?.addEventListener('click', closeMenu);
        function closeMenu() {
            slideMenu.classList.remove('open');
            menuOverlay.style.display = 'none';
            hamburgerBtn.setAttribute('aria-expanded', 'false');
        }

        // 辅助功能触发器
        a11yTrigger?.addEventListener('click', () => settingsPanel.classList.add('open'));
        
        // 点击其他关闭
        window.addEventListener('click', (e) => {
            if (!settingsPanel.contains(e.target) && e.target !== settingsToggle) {
                settingsPanel.classList.remove('open');
            }
        });
        // 侧滑菜单内链接点击后关闭
        slideMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    }

    // 模拟图片占位，无图床暂用emoji/背景
    init();
    bindEvents();

    // 针对触屏/桌面不做额外切换，已满足
    // 减弱动态处理: 已在css中

    // 论坛二维码占位说明 (可替换为真实二维码图片)
    // 如需真实图片，请替换 .qr-mock 内容
})();