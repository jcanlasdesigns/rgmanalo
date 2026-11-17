document.addEventListener('DOMContentLoaded', function() {

  /* =========================================================
     HERO VIDEO FALLBACK
     ========================================================= */
  const video = document.getElementById('heroVideo');
  const fallbackImg = document.getElementById('heroFallbackImg');
  if (video) {
    video.addEventListener('error', function() {
      video.style.display = 'none';
      if (fallbackImg) fallbackImg.style.display = 'block';
    });
    setTimeout(() => {
      if (video.readyState < 2) {
        video.style.display = 'none';
        if (fallbackImg) fallbackImg.style.display = 'block';
      }
    }, 3000);
  }

  /* =========================================================
     FULLSCREEN IMAGE OVERLAY
     ========================================================= */
  const fullscreenOverlay = document.getElementById('fullscreenOverlay');
  const fullscreenImg = document.getElementById('fullscreenImg');
  const closeFullscreen = document.getElementById('closeFullscreen');

  window.openFullscreen = function(src) {
    if (!fullscreenOverlay || !fullscreenImg) return;
    fullscreenImg.src = src;
    fullscreenOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  function closeFullscreenFn() {
    if (!fullscreenOverlay) return;
    fullscreenOverlay.classList.remove('active');
    document.body.style.overflow = '';
    fullscreenImg.src = '';
  }

  if (closeFullscreen) closeFullscreen.addEventListener('click', closeFullscreenFn);
  if (fullscreenOverlay) {
    fullscreenOverlay.addEventListener('click', function(e) {
      if (e.target === this) closeFullscreenFn();
    });
  }
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && fullscreenOverlay && fullscreenOverlay.classList.contains('active')) {
      closeFullscreenFn();
    }
  });

  /* =========================================================
     HAMBURGER — FULL-SCREEN MOBILE MENU (FIXED)
     ========================================================= */
  const hamburger = document.getElementById('hamburger');
  const navList = document.getElementById('navList');

  function closeMenu() {
    if (!navList || !hamburger) return;
    navList.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  }

  function openMenu() {
    if (!navList || !hamburger) return;
    navList.classList.add('open');
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
  }

  function toggleMenu() {
    if (!navList) return;
    if (navList.classList.contains('open')) closeMenu();
    else openMenu();
  }

  if (hamburger && navList) {
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-controls', 'navList');

    // Toggle on hamburger click
    hamburger.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleMenu();
    });

    // Close when a nav link is clicked
    navList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function() {
        closeMenu();
      });
    });

    // Close on outside click (but not when clicking inside nav or hamburger)
    document.addEventListener('click', function(e) {
      if (!navList.classList.contains('open')) return;
      if (hamburger.contains(e.target)) return;
      if (navList.contains(e.target)) return;
      closeMenu();
    });

    // Close on Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && navList.classList.contains('open')) {
        closeMenu();
      }
    });

    // Close menu if viewport is resized to desktop
    let resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        if (window.innerWidth > 768 && navList.classList.contains('open')) {
          closeMenu();
        }
      }, 150);
    });
  }

  /* =========================================================
     HEADER SCROLL STATE
     ========================================================= */
  const header = document.getElementById('siteHeader');
  if (header) {
    window.addEventListener('scroll', function() {
      const y = window.pageYOffset || document.documentElement.scrollTop;
      if (y > 60) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    }, { passive: true });
  }

  /* =========================================================
     SCROLL ANIMATIONS
     ========================================================= */
  const fadeElements = document.querySelectorAll(
    '.about, .gallery, .contact, .featured-cta, .visual-cta, .card-grid, .blog-grid, .project-grid'
  );
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    fadeElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(32px)';
      el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
      observer.observe(el);
    });
  }

  /* =========================================================
     SMOOTH SCROLL (same-page anchors)
     ========================================================= */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const offset = 80;
        const top = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* =========================================================
     ACTIVE NAV LINK
     ========================================================= */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-list a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) link.classList.add('active');
  });

});