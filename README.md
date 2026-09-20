# STACKLY — Enterprise Software Website

A complete, premium enterprise SaaS marketing site + product dashboards, built with
**pure HTML5 + CSS3 + Vanilla JavaScript**. No frameworks. Animations via GSAP,
ScrollTrigger and AOS (CDN only).

## Quick Start

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .            # or
python3 -m http.server 8000
```

## Pages

| Page | Description |
|---|---|
| `index.html` | Homepage: cinematic hero, product dashboard, industries, automation flow, case study, testimonials, pricing, FAQ, CTA |
| `about.html` | Story, mission/vision, values, leadership, stats, technology |
| `services.html` | 9 service modules + 5-phase delivery process timeline |
| `blog.html` | Featured article, category filters, live search, load more |
| `pricing.html` | Monthly/annual toggle, full comparison table, FAQ |
| `faq.html` | 6 categorized sections + live search |
| `contact.html` | Validated contact form + animated success state |
| `login.html` | Demo auth with User/Admin role selection |
| `register.html` | Full validation, terms checkbox, redirect to login |
| `dashboard.html` | Enterprise dashboard: charts, donut, tasks, activity, tables |
| `seller-dashboard.html` | Seller view: sales, orders, inventory, profile |
| `404.html` | Animated 404 with `history.back()` support |

## Demo Authentication

Login/Register are **front-end demos only** (localStorage/sessionStorage).
Any email + password (min 6 chars) signs you in. No real credentials are used
or transmitted. Uncomment the redirect lines in `assets/js/dashboard.js` to
enforce a hard auth gate.

## Structure

```
STACKLY/
├── *.html (12 pages)
├── assets/
│   ├── css/   style.css · responsive.css · animations.css · dashboard.css · auth.css
│   ├── js/    main.js · navigation.js · animations.js · auth.js · dashboard.js · components.js
│   ├── svg/   logo, hero lines, waves, patterns, icons, illustrations
│   └── img/   hero · about · industries · blog · dashboard · cta (optimized WebP)
└── README.md
```

## Design System

- Ivory `#FBFAF7` / White surfaces, charcoal `#171717` type
- Cherry red `#A71930` accent, burgundy `#5E0B18`, gold `#C8A04A` highlights
- Fraunces (editorial serif) + Inter (UI sans)
- CSS variables in `:root` — change the brand in one place

## Notes

- Imagery: royalty-free sourced photography, optimized to WebP.
  Replace with licensed brand assets before production use.
- All charts are hand-rolled SVG drawn by vanilla JS (no chart library).
- Responsive from 320px to 4K; mobile nav, swipe-free layouts, no horizontal overflow.
- Accessibility: semantic landmarks, ARIA labels, keyboard-operable menus,
  visible focus states, `prefers-reduced-motion` respected.
