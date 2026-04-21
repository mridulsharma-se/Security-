import { createClient } from '@supabase/supabase-js';

let adminClient: ReturnType<typeof createClient> | null = null;

function getSupabaseAdmin() {
  if (!adminClient) {
    adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
  }
  return adminClient;
}

// Keep the old export for backwards compatibility
export const supabaseAdmin = new Proxy({} as any, {
  get: (_target, prop) => {
    return getSupabaseAdmin()[prop as keyof typeof adminClient];
  },
});
