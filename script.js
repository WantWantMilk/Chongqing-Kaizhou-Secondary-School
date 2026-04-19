// script.js
(function(){
    const body = document.body;
    const STORAGE_KEY = 'kxzx_prefs';

    // DOM
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

    // 初始化
    function init() {
        if (!localStorage.getItem('complianceAccepted')) {
            modal.style.display = 'flex';
        } else {
            modal.style.display = 'none';
        }
        const saved = localStorage.getItem(STORAGE_KEY);
        let prefs = { mode: 'desktop', highContrast: false, reduceMotion: false };
        if (saved) try { prefs = { ...prefs, ...JSON.parse(saved) }; } catch(e){}
        applyMode(prefs.mode);
        highContrastToggle.checked = prefs.highContrast;
        reduceMotionToggle.checked = prefs.reduceMotion;
        body.classList.toggle('high-contrast', prefs.highContrast);
        body.classList.toggle('reduce-motion', prefs.reduceMotion);
        highlightActiveMode(prefs.mode);
        renderNews();
    }

    function renderNews() {
        const grid = document.getElementById('newsGrid');
        if(!grid) return;
        const items = [
            {title:'秋季运动会圆满落幕', desc:'高三(3)班破校纪录', date:'2025.04'},
            {title:'缤纷节海选启动', desc:'歌手、舞蹈、话剧报名中', date:'2025.04'},
            {title:'校园摄影展征稿', desc:'用镜头记录开中瞬间', date:'2025.03'},
        ];
        grid.innerHTML = items.map(item => `
            <div class="dual-card" style="padding:20px">
                <h4>${item.title}</h4>
                <p>${item.desc}</p>
                <small>${item.date}</small>
            </div>
        `).join('');
    }

    function applyMode(mode) {
        body.classList.remove('mode-ios','mode-android','mode-desktop','mode-touch');
        body.classList.add(`mode-${mode}`);
    }
    function highlightActiveMode(mode) {
        modeBtns.forEach(btn => {
            btn.style.background = btn.dataset.mode === mode ? 'var(--primary)' : '#f0f0f0';
            btn.style.color = btn.dataset.mode === mode ? 'white' : 'black';
        });
    }
    function savePrefs() {
        const prefs = {
            mode: body.className.match(/mode-(\w+)/)?.[1] || 'desktop',
            highContrast: body.classList.contains('high-contrast'),
            reduceMotion: body.classList.contains('reduce-motion')
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    }

    // 事件绑定
    acceptBtn?.addEventListener('click', ()=>{
        localStorage.setItem('complianceAccepted','true');
        modal.style.display = 'none';
    });
    declineBtn?.addEventListener('click', ()=>{
        alert('请关注微信公众号: 重庆市开州中学');
        window.location.href = 'https://weixin.qq.com';
    });
    showComplianceAgain?.addEventListener('click', (e)=>{
        e.preventDefault();
        modal.style.display = 'flex';
    });

    settingsToggle?.addEventListener('click', ()=> settingsPanel.classList.add('open'));
    closeSettingsBtn?.addEventListener('click', ()=> settingsPanel.classList.remove('open'));
    a11yTrigger?.addEventListener('click', ()=> settingsPanel.classList.add('open'));

    modeBtns.forEach(btn => btn.addEventListener('click', ()=>{
        const mode = btn.dataset.mode;
        applyMode(mode);
        highlightActiveMode(mode);
        savePrefs();
    }));
    highContrastToggle.addEventListener('change', e=>{ body.classList.toggle('high-contrast', e.target.checked); savePrefs(); });
    reduceMotionToggle.addEventListener('change', e=>{ body.classList.toggle('reduce-motion', e.target.checked); savePrefs(); });
    resetSettings.addEventListener('click', ()=>{
        body.classList.remove('high-contrast','reduce-motion');
        highContrastToggle.checked = false;
        reduceMotionToggle.checked = false;
        applyMode('desktop');
        highlightActiveMode('desktop');
        savePrefs();
    });

    hamburgerBtn?.addEventListener('click', ()=>{
        slideMenu.classList.add('open');
        menuOverlay.style.display = 'block';
    });
    closeMenuBtn?.addEventListener('click', closeMenu);
    menuOverlay?.addEventListener('click', closeMenu);
    function closeMenu(){
        slideMenu.classList.remove('open');
        menuOverlay.style.display = 'none';
    }
    slideMenu.querySelectorAll('a').forEach(link=>link.addEventListener('click', closeMenu));

    init();
})();