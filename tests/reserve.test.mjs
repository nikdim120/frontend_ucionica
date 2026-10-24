import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createApp} from '../server/index.mjs';
import {lessons} from '../curriculum/catalog.mjs';

test('Neaktivna FCC rezerva ima sve izvorne datoteke sa ispravnim otiscima',()=>{
 const base=new URL('../reserve/freecodecamp-responsive-web-design-v9/',import.meta.url);
 const manifest=JSON.parse(readFileSync(new URL('manifest.json',base),'utf8'));
 assert.equal(manifest.active,false);
 assert.equal(manifest.blockCount,158);
 assert.equal(manifest.orderedChallengeCount,1553);
 assert.equal(manifest.sourceFileCount,manifest.files.length);
 for(const file of manifest.files){
  const content=readFileSync(new URL(file.path,base));
  assert.equal(content.length,file.bytes,file.path);
  assert.equal(createHash('sha256').update(content).digest('hex'),file.sha256,file.path);
 }
});

for(const dev of [false,true])test(`FCC rezerva nije dostupna studentu (${dev?'development':'production'})`,async()=>{
 const app=await createApp({dbPath:':memory:',dev});
 try{
  const course=(await app.inject('/api/course')).json();
  assert.equal(course.lessons.length,34);
  assert.deepEqual(course.lessons.filter(l=>lessons.some(old=>old.id===l.id)).map(l=>l.id).sort(),lessons.map(l=>l.id).sort());
  assert.equal(JSON.stringify(course).includes('reserve/freecodecamp-responsive-web-design-v9'),false);
  for(const path of ['/reserve','/reserve/freecodecamp-responsive-web-design-v9/manifest.json','/%72eserve/freecodecamp-responsive-web-design-v9/manifest.json','/@fs/workspace/reserve/manifest.json']){
   assert.equal((await app.inject(path)).statusCode,404,path);
  }
 }finally{await app.close();}
});
