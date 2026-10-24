import {useEffect,useRef,useState} from 'react';
type Row={width:number;label:string;passed:boolean;detail:string};
export function LayoutChecks({lessonId,files}:{lessonId:string;files:Record<string,string>}){
 const host=useRef<HTMLDivElement>(null),runId=useRef(0);const [busy,setBusy]=useState(false),[rows,setRows]=useState<Row[]>([]),[error,setError]=useState('');
 useEffect(()=>{runId.current++;setRows([]);setBusy(false);setError('');},[files]);
 useEffect(()=>()=>{runId.current++;},[]);
 async function run(){const id=++runId.current;setBusy(true);setRows([]);setError('');
  try{for(const width of [360,540,768,980,1280]){
   const res=await fetch('/api/layout-check',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:lessonId,files})});const doc=await res.json();if(!res.ok)throw new Error(doc.error||'Priprema merenja nije uspela.');if(id!==runId.current)return;
   const frame=document.createElement('iframe');frame.setAttribute('sandbox','allow-scripts');frame.tabIndex=-1;frame.title='Automatsko merenje rasporeda '+width+'px';frame.style.width=width+'px';frame.style.height='900px';
   const results=await new Promise<Row[]>((resolve,reject)=>{let timer:ReturnType<typeof setTimeout>;const cleanup=()=>{window.removeEventListener('message',receive);clearTimeout(timer);frame.remove();};const receive=(event:MessageEvent)=>{if(event.source!==frame.contentWindow||event.data?.kind!=='eprodavnica-layout'||event.data.token!==doc.token)return;const rows=event.data.results;if(!Array.isArray(rows))return;cleanup();resolve(rows.map(r=>({...r,width})));};window.addEventListener('message',receive);timer=setTimeout(()=>{cleanup();reject(new Error('Merenje je isteklo. Proveri podršku pregledača i ponovi.'));},7000);frame.srcdoc=doc.html;host.current?.append(frame);});
   if(id!==runId.current)return;setRows(r=>[...r,...results]);
  }}catch(e){if(id===runId.current)setError((e as Error).message);}finally{if(id===runId.current)setBusy(false);}
 }
 return <section><h2>Provera stvarnog rasporeda</h2><p>Merenje se izvršava u tvom pregledaču na 360, 540, 768, 980 i 1280px. Studentski JavaScript je uklonjen; platforma dodaje samo svoj kod za merenje u izolovan okvir.</p><p>Ovo je dopunska provera trenutnog koda. Rezultati se ne čuvaju i sami ne daju praktičan prolaz. Tastaturu, zoom, logičan redosled i izgled proveri ručno.</p><button className="primary" disabled={busy} onClick={run}>{busy?'Merimo raspored…':'Izmeri raspored na pet širina'}</button>{error&&<p role="alert">{error}</p>}<div role="status">{rows.map((r,i)=><p className={r.passed?'success-text':'quiz-error'} key={i}>{r.passed?'✓':'✕'} {r.width}px · {r.label}<br/><small>{r.detail}</small></p>)}</div><div className="layout-measure-host" ref={host} aria-hidden="true"/></section>;
}
