/* ============================================================
   scripts/preview-application-email.js — trial helper for /api/apply

   Renders the combined application email exactly as the endpoint would,
   without touching the network. Use it to review copy and to check the
   early-bird boundary before and after the deadline.

   Render only (safe, sends nothing):
     node scripts/preview-application-email.js
     node scripts/preview-application-email.js --date 2026-11-20

   Actually send a copy (needs RESEND_API_KEY in the environment):
     node --env-file=.env.local scripts/preview-application-email.js \
       --send you@example.com
   ============================================================ */

import { renderApplicationEmail, sendEmail } from '../api/_emails.js';
import { getEvent } from '../api/_events.js';
import { ADMIN_REPLY_TO } from '../api/_shared.js';

const args = process.argv.slice(2);
const argOf = (name) => {
  const i = args.indexOf(name);
  return i === -1 ? null : args[i + 1];
};

const EVENT_ID = argOf('--event') || '2027-01-rmk-aimes';
const sendTo = argOf('--send');
const dateArg = argOf('--date');

const event = getEvent(EVENT_ID);
if (!event) {
  console.error(`Unknown event "${EVENT_ID}". Known: ${Object.keys(await import('../api/_events.js').then((m) => m.EVENTS)).join(', ')}`);
  process.exit(1);
}

// Anchored at noon so a bare --date lands unambiguously inside the day.
const submittedAt = dateArg ? new Date(`${dateArg}T12:00:00+03:00`) : new Date();

const data = {
  first_name: 'Ayşe',
  last_name: 'Yılmaz',
  email: sendTo || 'ayse@ornek.com',
  phone: '+90 532 000 00 00',
  specialty: 'Fiziksel Tıp ve Rehabilitasyon',
  position: 'uzman',
  institution: 'Örnek Üniversitesi',
  notes: null,
};

const { subject, text } = renderApplicationEmail({ data, event, submittedAt });

console.log(`Submitted at : ${submittedAt.toISOString()}`);
console.log(`To           : ${data.email}, ${ADMIN_REPLY_TO}`);
console.log(`Subject      : ${subject}`);
console.log('─'.repeat(60));
console.log(text);
console.log('─'.repeat(60));

if (!sendTo) {
  console.log('\nRender only — nothing was sent. Pass --send <address> to send.');
  process.exit(0);
}

const result = await sendEmail({
  to: [sendTo, ADMIN_REPLY_TO],
  replyTo: ADMIN_REPLY_TO,
  subject,
  text,
  context: 'email.application.preview',
});
console.log('\nsend result:', JSON.stringify(result));
if (!result.sent) process.exit(1);
