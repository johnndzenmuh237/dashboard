/* ==========================================================================
   CryptoTradePro — wallet.js
   Wallets, deposit/withdraw, and transaction-related interactivity.
   No real keys, addresses, or fund movement are handled here — this is a
   front-end demo simulating the flow only.
   ========================================================================== */

(function () {
  'use strict';

  function initCopyButtons() {
    document.querySelectorAll('[data-copy]').forEach((btn) => {
      btn.addEventListener('click', function () {
        const text = btn.getAttribute('data-copy');
        const fallbackCopy = () => {
          const temp = document.createElement('textarea');
          temp.value = text;
          temp.style.position = 'fixed';
          temp.style.opacity = '0';
          document.body.appendChild(temp);
          temp.select();
          try { document.execCommand('copy'); } catch (e) {}
          temp.remove();
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).catch(fallbackCopy);
        } else {
          fallbackCopy();
        }

        showToast({ type: 'success', title: 'Address copied', message: 'Wallet address copied to clipboard.' });
      });
    });
  }

  function initDepositModal() {
    const coinSelect = document.querySelector('#depositCoinSelect');
    const addressBox = document.querySelector('#depositAddress');
    if (!coinSelect || !addressBox) return;

    const sampleAddresses = {
      btc: 'bc1q9h5yjk2xz3r0n8q4v6w7e1s2d3f4g5h6j7k8l9',
      eth: '0x7a3f9c2b1e8d4a6c5b9e0f1d2a3c4b5e6f7a8b9c',
      usdt: 'TQn9Y2khEsLMG8aXc6kg1Z8jX3aZ1xqJpY'
    };

    coinSelect.addEventListener('change', function () {
      const addr = sampleAddresses[coinSelect.value] || sampleAddresses.btc;
      addressBox.textContent = addr;
      const copyBtn = document.querySelector('#copyDepositAddress');
      if (copyBtn) copyBtn.setAttribute('data-copy', addr);
    });
  }

  function initWithdrawForm() {
    const form = document.querySelector('#withdrawForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const amount = document.querySelector('#withdrawAmount');
      const address = document.querySelector('#withdrawAddress');

      let valid = true;
      [amount, address].forEach((field) => {
        if (!field) return;
        const group = field.closest('.form-group');
        if (!field.value.trim()) {
          if (group) group.classList.add('has-error');
          valid = false;
        } else if (group) {
          group.classList.remove('has-error');
        }
      });

      if (!valid) {
        showToast({ type: 'error', title: 'Missing information', message: 'Please complete all required fields.' });
        return;
      }

      showToast({
        type: 'success',
        title: 'Withdrawal requested',
        message: 'This demo does not move real funds.'
      });
      form.reset();
      const overlay = form.closest('.modal-overlay');
      if (overlay) overlay.classList.remove('open');
    });
  }

  function initSendReceiveToggle() {
    const sendBtn = document.querySelector('#showSendModal');
    const receiveBtn = document.querySelector('#showReceiveModal');
    if (sendBtn) sendBtn.addEventListener('click', () => document.querySelector('#withdrawModal')?.classList.add('open'));
    if (receiveBtn) receiveBtn.addEventListener('click', () => document.querySelector('#depositModal')?.classList.add('open'));
  }

  /* Transaction filter chips on transactions.html */
  function initTxFilters() {
    const chips = document.querySelectorAll('.filter-chip[data-tx-filter]');
    const rows = document.querySelectorAll('[data-tx-type]');
    if (!chips.length) return;

    chips.forEach((chip) => {
      chip.addEventListener('click', function () {
        chips.forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        const filter = chip.getAttribute('data-tx-filter');
        rows.forEach((row) => {
          row.style.display = (filter === 'all' || row.getAttribute('data-tx-type') === filter) ? '' : 'none';
        });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initCopyButtons();
    initDepositModal();
    initWithdrawForm();
    initSendReceiveToggle();
    initTxFilters();
  });
})();
