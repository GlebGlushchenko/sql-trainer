import { useSyncExternalStore } from 'react';

export type Route =
  | { page: 'problems' }
  | { page: 'problem'; id: number }
  | { page: 'reference' }
  | { page: 'sandbox' };

function parse(hash: string): Route {
  const parts = hash.replace(/^#\/?/, '').split('/');
  if (parts[0] === 'problem' && Number(parts[1])) return { page: 'problem', id: Number(parts[1]) };
  if (parts[0] === 'reference') return { page: 'reference' };
  if (parts[0] === 'sandbox') return { page: 'sandbox' };
  return { page: 'problems' };
}

const subscribe = (cb: () => void) => {
  window.addEventListener('hashchange', cb);
  return () => window.removeEventListener('hashchange', cb);
};

export function useRoute(): Route {
  const hash = useSyncExternalStore(subscribe, () => window.location.hash);
  return parse(hash);
}

export function navigate(path: string) {
  window.location.hash = path;
}

const SANDBOX_KEY = 'sql-lab.sandbox';

export function openInSandbox(code: string) {
  localStorage.setItem(SANDBOX_KEY, code);
  navigate('/sandbox');
}

export function getSandboxCode(): string {
  return localStorage.getItem(SANDBOX_KEY) ?? 'SELECT * FROM employees LIMIT 10;';
}

export function setSandboxCode(code: string) {
  localStorage.setItem(SANDBOX_KEY, code);
}
