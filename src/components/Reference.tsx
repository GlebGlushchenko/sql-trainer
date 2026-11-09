import { useMemo, useState } from 'react';
import { GLOSSARY, REFERENCE } from '../data/reference';
import { openInSandbox } from '../router';
import { RichInline } from './Rich';

export function Reference() {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  const sections = useMemo(
    () =>
      REFERENCE.map((s) => ({
        ...s,
        items: s.items.filter((i) => !q || `${s.title} ${i.title} ${i.body} ${i.code ?? ''}`.toLowerCase().includes(q)),
      })).filter((s) => s.items.length),
    [q],
  );
  const terms = useMemo(
    () => GLOSSARY.filter((t) => !q || `${t.term} ${t.definition}`.toLowerCase().includes(q)),
    [q],
  );

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className="page ref-page">
      <aside className="ref-nav">
        <div className="search">
          <span>⌕</span>
          <input placeholder="Поиск по справочнику" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        {sections.map((s) => (
          <button key={s.id} className="ref-link" onClick={() => scrollTo(s.id)}>
            <span className="ref-icon">{s.icon}</span>
            {s.title}
          </button>
        ))}
        {terms.length > 0 && (
          <button className="ref-link" onClick={() => scrollTo('glossary')}>
            <span className="ref-icon">📖</span>
            Глоссарий терминов
          </button>
        )}
      </aside>

      <main className="ref-main">
        <div className="ref-hero">
          <h1>Справочник SQL</h1>
          <p className="muted">
            Синтаксис, примеры и основные термины. Любой пример можно открыть в песочнице и выполнить на учебной базе (диалект SQLite).
          </p>
        </div>

        {sections.map((s) => (
          <section key={s.id} id={s.id} className="ref-section">
            <h2>
              <span className="ref-icon">{s.icon}</span> {s.title}
            </h2>
            {s.intro && <p className="ref-intro">{s.intro}</p>}
            <div className="ref-grid">
              {s.items.map((item) => (
                <div key={item.title} className="ref-card">
                  <h3>{item.title}</h3>
                  <p>
                    <RichInline text={item.body} />
                  </p>
                  {item.code && (
                    <div className="ref-code">
                      <pre className="code">{item.code}</pre>
                      <button className="try-btn" onClick={() => openInSandbox(item.code!)}>
                        ▶ Попробовать
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}

        {terms.length > 0 && (
          <section id="glossary" className="ref-section">
            <h2>
              <span className="ref-icon">📖</span> Глоссарий терминов
            </h2>
            <dl className="glossary">
              {terms.map((t) => (
                <div key={t.term} className="term">
                  <dt>{t.term}</dt>
                  <dd>
                    <RichInline text={t.definition} />
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {!sections.length && !terms.length && <div className="empty">Ничего не найдено по запросу «{query}»</div>}
      </main>
    </div>
  );
}
