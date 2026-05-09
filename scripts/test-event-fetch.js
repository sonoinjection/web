/* ============================================================
   scripts/test-event-fetch.js — diagnostic for /api/register
   Runs the same Supabase query the function does, in isolation,
   and prints the raw data and error verbatim.
   Usage:
     node --env-file=.env.local scripts/test-event-fetch.js
   ============================================================ */

import { createClient } from '@supabase/supabase-js';

const EVENT_ID = 'a0ffd6f9-a96b-4d2f-ba01-e7d0f38b09c4';

function maskKey(key) {
  if (!key) return '<MISSING>';
  if (key.length < 12) return '<TOO_SHORT>';
  return `${key.slice(0, 4)}…${key.slice(-4)} (len=${key.length})`;
}

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('━━━ env ━━━');
console.log('SUPABASE_URL              :', SUPABASE_URL || '<MISSING>');
console.log('SUPABASE_SERVICE_ROLE_KEY :', maskKey(SUPABASE_SERVICE_ROLE_KEY));
console.log('EVENT_ID                  :', EVENT_ID);
console.log('');

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing env vars. Did you run `vercel env pull .env.local`?');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

console.log('━━━ select id, title_tr, is_active ━━━');
{
  const result = await supabase
    .from('events')
    .select('id, title_tr, is_active')
    .eq('id', EVENT_ID)
    .maybeSingle();

  console.log('data  :', JSON.stringify(result.data, null, 2));
  console.log('error :', JSON.stringify(result.error, Object.getOwnPropertyNames(result.error || {}), 2));
  console.log('status:', result.status, result.statusText);
  console.log('');
}

console.log('━━━ select * (full row, what the API actually fetches) ━━━');
{
  const result = await supabase
    .from('events')
    .select(
      'id, title_tr, event_date, location_tr, capacity, reserved_for_external, price_net_try, kdv_rate, price_gross_try, bank_details_tr, is_active',
    )
    .eq('id', EVENT_ID)
    .maybeSingle();

  console.log('data  :', JSON.stringify(result.data, null, 2));
  console.log('error :', JSON.stringify(result.error, Object.getOwnPropertyNames(result.error || {}), 2));
  console.log('status:', result.status, result.statusText);
  console.log('');
}

console.log('━━━ list any rows in events (sanity) ━━━');
{
  const result = await supabase
    .from('events')
    .select('id, title_tr, is_active')
    .limit(5);

  console.log('count :', result.data?.length ?? '<null>');
  console.log('data  :', JSON.stringify(result.data, null, 2));
  console.log('error :', JSON.stringify(result.error, Object.getOwnPropertyNames(result.error || {}), 2));
  console.log('status:', result.status, result.statusText);
}
