import { useEffect, useRef, useState } from 'react';
import { cloudEnabled, signInWithEmail, signInWithGitHub, signOut, useCloud } from '../cloud/supabase';

const SYNC_LABEL = {
  off: '',
  idle: '☁ Синхронизировано',
  syncing: '⟳ Синхронизация…',
  error: '⚠ Ошибка синхронизации',
} as const;

export function AuthButton() {
  const { session, sync } = useCloud();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menu) return;
    const close = (e: MouseEvent) => !menuRef.current?.contains(e.target as Node) && setMenu(false);
    window.addEventListener('mousedown', close);
    return () => window.removeEventListener('mousedown', close);
  }, [menu]);

  if (!cloudEnabled) return null;

  if (session) {
    const user = session.user;
    const name = (user.user_metadata?.user_name as string) || user.email || 'Аккаунт';
    const avatar = user.user_metadata?.avatar_url as string | undefined;
    return (
      <div className="account" ref={menuRef}>
        <span className={`sync-state ${sync}`}>{SYNC_LABEL[sync]}</span>
        <button className="avatar-btn" onClick={() => setMenu((m) => !m)} title={name}>
          {avatar ? <img src={avatar} alt="" /> : <span>{name[0]?.toUpperCase()}</span>}
        </button>
        {menu && (
          <div className="account-menu">
            <div className="account-name">{name}</div>
            <div className="muted small">Прогресс сохраняется в облаке и доступен на любом устройстве.</div>
            <button className="btn ghost sm" onClick={() => void signOut().then(() => setMenu(false))}>
              Выйти
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <button className="btn ghost sm" onClick={() => setOpen(true)}>
        Войти
      </button>
      {open && <LoginModal onClose={() => setOpen(false)} />}
    </>
  );
}

function LoginModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const sendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signInWithEmail(email.trim());
      setSent(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const github = async () => {
    setError(null);
    try {
      await signInWithGitHub();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <h2>Вход в SQL Lab</h2>
        <p className="muted">Войдите, чтобы прогресс и черновики синхронизировались между устройствами. Текущий прогресс из браузера сохранится.</p>

        <button className="btn github" onClick={github}>
          <svg viewBox="0 0 16 16" width="18" height="18" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          Войти через GitHub
        </button>

        <div className="or">
          <span>или по email</span>
        </div>

        {sent ? (
          <div className="sent">
            ✉ Ссылка для входа отправлена на <b>{email}</b>. Откройте письмо в этом же браузере.
          </div>
        ) : (
          <form onSubmit={sendLink} className="email-form">
            <input type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button className="btn submit" disabled={busy}>
              {busy ? 'Отправка…' : 'Получить ссылку'}
            </button>
          </form>
        )}
        {error && <div className="error-box">{error}</div>}
      </div>
    </div>
  );
}
