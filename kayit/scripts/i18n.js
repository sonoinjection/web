/* ============================================================
   i18n.js — bilingual strings for /kayit/

   One page serves both languages rather than two HTML files: the
   form and its event details drifted out of date once already, and
   a second copy doubles that risk.

   Language comes from ?lang=en (anything else falls back to Turkish,
   the primary audience). The toggle rewrites the query string with
   history.replaceState so /kayit/?lang=en stays linkable — the English
   course page points straight at it.

   Usage:
     <span data-i18n="form.submit"></span>
     <input data-i18n-placeholder="form.phonePlaceholder" />
     <p data-i18n-html="success.contact"></p>   ← value may contain markup
   ============================================================ */

export const STRINGS = {
  tr: {
    htmlLang: 'tr',
    docTitle: 'Kayıt — Kadavrada Ultrasonografi Eşliğinde Lomber Bölge ve Fasya Plan Enjeksiyonları Kursu — SonoInjection',
    back: '← Ana sayfaya dön',
    langToggle: 'EN',
    langToggleLabel: 'Switch to English',
    event: {
      date: '17 Ocak 2027',
      title: 'Kadavrada Ultrasonografi Eşliğinde Lomber Bölge ve Fasya Plan Enjeksiyonları Kursu',
      venue: 'RMK AIMES, İstanbul',
      address: 'Koç Üniversitesi Hastanesi, Davutpaşa Cd. No:4, Zeytinburnu/İstanbul 34010',
    },
    form: {
      eyebrow: 'Kayıt Formu',
      heading: 'Kursa kayıt olun',
      intro: 'Aşağıdaki formu doldurun. Başvurunuz alındıktan sonra kurs ücreti ve sonraki adımlar e-posta adresinize iletilir.',
      firstName: 'Ad',
      lastName: 'Soyad',
      email: 'E-posta',
      phone: 'Telefon',
      phoneHelper: 'Ülke kodunu da ekleyin.',
      phonePlaceholder: '+90 555 123 45 67',
      specialty: 'Uzmanlık',
      position: 'Pozisyon',
      positionPlaceholder: 'Seçiniz',
      positionUzman: 'Uzman',
      positionAsistan: 'Asistan',
      institution: 'Kurum',
      institutionHelper: 'Çalıştığınız hastane, üniversite veya kuruluşun adı.',
      notes: 'Notlar',
      notesPlaceholder: 'Diyet tercihi, fatura bilgisi gibi özel notlarınızı buraya yazabilirsiniz.',
      submit: 'Kayıt Ol',
      submitting: 'Gönderiliyor…',
    },
    errors: {
      firstName: 'Lütfen adınızı girin.',
      lastName: 'Lütfen soyadınızı girin.',
      email: 'Geçerli bir e-posta adresi girin.',
      phone: 'Geçerli bir telefon numarası girin (örn. +90 555 123 45 67).',
      specialty: 'Lütfen uzmanlığınızı girin.',
      position: 'Lütfen pozisyonunuzu seçin.',
      institution: 'Lütfen kurum bilginizi girin.',
      requestFailed: (status) => `İstek başarısız oldu (${status}). Lütfen daha sonra tekrar deneyin.`,
      unexpected: 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.',
    },
    success: {
      heading: 'Başvurunuz alındı',
      body: 'Kurs ücreti ve sonraki adımlar e-posta adresinize gönderildi. Koşullar sizin için uygunsa e-postayı kısaca yanıtlamanız yeterlidir; banka bilgilerini tarafınıza ileteceğiz.',
      contact: 'Sorularınız için <a href="mailto:kayit@sonoinjection.com">kayit@sonoinjection.com</a> adresinden bize ulaşabilirsiniz.',
    },
    footer: '© 2026 SonoInjection — Tüm hakları saklıdır.',
  },

  en: {
    htmlLang: 'en',
    docTitle: 'Registration — Cadaveric Ultrasound-Guided Lumbar Region and Fascial Plane Injection Course — SonoInjection',
    back: '← Back to home',
    langToggle: 'TR',
    langToggleLabel: "Türkçe'ye geç",
    event: {
      date: 'January 17, 2027',
      title: 'Cadaveric Ultrasound-Guided Lumbar Region and Fascial Plane Injection Course',
      venue: 'RMK AIMES, Istanbul',
      address: 'Koç University Hospital, Davutpaşa Cd. No:4, Zeytinburnu/İstanbul 34010, Türkiye',
    },
    form: {
      eyebrow: 'Registration Form',
      heading: 'Register for the course',
      intro: 'Fill in the form below. Once your application is received, the course fee and next steps will be sent to your email address.',
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Email',
      phone: 'Phone',
      phoneHelper: 'Please include your country code.',
      phonePlaceholder: '+90 555 123 45 67',
      specialty: 'Specialty',
      position: 'Position',
      positionPlaceholder: 'Select',
      positionUzman: 'Specialist',
      positionAsistan: 'Resident',
      institution: 'Institution',
      institutionHelper: 'The hospital, university or organisation you work for.',
      notes: 'Notes',
      notesPlaceholder: 'Dietary preferences, invoicing details or any other notes.',
      submit: 'Register',
      submitting: 'Sending…',
    },
    errors: {
      firstName: 'Please enter your first name.',
      lastName: 'Please enter your last name.',
      email: 'Please enter a valid email address.',
      phone: 'Please enter a valid phone number (e.g. +90 555 123 45 67).',
      specialty: 'Please enter your specialty.',
      position: 'Please select your position.',
      institution: 'Please enter your institution.',
      requestFailed: (status) => `The request failed (${status}). Please try again later.`,
      unexpected: 'Something went wrong. Please try again.',
    },
    success: {
      heading: 'Your application has been received',
      body: 'The course fee and next steps have been sent to your email address. If the terms suit you, a brief reply to that email is all we need — we will then send you the bank details.',
      contact: 'For questions, reach us at <a href="mailto:kayit@sonoinjection.com">kayit@sonoinjection.com</a>.',
    },
    footer: '© 2026 SonoInjection — All rights reserved.',
  },
};

