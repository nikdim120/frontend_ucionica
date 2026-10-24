import {JSDOM, VirtualConsole} from 'jsdom';
import {compile} from '@tailwindcss/node';
import {CSSHelp} from '../vendor/css-help.mjs';
import {fileURLToPath} from 'node:url';
import {readFileSync} from 'node:fs';
import {courseVersion} from '../curriculum/course.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const assetNames=['slusalice.svg','tastatura.svg','ranac.svg','promo.html'];
const assets=Object.fromEntries(assetNames.map(name=>[name,readFileSync(new URL('../public/assets/'+name,import.meta.url))]));
const localAsset=src=>String(src??'').replace(/^\.?\/?assets\//,'');
let twCompiler;
export function validateFiles(files) {
 if(!files||typeof files!=='object'||Array.isArray(files)) throw new Error('Pošalji index.html i styles.css.');
 for(const name of ['index.html','styles.css']) if(typeof files[name]!=='string'||files[name].length>100_000) throw new Error('Datoteke moraju biti tekst do 100.000 znakova.');
 const out={'index.html':files['index.html'],'styles.css':files['styles.css']};
 if(files['script.js']!==undefined){if(typeof files['script.js']!=='string'||files['script.js'].length>100_000)throw new Error('JavaScript mora biti tekst do 100.000 znakova.');out['script.js']=files['script.js'];}
 if(files['katalog.html']!==undefined){if(typeof files['katalog.html']!=='string'||files['katalog.html'].length>100_000)throw new Error('Katalog mora biti tekst do 100.000 znakova.');out['katalog.html']=files['katalog.html'];}return out;
}
export async function compileTailwind(html) {
 if(!twCompiler) twCompiler=await compile('@import "tailwindcss";',{base:root,onDependency(){}});
 const d=new JSDOM(html); const classes=[...new Set([...d.window.document.querySelectorAll('[class]')].flatMap(x=>[...x.classList]))];d.window.close();
 if(classes.length>1000) throw new Error('Previše klasa u jednom zadatku.');
 return twCompiler.build(classes);
}
function parse(files) {
 const errors=[];const console=new VirtualConsole();console.on('jsdomError',e=>{if(e.type==='css parsing')errors.push('CSS sadrži pravilo koje parser ne može da pročita.');});
 const dom=new JSDOM(files['index.html'],{url:'http://localhost/',virtualConsole:console});
 const document=dom.window.document;
 // The student document is never executed. JSDOM resource loading is disabled.
 if(document.querySelector('link[rel="stylesheet"][href="styles.css"]')){
  const style=document.createElement('style');style.className='fcc-injected-styles';style.textContent=files['styles.css'];document.head.append(style);
 }
 return {dom,document,sourceCSS:files['styles.css'],helper:new CSSHelp(document),errors};
}
const normalized=s=>String(s??'').toLowerCase().replace(/\s+/g,' ').trim();
function styleRules(ctx,selector) {
 return ctx.helper.getCSSRules().filter(x=>x.type===1&&x.selectorText.split(',').map(s=>s.trim()).includes(selector));
}
function styleValue(ctx,selector,property){
 const rules=styleRules(ctx,selector);let value='';
 for(const rule of rules) if(rule.style.getPropertyValue(property)) value=rule.style.getPropertyValue(property);
 return value;
}
function ruleValue(rules,selector,property){
 let value='',important=false;
 for(const rule of rules)if(rule.type===1&&rule.selectorText.split(',').map(s=>s.trim()).includes(selector)){
  const next=rule.style.getPropertyValue(property),priority=rule.style.getPropertyPriority(property)==='important';
  if(next&&(!important||priority)){value=next;important=priority;}
 }
 return value;
}
// Targeted lesson checks, not a full browser layout/cascade implementation.
function widthRules(rules,width){
 const out=[];
 for(const rule of rules){
  if(rule.type===1)out.push(rule);
  if(rule.type===4){
   const condition=rule.conditionText??rule.media?.mediaText??'';
   const parts=condition.split(/\s+and\s+/i);
   if(parts.every(part=>{const m=part.trim().match(/^\((min|max)-width\s*:\s*([\d.]+)(px|rem)\)$/i);if(!m)return false;const value=Number(m[2])*(m[3]==='rem'?16:1);return m[1]==='min'?width>=value:width<=value;}))out.push(...widthRules([...rule.cssRules],width));
  }
 }
 return out;
}
function check(t,c,generatedCSS) {
 const {document:d}=c;const el=t.selector?d.querySelector(t.selector):null;
 switch(t.type){
  case 'browserJS':return false;
  case 'noInlineStyles':return !d.querySelector('[style],style:not(.fcc-injected-styles)');
  case 'cssSourceIncludes':return normalized(c.sourceCSS).includes(normalized(t.value));
  case 'doctype':return d.doctype?.name==='html';
  case 'exists':return d.querySelectorAll(t.selector).length>=t.value;
  case 'count':return d.querySelectorAll(t.selector).length===t.value;
  case 'attr':return t.name==='src'&&String(t.value).startsWith('/assets/')?el?.getAttribute(t.name)?.replace(/^\.?\//,'')===t.value.slice(1):el?.getAttribute(t.name)===t.value;
  case 'text':return el?.textContent.toLowerCase().includes(t.value.toLowerCase());
  case 'nonemptyAttr':return (el?.getAttribute(t.value)?.trim().length??0)>5;
  case 'cssRule':return styleRules(c,t.selector).length>0;
  case 'noCssRule':return styleRules(c,t.selector).length===0;
  case 'css':{
   const value=normalized(styleValue(c,t.selector,t.property)); const expected=normalized(t.value);
   return t.property==='font-family'?value.includes(expected)&&value.includes('sans-serif'):value===expected;
  }
  case 'cssContains':return normalized(styleValue(c,t.selector,t.property)).replace(/\s+/g,'').includes(normalized(t.value).replace(/\s+/g,''));
  case 'computedCss':return Boolean(el)&&normalized(c.dom.window.getComputedStyle(el).getPropertyValue(t.property))===normalized(t.value);
  case 'cssAtWidth':return normalized(ruleValue(widthRules(c.helper.getCSSRules(),t.width),t.selector,t.property))===normalized(t.value);
  case 'cssAbsent':return styleRules(c,t.selector).every(r=>!r.style.getPropertyValue(t.property));
  case 'mediaCss':return c.helper.getCSSRules('media').some(r=>normalized(r.conditionText??r.media.mediaText).replace(/\s+/g,'')===normalized(t.media).replace(/\s+/g,'')&&normalized(ruleValue([...r.cssRules],t.selector,t.property))===normalized(t.value));
  case 'keyframes':return c.helper.getCSSRules('keyframes').some(r=>r.name===t.value&&r.cssRules.length>=2);
  case 'labels':return [...d.querySelectorAll('form input,form select,form textarea')].every(x=>x.type==='hidden'||x.type==='submit'||x.labels?.length>0);
  case 'invalidEmail':if(!el)return false;el.value='nije-imejl';return !el.checkValidity();
  case 'focusRule':return c.helper.getCSSRules().some(r=>r.type===1&&r.selectorText.includes(t.selector+':focus-visible')&&Boolean(r.style.getPropertyValue('outline')||r.style.getPropertyValue('outline-width')));
  case 'classes':return Boolean(el)&&t.value.every(x=>el.classList.contains(x));
  case 'generated':return generatedCSS.includes(t.value);
  case 'noWideCard':return normalized(styleValue(c,'.product-card','width'))!=='900px';
  default:throw new Error('Nepoznata provera: '+t.type);
 }
}
export async function grade(lesson,files) {
 files=validateFiles(files);const ctx=parse(files);
 try{
 const tw=lesson.tailwind?await compileTailwind(Object.entries(files).filter(([n])=>n.endsWith('.html')).map(([,s])=>s).join('\n')):'';
 const pages=new Map();
 const results=lesson.tests.map((t,index)=>{
  let c=ctx;if(t.file&&t.file!=='index.html'){if(!pages.has(t.file))pages.set(t.file,parse({...files,'index.html':files[t.file]??''}));c=pages.get(t.file);}
  try{return {index,label:t.label,passed:Boolean(check(t,c,tw))};}
  catch{return {index,label:t.label,passed:false};}
 });
 for(const c of pages.values())c.dom.window.close();
 return {passed:results.every(x=>x.passed),results,warnings:ctx.errors,rubricVersion:courseVersion};
 }finally{ctx.dom.window.close();}
}
const joinBootstrap=()=>new URL('../vendor/bootstrap-5.3.8.min.css',import.meta.url);
export async function renderPreview(files,tailwind=false,allowPromoFrame=false,page='index.html') {
 files=validateFiles(files);if(!['index.html','katalog.html'].includes(page))throw new Error('Nepoznata stranica pregleda.');const allHTML=Object.entries(files).filter(([n])=>n.endsWith('.html')).map(([,s])=>s).join('\n');const ctx=parse({...files,'index.html':files[page]??''});const {document:d}=ctx;
 // The only frame allowed is a bundled, script-free document, never student srcdoc.
 d.querySelectorAll('iframe').forEach(x=>{
  if(allowPromoFrame&&localAsset(x.getAttribute('src'))==='promo.html'){
   const safe=d.createElement('iframe');safe.setAttribute('title',x.getAttribute('title')||'Studentska ponuda');safe.setAttribute('sandbox','');safe.setAttribute('src','data:text/html;base64,'+assets['promo.html'].toString('base64'));x.replaceWith(safe);
  }else x.remove();
 });
 d.querySelectorAll('script,object,embed,base,meta[http-equiv],foreignObject,animate,set').forEach(x=>x.remove());
 for(const el of d.querySelectorAll('*'))for(const attr of [...el.attributes]){
  if(attr.name.toLowerCase().startsWith('on')||attr.name==='srcdoc'||/^\s*(javascript|vbscript):/i.test(attr.value))el.removeAttribute(attr.name);
 }
 const bootstrap=!!d.querySelector('link[rel="stylesheet"][href="bootstrap.css"]');
 d.querySelectorAll('link[rel="stylesheet"]').forEach(x=>x.remove());
 d.querySelectorAll('a[href="index.html"],a[href="katalog.html"]').forEach(x=>{x.setAttribute('href','#');x.setAttribute('title','U platformi promeni stranicu izborom iznad pregleda. Izvezene veze rade lokalno.');});
 d.querySelectorAll('form').forEach(x=>{x.removeAttribute('action');x.removeAttribute('target');});
 // Relative assets use absolute paths supplied by the parent origin.
 d.querySelectorAll('img').forEach(x=>{const name=localAsset(x.getAttribute('src'));if(assets[name]&&name.endsWith('.svg')){x.setAttribute('src','data:image/svg+xml;base64,'+assets[name].toString('base64'));x.removeAttribute('srcset');}});
 if(bootstrap){const style=d.createElement('style');style.textContent=readFileSync(joinBootstrap(),'utf8');d.head.prepend(style);}
 if(tailwind){const style=d.createElement('style');style.textContent=await compileTailwind(allHTML);d.head.prepend(style);}
 const csp=d.createElement('meta');csp.httpEquiv='Content-Security-Policy';csp.content="default-src 'none'; style-src 'unsafe-inline'; img-src 'self' data:; frame-src "+(allowPromoFrame?'data:':"'none'")+"; font-src 'none'; form-action 'none'; base-uri 'none'";
 d.head.prepend(csp);
 const out='<!DOCTYPE html>\n'+d.documentElement.outerHTML;ctx.dom.window.close();return out;
}
