
/* ==========================================================================
   STACKLY — main.js
   Preloader · Header · Mobile menu · Search · Counters · FAQ ·
   Pricing toggle · Testimonials · Blog filter · Contact form · Newsletter
   ========================================================================== */
(function () {
  'use strict';

  /* ---------------- Preloader ---------------- */
  var preloader = document.querySelector('.preloader');
  if (preloader) {
    document.body.style.overflow = 'hidden';
    var bar = preloader.querySelector('.pl-bar span');
    var num = preloader.querySelector('.pl-num');
    var progress = { v: 0 };
    var done = false;

    function finishPreloader() {
      if (done) return;
      done = true;
      if (window.gsap) {
        gsap.to(progress, {
          v: 100, duration: 0.4, ease: 'power2.out', onUpdate: render,
          onComplete: hide
        });
      } else { hide(); }
    }
    function render() {
      var p = Math.round(progress.v);
      if (bar) bar.style.width = p + '%';
      if (num) num.textContent = (p < 10 ? '0' : '') + p;
    }
    function hide() {
      document.body.style.overflow = '';
      preloader.classList.add('done');
      if (window.gsap) {
        gsap.to(preloader, {
          opacity: 0, duration: 0.7, ease: 'power2.inOut', delay: 0.15,
          onComplete: function () { preloader.remove(); document.body.classList.add('loaded'); }
        });
      } else {
        preloader.style.transition = 'opacity .6s'; preloader.style.opacity = '0';
        setTimeout(function () { preloader.remove(); document.body.classList.add('loaded'); }, 650);
      }
    }
    // Animate to ~85% while loading, complete on window load (with safety cap)
    if (window.gsap) {
      gsap.to(progress, { v: 85, duration: 1.9, ease: 'power1.inOut', onUpdate: render });
    } else { progress.v = 85; render(); }
    window.addEventListener('load', finishPreloader);
    setTimeout(finishPreloader, 3800); // safety — never trap the user
    render();
  } else {
    document.body.classList.add('loaded');
  }

  /* ---------------- Header scroll state ---------------- */
  var header = document.querySelector('.site-header');
  function onScrollHeader() {
    if (!header) return;
    if (window.scrollY > 24) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------------- Active nav link ---------------- */
  var path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a, .mobile-menu nav a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === path) a.classList.add('active');
  });

  /* ---------------- Mobile menu ---------------- */
  var burger = document.querySelector('.hamburger');
  var mMenu = document.querySelector('.mobile-menu');
  if (burger && mMenu) {
    burger.addEventListener('click', function () {
      var open = mMenu.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open);
      document.body.classList.toggle('menu-locked', open);
    });
    mMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mMenu.classList.remove('open'); burger.classList.remove('open');
        document.body.classList.remove('menu-locked');
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mMenu.classList.contains('open')) {
        mMenu.classList.remove('open'); burger.classList.remove('open');
        document.body.classList.remove('menu-locked');
      }
    });
  }

  /* Mobile accordion */
  document.querySelectorAll('.mm-acc-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panel = btn.nextElementSibling;
      var isOpen = panel.style.maxHeight && panel.style.maxHeight !== '0px';
      document.querySelectorAll('.mm-acc-panel').forEach(function (p) { p.style.maxHeight = '0px'; });
      btn.classList.toggle('open', !isOpen);
      if (!isOpen) panel.style.maxHeight = panel.scrollHeight + 'px';
    });
  });

  /* ---------------- Search overlay ---------------- */
  var searchBtn = document.querySelector('[data-search-open]');
  var overlay = document.querySelector('.search-overlay');
  if (searchBtn && overlay) {
    var input = overlay.querySelector('input');
    var results = overlay.querySelector('.search-results');
    var PAGES = [
      { t: 'Enterprise Platform', u: 'index.html', k: 'home platform overview' },
      { t: 'About Stackly', u: 'about.html', k: 'about company story mission team' },
      { t: 'Services & Solutions', u: 'services.html', k: 'services erp crm automation analytics cloud security integration' },
      { t: 'Blog & Insights', u: 'blog.html', k: 'blog articles insights ai cloud leadership' },
      { t: 'Pricing Plans', u: 'pricing.html', k: 'pricing plans starter business enterprise cost' },
      { t: 'Frequently Asked Questions', u: 'faq.html', k: 'faq questions help support billing security' },
      { t: 'Contact Us', u: 'contact.html', k: 'contact sales demo support office' },
      { t: 'Sign In', u: 'login.html', k: 'login sign in account' },
      { t: 'Dashboard', u: 'dashboard.html', k: 'dashboard analytics reports' }
    ];
    function renderResults(q) {
      if (!results) return;
      var matches = PAGES.filter(function (p) {
        return !q || (p.t + ' ' + p.k).toLowerCase().indexOf(q.toLowerCase()) > -1;
      }).slice(0, 6);
      results.innerHTML = matches.map(function (m) {
        return '<a href="' + m.u + '"><span>' + m.t + '</span><span style="color:var(--gold-2)">&rarr;</span></a>';
      }).join('') || '<a><span>No results for &ldquo;' + q + '&rdquo;</span></a>';
    }
    searchBtn.addEventListener('click', function () {
      overlay.classList.add('open');
      document.body.classList.add('menu-locked');
      renderResults('');
      setTimeout(function () { input.focus(); }, 250);
    });
    overlay.querySelector('.so-close').addEventListener('click', closeSearch);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeSearch(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSearch(); });
    input.addEventListener('input', function () { renderResults(input.value.trim()); });
    function closeSearch() {
      overlay.classList.remove('open');
      document.body.classList.remove('menu-locked');
    }
  }

  /* ---------------- Language selector (visual demo) ---------------- */
  document.querySelectorAll('.lang-select').forEach(function (sel) {
    sel.addEventListener('click', function () {
      var cur = sel.querySelector('b');
      cur.textContent = cur.textContent === 'EN' ? 'DE' : 'EN';
    });
  });

  /* ---------------- Animated counters ---------------- */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        var el = en.target;
        var target = parseFloat(el.getAttribute('data-count'));
        var dec = el.getAttribute('data-decimals') ? parseInt(el.getAttribute('data-decimals'), 10) : 0;
        var dur = 1900, start = null;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 4);
          el.textContent = (target * eased).toFixed(dec);
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = target.toFixed(dec);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { io.observe(c); });
  }

  /* ---------------- FAQ accordion ---------------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var btn = item.querySelector('.faq-q');
    var ans = item.querySelector('.faq-a');
    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (o) {
        o.classList.remove('open');
        o.querySelector('.faq-a').style.maxHeight = '0px';
        o.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        ans.style.maxHeight = ans.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------------- Pricing toggle ---------------- */
  var billToggle = document.querySelector('.billing-toggle');
  if (billToggle) {
    var btns = billToggle.querySelectorAll('button');
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        btns.forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        var mode = b.getAttribute('data-bill');
        document.querySelectorAll('.plan-price .amount[data-monthly]').forEach(function (amt) {
          var val = mode === 'annual' ? amt.getAttribute('data-annual') : amt.getAttribute('data-monthly');
          if (window.gsap) {
            gsap.fromTo(amt, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out' });
          }
          amt.textContent = val;
        });
        document.querySelectorAll('.plan-price .per').forEach(function (per) {
          per.textContent = mode === 'annual' ? '/user /mo, billed annually' : '/user /month';
        });
      });
    });
  }

  /* ---------------- Testimonial slider ---------------- */
  var slider = document.querySelector('.t-slider');
  if (slider) {
    var track = slider.querySelector('.t-track');
    var slides = track.children.length;
    var dotsWrap = document.querySelector('.t-dots');
    var idx = 0, timer;
    for (var i = 0; i < slides; i++) {
      var d = document.createElement('button');
      d.className = 't-dot' + (i === 0 ? ' on' : '');
      d.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
      (function (n) {
        d.addEventListener('click', function () { go(n); restart(); });
      })(i);
      dotsWrap.appendChild(d);
    }
    function go(n) {
      idx = (n + slides) % slides;
      track.style.transform = 'translateX(-' + idx * 100 + '%)';
      dotsWrap.querySelectorAll('.t-dot').forEach(function (x, k) {
        x.classList.toggle('on', k === idx);
      });
    }
    function restart() { clearInterval(timer); timer = setInterval(function () { go(idx + 1); }, 6500); }
    document.querySelector('.t-arrow.next').addEventListener('click', function () { go(idx + 1); restart(); });
    document.querySelector('.t-arrow.prev').addEventListener('click', function () { go(idx - 1); restart(); });
    slider.addEventListener('mouseenter', function () { clearInterval(timer); });
    slider.addEventListener('mouseleave', restart);
    restart();
  }

  /* ---------------- Blog filter + load more ---------------- */
  var filterBar = document.querySelector('.blog-filters');
  if (filterBar) {
    var cards = Array.prototype.slice.call(document.querySelectorAll('.blog-card'));
    filterBar.querySelectorAll('.chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        filterBar.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('on'); });
        chip.classList.add('on');
        var cat = chip.getAttribute('data-filter');
        cards.forEach(function (card) {
          var show = cat === 'all' || card.getAttribute('data-cat') === cat;
          card.style.display = show ? '' : 'none';
          if (show && window.gsap) {
            gsap.fromTo(card, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
          }
        });
      });
    });
    var loadBtn = document.querySelector('[data-load-more]');
    if (loadBtn) {
      loadBtn.addEventListener('click', function () {
        document.querySelectorAll('.blog-card.hidden-card').forEach(function (c, i) {
          setTimeout(function () {
            c.classList.remove('hidden-card');
            c.style.display = '';
            if (window.gsap) gsap.fromTo(c, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
          }, i * 120);
        });
        loadBtn.style.display = 'none';
      });
    }
    var blogSearch = document.querySelector('[data-blog-search]');
    if (blogSearch) {
      blogSearch.addEventListener('input', function () {
        var q = blogSearch.value.toLowerCase();
        cards.forEach(function (card) {
          var txt = card.textContent.toLowerCase();
          card.style.display = (!q || txt.indexOf(q) > -1) ? '' : 'none';
        });
      });
    }
  }

  /* ---------------- FAQ page: category + search ---------------- */
  var faqSearch = document.querySelector('[data-faq-search]');
  if (faqSearch) {
    var faqCats = document.querySelectorAll('.faq-cat');
    faqSearch.addEventListener('input', function () {
      var q = faqSearch.value.toLowerCase();
      faqCats.forEach(function (cat) {
        var any = false;
        cat.querySelectorAll('.faq-item').forEach(function (item) {
          var hit = !q || item.textContent.toLowerCase().indexOf(q) > -1;
          item.style.display = hit ? '' : 'none';
          if (hit) any = true;
        });
        cat.style.display = any ? '' : 'none';
      });
    });
  }

  /* ---------------- Contact form ---------------- */
  var contactForm = document.querySelector('#contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      contactForm.querySelectorAll('[required]').forEach(function (f) {
        var field = f.closest('.field');
        var ok = f.value.trim() !== '';
        if (f.type === 'email') ok = ok && /^\S+@\S+\.\S+$/.test(f.value);
        field.classList.toggle('error', !ok);
        if (!ok) valid = false;
      });
      if (!valid) return;
      var success = document.querySelector('.contact-success');
      contactForm.style.display = 'none';
      success.classList.add('show');
      if (window.gsap) {
        gsap.fromTo(success, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' });
      }
    });
    contactForm.querySelectorAll('[required]').forEach(function (f) {
      f.addEventListener('input', function () { f.closest('.field').classList.remove('error'); });
    });
  }

  /* ---------------- Newsletter ---------------- */
  document.querySelectorAll('.newsletter-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input');
      if (!/^\S+@\S+\.\S+$/.test(input.value)) {
        input.style.borderBottom = '2px solid var(--primary)';
        input.focus();
        return;
      }
      input.value = '';
      showToast('You are subscribed. Welcome to Stackly.');
    });
  });

  /* ---------------- Toast ---------------- */
  var toastEl = null;
  window.showToast = function (msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      document.body.appendChild(toastEl);
    }
    toastEl.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg><span>' + msg + '</span>';
    requestAnimationFrame(function () { toastEl.classList.add('show'); });
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(function () { toastEl.classList.remove('show'); }, 3200);
  };

  /* ---------------- Back to top ---------------- */
  var toTop = document.querySelector('.to-top');
  if (toTop) {
    window.addEventListener('scroll', function () {
      toTop.classList.toggle('show', window.scrollY > 600);
    }, { passive: true });
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------------- Footer year ---------------- */
  document.querySelectorAll('[data-year]').forEach(function (y) {
    y.textContent = new Date().getFullYear();
  });
})();
