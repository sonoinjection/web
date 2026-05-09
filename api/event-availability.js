/* ============================================================
   GET /api/event-availability?id=<uuid>
   Public, read-only. Returns capacity vs. active-registration counts
   so course-detail pages can show real-time "X kontenjan kaldı"
   badges without exposing PII.

   No auth required. Returns nothing about specific registrations,
   only aggregate counts.
   ============================================================ */

import {
  getSupabase,
  jsonError,
  requireMethod,
  trimmedString,
  logServerError,
  ConfigError,
} from './_shared.js';

export default async function handler(req, res) {
  if (!requireMethod(req, res, 'GET')) return;

  const id = trimmedString(req.query?.id);
  if (!id) {
    return jsonError(res, 400, 'MISSING_ID', 'id parametresi zorunludur.');
  }

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

  const { data: event, error: evErr } = await supabase
    .from('events')
    .select('id, capacity, reserved_for_external, is_active')
    .eq('id', id)
    .maybeSingle();

  if (evErr) {
    logServerError('event_availability.event_fetch', evErr, { id });
    return jsonError(res, 500, 'EVENT_FETCH_FAILED', 'Etkinlik bilgisi alınamadı.');
  }
  if (!event) {
    return jsonError(res, 404, 'EVENT_NOT_FOUND', 'Etkinlik bulunamadı.');
  }

  const { count, error: countErr } = await supabase
    .from('registrations')
    .select('id', { count: 'exact', head: true })
    .eq('event_id', id)
    .in('status', ['applied', 'paid']);

  if (countErr) {
    logServerError('event_availability.count', countErr, { id });
    return jsonError(res, 500, 'COUNT_FAILED', 'Sayım yapılamadı.');
  }

  const active_count = count ?? 0;
  const reserved = Number(event.reserved_for_external) || 0;
  const capacity = event.capacity ?? null;

  let effective_capacity = null;
  let available = null;
  if (capacity !== null && capacity !== undefined) {
    effective_capacity = Number(capacity) - reserved;
    available = Math.max(0, effective_capacity - active_count);
  }

  // Short-lived edge cache so admin status changes propagate within
  // 10 seconds without hammering the DB on every page load.
  res.setHeader('Cache-Control', 'public, max-age=10, s-maxage=10, stale-while-revalidate=30');

  return res.status(200).json({
    event_id: event.id,
    is_active: event.is_active,
    capacity,
    reserved_for_external: reserved,
    effective_capacity,
    active_count,
    available,
  });
}
