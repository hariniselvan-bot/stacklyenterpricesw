/* Shared marketing header for pages that do not contain one in their markup. */
(function () {
  'use strict';
  if (document.querySelector('.site-header')) return;

  var header = `
<header class="site-header">
  <div class="container header-inner">
    <a href="index.html" class="brand" aria-label="Stackly home"><svg class="mark" viewBox="0 0 48 48" fill="none" aria-hidden="true"><defs><linearGradient id="stkSg" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse"><stop stop-color="#A71930"/><stop offset="0.55" stop-color="#741020"/><stop offset="1" stop-color="#C8A04A"/></linearGradient></defs><path d="M35 14.5C32.6 10.2 27.6 8 22.3 9.1 16.6 10.3 12.9 14.6 13.7 19.6c.8 5.2 5.6 6.9 10.7 8.2 5.7 1.4 11.3 3 12.2 8.9.9 6.1-3.7 11-10.6 11.8-6.3.8-12-1.5-14.7-6.2" stroke="url(#stkSg)" stroke-width="4.6" stroke-linecap="round"/></svg><span class="wordmark">Stackly</span></a>
    <nav aria-label="Primary"><ul class="main-nav"><li><a href="index.html">Home</a></li><li><a href="services.html">Products</a></li><li><a href="services.html">Solutions</a></li><li><a href="blog.html">Resources</a></li><li><a href="pricing.html">Pricing</a></li><li><a href="about.html">About Us</a></li></ul></nav>
    <div class="header-actions">
      <button class="icon-btn" data-search-open aria-label="Search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#i-search"/></svg></button>
      <button class="lang-select" aria-label="Change language"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#i-globe"/></svg><b>EN</b><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><use href="#i-chevron"/></svg></button>
      <a href="contact.html" class="btn btn-primary btn-sm"><span>Request a Demo</span><svg class="arr" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><use href="#i-arrow"/></svg></a>
      <button class="hamburger" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button>
    </div>
  </div>
</header>
<div class="mobile-menu" aria-label="Mobile navigation"><a href="index.html" class="brand mm-brand" aria-label="Stackly home"><span class="wordmark">Stackly</span></a><nav><a href="index.html">Home</a><a href="services.html">Products</a><a href="services.html">Solutions</a><a href="blog.html">Resources</a><a href="pricing.html">Pricing</a><a href="about.html">About Us</a><a href="contact.html">Contact</a></nav><div class="mm-actions"><a href="contact.html" class="btn btn-primary">Request a Demo</a><a href="login.html" class="btn btn-outline">Sign In</a></div></div>
<div class="search-overlay" role="dialog" aria-label="Search Stackly"><button class="icon-btn so-close" aria-label="Close search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#i-plus"/></svg></button><input type="text" placeholder="Search Stackly..." aria-label="Search query"><p class="so-hint">Try “pricing”, “dashboard” or “security”</p><div class="search-results"></div></div>`;

  document.body.insertAdjacentHTML('afterbegin', header);
  document.body.classList.add('has-global-header');
})();
