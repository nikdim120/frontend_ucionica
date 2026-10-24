import {useEffect,useRef,useState} from 'react';
import {activeSlice,IDLE_MS} from './activity-clock.mjs';
type Stats={totalMs:number;byLesson:Record<string,number>};
export function useActiveTime(lessonId:string,enabled:boolean){
 const [stats,setStats]=useState<Stats>({totalMs:0,byLesson:{}});
 const [paused,setPaused]=useState(false);const [status,setStatus]=useState('Povezivanje…');
 const target=useRef(lessonId);const pausedRef=useRef(paused);pausedRef.current=paused;
 const lastInput=useRef(performance.now());const bucket=useRef(new Map<string,number>());
 const inFlight=useRef<{sessionId:string;sequence:number;lessonId:string;durationMs:number}|null>(null);
 const server=useRef<Stats>({totalMs:0,byLesson:{}});const sync=useRef<()=>Promise<void>>(async()=>{});
 const previous=useRef(performance.now());
 const capture=useRef<()=>void>(()=>{});
 useEffect(()=>{capture.current();target.current=lessonId;void sync.current();},[lessonId]);
 useEffect(()=>{const now=performance.now();previous.current=now;if(!paused)lastInput.current=now;capture.current();void sync.current();},[paused]);
 useEffect(()=>{
  if(!enabled)return;
  let disposed=false,ready=false,busy=false;let sequence=0;
  const sessionId=Date.now().toString(36)+'-'+Array.from(crypto.getRandomValues(new Uint8Array(12)),x=>x.toString(16).padStart(2,'0')).join('');
  const publish=()=>{
   if(disposed)return;
   const copy={totalMs:server.current.totalMs,byLesson:{...server.current.byLesson}};
   for(const [id,ms] of bucket.current){copy.totalMs+=ms;copy.byLesson[id]=(copy.byLesson[id]??0)+ms;}
   if(inFlight.current){const {lessonId:id,durationMs:ms}=inFlight.current;copy.totalMs+=ms;copy.byLesson[id]=(copy.byLesson[id]??0)+ms;}
   setStats(copy);
  };
  function tick(){
   const now=performance.now();const visible=document.visibilityState==='visible',focused=document.hasFocus();
   const delta=ready?activeSlice(previous.current,now,lastInput.current,{visible,focused,paused:pausedRef.current}):0;
   previous.current=now;
   if(delta>0)bucket.current.set(target.current,(bucket.current.get(target.current)??0)+delta);
   if(!disposed)setStatus(pausedRef.current?'Ručno pauzirano':!visible||!focused?'Pauza · van prozora':now-lastInput.current>=IDLE_MS?'Pauza · neaktivnost':'Aktivan rad');
   publish();
  }
  async function post(payload:unknown){
   const response=await fetch('/api/activity/heartbeat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),keepalive:true});
   if(!response.ok)throw new Error('Vreme čeka sinhronizaciju');
   return await response.json() as Stats;
  }
  async function flush(){
   if(busy||!ready)return;
   busy=true;
   try{
    if(!inFlight.current){
     const entry=[...bucket.current].find(([,ms])=>ms>=1);if(!entry)return;
     const [id,ms]=entry;const durationMs=Math.min(15000,Math.floor(ms));
     bucket.current.set(id,ms-durationMs);
     inFlight.current={sessionId,sequence:++sequence,lessonId:id,durationMs};
    }
    server.current=await post(inFlight.current);inFlight.current=null;publish();
   }catch{if(!disposed)setStatus('Vreme čeka sinhronizaciju');}
   finally{busy=false;}
  }
  capture.current=tick;sync.current=flush;previous.current=performance.now();
  // Establish the server baseline before accounting for time; retries are idempotent.
  async function initialize(){try{server.current=await post({sessionId,sequence:0,lessonId:'overview',durationMs:0});ready=true;previous.current=performance.now();publish();}catch{if(!disposed)setStatus('Merenje nije povezano');}}
  void initialize();
  const interact=()=>{lastInput.current=performance.now();};
  const onFocus=()=>{previous.current=performance.now();interact();};
  const onLeave=()=>{tick();void flush();};
  for(const event of ['keydown','pointerdown','input','scroll'])window.addEventListener(event,interact,{passive:true,capture:true});
  window.addEventListener('focus',onFocus);window.addEventListener('blur',onLeave);
  window.addEventListener('pagehide',onLeave);document.addEventListener('visibilitychange',onLeave);
  const timer=setInterval(tick,1000);
  const heartbeat=setInterval(()=>{if(!ready)void initialize();else void flush();},10000);
  return()=>{tick();void flush();disposed=true;clearInterval(timer);clearInterval(heartbeat);for(const event of ['keydown','pointerdown','input','scroll'])window.removeEventListener(event,interact,true);window.removeEventListener('focus',onFocus);window.removeEventListener('blur',onLeave);window.removeEventListener('pagehide',onLeave);document.removeEventListener('visibilitychange',onLeave);capture.current=()=>{};sync.current=async()=>{};};
 },[enabled]);
 return {...stats,paused,setPaused,status};
}
