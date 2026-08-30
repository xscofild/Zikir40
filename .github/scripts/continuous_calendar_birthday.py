from pathlib import Path
import re

p = Path('index.html')
s = p.read_text(encoding='utf-8')

# 1) App becomes an ongoing routine, while preserving the original 40-day history.
s = s.replace('🌿 40 Günlük Aile Zikir ve Dua', '🌿 Aile Zikir ve Dua')

# 2) Header stats: absolute day + current 40-day block progress.
s = s.replace('<div class="stat"><b id="dayNo">1/40</b><span>gün</span></div>', '<div class="stat"><b id="dayNo">1</b><span>toplam gün</span></div>', 1)
s = s.replace('<div class="stat"><b id="completedDays">0</b><span>devam günü</span></div>', '<div class="stat"><b id="completedDays">1/40</b><span>bu dönem</span></div>', 1)

# 3) Styling for 40-day block navigator + family birthday banner.
css = r'''.cycle-nav{display:grid;grid-template-columns:44px 1fr 44px;gap:8px;align-items:center;margin:10px 0 2px}.cycle-nav button,.calendar-nav-btn{height:44px;border:1px solid var(--line);border-radius:13px;background:#162338;color:#fff;font-size:24px;font-weight:900;touch-action:manipulation}.cycle-nav button:disabled,.calendar-nav-btn:disabled{opacity:.28}.cycle-center{text-align:center;min-width:0}.cycle-center b{display:block;font-size:14px;color:#fff}.cycle-center span{display:block;font-size:11px;color:var(--muted);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.calendar-toolbar{display:grid;grid-template-columns:48px 1fr 48px;gap:8px;align-items:center;margin:12px 0}.calendar-range{text-align:center}.calendar-range b{display:block;color:#fff;font-size:15px}.calendar-range span{display:block;color:var(--muted);font-size:12px;margin-top:2px}.family-reminder{display:none;margin:12px 0;padding:15px;border-radius:19px;border:1px solid rgba(246,200,94,.52);background:linear-gradient(135deg,#2e2514,#151d2b);box-shadow:0 12px 28px rgba(0,0,0,.18)}.family-reminder.show{display:block}.family-reminder.today{border-color:rgba(72,213,127,.62);background:linear-gradient(135deg,#103220,#111d2a)}.family-kicker{font-size:12px;font-weight:850;letter-spacing:.07em;text-transform:uppercase;color:var(--gold)}.family-title{font-size:19px;font-weight:900;margin:6px 0}.family-text{color:#dce5f1;line-height:1.5}.family-date{font-size:12px;color:var(--muted);margin-top:7px}'''
if '.cycle-nav{' not in s:
    s = s.replace('.quick-actions{display:grid;', css + '.quick-actions{display:grid;', 1)

# 4) Block navigator goes directly under the counters/progress in the fixed header.
header_marker = '<div class="bar"><i id="bar"></i></div><div id="network" class="net">'
if header_marker in s and 'id="cycleNav"' not in s:
    s = s.replace(header_marker, '<div class="bar"><i id="bar"></i></div><div id="cycleNav" class="cycle-nav"></div><div id="network" class="net">', 1)

# 5) Birthday reminder card under the daily Islamic message.
if 'id="familyReminder"' not in s:
    s = s.replace('<section id="dailyWord" class="daily-word"></section>', '<section id="dailyWord" class="daily-word"></section>\n<section id="familyReminder" class="family-reminder"></section>', 1)

# 6) Continuous calendar, 40 days per page, but numbering never resets.
old_calendar = '<section id="calendarPanel" class="panel"><h2>📅 İlk 40 Gün Takvimi</h2><div id="challengeStatus" class="continue-note"></div><div class="muted">Bir güne dokun: boş → kısmi → tamamlandı. Böylece yaptığın günleri kendin işaretleyebilirsin.</div><div id="calendar" class="calendar"></div></section>'
new_calendar = '''<section id="calendarPanel" class="panel"><h2 id="calendarTitle">📅 Devam Takvimi</h2><div id="challengeStatus" class="continue-note"></div><div class="calendar-toolbar"><button class="calendar-nav-btn" data-cal="prev" aria-label="Önceki 40 gün">‹</button><div id="calendarRange" class="calendar-range"></div><button class="calendar-nav-btn" data-cal="next" aria-label="Sonraki 40 gün">›</button></div><div class="muted">Numaralar kesilmez: 1–40, sonra 41–80, sonra 81–120… Her sayfada 40 gün görünür.</div><div id="calendar" class="calendar"></div><div class="calendar-toolbar"><button class="calendar-nav-btn" data-cal="prev" aria-label="Önceki 40 gün">‹</button><div class="calendar-range"><b id="calendarBottomRange"></b><span>40 günlük görünüm</span></div><button class="calendar-nav-btn" data-cal="next" aria-label="Sonraki 40 gün">›</button></div></section>'''
if old_calendar in s:
    s = s.replace(old_calendar, new_calendar, 1)

