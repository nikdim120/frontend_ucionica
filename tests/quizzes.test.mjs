import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createApp} from '../server/index.mjs';
import {lessons} from '../curriculum/course.mjs';
import {quizzes,gradeQuiz,totalQuizQuestions,totalQuizMinutes} from '../curriculum/quizzes.mjs';
const cookie=r=>(Array.isArray(r.headers['set-cookie'])?r.headers['set-cookie'][0]:r.headers['set-cookie']).split(';')[0];
const answers=id=>Object.fromEntries(quizzes[id].map(q=>[q.id,q.correct]));
test('Svaka etapa ima proverljiv kviz: četiri različite opcije, nagoveštaj i jedan tačan odgovor',()=>{
 assert.equal(totalQuizQuestions,71);assert.equal(totalQuizMinutes,74);assert.equal(Object.keys(quizzes).length,54);
 for(const l of lessons){const qs=quizzes[l.id];assert.ok(qs.length>=2);for(const q of qs){assert.equal(q.options.length,4);assert.equal(new Set(q.options.map(o=>o.label)).size,4);assert.equal(q.options.filter(o=>o.id===q.correct).length,1);assert.ok(q.hint&&q.explanation&&q.prompt);assert.ok(q.options.every(o=>o.feedback));}const r=gradeQuiz(l.id,answers(l.id));assert.equal(r.score,qs.length);assert.throws(()=>gradeQuiz(l.id,{}));}
 const math=quizzes['05'];assert.equal(math[0].options.find(o=>o.id===math[0].correct).label,'348px');assert.equal(math[1].options.find(o=>o.id===math[1].correct).label,'252px');
});
test('API krije rešenja pre predaje, odbija nepotpun unos i čuva odvojene rezultate bez praktičnog prolaza',async()=>{
 const app=await createApp({dbPath:':memory:'});await app.ready();
 try{
  const c=cookie(await app.inject('/api/state'));
  const req=(method,url,payload)=>app.inject({method,url,payload,headers:{cookie:c}});
  const course=(await req('GET','/api/course')).json();assert.equal(course.totalQuizQuestions,71);
  const question=course.lessons.find(l=>l.id==='05').quiz.questions[0];assert.equal(question.correct,undefined);assert.equal(question.explanation,undefined);assert.equal(question.options[0].feedback,undefined);
  let r=await req('POST','/api/lessons/05/quiz',{answers:{}});assert.equal(r.statusCode,400);
  r=await req('GET','/api/lessons/05/quiz');assert.equal(r.json().attempts,0);
  const wrong=Object.fromEntries(quizzes['05'].map(q=>[q.id,q.correct==='A'?'B':'A']));
  r=await req('POST','/api/lessons/05/quiz',{answers:wrong});assert.equal(r.json().lastResult.score,0);
  r=await req('POST','/api/lessons/05/quiz',{answers:answers('05')});assert.equal(r.json().lastResult.score,5);assert.equal(r.json().attempts,2);assert.equal(r.json().bestScore,5);assert.ok(r.json().lastResult.results[0].explanation);
  const state=(await req('GET','/api/state')).json();assert.equal(state.progress['05'],undefined);assert.equal(state.quizzes[0].attempts,2);
  const second=cookie(await app.inject('/api/state'));r=await app.inject({url:'/api/lessons/05/quiz',headers:{cookie:second}});assert.equal(r.json().attempts,0);
  r=await req('POST','/api/lessons/99/quiz',{answers:answers('05')});assert.equal(r.statusCode,404);
  r=await app.inject({method:'POST',url:'/api/lessons/05/quiz',payload:{answers:answers('05')},headers:{cookie:c,origin:'https://foreign.example'}});assert.equal(r.statusCode,403);
  r=await req('GET','/api/export');assert.equal(r.json().quizzes[0].bestScore,5);
 }finally{await app.close();}
});
test('Kviz ostaje posle ponovnog otvaranja baze; reset praktičnog zadatka ne briše kviz',async()=>{
 const dir=mkdtempSync(join(tmpdir(),'course-quiz-'));const dbPath=join(dir,'quiz.sqlite');let app=await createApp({dbPath});await app.ready();
 try{
  const c=cookie(await app.inject('/api/state'));const payload={answers:answers('01')};
  await app.inject({method:'POST',url:'/api/lessons/01/quiz',payload,headers:{cookie:c}});
  await app.close();app=await createApp({dbPath});await app.ready();
  let r=await app.inject({url:'/api/lessons/01/quiz',headers:{cookie:c}});assert.equal(r.json().lastResult.score,2);
  await app.inject({method:'POST',url:'/api/lessons/01/reset',payload:{},headers:{cookie:c}});
  r=await app.inject({url:'/api/lessons/01/quiz',headers:{cookie:c}});assert.equal(r.json().attempts,1);
 }finally{await app.close();rmSync(dir,{recursive:true,force:true});}
});
