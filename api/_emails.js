/* ============================================================
   api/_emails.js — email templates + send orchestrator
   Email 1: registration received (registrant)
   Email 2: admin notification (kayit@)
   Email 3: payment confirmation (registrant) — applied → paid
   Email 4: pre-course reminder (registrant) — cron, future session
   Email 5: cancellation notice (registrant, opt-in)
   Email 6: refund notice (registrant, opt-in)
   ============================================================ */

import {
  ADMIN_FROM_EMAIL,
  ADMIN_REPLY_TO,
  ADMIN_PANEL_URL,
  formatEventDateTr,
  formatRegisteredAtCet,
  formatEventDateEn,
  formatTRY,
  formatTRYEn,
  getResend,
  istanbulDateKey,
  REGISTRATION_CONTACT,
  logServerError,
} from './_shared.js';

const SPECIALTY_LABELS = {
  ftr: 'Fiziksel Tıp ve Rehabilitasyon',
  ortopedi: 'Ortopedi ve Travmatoloji',
  romatoloji: 'Romatoloji',
  spor_hekimligi: 'Spor Hekimliği',
  algoloji: 'Algoloji',
  diger: 'Diğer',
};

const POSITION_LABELS = {
  uzman: 'Uzman',
  asistan: 'Asistan',
};

// ── Pricing tiers ───────────────────────────────────────────────────
// An event may carry an early-bird price alongside the standard one. Both
// tiers are always shown to the applicant; which one they owe is decided
// by the Istanbul calendar date of their application, and the deadline
// day itself still counts as early bird.
function resolvePricing(event, registeredAt) {
  if (event.price_net_try === null || event.price_net_try === undefined) return null;

  const deadline = event.early_bird_deadline
    ? String(event.early_bird_deadline).slice(0, 10)
    : null;
  const hasEarlyBird =
    deadline !== null &&
    event.early_bird_price_net_try !== null &&
    event.early_bird_price_net_try !== undefined;

  const early = hasEarlyBird
    ? { key: 'early', net: event.early_bird_price_net_try, gross: event.early_bird_price_gross_try }
    : null;
  const standard = { key: 'standard', net: event.price_net_try, gross: event.price_gross_try };

  const withinEarlyBird =
    hasEarlyBird && istanbulDateKey(registeredAt) <= deadline;

  return {
    tiers: hasEarlyBird ? [early, standard] : [standard],
    hasEarlyBird,
    deadline,
    applicable: withinEarlyBird ? early : standard,
  };
}

// ── Email 1: applicant on initial application ───────────────────────
// Sent bilingually as one message: Turkish first, then English. Bank
// details are deliberately NOT included — the applicant replies to
// confirm, and the team sends account details in that reply.
const EMAIL1_COPY = {
  tr: {
    money: formatTRY,
    date: formatEventDateTr,
    greeting: (name) => `Sayın ${name},`,
    received: (title) => `${title} için başvurunuz alındı.`,
    dateLine: (d) => `Tarih: ${d}`,
    venueLine: (v) => `Yer: ${v}`,
    feeHeading: 'KURS ÜCRETİ',
    tierHeading: {
      early: (d) => `Erken Kayıt (${formatEventDateTr(d)} tarihine kadar):`,
      standard: (d) => `Standart Kayıt (${formatEventDateTr(d)} sonrası):`,
    },
    tierName: { early: 'Erken Kayıt', standard: 'Standart Kayıt' },
    netLine: (v) => `  KDV Hariç: ${v}`,
    kdvLine: (rate, v) => `  KDV (%${rate}): ${v}`,
    grossLine: (v) => `  Toplam (KDV Dahil): ${v}`,
    singleNet: (v) => `Kurs Ücreti (KDV Hariç): ${v}`,
    singleKdv: (rate, v) => `KDV (%${rate}): ${v}`,
    singleGross: (v) => `Toplam (KDV Dahil): ${v}`,
    applicable: (name, amount) => [
      'Başvuru tarihiniz itibarıyla geçerli ücret:',
      `${name} — ${amount} (KDV Dahil)`,
    ],
    reply:
      'Koşullar sizin için uygunsa, bu e-postayı kısaca yanıtlamanız yeterlidir; banka bilgilerini tarafınıza ileteceğiz.',
    receipt: (email) =>
      `Havaleniz sonrasında dekontunuzu ${email} adresine ilettiğinizde, ödemeniz onaylandıktan sonra teyit e-postası göndereceğiz.`,
    noPrice: 'Kurs ücreti ve sonraki adımlar en kısa sürede tarafınıza iletilecektir.',
    questions: (email) => `Sorularınız için: ${email}`,
    contact: (c) => `Kayıt sorumlusu: ${c}`,
    signoff: ['Saygılarımızla,', 'SonoInjection Ekibi'],
  },
  en: {
    money: formatTRYEn,
    date: formatEventDateEn,
    greeting: (name) => `Dear ${name},`,
    received: (title) => `Your application for the ${title} has been received.`,
    dateLine: (d) => `Date: ${d}`,
    venueLine: (v) => `Venue: ${v}`,
    feeHeading: 'COURSE FEE',
    tierHeading: {
      early: (d) => `Early registration (until ${formatEventDateEn(d)}):`,
      standard: (d) => `Standard registration (from ${formatEventDateEn(d)}):`,
    },
    tierName: { early: 'Early registration', standard: 'Standard registration' },
    netLine: (v) => `  Excl. VAT: ${v}`,
    kdvLine: (rate, v) => `  VAT (${rate}%): ${v}`,
    grossLine: (v) => `  Total (incl. VAT): ${v}`,
    singleNet: (v) => `Course fee (excl. VAT): ${v}`,
    singleKdv: (rate, v) => `VAT (${rate}%): ${v}`,
    singleGross: (v) => `Total (incl. VAT): ${v}`,
    applicable: (name, amount) => [
      'Applicable to your application date:',
      `${name} — ${amount} (incl. VAT)`,
    ],
    reply:
      'If these terms suit you, a brief reply to this email is all we need — we will send you the bank details.',
    receipt: (email) =>
      `After your transfer, send the receipt to ${email} and we will confirm your payment by email.`,
    noPrice: 'The course fee and next steps will be sent to you shortly.',
    questions: (email) => `Questions: ${email}`,
    contact: (c) => `Registration contact: ${c}`,
    signoff: ['Kind regards,', 'SonoInjection Team'],
  },
};