# 7) DST-safe absolute day counter. 2026-08-30 is exactly day 41.
old_day_math = "const totalDay=()=>Math.max(1,Math.floor((new Date()-START)/86400000)+1);const currentDay=()=>Math.min(DAYS,totalDay());"
new_day_math = "const START_UTC=Date.UTC(2026,6,21);const totalDay=()=>{let n=new Date();return Math.max(1,Math.floor((Date.UTC(n.getFullYear(),n.getMonth(),n.getDate())-START_UTC)/86400000)+1)};const currentDay=()=>Math.min(DAYS,totalDay());let calendarPage=Math.max(0,Math.floor((totalDay()-1)/40));"
if old_day_math in s:
    s = s.replace(old_day_math, new_day_math, 1)

# 8) Family birthdays. Easy to extend later.
prayer_marker = "const PRAYERS=['Sabah','Öğle','İkindi','Akşam','Yatsı'];"
if 'const FAMILY_BIRTHDAYS=' not in s:
    s = s.replace(prayer_marker, "const FAMILY_BIRTHDAYS=[{name:'Maral',dob:'1994-08-13'}];\n" + prayer_marker, 1)

# 9) Birthday reminder: one day before + birthday itself, every year.
if 'function renderFamilyReminder()' not in s:
    birthday_fn = r'''function renderFamilyReminder(){let el=$('#familyReminder'),now=new Date();let md=d=>`${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;let todayMd=md(now),tomorrow=new Date(now.getFullYear(),now.getMonth(),now.getDate()+1),tomorrowMd=md(tomorrow);let today=FAMILY_BIRTHDAYS.find(x=>x.dob.slice(5)===todayMd),next=FAMILY_BIRTHDAYS.find(x=>x.dob.slice(5)===tomorrowMd);el.className='family-reminder';if(today){let age=now.getFullYear()-Number(today.dob.slice(0,4)),d=new Date(today.dob+'T00:00:00');el.classList.add('show','today');el.innerHTML=`<div class="family-kicker">🎉 Bugün doğum günü</div><div class="family-title">Bugün ${today.name}’ın doğum günü!</div><div class="family-text">Allah sağlık, afiyet, iman, hayırlı ve bereketli bir ömür nasip etsin. Bugün aramayı, yazmayı ve güzel bir dua etmeyi unutmayın. 🤲</div><div class="family-date">${d.toLocaleDateString('tr-TR',{day:'2-digit',month:'long'})} • ${age}. yaş</div>`;return}if(next){let d=new Date(next.dob+'T00:00:00');el.classList.add('show');el.innerHTML=`<div class="family-kicker">🎁 Yarın unutma</div><div class="family-title">Yarın ${next.name}’ın doğum günü</div><div class="family-text">Bir gün önceden hatırlatma: mesajını, aramanı veya hediyeni hazırla. Yarın aileden kimse unutmasın.</div><div class="family-date">${d.toLocaleDateString('tr-TR',{day:'2-digit',month:'long'})} • Doğum ${d.toLocaleDateString('tr-TR')}</div>`;return}el.innerHTML=''}
'''
    s = s.replace('function renderDailyWord(){', birthday_fn + 'function renderDailyWord(){', 1)

