import { setCloudState, supabase } from './supabase';
import { syncOnLogin } from '../store/progress';

export function initCloud() {
  if (!supabase) return;
  setCloudState({ sync: 'idle' });

  let syncedFor: string | null = null;
  supabase.auth.onAuthStateChange((_event, session) => {
    setCloudState({ session });
    if (new URLSearchParams(window.location.search).has('code')) {
      window.history.replaceState(null, '', window.location.pathname + window.location.hash);
    }
    const userId = session?.user.id ?? null;
    if (userId && userId !== syncedFor) {
      syncedFor = userId;
      // supabase-js не рекомендует вызывать свои методы синхронно внутри колбэка
      setTimeout(() => void syncOnLogin(userId), 0);
    }
    if (!userId) syncedFor = null;
  });
}
