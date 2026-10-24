// Bounded, idempotent heartbeats. A user's overlapping tabs cannot multiply time.
export function openActivity(db){
 db.exec(`CREATE TABLE IF NOT EXISTS activity_sessions(user_id TEXT NOT NULL REFERENCES users(id),session_id TEXT NOT NULL,last_seq INTEGER NOT NULL,last_seen_ms INTEGER NOT NULL,PRIMARY KEY(user_id,session_id));
 CREATE TABLE IF NOT EXISTS activity_clock(user_id TEXT PRIMARY KEY REFERENCES users(id),last_end_ms INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS activity_totals(user_id TEXT NOT NULL REFERENCES users(id),lesson_id TEXT NOT NULL,active_ms INTEGER NOT NULL DEFAULT 0,PRIMARY KEY(user_id,lesson_id));`);
 function summary(user){
  const rows=db.prepare('SELECT lesson_id,active_ms FROM activity_totals WHERE user_id=?').all(user);
  return {totalMs:rows.reduce((n,r)=>n+r.active_ms,0),byLesson:Object.fromEntries(rows.map(r=>[r.lesson_id,r.active_ms]))};
 }
 function record(user,{sessionId,sequence,durationMs,lessonId='overview'},now=Date.now()){
  if(typeof sessionId!=='string'||!/^[a-zA-Z0-9-]{16,80}$/.test(sessionId)||!Number.isSafeInteger(sequence)||sequence<0||!Number.isInteger(durationMs)||durationMs<0||durationMs>15000)throw new Error('Neispravan zapis aktivnosti.');
  db.exec('BEGIN IMMEDIATE');let creditedMs=0;
  try{
   const session=db.prepare('SELECT * FROM activity_sessions WHERE user_id=? AND session_id=?').get(user,sessionId);
   if(!session){
    if(durationMs!==0)throw new Error('Prvi zapis aktivnosti mora imati trajanje 0.');
    db.prepare('INSERT INTO activity_sessions VALUES(?,?,?,?)').run(user,sessionId,sequence,now);
    db.prepare('INSERT INTO activity_clock VALUES(?,?) ON CONFLICT DO NOTHING').run(user,now);
   }else if(sequence>session.last_seq){
    const clock=db.prepare('SELECT last_end_ms FROM activity_clock WHERE user_id=?').get(user);
    creditedMs=Math.min(durationMs,Math.max(0,now-session.last_seen_ms),Math.max(0,now-clock.last_end_ms));
    db.prepare('UPDATE activity_sessions SET last_seq=?,last_seen_ms=? WHERE user_id=? AND session_id=?').run(sequence,Math.max(now,session.last_seen_ms),user,sessionId);
    if(creditedMs>0){
     db.prepare('INSERT INTO activity_totals VALUES(?,?,?) ON CONFLICT(user_id,lesson_id) DO UPDATE SET active_ms=active_ms+excluded.active_ms').run(user,lessonId,creditedMs);
     db.prepare('UPDATE activity_clock SET last_end_ms=? WHERE user_id=?').run(now,user);
    }
   }
   db.exec('COMMIT');
  }catch(e){db.exec('ROLLBACK');throw e;}
  return {...summary(user),creditedMs};
 }
 return {summary,record};
}
