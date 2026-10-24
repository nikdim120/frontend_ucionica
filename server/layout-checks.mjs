import {randomBytes} from 'node:crypto';
import {renderPreview} from './runner.mjs';
// Trusted instrumentation only. Student scripts are removed before this is added.
export function measureLayout(checks){
 const rect=s=>document.querySelector(s)?.getBoundingClientRect();
 return checks.map(c=>{
  const width=document.documentElement.clientWidth;if((c.whenMin&&width<c.whenMin)||(c.whenMax&&width>c.whenMax))return {label:c.label,passed:true,detail:'Fokus ove provere je na drugoj kontrolnoj širini.'};
  let passed=false,detail='';
  if(c.type==='noOverflow'){const w=document.documentElement.clientWidth;const actual=Math.max(document.documentElement.scrollWidth,document.body.scrollWidth);passed=actual<=w+2;detail=actual+'px sadržaja / '+w+'px prozora';}
  if(c.type==='columns'){const el=document.querySelector(c.selector);const tracks=el?getComputedStyle(el).gridTemplateColumns.split(/\s+/).filter(v=>v&&v!=='none'):[];passed=tracks.length>=(c.min??1)&&(!c.max||tracks.length<=c.max);detail=tracks.length+' kolona';}
  if(c.type==='sameRow'){const a=rect(c.selector),b=rect(c.other);passed=!!a&&!!b&&Math.abs(a.top-b.top)<3;detail=passed?'Elementi dele vrh reda.':'Vrhovi elemenata se razlikuju.';}
  if(c.type==='contained'){const a=rect(c.selector),b=rect(c.parent);passed=!!a&&!!b&&a.left>=b.left-2&&a.right<=b.right+2;detail=passed?'Element je unutar roditelja.':'Element nedostaje ili preliva roditelja.';}
  return {label:c.label,passed,detail};
 });
}
export async function layoutDocument(lesson,files){
 const token=randomBytes(24).toString('hex');
 const page=lesson.layoutPage??'index.html';
 let html=await renderPreview(files,lesson.tailwind,false,page);
 const checks=lesson.layoutChecks??[{type:'noOverflow',label:'Nema horizontalnog prelivanja.'}];
 const safe=JSON.stringify(checks).replaceAll('<','\\u003c');
 const script=`(()=>{const run=${measureLayout.toString()};const send=()=>parent.postMessage({kind:'eprodavnica-layout',token:'${token}',width:document.documentElement.clientWidth,results:run(${safe})},'*');Promise.all([...document.images].map(i=>i.complete?Promise.resolve():new Promise(r=>{i.onload=r;i.onerror=r}))).then(()=>requestAnimationFrame(()=>requestAnimationFrame(send)));setTimeout(send,1500);})();`;
 html=html.replace("default-src 'none';",`default-src 'none'; script-src 'nonce-${token}';`);
 html=html.replace('</body>',`<script nonce="${token}">${script}</script></body>`);
 return {html,token,page};
}
