import { createClient, type Session } from '@supabase/supabase-js';
import { useSyncExternalStore } from 'react';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// PKCE возвращает ?code= в query, поэтому не конфликтует с hash-роутингом
export const supabase = url && anonKey ? createClient(url, anonKey, { auth: { flowType: 'pkce' } }) : null;
export const cloudEnabled = supabase !== null;

export type SyncState = 'off' | 'idle' | 'syncing' | 'error';

interface CloudState {
  session: Session | null;
  sync: SyncState;
}

let state: CloudState = { session: null, sync: 'off' };
const listeners = new Set<() => void>();

export function setCloudState(patch: Partial<CloudState>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

export function getSession() {
  return state.session;
}

export function useCloud(): CloudState {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => {
        listeners.delete(cb);
      };
    },
    () => state,
  );
}

const redirectTo = () => window.location.origin + window.location.pathname;

export async function signInWithEmail(email: string) {
  if (!supabase) throw new Error('Облачная синхронизация не настроена');
  const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo() } });
  if (error) throw error;
}

export async function signInWithGitHub() {
  if (!supabase) throw new Error('Облачная синхронизация не настроена');
  const { error } = await supabase.auth.signInWithOAuth({ provider: 'github', options: { redirectTo: redirectTo() } });
  if (error) throw error;
}

export async function signOut() {
  await supabase?.auth.signOut();
}
