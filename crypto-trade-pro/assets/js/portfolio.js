/* ==========================================================================
   CryptoTradePro — portfolio.js
   Holdings table sorting/filtering for portfolio.html and markets.html.
   ========================================================================== */

(function () {
  'use strict';

  function initTableSort() {
    document.querySelectorAll('[data-sort-table]').forEach((table) => {
      const headers = table.querySelectorAll('th[data-sort-key]');
      headers.forEach((th) => {
        th.style.cursor = 'pointer';
        th.addEventListener('click', function () {
          const key = th.getAttribute('data-sort-key');
          const tbody = table.querySelector('tbody');
          const rows = Array.from(tbody.querySelectorAll('tr'));
          const isNumeric = th.getAttribute('data-sort-type') === 'number';
          const ascending = th.getAttribute('data-sort-dir') !== 'asc';

          rows.sort((a, b) => {
            let aVal = a.querySelector('[data-sort-value="' + key + '"]')?.getAttribute('data-value') || '';
            let bVal = b.querySelector('[data-sort-value="' + key + '"]')?.getAttribute('data-value') || '';
            if (isNumeric) {
              aVal = parseFloat(aVal) || 0;
              bVal = parseFloat(bVal) || 0;
              return ascending ? aVal - bVal : bVal - aVal;
            }
            return ascending ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
          });

          headers.forEach((h) => h.removeAttribute('data-sort-dir'));
          th.setAttribute('data-sort-dir', ascending ? 'asc' : 'desc');
          rows.forEach((row) => tbody.appendChild(row));
        });
      });
    });
  }

  function initSearchFilter() {
    document.querySelectorAll('[data-table-search]').forEach((input) => {
      const tableId = input.getAttribute('data-table-search');
      const table = document.getElementById(tableId);
      if (!table) return;

      input.addEventListener('input', function () {
        const query = input.value.trim().toLowerCase();
        table.querySelectorAll('tbody tr').forEach((row) => {
          const text = row.textContent.toLowerCase();
          row.style.display = text.includes(query) ? '' : 'none';
        });
      });
    });
  }

  function initAssetFilterChips() {
    const chips = document.querySelectorAll('.filter-chip[data-asset-filter]');
    const rows = document.querySelectorAll('[data-asset-category]');
    if (!chips.length) return;

    chips.forEach((chip) => {
      chip.addEventListener('click', function () {
        chips.forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        const filter = chip.getAttribute('data-asset-filter');
        rows.forEach((row) => {
          row.style.display = (filter === 'all' || row.getAttribute('data-asset-category') === filter) ? '' : 'none';
        });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initTableSort();
    initSearchFilter();
    initAssetFilterChips();
  });
})();
