import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env };
  // Интеграция Supabase в Vercel создаёт переменные без префикса VITE_
  const pick = (...names: string[]) => names.map((n) => env[n]).find(Boolean) ?? '';

  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(
        pick('VITE_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_URL'),
      ),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(
        pick(
          'VITE_SUPABASE_ANON_KEY',
          'NEXT_PUBLIC_SUPABASE_ANON_KEY',
          'SUPABASE_ANON_KEY',
          'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
          'SUPABASE_PUBLISHABLE_KEY',
        ),
      ),
    },
  };
});
