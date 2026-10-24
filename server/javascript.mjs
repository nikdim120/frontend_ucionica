import {randomBytes,createHash} from 'node:crypto';
import ts from 'typescript';
import {JSDOM,VirtualConsole} from 'jsdom';
import {renderPreview} from './runner.mjs';
const json=value=>JSON.stringify(value).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
export const fingerprint=files=>createHash('sha256').update(JSON.stringify(files)).digest('hex');
// Parse only: student code is NEVER evaluated on the server. Guard ordinary
// loops and function entries in the isolated browser frame to help novices
// recover from accidental infinite loops/recursion. This is not a resource VM.
export function instrumentJavaScript(code,name='__courseGuard'){
 const tree=ts.createSourceFile('script.js',code,ts.ScriptTarget.Latest,true,ts.ScriptKind.JS);
 if(tree.parseDiagnostics.length)throw Error('Sintaksna greška: '+ts.flattenDiagnosticMessageText(tree.parseDiagnostics[0].messageText,' '));
 const inserts=[];const insert=(pos,text)=>inserts.push({pos,text});
 const guardBody=body=>{if(ts.isBlock(body))insert(body.getStart(tree)+1,name+'();');else{insert(body.getStart(tree),'{'+name+'();');insert(body.end,'}');}};
 function visit(node){
  if(ts.isForStatement(node)||ts.isForInStatement(node)||ts.isForOfStatement(node)||ts.isWhileStatement(node)||ts.isDoStatement(node))guardBody(node.statement);
  if(ts.isFunctionLike(node)&&node.body){if(ts.isBlock(node.body))insert(node.body.getStart(tree)+1,name+'();');else{insert(node.body.getStart(tree),'('+name+'(),');insert(node.body.end,')');}}
  ts.forEachChild(node,visit);
 }
 visit(tree);let output=code;for(const {pos,text} of inserts.sort((a,b)=>b.pos-a.pos))output=output.slice(0,pos)+text+output.slice(pos);
 return output;
}
export async function javascriptDocument(lesson,files){
 if(!lesson.javascript)throw Error('Ova lekcija ne izvršava JavaScript.');
 const token=randomBytes(24).toString('hex'),guard='__guard_'+token,checks=lesson.tests.map((t,index)=>({...t,index})).filter(t=>t.type==='browserJS');
 const dom=new JSDOM(await renderPreview(files,lesson.tailwind,false),{virtualConsole:new VirtualConsole()});const d=dom.window.document;
 d.querySelector('meta[http-equiv="Content-Security-Policy"]').content="default-src 'none'; script-src 'nonce-"+token+"'; style-src 'unsafe-inline'; img-src data:; frame-src 'none'; connect-src 'none'; form-action 'none'; base-uri 'none'; worker-src 'none'";
 const boot=d.createElement('script');boot.nonce=token;
 boot.textContent=`(()=>{const token=${json(token)},logs=[];let sent=false;const send=(results,error)=>{if(sent)return;sent=true;parent.postMessage({kind:'eprodavnica-js',token,results,error,logs},'*')};window.__courseReport=send;for(const level of ['log','warn','error'])console[level]=(...values)=>{if(logs.length<30)logs.push(level+': '+values.map(x=>String(x).slice(0,300)).join(' '))};window.addEventListener('error',e=>{e.preventDefault();send([],e.message||'Greška u script.js')});})();`;
 d.head.append(boot);
 const script=d.createElement('script');script.nonce=token;
 try{
  const code=instrumentJavaScript(files['script.js']??'',guard);
  script.textContent=`(()=>{const __now=performance.now.bind(performance);let __deadline=__now()+1200,__steps=0;for(const event of ['click','input','change','keydown'])window.addEventListener(event,()=>{__deadline=__now()+1200;__steps=0},true);function ${guard}(){if(++__steps>100000||__now()>__deadline)throw Error('Previše koraka ili predugo izvršavanje. Proveri petlju/rekurziju.');}\ntry{\n${code}\n;const __results=[];\n${checks.map(t=>`try{__results.push({index:${t.index},passed:Boolean(${t.expression})})}catch(e){__results.push({index:${t.index},passed:false,detail:String(e.message).slice(0,300)})}`).join('\n')}\nwindow.__courseReport(__results);\n}catch(e){window.__courseReport([],String(e.message).slice(0,300));}})();`;
 }catch(e){script.textContent=`window.__courseReport([],${json(e.message)});`;}
 script.textContent=script.textContent.replace(/<\/script/gi,'<\\/script');
 d.body.append(script);const html='<!DOCTYPE html>\n'+d.documentElement.outerHTML;dom.window.close();return {html,token};
}
export function createJavascriptReports(){
 const issued=new Map();
 return {
  issue(user,id,files,token){const now=Date.now();for(const [key,v]of issued)if(v.expires<now)issued.delete(key);if(issued.size>5000)throw Error('Previše istovremenih JS provera.');issued.set(token,{user,id,hash:fingerprint(files),expires:now+60000});},
  consume(user,lesson,files,report){const token=report?.token;const entry=issued.get(token);if(entry)issued.delete(token);
   if(!entry||entry.user!==user||entry.id!==lesson.id||entry.hash!==fingerprint(files)||entry.expires<Date.now())throw Error('Pokreni novu JS proveru za trenutni kod.');
   const expected=lesson.tests.map((t,index)=>({t,index})).filter(x=>x.t.type==='browserJS');
   if(!Array.isArray(report.results)||report.results.length!==expected.length||expected.some(({index})=>report.results.filter(r=>r.index===index&&typeof r.passed==='boolean').length!==1))throw Error('Nepotpun rezultat JS provere.');
   return report.results;
  }
 };
}
