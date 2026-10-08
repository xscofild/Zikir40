(() => {
  'use strict';
  const STORE_KEY = 'wunderbank-demo-v1';
  const BASE_BALANCE = 624.80;
  const PRESETS = [100000, 1000000, 8888888.88, 99999999.99];
  const fmt = (amount) => new Intl.NumberFormat('de-DE', {style: 'currency', currency: 'EUR'}).format(amount);
  const shortDate = new Intl.DateTimeFormat('de-DE', {day:'2-digit', month:'long', year:'numeric'});
  const today = () => shortDate.format(new Date());
  const icon = (name, size = 21) => {
    const paths = {
      home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z"/><path d="M9 21v-8h6v8"/>',
      activity: '<path d="M3 12h4l3-7 4 14 3-7h4"/>',
      wallet: '<rect x="3" y="5" width="18" height="15" rx="3"/><path d="M3 9h18M16 15h2"/>',
      user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
      arrowUp: '<path d="m7 17 10-10M7 7h10v10"/>',
      arrowDown: '<path d="m7 7 10 10M17 7v10H7"/>',
      chevron: '<path d="m9 18 6-6-6-6"/>',
      back: '<path d="m15 18-6-6 6-6"/>',
      close: '<path d="M6 6l12 12M18 6 6 18"/>',
      eye: '<path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
      eyeoff: '<path d="M3 3l18 18M10.5 6.1A10.7 10.7 0 0 1 12 6c6.4 0 10 6 10 6a18.4 18.4 0 0 1-3.6 4.1M6.3 6.4C3.5 8.1 2 12 2 12s3.6 6 10 6c1.2 0 2.3-.2 3.4-.6"/><path d="M10 10a3 3 0 0 0 4 4"/>',
      sparkles: '<path d="m12 2 1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9L12 2ZM20 17l.8 1.9L23 20l-2.2 1.1L20 23l-.8-1.9L17 20l2.2-1.1L20 17ZM4 17l.8 1.9L7 20l-2.2 1.1L4 23l-.8-1.9L1 20l2.2-1.1L4 17Z"/>',
      check: '<path d="m5 12 5 5L20 7"/>',
      info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
      rotate: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
      bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
      gift: '<rect x="3" y="9" width="18" height="12" rx="2"/><path d="M12 9v12M3 13h18M12 9c-8 0-8-7-4-7 2 0 4 7 4 7Zm0 0c8 0 8-7 4-7-2 0-4 7-4 7Z"/>',
      shield: '<path d="m12 2 8 4v6c0 5-3 8-8 10-5-2-8-5-8-10V6Z"/><path d="m9 12 2 2 4-4"/>',
      calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/>',
      card: '<rect x="2" y="5" width="20" height="14" rx="3"/><path d="M2 10h20M6 15h4"/>',
      more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    };
    return `<svg aria-hidden="true" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round">${paths[name] || paths.info}</svg>`;
  };

  function restore() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
      return {
        played: raw.played === true,
        amount: PRESETS.includes(Number(raw.amount)) ? Number(raw.amount) : PRESETS[2],
        creditedAmount: raw.played === true ? (Number.isFinite(Number(raw.creditedAmount)) && Number(raw.creditedAmount) > 0 ? Number(raw.creditedAmount) : (PRESETS.includes(Number(raw.amount)) ? Number(raw.amount) : PRESETS[2])) : 0
      };
    } catch (_) { return {played:false, amount: PRESETS[2], creditedAmount:0}; }
  }
  let persisted = restore();
  let tab = 'home';
  let detail = null;
  let balanceVisible = true;
  let activeToastTimer = null;
  const app = document.querySelector('#app');
  const save = () => localStorage.setItem(STORE_KEY, JSON.stringify(persisted));

  function topbar() {
    return `<header class="topbar">
      <div class="brand-lockup"><div class="brand-icon" aria-hidden="true"><span>✦</span></div>
      <div><div class="brand-title">Wunder<span>Bank</span></div><div class="brand-sub">MONEY, BUT MAKE IT MAGIC</div></div></div>
      <div class="avatar" aria-hidden="true">W</div>
    </header><div class="disclaimer-band">${icon('info',14)} FIKTIVE DEMO · KEINE ECHTE BANK</div>`;
  }

  function hero() {
    const total = BASE_BALANCE + (persisted.played ? persisted.creditedAmount : 0);
    return `<section class="hero" aria-label="Spielkonto">
      <div class="hero-top"><span class="hero-kicker">DEIN SPIELKONTO</span><span class="hero-chip">${icon('sparkles',13)} PRANK MODE</span></div>
      <div class="hero-figure-row"><span id="balance" class="balance ${total >= 10000000 ? 'jumbo' : ''}">${balanceVisible ? fmt(total) : '••••••••'}</span><button class="eye-button" data-action="toggle-eye" aria-label="Kontostand ${balanceVisible?'verbergen':'anzeigen'}">${icon(balanceVisible?'eye':'eyeoff')}</button></div>
      <div class="hero-info"><span>Guthaben in deiner Fantasie</span><span class="fake-tag">100 % Spielgeld</span></div>
      <div class="hero-chart" aria-hidden="true"><svg viewBox="0 0 350 94" preserveAspectRatio="none"><defs><linearGradient id="grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#83ecdf" stop-opacity=".25"/><stop offset="100%" stop-color="#83ecdf" stop-opacity="0"/></linearGradient></defs><path d="M0,80 L35,72 L61,75 L83,62 L111,67 L139,52 L171,59 L198,44 L222,49 L249,33 L276,38 L307,19 L331,23 L350,7 L350,94 L0,94Z" fill="url(#grad)"/><path d="M0 80 35 72 61 75 83 62 111 67 139 52 171 59 198 44 222 49 249 33 276 38 307 19 331 23 350 7" stroke="#8af3e1" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/><circle cx="350" cy="7" r="4.4" fill="#c7fff2"/></svg></div>
      <div class="hero-foot"><span>✦ Wunschkonto</span><span>PLAY · 0000 0000</span></div>
    </section>`;
  }

  function surprisePanel() {
    return `<section class="surprise-card ${persisted.played ? 'played' : ''}">
      <div class="surprise-emblem">${icon(persisted.played ? 'check':'gift',23)}</div>
      <div class="surprise-copy"><div class="mini-kicker">${persisted.played ? 'ÜBERRASCHUNG ERFOLGT':'GEHEIME ÜBERRASCHUNG'}</div><h2>${persisted.played ? 'Millionär-Modus an!' : 'Bereit für den großen Moment?'}</h2><p>${persisted.played ? 'Alles nur ein Scherz — aber ein ziemlich teurer. 😄' : 'Ein Fingertipp und plötzlich ist dein Fantasiekonto reich.'}</p></div>
      <button class="surprise-button" data-action="reveal" ${persisted.played?'disabled':''}>${persisted.played?'Geld ist da ✓':'Überraschung starten'} ${persisted.played?'':icon('arrowUp',18)}</button>
    </section>`;
  }

  function rowTransaction(t, detailId) {
    const positive = t.value > 0;
    return `<button class="tx-row" data-action="detail" data-id="${detailId}">
      <span class="tx-icon ${positive?'plus':''}">${icon(positive?'sparkles':(t.icon || 'card'),20)}</span>
      <span class="tx-copy"><span class="tx-title">${t.title}</span><span class="tx-desc">${t.desc}</span></span>
      <span class="tx-amount ${positive?'positive':''}">${positive?'+ ':''}${fmt(t.value)}</span>${icon('chevron',16)}
    </button>`;
  }

  function transactions() {
    const result = [];
    if (persisted.played) result.push({id:'bonus',title:'Universum der Wünsche',desc:`Heute · ${today()}`,value:persisted.creditedAmount});
    result.push({id:'cafe',title:'Kaffee & Kuchen',desc:'Gestern · Kartenzahlung',value:-12.40,icon:'card'});
    result.push({id:'market',title:'Weekend Market',desc:'02.10.2026 · Kartenzahlung',value:-46.85,icon:'wallet'});
    result.push({id:'music',title:'Music & Chill',desc:'01.10.2026 · Abonnement',value:-8.99,icon:'activity'});
    result.push({id:'credit',title:'Startguthaben',desc:'01.10.2026 · Demo-Guthaben',value:693.04,icon:'sparkles'});
    return result;
  }

  function home() {
    const tx = transactions().slice(0, 3);
    return `<div class="main-scroll"><section class="greeting"><div><p>Schön, dass du da bist <span class="wave">✦</span></p><h1>Deine Übersicht</h1></div><span class="date-pill">${icon('calendar',15)} ${new Intl.DateTimeFormat('de-DE', {day:'2-digit',month:'short'}).format(new Date())}</span></section>
      ${hero()}
      <section class="shortcut-row" aria-label="Schnellaktionen">
        <button data-action="reveal" class="shortcut"><span>${icon('gift',22)}</span>Bonus</button>
        <button data-action="switch-tab" data-tab="activity" class="shortcut"><span>${icon('activity',22)}</span>Umsätze</button>
        <button data-action="switch-tab" data-tab="cards" class="shortcut"><span>${icon('card',22)}</span>Spielkarte</button>
      </section>
      ${surprisePanel()}
      <section class="content-section"><div class="section-head"><h2>Letzte Aktivitäten</h2><button data-action="switch-tab" data-tab="activity" class="text-button">Alle ansehen ${icon('chevron',15)}</button></div><div class="white-panel">${tx.map(t=>rowTransaction(t,t.id)).join('')}</div></section>
      <p class="footer-notice">✦ WunderBank ist ein Unterhaltungsprojekt. Alle Beträge und Buchungen sind erfunden.</p>
    </div>`;
  }

  function activity() {
    return `<div class="main-scroll subpage"><div class="subpage-heading"><div class="overline">DEINE UMSÄTZE</div><h1>Aktivitäten</h1><p>Ein bisschen Alltag. Und vielleicht ein Wunder.</p></div>
      <div class="white-panel tx-section"><div class="tx-date-label">${today()}</div>${transactions().filter(t=>t.id==='bonus').map(t=>rowTransaction(t,t.id)).join('')}
      <div class="tx-date-label">OKTOBER 2026</div>${transactions().filter(t=>t.id!=='bonus').map(t=>rowTransaction(t,t.id)).join('')}</div>
      <div class="info-card">${icon('info',19)} <span>Alle Transaktionen sind simuliert. Keine Verbindung zu Banken oder Zahlungsdiensten.</span></div>
    </div>`;
  }

  function cards() {
    return `<div class="main-scroll subpage"><div class="subpage-heading"><div class="overline">DEINE KARTEN</div><h1>Spielkarte</h1><p>Unbezahlbare Träume. Kostenloses Konto.</p></div>
      <div class="bank-card"><div class="card-top"><span class="brand-icon small">✦</span><span class="bank-card-type">FANTASY EDITION</span></div><div class="card-middle">•••• &nbsp; •••• &nbsp; •••• &nbsp; 0000</div><div class="card-bottom"><span>WUNDERKIND</span><span>PLAY</span></div><div class="card-watermark">DEMO · NOT A PAYMENT CARD</div></div>
      <section class="content-section"><div class="section-head"><h2>Deine Vorteile</h2></div><div class="white-panel benefit-row">${icon('sparkles',25)}<div><b>Unbegrenzte Fantasie</b><p>Millionen ohne Arbeit? Leider nur in dieser App.</p></div></div></section>
      <div class="info-card">${icon('shield',18)} <span>Keine echte Karte, keine Kartennummer, keine Zahlungen.</span></div>
    </div>`;
  }

  function settings() {
    return `<div class="main-scroll subpage"><div class="subpage-heading"><div class="overline">DEIN SPIELSTUDIO</div><h1>Prank-Einstellungen</h1><p>Wähle den Überraschungsbetrag und starte neu.</p></div>
      <section class="white-panel settings-panel"><h2>Geheimer Bonusbetrag</h2><div class="preset-grid">${PRESETS.map(a=>`<button class="preset ${a===persisted.amount?'selected':''}" data-action="preset" data-amount="${a}" aria-pressed="${a===persisted.amount}">${fmt(a)}</button>`).join('')}</div><p class="setting-note">${icon('info',16)} Änderungen gelten für den nächsten Spielstart.</p></section>
      <section class="white-panel settings-panel"><h2>Simulation zurücksetzen</h2><p>Entfernt den großen Geldeingang und setzt den Kontostand auf ${fmt(BASE_BALANCE)}.</p><button data-action="reset" class="outline-button">${icon('rotate',18)} Zurücksetzen</button></section>
      <div class="info-card">${icon('shield',19)} <span>Privat, offline verwendbar, ohne Anmeldung, Passwort oder Bankdaten. Dein Gerät speichert nur die Demo-Einstellungen.</span></div>
      <p class="footer-notice">Made for fun ✦ 100 % fiktiv</p>
    </div>`;
  }

  const navs = [ ['home','home','Übersicht'], ['activity','activity','Umsätze'], ['cards','card','Karten'], ['settings','user','Profil'] ];
  function navigation() {
    return `<nav class="bottom-nav" aria-label="Hauptnavigation">${navs.map(([id,ico,label])=>`<button class="nav-item ${tab===id?'active':''}" data-action="switch-tab" data-tab="${id}" ${tab===id?'aria-current="page"':''}><span class="nav-icon">${icon(ico,23)}</span><span>${label}</span></button>`).join('')}</nav>`;
  }

  function detailSheet() {
    if (!detail) return '';
    const t = transactions().find(x=>x.id===detail);
    if (!t) return '';
    return `<div class="sheet-overlay" data-action="close-sheet"><div class="sheet" role="dialog" aria-modal="true" aria-label="Transaktionsdetails"><div class="sheet-handle"></div><button class="sheet-close" aria-label="Schließen" data-action="close-sheet">${icon('close')}</button>
      <div class="sheet-symbol">${icon(t.value>0?'sparkles':'card',30)}</div>
      <div class="sheet-status">${t.value>0?'Simulierte Gutschrift':'Simulierte Abbuchung'}</div>
      <div class="sheet-amount ${t.value>0?'positive':''}">${t.value>0?'+ ':''}${fmt(t.value)}</div>
      <div class="detail-lines"><div><span>Beschreibung</span><b>${t.title}</b></div><div><span>Datum</span><b>${t.id==='bonus'?today():t.desc.split(' · ')[0]}</b></div><div><span>Status</span><b>Nur Demo ✓</b></div><div><span>Konto</span><b>Wunschkonto · PLAY</b></div></div>
      <div class="detail-foot">✦ Fiktive Buchung. Kein Nachweis einer realen Zahlung.</div>
      <button class="solid-button" data-action="close-sheet">Fertig</button>
    </div></div>`;
  }

  function render() {
    const pages = {home, activity, cards, settings};
    app.innerHTML = `${topbar()}${pages[tab]()}${navigation()}${detailSheet()}`;
  }

  function showToast(message) {
    const toast = document.querySelector('#toast');
    if (!toast) return;
    toast.innerHTML = `${icon('sparkles',20)} <span>${message}</span>`;
    toast.classList.add('shown');
    if (activeToastTimer) clearTimeout(activeToastTimer);
    activeToastTimer = setTimeout(()=>toast.classList.remove('shown'),3900);
  }

  function confetti() {
    const parent = document.querySelector('#confetti');
    parent.replaceChildren();
    const colors = ['#45d8b5','#f3ba50','#88aaff','#ff7fa4','#e1fcfc'];
    const pieceCount = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 60;
    for(let i=0;i<pieceCount;i++) {
      const el = document.createElement('span');
      el.className='confetti';
      el.style.left=`${Math.random()*100}%`;
      el.style.animationDelay=`${Math.random()*.8}s`;
      el.style.animationDuration=`${2.2+Math.random()*1.7}s`;
      el.style.background=colors[i%colors.length];
      el.style.transform=`rotate(${Math.random()*360}deg)`;
      parent.appendChild(el);
    }
    setTimeout(()=>parent.replaceChildren(),4700);
  }

  function reveal() {
    if (persisted.played) {showToast('Bonus ist bereits angekommen · nur Spielgeld 😄');return;}
    const initial = BASE_BALANCE;
    persisted.played = true; persisted.creditedAmount = persisted.amount; save();
    tab = 'home'; render();
    if (balanceVisible && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const dest = BASE_BALANCE + persisted.creditedAmount;
      const start = performance.now();
      const el = document.querySelector('#balance');
      const frame = (time) => {
        if (!el || !document.body.contains(el)) return;
        const progress = Math.min((time-start)/1700,1);
        const ease = 1-Math.pow(1-progress,3);
        el.textContent=fmt(initial+(dest-initial)*ease);
        if (progress<1) requestAnimationFrame(frame);
      };
      el.textContent=fmt(initial);
      requestAnimationFrame(frame);
    }
    confetti();
    showToast(`🎉 + ${fmt(persisted.amount)} · BONUS AUS DEM PARALLELUNIVERSUM`);
  }

  app.addEventListener('click',(event)=>{
    const button=event.target.closest('[data-action]');
    if (!button || button.disabled) return;
    const act=button.dataset.action;
    switch (act) {
      case 'switch-tab': tab=button.dataset.tab;detail=null;render();break;
      case 'toggle-eye': balanceVisible=!balanceVisible;render();break;
      case 'reveal': reveal();break;
      case 'detail': detail=button.dataset.id;render();break;
      case 'close-sheet': if (button.classList.contains('sheet-overlay') && event.target!==button) break;detail=null;render();break;
      case 'preset': persisted.amount=Number(button.dataset.amount);save();render();showToast('Betrag gespeichert · für den nächsten Neustart');break;
      case 'reset': persisted.played=false;persisted.creditedAmount=0;save();tab='home';detail=null;render();showToast('Alles zurückgesetzt. Bereit für Runde 2!');break;
    }
  });
  document.addEventListener('keydown',(event)=>{if(event.key==='Escape' && detail){detail=null;render();}});
  render();
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('./service-worker.js').catch(()=>{});
  }
})();