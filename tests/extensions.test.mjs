import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {unzipSync,strFromU8} from 'fflate';
import {lessons} from '../curriculum/course.mjs';
import {grade,renderPreview} from '../server/runner.mjs';
import {createApp} from '../server/index.mjs';
import {openStore} from '../server/store.mjs';
const lesson=id=>lessons.find(l=>l.id===id);

test('Prošireni zahtevi traže novu proveru, ali čuvaju raniji kod',()=>{
 const store=openStore(':memory:',{rubricVersion:'0.2.0'});
 try{
  const user=store.user();const files=lesson('01').solution;
  store.save(user,'01',files,0);store.result(user,'01',files,{passed:true,results:[]});
  let state=store.state(user);assert.equal(state.progress['01'].passed,false);assert.equal(state.progress['01'].needsRecheck,true);assert.deepEqual(state.drafts['01'].files,files);
  store.result(user,'01',files,{passed:true,results:[],rubricVersion:'0.2.0'});
  state=store.state(user);assert.equal(state.progress['01'].passed,true);assert.equal(state.progress['01'].needsRecheck,false);
 }finally{store.close();}
});

test('Responsive provera otkriva pogrešan breakpoint i kasnije pravilo u media bloku',async()=>{
 const l=lesson('18');
 for(const code of [l.solution['styles.css'].replace('min-width:768px','min-width:900px'),l.solution['styles.css']+'\n@media (min-width:768px) { body { padding:7rem; } }']){
  const r=await grade(l,{...l.solution,'styles.css':code});assert.equal(r.passed,false);
 }
 const qa=lesson('20');
 assert.equal((await grade(qa,{...qa.solution,'styles.css':qa.solution['styles.css']+'\n@media (min-width:768px) { .product-card { width:900px; } }'})).passed,false);
});

test('Promocija zahteva reduced-motion pravilo, a ne samo bilo koji media upit',async()=>{
 const l=lesson('22');
 const files={...l.solution,'styles.css':l.solution['styles.css'].replace('prefers-reduced-motion:reduce','min-width:900px')};
 assert.equal((await grade(l,files)).passed,false);
});

test('Lokalni promotivni iframe prikazuje se samo u dozvoljenim lekcijama',async()=>{
 const files={...lesson('22').solution};
 files['index.html']=files['index.html'].replace('</main>','<iframe src="https://example.com" title="Spoljni"></iframe><iframe srcdoc="<script>alert(1)</script>"></iframe></main>');
 for(const allow of [false,true]){
  const html=await renderPreview(files,false,allow);
  const dom=new JSDOM(html);const frames=[...dom.window.document.querySelectorAll('iframe')];
  assert.equal(frames.length,allow?1:0);
  if(allow){assert.match(frames[0].getAttribute('src'),/^data:text\/html;base64,/);assert.equal(frames[0].getAttribute('sandbox'),'');assert.equal(frames[0].hasAttribute('srcdoc'),false);}
  assert.equal(dom.window.document.querySelector('script'),null);dom.window.close();
 }
});

test('Sve tri slike u pregledu postaju lokalni data resursi',async()=>{
 const html=await renderPreview(lesson('17').solution);
 const dom=new JSDOM(html);const images=[...dom.window.document.querySelectorAll('.product-card img')];
 assert.equal(images.length,3);assert.ok(images.every(img=>img.src.startsWith('data:image/svg+xml;base64,')));dom.window.close();
});

test('Novi redosled ne menja stare ID-jeve i Tailwind sledi responsive deo',()=>{
 assert.deepEqual(lessons.map(l=>l.order),Array.from({length:22},(_,i)=>i+1));
 assert.equal(lesson('11').title,'Tailwind: ista kartica, drugi zapis');
 assert.equal(lesson('14').order,22);
 assert.ok(lessons.indexOf(lesson('20'))<lessons.indexOf(lesson('11')));
 assert.equal(new Set(lessons.map(l=>l.id)).size,22);
});

test('Izvoz promocije nosi sve lokalne resurse, a prazan intervju ne briše rad',async()=>{
 const app=await createApp({dbPath:':memory:'});
 try{
  const response=await app.inject('/api/state');
  const c=response.cookies.map(x=>x.name+'='+x.value).join(';');
  const l=lesson('22');
  await app.inject({method:'POST',url:'/api/lessons/22/save',headers:{cookie:c},payload:{files:l.solution,revision:0}});
  const res=await app.inject({url:'/api/lessons/22/export',headers:{cookie:c}});
  const zip=unzipSync(res.rawPayload);
  for(const name of ['slusalice.svg','tastatura.svg','ranac.svg','promo.html'])assert.ok(zip['assets/'+name]);
  const html=strFromU8(zip['index.html']);assert.ok(html.includes('src="assets/promo.html"'));assert.ok(!html.includes('src="/assets/'));
  const blank=unzipSync((await app.inject({url:'/api/lessons/14/export?blank=1',headers:{cookie:c}})).rawPayload);
  assert.equal(strFromU8(blank['index.html']),'');assert.equal(strFromU8(blank['styles.css']),'');
  const state=(await app.inject({url:'/api/state',headers:{cookie:c}})).json();assert.deepEqual(state.drafts['22'].files,l.solution);
  const preview=await app.inject({method:'POST',url:'/api/preview',payload:{id:'22',files:l.solution}});assert.match(preview.json().html,/<iframe/);
  const blocked=await app.inject({method:'POST',url:'/api/preview',payload:{id:'01',files:l.solution}});assert.doesNotMatch(blocked.json().html,/<iframe/);
 }finally{await app.close();}
});
