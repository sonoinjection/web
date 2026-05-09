/* ============================================================
   scripts/update-bank-details.js — one-off
   Sets bank_details_tr on the seeded RMK AIMES event row.
   Run: node --env-file=.env.local scripts/update-bank-details.js
   ============================================================ */

import { createClient } from '@supabase/supabase-js';

const EVENT_ID = '65675693-d721-47bf-b78d-244db4f3d77e';
const BANK_DETAILS_TR = `Banka: Garanti BBVA Bankası
IBAN: TR10 0006 2000 1700 0006 2878 13`;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } },
);

const { data, error } = await supabase
  .from('events')
  .update({ bank_details_tr: BANK_DETAILS_TR })
  .eq('id', EVENT_ID)
  .select('id, bank_details_tr')
  .single();

console.log('error:', error);
console.log('data :', JSON.stringify(data, null, 2));
