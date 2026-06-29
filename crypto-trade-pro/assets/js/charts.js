/* ==========================================================================
   CryptoTradePro — charts.js
   ApexCharts initializers. Each function checks for its mount element
   before rendering, so this one file can be safely included on every page.
   Uses window.MarketData (app.js) for placeholder figures.
   ========================================================================== */

(function () {
  'use strict';

  if (typeof ApexCharts === 'undefined') {
    console.warn('ApexCharts not loaded — charts.js will not render.');
    return;
  }

  const palette = {
    green: '#0ECB81',
    red: '#F6465D',
    amber: '#F0B90B',
    blue: '#2172E5',
    grid: '#2B3139',
    text: '#848E9C'
  };

  const baseTheme = {
    chart: { background: 'transparent', toolbar: { show: false }, fontFamily: 'JetBrains Mono, monospace' },
    theme: { mode: 'dark' },
    grid: { borderColor: palette.grid, strokeDashArray: 3 },
    tooltip: { theme: 'dark' },
    xaxis: { axisBorder: { show: false }, axisTicks: { show: false }, labels: { style: { colors: palette.text, fontSize: '11px' } } },
    yaxis: { labels: { style: { colors: palette.text, fontSize: '11px' } } }
  };

  /* ------------------------------------------------------------------
     Helper: generate a plausible random-walk price series
  ------------------------------------------------------------------ */
  function genSeries(points, startPrice, volatility) {
    const series = [];
    let price = startPrice;
    const now = Date.now();
    const step = (24 * 60 * 60 * 1000) / (points / 30); // spread across ~30 days
    for (let i = 0; i < points; i++) {
      price = price + (Math.random() - 0.48) * volatility;
      price = Math.max(price, startPrice * 0.5);
      series.push([now - (points - i) * step, Math.round(price * 100) / 100]);
    }
    return series;
  }

  function genCandles(points, startPrice, volatility) {
    const series = [];
    let price = startPrice;
    const now = Date.now();
    const step = 60 * 60 * 1000;
    for (let i = 0; i < points; i++) {
      const open = price;
      const close = open + (Math.random() - 0.48) * volatility;
      const high = Math.max(open, close) + Math.random() * volatility * 0.4;
      const low = Math.min(open, close) - Math.random() * volatility * 0.4;
      series.push({ x: now - (points - i) * step, y: [open, high, low, close].map((v) => Math.round(v * 100) / 100) });
      price = close;
    }
    return series;
  }

  /* ------------------------------------------------------------------
     1. Main candlestick price chart (trading.html)
  ------------------------------------------------------------------ */
  function initPriceChart() {
    const el = document.querySelector('#priceChart');
    if (!el) return;

    const data = genCandles(120, 67342, 350);

    const chart = new ApexCharts(el, Object.assign({}, baseTheme, {
      series: [{ data: data }],
      chart: Object.assign({}, baseTheme.chart, { type: 'candlestick', height: '100%' }),
      plotOptions: {
        candlestick: {
          colors: { upward: palette.green, downward: palette.red }
        }
      },
      xaxis: Object.assign({}, baseTheme.xaxis, { type: 'datetime' }),
      yaxis: Object.assign({}, baseTheme.yaxis, { tooltip: { enabled: true } })
    }));
    chart.render();
    window.__ctpPriceChart = chart;
  }

  /* ------------------------------------------------------------------
     2. Portfolio value area chart (portfolio.html, index.html)
  ------------------------------------------------------------------ */
  function initPortfolioChart() {
    const el = document.querySelector('#portfolioChart');
    if (!el) return;

    const data = genSeries(90, 24500, 280);

    const chart = new ApexCharts(el, Object.assign({}, baseTheme, {
      series: [{ name: 'Portfolio value', data: data }],
      chart: Object.assign({}, baseTheme.chart, { type: 'area', height: '100%', sparkline: { enabled: false } }),
      stroke: { curve: 'smooth', width: 2, colors: [palette.green] },
      fill: {
        type: 'gradient',
        gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0, stops: [0, 95] },
        colors: [palette.green]
      },
      xaxis: Object.assign({}, baseTheme.xaxis, { type: 'datetime' }),
      yaxis: Object.assign({}, baseTheme.yaxis, {
        labels: { style: baseTheme.yaxis.labels.style, formatter: (v) => '$' + Math.round(v).toLocaleString() }
      }),
      dataLabels: { enabled: false },
      colors: [palette.green]
    }));
    chart.render();
  }

  /* ------------------------------------------------------------------
     3. Allocation donut chart (portfolio.html)
  ------------------------------------------------------------------ */
  function initAllocationChart() {
    const el = document.querySelector('#allocationChart');
    if (!el) return;

    const coins = MarketData.coins.slice(0, 6);
    const weights = [38, 24, 12, 10, 9, 7];

    const chart = new ApexCharts(el, {
      series: weights,
      labels: coins.map((c) => c.ticker),
      chart: { type: 'donut', background: 'transparent', height: '100%' },
      theme: { mode: 'dark' },
      legend: { show: false },
      dataLabels: { enabled: false },
      stroke: { show: false },
      colors: ['#0ECB81', '#F0B90B', '#2172E5', '#A78BFA', '#14B8A6', '#F6465D'],
      plotOptions: {
        pie: {
          donut: {
            size: '72%',
            labels: {
              show: true,
              total: { show: true, label: 'Total value', color: palette.text, formatter: () => '$24,512' }
            }
          }
        }
      },
      tooltip: { theme: 'dark', y: { formatter: (v) => v + '%' } }
    });
    chart.render();
  }

  /* ------------------------------------------------------------------
     4. P&L bar chart (analytics.html)
  ------------------------------------------------------------------ */
  function initPnlChart() {
    const el = document.querySelector('#pnlChart');
    if (!el) return;

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const values = [120, -85, 240, 310, -45, 180, 95];

    const chart = new ApexCharts(el, Object.assign({}, baseTheme, {
      series: [{ name: 'Daily P&L', data: values }],
      chart: Object.assign({}, baseTheme.chart, { type: 'bar', height: '100%' }),
      plotOptions: { bar: { columnWidth: '45%', borderRadius: 4, colors: { ranges: [{ from: -10000, to: 0, color: palette.red }, { from: 0, to: 10000, color: palette.green }] } } },
      xaxis: Object.assign({}, baseTheme.xaxis, { categories: days }),
      yaxis: Object.assign({}, baseTheme.yaxis, { labels: { style: baseTheme.yaxis.labels.style, formatter: (v) => '$' + v } }),
      dataLabels: { enabled: false }
    }));
    chart.render();
  }

  /* ------------------------------------------------------------------
     5. Trading volume column chart (analytics.html)
  ------------------------------------------------------------------ */
  function initVolumeChart() {
    const el = document.querySelector('#volumeChart');
    if (!el) return;

    const labels = Array.from({ length: 14 }, (_, i) => `Day ${i + 1}`);
    const values = labels.map(() => Math.round(8000 + Math.random() * 14000));

    const chart = new ApexCharts(el, Object.assign({}, baseTheme, {
      series: [{ name: 'Volume', data: values }],
      chart: Object.assign({}, baseTheme.chart, { type: 'bar', height: '100%' }),
      plotOptions: { bar: { columnWidth: '55%', borderRadius: 3 } },
      colors: [palette.amber],
      xaxis: Object.assign({}, baseTheme.xaxis, { categories: labels, labels: { show: false } }),
      yaxis: Object.assign({}, baseTheme.yaxis, { labels: { style: baseTheme.yaxis.labels.style, formatter: (v) => '$' + (v / 1000).toFixed(0) + 'k' } }),
      dataLabels: { enabled: false }
    }));
    chart.render();
  }

  /* ------------------------------------------------------------------
     6. Performance comparison line chart (analytics.html)
  ------------------------------------------------------------------ */
  function initPerformanceChart() {
    const el = document.querySelector('#performanceChart');
    if (!el) return;

    const portfolio = genSeries(60, 100, 3.2).map((p) => [p[0], p[1]]);
    const btc = genSeries(60, 100, 2.6).map((p) => [p[0], p[1]]);

    const chart = new ApexCharts(el, Object.assign({}, baseTheme, {
      series: [
        { name: 'Your portfolio', data: portfolio },
        { name: 'BTC benchmark', data: btc }
      ],
      chart: Object.assign({}, baseTheme.chart, { type: 'line', height: '100%' }),
      stroke: { width: [2.5, 2], curve: 'smooth', dashArray: [0, 4] },
      colors: [palette.green, palette.text],
      xaxis: Object.assign({}, baseTheme.xaxis, { type: 'datetime' }),
      yaxis: Object.assign({}, baseTheme.yaxis, { labels: { style: baseTheme.yaxis.labels.style, formatter: (v) => v.toFixed(0) + '%' } }),
      legend: { labels: { colors: palette.text }, position: 'top', horizontalAlign: 'right' },
      dataLabels: { enabled: false }
    }));
    chart.render();
  }

  /* ------------------------------------------------------------------
     7. Mini sparkline charts for stat cards / market table rows
  ------------------------------------------------------------------ */
  function initSparklines() {
    document.querySelectorAll('[data-sparkline]').forEach((el) => {
      const trend = el.getAttribute('data-sparkline'); // "up" | "down"
      const isUp = trend !== 'down';
      const data = genSeries(20, 100, isUp ? 4 : 4).map((p) => p[1]);

      const chart = new ApexCharts(el, {
        series: [{ data: data }],
        chart: { type: 'line', sparkline: { enabled: true }, background: 'transparent' },
        stroke: { width: 2, curve: 'smooth' },
        colors: [isUp ? palette.green : palette.red],
        tooltip: { enabled: false }
      });
      chart.render();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initPriceChart();
    initPortfolioChart();
    initAllocationChart();
    initPnlChart();
    initVolumeChart();
    initPerformanceChart();
    initSparklines();
  });
})();
