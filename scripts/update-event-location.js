/* ============================================================
   scripts/update-event-location.js — one-off
   Fix the seeded RMK AIMES event row's location_tr (was
   "Tıp Fakültesi Kampüsü", should be "Hastanesi").
   Run: node --env-file=.env.local scripts/update-event-location.js
   ============================================================ */

import { createClient } from '@supabase/supabase-js';

const EVENT_ID = '65675693-d721-47bf-b78d-244db4f3d77e';
const NEW_LOCATION = 'RMK AIMES — Koç Üniversitesi Hastanesi, Davutpaşa Cd. No:4, Zeytinburnu/İstanbul 34010';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } },
);

const { data, error } = await supabase
  .from('events')
  .update({ location_tr: NEW_LOCATION })
  .eq('id', EVENT_ID)
  .select('id, location_tr')
  .single();

console.log('error:', error);
console.log('data :', JSON.stringify(data, null, 2));
