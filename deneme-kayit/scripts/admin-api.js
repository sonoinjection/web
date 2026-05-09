/* ============================================================
   admin-api.js — thin fetch() wrappers around the 7 admin routes
   Centralizes URL strings and error parsing so admin.js stays
   focused on state + render logic.
   ============================================================ */

async function request(url, { method = 'GET', body = null } = {}) {
  const init = { method, headers: { Accept: 'application/json' } };
  if (body !== null && body !== undefined) {
    init.headers['Content-Type'] = 'application/json';
    init.body = JSON.stringify(body);
  }

  const res = await fetch(url, init);
  const text = await res.text();
  let payload = null;
  if (text) {
    try { payload = JSON.parse(text); }
    catch { /* non-JSON body */ }
  }

  if (!res.ok) {
    const message = (payload && typeof payload.error === 'string')
      ? payload.error
      : `İstek başarısız oldu (${res.status}).`;
    const error = new Error(message);
    error.code = payload?.code || `HTTP_${res.status}`;
    error.status = res.status;
    error.details = payload?.details;
    throw error;
  }

  return payload || {};
}

export const adminApi = {
  listEvents()                          { return request('/api/admin/list-events'); },
  listRegistrations(event_id)           { return request(`/api/admin/list-registrations?event_id=${encodeURIComponent(event_id)}`); },
  getRegistration(id)                   { return request(`/api/admin/get-registration?id=${encodeURIComponent(id)}`); },
  updateStatus(payload)                 { return request('/api/admin/update-status',         { method: 'POST', body: payload }); },
  updateRegistration(payload)           { return request('/api/admin/update-registration',   { method: 'POST', body: payload }); },
  updateEvent(payload)                  { return request('/api/admin/update-event',          { method: 'POST', body: payload }); },
  addLogEntry(payload)                  { return request('/api/admin/add-log-entry',         { method: 'POST', body: payload }); },
};
