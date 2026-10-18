import { createClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client. Uses the service_role key, which bypasses
 * Row Level Security — this file must NEVER be imported into client
 * components ("use client") or exposed via NEXT_PUBLIC_ env vars.
 */
export function getSupabaseServerClient() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
