/* ============================================================
   scripts/test-register-insert.js — diagnostic for INSERT_FAILED
   Reproduces the same insert payload api/register.js sends. Uses a
   unique synthetic email to avoid duplicate conflicts. Cleans up
   the row on success so this script is safe to re-run.
   Usage:
     node --env-file=.env.local scripts/test-register-insert.js
   ============================================================ */

import { createClient } from '@supabase/supabase-js';

const EVENT_ID = 'a0ffd6f9-a96b-4d2f-ba01-e7d0f38b09c4';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing env vars — check .env.local.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

function dump(label, result) {
  console.log(`━━━ ${label} ━━━`);
  console.log('data  :', JSON.stringify(result.data, null, 2));
  console.log('error :', JSON.stringify(result.error, Object.getOwnPropertyNames(result.error || {}), 2));
  console.log('status:', result.status, result.statusText);
  console.log('');
}

const syntheticEmail = `diagnostic+${Date.now()}@sonoinjection.invalid`;

const insertPayload = {
  event_id: EVENT_ID,
  first_name: 'Diagnostic',
  last_name: 'Tester',
  email: syntheticEmail,
  phone: '+90 555 000 00 00',
  specialty: 'ftr',
  position: 'uzman',
  institution: 'SonoInjection Diagnostic',
  notes: 'inserted by scripts/test-register-insert.js',
  status: 'pending',
};

console.log('Insert payload:');
console.log(JSON.stringify(insertPayload, null, 2));
console.log('');

const insertResult = await supabase
  .from('registrations')
  .insert(insertPayload)
  .select('id, registered_at, expires_at')
  .single();

dump('insert', insertResult);

if (insertResult.error) {
  console.log('Insert failed. Trying again with expires_at set explicitly…');
  console.log('');
  const fallbackPayload = {
    ...insertPayload,
    email: `diagnostic+${Date.now()}-fallback@sonoinjection.invalid`,
    // Far-future stub to satisfy any NOT NULL constraint that's still in place.
    expires_at: '9999-12-31T23:59:59Z',
  };
  const fallbackResult = await supabase
    .from('registrations')
    .insert(fallbackPayload)
    .select('id, registered_at, expires_at')
    .single();
  dump('insert with explicit expires_at', fallbackResult);
  if (fallbackResult.data?.id) {
    const cleanup = await supabase
      .from('registrations')
      .delete()
      .eq('id', fallbackResult.data.id);
    dump('cleanup (fallback)', cleanup);
  }
  process.exit(fallbackResult.error ? 1 : 0);
}

if (insertResult.data?.id) {
  const cleanup = await supabase
    .from('registrations')
    .delete()
    .eq('id', insertResult.data.id);
  dump('cleanup', cleanup);
}
