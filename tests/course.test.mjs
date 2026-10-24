import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {lessons} from '../curriculum/course.mjs';
import {grade,renderPreview} from '../server/runner.mjs';
import {createApp} from '../server/index.mjs';
import {unzipSync,strFromU8} from 'fflate';
const cookie=r=>{const h=r.headers['set-cookie'];return (Array.isArray(h)?h[0]:h)?.split(';')[0]??r.cookies?.map(c=>c.name+'='+c.value).join(';');};
for(const l of lessons){
 test('Referentno rešenje prolazi: '+l.id+' '+l.title,async()=>assert.equal((await grade(l,l.solution)).passed,true));
 test('Početni kod ne daje lažni prolaz: '+l.id,async()=>assert.equal((await grade(l,l.seed)).passed,false));
}
test('CSS test čita efektivnu poslednju deklaraciju, ne samo prvo pravilo',async()=>{
 const l=lessons[4];const f={...l.solution,'styles.css':l.solution['styles.css']+'\n.product-card { max-width:900px; }'};
 assert.equal((await grade(l,f)).passed,false);
});
test('Tailwind se kompajlira, a vraćanje starog CSS-a ne prolazi preradu',async()=>{
 const l=lessons.find(l=>l.id==='11');const f={...l.solution,'styles.css':l.solution['styles.css']+'\n.product-card {padding:24px;}'};
 assert.equal((await grade(l,f)).passed,false);
});
test('Student skripta se ne izvršava i preview uklanja aktivan sadržaj',async()=>{
 const html='<script>globalThis.HACKED=1</script><img onerror="alert(1)" src="x"><iframe src="https://example.com"></iframe><form action="https://example.com"><input></form>';
 const rendered=await renderPreview({'index.html':html,'styles.css':''});
 assert.equal(rendered.includes('<script'),false);assert.equal(rendered.includes('onerror='),false);assert.equal(rendered.includes('<iframe'),false);assert.equal(rendered.includes('form-action \'none\''),true);
 assert.equal(globalThis.HACKED,undefined);
});
test('API čuva kod i proverava prolaz, pomoć i revizije',async()=>{
 const app=await createApp({dbPath:':memory:'});await app.ready();
 try{
  const welcome=await app.inject('/api/state');const c=cookie(welcome);assert.ok(c);
  const get=path=>app.inject({url:path,headers:{cookie:c}});
  const post=(path,payload)=>app.inject({method:'POST',url:path,payload,headers:{cookie:c}});
  const l=lessons[0];
  let r=await post('/api/lessons/01/save',{files:l.solution,revision:0});assert.equal(r.statusCode,200);assert.equal(r.json().revision,1);
  r=await post('/api/lessons/01/grade',{files:l.solution,revision:1});assert.equal(r.json().passed,true);
  const changed={...l.solution,'index.html':'<p>Pokvaren dokument</p>'};
  r=await post('/api/lessons/01/save',{files:changed,revision:1});assert.equal(r.json().revision,2);
  r=await get('/api/state');assert.equal(r.json().progress['01'].passed,false);assert.equal(r.json().drafts['01'].files['index.html'],changed['index.html']);
  r=await post('/api/lessons/01/save',{files:l.solution,revision:1});assert.equal(r.statusCode,409);
  await post('/api/lessons/01/hint',{level:1});await post('/api/lessons/01/solution',{});
  r=await get('/api/state');assert.equal(r.json().hints['01'].solution,true);
  const other=await app.inject('/api/state');assert.equal(Object.keys(other.json().drafts).length,0);
  r=await post('/api/lessons/99/save',{files:l.solution});assert.equal(r.statusCode,404);
  r=await post('/api/lessons/01/save',{files:{'index.html':5,'styles.css':''}});assert.equal(r.statusCode,400);
  r=await app.inject({method:'POST',url:'/api/lessons/01/save',payload:{files:l.solution},headers:{cookie:c,origin:'https://foreign.example'}});assert.equal(r.statusCode,403);
 }finally{await app.close();}
});
test('SQLite preživljava ponovno pokretanje servera',async()=>{
 const dir=mkdtempSync(join(tmpdir(),'eprodavnica-'));const dbPath=join(dir,'course.sqlite');let c;
 let app=await createApp({dbPath});await app.ready();
 try{
  const r=await app.inject('/api/state');c=cookie(r);
  await app.inject({method:'POST',url:'/api/lessons/03/grade',payload:{files:lessons[2].solution,revision:0},headers:{cookie:c}});
  await app.close();app=await createApp({dbPath});await app.ready();
  const again=(await app.inject({url:'/api/state',headers:{cookie:c}})).json();
  assert.equal(again.progress['03'].passed,true);assert.deepEqual(again.drafts['03'].files,lessons[2].solution);
 }finally{await app.close();rmSync(dir,{recursive:true,force:true});}
});
test('Reset briše samo izabrani zadatak',async()=>{
 const app=await createApp({dbPath:':memory:'});await app.ready();
 try{
  const c=cookie(await app.inject('/api/state'));
  for(const l of lessons.slice(0,2))await app.inject({method:'POST',url:'/api/lessons/'+l.id+'/grade',payload:{files:l.solution,revision:0},headers:{cookie:c}});
  await app.inject({method:'POST',url:'/api/lessons/01/reset',payload:{},headers:{cookie:c}});
  const s=(await app.inject({url:'/api/state',headers:{cookie:c}})).json();
  assert.equal(s.drafts['01'],undefined);assert.equal(s.progress['02'].passed,true);
 }finally{await app.close();}
});
test('Izvoz je ZIP koji radi lokalno i sadrži kompajliran Tailwind',async()=>{
 const app=await createApp({dbPath:':memory:'});await app.ready();
 try{
  const c=cookie(await app.inject('/api/state'));
  await app.inject({method:'POST',url:'/api/lessons/11/save',payload:{files:lessons.find(l=>l.id==='11').solution,revision:0},headers:{cookie:c}});
  const r=await app.inject({url:'/api/lessons/11/export',headers:{cookie:c}});
  assert.equal(r.statusCode,200);assert.match(r.headers['content-disposition'],/attachment/);
  const files=unzipSync(r.rawPayload);
  assert.ok(files['assets/slusalice.svg']);assert.ok(files['tailwind.css']);
  const html=strFromU8(files['index.html']);
  assert.ok(html.includes('href="tailwind.css"'));assert.ok(html.includes('src="assets/slusalice.svg"'));
  assert.ok(strFromU8(files['tailwind.css']).includes('.p-6'));
  assert.equal((await grade(lessons.find(l=>l.id==='11'),{'index.html':html,'styles.css':strFromU8(files['styles.css'])})).passed,true);
 }finally{await app.close();}
});