function renderEmail1Body(copy, { fullName, event, pricing }) {
  const lines = [];
  lines.push(copy.greeting(fullName));
  lines.push('');
  lines.push(copy.received(event.title_tr));
  lines.push('');
  lines.push(copy.dateLine(copy.date(event.event_date)));
  lines.push(copy.venueLine(event.location_tr));
  lines.push('');

  if (pricing) {
    const kdvRateInt = Math.round(Number(event.kdv_rate));

    if (pricing.hasEarlyBird) {
      // Both tiers are listed so the applicant can see what they saved —
      // or what they would have saved by applying earlier.
      lines.push(copy.feeHeading);
      lines.push('');
      for (const tier of pricing.tiers) {
        lines.push(copy.tierHeading[tier.key](pricing.deadline));
        lines.push(copy.netLine(copy.money(tier.net)));
        lines.push(copy.kdvLine(kdvRateInt, copy.money(Number(tier.gross) - Number(tier.net))));
        lines.push(copy.grossLine(copy.money(tier.gross)));
        lines.push('');
      }
      lines.push(
        ...copy.applicable(
          copy.tierName[pricing.applicable.key],
          copy.money(pricing.applicable.gross),
        ),
      );
    } else {
      const tier = pricing.applicable;
      lines.push(copy.singleNet(copy.money(tier.net)));
      lines.push(copy.singleKdv(kdvRateInt, copy.money(Number(tier.gross) - Number(tier.net))));
      lines.push(copy.singleGross(copy.money(tier.gross)));
    }

    lines.push('');
    lines.push(copy.reply);
    lines.push('');
    lines.push(copy.receipt(ADMIN_REPLY_TO));
  } else {
    lines.push(copy.noPrice);
  }

  lines.push('');
  lines.push(copy.questions(ADMIN_REPLY_TO));
  lines.push(copy.contact(REGISTRATION_CONTACT));
  lines.push('');
  lines.push(...copy.signoff);

  return lines;
}

export function renderEmail1Registration({ data, event, registeredAt }) {
  const fullName = `${data.first_name} ${data.last_name}`;
  const subject =
    'SonoInjection — Başvurunuz Alındı / Your Application Has Been Received';

  const pricing = resolvePricing(event, registeredAt);
  const context = { fullName, event, pricing };

  const text = [
    ...renderEmail1Body(EMAIL1_COPY.tr, context),
    '',
    '────────────────────────────────────────────────────────',
    '',
    ...renderEmail1Body(EMAIL1_COPY.en, context),
  ].join('\n');

  return { subject, text };
}

