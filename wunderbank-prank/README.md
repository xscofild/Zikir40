# WunderBank — Prank Simulator ✦

A playful, **fictional** banking-style Progressive Web App (PWA), made for a harmless family prank. **Not affiliated with Deutsche Bank or any financial institution.** There are no real bank accounts, payment transfers, passwords, financial integrations, or actual funds. All balances and transactions are explicitly marked as simulations.

## What it includes

- iPhone-friendly German UI, four working tabs and a fantasy debit card.
- A one-tap **Überraschung starten** moment with animated pretend deposit and confetti.
- Transaction history and a transaction detail sheet.
- Four configurable fake amounts and a reset function.
- Installed-app look via **Add to Home Screen** on iPhone (PWA).
- Standalone layout, touch-friendly interactions, offline use after the first successful visit.
- No external API, packages, personal data, or developer build process.

## GitHub Pages hosting

1. Create a new GitHub repository, for example `wunderbank-prank`.
2. Upload **the contents of this directory** to the target GitHub Pages folder: `index.html`, `app.js`, `styles.css`, `service-worker.js`, `manifest.webmanifest`, `icons/`, `.nojekyll`, etc. Do not put all files under an extra directory.
3. Commit the upload to `main`.
4. Go to **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: main → /(root) → Save**.
5. Once published, open `https://YOUR_USERNAME.github.io/wunderbank-prank/`. It may take a couple of minutes to appear.

**Important:** GitHub Pages websites are public, including those served from private repositories under eligible plans. Upload only this fictional app; **do not upload reference screenshots of real banking accounts or any secrets**.

## Install on iPhone 16 Pro Max

1. Open the GitHub Pages URL in **Safari**.
2. Tap **Share (Teilen)**, then **Add to Home Screen (Zum Home-Bildschirm)**.
3. If prompted, enable **Open as Web App (Als Web-App öffnen)**.
4. Tap **Add**. Open WunderBank from its new icon on your Home Screen.

On supported iOS versions, it opens like an app without a normal browser address bar. GitHub Pages gives the HTTPS origin needed for the installable PWA.

## Local testing

Run `node tests/smoke.cjs` for a dependency-free JavaScript logic smoke test.

Serve with `python3 -m http.server 8080` from this folder and visit `http://localhost:8080` on your development computer. Do not open `index.html` through a `file://` URL when testing the service worker.

## Editing and troubleshooting

- Main fantasy deposit presets: `PRESETS` in `app.js`.
- Starting fictional balance: `BASE_BALANCE` in `app.js`.
- Branding and UI: `styles.css`; icons in `icons/`.
- To publish updates: push modified files to GitHub. Bump the `VERSION` in `service-worker.js` if changing static resources, then reload the PWA.
- If GitHub Pages gives `404`: ensure `index.html` is in the selected Pages source folder and the `main` branch deploy completed.
- If stale content persists: close/reopen the app, reload online, or delete and reinstall the Home Screen shortcut.

The screenshots provided as design reference are deliberately **not** included in this repository.