/* ============================================================
   api/admin/_transitions.js — registration status state machine
   Status enum: applied | paid | cancelled | refunded.
   Mirrored client-side in deneme-kayit/scripts/shared.js
   (STATUS_LABELS_TR) — keep in sync.
   ============================================================ */

export const STATUS_VALUES = ['applied', 'paid', 'cancelled', 'refunded'];

export const STATUS_LABELS_TR = {
  applied: 'Başvurdu',
  paid: 'Ödendi',
  cancelled: 'İptal',
  refunded: 'İade',
};

// Object map: old → Set of allowed new statuses.
export const ALLOWED_TRANSITIONS = {
  applied:   new Set(['paid', 'cancelled']),
  paid:      new Set(['cancelled', 'refunded']),
  cancelled: new Set(['applied']),
  refunded:  new Set(['paid']),
};

// Action label per (old, new). Used in UI buttons + log messages.
export const TRANSITION_ACTION_LABELS_TR = {
  'applied→paid':       'Ödeme Onayla',
  'applied→cancelled':  'İptal Et',
  'paid→cancelled':     'İptal Et',
  'paid→refunded':      'İade Et',
  'cancelled→applied':  'Yeniden Aktive Et',
  'refunded→paid':      'Yeniden Aktive Et',
};

// Email triggered by each transition (key by `${old}→${new}`); null if none.
//   email_3 — payment confirmation (always; no opt-out)
//   email_5 — cancellation notice (opt-in via send_email flag)
//   email_6 — refund notice       (opt-in via send_email flag)
//   null    — silent transition (reactivations)
export const TRANSITION_EMAIL = {
  'applied→paid':      'email_3',
  'applied→cancelled': 'email_5',
  'paid→cancelled':    'email_5',
  'paid→refunded':     'email_6',
  'cancelled→applied': null,
  'refunded→paid':     null,
};

export function validateTransition(oldStatus, newStatus) {
  if (!STATUS_VALUES.includes(oldStatus)) {
    return { ok: false, reason: `Geçersiz mevcut durum: ${oldStatus}` };
  }
  if (!STATUS_VALUES.includes(newStatus)) {
    return { ok: false, reason: `Geçersiz hedef durum: ${newStatus}` };
  }
  if (oldStatus === newStatus) {
    return { ok: false, reason: 'Durum zaten aynı.' };
  }
  const allowed = ALLOWED_TRANSITIONS[oldStatus];
  if (!allowed || !allowed.has(newStatus)) {
    return {
      ok: false,
      reason: `İzin verilmeyen durum geçişi: ${STATUS_LABELS_TR[oldStatus]} → ${STATUS_LABELS_TR[newStatus]}`,
    };
  }
  return { ok: true };
}

export function transitionKey(oldStatus, newStatus) {
  return `${oldStatus}→${newStatus}`;
}

export function transitionEmailType(oldStatus, newStatus) {
  return TRANSITION_EMAIL[transitionKey(oldStatus, newStatus)] || null;
}

export function transitionActionLabel(oldStatus, newStatus) {
  return TRANSITION_ACTION_LABELS_TR[transitionKey(oldStatus, newStatus)] || null;
}

// Build a Turkish status_change log message:
// "Durum değişti: Başvurdu → Ödendi"
export function statusChangeMessageTr(oldStatus, newStatus) {
  const o = STATUS_LABELS_TR[oldStatus] || oldStatus;
  const n = STATUS_LABELS_TR[newStatus] || newStatus;
  return `Durum değişti: ${o} → ${n}`;
}
