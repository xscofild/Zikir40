/** Dependency-free logic smoke tests. Run: node tests/smoke.cjs */
'use strict';
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const source=fs.readFileSync(require('node:path').join(__dirname,'../app.js'),'utf8');
const memory=new Map();

function boot(){
  let handler;
  const app={innerHTML:'',addEventListener:(type,fn)=>{if(type==='click')handler=fn;}};
  const toast={innerHTML:'',classList:{add(){},remove(){}}};
  const confetti={replaceChildren(){},appendChild(){}};
  const document={
    querySelector(selector){return {'#app':app,'#toast':toast,'#confetti':confetti}[selector]||null;},
    addEventListener(){},createElement(){return {className:'',style:{}};},body:{contains(){return true;}}
  };
  const context={
    document, Intl, Date, console, Math, performance:{now:()=>0},
    location:{protocol:'file:'}, navigator:{},
    window:{matchMedia:()=>({matches:true})},
    localStorage:{getItem:(key)=>memory.get(key)??null,setItem:(key,value)=>memory.set(key,value)},
    setTimeout:()=>0,clearTimeout:()=>{},requestAnimationFrame:()=>{}
  };
  vm.runInNewContext(source,context);
  return {
    get html(){return app.innerHTML;},
    get toast(){return toast.innerHTML;},
    click(action, dataset={}){
      const target={dataset:{...dataset,action}, disabled:false,
        classList:{contains:()=>false},closest(){return this;}};
      handler({target});
    }
  };
}
let ui=boot();
assert.match(ui.html,/FIKTIVE DEMO/);
assert.match(ui.html,/624,80/);
assert.doesNotMatch(ui.html,/Millionär-Modus an!/);
ui.click('reveal');
assert.match(ui.html,/8\.889\.513,68/);
assert.match(ui.html,/Millionär-Modus an!/);
ui.click('switch-tab',{tab:'activity'});
assert.match(ui.html,/Universum der Wünsche/);
assert.match(ui.html,/8\.888\.888,88/);
ui.click('detail',{id:'bonus'});
assert.match(ui.html,/Fiktive Buchung\. Kein Nachweis/);
ui.click('close-sheet');
ui.click('switch-tab',{tab:'cards'});
assert.match(ui.html,/DEMO · NOT A PAYMENT CARD/);
ui.click('switch-tab',{tab:'settings'});
ui.click('preset',{amount:'99999999.99'});
ui.click('switch-tab',{tab:'home'});
assert.match(ui.html,/8\.889\.513,68/, 'changing next preset must not alter already credited balance');
ui.click('switch-tab',{tab:'settings'});
ui.click('reset');
assert.match(ui.html,/624,80/);
ui.click('reveal');
assert.match(ui.html,/100\.000\.624,79/);
ui=boot();
assert.match(ui.html,/100\.000\.624,79/, 'refresh must preserve saved state');
assert.match(ui.html,/KEINE ECHTE BANK/);
console.log('PASS: 12 smoke checks — balance, simulated credit, transactions, details, card, settings, reset, persistence, disclosures');