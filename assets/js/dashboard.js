
/* ==========================================================================
   STACKLY — dashboard.js
   Auth guard · sidebar · charts (vanilla SVG/canvas) · tasks ·
   notifications · live simulation
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- Auth guard (demo) ---------- */
  var session = null;
  try { session = JSON.parse(sessionStorage.getItem('stackly_session')); } catch (e) {}
  var userNameEl = document.querySelector('[data-user-name]');
  var userRoleEl = document.querySelector('[data-user-role]');
  var avaEls = document.querySelectorAll('[data-user-ava]');
  if (session) {
    if (userNameEl) userNameEl.textContent = session.name;
    if (userRoleEl) userRoleEl.textContent = session.role === 'admin' ? 'Administrator' : 'User';
    avaEls.forEach(function (a) { a.textContent = session.name.charAt(0).toUpperCase(); });
  } else {
    // Not signed in → offer demo session instead of hard lockout so the
    // demo remains explorable; comment the next two lines to enforce redirect.
    session = { name: 'Harini', role: 'admin' };
  }
  document.querySelectorAll('[data-guard]').forEach(function () {});

  /* ---------- Sidebar (mobile) ---------- */
  var side = document.querySelector('.dash-side');
  var burger = document.querySelector('.dash-burger');
  var overlay = document.querySelector('.dash-side-overlay');
  if (burger && side) {
    burger.addEventListener('click', function () {
      side.classList.toggle('open');
      if (overlay) overlay.classList.toggle('show', side.classList.contains('open'));
    });
    if (overlay) overlay.addEventListener('click', function () {
      side.classList.remove('open'); overlay.classList.remove('show');
    });
  }
  document.querySelectorAll('.ds-link').forEach(function (l) {
    l.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelectorAll('.ds-link').forEach(function (x) { x.classList.remove('on'); });
      l.classList.add('on');
      if (side && side.classList.contains('open')) {
        side.classList.remove('open');
        if (overlay) overlay.classList.remove('show');
      }
      var label = l.querySelector('span').textContent.trim();
      var title = document.querySelector('[data-dash-title]');
      if (title) title.textContent = label;
    });
  });

  /* ---------- Sign out ---------- */
  document.querySelectorAll('[data-signout]').forEach(function (b) {
    b.addEventListener('click', function () {
      sessionStorage.removeItem('stackly_session');
      window.location.href = 'login.html';
    });
  });

  /* ---------- Notification bell ---------- */
  var bell = document.querySelector('[data-bell]');
  if (bell) {
    bell.addEventListener('click', function () {
      bell.classList.remove('bell-ring');
      void bell.offsetWidth;
      bell.classList.add('bell-ring');
      if (window.showToast) showToast('3 new notifications — all caught up.');
    });
  }

  /* ---------- Tasks ---------- */
  document.querySelectorAll('.task-row').forEach(function (row) {
    row.querySelector('.task-check').addEventListener('click', function () {
      row.classList.toggle('done');
      updateTaskCount();
    });
  });
  function updateTaskCount() {
    var open = document.querySelectorAll('.task-row:not(.done)').length;
    var el = document.querySelector('[data-open-tasks]');
    if (el) el.textContent = open;
  }

  /* ---------- Vanilla SVG line chart with live drawing ---------- */
  function buildLineChart(svg, series, opts) {
    if (!svg) return;
    var NS = 'http://www.w3.org/2000/svg';
    var W = 600, H = opts.height || 260, PAD = 8;
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    var defs = document.createElementNS(NS, 'defs');
    defs.innerHTML = '<linearGradient id="areaG" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#A71930" stop-opacity="0.22"/>' +
      '<stop offset="1" stop-color="#A71930" stop-opacity="0"/></linearGradient>' +
      '<linearGradient id="lineG" x1="0" y1="0" x2="1" y2="0">' +
      '<stop offset="0" stop-color="#A71930"/><stop offset="1" stop-color="#C8A04A"/></linearGradient></defs>';
    svg.appendChild(defs);
    // gridlines
    for (var g = 1; g <= 3; g++) {
      var gl = document.createElementNS(NS, 'line');
      gl.setAttribute('x1', 0); gl.setAttribute('x2', W);
      gl.setAttribute('y1', (H / 4) * g); gl.setAttribute('y2', (H / 4) * g);
      gl.setAttribute('stroke', 'rgba(23,23,23,.05)');
      svg.appendChild(gl);
    }
    series.forEach(function (s) {
      var data = s.data, max = Math.max.apply(null, data) * 1.15;
      var pts = data.map(function (v, i) {
        return [PAD + (i * (W - PAD * 2)) / (data.length - 1), H - 14 - (v / max) * (H - 40)];
      });
      var path = pts.map(function (p, i) {
        return (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ' ' + p[1].toFixed(1);
      }).join(' ');
      if (s.fill) {
        var area = document.createElementNS(NS, 'path');
        area.setAttribute('d', path + ' L ' + (W - PAD) + ' ' + (H - 14) + ' L ' + PAD + ' ' + (H - 14) + ' Z');
        area.setAttribute('fill', 'url(#areaG)');
        svg.appendChild(area);
      }
      var line = document.createElementNS(NS, 'path');
      line.setAttribute('d', path);
      line.setAttribute('fill', 'none');
      line.setAttribute('stroke', s.color || 'url(#lineG)');
      line.setAttribute('stroke-width', s.width || 2.5);
      line.setAttribute('stroke-linecap', 'round');
      line.classList.add('main-line');
      svg.appendChild(line);
      var last = pts[pts.length - 1];
      var dot = document.createElementNS(NS, 'circle');
      dot.setAttribute('cx', last[0]); dot.setAttribute('cy', last[1]);
      dot.setAttribute('r', 4.5); dot.setAttribute('fill', '#C8A04A');
      dot.setAttribute('stroke', '#fff'); dot.setAttribute('stroke-width', 2);
      svg.appendChild(dot);
    });
    // animate
    var lines = svg.querySelectorAll('.main-line');
    lines.forEach(function (l) {
      var len = l.getTotalLength();
      l.style.strokeDasharray = len;
      l.style.strokeDashoffset = len;
      l.getBoundingClientRect();
      l.style.transition = 'stroke-dashoffset 1.8s cubic-bezier(.22,1,.36,1)';
      l.style.strokeDashoffset = '0';
    });
  }

  buildLineChart(document.querySelector('#mainChart'),
    [{ data: [22, 34, 30, 46, 38, 58, 52, 70, 64, 84, 78, 96], fill: true },
     { data: [14, 22, 26, 30, 34, 40, 44, 50, 56, 60, 66, 72], color: 'rgba(200,160,74,.55)', width: 2 }],
    { height: 280 });

  buildLineChart(document.querySelector('#salesChart'),
    [{ data: [8, 14, 11, 20, 17, 28, 24, 36, 31, 44, 40, 56], fill: true }],
    { height: 280 });

  /* Chart range chips */
  document.querySelectorAll('[data-chart-range]').forEach(function (chip) {
    chip.addEventListener('click', function () {
      var wrap = chip.closest('.panel');
      wrap.querySelectorAll('[data-chart-range]').forEach(function (c) { c.classList.remove('on'); });
      chip.classList.add('on');
      var base = [22, 34, 30, 46, 38, 58, 52, 70, 64, 84, 78, 96];
      var seed = parseInt(chip.getAttribute('data-chart-range'), 10);
      var data = base.map(function (v, i) { return Math.max(6, Math.round(v * (0.55 + seed * 0.22) + Math.sin(i + seed) * 8)); });
      buildLineChart(wrap.querySelector('svg.chart-target'),
        [{ data: data, fill: true }], { height: 280 });
    });
  });

  /* ---------- Donut chart ---------- */
  var donut = document.querySelector('#donutChart');
  if (donut) {
    var NS = 'http://www.w3.org/2000/svg';
    var segments = [
      { v: 42, c: '#A71930' }, { v: 27, c: '#C8A04A' },
      { v: 19, c: '#741020' }, { v: 12, c: '#E8D5A5' }
    ];
    var R = 70, CIRC = 2 * Math.PI * R, offset = 0;
    segments.forEach(function (s) {
      var circle = document.createElementNS(NS, 'circle');
      circle.setAttribute('cx', 84); circle.setAttribute('cy', 84);
      circle.setAttribute('r', R); circle.setAttribute('fill', 'none');
      circle.setAttribute('stroke', s.c); circle.setAttribute('stroke-width', 17);
      circle.setAttribute('stroke-dasharray', '0 ' + CIRC);
      circle.setAttribute('stroke-dashoffset', -offset);
      circle.setAttribute('stroke-linecap', 'butt');
      circle.style.transition = 'stroke-dasharray 1.4s cubic-bezier(.22,1,.36,1)';
      donut.appendChild(circle);
      offset += (s.v / 100) * CIRC;
    });
    setTimeout(function () {
      var off = 0;
      donut.querySelectorAll('circle').forEach(function (c, i) {
        var v = segments[i].v;
        c.setAttribute('stroke-dasharray', ((v / 100) * CIRC - 3) + ' ' + CIRC);
        c.setAttribute('stroke-dashoffset', -off);
        off += (v / 100) * CIRC;
      });
    }, 350);
  }

  /* ---------- Live KPI simulation ---------- */
  var live = document.querySelector('[data-live-revenue]');
  if (live) {
    var rev = 248400;
    setInterval(function () {
      rev += Math.round((Math.random() - 0.35) * 900);
      var display = (rev / 1000).toFixed(1) + 'K';
      live.textContent = '$' + display;
      var el = document.querySelector('[data-live-users]');
      if (el) el.textContent = (1.2 + Math.random() * 0.06).toFixed(1) + 'K';
    }, 4000);
  }

  /* Sidebar active default */
  var first = document.querySelector('.ds-link.on') || document.querySelector('.ds-link');
  if (first && !first.classList.contains('on')) first.classList.add('on');
})();
