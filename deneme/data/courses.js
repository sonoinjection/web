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
    spots: 40,
    maxSpots: 40,
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
        { time: '09:00–09:30', type: 'lecture', title: 'Kas-İskelet Sistemi Ultrasonografisine Giriş ve Temel Prensipler', speaker: 'Doç. Dr. Mahir Topaloğlu' },
        { time: '09:30–10:00', type: 'lecture', title: 'Omuz Bölgesinin Ultrasonografisi ve Enjeksiyonları', speaker: 'Doç. Dr. Mahir Topaloğlu' },
        { time: '10:00–10:30', type: 'lecture', title: 'Kalça Bölgesinin Ultrasonografisi ve Enjeksiyonları', speaker: 'Doç. Dr. Enes Efe İş' },
        { time: '10:30–11:00', type: 'admin', title: 'Kahve Arası' },
        { time: '11:00–11:30', type: 'lecture', title: 'Diz Bölgesinin Ultrasonografisi ve Enjeksiyonları', speaker: 'Dr. Öğr. Üyesi Mert Züre' },
        { time: '11:30–12:00', type: 'lecture', title: 'Ayak Bileği ve Ayak Bölgesinin Ultrasonografisi ve Enjeksiyonları', speaker: 'Dr. Havvanur Albayrak' },
        { time: '12:00–13:00', type: 'admin', title: 'Öğle Arası' },
        { time: '13:00–16:00', type: 'cadaver', title: 'Kadavra Üzerinde Enjeksiyon Pratikleri', items: [
          'Glenohumeral eklem', 'Subakromial bursa', 'Biseps tendonu', 'Akromioklavikular eklem', 'Supraskapular blok',
          'Kalça eklemi', 'Trokanterik bursa', 'Piriformis kası',
          'Diz eklemi', 'Pes anserin', 'Geniküler sinir', 'Gastrosoleus bursa',
          'Tibiotalar eklem', '1. MTF Eklem', 'Tarsal tünel', 'Aşil tendonu', 'Plantar fasya',
        ] },
        { time: '16:00–16:30', type: 'admin', title: 'Kapanış ve Değerlendirme' },
      ],
      en: [
        { time: '09:00–09:30', type: 'lecture', title: 'Introduction to Musculoskeletal Ultrasound & Core Principles', speaker: 'Assoc. Prof. Dr. Mahir Topaloğlu' },
        { time: '09:30–10:00', type: 'lecture', title: 'Shoulder Region — Ultrasonography & Injections', speaker: 'Assoc. Prof. Dr. Mahir Topaloğlu' },
        { time: '10:00–10:30', type: 'lecture', title: 'Hip Region — Ultrasonography & Injections', speaker: 'Assoc. Prof. Dr. Enes Efe İş' },
        { time: '10:30–11:00', type: 'admin', title: 'Coffee Break' },
        { time: '11:00–11:30', type: 'lecture', title: 'Knee Region — Ultrasonography & Injections', speaker: 'Assoc. Prof. Dr. Mert Züre' },
        { time: '11:30–12:00', type: 'lecture', title: 'Foot & Ankle Region — Ultrasonography & Injections', speaker: 'Dr. Havvanur Albayrak' },
        { time: '12:00–13:00', type: 'admin', title: 'Lunch Break' },
        { time: '13:00–16:00', type: 'cadaver', title: 'Cadaveric Injection Practice', items: [
          'Glenohumeral joint', 'Subacromial bursa', 'Biceps tendon', 'Acromioclavicular joint', 'Suprascapular block',
          'Hip joint', 'Trochanteric bursa', 'Piriformis muscle',
          'Knee joint', 'Pes anserine', 'Genicular nerve', 'Gastrosoleus bursa',
          'Tibiotalar joint', '1st MTP joint', 'Tarsal tunnel', 'Achilles tendon', 'Plantar fascia',
        ] },
        { time: '16:00–16:30', type: 'admin', title: 'Closing & Evaluation' },
      ],
    },
    facultyIds: ['mahir-topaloglu', 'mert-zure', 'enes-efe-is', 'havvanur-albayrak'],
  },
];
