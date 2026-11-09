import type { Route } from '../router';
import { PROBLEMS } from '../data/problems';
import { useProgress } from '../store/progress';
import { AuthButton } from './AuthButton';
import { ThemeSwitch } from './ThemeSwitch';

const NAV = [
  { page: 'problems', label: 'Задачи', href: '#/problems' },
  { page: 'reference', label: 'Справочник', href: '#/reference' },
  { page: 'sandbox', label: 'Песочница', href: '#/sandbox' },
] as const;

export function Header({ route }: { route: Route }) {
  const progress = useProgress();
  const solved = PROBLEMS.filter((p) => progress[p.id]?.status === 'solved').length;
  const active = route.page === 'problem' ? 'problems' : route.page;

  return (
    <header className="header">
      <a className="logo" href="#/problems">
        <span className="logo-mark">&lt;/&gt;</span>
        SQL<span className="accent">Lab</span>
      </a>
      <nav className="nav">
        {NAV.map((n) => (
          <a key={n.page} href={n.href} className={active === n.page ? 'active' : ''}>
            {n.label}
          </a>
        ))}
      </nav>
      <div className="header-right">
        <div className="header-progress" title="Решено задач">
          <span className="fire">🔥</span>
          <b>{solved}</b>
          <span className="muted">/ {PROBLEMS.length}</span>
        </div>
        <ThemeSwitch />
        <AuthButton />
      </div>
    </header>
  );
}
