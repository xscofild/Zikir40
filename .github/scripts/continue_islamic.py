from pathlib import Path

p = Path('index.html')
s = p.read_text(encoding='utf-8')

s = s.replace(
    '.quick-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:12px 0}',
    '.daily-word{margin:12px 0;padding:16px;border-radius:19px;border:1px solid rgba(246,200,94,.35);background:linear-gradient(135deg,#182237,#111a2a);box-shadow:0 12px 30px rgba(0,0,0,.18)}.daily-word.warning{border-color:rgba(255,125,125,.45)}.daily-word.hope{border-color:rgba(72,213,127,.45)}.daily-word .eyebrow{font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:var(--gold);font-weight:800}.daily-word .quote{font-size:20px;line-height:1.4;font-weight:850;margin:7px 0}.daily-word .note{color:#dbe4f2;line-height:1.5}.daily-word .ref{margin-top:8px;color:var(--muted);font-size:12px}.section-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.section-head h2{margin:0}.badge{display:inline-flex;align-items:center;justify-content:center;min-width:58px;padding:7px 10px;border-radius:99px;background:#17263a;color:var(--green);font-weight:850}.prayer-grid{display:grid;gap:9px;margin-top:12px}.prayer-row{border:1px solid var(--line);border-radius:16px;padding:11px;background:#0d1726}.prayer-top{display:flex;align-items:center;gap:10px}.prayer-name{font-weight:850;flex:1}.prayer-actions{display:flex;gap:7px}.prayer-actions button{border-radius:10px;padding:8px 10px;border:1px solid var(--line);background:#162338;color:#dbe5f2;font-weight:750}.prayer-actions button.yes.on{background:#176f42;border-color:#2c965d;color:#fff}.prayer-actions button.no.on{background:#4b2026;border-color:#a54652;color:#fff}.prayer-msg{margin-top:8px;padding-top:8px;border-top:1px solid var(--line);font-size:13px;line-height:1.45;color:#d8e0ec}.extra-card{border:1px solid var(--line);border-radius:16px;padding:12px;margin-top:10px;background:#0d1726}.extra-card strong{display:block;font-size:16px;margin-bottom:5px}.extra-card p{margin:0;color:#dbe4f0;line-height:1.5}.extra-card .src{margin-top:7px;color:var(--muted);font-size:11px}.upcoming{display:grid;gap:8px;margin-top:10px}.upcoming-row{display:grid;grid-template-columns:78px 1fr;gap:10px;align-items:center;border:1px solid var(--line);background:#0d1726;border-radius:14px;padding:10px}.upcoming-date{font-weight:850;color:var(--gold)}.upcoming-name{font-weight:750}.continue-note{margin-top:7px;color:#9fe5b6;font-size:12px;font-weight:750}.quick-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:12px 0}',
    1,
)

s = s.replace(
    '<div class="stat"><b id="completedDays">0</b><span>tam gün</span></div>',
    '<div class="stat"><b id="completedDays">0</b><span>devam günü</span></div>',
    1,
)

marker = '<div id="installNote" class="install-note">'
insert = '''<section id="dailyWord" class="daily-word"></section>
<section class="panel" id="prayerPanel"><div class="section-head"><div><h2>🕌 Bugünkü Namazlar</h2><div class="muted">Her vakti dürüstçe işaretle. Amaç korkuda kalmak değil; tevbe, namaz ve istikrar.</div></div><div id="prayerScore" class="badge">0/5</div></div><div id="prayerList" class="prayer-grid"></div></section>
<section class="panel" id="extraToday"><div class="section-head"><div><h2>✨ Bugünün Ekstra Ameli</h2><div class="muted">Haftanın gününe ve İslâmî takvime göre otomatik değişir.</div></div></div><div id="extraList"></div></section>
<section class="panel" id="upcomingPanel"><div class="section-head"><div><h2>🌙 Yaklaşan İslâmî Günler</h2><div class="muted">Diyanet’in resmî dinî günler takvimine göre.</div></div></div><div id="upcomingList" class="upcoming"></div></section>
'''
if marker not in s:
    raise SystemExit('install marker not found')
s = s.replace(marker, insert + marker, 1)

s = s.replace(
    '<section id="calendarPanel" class="panel"><h2>📅 40 Gün Takvimi</h2>',
    '<section id="calendarPanel" class="panel"><h2>📅 İlk 40 Gün Takvimi</h2><div id="challengeStatus" class="continue-note"></div>',
    1,
)

