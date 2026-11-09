import initSqlJs, { type Database, type SqlJsStatic } from 'sql.js';
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url';
import { SCHEMA_SQL } from './schema';
import type { Problem } from '../data/types';

export type Cell = string | number | null | Uint8Array;

export interface ResultSet {
  columns: string[];
  rows: Cell[][];
}

export interface RunOutput {
  result: ResultSet | null;
  rowsModified: number;
  timeMs: number;
}

let sqlPromise: Promise<SqlJsStatic> | null = null;

export function loadSql(): Promise<SqlJsStatic> {
  if (!sqlPromise) sqlPromise = initSqlJs({ locateFile: () => wasmUrl });
  return sqlPromise;
}

export async function createDb(): Promise<Database> {
  const SQL = await loadSql();
  const db = new SQL.Database();
  db.run(SCHEMA_SQL);
  return db;
}

function execLast(db: Database, sql: string): ResultSet | null {
  const res = db.exec(sql);
  if (!res.length) return null;
  const last = res[res.length - 1];
  return { columns: last.columns, rows: last.values as Cell[][] };
}

export async function runQuery(sql: string, db?: Database): Promise<RunOutput> {
  const own = !db;
  const database = db ?? (await createDb());
  const start = performance.now();
  try {
    const result = execLast(database, sql);
    return { result, rowsModified: database.getRowsModified(), timeMs: performance.now() - start };
  } finally {
    if (own) database.close();
  }
}

async function evaluate(sql: string, check?: string): Promise<ResultSet | null> {
  const db = await createDb();
  try {
    const result = execLast(db, sql);
    return check ? execLast(db, check) : result;
  } finally {
    db.close();
  }
}

export type Verdict =
  | { status: 'accepted'; user: ResultSet | null; expected: ResultSet | null; timeMs: number }
  | { status: 'wrong'; reason: string; user: ResultSet | null; expected: ResultSet | null; timeMs: number }
  | { status: 'error'; reason: string };

function normalize(cell: Cell): string {
  if (cell === null) return '∅NULL';
  if (typeof cell === 'number') {
    const rounded = Math.round(cell * 100) / 100;
    return String(Object.is(rounded, -0) ? 0 : rounded);
  }
  if (cell instanceof Uint8Array) return `blob:${Array.from(cell).join(',')}`;
  const asNum = Number(cell);
  if (cell.trim() !== '' && !Number.isNaN(asNum) && /^-?\d+(\.\d+)?$/.test(cell.trim())) {
    return String(Math.round(asNum * 100) / 100);
  }
  return cell;
}

const rowKey = (row: Cell[]) => row.map(normalize).join('\u241F');

export async function checkSolution(problem: Problem, userSql: string): Promise<Verdict> {
  if (!userSql.trim()) return { status: 'error', reason: 'Запрос пустой — напишите SQL перед отправкой.' };
  const start = performance.now();
  let user: ResultSet | null;
  try {
    user = await evaluate(userSql, problem.check);
  } catch (e) {
    return { status: 'error', reason: (e as Error).message };
  }
  const timeMs = performance.now() - start;
  const expected = await evaluate(problem.solution, problem.check);

  const fail = (reason: string): Verdict => ({ status: 'wrong', reason, user, expected, timeMs });

  if (!expected && !user) return { status: 'accepted', user, expected, timeMs };
  if (!user) return fail('Запрос не вернул ни одной строки/таблицы результата.');
  if (!expected) return fail('Ожидался пустой результат.');

  if (user.columns.length !== expected.columns.length) {
    return fail(`Неверное количество столбцов: у вас ${user.columns.length}, ожидается ${expected.columns.length}.`);
  }
  if (user.rows.length !== expected.rows.length) {
    return fail(`Неверное количество строк: у вас ${user.rows.length}, ожидается ${expected.rows.length}.`);
  }

  const uKeys = user.rows.map(rowKey);
  const eKeys = expected.rows.map(rowKey);

  if (problem.ordered) {
    for (let i = 0; i < eKeys.length; i++) {
      if (uKeys[i] !== eKeys[i]) {
        const sameSet = [...uKeys].sort().join('\n') === [...eKeys].sort().join('\n');
        return fail(
          sameSet
            ? `Данные верные, но порядок строк отличается (первое расхождение в строке ${i + 1}). Проверьте ORDER BY.`
            : `Расхождение в строке ${i + 1}.`,
        );
      }
    }
  } else {
    const a = [...uKeys].sort();
    const b = [...eKeys].sort();
    for (let i = 0; i < b.length; i++) {
      if (a[i] !== b[i]) return fail('Набор строк отличается от ожидаемого. Сравните результаты ниже.');
    }
  }
  return { status: 'accepted', user, expected, timeMs };
}
