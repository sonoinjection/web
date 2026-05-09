/* ============================================================
   api/_log.js — registration_log writers
   See CLAUDE.md §8 for the table schema. Entry types:
     status_change | admin_note | contact | email_sent | system
   ============================================================ */

import { logServerError } from './_shared.js';

export async function writeLog(supabase, {
  registration_id,
  entry_type,
  message,
  metadata = null,
  created_by,
}) {
  const { data, error } = await supabase
    .from('registration_log')
    .insert({
      registration_id,
      entry_type,
      message: message ?? null,
      metadata,
      created_by,
    })
    .select('*')
    .single();

  if (error) {
    logServerError('registration_log.insert', error, {
      registration_id,
      entry_type,
    });
    return { entry: null, error };
  }
  return { entry: data, error: null };
}

export function writeStatusChangeLog(supabase, {
  registration_id,
  old_status,
  new_status,
  message,
  reason = null,
  payment_reference = null,
  refund_amount = null,
  informed_confirmed = null,
  refund_completed_confirmed = null,
  sent_email = false,
  created_by,
}) {
  const metadata = {
    old_status,
    new_status,
  };
  if (reason !== null && reason !== '') metadata.reason = reason;
  if (payment_reference !== null && payment_reference !== '') metadata.payment_reference = payment_reference;
  if (refund_amount !== null && refund_amount !== '' && !Number.isNaN(Number(refund_amount))) {
    metadata.refund_amount = Number(refund_amount);
  }
  if (typeof informed_confirmed === 'boolean') metadata.informed_confirmed = informed_confirmed;
  if (typeof refund_completed_confirmed === 'boolean') metadata.refund_completed_confirmed = refund_completed_confirmed;
  metadata.sent_email = !!sent_email;

  return writeLog(supabase, {
    registration_id,
    entry_type: 'status_change',
    message,
    metadata,
    created_by,
  });
}

export function writeEmailSentLog(supabase, {
  registration_id,
  email_type,
  to_address,
  message,
}) {
  return writeLog(supabase, {
    registration_id,
    entry_type: 'email_sent',
    message,
    metadata: { email_type, to_address },
    created_by: 'system',
  });
}

export function writeAdminNoteLog(supabase, {
  registration_id,
  message,
  created_by,
}) {
  return writeLog(supabase, {
    registration_id,
    entry_type: 'admin_note',
    message,
    metadata: null,
    created_by,
  });
}

export function writeContactLog(supabase, {
  registration_id,
  contact_method,
  message,
  created_by,
}) {
  return writeLog(supabase, {
    registration_id,
    entry_type: 'contact',
    message,
    metadata: { contact_method },
    created_by,
  });
}

export function writeFieldChangeLog(supabase, {
  registration_id,
  field,
  old_value,
  new_value,
  created_by,
}) {
  return writeLog(supabase, {
    registration_id,
    entry_type: 'admin_note',
    message: `Alan güncellendi: ${field}`,
    metadata: {
      kind: 'field_change',
      field,
      old_value,
      new_value,
    },
    created_by,
  });
}
