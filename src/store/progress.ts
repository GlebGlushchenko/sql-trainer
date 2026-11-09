import { useSyncExternalStore } from 'react';
import { getSession, setCloudState, supabase } from '../cloud/supabase';

export type ProblemStatus = 'solved' | 'attempted';

export interface ProblemProgress {
  status?: ProblemStatus;
  attempts: number;
  solvedAt?: string;
  draft?: string;
  solutionViewed?: boolean;
  updatedAt?: string;
}

type ProgressMap = Record<number, ProblemProgress>;

const KEY = 'sql-lab.progress.v1';
const listeners = new Set<() => void>();

function read(): ProgressMap {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}') as ProgressMap;
  } catch {
    return {};
  }
}

let state: ProgressMap = read();

function persist(notify: boolean) {
  localStorage.setItem(KEY, JSON.stringify(state));
  if (notify) listeners.forEach((l) => l());
}

function update(id: number, patch: (prev: ProblemProgress) => ProblemProgress, notify = true) {
  const prev = state[id] ?? { attempts: 0 };
  state = { ...state, [id]: { ...patch(prev), updatedAt: new Date().toISOString() } };
  persist(notify);
  markDirty(id);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useProgress(): ProgressMap {
  return useSyncExternalStore(subscribe, () => state);
}

export function recordSubmit(id: number, accepted: boolean) {
  update(id, (prev) => ({
    ...prev,
    attempts: prev.attempts + 1,
    status: prev.status === 'solved' || accepted ? 'solved' : 'attempted',
    solvedAt: accepted && !prev.solvedAt ? new Date().toISOString() : prev.solvedAt,
  }));
}

export function saveDraft(id: number, draft: string) {
  update(id, (prev) => ({ ...prev, draft }), false);
}

export function getDraft(id: number): string | undefined {
  return state[id]?.draft;
}

export function markSolutionViewed(id: number) {
  update(id, (prev) => ({ ...prev, solutionViewed: true }));
}

export async function resetProgress() {
  state = {};
  persist(true);
  dirty.clear();
  const session = getSession();
  if (supabase && session) {
    const { error } = await supabase.from('progress').delete().eq('user_id', session.user.id);
    setCloudState({ sync: error ? 'error' : 'idle' });
  }
}

// ───────────── Облачная синхронизация ─────────────

interface ProgressRow {
  user_id: string;
  problem_id: number;
  status: ProblemStatus | null;
  attempts: number;
  solved_at: string | null;
  draft: string | null;
  solution_viewed: boolean;
  updated_at: string;
}

const dirty = new Set<number>();
let flushTimer: ReturnType<typeof setTimeout> | undefined;

const toRow = (userId: string, id: number, p: ProblemProgress): ProgressRow => ({
  user_id: userId,
  problem_id: id,
  status: p.status ?? null,
  attempts: p.attempts,
  solved_at: p.solvedAt ?? null,
  draft: p.draft ?? null,
  solution_viewed: !!p.solutionViewed,
  updated_at: p.updatedAt ?? new Date().toISOString(),
});

const fromRow = (r: ProgressRow): ProblemProgress => ({
  status: r.status ?? undefined,
  attempts: r.attempts,
  solvedAt: r.solved_at ?? undefined,
  draft: r.draft ?? undefined,
  solutionViewed: r.solution_viewed,
  updatedAt: r.updated_at,
});

function merge(a: ProblemProgress | undefined, b: ProblemProgress | undefined): ProblemProgress {
  if (!a) return b!;
  if (!b) return a;
  const newer = (a.updatedAt ?? '') >= (b.updatedAt ?? '') ? a : b;
  const solvedDates = [a.solvedAt, b.solvedAt].filter(Boolean).sort();
  return {
    status: a.status === 'solved' || b.status === 'solved' ? 'solved' : (a.status ?? b.status),
    attempts: Math.max(a.attempts, b.attempts),
    solvedAt: solvedDates[0],
    draft: newer.draft ?? a.draft ?? b.draft,
    solutionViewed: !!(a.solutionViewed || b.solutionViewed),
    updatedAt: newer.updatedAt,
  };
}

function markDirty(id: number) {
  if (!supabase || !getSession()) return;
  dirty.add(id);
  clearTimeout(flushTimer);
  flushTimer = setTimeout(flush, 1500);
}

async function flush() {
  const session = getSession();
  if (!supabase || !session || !dirty.size) return;
  const ids = [...dirty];
  dirty.clear();
  setCloudState({ sync: 'syncing' });
  const rows = ids.filter((id) => state[id]).map((id) => toRow(session.user.id, id, state[id]));
  const { error } = await supabase.from('progress').upsert(rows);
  if (error) {
    ids.forEach((id) => dirty.add(id));
    setCloudState({ sync: 'error' });
  } else {
    setCloudState({ sync: 'idle' });
  }
}

/** Вызывается после входа: сливает локальный и облачный прогресс и выгружает результат */
export async function syncOnLogin(userId: string) {
  if (!supabase) return;
  setCloudState({ sync: 'syncing' });
  const { data, error } = await supabase.from('progress').select('*').eq('user_id', userId);
  if (error) {
    setCloudState({ sync: 'error' });
    return;
  }
  const remote: ProgressMap = {};
  for (const r of data as ProgressRow[]) remote[r.problem_id] = fromRow(r);

  const ids = new Set([...Object.keys(state), ...Object.keys(remote)].map(Number));
  const merged: ProgressMap = {};
  ids.forEach((id) => (merged[id] = merge(state[id], remote[id])));
  state = merged;
  persist(true);

  const rows = [...ids].map((id) => toRow(userId, id, merged[id]));
  const { error: upErr } = rows.length ? await supabase.from('progress').upsert(rows) : { error: null };
  setCloudState({ sync: upErr ? 'error' : 'idle' });
}

window.addEventListener('beforeunload', () => {
  if (dirty.size) void flush();
});
