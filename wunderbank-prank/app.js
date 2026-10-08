(() => {
  'use strict';
  const STORE_KEY = 'wunderbank-demo-v2';
  const BASE_BALANCE = 333.34;
  const PRESETS = [125000, 1000000, 8888888.88, 25000000];
  const fmt = v => new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR'}).format(v);
  const dateNow = () => new Intl.DateTimeFormat('de-DE',{day:'2-digit',month:'2-digit',year:'numeric'}).format(new Date());
  const svg = (name, size=22) => {
    const p = {
      overview:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 13h10M7 17h5M7 7h10"/>',
      transfer:'<path d="M5 8h14m-4-4 4 4-4 4M19 16H5m4-4-4 4 4 4"/>',
      invest:'<path d="M3 20h18M4 16l5-6 4 3 7-9M16 4h4v4"/>',
      products:'<rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/>',
      services:'<rect x="4" y="4" width="16" height="16" rx="2"/><circle cx="12" cy="10" r="3"/><path d="M7 18c1-4 9-4 10 0"/>',
      arrow:'<path d="m9 5 7 7-7 7"/>', back:'<path d="m15 5-7 7 7 7"/>',
      search:'<circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/>',
      card:'<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h5"/>',
      swap:'<path d="M7 3v17m-4-4 4 4 4-4M17 21V4m-4 4 4-4 4 4"/>',
      details:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9h10M7 13h10M7 17h6"/>',
      plus:'<path d="M12 4v16M4 12h16"/>',
      clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
      x:'<path d="M5 5 19 19M19 5 5 19"/>',
      check:'<path d="M4 12 10 18 20 6"/>',
      refresh:'<path d="M20 10A8 8 0 0 0 6 5L4 7M4 3v4h4M4 14a8 8 0 0 0 14 5l2-2m0 4v-4h-4"/>',
      info:'<circle cx="12" cy="12" r="10"/><path d="M12 11v6M12 7v1"/>',
      settings:'<path d="M4 7h16M4 17h16M9 3v8M15 13v8"/>',
      bell:'<path d="M6 18h12l-2-3V9a4 4 0 0 0-8 0v6l-2 3ZM10 21h4"/>',
      bank:'<path d="M3 9 12 4l9 5M5 10v9M10 10v9M14 10v9M19 10v9M3 20h18"/>',
      shield:'<path d="M12 2 20 6v6c0 5-4 8-8 10-4-2-8-5-8-10V6Z"/><path d="m9 12 2 2 4-4"/>',
      calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M7 3v4M17 3v4"/>',
      gift:'<rect x="3" y="9" width="18" height="12" rx="2"/><path d="M12 9v12M3 13h18M12 9c-8 0-8-7-4-7 2 0 4 7 4 7Zm0 0c8 0 8-7 4-7 2 0 4 7 4 7Z"/>',
    };
    return `<svg aria-hidden="true" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round">${p[name]||p.info}</svg>`;
  };
  const seed = [
    {id:'pending-1',day:'Aktuell',title:'Kartenzahlung',sub:'Vorgemerkt · Lebensmittel',amount:-22.88,pending:true},
    {id:'pending-2',day:'Aktuell',title:'Kartenzahlung',sub:'Vorgemerkt · Gastronomie',amount:-3.78,pending:true},
    {id:'pending-3',day:'Aktuell',title:'Interne Umbuchung',sub:'Vorgemerkt',amount:-15,pending:true,mark:'WB'},
    {id:'t1',day:'07.10.2026',title:'KARTENABRECHNUNG',sub:'Supermarkt · Lebensmittel',amount:-10.92},
    {id:'t2',day:'07.10.2026',title:'KARTENABRECHNUNG',sub:'Drogerie · Haushalt',amount:-32.49},
    {id:'t3',day:'06.10.2026',title:'KARTENABRECHNUNG',sub:'Bäckerei · Lebensmittel',amount:-6.80},
    {id:'t4',day:'06.10.2026',title:'KARTENABRECHNUNG',sub:'Markt am Platz · Lebensmittel',amount:-35.27},
    {id:'t5',day:'05.10.2026',title:'KARTENABRECHNUNG',sub:'Online-Einkauf · Shopping',amount:-43.87},
    {id:'t6',day:'05.10.2026',title:'KARTENABRECHNUNG',sub:'Nahverkehr · Mobilität',amount:-34.92},
    {id:'t7',day:'03.10.2026',title:'Privatüberweisung',sub:'Dauerauftrag',amount:-23.69,mark:'WB'},
    {id:'t8',day:'02.10.2026',title:'KARTENABRECHNUNG',sub:'Online-Einkauf · Shopping',amount:-86.55},
    {id:'t9',day:'01.10.2026',title:'Mobilfunk',sub:'Monatsvertrag',amount:-52.98,mark:'MO'},
    {id:'t10',day:'30.09.2026',title:'KARTENABRECHNUNG',sub:'Café am Park · Gastronomie',amount:-20.70},
    {id:'t11',day:'29.09.2026',title:'Kontoführung',sub:'Gebühren',amount:-3.50},
    {id:'t12',day:'28.09.2026',title:'KARTENABRECHNUNG',sub:'Discounter · Lebensmittel',amount:-27.30},
    {id:'t13',day:'25.09.2026',title:'KARTENABRECHNUNG',sub:'Restaurant · Gastronomie',amount:-11.65},
    {id:'t14',day:'23.09.2026',title:'KARTENABRECHNUNG',sub:'Drogerie · Haushalt',amount:-21.63},
    {id:'t15',day:'22.09.2026',title:'KARTENABRECHNUNG',sub:'Buchhandlung · Shopping',amount:-26.65},
    {id:'t16',day:'19.09.2026',title:'Gutschrift',sub:'Erstattung · Sonstiges',amount:375,mark:'WB'},
    {id:'t17',day:'17.09.2026',title:'KARTENABRECHNUNG',sub:'Supermarkt · Lebensmittel',amount:-41.66},
    {id:'t18',day:'15.09.2026',title:'Privatüberweisung',sub:'Überweisung',amount:-22.95,mark:'WB'},
    {id:'t19',day:'11.09.2026',title:'KARTENABRECHNUNG',sub:'Bäckerei · Lebensmittel',amount:-17.31},
    {id:'t20',day:'09.09.2026',title:'Leistungsgutschrift',sub:'Beispiel-Buchung · Einnahmen',amount:1125,mark:'WB'},
    {id:'t21',day:'08.09.2026',title:'KARTENABRECHNUNG',sub:'Supermarkt · Lebensmittel',amount:-5.62},
    {id:'t22',day:'07.09.2026',title:'KARTENABRECHNUNG',sub:'Drogerie · Haushalt',amount:-35.27},
    {id:'t23',day:'04.09.2026',title:'KARTENABRECHNUNG',sub:'Online-Einkauf · Shopping',amount:-15},
    {id:'t24',day:'03.09.2026',title:'Privatüberweisung',sub:'Überweisung',amount:-67.75,mark:'WB'},
    {id:'t25',day:'01.09.2026',title:'KARTENABRECHNUNG',sub:'Haushalt · Lebensmittel',amount:-79.99},
  ];
  const load=()=>{try{const s=JSON.parse(localStorage.getItem(STORE_KEY)||'{}');return {posted:!!s.posted,credit:Number.isFinite(+s.credit)&&+s.credit>0?+s.credit:0,chosen:PRESETS.includes(+s.chosen)?+s.chosen:PRESETS[2]}}catch{return{posted:false,credit:0,chosen:PRESETS[2]}}};
  let state=load(),view='overview',modal='',range=30,showAll=false,notification='';
  const app=document.querySelector('#app');
  const save=()=>localStorage.setItem(STORE_KEY,JSON.stringify(state));
  const balance=()=>BASE_BALANCE+(state.posted?state.credit:0);
  const txs=()=>state.posted?[{id:'bonus',day:dateNow(),title:'Demogutschrift',sub:'Simulierter Zahlungseingang · Nicht echt',amount:state.credit,mark:'WB'},...seed]:seed;
  const brand=()=>'<span class="logo-mark" aria-hidden="true"><span class="logo-core">W</span></span>';
  const fakeLabel=()=>'<span class="demo-mark">DEMO <span>·</span> KEINE ECHTE BANK</span>';
  function navbar(){
    const tabs=[['overview','overview','Overview'],['transfer','transfer','Transfer'],['invest','invest','Invest'],['products','products','Products'],['services','services','Services']];
    return `<nav class="bottom-nav" aria-label="Navigation">${tabs.map(([id,ico,label])=>`<button class="nav-btn ${view===id?'on':''}" data-action="tab" data-tab="${id}" aria-label="${label}" ${view===id?'aria-current="page"':''}>${svg(ico,20)}<span>${label}</span></button>`).join('')}</nav>`;
  }
  function pageHeader(title,back='overview'){
    return `<div class="simple-top"><button class="round-btn" data-action="tab" data-tab="${back}" aria-label="Zurück">${svg('back',19)}</button><b>${title}</b><button class="round-btn" data-action="tab" data-tab="services" aria-label="Services">${svg('settings',18)}</button></div>`;
  }
  function barTitle(label,action,tab){return `<div class="sec-top"><h2>${label}</h2>${action?`<button data-action="tab" data-tab="${tab}" class="mini-link">${action} ${svg('arrow',15)}</button>`:''}</div>`;}
  function transaction(t){const pos=t.amount>0;return `<button class="txn" data-action="transaction" data-id="${t.id}"><span class="tx-symbol ${t.mark?'monogram':'bankcard'}">${t.mark||svg('card',15)}</span><span class="tx-main"><span class="tx-name">${t.title}</span><span class="tx-sub">${t.sub}</span></span><span class="tx-end"><b class="${pos?'credit':''}">${pos?'+':''}${fmt(t.amount)}</b>${t.pending?'<small>Vorgemerkt</small>':''}</span></button>`;}
  function groups(list){let prev='',html='';for(const t of list){if(t.day!==prev){html+=`<div class="date-group">${t.day}</div>`;prev=t.day}html+=transaction(t)}return html;}
  function balanceRing(){return `<div class="ring-area"><div class="account-circle"><div class="ring-outer"><div class="ring-inner"><div class="ring-small">EUR</div><strong class="${balance()>999999?'long':''}">${fmt(balance())}</strong><div class="ring-foot">DEMO-KONTO</div></div></div></div><div class="circle-side">Karten<br>1</div></div>`;}
  function overview(){return `<div class="scroll-screen">
    <section class="dashboard"><div class="dash-bar"><div class="dash-brand">${brand()}<span>WunderBank</span></div><button class="small-circle" data-action="tab" data-tab="services" aria-label="Info">${svg('info',18)}</button></div><div class="dash-label">${fakeLabel()}</div>${balanceRing()}
    <div class="quick-row"><button data-action="tab" data-tab="transfer"><span class="quick-circle">${svg('transfer',20)}</span>Transfer</button><button data-action="account"><span class="quick-circle">${svg('details',20)}</span>Account details</button><button data-action="tab" data-tab="services"><span class="quick-circle">${svg('clock',20)}</span>Scheduled</button></div>
    </section><section class="page-content">${barTitle('Accounts','Show details','account')}<button class="account-row" data-action="account"><span class="account-glyph">${svg('bank',18)}</span><span class="account-name">AktivKonto <small>Fiktives Girokonto · •• 5700</small></span><b>${fmt(balance())}</b>${svg('arrow',15)}</button>
    ${barTitle('Cards',null,null)}<button class="account-row" data-action="tab" data-tab="products"><span class="account-glyph">${svg('card',18)}</span><span class="account-name">WunderBank Card <small>Virtuelle Demo-Karte</small></span>${svg('arrow',17)}</button>
    ${barTitle('Recent transactions','Show all','account')}<div class="list-block">${groups(txs().slice(0,4))}</div><div class="hint-disclaimer">${svg('info',15)} Fiktive Daten. Keine Bankverbindung, keine echten Buchungen.</div>
    </section></div>`;}
  function sparkline(){const up=state.posted;return `<svg class="chart" viewBox="0 0 355 120" preserveAspectRatio="none" role="img" aria-label="Illustrativer Kontoverlauf"><defs><linearGradient id="cg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#a2deff" stop-opacity=".13"/><stop offset="1" stop-color="#a2deff" stop-opacity="0"/></linearGradient></defs><path d="M0 28 36 30 70 30 80 16 110 18 141 19 154 62 181 64 212 69 235 73 270 72 ${up?'291 71 293 5 319 5 355 5':'291 78 321 81 355 84'}" fill="none" stroke="#83cfff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M0 28 36 30 70 30 80 16 110 18 141 19 154 62 181 64 212 69 235 73 270 72 ${up?'291 71 293 5 319 5 355 5':'291 78 321 81 355 84'} 355 120 0 120Z" fill="url(#cg)"/><path d="M0 108H355" stroke="white" stroke-dasharray="2 4" opacity=".55"/><text x="355" y="114" text-anchor="end" fill="white" opacity=".72" font-size="9">€ 0</text></svg>`;}
  function account(){return `<div class="scroll-screen">
    <section class="account-hero"><div class="account-top"><button data-action="tab" data-tab="overview" class="round-btn dark">${svg('back',19)}</button><div><b>AktivKonto</b><small>Fiktive IBAN · DEMO •• 5700</small></div><button class="round-btn dark" data-action="search">${svg('search',18)}</button></div>
    <div class="account-balance">${fmt(balance())}</div><div class="range-tabs">${[30,90,180].map(n=>`<button data-action="range" data-range="${n}" class="${range===n?'sel':''}">${n} days</button>`).join('')}</div>${sparkline()}
    <div class="account-actions"><button data-action="account-info"><span>${svg('details',21)}</span>Account Details</button><button data-action="tab" data-tab="transfer"><span>${svg('transfer',21)}</span>Transfer</button></div></section>
    <section class="account-list"><div class="current-top">Current transactions <button data-action="account-info" aria-label="Info">${svg('info',17)}</button></div><div class="list-block">${groups(txs().slice(0,3))}</div><div class="account-more">${groups(showAll?txs().slice(3):txs().slice(3,18))}</div>${!showAll?'<button class="more-transactions" data-action="more">Weitere Umsätze anzeigen</button>':''}<div class="hint-disclaimer">${svg('info',15)} Simulation · alle Buchungen sind erfunden.</div></section>
  </div>`;}
  function transfer(){return `<div class="scroll-screen white-page">${pageHeader('Transfer')}<div class="title-page">Transfer</div><div class="transfer-choice" data-action="transfer-info"><b class="blue-action">${svg('swap',17)} SEPA transfer</b></div><div class="service-tiles"><button data-action="transfer-info">${svg('bank',18)}<span>Internal transfer</span></button><button data-action="transfer-info">${svg('calendar',18)}<span>Standing order</span></button></div><div class="sublist"><button data-action="transfer-info">Scheduled executions ${svg('arrow',17)}</button><button data-action="transfer-info">Templates ${svg('arrow',17)}</button></div><div class="info-note">Dies ist eine Simulation. Überweisungen werden nicht ausgeführt.</div></div>`;}
  function invest(){return `<div class="scroll-screen white-page">${pageHeader('Invest')}<div class="title-page">Invest</div><div class="neutral-state">${svg('invest',30)}<h2>No investment product</h2><p>This demo account does not have any investment products.</p></div><div class="sec-top"><h2>Discover more</h2></div><div class="sublist"><button data-action="inform">Savings ${svg('arrow',17)}</button><button data-action="inform">Investment overview ${svg('arrow',17)}</button></div></div>`;}
  function products(){return `<div class="scroll-screen white-page">${pageHeader('Products')}<div class="title-page">Products</div><div class="fake-product"><div class="product-water"></div><div><b>Discover possibilities</b><span>All offers are fictional</span></div></div><div class="sec-top"><h2>Categories</h2></div><div class="sublist"><button data-action="inform">${svg('bank',16)} Savings ${svg('arrow',17)}</button><button data-action="inform">${svg('invest',16)} Investment ${svg('arrow',17)}</button><button data-action="inform">${svg('card',16)} Card products ${svg('arrow',17)}</button></div></div>`;}
  function services(){return `<div class="scroll-screen white-page">${pageHeader('Services')}<div class="title-page">Services</div><p class="help-copy">Select a service.</p><div class="service-tiles big"><button data-action="inform">${svg('details',18)}<span>Find branch</span></button><button data-action="inform">${svg('card',18)}<span>Card management</span></button><button data-action="inform">${svg('shield',18)}<span>Security</span></button></div><div class="sec-top"><h2>Demo studio</h2></div><div class="studio"><div class="studio-title">Simulierter Zahlungseingang</div><p>Nur für einen Scherz. Der Betrag wird auf deinem Gerät angezeigt, nicht bei einer Bank gebucht.</p><div class="preset-grid">${PRESETS.map(v=>`<button data-action="preset" data-amount="${v}" class="preset ${state.chosen===v?'active':''}" aria-pressed="${state.chosen===v}">${fmt(v)}</button>`).join('')}</div><button class="primary" data-action="credit" ${state.posted?'disabled':''}>${state.posted?'Gutschrift bereits simuliert':'Demo-Gutschrift anzeigen'}</button><button class="secondary" data-action="reset">${svg('refresh',17)} Simulation zurücksetzen</button></div><div class="info-note">${svg('shield',17)} 100 % Demo. Keine Login-Daten, keine IBAN, keine Verbindung zu einer Bank.</div></div>`;}
  function details(){
    if(!modal)return '';
    let title='',amount='',lines='';
    if(modal.startsWith('tx:')){const t=txs().find(t=>t.id===modal.slice(3));if(!t)return '';
      title=t.title;amount=`<div class="modal-money ${t.amount>0?'credit':''}">${t.amount>0?'+':''}${fmt(t.amount)}</div>`;
      lines=`<div class="detail-item"><span>Beschreibung</span><b>${t.sub}</b></div><div class="detail-item"><span>Datum</span><b>${t.day}</b></div><div class="detail-item"><span>Status</span><b>Simuliert · nicht echt</b></div>`;
    } else if(modal==='account'){title='Account details';lines=`<div class="detail-item"><span>Account</span><b>AktivKonto · DEMO</b></div><div class="detail-item"><span>IBAN</span><b>Nicht vorhanden</b></div><div class="detail-item"><span>Account balance</span><b>${fmt(balance())}</b></div>`;}
    else {title='Nur Demo';lines='<p>Diese Funktion ist in der Simulation nicht mit Bankdiensten verbunden.</p>';}
    return `<div class="modal-backdrop" data-action="close-modal"><div class="modal-sheet" role="dialog" aria-modal="true" aria-label="Details"><div class="modal-grip"></div><button class="modal-close" data-action="close-modal" aria-label="Schließen">${svg('x',20)}</button><div class="modal-title">${title}</div>${amount}${lines}<div class="modal-warning">${svg('info',15)} DEMO · Kein Nachweis einer echten Zahlung.</div><button class="primary" data-action="close-modal">Done</button></div></div>`;
  }
  const screens={overview,account,transfer,invest,products,services};
  function render(){app.innerHTML=`<div class="app-main">${(screens[view]||overview)()}${navbar()}${details()}<div class="global-demo">DEMO · FIKTIVE BANK</div></div>`;}
  function toast(text){let el=document.querySelector('#toast');if(!el)return;el.textContent=text;el.classList.add('shown');setTimeout(()=>el.classList.remove('shown'),2800);}
  app.addEventListener('click',e=>{const btn=e.target.closest('[data-action]');if(!btn||btn.disabled)return;
    const action=btn.dataset.action;
    if(action==='tab'){view=btn.dataset.tab;modal='';window.scrollTo?.(0,0);render();}
    else if(action==='account'){view='account';showAll=false;render();}
    else if(action==='range'){range=Number(btn.dataset.range);render();}
    else if(action==='transaction'){modal='tx:'+btn.dataset.id;render();}
    else if(action==='account-info'){modal='account';render();}
    else if(action==='transfer-info'||action==='inform'||action==='search'){modal='info';render();}
    else if(action==='close-modal'){if(btn.classList.contains('modal-backdrop')&&e.target!==btn)return;modal='';render();}
    else if(action==='more'){showAll=true;render();}
    else if(action==='preset'){state.chosen=Number(btn.dataset.amount);save();render();}
    else if(action==='credit'){if(!state.posted){state.posted=true;state.credit=state.chosen;save();view='account';showAll=false;render();toast('Demo-Gutschrift hinzugefügt');}}
    else if(action==='reset'){state.posted=false;state.credit=0;save();view='overview';modal='';showAll=false;render();toast('Simulation zurückgesetzt');}
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal){modal='';render();}});
  render();
  if('serviceWorker' in navigator && location.protocol!=='file:')navigator.serviceWorker.register('./service-worker.js').catch(()=>{});
})();