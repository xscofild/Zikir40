# WunderBank — Fictional Banking Demo (PWA)

A **fictional**, phone-first banking simulator with a clean interface inspired by common European mobile banking interaction patterns. It does **not** imitate the identity of a real financial institution, accept credentials, or access bank accounts. Amounts, merchants, dates, and transactions are deliberately fabricated. The screens include persistent demo labels.

## Features
- Five functional bottom tabs: Overview, Transfer, Invest, Products, Services.
- Account details with 30/90/180 chart controls and a chronological demo ledger.
- Tap any transaction to inspect demo details.
- In Services → Demo studio, select a preset and add a **simulated** credit; data saved locally on-device.
- Reset and start again, or install from Safari → Share → Add to Home Screen.
- Dependency-free HTML/CSS/JS, PWA service worker and SVG icon.

## Deploy
Files are published inside the `wunderbank-prank` folder of the existing Pages repo. URL: `https://xscofild.github.io/Zikir40/wunderbank-prank/` (works after GitHub Pages deployment succeeds).

Run tests locally: `node tests/smoke.cjs`. No real names, account numbers, or transactions from reference screenshots are published.