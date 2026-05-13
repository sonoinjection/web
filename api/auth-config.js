/* ============================================================
   GET /api/auth-config
   Returns the public Supabase URL + anon (publishable) key so the
   admin browser can construct a Supabase Auth client without
   hardcoding values in the static HTML. The anon key is designed
   to be served to every visitor; access control happens via JWT
   validation on the admin routes (see requireAdmin in _shared.js).
   ============================================================ */

import { jsonError, requireMethod } from './_shared.js';

export default async function handler(req, res) {
  if (!requireMethod(req, res, 'GET')) return;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return jsonError(res, 500, 'CONFIG_ERROR', 'Auth yapılandırması eksik.');
  }

  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
  return res.status(200).json({ supabaseUrl, supabaseAnonKey });
}
