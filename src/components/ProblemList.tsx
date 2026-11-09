import { useMemo, useState } from 'react';
import { PROBLEMS, TOPICS } from '../data/problems';
import { DIFFICULTY_LABEL, type Difficulty } from '../data/types';
import { resetProgress, useProgress } from '../store/progress';
import { navigate } from '../router';
import { TIPS } from '../data/reference';
import { RichInline } from './Rich';

type StatusFilter = 'all' | 'solved' | 'attempted' | 'todo';

const DIFFS: Difficulty[] = ['easy', 'medium', 'hard'];

function ProgressRing({ solved, total }: { solved: number; total: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const pct = total ? solved / total : 0;
  return (
    <svg className="ring" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r={r} className="ring-bg" />
      {solved > 0 && <circle cx="60" cy="60" r={r} className="ring-fg" strokeDasharray={`${c * pct} ${c}`} />}
      <text x="60" y="56" className="ring-num">{solved}</text>
      <text x="60" y="76" className="ring-sub">из {total}</text>
    </svg>
  );
}

export function ProblemList() {
  const progress = useProgress();
  const [query, setQuery] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [topic, setTopic] = useState<string>('all');

  const statusOf = (id: number) => progress[id]?.status;

  const filtered = useMemo(
    () =>
      PROBLEMS.filter((p) => {
        if (difficulty !== 'all' && p.difficulty !== difficulty) return false;
        if (topic !== 'all' && p.topic !== topic) return false;
        const s = progress[p.id]?.status;
        if (status === 'solved' && s !== 'solved') return false;
        if (status === 'attempted' && s !== 'attempted') return false;
        if (status === 'todo' && s) return false;
        const q = query.trim().toLowerCase();
        if (q && !`${p.id}. ${p.title} ${p.topic}`.toLowerCase().includes(q)) return false;
        return true;
      }),
    [difficulty, topic, status, query, progress],
  );

  const solvedTotal = PROBLEMS.filter((p) => statusOf(p.id) === 'solved').length;
  const attemptedTotal = PROBLEMS.filter((p) => statusOf(p.id) === 'attempted').length;

  const pickRandom = () => {
    const pool = PROBLEMS.filter((p) => statusOf(p.id) !== 'solved');
    const list = pool.length ? pool : PROBLEMS;
    navigate(`/problem/${list[Math.floor(Math.random() * list.length)].id}`);
  };

  const tip = TIPS[new Date().getDate() % TIPS.length];

  return (
    <div className="page list-page">
      <main className="list-main">
        <div className="topic-chips">
          <button className={`chip ${topic === 'all' ? 'active' : ''}`} onClick={() => setTopic('all')}>
            Все темы
          </button>
          {TOPICS.map((t) => {
            const total = PROBLEMS.filter((p) => p.topic === t).length;
            return (
              <button key={t} className={`chip ${topic === t ? 'active' : ''}`} onClick={() => setTopic(t)}>
                {t} <span className="chip-count">{total}</span>
              </button>
            );
          })}
        </div>

        <div className="filters">
          <div className="search">
            <span>⌕</span>
            <input placeholder="Поиск задач" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty | 'all')}>
            <option value="all">Сложность: все</option>
            {DIFFS.map((d) => (
              <option key={d} value={d}>
                {DIFFICULTY_LABEL[d]}
              </option>
            ))}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value as StatusFilter)}>
            <option value="all">Статус: все</option>
            <option value="solved">Решено</option>
            <option value="attempted">Не прошёл</option>
            <option value="todo">Не начато</option>
          </select>
          <button className="btn ghost" onClick={pickRandom} title="Случайная нерешённая задача">
            🎲 Случайная
          </button>
        </div>

        <div className="ptable">
          <div className="prow phead">
            <span>Статус</span>
            <span>Название</span>
            <span>Тема</span>
            <span>Попытки</span>
            <span>Сложность</span>
          </div>
          {filtered.map((p, i) => {
            const pr = progress[p.id];
            return (
              <a key={p.id} href={`#/problem/${p.id}`} className={`prow ${i % 2 ? 'odd' : ''}`}>
                <span className="status-cell">
                  {pr?.status === 'solved' && <span className="st solved" title="Решено">✓</span>}
                  {pr?.status === 'attempted' && <span className="st attempted" title="Не прошёл">✗</span>}
                </span>
                <span className="ptitle">
                  {p.id}. {p.title}
                </span>
                <span className="muted">{p.topic}</span>
                <span className="muted">{pr?.attempts || '—'}</span>
                <span className={`diff ${p.difficulty}`}>{DIFFICULTY_LABEL[p.difficulty]}</span>
              </a>
            );
          })}
          {!filtered.length && <div className="empty">Ничего не найдено — попробуйте изменить фильтры</div>}
        </div>
      </main>

      <aside className="list-side">
        <div className="card">
          <div className="card-title">Прогресс</div>
          <div className="progress-top">
            <ProgressRing solved={solvedTotal} total={PROBLEMS.length} />
            <div className="progress-legend">
              {DIFFS.map((d) => {
                const total = PROBLEMS.filter((p) => p.difficulty === d).length;
                const solved = PROBLEMS.filter((p) => p.difficulty === d && statusOf(p.id) === 'solved').length;
                return (
                  <div key={d} className={`legend ${d}`}>
                    <div className="legend-row">
                      <span>{DIFFICULTY_LABEL[d]}</span>
                      <span>
                        <b>{solved}</b>
                        <span className="muted">/{total}</span>
                      </span>
                    </div>
                    <div className="bar">
                      <div style={{ width: `${(solved / total) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="progress-foot">
            <span>
              <span className="dot solved" /> Решено: {solvedTotal}
            </span>
            <span>
              <span className="dot attempted" /> Не прошёл: {attemptedTotal}
            </span>
          </div>
        </div>

        <div className="card">
          <div className="card-title">По темам</div>
          <div className="topic-progress">
            {TOPICS.map((t) => {
              const list = PROBLEMS.filter((p) => p.topic === t);
              const solved = list.filter((p) => statusOf(p.id) === 'solved').length;
              return (
                <button key={t} className="tp-row" onClick={() => setTopic(t)}>
                  <span>{t}</span>
                  <span className="tp-bar">
                    <span style={{ width: `${(solved / list.length) * 100}%` }} />
                  </span>
                  <span className="muted">
                    {solved}/{list.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="card tip">
          <div className="card-title">💡 Совет дня</div>
          <p>
            <RichInline text={tip} />
          </p>
        </div>

        <button
          className="btn link danger"
          onClick={() => confirm('Сбросить весь прогресс и черновики?') && resetProgress()}
        >
          Сбросить прогресс
        </button>
      </aside>
    </div>
  );
}