# 10) Continuous calendar renderer and block navigator.
start = s.find('function renderCalendar(){')
end = s.find('function updateStats(){', start)
if start != -1 and end != -1:
    new_render_calendar = r'''function bindCalendarNav(){document.querySelectorAll('[data-cal],[data-cycle]').forEach(b=>{let dir=b.dataset.cal||b.dataset.cycle;b.disabled=dir==='prev'&&calendarPage===0;b.onclick=()=>{calendarPage=dir==='prev'?Math.max(0,calendarPage-1):calendarPage+1;renderCalendar();renderCycleNav();if(b.dataset.cal)document.querySelector('#calendarPanel').scrollIntoView({behavior:'smooth',block:'start'})}})}function renderCycleNav(){let startNo=calendarPage*40+1,endNo=startNo+39,startDate=dayDate(startNo-1),endDate=dayDate(endNo-1),period=calendarPage+1;$('#cycleNav').innerHTML=`<button data-cycle="prev" aria-label="Önceki dönem">‹</button><div class="cycle-center"><b>${period}. dönem • ${startNo}–${endNo}. günler</b><span>${startDate.toLocaleDateString('tr-TR')} – ${endDate.toLocaleDateString('tr-TR')}</span></div><button data-cycle="next" aria-label="Sonraki dönem">›</button>`;bindCalendarNav()}function renderCalendar(){let today=dateKey(),startIndex=calendarPage*40,startNo=startIndex+1,endNo=startNo+39,startDate=dayDate(startIndex),endDate=dayDate(startIndex+39);$('#calendarTitle').textContent=calendarPage===0?'📅 1–40. Günler':'📅 Devam Takvimi';$('#calendarRange').innerHTML=`<b>${startNo}–${endNo}. günler</b><span>${startDate.toLocaleDateString('tr-TR')} – ${endDate.toLocaleDateString('tr-TR')}</span>`;$('#calendarBottomRange').textContent=`${startNo}–${endNo}. günler`;$('#challengeStatus').textContent=`Bugün başlangıçtan beri ${totalDay()}. gün. Bu sayfa ${startNo}–${endNo}. günleri gösteriyor.`;$('#calendar').innerHTML=Array.from({length:40},(_,i)=>{let absoluteIndex=startIndex+i,d=dayDate(absoluteIndex),k=dateKey(d),st=dayStatus(k),future=absoluteIndex+1>totalDay();return `<button class="day ${st===2?'done':st===1?'partial':''} ${k===today?'today':''} ${future?'future':''}" data-day="${k}"><b>${absoluteIndex+1}. gün</b>${d.toLocaleDateString('tr-TR',{day:'2-digit',month:'2-digit'})}<br>${st===2?'✓ Tamam':st===1?'◐ Kısmi':'○ Boş'}</button>`}).join('');document.querySelectorAll('[data-day]').forEach(b=>b.onclick=()=>{let x=state(b.dataset.day);x.manual=((x.manual||0)+1)%3;save();renderCalendar();updateStats()});bindCalendarNav()}'''
    s = s[:start] + new_render_calendar + s[end:]

# 11) Stats and header now use the real absolute day number.
s = s.replace("$('#completedDays').textContent=Math.max(0,totalDay()-40);$('#dayNo').textContent=(totalDay()>=40?'40/40':totalDay()+'/40');", "let cycleDay=((totalDay()-1)%40)+1;$('#completedDays').textContent=cycleDay+'/40';$('#dayNo').textContent=totalDay();", 1)

old_header_dates = "let d=currentDay();$('#dates').textContent=totalDay()<=40?`21.07.2026–29.08.2026 • Bugün ${d}. gün`:`21.07.2026–29.08.2026 • İlk 40 gün tamamlandı • Devam ${totalDay()-40}. gün`;$('#challengeStatus').textContent=totalDay()>40?`✅ 40 günlük ilk dönem tamamlandı. Bugün devam serisinin ${totalDay()-40}. günü.`:`İlk 40 günlük dönemin ${d}. günü.`;"
new_header_dates = "let d=currentDay();$('#dates').textContent=`21.07.2026’dan beri • Bugün ${totalDay()}. gün`;renderCycleNav();"
if old_header_dates in s:
    s = s.replace(old_header_dates, new_header_dates, 1)

# 12) Render birthday reminder on every app open/day refresh.
s = s.replace('renderDailyWord();renderPrayers();renderIslamicExtras();updateStats()', 'renderDailyWord();renderFamilyReminder();renderPrayers();renderIslamicExtras();updateStats()', 1)

# 13) Cache-bust offline app.
s = s.replace("register('./sw.js?v=10')", "register('./sw.js?v=11')", 1)
p.write_text(s, encoding='utf-8')

sw = Path('sw.js')
if sw.exists():
    sws = sw.read_text(encoding='utf-8').replace('zikir40-v10', 'zikir40-v11')
    sw.write_text(sws, encoding='utf-8')
