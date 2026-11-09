import { setThemeMode, useTheme, type ThemeMode } from '../store/theme';

const OPTIONS: { mode: ThemeMode; icon: string; label: string }[] = [
  { mode: 'light', icon: '☀', label: 'Светлая тема' },
  { mode: 'dark', icon: '☾', label: 'Тёмная тема' },
  { mode: 'system', icon: '🖥', label: 'Как в системе' },
];

export function ThemeSwitch() {
  const { mode } = useTheme();
  return (
    <div className="theme-switch" role="radiogroup" aria-label="Тема оформления">
      {OPTIONS.map((o) => (
        <button
          key={o.mode}
          role="radio"
          aria-checked={mode === o.mode}
          className={mode === o.mode ? 'active' : ''}
          title={o.label}
          onClick={() => setThemeMode(o.mode)}
        >
          {o.icon}
        </button>
      ))}
    </div>
  );
}
