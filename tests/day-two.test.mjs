import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {unzipSync,strFromU8} from 'fflate';
import {dayTwoLessons} from '../curriculum/day-two.mjs';
import {lessons} from '../curriculum/catalog.mjs';
import {dayTwoQuizzes} from '../curriculum/day-two-quizzes.mjs';
import {grade,validateFiles} from '../server/runner.mjs';
import {layoutDocument} from '../server/layout-checks.mjs';
import {createApp} from '../server/index.mjs';
for(const l of dayTwoLessons){
 test('Dan 2 rešenje: '+l.title,async()=>assert.equal((await grade(l,l.solution)).passed,true));
 test('Dan 2 početni kod ne prolazi: '+l.id,async()=>assert.equal((await grade(l,l.seed)).passed,false));
}
test('Dve putanje imaju stabilne jedinstvene ID-jeve i 40 novih kviz pitanja',()=>{
 assert.equal(lessons.length,34);assert.equal(new Set(lessons.map(l=>l.id)).size,34);assert.deepEqual(dayTwoLessons.map(l=>l.order),Array.from({length:18},(_,i)=>i+1));assert.equal(Object.values(dayTwoQuizzes).flat().length,40);
 for(const l of dayTwoLessons){assert.equal(l.day,2);assert.ok(l.theory.length>=3);assert.equal(l.hints.length,3);assert.ok(l.layoutChecks.length);}
});
test('Treća HTML datoteka se čuva, izvozi, kompajlira i ponovo proverava',async()=>{
 const app=await createApp({dbPath:':memory:'});await app.ready();try{
 const l=dayTwoLessons[15],cookie=(await app.inject('/api/state')).headers['set-cookie'].split(';')[0];const headers={cookie};
 const post=(url,payload)=>app.inject({method:'POST',url,headers,payload});
 let r=await post('/api/lessons/'+l.id+'/grade',{files:l.solution,revision:0});assert.equal(r.json().passed,true);
 r=await app.inject({url:'/api/lessons/'+l.id+'/export',headers});assert.equal(r.statusCode,200);const zip=unzipSync(r.rawPayload);assert.ok(zip['katalog.html']);assert.match(strFromU8(zip['katalog.html']),/href="tailwind.css"/);assert.match(strFromU8(zip['tailwind.css']),/max-w-6xl/);
 const back=Object.fromEntries(['index.html','katalog.html','styles.css'].map(n=>[n,strFromU8(zip[n])]));assert.equal((await grade(l,back)).passed,true);
 r=await post('/api/preview',{id:l.id,files:l.solution,page:'katalog.html'});assert.equal(r.statusCode,200);const dom=new JSDOM(r.json().html);assert.match(dom.window.document.title,/Katalog/);assert.equal(dom.window.document.querySelectorAll('script').length,0);assert.match(dom.window.document.querySelector('style').textContent,/max-w-6xl/);dom.window.close();
 const state=(await app.inject({url:'/api/state',headers})).json();assert.equal(state.drafts[l.id].files['katalog.html'],l.solution['katalog.html']);
 r=await post('/api/lessons/'+l.id+'/grade',{files:{...l.solution,'katalog.html':'<p>Prazno</p>'},revision:1});assert.equal(r.json().passed,false);
 assert.throws(()=>validateFiles({...l.solution,'katalog.html':42}));
 }finally{await app.close();}
});
test('Merenje dodaje samo kontrolisan nonce script u izolovan dokument',async()=>{
 const l=dayTwoLessons[6];const result=await layoutDocument(l,{...l.solution,'index.html':l.solution['index.html'].replace('</body>','<script>alert("student")</script><img onerror="alert(1)" src="x"></body>')});
 const dom=new JSDOM(result.html);const scripts=dom.window.document.querySelectorAll('script');assert.equal(scripts.length,1);assert.equal(scripts[0].nonce,result.token);assert.equal(result.html.includes('alert('),false);assert.match(scripts[0].textContent,/postMessage/);assert.match(dom.window.document.querySelector('meta[http-equiv]').content,new RegExp('nonce-'+result.token));dom.window.close();
});
