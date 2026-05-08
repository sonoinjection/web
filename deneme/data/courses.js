/* ============================================================
   courses.js — course catalogue
   To add a course: append a new entry to the COURSES array.
   Each text field is keyed by language: { tr: '…', en: '…' }
   ============================================================ */

export const COURSES = [
  {
    id: '2026-06-rmk-aimes',
    slug: '2026-06-rmk-aimes',
    detail: {
      tr: 'courses/2026-06-rmk-aimes.html',
      en: 'courses/2026-06-rmk-aimes.en.html',
    },
    thumbLabel: {
      tr: 'Omuz & Alt Ekstremite',
      en: 'Shoulder & Lower Extremity',
    },
    thumbColor: 'var(--navy-900)',
    title: {
      tr: 'Ultrason Eşliğinde Kadavrik Omuz ve Alt Ekstremite Enjeksiyon Kursu',
      en: 'Ultrasound-Guided Cadaveric Shoulder & Lower Extremity Injection Course',
    },
    level: {
      tr: 'Uygulamalı Kurs',
      en: 'Hands-on Course',
    },
    venue: 'RMK AIMES',
    venueFull: {
      tr: 'RMK AIMES — Rahmi M. Koç Girişimsel Tıp, Eğitim ve Simülasyon Akademisi',
      en: 'RMK AIMES — Rahmi M. Koç Academy of Interventional Medicine, Education, and Simulation',
    },
    city: 'Istanbul, Turkey',
    countryCode: 'TR',
    date: {
      tr: '20 Haziran 2026',
      en: 'June 20, 2026',
    },
    iso: '2026-06-20',
    spots: 10,
    maxSpots: 16,
    price: null,
    joints: {
      tr: ['Omuz', 'Kalça', 'Diz', 'Ayak Bileği'],
      en: ['Shoulder', 'Hip', 'Knee', 'Ankle'],
    },
    description: {
      tr: [
        '<strong>Ultrason Eşliğinde Kadavrik Omuz ve Alt Ekstremite Enjeksiyon Kursu</strong>, 20 Haziran\'da RMK AIMES (Rahmi M. Koç Girişimsel Tıp, Eğitim ve Simülasyon Akademisi) ev sahipliğinde başlıyor.',
        'Kas-iskelet sistemi girişimsel pratiğindeki güncel yaklaşımlar etrafında tasarlanan program, teorik içeriği ileri düzey pratik deneyim için kadavrik uygulamalı oturumlarla bir araya getiriyor. Omuz ve alt ekstremitedeki enjeksiyon teknikleri, çoklu açılı gösterimler, birebir uygulama ve eğitmen eşliğindeki interaktif oturumlarla ultrason rehberliğinde adım adım işlenecek.',
      ],
      en: [
        'The <strong>Ultrasound-Guided Cadaveric Shoulder &amp; Lower Extremity Injection Course</strong> opens its doors on June 20 at RMK AIMES (Rahmi M. Koç Academy of Interventional Medicine, Education, and Simulation).',
        'Designed around current approaches in musculoskeletal interventional practice, the program pairs theoretical content with cadaveric hands-on sessions for advanced practical experience. Injection techniques for the shoulder and lower extremity will be covered step by step under ultrasound guidance, with multi-angle demonstrations, one-on-one practice, and faculty-led interactive sessions.',
      ],
    },
    signature: {
      tr: '20 Haziran\'da RMK AIMES\'te sizleri ağırlamayı dört gözle bekliyoruz.',
      en: 'We look forward to welcoming you on June 20 at RMK AIMES.',
    },
    signatureBy: {
      tr: '— Organizasyon Komitesi adına, Doç. Dr. Mahir Topaloğlu',
      en: '— On behalf of the Organising Committee, Assoc. Prof. Dr. Mahir Topaloğlu',
    },
    schedule: {
      tr: [
        { time: '08:00–09:00', type: 'admin', title: 'Kayıt ve Karşılama' },
        { time: '09:00–10:15', type: 'lecture', title: 'Anatomik Temeller ve Ultrason Tekrarı' },
        { time: '10:30–12:00', type: 'cadaver', title: 'İstasyon 1 — Omuz Kompleksi' },
        { time: '12:00–13:00', type: 'admin', title: 'Öğle Yemeği ve Eğitmen S&C' },
        { time: '13:00–14:30', type: 'cadaver', title: 'İstasyon 2 — Kalça ve İnguinal Bölge' },
        { time: '14:45–16:15', type: 'cadaver', title: 'İstasyon 3 — Diz ve Ayak Bileği' },
        { time: '16:15–17:00', type: 'admin', title: 'Değerlendirme ve Sertifika Töreni' },
      ],
      en: [
        { time: '08:00–09:00', type: 'admin', title: 'Registration & Welcome' },
        { time: '09:00–10:15', type: 'lecture', title: 'Anatomical Foundations & Ultrasound Review' },
        { time: '10:30–12:00', type: 'cadaver', title: 'Station 1 — Shoulder Complex' },
        { time: '12:00–13:00', type: 'admin', title: 'Lunch & Faculty Q&A' },
        { time: '13:00–14:30', type: 'cadaver', title: 'Station 2 — Hip & Groin' },
        { time: '14:45–16:15', type: 'cadaver', title: 'Station 3 — Knee & Ankle' },
        { time: '16:15–17:00', type: 'admin', title: 'Debrief & Certificate Distribution' },
      ],
    },
    facultyIds: ['mahir-topaloglu', 'mert-zure', 'enes-efe-is', 'havvanur-albayrak'],
  },
];
