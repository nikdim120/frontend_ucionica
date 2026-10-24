import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {lessons} from '../curriculum/course.mjs';
import {grade} from '../server/runner.mjs';
import {boxDimensions} from '../src/box-math.mjs';
test('Model kutije računa sadržaj, ivice i margine u oba režima',()=>{
 assert.deepEqual(boxDimensions(300,20,4,12,'content-box'),{content:300,painted:348,occupied:372});
 assert.deepEqual(boxDimensions(300,20,4,12,'border-box'),{content:252,painted:300,occupied:324});
 assert.deepEqual(boxDimensions(380,24,2,0,'border-box'),{content:328,painted:380,occupied:380});
 assert.deepEqual(boxDimensions(10,20,4,0,'border-box'),{content:0,painted:48,occupied:48});
});
test('Direktan box-sizing i longhand padding ne mogu sakriti pogrešnu karticu',async()=>{
 const l=lessons.find(l=>l.id==='05');
 for(const bad of ['.product-card {box-sizing:content-box}', '.product-card {padding-right:60px}']){
  const result=await grade(l,{...l.solution,'styles.css':l.solution['styles.css']+'\n'+bad});
  assert.equal(result.passed,false,bad);
 }
});
test('Svaka slika lekcije je lokalna, ima opis i odgovara manifestu izvora',()=>{
 const manifest=JSON.parse(readFileSync(new URL('../public/lesson-images/sources.json',import.meta.url),'utf8'));
 const figures=lessons.flatMap(l=>l.figures??[]);assert.equal(figures.length,10);
 for(const f of figures){assert.ok(f.alt&&f.caption&&f.credit&&f.sourceUrl);assert.ok(existsSync(new URL('../public'+f.src,import.meta.url)));assert.ok(manifest.some(m=>f.src.endsWith(m.file)));}
 assert.match(readFileSync(new URL('../public/lesson-images/FCC-CDN-LICENSE.txt',import.meta.url),'utf8'),/Redistribution/);
});