old = "const currentDay=()=>Math.max(1,Math.min(DAYS,Math.floor((new Date()-START)/86400000)+1));"
new = "const totalDay=()=>Math.max(1,Math.floor((new Date()-START)/86400000)+1);const currentDay=()=>Math.min(DAYS,totalDay());"
if old not in s:
    raise SystemExit('currentDay marker not found')
s = s.replace(old, new, 1)

old = "function state(k=dateKey()){store[k]??={counts:{},manual:0,family:false};store[k].counts??={};return store[k]}"
new = "function state(k=dateKey()){store[k]??={counts:{},manual:0,family:false,prayers:{}};store[k].counts??={};store[k].prayers??={};return store[k]}"
if old not in s:
    raise SystemExit('state marker not found')
s = s.replace(old, new, 1)

old = "$('#completedDays').textContent=Array.from({length:DAYS},(_,i)=>dayStatus(dateKey(dayDate(i)))===2).filter(Boolean).length;$('#dayNo').textContent=currentDay()+'/40';document.title=p+'% • Zikir40'}"
new = "$('#completedDays').textContent=Math.max(0,totalDay()-40);$('#dayNo').textContent=(totalDay()>=40?'40/40':totalDay()+'/40');document.title=p+'% • Zikir40'}"
if old not in s:
    raise SystemExit('stats marker not found')
s = s.replace(old, new, 1)

old = "let d=currentDay();$('#dates').textContent=`21.07.2026–29.08.2026 • Bugün ${d}. gün`;"
new = "let d=currentDay();$('#dates').textContent=totalDay()<=40?`21.07.2026–29.08.2026 • Bugün ${d}. gün`:`21.07.2026–29.08.2026 • İlk 40 gün tamamlandı • Devam ${totalDay()-40}. gün`;$('#challengeStatus').textContent=totalDay()>40?`✅ 40 günlük ilk dönem tamamlandı. Bugün devam serisinin ${totalDay()-40}. günü.`:`İlk 40 günlük dönemin ${d}. günü.`;"
if old not in s:
    raise SystemExit('render date marker not found')
s = s.replace(old, new, 1)

