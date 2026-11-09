import initSqlJs from 'sql.js';
import { SCHEMA_SQL } from '../src/db/schema';
import { PROBLEMS } from '../src/data/problems';

const SQL = await initSqlJs();
let failed = 0;

for (const p of PROBLEMS) {
  const db = new SQL.Database();
  db.run(SCHEMA_SQL);
  try {
    const res = db.exec(p.solution);
    const out = p.check ? db.exec(p.check) : res;
    const last = out[out.length - 1];
    const rows = last?.values.length ?? 0;
    if (!rows) {
      failed++;
      console.log(`EMPTY  #${p.id} ${p.title}`);
    } else {
      console.log(`ok     #${p.id} ${p.title} → ${rows} rows`);
    }
  } catch (e) {
    failed++;
    console.log(`ERROR  #${p.id} ${p.title}: ${(e as Error).message}`);
  } finally {
    db.close();
  }
}

console.log(`\n${PROBLEMS.length} problems, ${failed} failed`);
process.exit(failed ? 1 : 0);
