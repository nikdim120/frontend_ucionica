import {javascriptDocument,createJavascriptReports} from './javascript.mjs';
import Fastify from 'fastify';
import cookie from '@fastify/cookie';
import fastifyStatic from '@fastify/static';
import {fileURLToPath} from 'node:url';
import {resolve,join} from 'node:path';
import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {zipSync,strToU8} from 'fflate';
import {lessons,legacyLessons,demo,totalMinutes,courseVersion,days,appVersion,reactPrerequisite} from '../curriculum/catalog.mjs';
import {publicQuiz,gradeQuiz,quizVersion,totalQuizMinutes,totalQuizQuestions} from '../curriculum/quizzes.mjs';
import {openStore} from './store.mjs';
import {layoutDocument} from './layout-checks.mjs';
import {validateFiles,grade,renderPreview,compileTailwind} from './runner.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
export async function createApp({dbPath=process.env.DB_PATH||join(root,'data/course.sqlite'),dev=false,logger=false}={}){
 const reports=createJavascriptReports();const app=Fastify({logger,bodyLimit:700_000});const store=openStore(dbPath,{rubricVersion:courseVersion});app.decorate('courseStore',store);
 await app.register(cookie);
 app.addHook('onClose',async()=>store.close());
 app.addHook('onRequest',async(req,reply)=>{
  // Source reserve is for maintainers only, including in the Vite dev server.
  let pathname;try{pathname=decodeURIComponent(req.url.split('?')[0]);}catch{return reply.code(400).send({error:'Neispravna adresa.'});}
  if(pathname.split('/').includes('reserve'))return reply.code(404).send({error:'Ruta ne postoji.'});
  if(!req.url.startsWith('/api/'))return;
  reply.header('Cache-Control','no-store');
  if(['POST','PUT','DELETE'].includes(req.method)&&req.headers.origin){
   let allowed=false;try{allowed=new URL(req.headers.origin).host===req.headers.host;}catch{}
   if(!allowed)return reply.code(403).send({error:'Zahtev mora doći iz iste aplikacije.'});
  }
  const id=store.user(req.cookies.student);req.student=id;
  if(id!==req.cookies.student)reply.setCookie('student',id,{httpOnly:true,sameSite:'strict',path:'/',maxAge:60*60*24*365});
 });
 const find=id=>{const l=[...lessons,...legacyLessons].find(l=>l.id===id);if(!l){const e=new Error('Zadatak ne postoji.');e.statusCode=404;throw e;}return l;};
 app.setErrorHandler((e,req,reply)=>{req.log.error(e);reply.code(e.statusCode||400).send({error:e.statusCode===500?'Greška servera. Proveri terminal.':e.message});});
 app.get('/api/health',async()=>({ok:true,storage:'sqlite',lessons:lessons.length}));
 app.get('/api/course',async()=>({title:'Od prvog reda do eProdavnice',version:courseVersion,appVersion,reactPrerequisite,days:days.map(d=>({...d,quizMinutes:lessons.filter(l=>l.day===d.day).reduce((n,l)=>n+publicQuiz(l.id).minutes,0),quizQuestions:lessons.filter(l=>l.day===d.day).reduce((n,l)=>n+publicQuiz(l.id).questions.length,0)})),totalMinutes,totalQuizMinutes,totalQuizQuestions,lessons:lessons.map(({solution,hints,tests,explanation,...l})=>({...l,quiz:publicQuiz(l.id),testLabels:tests.map(t=>t.label)}))}));
 app.get('/api/state',async req=>store.state(req.student));
 app.get('/api/lessons/:id/quiz',async req=>{find(req.params.id);return store.quizzes.latest(req.student,req.params.id,quizVersion);});
 app.post('/api/lessons/:id/quiz',async req=>{find(req.params.id);const result=gradeQuiz(req.params.id,req.body?.answers);store.quizzes.record(req.student,req.params.id,result);return store.quizzes.latest(req.student,req.params.id,quizVersion);});
 app.get('/api/activity',async req=>store.activity.summary(req.student));
 app.post('/api/activity/heartbeat',async req=>{
  const body=req.body;
  if(!body||typeof body!=='object')throw new Error('Pošalji zapis aktivnosti.');
  const lessonId=body.lessonId??'overview';
  if(lessonId!=='overview')find(lessonId);
  return store.activity.record(req.student,{...body,lessonId});
 });
 app.post('/api/lessons/:id/save',async req=>{find(req.params.id);return store.save(req.student,req.params.id,validateFiles(req.body.files),req.body.revision);});
 app.post('/api/lessons/:id/grade',async req=>{
  const lesson=find(req.params.id);const files=validateFiles(req.body.files);
  const result=await grade(lesson,files);if(lesson.javascript){const measured=reports.consume(req.student,lesson,files,req.body.javascript);result.results=result.results.map(r=>lesson.tests[r.index].type==='browserJS'?{...r,passed:measured.find(m=>m.index===r.index).passed}:r);result.passed=result.results.every(r=>r.passed);result.execution='browser-reported';result.warnings.push('Osnovni slučajevi su provereni u pregledaču. Na odbrani samostalno izmeni i objasni kod.');}store.save(req.student,lesson.id,files,req.body.revision);store.result(req.student,lesson.id,files,result);
  return {...result,draft:store.draft(req.student,lesson.id),fingerprint:createHash('sha256').update(JSON.stringify(files)).digest('hex')};
 });
 app.post('/api/lessons/:id/hint',async req=>{
  const l=find(req.params.id);const level=Number(req.body?.level);if(!Number.isInteger(level)||level<1||level>3)throw new Error('Nagoveštaj je od 1 do 3.');
  store.hint(req.student,l.id,'hint',level);return {level,text:l.hints[level-1]};
 });
 app.post('/api/lessons/:id/solution',async req=>{
  const l=find(req.params.id);store.hint(req.student,l.id,'solution');return {files:l.solution,explanation:l.explanation};
 });
 app.post('/api/lessons/:id/reset',async req=>{find(req.params.id);store.reset(req.student,req.params.id);return {ok:true};});
 app.post('/api/lessons/:id/js-run',async req=>{const lesson=find(req.params.id);const files=validateFiles(req.body.files);const doc=await javascriptDocument(lesson,files);reports.issue(req.student,lesson.id,files,doc.token);return doc;});
 app.post('/api/layout-check',async req=>{const lesson=find(req.body.id);if(!lesson.layoutChecks?.length)throw new Error('Ova etapa nema merenje rasporeda.');return layoutDocument(lesson,validateFiles(req.body.files));});
 app.post('/api/preview',async req=>{
  const lesson=find(req.body.id);return {html:await renderPreview(req.body.files,lesson.tailwind,lesson.promo,req.body.page??'index.html')};
 });
 app.post('/api/tailwind',async req=>{
  if(typeof req.body?.html!=='string'||req.body.html.length>100_000)throw new Error('HTML je prevelik.');
  return {css:await compileTailwind(req.body.html)};
 });
 app.get('/api/demo',async req=>{if(Number(req.query.day)>=3){const l=lessons.find(l=>l.id==='delivery-01');return {html:await renderPreview(l.solution,true,false),files:l.solution};}return {html:await renderPreview({'index.html':demo.html,'styles.css':demo.css},false,true),files:{'index.html':demo.html,'styles.css':demo.css}};});
 app.get('/api/export',async(req,reply)=>{
  if(req.query.download==='1')reply.header('Content-Disposition','attachment; filename="eprodavnica-napredak.json"');
  return store.export(req.student);
 });
 app.get('/api/lessons/:id/export',async(req,reply)=>{
  const lesson=find(req.params.id);const files=req.query.blank==='1'?{'index.html':'','styles.css':''}:store.draft(req.student,lesson.id)?.files??lesson.seed;
  let html=files['index.html'].replaceAll('/assets/','assets/');
  const zip={'styles.css':strToU8(files['styles.css']),'assets/slusalice.svg':new Uint8Array(readFileSync(join(root,'public/assets/slusalice.svg'))),'README.md':strToU8('# eProdavnica\n\nOtvori index.html u pregledaču ili VS Code-u. Stilovi i slika su lokalni.\nZa vraćanje u učionicu zapakuj index.html i styles.css u koren ZIP-a.\n')};
  zip['README.md']=strToU8('# eProdavnica — moj projekat\n\n'+(req.query.blank==='1'?'Počni od praznih index.html i styles.css. Poveži stylesheet i napiši svoj HTML.\n':'Otvori index.html u pregledaču ili preko lokalnog servera u VS Code-u.\n')+'\nSlike i promotivni iframe su lokalni u assets/. Ovo nije prava kupovina.\n\n## Kontrolna lista\n\n- Proveri 360, 540, 768, 980 i 1280px.\n- Proveri zoom 200%, Tab/Shift+Tab i vidljiv fokus.\n- Tabela sme lokalno da skroluje, cela stranica ne treba da se širi.\n- U DevTools Rendering panelu probaj prefers-reduced-motion: reduce.\n- Zabeleži opažanja i dodaj snimke mobilnog i desktop prikaza.\n\n## Git\n\nPregledaj git diff, napravi smislen commit i objasni jednu izmenu.\nOvde dopiši način pokretanja, šta radi i šta još nedostaje.\n\nZa vraćanje u učionicu zapakuj index.html i styles.css u koren ZIP-a. Resursi assets/ su već dostupni u platformi.\n');
  if(files['katalog.html']!==undefined)zip['README.md']=strToU8('# eProdavnica — katalog Dana 4\n\nOtvori index.html, a zatim vezu Katalog. Obe stranice koriste lokalne assets/ resurse i kompajlirani tailwind.css. Izvoz je statičan snimak: nove Tailwind klase kompajliraj ponovnim uvozom/izvozom u platformi.\n\nZa uvoz zapakuj index.html, katalog.html i styles.css u koren ZIP-a.\n\n## Provere\n- 360, 540, 768, 980, 1280px; zoom 200%; Tab i Shift+Tab.\n- Dugačak naziv, dve i sedam kartica; nema prelivanja cele stranice.\n- Napiši poznata ograničenja. Filteri i pretraga još su prikaz.\n\n## Git\nPrikaži granu dan-4-katalog, smisleni commit i git diff. Dodaj svoje opažanje i lokalne snimke.\n');
  for(const name of ['tastatura.svg','ranac.svg','promo.html'])zip['assets/'+name]=new Uint8Array(readFileSync(join(root,'public/assets',name)));
  if(lesson.tailwind){html=html.replace('</head>','<link rel="stylesheet" href="tailwind.css">\n</head>');zip['tailwind.css']=strToU8(await compileTailwind(Object.entries(files).filter(([n])=>n.endsWith('.html')).map(([,s])=>s).join('\n')));}
  if(files['katalog.html']!==undefined){let page=files['katalog.html'].replaceAll('/assets/','assets/');if(lesson.tailwind&&!page.includes('href="tailwind.css"'))page=page.replace('</head>','<link rel="stylesheet" href="tailwind.css">\n</head>');zip['katalog.html']=strToU8(page);}
  if(files['script.js']!==undefined){zip['script.js']=strToU8(files['script.js']);if(!/<script[^>]+src=[\"']script\.js[\"']/.test(html))html=html.replace('</body>','<script src=\"script.js\" defer></script></body>');zip['README.md']=strToU8('# eProdavnica — uvodni JavaScript\n\nOtvori index.html u Chrome-u. U VS Code-u menjaj HTML, CSS i script.js. Za uvoz stavi te tri datoteke i katalog.html kada postoji u koren ZIP-a. Tailwind CSS je statičan snimak: nove klase kompajliraj ponovnim uvozom/izvozom.\n\nProveri klik/unos/filter, konzolu, tastaturu i mobilni prikaz. Sačuvaj Git commit i opiši diff. Ovo nije prava kupovina.\n');}
  if(lesson.bootstrap)zip['bootstrap.css']=new Uint8Array(readFileSync(join(root,'vendor/bootstrap-5.3.8.min.css')));
  zip['index.html']=strToU8(html);
  return reply.header('Content-Disposition','attachment; filename="eprodavnica-'+lesson.id+'.zip"').type('application/zip').send(Buffer.from(zipSync(zip)));
 });
 for(const name of ['slusalice.svg','tastatura.svg','ranac.svg','promo.html'])app.get('/assets/'+name,async(req,reply)=>reply.type(name.endsWith('.svg')?'image/svg+xml':'text/html; charset=utf-8').send(readFileSync(join(root,'public/assets',name))));
 if(dev){
  const {createServer}=await import('vite');const vite=await createServer({root,server:{middlewareMode:true,fs:{deny:['.env','.env.*','*.{crt,pem}','**/.git/**','**/reserve/**']}},appType:'custom'});
  app.addHook('onClose',async()=>vite.close());
  app.setNotFoundHandler(async(req,reply)=>{
   if(req.url.startsWith('/api/'))return reply.code(404).send({error:'Ruta ne postoji.'});
   // Vite middleware serves modules, Monaco workers and styles.
   let handled=await new Promise((resolve,reject)=>{reply.raw.on('finish',()=>resolve(true));vite.middlewares(req.raw,reply.raw,e=>e?reject(e):resolve(false));});
   if(!handled){const source=await vite.transformIndexHtml(req.url,readFileSync(join(root,'index.html'),'utf8'));reply.type('text/html').send(source);}else reply.hijack();
  });
 }else if(existsSync(join(root,'dist/index.html'))){
  await app.register(fastifyStatic,{root:join(root,'dist'),prefix:'/'});
  app.setNotFoundHandler(async(req,reply)=>req.url.startsWith('/api/')?reply.code(404).send({error:'Ruta ne postoji.'}):reply.sendFile('index.html'));
 }
 return app;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const dev=process.argv.includes('--dev');
 const app=await createApp({dev,logger:true});
 const arg=name=>{const i=process.argv.indexOf(name);return i>=0?process.argv[i+1]:undefined;};
 const port=Number(arg('--port')||process.env.PORT||4173);const host=arg('--host')||process.env.HOST||'127.0.0.1';
 await app.listen({port,host});console.log('\neProdavnica: http://localhost:'+port+'\nSQLite: '+(process.env.DB_PATH||join(root,'data/course.sqlite')));
 for(const signal of ['SIGINT','SIGTERM'])process.once(signal,async()=>{await app.close();process.exit(0);});
}
