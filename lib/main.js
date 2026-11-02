/*
 * Two Jay Ventures — main.js
 *
 * Loaded with <script src="lib/main.js" defer> so the DOM is ready on execution.
 * Entire file is wrapped in an IIFE — no globals attached to window.
 *
 * Security notes:
 *  - Email address assembled only on a real click (① anti-scrape).
 *  - Cal.com URL defined once as CAL_URL const (⑥ easy to swap to custom domain).
 *  - All event binding via addEventListener — no inline handlers (②).
 *  - IIFE scope — no variables leak to window (⑧).
 */
(function () {
  'use strict';

  /* ── ⑥ Booking URL ─────────────────────────────────────────────────────
   * Update to custom domain when cal.twojay.vc is live.               */
  var CAL_URL = 'https://cal.com/jonathan.jenin/discovery';

  /* ── ① Email — never in the HTML source or the rendered DOM ────────────
   * Two reversed segments joined by unicode \u0040 (@), assembled only
   * inside a trusted click handler. Scrapers that read the source, or that
   * render the page with JS, never see the address; scripted .click()
   * calls are ignored (isTrusted is false for synthetic events).      */
  function rev(s) { return s.split('').reverse().join(''); }
  function email() { return rev('nahtanoj') + '\u0040' + rev('cv.yajowt'); }

  /* ── Inject cal.com href on all .js-cal anchors ───────────────────── */
  [].forEach.call(document.querySelectorAll('a.js-cal'), function (el) {
    el.href = CAL_URL;
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener noreferrer');
  });

  /* ── Open the mail client on a real click on .js-email anchors ───── */
  [].forEach.call(document.querySelectorAll('a.js-email'), function (el) {
    el.addEventListener('click', function (e) {
      if (!e.isTrusted) return;
      e.preventDefault();
      window.location.href = 'mailto:' + email();
    });
  });

  /* ── ② Language toggle ────────────────────────────────────────────── */
  var lang    = 'en';
  var langBtn = document.getElementById('langBtn');
  if (langBtn) {
    langBtn.addEventListener('click', function () {
      lang = lang === 'en' ? 'fr' : 'en';
      langBtn.textContent = lang === 'en' ? 'FR' : 'EN';
      langBtn.setAttribute('aria-label', lang === 'en' ? 'Passer en français' : 'Switch to English');
      document.documentElement.lang = lang;
      [].forEach.call(document.querySelectorAll('[data-en]'), function (el) {
        var val = el.getAttribute('data-' + lang);
        if (val !== null) el.innerHTML = val;
      });
    });
  }

}());
