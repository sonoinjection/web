/* ============================================================
   auth.js — Supabase Auth client for the admin browser
   Loads @supabase/supabase-js from esm.sh (no build step). The
   anon key and Supabase URL come from /api/auth-config so they
   don't have to be hardcoded in source. Magic-link only.
   ============================================================ */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

let _client = null;
let _configPromise = null;

async function loadConfig() {
  if (_configPromise) return _configPromise;
  _configPromise = (async () => {
    const res = await fetch('/api/auth-config', { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`auth-config failed (${res.status})`);
    return res.json();
  })();
  return _configPromise;
}

export async function getAuthClient() {
  if (_client) return _client;
  const { supabaseUrl, supabaseAnonKey } = await loadConfig();
  _client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'implicit',
    },
  });
  return _client;
}

export async function getSession() {
  const client = await getAuthClient();
  const { data } = await client.auth.getSession();
  return data.session || null;
}

export async function getAccessToken() {
  const session = await getSession();
  return session?.access_token || null;
}

export async function signInWithEmail(email, redirectTo) {
  const client = await getAuthClient();
  return client.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectTo,
      shouldCreateUser: true,
    },
  });
}

export async function signOut() {
  const client = await getAuthClient();
  await client.auth.signOut();
}

export async function onAuthStateChange(handler) {
  const client = await getAuthClient();
  const { data } = client.auth.onAuthStateChange((event, session) => {
    handler(event, session);
  });
  return data.subscription;
}
