
/* ==========================================================================
   STACKLY — auth.js
   Demo authentication (localStorage) · validation · role selection
   NOTE: demo only — no real credentials are transmitted or stored securely.
   ========================================================================== */
(function () {
  'use strict';

  /* Password visibility toggles */
  document.querySelectorAll('.pw-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var input = btn.closest('.control').querySelector('input');
      var show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.querySelector('span').textContent = show ? 'Hide' : 'Show';
    });
  });

  /* Role cards */
  document.querySelectorAll('.role-card').forEach(function (card) {
    card.addEventListener('click', function () {
      document.querySelectorAll('.role-card').forEach(function (c) { c.classList.remove('on'); });
      card.classList.add('on');
      card.querySelector('input').checked = true;
    });
  });

  function setErr(field, on) {
    field.classList.toggle('error', on);
    return !on;
  }
  function validEmail(v) { return /^\S+@\S+\.\S+$/.test(v); }

  /* ---------- LOGIN ---------- */
  var loginForm = document.querySelector('#loginForm');
  if (loginForm) {
    // Prefill demo credentials hint (visual only)
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = loginForm.querySelector('#email');
      var pass = loginForm.querySelector('#password');
      var ok = true;
      ok = setErr(email.closest('.field'), !validEmail(email.value)) && ok;
      ok = setErr(pass.closest('.field'), pass.value.length < 6) && ok;
      if (!ok) return;
      var role = loginForm.querySelector('input[name="role"]:checked');
      role = role ? role.value : 'user';
      var users = JSON.parse(localStorage.getItem('stackly_users') || '[]');
      var known = users.some(function (u) { return u.email === email.value; });
      if (!known) {
        users.push({ name: email.value.split('@')[0], email: email.value, role: role });
        localStorage.setItem('stackly_users', JSON.stringify(users));
      }
      sessionStorage.setItem('stackly_session', JSON.stringify({
        email: email.value, role: role, name: email.value.split('@')[0]
      }));
      var box = document.querySelector('.auth-success');
      if (box) {
        loginForm.style.display = 'none';
        document.querySelector('.auth-alt').style.display = 'none';
        box.classList.add('show');
        if (window.gsap) gsap.fromTo(box, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.5)' });
      }
      setTimeout(function () {
        window.location.href = role === 'admin' ? 'dashboard.html' : 'dashboard.html';
      }, 1200);
    });
  }

  /* ---------- REGISTER ---------- */
  var regForm = document.querySelector('#registerForm');
  if (regForm) {
    regForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = regForm.querySelector('#fullname');
      var email = regForm.querySelector('#email');
      var pass = regForm.querySelector('#password');
      var confirm = regForm.querySelector('#confirm');
      var terms = regForm.querySelector('#terms');
      var ok = true;
      ok = setErr(name.closest('.field'), name.value.trim().length < 2) && ok;
      ok = setErr(email.closest('.field'), !validEmail(email.value)) && ok;
      ok = setErr(pass.closest('.field'), pass.value.length < 8) && ok;
      ok = setErr(confirm.closest('.field'), confirm.value !== pass.value || confirm.value === '') && ok;
      if (!terms.checked) {
        ok = false;
        if (window.showToast) showToast('Please accept the Terms & Conditions.');
        terms.closest('.check').style.color = 'var(--primary)';
      } else {
        terms.closest('.check').style.color = '';
      }
      if (!ok) return;
      var role = regForm.querySelector('input[name="role"]:checked');
      var users = JSON.parse(localStorage.getItem('stackly_users') || '[]');
      users.push({ name: name.value.trim(), email: email.value, role: role ? role.value : 'user' });
      localStorage.setItem('stackly_users', JSON.stringify(users));
      var box = document.querySelector('.auth-success');
      if (box) {
        regForm.style.display = 'none';
        document.querySelector('.auth-alt').style.display = 'none';
        box.classList.add('show');
        if (window.gsap) gsap.fromTo(box, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.5)' });
      }
      setTimeout(function () { window.location.href = 'login.html'; }, 1400);
    });
    regForm.querySelectorAll('input').forEach(function (f) {
      f.addEventListener('input', function () { f.closest('.field').classList.remove('error'); });
    });
  }
})();
