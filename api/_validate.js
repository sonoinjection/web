/* ============================================================
   api/_validate.js — public application payload validation
   Shared by both pipelines so they can't drift apart:
     api/register.js — Supabase pipeline (DB is source of truth)
     api/apply.js    — email-only pipeline (email is the record)
   A trial only tells you something if both validate identically.
   ============================================================ */

import { trimmedString } from './_shared.js';

export const POSITION_VALUES = ['uzman', 'asistan'];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NOTES_MAX = 1000;
const SPECIALTY_MAX = 120;

export function validatePayload(body) {
  const errors = [];

  const requireText = (key) => {
    const v = trimmedString(body[key]);
    if (!v) errors.push(`${key} alanı zorunludur`);
    return v;
  };

  const first_name  = requireText('first_name');
  const last_name   = requireText('last_name');
  const email       = requireText('email');
  const phone       = requireText('phone');
  const institution = requireText('institution');
  const event_id    = requireText('event_id');
  const specialty   = trimmedString(body.specialty);
  const position    = trimmedString(body.position);

  if (email && !EMAIL_RE.test(email)) {
    errors.push('Geçerli bir e-posta adresi girin');
  }
  if (!specialty) {
    errors.push('Uzmanlık alanı zorunludur');
  } else if (specialty.length > SPECIALTY_MAX) {
    errors.push(`Uzmanlık en fazla ${SPECIALTY_MAX} karakter olabilir`);
  }
  if (!position || !POSITION_VALUES.includes(position)) {
    errors.push('Geçerli bir pozisyon değeri girin');
  }

  let notes = null;
  if (body.notes !== undefined && body.notes !== null && body.notes !== '') {
    if (typeof body.notes !== 'string') {
      errors.push('Notlar geçersiz');
    } else if (body.notes.length > NOTES_MAX) {
      errors.push(`Notlar en fazla ${NOTES_MAX} karakter olabilir`);
    } else {
      notes = body.notes.trim();
    }
  }

  if (errors.length > 0) return { ok: false, errors };

  return {
    ok: true,
    data: {
      first_name,
      last_name,
      email: email.toLowerCase(),
      phone,
      institution,
      event_id,
      specialty,
      position,
      notes,
    },
  };
}
