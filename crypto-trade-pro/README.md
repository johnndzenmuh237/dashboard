# CryptoTradePro

A complete, dark-themed crypto trading dashboard UI template — 14 pages, fully responsive, built with plain HTML, CSS, and JavaScript. No frameworks, no build step, no backend required.

> **Demo template.** Every price, balance, order, and chart in this template is simulated placeholder data generated in the browser. There is no real exchange connection, no real wallet, and no real fund movement anywhere in this codebase. It's a front-end starting point, not a working trading platform.

![Theme](https://img.shields.io/badge/theme-dark%20trading%20terminal-0ECB81) ![Stack](https://img.shields.io/badge/stack-HTML%2FCSS%2FJS-F0B90B) ![Charts](https://img.shields.io/badge/charts-ApexCharts-2172E5)

---

## What's included

**14 pages**, all sharing one consistent sidebar, top bar, and live-style ticker:

| Page | File | Purpose |
|---|---|---|
| Dashboard | `index.html` | Portfolio overview, stats, market snapshot |
| Markets | `markets.html` | Full sortable/filterable price table |
| Portfolio | `portfolio.html` | Holdings, allocation chart, performance |
| Trading | `trading.html` | Candlestick chart, order book, order entry form |
| Wallets | `wallets.html` | Per-asset balances, deposit/withdraw modals |
| Transactions | `transactions.html` | Filterable transaction history |
| Staking | `staking.html` | Stakeable assets, APR, stake modal |
| NFT Gallery | `nft.html` | NFT collection grid |
| Analytics | `analytics.html` | P&L, volume, and benchmark comparison charts |
| Profile | `profile.html` | Personal info, verification status, activity log |
| Settings | `settings.html` | Security, appearance, notifications, API keys |
| Sign in | `login.html` | Standalone auth layout |
| Create account | `register.html` | Standalone auth layout with password strength meter |
| Reset password | `forgot-password.html` | Two-step request/confirmation flow |

Plus a **documentation/** folder with installation, customization, and asset guides.

---

## File structure

```
crypto-trade-pro/
├── index.html ... (14 HTML pages at root)
│
├── assets/
│   ├── css/
│   │   ├── style.css        Design tokens, layout shell, components
│   │   ├── dashboard.css    Trading terminal, portfolio, wallet, staking layouts
│   │   ├── responsive.css   Breakpoints: 1200 / 1024 / 768 / 480px
│   │   ├── darkmode.css     Dark theme (default) + light theme override
│   │   └── themes.css       4 selectable accent palettes
│   │
│   ├── js/
│   │   ├── app.js           Sidebar, ticker, theme switching, toasts, mock data store
│   │   ├── charts.js        All ApexCharts initializers
│   │   ├── trading.js       Order form logic (trading.html)
│   │   ├── wallet.js        Deposit/withdraw/copy-address logic
│   │   ├── portfolio.js     Table sorting & filtering
│   │   └── settings.js      Settings nav, toggles, password form
│   │
│   ├── images/               ← you provide these (see below)
│   │   ├── logos/  crypto/  avatars/  backgrounds/  icons/
│   │
│   └── vendors/               (reserved — currently using CDN-hosted ApexCharts)
│
└── documentation/
    ├── installation.html
    ├── customization.html
    └── assets-guide.html
```

---

## Getting started

No build tools needed. Two options:

**Just open it:**
```
open index.html
```

**Or serve it locally** (recommended, avoids any local-file browser restrictions):
```bash
cd crypto-trade-pro
python3 -m http.server 8080
# visit http://localhost:8080
```

Full setup details: [`documentation/installation.html`](documentation/installation.html)

---

## Adding your images

This template ships **code only** — you provide the images. Drop files into `assets/images/` using the filenames already referenced in the code and they'll appear automatically, no markup changes needed:

- `logos/logo-mark.svg`, `logos/favicon.png`
- `crypto/btc.png`, `eth.png`, `bnb.png`, `sol.png`, `xrp.png`, `ada.png`, `doge.png`, `dot.png`, `matic.png`, `ltc.png`, `avax.png`, `link.png`
- `avatars/user-01.jpg`
- `backgrounds/nft-placeholder-1.jpg` through `nft-placeholder-6.jpg`

Full filename list with recommended dimensions: [`documentation/assets-guide.html`](documentation/assets-guide.html)

---

## Design system

- **Palette** — near-black base (`#0B0E11`) with green/red/amber accents in the spirit of major trading terminals, fully driven by CSS custom properties in `style.css`.
- **Typography** — [Inter](https://fonts.google.com/specimen/Inter) for UI text, [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) for every number (prices, balances, percentages) so figures stay legible and properly aligned.
- **Theming** — light/dark mode and 4 accent palettes (Classic, Ocean, Violet, Terminal) are switchable at runtime from Settings → Preferences, persisted via `localStorage`.
- **Charts** — [ApexCharts](https://apexcharts.com/) (loaded via CDN) powers the candlestick trading chart, portfolio area chart, allocation donut, and analytics bar/line charts.

Full customization guide: [`documentation/customization.html`](documentation/customization.html)

---

## Responsive behavior

| Breakpoint | Behavior |
|---|---|
| ≤ 1200px | Stat grids collapse to 2 columns, trading layout stacks |
| ≤ 1024px | Sidebar collapses to icon-only rail |
| ≤ 768px | Sidebar becomes an off-canvas drawer (hamburger menu), grids go single/double column |
| ≤ 480px | Tightest mobile layout, simplified ticker and percent buttons |

All interactive components (modals, tabs, dropdowns, toggles) are touch-friendly and keyboard-accessible with visible focus states.

---

## Important notes

- **No backend.** All data lives in `assets/js/app.js` (`MarketData` object) and is regenerated/randomized client-side on load. Wire up a real API by replacing that one object — every page already expects its exact shape.
- **No real auth, wallets, or fund movement.** `login.html`, `register.html`, deposit/withdraw modals, and the order form are all UI-only simulations with client-side validation. Treat any real authentication or financial integration as a separate, security-reviewed effort.
- **Browser storage in artifacts/previews:** if you preview these files inside an environment that blocks `localStorage`, theme/accent selection simply won't persist between reloads — everything else still works.

---

## License

This template's code is yours to use, modify, and ship in your own projects. You are responsible for supplying your own image assets, branding, and any backend or financial integrations.
