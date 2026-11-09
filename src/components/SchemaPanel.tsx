import { useState } from 'react';
import { TABLES } from '../db/schema';
import { runQuery, type ResultSet } from '../db/engine';
import { ResultTable } from './ResultTable';

export function SchemaPanel() {
  const [open, setOpen] = useState<string | null>(null);
  const [preview, setPreview] = useState<Record<string, ResultSet | null>>({});

  const toggle = async (name: string) => {
    const next = open === name ? null : name;
    setOpen(next);
    if (next && !(next in preview)) {
      const out = await runQuery(`SELECT * FROM ${next} LIMIT 8;`);
      setPreview((p) => ({ ...p, [next]: out.result }));
    }
  };

  return (
    <div className="schema">
      {TABLES.map((t) => (
        <div key={t.name} className={`schema-table ${open === t.name ? 'open' : ''}`}>
          <button className="schema-head" onClick={() => toggle(t.name)}>
            <span className="chev">{open === t.name ? '▾' : '▸'}</span>
            <span className="tname">{t.name}</span>
            <span className="muted">{t.description}</span>
          </button>
          {open === t.name && (
            <div className="schema-body">
              <table className="cols">
                <tbody>
                  {t.columns.map((c) => (
                    <tr key={c.name}>
                      <td className="cname">{c.name}</td>
                      <td className="ctype">{c.type}</td>
                      <td className="muted">{c.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="schema-preview-label">Первые строки</div>
              {preview[t.name] !== undefined ? <ResultTable result={preview[t.name]} /> : <div className="muted pad">Загрузка…</div>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
