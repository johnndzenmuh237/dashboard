/* ==========================================================================
   CryptoTradePro — trading.js
   Order entry form behavior for trading.html. All orders are simulated
   client-side (no real exchange connection) — this is UI/demo logic only.
   ========================================================================== */

(function () {
  'use strict';

  function initSideToggle() {
    const buyBtn = document.querySelector('.side-buy');
    const sellBtn = document.querySelector('.side-sell');
    const submitBtn = document.querySelector('#orderSubmitBtn');
    if (!buyBtn || !sellBtn) return;

    function setSide(side) {
      buyBtn.classList.toggle('active', side === 'buy');
      sellBtn.classList.toggle('active', side === 'sell');
      if (submitBtn) {
        submitBtn.textContent = side === 'buy' ? 'Buy BTC' : 'Sell BTC';
        submitBtn.className = 'btn btn-block btn-lg ' + (side === 'buy' ? 'btn-primary' : 'btn-danger');
      }
    }

    buyBtn.addEventListener('click', () => setSide('buy'));
    sellBtn.addEventListener('click', () => setSide('sell'));
  }

  function initOrderTypeTabs() {
    const tabs = document.querySelectorAll('.order-type-tabs .tab-btn');
    const stopFields = document.querySelector('#stopPriceField');
    tabs.forEach((tab) => {
      tab.addEventListener('click', function () {
        tabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        if (stopFields) {
          stopFields.style.display = tab.getAttribute('data-tab') === 'stop-limit' ? 'block' : 'none';
        }
        const priceField = document.querySelector('#limitPriceField');
        if (priceField) {
          priceField.style.display = tab.getAttribute('data-tab') === 'market' ? 'none' : 'block';
        }
      });
    });
  }

  function initPercentButtons() {
    const buttons = document.querySelectorAll('.percent-row button');
    const amountInput = document.querySelector('#orderAmount');
    const availableEl = document.querySelector('#availableBalance');
    if (!buttons.length || !amountInput) return;

    buttons.forEach((btn) => {
      btn.addEventListener('click', function () {
        const pct = parseInt(btn.getAttribute('data-pct'), 10);
        const available = availableEl ? parseFloat(availableEl.getAttribute('data-value') || '0') : 0;
        const amount = (available * pct) / 100;
        amountInput.value = amount.toFixed(6);
        updateOrderSummary();
      });
    });
  }

  function updateOrderSummary() {
    const amountInput = document.querySelector('#orderAmount');
    const priceInput = document.querySelector('#orderPrice');
    const totalEl = document.querySelector('#orderTotalValue');
    const feeEl = document.querySelector('#orderFeeValue');
    if (!amountInput || !totalEl) return;

    const amount = parseFloat(amountInput.value) || 0;
    const price = priceInput ? parseFloat(priceInput.value) || 0 : 67342.18;
    const total = amount * price;
    const fee = total * 0.001;

    totalEl.textContent = '$' + total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (feeEl) feeEl.textContent = '$' + fee.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function initOrderForm() {
    const form = document.querySelector('#orderForm');
    if (!form) return;

    const amountInput = document.querySelector('#orderAmount');
    const priceInput = document.querySelector('#orderPrice');
    [amountInput, priceInput].forEach((input) => {
      if (input) input.addEventListener('input', updateOrderSummary);
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const isBuy = document.querySelector('.side-buy').classList.contains('active');
      const amount = amountInput ? amountInput.value : '0';

      if (!amount || parseFloat(amount) <= 0) {
        showToast({ type: 'error', title: 'Enter an amount', message: 'Order amount must be greater than zero.' });
        return;
      }

      showToast({
        type: 'success',
        title: (isBuy ? 'Buy' : 'Sell') + ' order placed',
        message: amount + ' BTC at market — this is a simulated order.'
      });

      addOpenOrder(isBuy, amount);
      form.reset();
      updateOrderSummary();
    });
  }

  function addOpenOrder(isBuy, amount) {
    const tbody = document.querySelector('#openOrdersBody');
    if (!tbody) return;

    const emptyRow = tbody.querySelector('.empty-row');
    if (emptyRow) emptyRow.remove();

    const row = document.createElement('tr');
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    row.innerHTML =
      '<td>' + time + '</td>' +
      '<td>BTC/USDT</td>' +
      '<td><span class="pill ' + (isBuy ? 'pill-green' : 'pill-red') + '">' + (isBuy ? 'Buy' : 'Sell') + '</span></td>' +
      '<td>Limit</td>' +
      '<td class="cell-mono">$67,342.18</td>' +
      '<td class="cell-mono">' + amount + '</td>' +
      '<td><span class="pill pill-amber">Open</span></td>' +
      '<td><button class="btn btn-ghost btn-sm cancel-order-btn">Cancel</button></td>';
    tbody.prepend(row);

    row.querySelector('.cancel-order-btn').addEventListener('click', function () {
      row.remove();
      showToast({ type: 'warn', title: 'Order cancelled' });
    });
  }

  /* ------------------------------------------------------------------
     Simulated order book + recent trades render (static placeholder
     rows already in HTML — this just adds subtle live-tick updates)
  ------------------------------------------------------------------ */
  function initLiveTicks() {
    const priceEls = document.querySelectorAll('.pstat-value[data-live-price]');
    if (!priceEls.length) return;

    setInterval(function () {
      priceEls.forEach((el) => {
        const base = parseFloat(el.getAttribute('data-live-price'));
        const wiggle = base + (Math.random() - 0.5) * base * 0.0008;
        el.textContent = '$' + wiggle.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      });
    }, 2500);
  }

  document.addEventListener('DOMContentLoaded', function () {
    initSideToggle();
    initOrderTypeTabs();
    initPercentButtons();
    initOrderForm();
    initLiveTicks();
    updateOrderSummary();
  });
})();
