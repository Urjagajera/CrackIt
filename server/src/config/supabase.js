import { createClient } from "@supabase/supabase-js";
import { env } from "./env.js";

/**
 * Public (anon) client — passes through the user's JWT and respects RLS.
 * Use this for every request made on behalf of an authenticated user.
 */
export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

/**
 * Admin (service-role) client — bypasses RLS entirely.
 * Use ONLY for server-side operations that must ignore row-level security
 * (e.g., cron jobs, admin endpoints, background tasks).
 *
 * ⚠️  NEVER expose this client to user-facing code paths.
 */
export const supabaseAdmin = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);
