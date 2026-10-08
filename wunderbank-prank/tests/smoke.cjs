'use strict';
const fs=require('node:fs');const vm=require('node:vm');const assert=require('node:assert/strict');const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');const memory=new Map();
function boot(){let handler;const app={innerHTML:'',addEventListener:(event,fn)=>{if(event==='click')handler=fn;}};const toast={textContent:'',classList:{add(){},remove(){}}};
const doc={querySelector(selector){return {'#app':app,'#toast':toast}[selector]||null;},addEventListener(){}};
vm.runInNewContext(source,{document:doc,localStorage:{getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v)},window:{scrollTo(){}},navigator:{},location:{protocol:'file:'},Intl,Date,console,Math,setTimeout:()=>0});
return{get html(){return app.innerHTML;},click(action,data={}){const target={dataset:{action,...data},disabled:false,classList:{contains:()=>false},closest(){return this}};handler({target})}};}
let ui=boot();assert.match(ui.html,/East Bank/);assert.match(ui.html,/333,34/);assert.match(ui.html,/FIKTIVE BANK/);assert.match(ui.html,/Accounts/);
ui.click('account');assert.match(ui.html,/AktivKonto/);assert.match(ui.html,/Current transactions/);assert.match(ui.html,/30 days/);ui.click('range',{range:'90'});assert.match(ui.html,/90 days/);
ui.click('transaction',{id:'t1'});assert.match(ui.html,/Simuliert · nicht echt/);ui.click('close-modal');
ui.click('tab',{tab:'services'});assert.match(ui.html,/Demo studio/);ui.click('preset',{amount:'1000000'});ui.click('credit');assert.match(ui.html,/1\.000\.333,34/);assert.match(ui.html,/Demogutschrift/);assert.match(ui.html,/Simulierter Zahlungseingang/);
ui=boot();assert.match(ui.html,/1\.000\.333,34/, 'balance persists after reload');ui.click('tab',{tab:'services'});assert.match(ui.html,/Gutschrift bereits simuliert/);ui.click('reset');assert.match(ui.html,/333,34/);assert.doesNotMatch(ui.html,/1\.000\.333,34/);
ui.click('tab',{tab:'transfer'});assert.match(ui.html,/SEPA transfer/);ui.click('transfer-info');assert.match(ui.html,/Nur Demo/);
ui.click('tab',{tab:'invest'});assert.match(ui.html,/No investment product/);ui.click('tab',{tab:'products'});assert.match(ui.html,/Card products/);
console.log('PASS: 21 banking-demo checks — balance, UI sections, history, transaction details, currency, credit, persistence, reset, static functions');