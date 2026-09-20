
/* ==========================================================================
   STACKLY — components.js
   Shared dynamic components: particles on inner page heroes
   ========================================================================== */
(function () {
  'use strict';
  document.querySelectorAll('[data-hero-particles]').forEach(function (zone) {
    var n = parseInt(zone.getAttribute('data-hero-particles'), 10) || 10;
    for (var i = 0; i < n; i++) {
      var s = document.createElement('span');
      s.style.cssText = 'position:absolute;width:' + (3 + Math.random() * 5) + 'px;height:' +
        (3 + Math.random() * 5) + 'px;border-radius:50%;left:' + Math.random() * 100 +
        '%;top:' + Math.random() * 100 + '%;pointer-events:none;' +
        'background:radial-gradient(circle,rgba(200,160,74,.7),transparent 70%);opacity:.5;';
      zone.appendChild(s);
      if (window.gsap) {
        gsap.to(s, { y: -(30 + Math.random() * 60), x: (Math.random() - 0.5) * 40,
          duration: 4 + Math.random() * 4, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: Math.random() * 2 });
      }
    }
  });
})();

(function () {
  'use strict';
  /* Process timeline fill animation */
  var fill = document.querySelector('[data-progress]');
  if (fill) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          fill.style.transition = 'height 2.4s cubic-bezier(.22,1,.36,1)';
          fill.style.height = '100%';
          io.disconnect();
        }
      });
    }, { threshold: 0.2 });
    io.observe(fill.closest('.process'));
  }
})();
