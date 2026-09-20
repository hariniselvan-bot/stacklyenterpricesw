
/* ==========================================================================
   STACKLY — animations.js
   GSAP hero timeline · ScrollTrigger reveals · SVG drawing ·
   parallax · flow sequence · hero particles
   ========================================================================== */
(function () {
  'use strict';
  if (!window.gsap) return;
  gsap.registerPlugin(ScrollTrigger);

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- HERO entrance timeline (runs after preloader) ---------- */
  var heroTl = gsap.timeline({ paused: true, defaults: { ease: 'power4.out' } });
  var header = document.querySelector('.site-header');
  var eyebrow = document.querySelector('.hero .eyebrow');
  var lines = document.querySelectorAll('.hero-title .line > span');
  var heroSub = document.querySelector('.hero-sub');
  var heroCtas = document.querySelector('.hero-ctas');
  var visual = document.querySelector('.hero-visual');
  var words = document.querySelector('.hero-words');
  var stats = document.querySelector('.stats-grid');

  if (lines.length) {
    if (eyebrow) heroTl.from(eyebrow, { y: 22, opacity: 0, duration: 0.7 }, 0);
    heroTl.to(lines, { y: 0, duration: 1.15, stagger: 0.13 }, 0.15);
    if (heroSub) heroTl.from(heroSub, { y: 26, opacity: 0, duration: 0.9 }, 0.85);
    if (heroCtas) heroTl.from(heroCtas, { y: 26, opacity: 0, duration: 0.9 }, 1.05);
    if (visual) heroTl.from(visual, { y: 90, opacity: 0, rotateX: 8, duration: 1.4, ease: 'expo.out' }, 0.9);
    if (words) heroTl.from(words, { opacity: 0, y: 30, duration: 0.9 }, 1.4);
    if (stats) heroTl.from(stats, { y: 50, opacity: 0, duration: 1 }, 1.25);
    heroTl.from('.float-card', { scale: 0.6, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'back.out(1.6)', clearProps: 'opacity,scale' }, 1.7);
    if (header) heroTl.from(header, { y: -70, opacity: 0, duration: 0.9 }, 0.1);

    function playHero() {
      if (reduced) { gsap.set(lines, { y: 0 }); return; }
      heroTl.play();
    }
    if (document.body.classList.contains('loaded')) playHero();
    else {
      var tries = 0;
      var iv = setInterval(function () {
        tries++;
        if (document.body.classList.contains('loaded') || tries > 100) {
          clearInterval(iv); playHero();
        }
      }, 50);
    }
  }

  /* ---------- Hero particles ---------- */
  var heroBg = document.querySelector('.hero-bg');
  if (heroBg && !reduced) {
    for (var i = 0; i < 14; i++) {
      var p = document.createElement('span');
      p.className = 'particle';
      var size = 3 + Math.random() * 6;
      p.style.width = p.style.height = size + 'px';
      p.style.left = Math.random() * 100 + '%';
      p.style.top = 20 + Math.random() * 70 + '%';
      heroBg.appendChild(p);
      gsap.to(p, {
        opacity: 0.4 + Math.random() * 0.5,
        y: -(40 + Math.random() * 90),
        x: (Math.random() - 0.5) * 60,
        duration: 4 + Math.random() * 4,
        repeat: -1, yoyo: true, ease: 'sine.inOut', delay: Math.random() * 3
      });
    }
  }

  /* ---------- Hero background SVG draw ---------- */
  document.querySelectorAll('.hero-lines path.draw-path').forEach(function (path) {
    var len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    gsap.to(path, {
      strokeDashoffset: 0, duration: 2.4, ease: 'power2.inOut', delay: 1.2,
      scrollTrigger: { trigger: '.hero', start: 'top 90%' }
    });
  });

  /* ---------- Generic reveal-up elements ---------- */
  gsap.utils.toArray('[data-reveal]').forEach(function (el) {
    gsap.from(el, {
      y: 46, opacity: 0, duration: 1, ease: 'power3.out',
      delay: parseFloat(el.getAttribute('data-delay') || 0),
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });

  /* ---------- Staggered card grids ---------- */
  gsap.utils.toArray('[data-stagger]').forEach(function (grid) {
    gsap.from(grid.children, {
      y: 54, opacity: 0, duration: 0.95, ease: 'power3.out', stagger: 0.1,
      scrollTrigger: { trigger: grid, start: 'top 84%' }
    });
  });

  /* ---------- Parallax images / art ---------- */
  gsap.utils.toArray('[data-parallax]').forEach(function (el) {
    var amt = parseFloat(el.getAttribute('data-parallax')) || 40;
    gsap.fromTo(el, { y: amt }, {
      y: -amt, ease: 'none',
      scrollTrigger: { trigger: el.closest('section') || el, start: 'top bottom', end: 'bottom top', scrub: 1.2 }
    });
  });

  /* ---------- Flow sequence: illuminate steps ---------- */
  var flowSteps = gsap.utils.toArray('.flow-step');
  if (flowSteps.length) {
    ScrollTrigger.create({
      trigger: '.flow-wrap', start: 'top 72%',
      onEnter: function () {
        flowSteps.forEach(function (s, i) {
          gsap.delayedCall(i * 0.28, function () { s.classList.add('lit'); });
        });
        var draw = document.querySelector('.flow-line-svg .draw');
        if (draw) {
          var len = draw.getTotalLength();
          gsap.set(draw, { strokeDasharray: len, strokeDashoffset: len });
          gsap.to(draw, { strokeDashoffset: 0, duration: flowSteps.length * 0.28 + 0.6, ease: 'power1.inOut' });
        }
      }, once: true
    });
  }

  /* ---------- Hero chart line drawing + live dot ---------- */
  var heroChart = document.querySelector('.mdash-chart .chart-line');
  if (heroChart) {
    var len2 = heroChart.getTotalLength();
    gsap.set(heroChart, { strokeDasharray: len2, strokeDashoffset: len2 });
    gsap.to(heroChart, {
      strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut', delay: 2.2,
      onComplete: function () {
        var dot = document.querySelector('.chart-dot-live');
        if (dot && !reduced) {
          gsap.to(dot, { opacity: 1, duration: 0.3 });
          gsap.to(dot, {
            motionPath: null, // graceful fallback: subtle pulse instead
            scale: 1.5, transformOrigin: 'center',
            duration: 0.8, repeat: -1, yoyo: true, ease: 'sine.inOut'
          });
        }
      }
    });
  }

  /* ---------- Dashboard bars grow on view ---------- */
  gsap.utils.toArray('[data-bars]').forEach(function (bars) {
    gsap.from(bars.children, {
      scaleY: 0, transformOrigin: 'bottom', duration: 1, ease: 'power3.out', stagger: 0.06,
      scrollTrigger: { trigger: bars, start: 'top 85%' }
    });
  });

  /* ---------- CTA rings slow rotation ---------- */
  gsap.utils.toArray('.cta-ring').forEach(function (ring, i) {
    gsap.to(ring, { rotate: i % 2 ? -360 : 360, duration: 40 + i * 12, repeat: -1, ease: 'none' });
  });

  /* ---------- Cursor spotlight on hero ---------- */
  var hero = document.querySelector('.hero');
  var spotlight = document.querySelector('.cursor-spotlight');
  if (hero && spotlight && window.matchMedia('(pointer: fine)').matches && !reduced) {
    var qx = gsap.quickTo(spotlight, 'x', { duration: 0.6, ease: 'power3' });
    var qy = gsap.quickTo(spotlight, 'y', { duration: 0.6, ease: 'power3' });
    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      qx(e.clientX - r.left); qy(e.clientY - r.top);
    });
  }
})();
