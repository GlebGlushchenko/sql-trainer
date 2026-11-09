import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { ProblemList } from './components/ProblemList';
import { ProblemView } from './components/ProblemView';
import { Reference } from './components/Reference';
import { Sandbox } from './components/Sandbox';
import { getProblem } from './data/problems';
import { loadSql } from './db/engine';
import { useRoute } from './router';

export default function App() {
  const route = useRoute();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSql()
      .then(() => setReady(true))
      .catch((e: Error) => setError(e.message));
  }, []);

  let content;
  if (error) content = <div className="splash">Не удалось загрузить SQLite: {error}</div>;
  else if (!ready) content = <div className="splash"><span className="spinner big" /> Загрузка движка SQLite…</div>;
  else if (route.page === 'problem') {
    const problem = getProblem(route.id);
    content = problem ? <ProblemView key={problem.id} problem={problem} /> : <div className="splash">Задача не найдена</div>;
  } else if (route.page === 'reference') content = <Reference />;
  else if (route.page === 'sandbox') content = <Sandbox />;
  else content = <ProblemList />;

  return (
    <div className="app">
      <Header route={route} />
      {content}
    </div>
  );
}
