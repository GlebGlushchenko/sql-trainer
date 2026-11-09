import { useCallback, useEffect, useRef, useState } from 'react';
import type { Problem } from '../data/types';
import { DIFFICULTY_LABEL } from '../data/types';
import { PROBLEMS } from '../data/problems';
import { checkSolution, runQuery, type RunOutput, type Verdict } from '../db/engine';
import { getDraft, markSolutionViewed, recordSubmit, saveDraft, useProgress } from '../store/progress';
import { navigate } from '../router';
import { SqlEditor } from './SqlEditor';
import { ResultTable } from './ResultTable';
import { SchemaPanel } from './SchemaPanel';
import { Rich, RichInline } from './Rich';

type LeftTab = 'desc' | 'schema' | 'hints' | 'solution';
type ConsoleTab = 'result' | 'verdict';

const TEMPLATE = '-- Напишите запрос и нажмите «Запустить» (Ctrl+Enter)\n-- «Отправить» — проверка решения (Ctrl+Shift+Enter)\n\n';

export type RunState = { kind: 'idle' } | { kind: 'ok'; out: RunOutput } | { kind: 'error'; message: string };

export function ProblemView({ problem }: { problem: Problem }) {
  const progress = useProgress();
  const pr = progress[problem.id];
  const [code, setCode] = useState(() => getDraft(problem.id) ?? TEMPLATE);
  const [leftTab, setLeftTab] = useState<LeftTab>('desc');
  const [consoleTab, setConsoleTab] = useState<ConsoleTab>('result');
  const [run, setRun] = useState<RunState>({ kind: 'idle' });
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [busy, setBusy] = useState(false);
  const [hintsShown, setHintsShown] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [leftWidth, setLeftWidth] = useState(44);
  const [consoleHeight, setConsoleHeight] = useState(42);
  const wsRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  const idx = PROBLEMS.findIndex((p) => p.id === problem.id);
  const prev = PROBLEMS[idx - 1];
  const next = PROBLEMS[idx + 1];

  const onChange = (v: string) => {
    setCode(v);
    saveDraft(problem.id, v);
  };

  const doRun = useCallback(async () => {
    setBusy(true);
    setConsoleTab('result');
    try {
      const out = await runQuery(code);
      setRun({ kind: 'ok', out });
    } catch (e) {
      setRun({ kind: 'error', message: (e as Error).message });
    } finally {
      setBusy(false);
    }
  }, [code]);

  const doSubmit = useCallback(async () => {
    setBusy(true);
    setConsoleTab('verdict');
    try {
      const v = await checkSolution(problem, code);
      setVerdict(v);
      if (v.status !== 'error' || code.trim()) recordSubmit(problem.id, v.status === 'accepted');
    } finally {
      setBusy(false);
    }
  }, [code, problem]);

  const startDrag = (axis: 'x' | 'y') => (e: React.MouseEvent) => {
    e.preventDefault();
    const onMove = (ev: MouseEvent) => {
      if (axis === 'x' && wsRef.current) {
        const r = wsRef.current.getBoundingClientRect();
        setLeftWidth(Math.min(70, Math.max(25, ((ev.clientX - r.left) / r.width) * 100)));
      }
      if (axis === 'y' && rightRef.current) {
        const r = rightRef.current.getBoundingClientRect();
        setConsoleHeight(Math.min(75, Math.max(15, ((r.bottom - ev.clientY) / r.height) * 100)));
      }
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      document.body.classList.remove('dragging');
    };
    document.body.classList.add('dragging');
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'ArrowRight' && next) navigate(`/problem/${next.id}`);
      if (e.altKey && e.key === 'ArrowLeft' && prev) navigate(`/problem/${prev.id}`);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  const revealSolution = () => {
    setShowSolution(true);
    markSolutionViewed(problem.id);
  };

  return (
    <div className="page problem-page">
      <div className="subbar">
        <a className="btn ghost sm" href="#/problems">
          ☰ Список задач
        </a>
        <button className="btn ghost sm icon" disabled={!prev} onClick={() => prev && navigate(`/problem/${prev.id}`)} title="Предыдущая (Alt+←)">
          ‹
        </button>
        <button className="btn ghost sm icon" disabled={!next} onClick={() => next && navigate(`/problem/${next.id}`)} title="Следующая (Alt+→)">
          ›
        </button>
        <div className="subbar-spacer" />
        <button className="btn run" onClick={doRun} disabled={busy}>
          ▶ Запустить
        </button>
        <button className="btn submit" onClick={doSubmit} disabled={busy}>
          ☁ Отправить
        </button>
      </div>

      <div className="workspace" ref={wsRef}>
        <section className="pane" style={{ width: `${leftWidth}%` }}>
          <div className="tabs">
            {(
              [
                ['desc', '📄 Описание'],
                ['schema', '🗄 Схема БД'],
                ['hints', `💡 Подсказки (${problem.hints.length})`],
                ['solution', '🔑 Решение'],
              ] as [LeftTab, string][]
            ).map(([k, label]) => (
              <button key={k} className={`tab ${leftTab === k ? 'active' : ''}`} onClick={() => setLeftTab(k)}>
                {label}
              </button>
            ))}
          </div>
          <div className="pane-body">
            {leftTab === 'desc' && (
              <div className="desc">
                <h1>
                  {problem.id}. {problem.title}
                </h1>
                <div className="meta">
                  <span className={`badge ${problem.difficulty}`}>{DIFFICULTY_LABEL[problem.difficulty]}</span>
                  <span className="badge topic">{problem.topic}</span>
                  {pr?.status === 'solved' && <span className="badge ok">✓ Решено</span>}
                  {pr?.status === 'attempted' && <span className="badge fail">✗ Не прошёл</span>}
                  {pr?.attempts ? <span className="muted small">Попыток: {pr.attempts}</span> : null}
                </div>
                <Rich text={problem.description} className="rich" />
                <div className="note">
                  {problem.ordered
                    ? '⚠ Порядок строк важен — проверяется вместе с ORDER BY.'
                    : 'Порядок строк не важен. Названия столбцов не проверяются — важны количество и порядок столбцов и значения.'}
                </div>
                <div className="desc-tables">
                  <span className="muted small">Таблицы базы:</span>
                  {['departments', 'employees', 'customers', 'products', 'orders', 'order_items'].map((t) => (
                    <button key={t} className="tbl-chip" onClick={() => setLeftTab('schema')}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {leftTab === 'schema' && <SchemaPanel />}
            {leftTab === 'hints' && (
              <div className="hints">
                {problem.hints.slice(0, hintsShown).map((h, i) => (
                  <div key={i} className="hint">
                    <span className="hint-n">Подсказка {i + 1}</span>
                    <RichInline text={h} />
                  </div>
                ))}
                {hintsShown < problem.hints.length ? (
                  <button className="btn ghost" onClick={() => setHintsShown((n) => n + 1)}>
                    Показать подсказку {hintsShown + 1} из {problem.hints.length}
                  </button>
                ) : (
                  <div className="muted small">Все подсказки открыты.</div>
                )}
              </div>
            )}
            {leftTab === 'solution' && (
              <div className="solution">
                {showSolution ? (
                  <>
                    <pre className="code">{problem.solution}</pre>
                    <button className="btn ghost" onClick={() => onChange(problem.solution)}>
                      Вставить в редактор
                    </button>
                  </>
                ) : (
                  <div className="locked">
                    <div className="lock-icon">🔒</div>
                    <p>Попробуйте решить задачу самостоятельно — так материал запомнится лучше.</p>
                    <button className="btn ghost" onClick={revealSolution}>
                      Всё равно показать решение
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        <div className="divider-x" onMouseDown={startDrag('x')} />

        <section className="pane right" ref={rightRef}>
          <div className="tabs">
            <span className="tab active">‹/› SQLite</span>
            <div className="subbar-spacer" />
            <button className="tab" onClick={() => onChange(TEMPLATE)} title="Очистить редактор">
              ↺ Сброс
            </button>
          </div>
          <div className="editor-box" style={{ height: `${100 - consoleHeight}%` }}>
            <SqlEditor value={code} onChange={onChange} onRun={doRun} onSubmit={doSubmit} />
          </div>
          <div className="divider-y" onMouseDown={startDrag('y')} />
          <div className="console" style={{ height: `${consoleHeight}%` }}>
            <div className="tabs">
              <button className={`tab ${consoleTab === 'result' ? 'active' : ''}`} onClick={() => setConsoleTab('result')}>
                ▤ Результат
              </button>
              <button className={`tab ${consoleTab === 'verdict' ? 'active' : ''}`} onClick={() => setConsoleTab('verdict')}>
                ✓ Проверка
              </button>
              {busy && <span className="spinner" />}
            </div>
            <div className="console-body">
              {consoleTab === 'result' && <RunView run={run} />}
              {consoleTab === 'verdict' && <VerdictView verdict={verdict} next={next} />}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export function RunView({ run }: { run: RunState }) {
  if (run.kind === 'idle') return <div className="muted pad">Нажмите «Запустить», чтобы увидеть результат запроса.</div>;
  if (run.kind === 'error')
    return (
      <div className="error-box">
        <b>Ошибка SQL</b>
        <div>{run.message}</div>
      </div>
    );
  const { out } = run;
  return (
    <div>
      <div className="run-meta">
        {out.result ? `${out.result.rows.length} строк` : `Запрос выполнен. Изменено строк: ${out.rowsModified}`}
        <span className="muted"> · {out.timeMs.toFixed(1)} мс</span>
      </div>
      {out.result && <ResultTable result={out.result} />}
    </div>
  );
}

function VerdictView({ verdict, next }: { verdict: Verdict | null; next?: Problem }) {
  if (!verdict) return <div className="muted pad">Нажмите «Отправить», чтобы проверить решение.</div>;
  if (verdict.status === 'error')
    return (
      <div className="verdict">
        <div className="verdict-title fail">Ошибка выполнения</div>
        <div className="error-box">{verdict.reason}</div>
      </div>
    );
  const ok = verdict.status === 'accepted';
  return (
    <div className="verdict">
      <div className={`verdict-title ${ok ? 'ok' : 'fail'}`}>
        {ok ? '✓ Принято' : '✗ Неверный ответ'}
        <span className="muted small"> · {verdict.timeMs.toFixed(1)} мс</span>
        {ok && next && (
          <a className="btn submit sm next-btn" href={`#/problem/${next.id}`}>
            Следующая задача →
          </a>
        )}
      </div>
      {!ok && <div className="verdict-reason">{verdict.reason}</div>}
      <div className={ok ? '' : 'compare'}>
        <div>
          <div className="compare-label">Ваш результат</div>
          <ResultTable result={verdict.user} limit={100} />
        </div>
        {!ok && (
          <div>
            <div className="compare-label">Ожидаемый результат</div>
            <ResultTable result={verdict.expected} limit={100} />
          </div>
        )}
      </div>
    </div>
  );
}
