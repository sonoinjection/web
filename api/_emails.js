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
  formatTRY,
  getResend,
  istanbulDateKey,
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
// tiers are always shown to the registrant; which one they owe is decided
// by the Istanbul calendar date of their registration, and the deadline
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

  const tiers = [];
  if (hasEarlyBird) {
    tiers.push({
      name: 'Erken Kayıt',
      window: `${formatEventDateTr(deadline)} tarihine kadar`,
      net: event.early_bird_price_net_try,
      gross: event.early_bird_price_gross_try,
    });
  }
  tiers.push({
    name: 'Standart Kayıt',
    window: hasEarlyBird ? `${formatEventDateTr(deadline)} sonrası` : null,
    net: event.price_net_try,
    gross: event.price_gross_try,
  });

  const withinEarlyBird =
    hasEarlyBird && istanbulDateKey(registeredAt) <= deadline;

  return {
    tiers,
    hasEarlyBird,
    applicable: withinEarlyBird ? tiers[0] : tiers[tiers.length - 1],
  };
}

function renderPriceTier(tier, kdvRateInt, indent) {
  const kdv = formatTRY(Number(tier.gross) - Number(tier.net));
  return [
    `${indent}KDV Hariç: ${formatTRY(tier.net)}`,
    `${indent}KDV (%${kdvRateInt}): ${kdv}`,
    `${indent}Toplam (KDV Dahil): ${formatTRY(tier.gross)}`,
  ];
}

// ── Email 1: registrant on initial registration ─────────────────────
export function renderEmail1Registration({ data, event, registeredAt }) {
  const fullName = `${data.first_name} ${data.last_name}`;
  const subject = 'SonoInjection Rezervasyonunuz Alındı';

  const lines = [];
  lines.push(`Sayın ${fullName},`);
  lines.push('');
  lines.push(`${event.title_tr} etkinliği için rezervasyonunuz alındı.`);
  lines.push('');
  lines.push(`Tarih: ${formatEventDateTr(event.event_date)}`);
  lines.push(`Yer: ${event.location_tr}`);
  lines.push('');

  const pricing = resolvePricing(event, registeredAt);

  if (pricing) {
    const kdvRateInt = Math.round(Number(event.kdv_rate));
    const dueGross = formatTRY(pricing.applicable.gross);

    if (pricing.hasEarlyBird) {
      // Both tiers are listed so the registrant can see what they saved —
      // or what they would have saved by registering earlier.
      lines.push('Kurs Ücreti');
      lines.push('');
      for (const tier of pricing.tiers) {
        lines.push(`${tier.name} (${tier.window}):`);
        lines.push(...renderPriceTier(tier, kdvRateInt, '  '));
        lines.push('');
      }
      lines.push(
        `Kayıt tarihiniz itibarıyla geçerli ücret: ${pricing.applicable.name} — ${dueGross} (KDV Dahil)`,
      );
    } else {
      const tier = pricing.applicable;
      const kdv = formatTRY(Number(tier.gross) - Number(tier.net));
      lines.push(`Kurs Ücreti (KDV Hariç): ${formatTRY(tier.net)}`);
      lines.push(`KDV (%${kdvRateInt}): ${kdv}`);
      lines.push(`Toplam (KDV Dahil): ${formatTRY(tier.gross)}`);
    }
    lines.push('');

    if (event.bank_details_tr) {
      lines.push(
        `Rezervasyonunuzu kesinleştirmek için lütfen ${dueGross} tutarında havale gerçekleştirin:`,
      );
      lines.push('');
      lines.push(event.bank_details_tr);
      lines.push('');
      lines.push(`Açıklama: ${fullName} - SonoInjection`);
    } else {
      lines.push('Banka bilgileri en kısa sürede iletilecektir.');
    }
  } else {
    lines.push(
      'Kurs ücreti ve banka bilgileri en kısa sürede tarafınıza iletilecektir.',
    );
  }

  lines.push('');
  lines.push('Ödemenizi aldıktan sonra 24 saat içinde onay e-postası göndereceğiz.');
  lines.push('');
  lines.push('Sorularınız için: kayit@sonoinjection.com');
  lines.push('');
  lines.push('Saygılarımızla,');
  lines.push('SonoInjection Ekibi');

  return { subject, text: lines.join('\n') };
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
