import test from 'node:test';import assert from 'node:assert/strict';
import {JSDOM,VirtualConsole} from 'jsdom';import{unzipSync,strFromU8}from'fflate';
import {lessons,days,reactPrerequisite,courseVersion} from '../curriculum/catalog.mjs';
import {lessons as original} from '../curriculum/course.mjs';
import {dayTwoLessons} from '../curriculum/day-two.mjs';
import {jsLessons} from '../curriculum/intro-javascript.mjs';
import {javascriptDocument,instrumentJavaScript} from '../server/javascript.mjs';
import {createApp} from '../server/index.mjs';
async function execute(document){
 let report;const dom=new JSDOM(document.html,{runScripts:'dangerously',virtualConsole:new VirtualConsole(),beforeParse(window){window.parent.postMessage=data=>{report=data;};}});
 assert.ok(report,'Browser harness mora prijaviti rezultat');return {report,dom};
}
const complete=(lesson,report)=>!report.error&&report.results.length===lesson.tests.filter(t=>t.type==='browserJS').length&&report.results.every(r=>r.passed);
for(const l of jsLessons){
 test('JS referentna interakcija i provere: '+l.id,async()=>{const {report,dom}=await execute(await javascriptDocument(l,l.solution));try{assert.equal(complete(l,report),true,JSON.stringify(report));}finally{dom.window.close();}});
 test('JS početni kod nema lažni prolaz: '+l.id,async()=>{const {report,dom}=await execute(await javascriptDocument(l,l.seed));try{assert.equal(complete(l,report),false);}finally{dom.window.close();}});
}
test('Četiri dana čuvaju Dan 1 i 2, a ubrzana putanja ima jedinstvene ID-jeve',()=>{
 assert.deepEqual(days.map(d=>d.day),[1,2,3,4]);assert.equal(lessons.length,34);assert.equal(new Set(lessons.map(l=>l.id)).size,34);
 for(const l of original.filter(l=>lessons.some(n=>n.id===l.id))){const next=lessons.find(n=>n.id===l.id);assert.ok(next);assert.equal(next.required,true);assert.deepEqual(next.tests,l.tests);assert.deepEqual(next.solution,l.solution);}
 for(const d of days){const list=lessons.filter(l=>l.day===d.day);assert.deepEqual(list.map(l=>l.order),list.map((_,i)=>i+1));assert.equal(list.filter(l=>l.javascript).length,d.day===4?2:1);assert.equal(d.minutes,list.reduce((s,l)=>s+l.minutes,0)+(d.orientationMinutes??0));}
 assert.equal(lessons.find(l=>l.id==='05').day,1);assert.equal(reactPrerequisite.required,true);assert.equal(reactPrerequisite.reactAvailable,false);
 assert.ok(lessons.findIndex(l=>l.id==='js-01')<lessons.findIndex(l=>l.id==='06'));
 assert.ok(lessons.findIndex(l=>l.id==='layout-06')<lessons.findIndex(l=>l.id==='tw-01'));
 assert.equal(lessons.find(l=>l.id==='bootstrap-01').day,4);
});
test('JS čuva kod, proverava vezu sa pokušajem, izvozi i vraća projekat',async()=>{
 const app=await createApp({dbPath:':memory:'});try{await app.ready();const l=lessons.find(l=>l.id==='js-02');const cookie=(await app.inject('/api/state')).headers['set-cookie'].split(';')[0];const headers={cookie};const post=(url,payload)=>app.inject({method:'POST',url,headers,payload});
 let r=await post('/api/lessons/'+l.id+'/grade',{files:l.solution,revision:0});assert.equal(r.statusCode,400,'Bez izvršene JS provere nema prolaza');
 const doc=(await post('/api/lessons/'+l.id+'/js-run',{files:l.solution})).json();const {report,dom}=await execute(doc);dom.window.close();
 r=await post('/api/lessons/'+l.id+'/grade',{files:l.solution,revision:0,javascript:{token:doc.token,results:report.results}});assert.equal(r.statusCode,200);assert.equal(r.json().passed,true);assert.equal(r.json().execution,'browser-reported');
 r=await post('/api/lessons/'+l.id+'/grade',{files:l.solution,revision:1,javascript:{token:doc.token,results:report.results}});assert.equal(r.statusCode,400,'Token je jednokratan');
 const state=(await app.inject({url:'/api/state',headers})).json();assert.equal(state.drafts[l.id].files['script.js'],l.solution['script.js']);assert.equal(state.progress[l.id].passed,true);
 const zipped=unzipSync((await app.inject({url:'/api/lessons/'+l.id+'/export',headers})).rawPayload);assert.equal(strFromU8(zipped['script.js']),l.solution['script.js']);assert.match(strFromU8(zipped['index.html']),/src="script.js"/);
 const roundtrip=Object.fromEntries(['index.html','styles.css','script.js'].map(n=>[n,strFromU8(zipped[n])]));const done=await execute(await javascriptDocument(l,roundtrip));assert.equal(complete(l,done.report),true);done.dom.window.close();
 const other=(await app.inject('/api/state')).headers['set-cookie'].split(';')[0];const next=(await post('/api/lessons/'+l.id+'/js-run',{files:l.solution})).json();
 r=await app.inject({method:'POST',url:'/api/lessons/'+l.id+'/grade',headers:{cookie:other},payload:{files:l.solution,revision:0,javascript:{token:next.token,results:report.results}}});assert.equal(r.statusCode,400);
 const altered=(await post('/api/lessons/'+l.id+'/js-run',{files:l.solution})).json();r=await post('/api/lessons/'+l.id+'/grade',{files:{...l.solution,'script.js':l.solution['script.js']+'\n// changed'},revision:1,javascript:{token:altered.token,results:report.results}});assert.equal(r.statusCode,400);
 }finally{await app.close();}
});
test('Prethodni rad, pomoć, kvizovi i prolazi ostaju posle preraspodele',async()=>{
 const app=await createApp({dbPath:':memory:'});try{const user=app.courseStore.user();const old=original.find(l=>l.id==='06');app.courseStore.save(user,old.id,old.solution,0);app.courseStore.result(user,old.id,old.solution,{passed:true,results:[],rubricVersion:courseVersion});app.courseStore.hint(user,old.id,'hint',1);
 const state=app.courseStore.state(user);assert.equal(state.progress['06'].passed,true);assert.deepEqual(state.drafts['06'].files,old.solution);assert.equal(state.hints['06'].level,1);assert.equal(lessons.find(l=>l.id==='06').day,2);
 }finally{await app.close();}
});
test('Izolovan JS dokument ne učitava umetnute studentske skripte i blokira mrežu',async()=>{
 const l=jsLessons[0];const doc=await javascriptDocument(l,{...l.solution,'index.html':l.solution['index.html'].replace('</body>','<script src="https://evil.example/x.js"></script><img src="x" onerror="alert(1)"></body>')});const d=new JSDOM(doc.html);try{const scripts=[...d.window.document.scripts];assert.equal(scripts.length,2);assert.ok(scripts.every(s=>s.nonce===doc.token));assert.ok(scripts.every(s=>!s.src));assert.ok(!d.window.document.querySelector('[onerror]'));assert.match(d.window.document.querySelector('meta[http-equiv]').content,/connect-src 'none'/);assert.match(d.window.document.querySelector('meta[http-equiv]').content,/frame-src 'none'/);}finally{d.window.close();}
});
test('Česta beskonačna petlja i sintaksna greška prijavljuju neuspeh',async()=>{
 const l=jsLessons[0];for(const code of ['while(true) {}','for(;;);','const broken = ;']){const {report,dom}=await execute(await javascriptDocument(l,{...l.solution,'script.js':code}));try{assert.ok(report.error);assert.equal(complete(l,report),false);}finally{dom.window.close();}}
 assert.match(instrumentJavaScript('const f=x=>x+1;'),/__courseGuard/);
});
test('Interakcija i dalje radi nakon dužeg čitanja lekcije',async()=>{
 const l=jsLessons[0];const {report,dom}=await execute(await javascriptDocument(l,l.solution));try{assert.ok(complete(l,report));await new Promise(r=>setTimeout(r,1300));dom.window.document.querySelector('#favorite').click();assert.equal(dom.window.document.querySelector('#favorite').textContent,'Sačuvano');}finally{dom.window.close();}
});
