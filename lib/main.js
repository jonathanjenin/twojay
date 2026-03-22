/*
 * Two Jay Ventures — main.js
 *
 * Loaded with <script src="lib/main.js" defer> so the DOM is ready on execution.
 * Entire file is wrapped in an IIFE — no globals attached to window.
 *
 * Security notes:
 *  - Email address assembled at runtime from reversed parts (① anti-scrape).
 *  - Cal.com URL defined once as CAL_URL const (⑥ easy to swap to custom domain).
 *  - All event binding via addEventListener — no inline handlers (②).
 *  - IIFE scope — no variables leak to window (⑧).
 */
(function () {
  'use strict';

  /* ── ⑥ Booking URL ─────────────────────────────────────────────────────
   * Update to custom domain when cal.twojay.vc is live.               */
  var CAL_URL = 'https://cal.com/jonathan.jenin/discovery';

  /* ── ① Email — assembled at runtime, never in HTML source ─────────────
   * Two reversed segments joined by unicode \u0040 (@).
   * Defeats regex scrapers operating on raw HTML/JS source.           */
  function rev(s) { return s.split('').reverse().join(''); }
  var EMAIL = rev('nahtanoj') + '\u0040' + rev('cv.yajowt');

  /* ── Inject cal.com href on all .js-cal anchors ───────────────────── */
  [].forEach.call(document.querySelectorAll('a.js-cal'), function (el) {
    el.href = CAL_URL;
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener noreferrer');
  });

  /* ── Inject email href + display text on all .js-email anchors ────── */
  function injectEmail() {
    [].forEach.call(document.querySelectorAll('a.js-email'), function (el) {
      el.href = 'mailto:' + EMAIL;
      var t = el.textContent.trim();
      if (!t || t === '\u200B') {
        el.textContent = EMAIL;
      }
    });
  }
  injectEmail();

  /* ── ② Language toggle ────────────────────────────────────────────── */
  var lang    = 'en';
  var langBtn = document.getElementById('langBtn');
  if (langBtn) {
    langBtn.addEventListener('click', function () {
      lang = lang === 'en' ? 'fr' : 'en';
      langBtn.textContent = lang === 'en' ? 'FR' : 'EN';
      document.documentElement.lang = lang;
      [].forEach.call(document.querySelectorAll('[data-en]'), function (el) {
        var val = el.getAttribute('data-' + lang);
        if (val !== null) el.innerHTML = val;
      });
      /* Re-inject email text after lang swap (innerHTML wipe resets it) */
      injectEmail();
    });
  }

  /* ── Nav: transparent on hero → frosted on scroll ─────────────────── */
  var navEl  = document.getElementById('nav');
  var heroEl = document.querySelector('.hero');
  function updateNav() {
    if (!navEl || !heroEl) return;
    navEl.classList.toggle('scrolled', window.scrollY > heroEl.offsetHeight * 0.15);
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav(); /* run once on load */

  /* ── Fade-up on scroll ────────────────────────────────────────────── */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) e.target.classList.add('visible');
      });
    }, { threshold: 0.07 });
    [].forEach.call(document.querySelectorAll('.fade-up'), function (el) {
      io.observe(el);
    });
  } else {
    /* Fallback: show all fade-up elements immediately */
    [].forEach.call(document.querySelectorAll('.fade-up'), function (el) {
      el.classList.add('visible');
    });
  }

  /* ── Mobile nav ───────────────────────────────────────────────────── */
  var mobileBtn = document.getElementById('mobileBtn');
  var navLinks  = document.getElementById('navLinks');
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      mobileBtn.setAttribute('aria-expanded', String(open));
      if (open) navEl.classList.add('scrolled');
      else updateNav();
    });
    [].forEach.call(navLinks.querySelectorAll('a'), function (a) {
      a.addEventListener('click', function () {
        navLinks.classList.remove('open');
        mobileBtn.setAttribute('aria-expanded', 'false');
        updateNav();
      });
    });
  }

}());
