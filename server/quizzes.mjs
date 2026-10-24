export function openQuizzes(db){
 db.exec('CREATE TABLE IF NOT EXISTS quiz_attempts(id INTEGER PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id),lesson_id TEXT NOT NULL,version INTEGER NOT NULL,score INTEGER NOT NULL,total INTEGER NOT NULL,result TEXT NOT NULL,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP); CREATE INDEX IF NOT EXISTS quiz_attempts_lookup ON quiz_attempts(user_id,lesson_id,version,id);');
 return {
  record(user,id,result){db.prepare('INSERT INTO quiz_attempts(user_id,lesson_id,version,score,total,result) VALUES(?,?,?,?,?,?)').run(user,id,result.version,result.score,result.total,JSON.stringify(result));},
  latest(user,id,version){const stats=db.prepare('SELECT COUNT(*) AS attempts,MAX(score) AS bestScore FROM quiz_attempts WHERE user_id=? AND lesson_id=? AND version=?').get(user,id,version);const last=db.prepare('SELECT result,created_at FROM quiz_attempts WHERE user_id=? AND lesson_id=? AND version=? ORDER BY id DESC LIMIT 1').get(user,id,version);return {...stats,lastResult:last?JSON.parse(last.result):null,updatedAt:last?.created_at??null};},
  summary(user){return db.prepare('SELECT lesson_id AS lessonId,version,COUNT(*) AS attempts,MAX(score) AS bestScore,MAX(total) AS total FROM quiz_attempts WHERE user_id=? GROUP BY lesson_id,version').all(user);}
 };
}
