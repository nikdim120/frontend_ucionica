import test from 'node:test';
import assert from 'node:assert/strict';
import React,{act} from 'react';
import {createRoot} from 'react-dom/client';
import {JSDOM} from 'jsdom';
import {useActiveTime} from '../src/useActiveTime.ts';

test('Merač povezuje interakciju, pauzu, vidljivost i promenu lekcije sa API-jem',async t=>{
 const dom=new JSDOM('<div id="root"></div>',{url:'http://localhost/'});
 const oldWindow=globalThis.window,oldDocument=globalThis.document,oldAct=globalThis.IS_REACT_ACT_ENVIRONMENT;
 globalThis.window=dom.window;globalThis.document=dom.window.document;globalThis.IS_REACT_ACT_ENVIRONMENT=true;
 let now=0,visible=true,focused=true,latest;
 Object.defineProperty(dom.window.document,'visibilityState',{get:()=>visible?'visible':'hidden'});
 dom.window.document.hasFocus=()=>focused;
 const timers=[];const calls=[];const totals={totalMs:0,byLesson:{}};
 t.mock.method(performance,'now',()=>now);
 t.mock.method(globalThis,'setInterval',(callback)=>{timers.push(callback);return timers.length;});
 t.mock.method(globalThis,'clearInterval',()=>{});
 t.mock.method(globalThis,'fetch',async(_url,options)=>{
  const body=JSON.parse(options.body);calls.push(body);
  totals.totalMs+=body.durationMs;totals.byLesson[body.lessonId]=(totals.byLesson[body.lessonId]??0)+body.durationMs;
  return {ok:true,json:async()=>JSON.parse(JSON.stringify(totals))};
 });
 function Probe({id}){latest=useActiveTime(id,true);return null;}
 const root=createRoot(dom.window.document.getElementById('root'));
 try{
  await act(async()=>root.render(React.createElement(Probe,{id:'01'})));
  assert.equal(calls[0].durationMs,0);
  await act(async()=>{now=1000;timers[0]();});assert.equal(latest.totalMs,1000);
  await act(async()=>{visible=false;now=2000;timers[0]();});assert.equal(latest.totalMs,1000);
  await act(async()=>{visible=true;focused=false;now=3000;timers[0]();});assert.equal(latest.totalMs,1000);
  await act(async()=>{focused=true;latest.setPaused(true);});
  await act(async()=>{now=4000;timers[0]();});assert.equal(latest.totalMs,1000);
  await act(async()=>latest.setPaused(false));
  await act(async()=>{now=5000;timers[0]();});assert.equal(latest.totalMs,2000);
  await act(async()=>root.render(React.createElement(Probe,{id:'02'})));
  await act(async()=>{now=6000;timers[0]();timers[1]();});
  assert.equal(latest.byLesson['01'],2000);assert.equal(latest.byLesson['02'],1000);
  assert.equal(latest.totalMs,3000);
  assert.ok(calls.some(c=>c.lessonId==='02'&&c.durationMs===1000));
 }finally{
  await act(async()=>root.unmount());dom.window.close();globalThis.window=oldWindow;globalThis.document=oldDocument;globalThis.IS_REACT_ACT_ENVIRONMENT=oldAct;
 }
});
