from pathlib import Path
import re

p = Path('index.html')
s = p.read_text(encoding='utf-8')

# 1) Make the daily dashboard its own FIRST tab.
old = "let filter='Tümü';const groups=['Tümü','Sabah','Esma','Akşam','Dua','Takvim'];"
new = "let filter='Bugün';const groups=['Bugün','Tümü','Sabah','Esma','Akşam','Dua','Takvim'];"
if old not in s:
    raise SystemExit('tabs declaration not found')
s = s.replace(old, new, 1)

# 2) Prayer choices are true toggles: click active choice again to clear it.
old = "document.querySelectorAll('[data-prayer]').forEach(b=>b.onclick=()=>{state().prayers[b.dataset.prayer]=b.dataset.v;save();renderPrayers()})"
new = "document.querySelectorAll('[data-prayer]').forEach(b=>b.onclick=()=>{let ps=state().prayers,key=b.dataset.prayer,val=b.dataset.v;ps[key]=ps[key]===val?'':val;save();renderPrayers();updateStats()})"
if old not in s:
    raise SystemExit('prayer handler not found')
s = s.replace(old, new, 1)

# 3) Stronger tab binding: one source of truth + accessibility state.
old = "function renderTabs(){$('#tabs').innerHTML=groups.map(g=>`<button class=\"tab ${g===filter?'on':''}\" data-g=\"${g}\">${g}</button>`).join('');document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{filter=b.dataset.g;render()})}"
new = "function renderTabs(){$('#tabs').innerHTML=groups.map(g=>`<button class=\"tab ${g===filter?'on':''}\" data-g=\"${g}\" aria-pressed=\"${g===filter}\">${g}</button>`).join('');document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{if(filter===b.dataset.g)return;filter=b.dataset.g;render();requestAnimationFrame(()=>b.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'}))})}"
if old not in s:
    raise SystemExit('renderTabs function not found')
s = s.replace(old, new, 1)

# 4) Centralized view switching fixes Sabah/Esma/Akşam/Dua/Takvim actually showing their own content.
insert_before = "function render(){renderTabs();renderCalendar();"
apply_view = """function applyView(){let today=filter==='Bugün';['#dailyWord','#familyReminder','#prayerPanel','#extraToday','#upcomingPanel'].forEach(sel=>{let el=$(sel);if(el)el.classList.toggle('hidden',!today)});let install=$('#installNote');if(install)install.classList.toggle('hidden',!today);let qa=document.querySelector('.quick-actions');if(qa)qa.classList.toggle('hidden',filter!=='Tümü');$('#calendarPanel').classList.toggle('hidden',filter!=='Takvim');$('#familyDua').classList.toggle('hidden',filter!=='Tümü'&&filter!=='Dua')}\n"
if insert_before not in s:
    raise SystemExit('render function start not found')
s = s.replace(insert_before, apply_view + insert_before, 1)

# Remove old scattered panel visibility lines; applyView will run after dynamic panels render.
s = s.replace("$('#calendarPanel').classList.toggle('hidden',filter!=='Tümü'&&filter!=='Takvim');$('#familyDua').classList.toggle('hidden',filter!=='Tümü'&&filter!=='Dua');", "", 1)

# Bugün and Takvim should not render zikr cards. Other tabs filter correctly.
old = "let visible=filter==='Takvim'?[]:ITEMS.filter(x=>filter==='Tümü'||x.group===filter),st=state();"
new = "let visible=(filter==='Bugün'||filter==='Takvim')?[]:ITEMS.filter(x=>filter==='Tümü'||x.group===filter),st=state();"
if old not in s:
    raise SystemExit('visible list filter not found')
s = s.replace(old, new, 1)

# Apply visibility AFTER renderFamilyReminder(), because that function resets its className.
old = "renderDailyWord();renderFamilyReminder();renderPrayers();renderIslamicExtras();updateStats()}"
new = "renderDailyWord();renderFamilyReminder();renderPrayers();renderIslamicExtras();applyView();updateStats()}"
if old not in s:
    raise SystemExit('render tail not found')
s = s.replace(old, new, 1)

# 5) Clean tab semantics/feel and prevent accidental double-tap selection glitches on iPhone.
s = s.replace(".tab{white-space:nowrap;", ".tab{white-space:nowrap;touch-action:manipulation;-webkit-tap-highlight-color:transparent;", 1)

# 6) Daily percentage now also includes 5 prayers, so the dashboard reflects the whole day.
old = "p=Math.round((ITEMS.reduce((sum,x)=>sum+Math.min((st.counts[x.id]||0)/x.target,1),0)+(st.family?1:0))/(ITEMS.length+1)*100);"
new = "p=Math.round((ITEMS.reduce((sum,x)=>sum+Math.min((st.counts[x.id]||0)/x.target,1),0)+(st.family?1:0)+PRAYERS.filter(n=>st.prayers[n]==='yes').length)/(ITEMS.length+1+PRAYERS.length)*100);"
if old not in s:
    raise SystemExit('daily progress formula not found')
s = s.replace(old, new, 1)

# 7) Full-day button should also mark the five prayers as completed.
old = "ITEMS.forEach(x=>s.counts[x.id]=x.target);s.family=true;save();render()"
new = "ITEMS.forEach(x=>s.counts[x.id]=x.target);PRAYERS.forEach(n=>s.prayers[n]='yes');s.family=true;save();render()"
if old not in s:
    raise SystemExit('complete-all handler not found')
s = s.replace(old, new, 1)

# 8) Service worker cache version bump.
s = s.replace("register('./sw.js?v=11')", "register('./sw.js?v=12')", 1)
p.write_text(s, encoding='utf-8')

# Network-first for page navigation so iPhone does not keep showing an old UI forever;
# offline fallback remains intact.
sw = Path('sw.js')
sw_text = sw.read_text(encoding='utf-8')
sw_text = re.sub(r"const CACHE='zikir40-v\d+';", "const CACHE='zikir40-v12';", sw_text, count=1)
old_fetch = "self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const u=new URL(e.request.url);if(u.origin!==location.origin)return;if(e.request.mode==='navigate'){e.respondWith(caches.match('./index.html').then(cached=>{const fresh=fetch(e.request).then(r=>{if(r.ok)caches.open(CACHE).then(c=>c.put('./index.html',r.clone()));return r}).catch(()=>cached);return cached||fresh}));return}e.respondWith(caches.match(e.request).then(cached=>{const fresh=fetch(e.request).then(r=>{if(r.ok)caches.open(CACHE).then(c=>c.put(e.request,r.clone()));return r}).catch(()=>cached);return cached||fresh}))});"
new_fetch = "self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const u=new URL(e.request.url);if(u.origin!==location.origin)return;if(e.request.mode==='navigate'){e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{if(r.ok)caches.open(CACHE).then(c=>c.put('./index.html',r.clone()));return r}).catch(()=>caches.match('./index.html')));return}e.respondWith(caches.match(e.request).then(cached=>{const fresh=fetch(e.request).then(r=>{if(r.ok)caches.open(CACHE).then(c=>c.put(e.request,r.clone()));return r}).catch(()=>cached);return cached||fresh}))});"
if old_fetch not in sw_text:
    raise SystemExit('service worker fetch handler not found')
sw_text = sw_text.replace(old_fetch, new_fetch, 1)
sw.write_text(sw_text, encoding='utf-8')
