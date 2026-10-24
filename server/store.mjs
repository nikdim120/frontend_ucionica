import {DatabaseSync} from 'node:sqlite';
import {mkdirSync} from 'node:fs';
import {dirname} from 'node:path';
import {createHash,randomBytes} from 'node:crypto';
import {openQuizzes} from './quizzes.mjs';
import {openActivity} from './activity.mjs';
const hash=files=>createHash('sha256').update(JSON.stringify(files)).digest('hex');
export function openStore(path,{rubricVersion}={}){
 if(path!==':memory:')mkdirSync(dirname(path),{recursive:true});
 const db=new DatabaseSync(path);db.exec('PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;');
 db.exec("CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP); CREATE TABLE IF NOT EXISTS saved_files(user_id TEXT NOT NULL REFERENCES users(id),lesson_id TEXT NOT NULL,files TEXT NOT NULL,hash TEXT NOT NULL,revision INTEGER NOT NULL DEFAULT 1,updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY(user_id,lesson_id)); CREATE TABLE IF NOT EXISTS challenge_progress(user_id TEXT NOT NULL REFERENCES users(id),lesson_id TEXT NOT NULL,passed INTEGER NOT NULL DEFAULT 0,completed_at TEXT,PRIMARY KEY(user_id,lesson_id)); CREATE TABLE IF NOT EXISTS attempts(id INTEGER PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id),lesson_id TEXT NOT NULL,hash TEXT NOT NULL,results TEXT NOT NULL,passed INTEGER NOT NULL,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP); CREATE TABLE IF NOT EXISTS hint_events(id INTEGER PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id),lesson_id TEXT NOT NULL,kind TEXT NOT NULL,level INTEGER,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP); CREATE INDEX IF NOT EXISTS attempts_lookup ON attempts(user_id,lesson_id,id);");
 const activity=openActivity(db);
 const quizzes=openQuizzes(db);
 const api={
  db,
  activity,quizzes,
  user(token){if(token&&/^[a-f0-9]{48}$/.test(token)&&db.prepare('SELECT id FROM users WHERE id=?').get(token))return token;const id=randomBytes(24).toString('hex');db.prepare('INSERT INTO users(id) VALUES(?)').run(id);return id;},
  draft(user,id){const r=db.prepare('SELECT * FROM saved_files WHERE user_id=? AND lesson_id=?').get(user,id);return r?{files:JSON.parse(r.files),revision:r.revision,hash:r.hash}:null;},
  save(user,id,files,expected){
   const current=api.draft(user,id);if(expected!==undefined&&Number(expected)!==(current?.revision??0)){const e=new Error('Rad je promenjen u drugom prozoru. Kopiraj svoj kod u lokalne datoteke kao rezervu, pa osveži stranicu.');e.statusCode=409;throw e;}
   const h=hash(files);if(current?.hash===h)return current;
   db.exec('BEGIN IMMEDIATE');
   try{db.prepare("INSERT INTO saved_files(user_id,lesson_id,files,hash) VALUES(?,?,?,?) ON CONFLICT(user_id,lesson_id) DO UPDATE SET files=excluded.files,hash=excluded.hash,revision=saved_files.revision+1,updated_at=CURRENT_TIMESTAMP").run(user,id,JSON.stringify(files),h);
    db.prepare('INSERT INTO challenge_progress(user_id,lesson_id,passed) VALUES(?,?,0) ON CONFLICT(user_id,lesson_id) DO UPDATE SET passed=0,completed_at=NULL').run(user,id);
    db.exec('COMMIT');
   }catch(e){db.exec('ROLLBACK');throw e;}return api.draft(user,id);
  },
  result(user,id,files,result){
   db.exec('BEGIN IMMEDIATE');try{
   db.prepare('INSERT INTO attempts(user_id,lesson_id,hash,results,passed) VALUES(?,?,?,?,?)').run(user,id,hash(files),JSON.stringify(result),Number(result.passed));
   db.prepare("INSERT INTO challenge_progress(user_id,lesson_id,passed,completed_at) VALUES(?,?,?,CASE WHEN ?=1 THEN CURRENT_TIMESTAMP ELSE NULL END) ON CONFLICT(user_id,lesson_id) DO UPDATE SET passed=excluded.passed,completed_at=excluded.completed_at").run(user,id,Number(result.passed),Number(result.passed));db.exec('COMMIT');
   }catch(e){db.exec('ROLLBACK');throw e;}
  },
  hint(user,id,kind,level){db.prepare('INSERT INTO hint_events(user_id,lesson_id,kind,level) VALUES(?,?,?,?)').run(user,id,kind,level??null);},
  state(user){
   const versions=rubricVersion?Object.fromEntries(db.prepare('SELECT lesson_id,results FROM attempts a WHERE user_id=? AND id=(SELECT MAX(id) FROM attempts WHERE user_id=a.user_id AND lesson_id=a.lesson_id)').all(user).map(r=>[r.lesson_id,JSON.parse(r.results).rubricVersion])):null;
   const drafts=Object.fromEntries(db.prepare('SELECT lesson_id,files,revision,hash FROM saved_files WHERE user_id=?').all(user).map(r=>[r.lesson_id,{files:JSON.parse(r.files),revision:r.revision,hash:r.hash}]));
   const progress=Object.fromEntries(db.prepare('SELECT lesson_id,passed,completed_at FROM challenge_progress WHERE user_id=?').all(user).map(r=>[r.lesson_id,{passed:Boolean(r.passed)&&(!versions||versions[r.lesson_id]===rubricVersion),completedAt:r.completed_at,needsRecheck:Boolean(r.passed)&&Boolean(versions)&&versions[r.lesson_id]!==rubricVersion}]));
   const hints=Object.fromEntries(db.prepare("SELECT lesson_id,MAX(CASE WHEN kind='hint' THEN level ELSE 0 END) AS level,MAX(CASE WHEN kind='solution' THEN 1 ELSE 0 END) AS solution FROM hint_events WHERE user_id=? GROUP BY lesson_id").all(user).map(r=>[r.lesson_id,{level:r.level,solution:Boolean(r.solution)}]));
   return {drafts,progress,hints,quizzes:quizzes.summary(user),activity:activity.summary(user)};
  },
  reset(user,id){db.exec('BEGIN IMMEDIATE');try{for(const t of ['saved_files','challenge_progress','attempts','hint_events'])db.prepare('DELETE FROM '+t+' WHERE user_id=? AND lesson_id=?').run(user,id);db.exec('COMMIT');}catch(e){db.exec('ROLLBACK');throw e;}},
  export(user){return {version:1,exportedAt:new Date().toISOString(),...api.state(user)};},
  close(){db.close();}
 };return api;
}
