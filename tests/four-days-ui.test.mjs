import test from 'node:test';import assert from 'node:assert/strict';
import {readFileSync}from'node:fs';import{createRequire}from'node:module';
import React,{act}from'react';import{createRoot}from'react-dom/client';import ts from'typescript';import{JSDOM}from'jsdom';
import{createApp}from'../server/index.mjs';
const require=createRequire(import.meta.url);
function moduleFromTS(path,imports){const source=readFileSync(new URL(path,import.meta.url),'utf8');const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022}}).outputText;const module={exports:{}};new Function('require','module','exports',code)(name=>{if(name in imports)return imports[name];if(name.startsWith('react')||name==='fflate')return require(name);throw Error('Module unavailable in UI test: '+name);},module,module.exports);return module.exports;}
test('Aplikacija prikazuje preduslov, četiri dana, JS datoteku i prelaz između dana',async()=>{
 const dom=new JSDOM('<div id="root"></div>',{url:'http://localhost/'});const app=await createApp({dbPath:':memory:'});await app.ready();let cookie='';let root,lastRun;
 const keys=['window','document','localStorage','fetch','IS_REACT_ACT_ENVIRONMENT'];const old=Object.fromEntries(keys.map(k=>[k,globalThis[k]]));Object.assign(globalThis,{window:dom.window,document:dom.window.document,localStorage:dom.window.localStorage,IS_REACT_ACT_ENVIRONMENT:true});
 globalThis.fetch=async(path,options={})=>{const r=await app.inject({url:path,method:options.method??'GET',headers:{...options.headers,...(cookie?{cookie}:{})},...(options.body?{payload:options.body}:{})});if(r.headers['set-cookie'])cookie=r.headers['set-cookie'].split(';')[0];if(path.endsWith('/js-run')&&r.statusCode===200)lastRun=r.json();return{ok:r.statusCode<400,status:r.statusCode,json:async()=>r.json()};};
 const intro=moduleFromTS('../src/CourseIntro.tsx',{});const stub=()=>null;const imports={'./CourseIntro':intro,'./styles.css':{},'./themes.css':{},'./LayoutLab':{LayoutLab:stub},'./LayoutChecks':{LayoutChecks:stub},'./ReferenceLayout':{ReferenceLayout:stub},'./LessonQuiz':{LessonQuiz:stub},'./BoxModelLab':{BoxModelLab:stub},'./useActiveTime':{useActiveTime:()=>({totalMs:0,byLesson:{},paused:false,setPaused(){},status:'Sačuvano'})},'./activity-clock.mjs':{formatDuration:()=> '0:00'},'react-dom/client':{createRoot:host=>{root=createRoot(host);return root;}}};
 const settle=()=>new Promise(r=>setTimeout(r,20));const click=async element=>{assert.ok(element);await act(async()=>{element.dispatchEvent(new dom.window.MouseEvent('click',{bubbles:true}));await settle();});};
 try{
  await act(async()=>{moduleFromTS('../src/main.tsx',imports);await settle();});
  assert.match(dom.window.document.body.textContent,/OBAVEZAN PREDUSLOV ZA REACT/);assert.match(dom.window.document.body.textContent,/VS Code od prvog dana/);assert.match(dom.window.document.body.textContent,/Praktičan intervju/);assert.equal(dom.window.document.querySelectorAll('.day-selector option').length,4);
  const select=dom.window.document.querySelector('.day-selector select');await act(async()=>{select.value='3';select.dispatchEvent(new dom.window.Event('change',{bubbles:true}));await settle();});
  assert.match(dom.window.document.querySelector('.code-titlebar').textContent,/Dan 3/);assert.match(dom.window.document.body.textContent,/Flexbox: ose/);
  await click([...dom.window.document.querySelectorAll('.lesson-link')].find(x=>x.textContent.includes('Od objekta proizvoda')));
  assert.ok([...dom.window.document.querySelectorAll('.file-tabs button')].some(x=>x.textContent.includes('script.js')),dom.window.document.body.textContent.slice(-3500));
  assert.equal(dom.window.document.querySelector('iframe[title="Pregled tvog koda"]').getAttribute('sandbox'),'allow-scripts');
  await click([...dom.window.document.querySelectorAll('.file-tabs button')].find(x=>x.textContent.includes('script.js')));assert.ok(dom.window.document.querySelector('[aria-label="Kod script.js"]'));
  await click([...dom.window.document.querySelectorAll('button')].find(x=>x.textContent==='Otvori objašnjeno rešenje'));
  await click([...dom.window.document.querySelectorAll('button')].find(x=>x.textContent==='Ubaci rešenje u editor'));
  await click([...dom.window.document.querySelectorAll('button')].find(x=>x.textContent.includes('Pokreni JS i proveri')));
  assert.ok(lastRun);const frame=dom.window.document.querySelector('iframe[title="Pregled tvog koda"]');
  let simulated;await act(async()=>{simulated=new JSDOM(lastRun.html,{runScripts:'dangerously',beforeParse(window){window.parent.postMessage=data=>dom.window.dispatchEvent(new dom.window.MessageEvent('message',{data,source:frame.contentWindow}));}});
  await settle();});simulated.window.close();
  assert.match(dom.window.document.querySelector('.run-actions').textContent,/Sačuvan prolaz/);
  await click([...dom.window.document.querySelectorAll('button')].find(x=>x.textContent.includes('Nastavi na Dan 4')));
  assert.match(dom.window.document.querySelector('.code-titlebar').textContent,/Dan 4/);assert.match(dom.window.document.querySelector('.workspace-heading h1').textContent,/Tailwind/);
  await act(async()=>{select.value='2';select.dispatchEvent(new dom.window.Event('change',{bubbles:true}));await settle();});
  await click(dom.window.document.querySelector('.hero-actions button'));assert.match(dom.window.document.querySelector('.workspace-heading h1').textContent,/Prvi formular/);assert.equal(dom.window.document.querySelector('iframe[title="Pregled tvog koda"]').getAttribute('sandbox'),'');
  await act(async()=>{select.value='4';select.dispatchEvent(new dom.window.Event('change',{bubbles:true}));await settle();});assert.match(dom.window.document.body.textContent,/Tailwind, Bootstrap i završna isporuka/);
 }finally{if(root)await act(async()=>root.unmount());for(const key of keys){if(old[key]===undefined)delete globalThis[key];else globalThis[key]=old[key];}await app.close();dom.window.close();}
});
