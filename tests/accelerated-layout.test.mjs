import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM,VirtualConsole} from 'jsdom';
import {unzipSync,strFromU8} from 'fflate';
import {lessons,days,legacyLessons} from '../curriculum/catalog.mjs';
import {grade,renderPreview} from '../server/runner.mjs';
import {javascriptDocument} from '../server/javascript.mjs';
import {createApp} from '../server/index.mjs';
import {publicQuiz} from '../curriculum/quizzes.mjs';
for(const l of lessons.filter(l=>l.day>=3))test('Ubrzana etapa ima ostvarivo rešenje i ne daje početni prolaz: '+l.id,async()=>{
 const solution=await grade(l,l.solution),seed=await grade(l,l.seed);
 assert.equal(solution.results.filter((r,i)=>l.tests[i].type!=='browserJS').every(r=>r.passed),true,JSON.stringify(solution.results));
 assert.equal(seed.passed,false);
 if(l.javascript){let report;const doc=await javascriptDocument(l,l.solution);const dom=new JSDOM(doc.html,{runScripts:'dangerously',virtualConsole:new VirtualConsole(),beforeParse(w){w.parent.postMessage=data=>{report=data};}});try{assert.ok(report);assert.ok(!report.error,report.error);assert.ok(report.results.every(r=>r.passed));}finally{dom.window.close();}}
});
test('Sažimanje ne menja Dan 1, a dani 3/4 su oko pet sati sa JS i kvizovima',()=>{
 assert.deepEqual(lessons.filter(l=>l.day===1).map(l=>l.id),['01','02','03','04','05','15','16','js-01']);
 assert.deepEqual(days.map(d=>d.minutes+lessons.filter(l=>l.day===d.day).reduce((n,l)=>n+publicQuiz(l.id).minutes,0)),[293,349,308,304]);
 assert.equal(lessons.find(l=>l.id==='layout-04').tests.some(t=>t.type==='css'&&t.value==='repeat(3,1fr)'),false,'Konačna auto-fit mreža ne sme zahtevati suprotno fiksno pravilo.');
 assert.ok(legacyLessons.some(l=>l.id==='2-18'));
});
test('Bootstrap radi lokalno u pregledu i izvozu bez Tailwinda ili CDN-a',async()=>{
 const lesson=lessons.find(l=>l.bootstrap),app=await createApp({dbPath:':memory:'});try{
 const cookie=(await app.inject('/api/state')).headers['set-cookie'].split(';')[0],headers={cookie};
 const save=await app.inject({method:'POST',url:'/api/lessons/'+lesson.id+'/save',headers,payload:{files:lesson.solution,revision:0}});assert.equal(save.statusCode,200);
 const preview=await renderPreview(lesson.solution);assert.match(preview,/Bootstrap\s+v5\.3\.8/);assert.ok(!preview.includes('cdn.jsdelivr.net'));assert.match(preview,/\.col-md-6/);
 const zip=unzipSync((await app.inject({url:'/api/lessons/'+lesson.id+'/export',headers})).rawPayload);assert.ok(zip['bootstrap.css']);assert.ok(!zip['tailwind.css']);assert.match(strFromU8(zip['index.html']),/href="bootstrap.css"/);
 const course=(await app.inject('/api/course')).json();assert.equal(course.lessons.length,34);assert.ok(!course.lessons.some(l=>l.id==='2-18'));
 const demo=await app.inject('/api/demo?day=4');assert.equal(demo.statusCode,200);
 }finally{await app.close();}
});
