
/* ==========================================================================
   STACKLY — navigation.js
   Dropdown keyboard access · smooth anchor scroll · scrollspy
   ========================================================================== */
(function () {
  'use strict';

  /* Dropdown keyboard support: Enter/Space opens, Escape closes */
  document.querySelectorAll('.main-nav > li > a').forEach(function (link) {
    if (!link.nextElementSibling || !link.nextElementSibling.classList.contains('dropdown')) return;
    link.setAttribute('aria-haspopup', 'true');
    link.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        var dd = link.nextElementSibling;
        var open = dd.style.opacity === '1';
        dd.style.opacity = open ? '' : '1';
        dd.style.visibility = open ? '' : 'visible';
        dd.style.pointerEvents = open ? '' : 'auto';
        dd.style.transform = open ? '' : 'translate(-50%, 0)';
        if (!open) dd.querySelector('a').focus();
      }
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.dropdown').forEach(function (dd) {
        dd.style.opacity = ''; dd.style.visibility = ''; dd.style.pointerEvents = ''; dd.style.transform = '';
      });
    }
  });

  /* Smooth in-page anchors */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();
