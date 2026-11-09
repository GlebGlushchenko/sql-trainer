import { useCallback, useEffect, useRef, useState } from 'react';
import type { Database } from 'sql.js';
import { createDb, runQuery } from '../db/engine';
import { getSandboxCode, setSandboxCode } from '../router';
import { SqlEditor } from './SqlEditor';
import { SchemaPanel } from './SchemaPanel';
import { RunView, type RunState } from './ProblemView';

export function Sandbox() {
  const [code, setCode] = useState(getSandboxCode);
  const [run, setRun] = useState<RunState>({ kind: 'idle' });
  const [persist, setPersist] = useState(false);
  const dbRef = useRef<Database | null>(null);

  useEffect(
    () => () => {
      dbRef.current?.close();
      dbRef.current = null;
    },
    [],
  );

  const resetDb = async () => {
    dbRef.current?.close();
    dbRef.current = await createDb();
    setRun({ kind: 'idle' });
  };

  const doRun = useCallback(async () => {
    try {
      let db: Database | undefined;
      if (persist) {
        if (!dbRef.current) dbRef.current = await createDb();
        db = dbRef.current;
      }
      setRun({ kind: 'ok', out: await runQuery(code, db) });
    } catch (e) {
      setRun({ kind: 'error', message: (e as Error).message });
    }
  }, [code, persist]);

  return (
    <div className="page sandbox-page">
      <section className="sandbox-main">
        <div className="sandbox-head">
          <div>
            <h2>Песочница</h2>
            <p className="muted small">Свободные эксперименты с учебной базой. Ctrl+Enter — выполнить.</p>
          </div>
          <div className="sandbox-actions">
            <label className="toggle" title="Изменения (INSERT/UPDATE/CREATE) сохраняются между запусками">
              <input type="checkbox" checked={persist} onChange={(e) => setPersist(e.target.checked)} />
              <span>Сохранять изменения БД</span>
            </label>
            {persist && (
              <button className="btn ghost sm" onClick={resetDb}>
                Сбросить БД
              </button>
            )}
            <button className="btn run" onClick={doRun}>
              ▶ Выполнить
            </button>
          </div>
        </div>
        <div className="sandbox-editor">
          <SqlEditor
            value={code}
            onChange={(v) => {
              setCode(v);
              setSandboxCode(v);
            }}
            onRun={doRun}
          />
        </div>
        <div className="sandbox-result">
          <RunView run={run} />
        </div>
      </section>
      <aside className="sandbox-side">
        <div className="card-title">Схема базы</div>
        <SchemaPanel />
      </aside>
    </div>
  );
}
