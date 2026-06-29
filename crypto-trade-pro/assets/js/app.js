/* ==========================================================================
   CryptoTradePro — app.js
   Shared logic loaded on every page: sidebar/mobile nav, ticker strip,
   theme + accent switching, toast notifications, and the shared mock
   market-data store other scripts (charts.js, trading.js, etc.) read from.
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------
     Mock market data — single source of truth for placeholder data.
     Real implementations would replace MarketData with a live feed.
  ------------------------------------------------------------------ */
  const MarketData = {
    coins: [
      { id: 'btc', name: 'Bitcoin', ticker: 'BTC', price: 67342.18, change24h: 2.34, marketCap: 1324000000000, volume: 28400000000, img: 'assets/images/crypto/btc.png' },
      { id: 'eth', name: 'Ethereum', ticker: 'ETH', price: 3512.67, change24h: 1.12, marketCap: 422000000000, volume: 14200000000, img: 'assets/images/crypto/eth.png' },
      { id: 'bnb', name: 'BNB', ticker: 'BNB', price: 612.45, change24h: -0.84, marketCap: 89300000000, volume: 1800000000, img: 'assets/images/crypto/bnb.png' },
      { id: 'sol', name: 'Solana', ticker: 'SOL', price: 178.92, change24h: 5.67, marketCap: 84100000000, volume: 3900000000, img: 'assets/images/crypto/sol.png' },
      { id: 'xrp', name: 'XRP', ticker: 'XRP', price: 0.6234, change24h: -1.45, marketCap: 35200000000, volume: 1400000000, img: 'assets/images/crypto/xrp.png' },
      { id: 'ada', name: 'Cardano', ticker: 'ADA', price: 0.4821, change24h: 0.92, marketCap: 17100000000, volume: 412000000, img: 'assets/images/crypto/ada.png' },
      { id: 'doge', name: 'Dogecoin', ticker: 'DOGE', price: 0.1342, change24h: 3.21, marketCap: 19600000000, volume: 980000000, img: 'assets/images/crypto/doge.png' },
      { id: 'dot', name: 'Polkadot', ticker: 'DOT', price: 6.78, change24h: -2.13, marketCap: 9400000000, volume: 215000000, img: 'assets/images/crypto/dot.png' },
      { id: 'matic', name: 'Polygon', ticker: 'MATIC', price: 0.7156, change24h: 1.87, marketCap: 6800000000, volume: 312000000, img: 'assets/images/crypto/matic.png' },
      { id: 'ltc', name: 'Litecoin', ticker: 'LTC', price: 84.32, change24h: 0.45, marketCap: 6300000000, volume: 401000000, img: 'assets/images/crypto/ltc.png' },
      { id: 'avax', name: 'Avalanche', ticker: 'AVAX', price: 36.14, change24h: 4.02, marketCap: 13900000000, volume: 521000000, img: 'assets/images/crypto/avax.png' },
      { id: 'link', name: 'Chainlink', ticker: 'LINK', price: 14.87, change24h: -0.62, marketCap: 8700000000, volume: 298000000, img: 'assets/images/crypto/link.png' }
    ],

    getCoin(id) {
      return this.coins.find((c) => c.id === id);
    },

    formatUSD(value, decimals) {
      if (decimals === undefined) decimals = value >= 1 ? 2 : 4;
      return '$' + value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    },

    formatCompact(value) {
      if (value >= 1e12) return '$' + (value / 1e12).toFixed(2) + 'T';
      if (value >= 1e9) return '$' + (value / 1e9).toFixed(2) + 'B';
      if (value >= 1e6) return '$' + (value / 1e6).toFixed(2) + 'M';
      return '$' + value.toFixed(2);
    },

    formatChange(value) {
      const sign = value >= 0 ? '+' : '';
      return sign + value.toFixed(2) + '%';
    }
  };

  window.MarketData = MarketData;

  /* ------------------------------------------------------------------
     Sidebar — active link highlighting + mobile open/close
  ------------------------------------------------------------------ */
  function initSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const scrim = document.querySelector('.sidebar-scrim');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelectorAll('.nav-link');

    // Highlight current page in nav
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === currentPage) {
        link.classList.add('active');
      }
    });

    if (menuBtn && sidebar) {
      menuBtn.addEventListener('click', function () {
        sidebar.classList.add('open');
        if (scrim) scrim.classList.add('show');
        document.body.style.overflow = 'hidden';
      });
    }

    function closeSidebar() {
      if (sidebar) sidebar.classList.remove('open');
      if (scrim) scrim.classList.remove('show');
      document.body.style.overflow = '';
    }

    if (scrim) scrim.addEventListener('click', closeSidebar);

    navLinks.forEach((link) => link.addEventListener('click', closeSidebar));

    // Desktop collapse toggle
    const collapseBtn = document.querySelector('.sidebar-toggle');
    if (collapseBtn) {
      collapseBtn.addEventListener('click', function () {
        document.documentElement.classList.toggle('sidebar-collapsed');
        const collapsed = document.documentElement.classList.contains('sidebar-collapsed');
        try { localStorage.setItem('ctp_sidebar_collapsed', collapsed ? '1' : '0'); } catch (e) {}
      });
    }
  }

  /* ------------------------------------------------------------------
     Ticker strip — populates the scrolling price ticker on every page
  ------------------------------------------------------------------ */
  function initTicker() {
    const track = document.querySelector('.ticker-track');
    if (!track) return;

    const renderSet = MarketData.coins.map((coin) => {
      const dirClass = coin.change24h >= 0 ? 'up' : 'down';
      const arrow = coin.change24h >= 0 ? '▲' : '▼';
      return (
        '<span class="ticker-item">' +
          '<span class="sym">' + coin.ticker + '</span>' +
          '<span class="px">' + MarketData.formatUSD(coin.price) + '</span>' +
          '<span class="chg ' + dirClass + '">' + arrow + ' ' + MarketData.formatChange(coin.change24h) + '</span>' +
        '</span>'
      );
    }).join('');

    // Duplicate the set so the marquee loop is seamless at -50% transform
    track.innerHTML = renderSet + renderSet;
  }

  /* ------------------------------------------------------------------
     Theme + accent switching (persisted via localStorage)
  ------------------------------------------------------------------ */
  function initTheme() {
    const root = document.documentElement;
    let theme = 'dark';
    let accent = 'classic';
    try {
      theme = localStorage.getItem('ctp_theme') || 'dark';
      accent = localStorage.getItem('ctp_accent') || 'classic';
      if (localStorage.getItem('ctp_sidebar_collapsed') === '1') {
        root.classList.add('sidebar-collapsed');
      }
    } catch (e) {}

    root.setAttribute('data-theme', theme);
    root.setAttribute('data-accent', accent);

    document.querySelectorAll('.theme-toggle-btn').forEach((btn) => {
      btn.addEventListener('click', function () {
        const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        try { localStorage.setItem('ctp_theme', next); } catch (e) {}
      });
    });

    document.querySelectorAll('.theme-swatch').forEach((swatch) => {
      swatch.addEventListener('click', function () {
        const value = swatch.getAttribute('data-swatch');
        root.setAttribute('data-accent', value);
        try { localStorage.setItem('ctp_accent', value); } catch (e) {}
        document.querySelectorAll('.theme-swatch').forEach((s) => s.classList.remove('selected'));
        swatch.classList.add('selected');
      });
      if (swatch.getAttribute('data-swatch') === accent) {
        swatch.classList.add('selected');
      }
    });
  }

  /* ------------------------------------------------------------------
     Toast notifications — call window.showToast(opts) from any script
  ------------------------------------------------------------------ */
  function ensureToastContainer() {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      document.body.appendChild(container);
    }
    return container;
  }

  const ICONS = {
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-6"/></svg>',
    error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>',
    warn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4M12 17h.01M10.29 3.86l-8.18 14A1.5 1.5 0 0 0 3.43 20h17.14a1.5 1.5 0 0 0 1.32-2.14l-8.18-14a1.5 1.5 0 0 0-2.62 0z"/></svg>'
  };

  window.showToast = function (opts) {
    const settings = Object.assign({ type: 'success', title: 'Done', message: '', duration: 4200 }, opts);
    const container = ensureToastContainer();
    const toast = document.createElement('div');
    toast.className = 'toast' + (settings.type === 'error' ? ' toast-error' : settings.type === 'warn' ? ' toast-warn' : '');
    toast.innerHTML =
      (ICONS[settings.type] || ICONS.success) +
      '<div><div class="toast-title">' + settings.title + '</div>' +
      (settings.message ? '<div class="toast-msg">' + settings.message + '</div>' : '') + '</div>';
    container.appendChild(toast);
    setTimeout(function () {
      toast.style.transition = 'opacity .2s ease';
      toast.style.opacity = '0';
      setTimeout(function () { toast.remove(); }, 200);
    }, settings.duration);
  };

  /* ------------------------------------------------------------------
     Modal helpers — works with .modal-overlay / [data-modal-target]
  ------------------------------------------------------------------ */
  function initModals() {
    document.querySelectorAll('[data-modal-target]').forEach((trigger) => {
      trigger.addEventListener('click', function () {
        const target = document.getElementById(trigger.getAttribute('data-modal-target'));
        if (target) target.classList.add('open');
      });
    });
    document.querySelectorAll('[data-modal-close]').forEach((closer) => {
      closer.addEventListener('click', function () {
        closer.closest('.modal-overlay').classList.remove('open');
      });
    });
    document.querySelectorAll('.modal-overlay').forEach((overlay) => {
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) overlay.classList.remove('open');
      });
    });
  }

  /* ------------------------------------------------------------------
     Tabs — generic [data-tabs] / [data-tab] / [data-tab-panel] wiring
  ------------------------------------------------------------------ */
  function initTabs() {
    document.querySelectorAll('[data-tabs]').forEach((group) => {
      const buttons = group.querySelectorAll('.tab-btn');
      buttons.forEach((btn) => {
        btn.addEventListener('click', function () {
          const target = btn.getAttribute('data-tab');
          buttons.forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          group.querySelectorAll('.tab-panel').forEach((panel) => {
            panel.classList.toggle('active', panel.getAttribute('data-tab-panel') === target);
          });
        });
      });
    });
  }

  /* ------------------------------------------------------------------
     Dropdown menus (user menu, pair selector, etc.)
  ------------------------------------------------------------------ */
  function initDropdowns() {
    document.querySelectorAll('[data-dropdown-trigger]').forEach((trigger) => {
      const menu = document.getElementById(trigger.getAttribute('data-dropdown-trigger'));
      if (!menu) return;
      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        document.querySelectorAll('.dropdown-menu.open').forEach((m) => { if (m !== menu) m.classList.remove('open'); });
        menu.classList.toggle('open');
      });
    });
    document.addEventListener('click', function () {
      document.querySelectorAll('.dropdown-menu.open').forEach((m) => m.classList.remove('open'));
    });
  }

  /* ------------------------------------------------------------------
     Init on DOM ready
  ------------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initSidebar();
    initTicker();
    initModals();
    initTabs();
    initDropdowns();
  });
})();