// ── Email 2: admin notification ─────────────────────────────────────
export function renderEmail2AdminNotification({ data, event, registeredAt }) {
  const fullName = `${data.first_name} ${data.last_name}`;
  const subject = `[SonoInjection] Yeni Rezervasyon - ${fullName}`;

  const lines = [];
  lines.push('Yeni bir rezervasyon alındı:');
  lines.push('');
  lines.push(`Ad Soyad: ${fullName}`);
  lines.push(`E-posta: ${data.email}`);
  lines.push(`Telefon: ${data.phone}`);
  lines.push(`Uzmanlık: ${SPECIALTY_LABELS[data.specialty] || data.specialty}`);
  lines.push(`Pozisyon: ${POSITION_LABELS[data.position] || data.position}`);
  lines.push(`Kurum: ${data.institution}`);
  lines.push(`Notlar: ${data.notes || '—'}`);
  lines.push('');
  lines.push(`Etkinlik: ${event.title_tr}`);
  lines.push(`Rezervasyon tarihi: ${formatRegisteredAtCet(registeredAt)}`);
  lines.push('');
  lines.push(`Admin paneli: ${ADMIN_PANEL_URL}`);

  return { subject, text: lines.join('\n') };
}

// ── Email 3: payment confirmation (applied → paid) ──────────────────
export function renderEmail3PaymentConfirmation({ registration, event }) {
  const fullName = `${registration.first_name} ${registration.last_name}`;
  const subject = 'SonoInjection Kaydınız Onaylandı';

  const lines = [];
  lines.push(`Sayın ${fullName},`);
  lines.push('');
  lines.push(
    `${event.title_tr} etkinliği için ödemeniz alınmıştır. Kaydınız resmi olarak onaylanmıştır.`,
  );
  lines.push('');
  lines.push(`Tarih: ${formatEventDateTr(event.event_date)}`);
  lines.push(`Yer: ${event.location_tr}`);
  lines.push('');
  lines.push('Etkinlikten 1 hafta önce hatırlatma e-postası alacaksınız.');
  lines.push('');
  lines.push('Sorularınız için: kayit@sonoinjection.com');
  lines.push('');
  lines.push('Saygılarımızla,');
  lines.push('SonoInjection Ekibi');

  return { subject, text: lines.join('\n') };
}

// ── Email 5: cancellation notice (opt-in) ───────────────────────────
export function renderEmail5Cancellation({ registration, event, reason }) {
  const fullName = `${registration.first_name} ${registration.last_name}`;
  const subject = 'SonoInjection Kaydınız İptal Edildi';

  const lines = [];
  lines.push(`Sayın ${fullName},`);
  lines.push('');
  lines.push(`${event.title_tr} etkinliği için kaydınız iptal edilmiştir.`);
  lines.push('');
  if (reason && String(reason).trim()) {
    lines.push(`Sebep: ${String(reason).trim()}`);
    lines.push('');
  }
  lines.push('Sorularınız veya yeniden kayıt için: kayit@sonoinjection.com');
  lines.push('');
  lines.push('Saygılarımızla,');
  lines.push('SonoInjection Ekibi');

  return { subject, text: lines.join('\n') };
}

// ── Email 6: refund notice (opt-in) ─────────────────────────────────
export function renderEmail6Refund({ registration, event, refundAmount, notes }) {
  const fullName = `${registration.first_name} ${registration.last_name}`;
  const subject = 'SonoInjection Ödeme İadesi';

  const lines = [];
  lines.push(`Sayın ${fullName},`);
  lines.push('');
  lines.push(`${event.title_tr} etkinliği için ödemeniz iade edilmiştir.`);
  lines.push('');
  if (refundAmount !== null && refundAmount !== undefined && !Number.isNaN(Number(refundAmount))) {
    lines.push(`İade tutarı: ${formatTRY(refundAmount)}`);
  }
  if (notes && String(notes).trim()) {
    lines.push(`Notlar: ${String(notes).trim()}`);
  }
  if (
    (refundAmount !== null && refundAmount !== undefined && !Number.isNaN(Number(refundAmount))) ||
    (notes && String(notes).trim())
  ) {
    lines.push('');
  }
  lines.push('Sorularınız için: kayit@sonoinjection.com');
  lines.push('');
  lines.push('Saygılarımızla,');
  lines.push('SonoInjection Ekibi');

  return { subject, text: lines.join('\n') };
}

// ── Send wrapper ──────────────────────────────────────────────────
export async function sendEmail({ to, replyTo, subject, text, context }) {
  const resend = getResend();
  if (!resend) {
    logServerError(
      context || 'email.send',
      new Error('RESEND_API_KEY missing — email skipped'),
      { to, subject },
    );
    return { sent: false, reason: 'RESEND_API_KEY missing' };
  }
  try {
    await resend.emails.send({
      from: ADMIN_FROM_EMAIL,
      to,
      replyTo: replyTo || ADMIN_REPLY_TO,
      subject,
      text,
    });
    return { sent: true };
  } catch (err) {
    logServerError(context || 'email.send', err, { to, subject });
    return { sent: false, reason: err?.message || 'send failed' };
  }
}
