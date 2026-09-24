/* ============================================================
   api/_emails.js — email templates + send orchestrator
   Email 1: application received (applicant), bilingual TR + EN
   Email 2: admin notification (kayit@)
   These are the only automatic emails. Everything after the initial
   application — bank details, payment confirmation, cancellations,
   refunds — is a human reply from kayit@, by deliberate choice.
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
  formatUSD,
  formatUSDEn,
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
  const deadline = event.early_bird_deadline
    ? String(event.early_bird_deadline).slice(0, 10)
    : null;

  // Two shapes. USD events (api/_events.js) quote a KDV-inclusive total
  // only — the lira equivalent is worked out by hand at confirmation and
  // sent with the bank details. TRY events (the Supabase `events` table)
  // store a net price and get the full net / KDV / total breakdown.
  const hasUsd = event.price_gross_usd !== null && event.price_gross_usd !== undefined;
  const hasTry = event.price_net_try !== null && event.price_net_try !== undefined;
  if (!hasUsd && !hasTry) return null;

  const currency = hasUsd ? 'USD' : 'TRY';

  const standard = hasUsd
    ? { key: 'standard', gross: event.price_gross_usd, net: null }
    : { key: 'standard', gross: event.price_gross_try, net: event.price_net_try };

  let early = null;
  if (deadline) {
    if (hasUsd && event.early_bird_price_gross_usd !== null && event.early_bird_price_gross_usd !== undefined) {
      early = { key: 'early', gross: event.early_bird_price_gross_usd, net: null };
    } else if (hasTry && event.early_bird_price_net_try !== null && event.early_bird_price_net_try !== undefined) {
      early = {
        key: 'early',
        gross: event.early_bird_price_gross_try,
        net: event.early_bird_price_net_try,
      };
    }
  }

  const hasEarlyBird = early !== null;
  const withinEarlyBird =
    hasEarlyBird && istanbulDateKey(registeredAt) <= deadline;

  return {
    currency,
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
    lang: 'tr',
    money: { TRY: formatTRY, USD: formatUSD },
    date: formatEventDateTr,
    title: (e) => e.title_tr,
    venue: (e) => e.location_tr,
    greeting: (name) => `Sayın ${name},`,
    received: (title) => `${title} için başvurunuz alındı.`,
    dateLine: (d) => `Tarih: ${d}`,
    venueLine: (v) => `Yer: ${v}`,
    feeHeading: 'KURS ÜCRETİ',
    feeHeadingInclusive: (rate) => `KURS ÜCRETİ (hekim başı, %${rate} KDV dahil)`,
    singleTierLabel: 'Kurs Ücreti:',
    tierHeading: {
      early: (d) => `Erken Kayıt (${formatEventDateTr(d)} tarihine kadar):`,
      standard: (d) => `Standart Kayıt (${formatEventDateTr(d)} sonrası):`,
    },
    tierName: { early: 'Erken Kayıt', standard: 'Standart Kayıt' },
    netLine: (v) => `  KDV Hariç: ${v}`,
    kdvLine: (rate, v) => `  KDV (%${rate}): ${v}`,
    grossLine: (v) => `  Toplam (KDV Dahil): ${v}`,
    applicable: (name, amount) => [
      'Başvuru tarihiniz itibarıyla geçerli ücret:',
      `${name} — ${amount} (KDV Dahil)`,
    ],
    reply:
      'Koşullar sizin için uygunsa, bu e-postayı kısaca yanıtlamanız yeterlidir; banka bilgilerini tarafınıza ileteceğiz.',
    replyWithConversion:
      'Koşullar sizin için uygunsa, bu e-postayı kısaca yanıtlamanız yeterlidir; tutarın güncel TL karşılığını ve banka bilgilerini tarafınıza ileteceğiz.',
    receipt: (email) =>
      `Havaleniz sonrasında dekontunuzu ${email} adresine ilettiğinizde, ödemeniz onaylandıktan sonra teyit e-postası göndereceğiz.`,
    noPrice: 'Kurs ücreti ve sonraki adımlar en kısa sürede tarafınıza iletilecektir.',
    questions: (email) => `Sorularınız için: ${email}`,
    contact: (c) => `Kayıt sorumlusu: ${c}`,
    signoff: ['Saygılarımızla,', 'SonoInjection Ekibi'],
  },
  en: {
    lang: 'en',
    money: { TRY: formatTRYEn, USD: formatUSDEn },
    date: formatEventDateEn,
    title: (e) => e.title_en || e.title_tr,
    venue: (e) => e.location_en || e.location_tr,
    greeting: (name) => `Dear ${name},`,
    received: (title) => `Your application for the ${title} has been received.`,
    dateLine: (d) => `Date: ${d}`,
    venueLine: (v) => `Venue: ${v}`,
    feeHeading: 'COURSE FEE',
    feeHeadingInclusive: (rate) => `COURSE FEE (per physician, incl. ${rate}% VAT)`,
    singleTierLabel: 'Course fee:',
    tierHeading: {
      early: (d) => `Early registration (until ${formatEventDateEn(d)}):`,
      standard: (d) => `Standard registration (from ${formatEventDateEn(d)}):`,
    },
    tierName: { early: 'Early registration', standard: 'Standard registration' },
    netLine: (v) => `  Excl. VAT: ${v}`,
    kdvLine: (rate, v) => `  VAT (${rate}%): ${v}`,
    grossLine: (v) => `  Total (incl. VAT): ${v}`,
    applicable: (name, amount) => [
      'Applicable to your application date:',
      `${name} — ${amount} (incl. VAT)`,
    ],
    reply:
      'If these terms suit you, a brief reply to this email is all we need — we will send you the bank details.',
    replyWithConversion:
      'If these terms suit you, a brief reply to this email is all we need — we will then send you the current equivalent in Turkish lira together with the bank details.',
    receipt: (email) =>
      `After your transfer, send the receipt to ${email} and we will confirm your payment by email.`,
    noPrice: 'The course fee and next steps will be sent to you shortly.',
    questions: (email) => `Questions: ${email}`,
    contact: (c) => `Registration contact: ${c}`,
    signoff: ['Kind regards,', 'SonoInjection Team'],
  },
};

// ── Mail profiles (one per concurrently open course) ──────────────
// Two courses can take applications at the same time and both land in the
// same kayit@ inbox, so each one gets its own subject line and its own
// course tag at the top of the body — that is what keeps the two threads
// apart at a glance and on a search. Keyed by event id; an event with no
// entry falls back to DEFAULT_MAIL_PROFILE, which is the wording the
// January course has been sending since launch (left untouched so live
// threads keep matching their earlier messages).
const DEFAULT_MAIL_PROFILE = {
  banner: null,
  applicationSubject: (fullName) =>
    `SonoInjection — Başvurunuz Alındı / Your Application Has Been Received (${fullName})`,
  adminSubject: (fullName) => `[SonoInjection] Yeni Başvuru - ${fullName}`,
};

const MAIL_PROFILES = {
  '2027-03-rmk-aimes': {
    banner: {
      tr: 'SonoInjection · 27 Mart 2027 · Lomber Bölge ve Fasya Plan Enjeksiyonları',
      en: 'SonoInjection · March 27, 2027 · Lumbar Region and Fascial Plane Injections',
    },
    applicationSubject: (fullName) =>
      `SonoInjection Mart 2027 — Başvurunuz Alındı / Your Application Has Been Received (${fullName})`,
    adminSubject: (fullName) => `[SonoInjection · Mart 2027] Yeni Başvuru - ${fullName}`,
  },
};

function mailProfile(event) {
  return MAIL_PROFILES[event && event.id] || DEFAULT_MAIL_PROFILE;
}

function renderEmail1Body(copy, { fullName, event, pricing, banner }) {
  const lines = [];
  if (banner) {
    lines.push(banner[copy.lang]);
    lines.push('');
  }
  lines.push(copy.greeting(fullName));
  lines.push('');
  lines.push(copy.received(copy.title(event)));
  lines.push('');
  lines.push(copy.dateLine(copy.date(event.event_date)));
  lines.push(copy.venueLine(copy.venue(event)));
  lines.push('');

  if (pricing) {
    const kdvRateInt = Math.round(Number(event.kdv_rate));
    const money = copy.money[pricing.currency];
    // A tier with no net price is quoted as a KDV-inclusive total, so the
    // rate moves into the heading instead of getting its own line.
    const breakdown = pricing.applicable.net !== null;

    lines.push(breakdown ? copy.feeHeading : copy.feeHeadingInclusive(kdvRateInt));
    lines.push('');

    // Both tiers are listed so the applicant can see what they saved —
    // or what they would have saved by applying earlier.
    for (const tier of pricing.tiers) {
      const label = pricing.hasEarlyBird
        ? copy.tierHeading[tier.key](pricing.deadline)
        : copy.singleTierLabel;
      if (breakdown) {
        lines.push(label);
        lines.push(copy.netLine(money(tier.net)));
        lines.push(copy.kdvLine(kdvRateInt, money(Number(tier.gross) - Number(tier.net))));
        lines.push(copy.grossLine(money(tier.gross)));
        lines.push('');
      } else {
        lines.push(`${label} ${money(tier.gross)}`);
      }
    }
    if (!breakdown) lines.push('');

    if (pricing.hasEarlyBird) {
      lines.push(
        ...copy.applicable(
          copy.tierName[pricing.applicable.key],
          money(pricing.applicable.gross),
        ),
      );
      lines.push('');
    }

    lines.push(pricing.currency === 'USD' ? copy.replyWithConversion : copy.reply);
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
  const context = { fullName, event, pricing, banner: mailProfile(event).banner };

  const text = [
    ...renderEmail1Body(EMAIL1_COPY.tr, context),
    '',
    '────────────────────────────────────────────────────────',
    '',
    ...renderEmail1Body(EMAIL1_COPY.en, context),
  ].join('\n');

  return { subject, text };
}

// ── Application email (email-only pipeline) ─────────────────────────
// One message addressed to BOTH the applicant and kayit@, so the whole
// exchange lives in a single thread: the applicant replies, the team
// replies-all, bank details follow in that chain. Body is the same
// bilingual text as Email 1, with the application details appended so
// the thread is self-contained — there is no database to look them up in.
export function renderApplicationEmail({ data, event, submittedAt }) {
  const fullName = `${data.first_name} ${data.last_name}`;
  const profile = mailProfile(event);
  const subject = profile.applicationSubject(fullName);

  const pricing = resolvePricing(event, submittedAt);
  const context = { fullName, event, pricing, banner: profile.banner };

  const details = [
    'Başvuru Bilgileri / Application Details',
    '',
    `Ad Soyad / Name: ${fullName}`,
    `E-posta / Email: ${data.email}`,
    `Telefon / Phone: ${data.phone}`,
    `Uzmanlık / Specialty: ${data.specialty}`,
    `Pozisyon / Position: ${POSITION_LABELS[data.position] || data.position}`,
    `Kurum / Institution: ${data.institution}`,
    `Notlar / Notes: ${data.notes || '—'}`,
    `Başvuru tarihi / Submitted: ${formatRegisteredAtCet(submittedAt)}`,
  ];

  const divider = '────────────────────────────────────────────────────────';

  const text = [
    ...renderEmail1Body(EMAIL1_COPY.tr, context),
    '',
    divider,
    '',
    ...renderEmail1Body(EMAIL1_COPY.en, context),
    '',
    divider,
    '',
    ...details,
  ].join('\n');

  return { subject, text };
}

// ── Email 2: admin notification ─────────────────────────────────────
export function renderEmail2AdminNotification({ data, event, registeredAt }) {
  const fullName = `${data.first_name} ${data.last_name}`;
  const subject = mailProfile(event).adminSubject(fullName);

  const lines = [];
  lines.push('Yeni bir başvuru alındı:');
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
  lines.push(`Başvuru tarihi: ${formatRegisteredAtCet(registeredAt)}`);

  // The tier this applicant qualifies for — the figure to quote when
  // replying with bank details.
  const pricing = resolvePricing(event, registeredAt);
  if (pricing) {
    const tierName = pricing.hasEarlyBird
      ? EMAIL1_COPY.tr.tierName[pricing.applicable.key]
      : 'Kurs ücreti';
    const money = EMAIL1_COPY.tr.money[pricing.currency];
    lines.push(
      `Geçerli ücret: ${tierName} — ${money(pricing.applicable.gross)} (KDV Dahil)`,
    );
  }
  lines.push('');
  lines.push(`Admin paneli: ${ADMIN_PANEL_URL}`);

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
