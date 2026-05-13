/* ============================================================
   GET /api/admin/list-events
   Returns events sorted by event_date desc, each augmented with
   per-status counts derived from the registrations table.
   ============================================================ */

import {
  getSupabase,
  jsonError,
  requireMethod,
  requireAdmin,
  logServerError,
  ConfigError,
} from '../_shared.js';

export default async function handler(req, res) {
  if (!requireMethod(req, res, 'GET')) return;
  const adminEmail = await requireAdmin(req, res);
  if (!adminEmail) return;

  let supabase;
  try {
    supabase = getSupabase();
  } catch (err) {
    if (err instanceof ConfigError) {
      logServerError('config', err);
      return jsonError(res, 500, 'CONFIG_ERROR', 'Sunucu yapılandırma hatası.');
    }
    throw err;
  }

  const { data: events, error: eventsErr } = await supabase
    .from('events')
    .select(
      'id, title_tr, description_tr, event_date, location_tr, capacity, reserved_for_external, price_net_try, kdv_rate, price_gross_try, bank_details_tr, is_active, created_at',
    )
    .order('event_date', { ascending: false });

  if (eventsErr) {
    logServerError('events.list', eventsErr);
    return jsonError(res, 500, 'EVENTS_LIST_FAILED', 'Etkinlikler alınamadı.');
  }

  if (!events || events.length === 0) {
    return res.status(200).json({ events: [] });
  }

  // Aggregate counts in a single query.
  const { data: regs, error: regsErr } = await supabase
    .from('registrations')
    .select('event_id, status');

  if (regsErr) {
    logServerError('registrations.aggregate', regsErr);
    return jsonError(res, 500, 'REGISTRATIONS_AGGREGATE_FAILED', 'Sayım yapılamadı.');
  }

  const tally = new Map();
  for (const r of regs || []) {
    const t = tally.get(r.event_id) || {
      applied: 0,
      paid: 0,
      cancelled: 0,
      refunded: 0,
      total: 0,
    };
    if (Object.prototype.hasOwnProperty.call(t, r.status)) t[r.status] += 1;
    t.total += 1;
    tally.set(r.event_id, t);
  }

  const enriched = events.map((e) => {
    const t = tally.get(e.id) || { applied: 0, paid: 0, cancelled: 0, refunded: 0, total: 0 };
    return {
      ...e,
      counts: {
        applied: t.applied,
        paid: t.paid,
        cancelled: t.cancelled,
        refunded: t.refunded,
        active_count: t.applied + t.paid,
        cancelled_count: t.cancelled,
        refunded_count: t.refunded,
        total_count: t.total,
      },
    };
  });

  return res.status(200).json({ events: enriched });
}