marker = "let store={};try{store=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){store={}}"
block = r'''const PRAYERS=['Sabah','Öğle','İkindi','Akşam','Yatsı'];
const DAILY_WORDS=[
{tone:'warning',quote:'“Biz namaz kılanlardan değildik.”',ref:'Müddessir 74:43',note:'Bir vakit daha geçmeden namazını koru; bugün ertelediğini yarın telafi etme fırsatın olmayabilir.'},
{tone:'hope',quote:'“Allah’ın rahmetinden ümit kesmeyin.”',ref:'Zümer 39:53',note:'Düştüysen geri dön. Günahın seni Allah’tan kaçırmasın; tevbe seni O’na döndürsün.'},
{tone:'hope',quote:'“Kalpler ancak Allah’ı anmakla huzur bulur.”',ref:'Ra’d 13:28',note:'Bugünün yükünü zikir, dua ve namazla hafiflet.'},
{tone:'warning',quote:'“Namaz müminlere vakitleri belli bir farzdır.”',ref:'Nisâ 4:103',note:'İbadeti boş zamana bırakma. Vaktin varsa değil, vakti geldiği için namaza kalk.'},
{tone:'hope',quote:'“Beni anın ki ben de sizi anayım.”',ref:'Bakara 2:152',note:'Bugün dilin, kalbin ve davranışların Allah’ı hatırlatsın.'},
{tone:'hope',quote:'“Sabır ve namazla yardım dileyin.”',ref:'Bakara 2:153',note:'Zorlandığında ilk sığınağın namaz ve dua olsun.'},
{tone:'warning',quote:'“Namaz, hayasızlıktan ve kötülükten alıkoyar.”',ref:'Ankebût 29:45',note:'Namaz sadece görev değil; kalbini ve davranışını koruyan bir kalkandır.'}
];
const ISLAMIC_EVENTS=[
['2026-12-10','Üç Ayların Başlangıcı / Regaib Kandili','Kur’an, dua, istiğfar, salavat ve sadaka ile değerlendir; farzları merkeze al.'],
['2027-01-04','Miraç Kandili','Namaza daha sıkı sarıl; Kur’an oku, dua ve istiğfar et.'],
['2027-01-22','Berat Kandili','Tevbe, dua, Kur’an ve istiğfarla geceyi değerlendir.'],
['2027-02-08','Ramazan Başlangıcı','Oruç, Kur’an, namaz ve ailece ibadet düzenini başlat.'],
['2027-03-05','Kadir Gecesi','Geceyi namaz, Kur’an, dua ve istiğfarla ihya etmeye çalış.'],
['2027-03-08','Ramazan Bayramı Arefesi','Bayrama hazırlan; dua, sadaka, sıla-i rahim ve helalleşmeye önem ver.'],
['2027-03-09','Ramazan Bayramı 1. Gün','Bayram namazı, aile ziyareti, barışma ve ikram günü.'],
['2027-05-07','Zilhicce Başlangıcı','İlk dokuz günü ibadet ve imkân varsa nafile oruçla değerlendirmeyi düşün.'],
['2027-05-15','Arefe Günü','Hacda olmayanlar için nafile oruç faziletli görülmüştür. Dua ve istiğfarı artır.'],
['2027-05-16','Kurban Bayramı 1. Gün','Bayram namazı, kurban, paylaşma ve akrabalık bağlarını güçlendirme günü.'],
['2027-06-06','Hicrî Yılbaşı','Yeni hicrî yıl için niyetlerini gözden geçir; geçmiş yıl için muhasebe yap.'],
['2027-06-15','Aşure Günü','Nafile oruç ve dua ile değerlendirmeyi düşün.'],
['2027-08-13','Mevlid Kandili','Peygamberimizi an; salavat, siyer okuması, Kur’an ve dua ile değerlendir.'],
['2027-11-29','Üç Ayların Başlangıcı','Receb ile birlikte Ramazan’a hazırlık düzeni kur.'],
['2027-12-02','Regaib Kandili','Kur’an, dua, istiğfar, salavat ve sadaka ile değerlendir.'],
['2027-12-24','Miraç Kandili','Namaz merkezli bir muhasebe yap; dua ve Kur’an okumayı artır.']
];
const HIJRI_MONTH_STARTS=[
['2026-09-12','Rebiülahir'],['2026-10-12','Cemaziyelevvel'],['2026-11-10','Cemaziyelahir'],['2026-12-10','Receb'],['2027-01-09','Şaban'],['2027-02-08','Ramazan'],['2027-04-08','Zilkade'],['2027-05-07','Zilhicce'],['2027-06-06','Muharrem'],['2027-07-05','Safer'],['2027-08-03','Rebiülevvel'],['2027-09-02','Rebiülahir'],['2027-10-01','Cemaziyelevvel'],['2027-10-31','Cemaziyelahir'],['2027-11-29','Receb'],['2027-12-29','Şaban']
];
const dayDiff=(a,b)=>Math.round((new Date(b+'T00:00:00')-new Date(a+'T00:00:00'))/86400000);
function renderDailyWord(){let i=Math.abs(Math.floor((new Date(dateKey()+'T00:00:00')-new Date('2026-08-30T00:00:00'))/86400000))%DAILY_WORDS.length,w=DAILY_WORDS[i];let el=$('#dailyWord');el.className='daily-word '+w.tone;el.innerHTML=`<div class="eyebrow">Günün kısa hatırlatması</div><div class="quote">${w.quote}</div><div class="note">${w.note}</div><div class="ref">${w.ref} • Diyanet Kur’an meali</div>`}
function renderPrayers(){let s=state(),done=PRAYERS.filter(n=>s.prayers[n]==='yes').length;$('#prayerScore').textContent=done+'/5';$('#prayerList').innerHTML=PRAYERS.map(n=>{let v=s.prayers[n]||'';let msg=v==='yes'?'Elhamdülillah. Aferin — en azından çocukların için ibadeti yaşayarak gösteren hayırlı bir anne/baba olmaya devam et inşaallah.':v==='no'?'⚠️ Namaz müminlere vakitleri belli bir farzdır (Nisâ 4:103). Bu vakti hafife alma; tevbe et, mümkün olanı telafi et ve sıradaki namazı mutlaka koru.':'';return `<div class="prayer-row"><div class="prayer-top"><div class="prayer-name">${n} namazı</div><div class="prayer-actions"><button class="yes ${v==='yes'?'on':''}" data-prayer="${n}" data-v="yes">Kıldım</button><button class="no ${v==='no'?'on':''}" data-prayer="${n}" data-v="no">Kılmadım</button></div></div>${msg?`<div class="prayer-msg">${msg}</div>`:''}</div>`}).join('');document.querySelectorAll('[data-prayer]').forEach(b=>b.onclick=()=>{state().prayers[b.dataset.prayer]=b.dataset.v;save();renderPrayers()})}
function getWhiteDays(){let out=[];for(const [start,name] of HIJRI_MONTH_STARTS){if(name==='Ramazan')continue;for(let n=13;n<=15;n++){let d=new Date(start+'T00:00:00');d.setDate(d.getDate()+n-1);out.push({date:dateKey(d),name:`Eyyâm-ı biyd • ${name} ${n}. gün`,action:'Nafile oruç tavsiye edilmiştir. İmkân ve sağlık durumuna göre değerlendirebilirsin.'})}}return out}
function renderIslamicExtras(){let today=dateKey(),dow=new Date(today+'T12:00:00').getDay(),extras=[];let event=ISLAMIC_EVENTS.find(e=>e[0]===today);if(event)extras.push({title:event[1],text:event[2],src:'Diyanet resmî dinî günler takvimi'});let wd=getWhiteDays().find(x=>x.date===today);if(wd)extras.push({title:wd.name,text:wd.action,src:'Diyanet Din İşleri Yüksek Kurulu • Eyyâm-ı biyd'});if(dow===1||dow===4)extras.push({title:'Nafile oruç günü',text:'Peygamberimiz (s.a.s.) pazartesi ve perşembe günleri oruç tutardı. İmkânın varsa bugün nafile oruç için güzel bir fırsat.',src:'Diyanet İlmihal • Pazartesi-Perşembe orucu'});if(dow===0)extras.push({title:'Yarın Pazartesi',text:'Bu akşam niyetini hazırla. Pazartesi nafile orucu, Peygamberimizin uygulamalarındandır.',src:'Diyanet • Pazartesi orucu'});if(dow===3)extras.push({title:'Yarın Perşembe',text:'Bu akşam niyetini hazırla. Amellerin arz edildiği günlerde oruçlu olmayı tercih ettiğine dair rivayet vardır.',src:'Diyanet İlmihal • Pazartesi-Perşembe orucu'});if(dow===5)extras.push({title:'Cuma günü',text:'Cuma namazı yükümlülüğün varsa hazırlan; ayrıca Peygamberimize salavatı artır.',src:'Cuma 62:9 • Diyanet'});if(!extras.length)extras.push({title:'Bugünün ekstra hedefi',text:'Farz namazları vaktinde koru, en az 10 dakika Kur’an oku ve bir kişiye iyilik yap.',src:'Genel ibadet hatırlatması'});$('#extraList').innerHTML=extras.map(x=>`<div class="extra-card"><strong>${x.title}</strong><p>${x.text}</p><div class="src">Kaynak: ${x.src}</div></div>`).join('');let combined=[...ISLAMIC_EVENTS.map(e=>({date:e[0],name:e[1]})),...getWhiteDays().map(x=>({date:x.date,name:x.name}))].filter(x=>x.date>today).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,5);$('#upcomingList').innerHTML=combined.map(x=>`<div class="upcoming-row"><div class="upcoming-date">${new Date(x.date+'T00:00:00').toLocaleDateString('tr-TR',{day:'2-digit',month:'2-digit'})}</div><div class="upcoming-name">${x.name}<div class="muted">${dayDiff(today,x.date)} gün kaldı</div></div></div>`).join('')}
'''
if marker not in s:
    raise SystemExit('store marker not found')
s = s.replace(marker, block + marker, 1)

old = "$('#familyDone').textContent=state().family?'✅ Bugün okundu':'Bugün okudum';updateStats()}"
new = "$('#familyDone').textContent=state().family?'✅ Bugün okundu':'Bugün okudum';renderDailyWord();renderPrayers();renderIslamicExtras();updateStats()}"
if old not in s:
    raise SystemExit('render end marker not found')
s = s.replace(old, new, 1)

s = s.replace("store[dateKey()]={counts:{},manual:0,family:false};", "store[dateKey()]={counts:{},manual:0,family:false,prayers:{}};", 1)
s = s.replace("register('./sw.js?v=9')", "register('./sw.js?v=10')", 1)

p.write_text(s, encoding='utf-8')

sw = Path('sw.js').read_text(encoding='utf-8').replace('zikir40-v9', 'zikir40-v10')
Path('sw.js').write_text(sw, encoding='utf-8')
