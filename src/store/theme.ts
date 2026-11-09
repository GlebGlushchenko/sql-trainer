import { useSyncExternalStore } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

const KEY = 'sql-lab.theme';
const media = window.matchMedia('(prefers-color-scheme: dark)');
const listeners = new Set<() => void>();

let mode: ThemeMode = (localStorage.getItem(KEY) as ThemeMode | null) ?? 'system';

const resolve = (): ResolvedTheme => (mode === 'system' ? (media.matches ? 'dark' : 'light') : mode);

let snapshot = { mode, resolved: resolve() };

function apply() {
  snapshot = { mode, resolved: resolve() };
  document.documentElement.dataset.theme = snapshot.resolved;
  listeners.forEach((l) => l());
}

media.addEventListener('change', () => mode === 'system' && apply());
apply();

export function setThemeMode(next: ThemeMode) {
  mode = next;
  localStorage.setItem(KEY, next);
  apply();
}

export function useTheme() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => {
        listeners.delete(cb);
      };
    },
    () => snapshot,
  );
}
