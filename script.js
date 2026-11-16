(function () {
  'use strict';

  var reducedMotion = !!(window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ---------------------------------------------------------
     1. 顶部导航（移动端展开 / 收起）
     --------------------------------------------------------- */
  var header = document.getElementById('siteHeader');
  var nav    = document.getElementById('primaryNav');
  var toggle = document.getElementById('navToggle');

  function closeNav() {
    if (!nav || !nav.classList.contains('is-open')) return;
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', '打开菜单');
  }

  function openNav() {
    if (!nav) return;
    nav.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', '关闭菜单');
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      if (nav.classList.contains('is-open')) { closeNav(); } else { openNav(); }
    });

    nav.addEventListener('click', function (e) {
      var el = e.target;
      while (el && el !== nav) {
        if (el.tagName === 'A') { closeNav(); return; }
        el = el.parentNode;
      }
    });

    document.addEventListener('click', function (e) {
      if (!nav.classList.contains('is-open')) return;
      if (nav.contains(e.target) || toggle.contains(e.target)) return;
      closeNav();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' || e.keyCode === 27) closeNav();
    });

    var mq = window.matchMedia('(min-width: 961px)');
    var handleMQ = function () { if (mq.matches) closeNav(); };
    if (mq.addEventListener) { mq.addEventListener('change', handleMQ); }
    else if (mq.addListener) { mq.addListener(handleMQ); }
  }

  /* ---------------------------------------------------------
     2. 滚动：头部阴影 + 返回顶部
     --------------------------------------------------------- */
  var toTop = document.getElementById('toTop');

  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    if (header) {
      if (y > 8) { header.classList.add('is-scrolled'); }
      else { header.classList.remove('is-scrolled'); }
    }
    if (toTop) {
      if (y > 600) { toTop.classList.add('is-visible'); }
      else { toTop.classList.remove('is-visible'); }
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.scrollTo(0, 0);
      }
    });
  }

  /* ---------------------------------------------------------
     3. 首屏轮播
     --------------------------------------------------------- */
  var hero      = document.getElementById('hero');
  var slides    = [].slice.call(document.querySelectorAll('.slide'));
  var dotsWrap  = document.getElementById('heroDots');
  var btnPrev   = document.getElementById('heroPrev');
  var btnNext   = document.getElementById('heroNext');

  var current = 0;
  var timer = null;
  var DURATION = 6000;
  var dots = [];

  function goTo(index) {
    if (slides.length < 2) return;
    if (index === current) return;

    slides[current].classList.remove('is-active');
    slides[current].setAttribute('aria-hidden', 'true');
    if (dots[current]) dots[current].classList.remove('is-active');

    current = (index + slides.length) % slides.length;

    slides[current].classList.add('is-active');
    slides[current].setAttribute('aria-hidden', 'false');
    if (dots[current]) dots[current].classList.add('is-active');
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() {
    stopAuto();
    if (reducedMotion || slides.length < 2) return;
    timer = setInterval(next, DURATION);
  }
  function stopAuto() {
    if (timer) { clearInterval(timer); timer = null; }
  }
  function restartAuto() { startAuto(); }

  if (slides.length && dotsWrap) {
    slides.forEach(function (s, i) {
      s.setAttribute('aria-hidden', i === 0 ? 'false' : 'true');

      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', '第 ' + (i + 1) + ' 张幻灯片');
      b.innerHTML = '<span></span>';
      if (i === 0) b.classList.add('is-active');
      b.addEventListener('click', function () { goTo(i); restartAuto(); });
      dotsWrap.appendChild(b);
    });
    dots = [].slice.call(dotsWrap.querySelectorAll('button'));

    if (btnPrev) btnPrev.addEventListener('click', function () { prev(); restartAuto(); });
    if (btnNext) btnNext.addEventListener('click', function () { next(); restartAuto(); });

    if (hero) {
      hero.addEventListener('mouseenter', stopAuto);
      hero.addEventListener('mouseleave', startAuto);

      var startX = 0, startY = 0, tracking = false;
      hero.addEventListener('touchstart', function (e) {
        var t = e.touches[0];
        startX = t.clientX;
        startY = t.clientY;
        tracking = true;
      }, { passive: true });

      hero.addEventListener('touchend', function (e) {
        if (!tracking) return;
        tracking = false;
        var t = e.changedTouches[0];
        var dx = t.clientX - startX;
        var dy = t.clientY - startY;
        if (Math.abs(dx) > 46 && Math.abs(dx) > Math.abs(dy)) {
          if (dx < 0) { next(); } else { prev(); }
          restartAuto();
        }
      }, { passive: true });
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { stopAuto(); } else { startAuto(); }
    });

    startAuto();
  }

  /* ---------------------------------------------------------
     4. 滚动淡入（IntersectionObserver）
     --------------------------------------------------------- */
  var revealEls = [].slice.call(document.querySelectorAll('.reveal'));

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------------------------------------------------------
     5. 数字滚动
     --------------------------------------------------------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-target')) || 0;
    var duration = 1400;
    var startTime = null;

    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) { window.requestAnimationFrame(step); }
      else { el.textContent = target; }
    }
    window.requestAnimationFrame(step);
  }

  var countEls = [].slice.call(document.querySelectorAll('[data-target]'));

  if ('IntersectionObserver' in window && !reducedMotion && window.requestAnimationFrame) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    countEls.forEach(function (el) { cio.observe(el); });
  } else {
    countEls.forEach(function (el) {
      el.textContent = el.getAttribute('data-target');
    });
  }

  /* ---------------------------------------------------------
     6. 页脚年份
     --------------------------------------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

})();