export const DEFAULT_LANG = 'tr';

export function getLang() {
  const requested = new URLSearchParams(window.location.search).get('lang');
  return requested && STRINGS[requested] ? requested : DEFAULT_LANG;
}

// 'form.phoneHelper' → STRINGS[lang].form.phoneHelper
export function t(lang, path) {
  return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), STRINGS[lang]);
}

export function applyTranslations(lang) {
  const dict = STRINGS[lang];
  document.documentElement.lang = dict.htmlLang;
  document.title = dict.docTitle;

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const value = t(lang, el.dataset.i18n);
    if (typeof value === 'string') el.textContent = value;
  });
  document.querySelectorAll('[data-i18n-html]').forEach((el) => {
    const value = t(lang, el.dataset.i18nHtml);
    if (typeof value === 'string') el.innerHTML = value;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const value = t(lang, el.dataset.i18nPlaceholder);
    if (typeof value === 'string') el.placeholder = value;
  });
  document.querySelectorAll('[data-i18n-label]').forEach((el) => {
    const value = t(lang, el.dataset.i18nLabel);
    if (typeof value === 'string') el.setAttribute('aria-label', value);
  });
}

// Swap language in place, keeping the URL linkable and the form's
// current input values untouched.
export function wireLangToggle(onChange) {
  const toggle = document.querySelector('[data-lang-toggle]');
  if (!toggle) return;
  toggle.addEventListener('click', (event) => {
    event.preventDefault();
    const next = getLang() === 'tr' ? 'en' : 'tr';
    const url = new URL(window.location.href);
    if (next === DEFAULT_LANG) url.searchParams.delete('lang');
    else url.searchParams.set('lang', next);
    window.history.replaceState({}, '', url);
    onChange(next);
  });
}
