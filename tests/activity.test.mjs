import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {openStore} from '../server/store.mjs';
import {createApp} from '../server/index.mjs';
import {activeSlice,formatDuration} from '../src/activity-clock.mjs';
const a='session-aaaaaaaaaaaaaaaa',b='session-bbbbbbbbbbbbbbbb';
const beat=(sessionId,sequence,durationMs,lessonId='01')=>({sessionId,sequence,durationMs,lessonId});

test('Zatvoren/neaktivan prozor, pauza, idle i uspavljivanje ne daju aktivno vreme',()=>{
 assert.equal(activeSlice(0,1000,0),1000);
 assert.equal(activeSlice(59500,60500,0),500);
 assert.equal(activeSlice(60000,61000,0),0);
 for(const flags of [{visible:false},{focused:false},{paused:true}])assert.equal(activeSlice(0,1000,0,flags),0);
 assert.equal(activeSlice(0,100000,90000),0);
 assert.equal(formatDuration(3661000),'01:01:01');
});
test('Server ne duplira ponovljene poruke i preklopljeno vreme više kartica',()=>{
 const s=openStore(':memory:');try{
  const u=s.user();s.activity.record(u,beat(a,0,0),0);s.activity.record(u,beat(b,0,0),0);
  assert.equal(s.activity.record(u,beat(a,1,10000),10000).creditedMs,10000);
  assert.equal(s.activity.record(u,beat(a,1,10000),12000).creditedMs,0);
  assert.equal(s.activity.record(u,beat(b,1,10000,'02'),10000).creditedMs,0);
  assert.equal(s.activity.record(u,beat(b,2,10000,'02'),15000).creditedMs,5000);
  assert.deepEqual(s.activity.summary(u),{totalMs:15000,byLesson:{'01':10000,'02':5000}});
 }finally{s.close();}
});
test('Server ograničava vreme na proteklo realno vreme i odbija neispravne intervale',()=>{
 const s=openStore(':memory:');try{
  const u=s.user();assert.throws(()=>s.activity.record(u,beat(a,0,1000),0));
  s.activity.record(u,beat(a,0,0),0);
  assert.equal(s.activity.record(u,beat(a,1,15000),1000).creditedMs,1000);
  assert.throws(()=>s.activity.record(u,beat(a,2,15001),20000));
  assert.throws(()=>s.activity.record(u,beat(a,2,-1),20000));
  assert.equal(s.activity.record(u,beat(a,2,1000),500).creditedMs,0);
 }finally{s.close();}
});
test('Vreme preživljava ponovno otvaranje SQLite-a i reset zadatka ga ne briše',()=>{
 const dir=mkdtempSync(join(tmpdir(),'activity-'));const path=join(dir,'course.sqlite');let s=openStore(path);
 try{
  const u=s.user();s.activity.record(u,beat(a,0,0),0);s.activity.record(u,beat(a,1,7000),7000);
  s.reset(u,'01');s.close();s=openStore(path);
  assert.equal(s.activity.summary(u).totalMs,7000);assert.equal(s.state(u).activity.totalMs,7000);assert.equal(s.export(u).activity.byLesson['01'],7000);
  assert.equal(s.activity.summary(s.user()).totalMs,0);
 }finally{s.close();rmSync(dir,{recursive:true,force:true});}
});
test('API aktivnosti validira lekciju, profil i poreklo zahteva',async()=>{
 const app=await createApp({dbPath:':memory:'});try{
  const state=await app.inject('/api/state');const cookie=state.cookies.map(x=>x.name+'='+x.value).join(';');
  const post=payload=>app.inject({method:'POST',url:'/api/activity/heartbeat',headers:{cookie},payload});
  assert.equal((await post(beat(a,0,0))).statusCode,200);
  assert.equal((await post(beat(a,1,15001))).statusCode,400);
  assert.equal((await post(beat(a,1,0,'99'))).statusCode,404);
  assert.equal((await post(beat('invalid',1,0))).statusCode,400);
  assert.equal((await app.inject({method:'POST',url:'/api/activity/heartbeat',headers:{cookie,origin:'https://foreign.example'},payload:beat(a,1,0)})).statusCode,403);
  const other=await app.inject('/api/activity');assert.equal(other.json().totalMs,0);
  const exportData=(await app.inject({url:'/api/export',headers:{cookie}})).json();assert.equal(exportData.activity.totalMs,0);
 }finally{await app.close();}
});
