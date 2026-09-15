/* ============================================================
   courses.js — course catalogue
   To add a course: append a new entry to the COURSES array.
   Each text field is keyed by language: { tr: '…', en: '…' }
   ============================================================ */

export const COURSES = [
  {
    id: '2026-09-rmk-aimes',
    slug: '2026-09-rmk-aimes',
    full: true,
    detail: {
      tr: 'courses/2026-09-rmk-aimes.html',
      en: 'courses/2026-09-rmk-aimes.en.html',
    },
    thumbLabel: {
      tr: 'Alt Ekstremite',
      en: 'Lower Extremity',
    },
    thumbColor: 'var(--navy-900)',
    thumbImage: 'assets/courses/2026-09-rmk-aimes.jpg',
    title: {
      tr: 'Kadavrada Ultrasonografi Eşliğinde Alt Ekstremite Enjeksiyon Kursu',
      en: 'Cadaveric Ultrasound-Guided Lower Extremity Injection Course',
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
      tr: '2 Eylül 2026',
      en: 'September 2, 2026',
    },
    iso: '2026-09-02',
    spots: null,
    maxSpots: null,
    priceNetTry: null,
    kdvRate: 20,
    registerUrl: 'mailto:kayit@sonoinjection.com',
    joints: {
      tr: ['Kalça', 'Diz', 'Ayak Bileği'],
      en: ['Hip', 'Knee', 'Ankle'],
    },
    description: {
      tr: [
        '<strong>"Kadavrada Ultrasonografi Eşliğinde Alt Ekstremite Enjeksiyon Kursu"</strong>, 2 Eylül tarihinde RMK AIMES\'te (Rahmi M. Koç Academy of Interventional Medicine, Education, and Simulation) kapılarını açıyor.',
        'Kas-iskelet sistemi girişimsel uygulamalarındaki güncel yaklaşımlar doğrultusunda hazırlanan kursumuzda; teorik içeriğin ardından kadavra üzerinde gerçekleştirilecek uygulamalı oturumlarla ileri düzey pratik deneyim kazanma fırsatı sunuyoruz. Alt ekstremiteye yönelik enjeksiyon teknikleri, ultrasonografi rehberliğinde adım adım ele alınacak ve interaktif bir öğrenme ortamı sağlanacaktır.',
        'Programımızı; çok açılı demonstrasyonlar, birebir uygulama imkânı ve eğitmenlerle etkileşimli oturumlarla zenginleştirdik. Alanında deneyimli eğitmenler eşliğinde, günlük klinik pratiğinize doğrudan katkı sunacak verimli bir buluşma hazırlamak için tüm hazırlıklarımızı titizlikle sürdürüyoruz.',
      ],
      en: [
        '<strong>"Cadaveric Ultrasound-Guided Lower Extremity Injection Course"</strong> opens its doors on September 2 at RMK AIMES (Rahmi M. Koç Academy of Interventional Medicine, Education, and Simulation).',
        'Designed in line with current approaches in musculoskeletal interventional practice, our course offers the opportunity to gain advanced practical experience through hands-on cadaveric sessions that follow the theoretical content. Injection techniques targeting the lower extremity will be addressed step by step under ultrasonographic guidance, in an interactive learning environment.',
        'We have enriched the program with multi-angle demonstrations, one-on-one practice opportunities, and interactive sessions with the faculty. Alongside experienced instructors in the field, we are meticulously preparing a productive gathering that will directly contribute to your daily clinical practice.',
      ],
    },
    signature: {
      tr: '2 Eylül\'de RMK AIMES\'te sizleri aramızda görmekten büyük mutluluk duyacağız.',
      en: 'We will be delighted to welcome you at RMK AIMES on September 2.',
    },
    signatureBy: {
      tr: 'Düzenleme Kurulu Adına Doç. Dr. Mahir TOPALOĞLU',
      en: 'On behalf of the Organising Committee, Assoc. Prof. Mahir TOPALOĞLU',
    },
    schedule: {
      tr: [
        { time: '09:00–10:00', type: 'lecture', title: 'Kas-İskelet Sistemi Ultrasonografisine Giriş ve Temel Prensipler', speaker: 'Doç. Dr. Mahir Topaloğlu' },
        { time: '10:00–10:30', type: 'lecture', title: 'Kalça Bölgesinin Ultrasonografisi ve Enjeksiyonları', speaker: 'Doç. Dr. Enes Efe İş' },
        { time: '10:30–11:00', type: 'admin', title: 'Kahve Arası' },
        { time: '11:00–11:30', type: 'lecture', title: 'Diz Bölgesinin Ultrasonografisi ve Enjeksiyonları', speaker: 'Doç. Dr. Mert Zure' },
        { time: '11:30–12:00', type: 'lecture', title: 'Ayak Bileği ve Ayak Bölgesinin Ultrasonografisi ve Enjeksiyonları', speaker: 'Uzm. Dr. Havvanur Albayrak' },
        { time: '12:00–13:00', type: 'admin', title: 'Öğle Arası' },
        { time: '13:00–16:00', type: 'cadaver', title: 'Kadavra Üzerinde Enjeksiyon Pratikleri', items: [
          'Kalça eklemi', 'Trokanterik bursa', 'Piriformis kası',
          'Diz eklemi', 'Pes anserin', 'Geniküler sinir', 'Gastrosoleus bursa',
          'Tibiotalar eklem', '1. MTF Eklem', 'Tarsal tünel', 'Aşil tendonu', 'Plantar fasya',
        ] },
        { time: '16:00–16:30', type: 'admin', title: 'Kapanış ve Değerlendirme' },
      ],
      en: [
        { time: '09:00–10:00', type: 'lecture', title: 'Introduction to Musculoskeletal Ultrasound & Core Principles', speaker: 'Assoc. Prof. Mahir Topaloğlu' },
        { time: '10:00–10:30', type: 'lecture', title: 'Hip Region — Ultrasonography & Injections', speaker: 'Assoc. Prof. Enes Efe İş' },
        { time: '10:30–11:00', type: 'admin', title: 'Coffee Break' },
        { time: '11:00–11:30', type: 'lecture', title: 'Knee Region — Ultrasonography & Injections', speaker: 'Assoc. Prof. Mert Zure' },
        { time: '11:30–12:00', type: 'lecture', title: 'Foot & Ankle Region — Ultrasonography & Injections', speaker: 'Dr. Havvanur Albayrak' },
        { time: '12:00–13:00', type: 'admin', title: 'Lunch Break' },
        { time: '13:00–16:00', type: 'cadaver', title: 'Cadaveric Injection Practice', items: [
          'Hip joint', 'Trochanteric bursa', 'Piriformis muscle',
          'Knee joint', 'Pes anserine', 'Genicular nerve', 'Gastrosoleus bursa',
          'Tibiotalar joint', '1st MTP joint', 'Tarsal tunnel', 'Achilles tendon', 'Plantar fascia',
        ] },
        { time: '16:00–16:30', type: 'admin', title: 'Closing & Evaluation' },
      ],
    },
    facultyIds: ['mahir-topaloglu', 'enes-efe-is', 'mert-zure', 'havvanur-albayrak'],
  },
  {
    id: '2027-01-rmk-aimes',
    slug: '2027-01-rmk-aimes',
    registrationOpen: true,
    detail: {
      tr: 'courses/2027-01-rmk-aimes.html',
      en: 'courses/2027-01-rmk-aimes.en.html',
    },
    thumbLabel: {
      tr: 'Lomber Bölge & Fasya Planları',
      en: 'Lumbar Region & Fascial Planes',
    },
    thumbColor: 'var(--navy-900)',
    thumbImage: 'assets/courses/2027-01-rmk-aimes.jpg',
    title: {
      tr: 'Kadavrada Ultrasonografi Eşliğinde Lomber Bölge ve Fasya Plan Enjeksiyonları Kursu',
      en: 'Cadaveric Ultrasound-Guided Lumbar Region and Fascial Plane Injection Course',
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
      tr: '17 Ocak 2027',
      en: 'January 17, 2027',
    },
    iso: '2027-01-17',
    spots: null,
    // 40 places, 8 participants per cadaver table (day-programme PDF).
    maxSpots: 40,
    // Quoted per physician in USD, KDV included. The lira equivalent is
    // worked out at confirmation time and sent with the bank details.
    priceGrossUsd: 1125,
    earlyBirdPriceGrossUsd: 1000,
    earlyBirdDeadline: '2026-11-15',
    kdvRate: 20,
    registerUrl: '/kayit/',
    programPdf: 'assets/courses/SonoInjection-Gun-Programi-17-Ocak-2027.pdf',
    joints: {
      tr: ['Lomber Bölge', 'Sakroiliak Eklem', 'Piriformis', 'Fasya Planları'],
      en: ['Lumbar Region', 'Sacroiliac Joint', 'Piriformis', 'Fascial Planes'],
    },
    description: {
      tr: [
        '<strong>"Kadavrada Ultrasonografi Eşliğinde Lomber Bölge ve Fasya Plan Enjeksiyonları Kursu"</strong>, 17 Ocak tarihinde RMK AIMES\'te (Rahmi M. Koç Academy of Interventional Medicine, Education, and Simulation) kapılarını açıyor.',
        'Kas-iskelet sistemi girişimsel uygulamalarındaki güncel yaklaşımlar doğrultusunda hazırlanan kursumuzda; teorik içeriğin ardından kadavra üzerinde gerçekleştirilecek uygulamalı oturumlarla ileri düzey pratik deneyim kazanma fırsatı sunuyoruz. Lomber bölgeye ve fasya planlarına yönelik enjeksiyon teknikleri, ultrasonografi rehberliğinde adım adım ele alınacak ve interaktif bir öğrenme ortamı sağlanacaktır.',
        'Programımızı; çok açılı demonstrasyonlar, birebir uygulama imkânı ve eğitmenlerle etkileşimli oturumlarla zenginleştirdik. Alanında deneyimli eğitmenler eşliğinde, günlük klinik pratiğinize doğrudan katkı sunacak verimli bir buluşma hazırlamak için tüm hazırlıklarımızı titizlikle sürdürüyoruz.',
      ],
      en: [
        '<strong>"Cadaveric Ultrasound-Guided Lumbar Region and Fascial Plane Injection Course"</strong> opens its doors on January 17 at RMK AIMES (Rahmi M. Koç Academy of Interventional Medicine, Education, and Simulation).',
        'Designed in line with current approaches in musculoskeletal interventional practice, our course offers the opportunity to gain advanced practical experience through hands-on cadaveric sessions that follow the theoretical content. Injection techniques targeting the lumbar region and the fascial planes will be addressed step by step under ultrasonographic guidance, in an interactive learning environment.',
        'We have enriched the program with multi-angle demonstrations, one-on-one practice opportunities, and interactive sessions with the faculty. Alongside experienced instructors in the field, we are meticulously preparing a productive gathering that will directly contribute to your daily clinical practice.',
      ],
    },
    signature: {
      tr: '17 Ocak\'ta RMK AIMES\'te sizleri aramızda görmekten büyük mutluluk duyacağız.',
      en: 'We will be delighted to welcome you at RMK AIMES on January 17.',
    },
    signatureBy: {
      tr: 'Düzenleme Kurulu Adına Doç. Dr. Mahir TOPALOĞLU',
      en: 'On behalf of the Organising Committee, Assoc. Prof. Mahir TOPALOĞLU',
    },
    schedule: {
      tr: [
        { time: '08:30–08:45', type: 'admin', title: 'Açılış, kurs tanıtımı ve grup dağılımı', speaker: 'Düzenleme Kurulu' },
        { time: '08:45–09:15', type: 'lecture', title: 'Lomber Bölge Sonoanatomi Prensipleri ve Prob-İğne Seçimi', speaker: 'Doç. Dr. Mahir Topaloğlu' },
        { time: '09:15–09:45', type: 'lecture', title: 'Faset Eklem Enjeksiyonu ve Medial Dal Bloğu', speaker: 'Doç. Dr. Enes Efe İş' },
        { time: '09:45–10:15', type: 'lecture', title: 'Sakroiliak Eklem ve Piriformis Enjeksiyonları', speaker: 'Doç. Dr. Mahir Topaloğlu' },
        { time: '10:15–10:30', type: 'admin', title: 'Kahve Arası' },
        { time: '10:30–10:50', type: 'lecture', title: 'Kaudal Epidural Enjeksiyon ve Superior Kluneal Sinir Bloğu', speaker: 'Dr. Öğr. Üyesi Havvanur Albayrak' },
        { time: '10:50–11:20', type: 'lecture', title: 'Kasın İçindeki Düğüm: Miyofasyal Ağrı Sendromunda Fasyanın Rolü — Enjeksiyondan Rehabilitasyona', speaker: 'Doç. Dr. Mert Zure' },
        { time: '11:20–12:00', type: 'lecture', title: 'Fasya Plan Blokları (ESP, QL, TLIP, multifidus hidrodiseksiyonu); Komplikasyonlar ve İlk Yardım Kuralları', speaker: 'Doç. Dr. Ergün Mendeş' },
        { time: '12:00–13:00', type: 'admin', title: 'Öğle Arası' },
        { time: '13:00–16:45', type: 'cadaver', title: 'Kadavra Üzerinde Enjeksiyon Pratikleri', speaker: 'Tüm eğitmenler', note: 'Beş istasyon, rotasyonlu — her istasyon 45 dakika' },
        { time: '16:45–17:00', type: 'admin', title: 'Kapanış, değerlendirme ve sertifika töreni' },
      ],
      en: [
        { time: '08:30–08:45', type: 'admin', title: 'Welcome, course introduction & group allocation', speaker: 'Organising Committee' },
        { time: '08:45–09:15', type: 'lecture', title: 'Lumbar Sonoanatomy Principles & Probe–Needle Selection', speaker: 'Assoc. Prof. Mahir Topaloğlu' },
        { time: '09:15–09:45', type: 'lecture', title: 'Facet Joint Injection & Medial Branch Block', speaker: 'Assoc. Prof. Enes Efe İş' },
        { time: '09:45–10:15', type: 'lecture', title: 'Sacroiliac Joint & Piriformis Injections', speaker: 'Assoc. Prof. Mahir Topaloğlu' },
        { time: '10:15–10:30', type: 'admin', title: 'Coffee Break' },
        { time: '10:30–10:50', type: 'lecture', title: 'Caudal Epidural Injection & Superior Cluneal Nerve Block', speaker: 'Assist. Prof. Havvanur Albayrak' },
        { time: '10:50–11:20', type: 'lecture', title: 'The Knot Within the Muscle: The Role of Fascia in Myofascial Pain Syndrome — From Injection to Rehabilitation', speaker: 'Assoc. Prof. Mert Zure' },
        { time: '11:20–12:00', type: 'lecture', title: 'Fascial Plane Blocks (ESP, QL, TLIP, multifidus hydrodissection); Complications & First-Aid Rules', speaker: 'Assoc. Prof. Ergün Mendeş' },
        { time: '12:00–13:00', type: 'admin', title: 'Lunch Break' },
        { time: '13:00–16:45', type: 'cadaver', title: 'Cadaveric Injection Practice', speaker: 'All faculty', note: 'Five stations, rotational — 45 minutes per station' },
        { time: '16:45–17:00', type: 'admin', title: 'Closing, evaluation & certificate ceremony' },
      ],
    },
    // Afternoon stations run simultaneously; groups rotate through all five.
    // Rotation: 13:00–13:45 · 13:45–14:30 · 14:30–15:15 · 15:15–16:00 · 16:00–16:45
    stations: {
      tr: [
        { no: 'İstasyon 1', title: 'Faset eklem + medial dal bloğu', speaker: 'Doç. Dr. Enes Efe İş' },
        { no: 'İstasyon 2', title: 'Sakroiliak eklem + piriformis', speaker: 'Doç. Dr. Mahir Topaloğlu' },
        { no: 'İstasyon 3', title: 'Kaudal epidural + superior kluneal sinir bloğu', speaker: 'Dr. Öğr. Üyesi Havvanur Albayrak' },
        { no: 'İstasyon 4', title: 'Torakolomber fasya ve multifidus hidrodiseksiyonu + TLIP bloğu', speaker: 'Doç. Dr. Mert Zure' },
        { no: 'İstasyon 5', title: 'Erektör spina plan (ESP) + quadratus lumborum (QL1-2-3)', speaker: 'Doç. Dr. Ergün Mendeş' },
      ],
      en: [
        { no: 'Station 1', title: 'Facet joint + medial branch block', speaker: 'Assoc. Prof. Enes Efe İş' },
        { no: 'Station 2', title: 'Sacroiliac joint + piriformis', speaker: 'Assoc. Prof. Mahir Topaloğlu' },
        { no: 'Station 3', title: 'Caudal epidural + superior cluneal nerve block', speaker: 'Assist. Prof. Havvanur Albayrak' },
        { no: 'Station 4', title: 'Thoracolumbar fascia and multifidus hydrodissection + TLIP block', speaker: 'Assoc. Prof. Mert Zure' },
        { no: 'Station 5', title: 'Erector spinae plane (ESP) + quadratus lumborum (QL1-2-3)', speaker: 'Assoc. Prof. Ergün Mendeş' },
      ],
    },
    facultyIds: ['mahir-topaloglu', 'ergun-mendes', 'enes-efe-is', 'mert-zure', 'havvanur-albayrak'],
  },
  {
    id: '2027-02-rmk-aimes',
    slug: '2027-02-rmk-aimes',
    registrationSoon: true,
    thumbLabel: {
      tr: 'Alt Ekstremite',
      en: 'Lower Extremity',
    },
    thumbColor: 'var(--navy-900)',
    thumbImage: 'assets/courses/2027-02-rmk-aimes.jpg',
    title: {
      tr: 'Kadavrada Ultrasonografi Eşliğinde Alt Ekstremite Enjeksiyon Kursu',
      en: 'Cadaveric Ultrasound-Guided Lower Extremity Injection Course',
    },
    level: {
      tr: 'Uygulamalı Kurs',
      en: 'Hands-on Course',
    },
    venue: 'RMK AIMES',
    city: 'Istanbul, Turkey',
    date: {
      tr: '27 Şubat 2027',
      en: 'February 27, 2027',
    },
    iso: '2027-02-27',
    // Remaining details (programme, faculty, pricing, detail page) to follow.
  },
  {
    id: '2027-03-rmk-aimes',
    slug: '2027-03-rmk-aimes',
    registrationSoon: true,
    thumbLabel: {
      tr: 'Lomber Bölge & Fasya Planları',
      en: 'Lumbar Region & Fascial Planes',
    },
    thumbColor: 'var(--navy-900)',
    thumbImage: 'assets/courses/2027-03-rmk-aimes.jpg',
    title: {
      tr: 'Kadavrada Ultrasonografi Eşliğinde Lomber Bölge ve Fasya Plan Enjeksiyonları Kursu',
      en: 'Cadaveric Ultrasound-Guided Lumbar Region and Fascial Plane Injection Course',
    },
    level: {
      tr: 'Uygulamalı Kurs',
      en: 'Hands-on Course',
    },
    venue: 'RMK AIMES',
    city: 'Istanbul, Turkey',
    date: {
      tr: '27 Mart 2027',
      en: 'March 27, 2027',
    },
    iso: '2027-03-27',
    // Remaining details (programme, faculty, pricing, detail page) to follow.
  },
  {
    id: '2026-06-rmk-aimes',
    slug: '2026-06-rmk-aimes',
    closed: true,
    detail: {
      tr: 'courses/2026-06-rmk-aimes.html',
      en: 'courses/2026-06-rmk-aimes.en.html',
    },
    thumbLabel: {
      tr: 'Omuz & Alt Ekstremite',
      en: 'Shoulder & Lower Extremity',
    },
    thumbColor: 'var(--navy-900)',
    thumbImage: 'assets/courses/2026-06-rmk-aimes.jpg',
    title: {
      tr: 'Kadavrada Ultrasonografi Eşliğinde Omuz ve Alt Ekstremite Enjeksiyon Kursu',
      en: 'Cadaveric Ultrasound-Guided Shoulder and Lower Extremity Injection Course',
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
    priceNetTry: 29000,
    kdvRate: 20,
    registerUrl: 'mailto:kayit@sonoinjection.com',
    joints: {
      tr: ['Omuz', 'Kalça', 'Diz', 'Ayak Bileği'],
      en: ['Shoulder', 'Hip', 'Knee', 'Ankle'],
    },
    description: {
      tr: [
        '<strong>"Kadavrada Ultrasonografi Eşliğinde Omuz ve Alt Ekstremite Enjeksiyon Kursu"</strong>, 20 Haziran tarihinde RMK AIMES\'te (Rahmi M. Koç Academy of Interventional Medicine, Education, and Simulation) kapılarını açıyor.',
        'Kas-iskelet sistemi girişimsel uygulamalarındaki güncel yaklaşımlar doğrultusunda hazırlanan kursumuzda; teorik içeriğin ardından kadavra üzerinde gerçekleştirilecek uygulamalı oturumlarla ileri düzey pratik deneyim kazanma fırsatı sunuyoruz. Omuz ve alt ekstremiteye yönelik enjeksiyon teknikleri, ultrasonografi rehberliğinde adım adım ele alınacak ve interaktif bir öğrenme ortamı sağlanacaktır.',
        'Programımızı; çok açılı demonstrasyonlar, birebir uygulama imkânı ve eğitmenlerle etkileşimli oturumlarla zenginleştirdik. Alanında deneyimli eğitmenler eşliğinde, günlük klinik pratiğinize doğrudan katkı sunacak verimli bir buluşma hazırlamak için tüm hazırlıklarımızı titizlikle sürdürüyoruz.',
      ],
      en: [
        '<strong>"Cadaveric Ultrasound-Guided Shoulder and Lower Extremity Injection Course"</strong> opens its doors on June 20 at RMK AIMES (Rahmi M. Koç Academy of Interventional Medicine, Education, and Simulation).',
        'Designed in line with current approaches in musculoskeletal interventional practice, our course offers the opportunity to gain advanced practical experience through hands-on cadaveric sessions that follow the theoretical content. Injection techniques targeting the shoulder and lower extremity will be addressed step by step under ultrasonographic guidance, in an interactive learning environment.',
        'We have enriched the program with multi-angle demonstrations, one-on-one practice opportunities, and interactive sessions with the faculty. Alongside experienced instructors in the field, we are meticulously preparing a productive gathering that will directly contribute to your daily clinical practice.',
      ],
    },
    signature: {
      tr: '20 Haziran\'da RMK AIMES\'te sizleri aramızda görmekten büyük mutluluk duyacağız.',
      en: 'We will be delighted to welcome you at RMK AIMES on June 20.',
    },
    signatureBy: {
      tr: 'Düzenleme Kurulu Adına Doç. Dr. Mahir TOPALOĞLU',
      en: 'On behalf of the Organising Committee, Assoc. Prof. Mahir TOPALOĞLU',
    },
    schedule: {
      tr: [
        { time: '09:00–09:30', type: 'lecture', title: 'Kas-İskelet Sistemi Ultrasonografisine Giriş ve Temel Prensipler', speaker: 'Doç. Dr. Mahir Topaloğlu' },
        { time: '09:30–10:00', type: 'lecture', title: 'Omuz Bölgesinin Ultrasonografisi ve Enjeksiyonları', speaker: 'Doç. Dr. Mahir Topaloğlu' },
        { time: '10:00–10:30', type: 'lecture', title: 'Kalça Bölgesinin Ultrasonografisi ve Enjeksiyonları', speaker: 'Doç. Dr. Enes Efe İş' },
        { time: '10:30–11:00', type: 'admin', title: 'Kahve Arası' },
        { time: '11:00–11:30', type: 'lecture', title: 'Diz Bölgesinin Ultrasonografisi ve Enjeksiyonları', speaker: 'Doç. Dr. Mert Zure' },
        { time: '11:30–12:00', type: 'lecture', title: 'Ayak Bileği ve Ayak Bölgesinin Ultrasonografisi ve Enjeksiyonları', speaker: 'Uzm. Dr. Havvanur Albayrak' },
        { time: '12:00–13:00', type: 'admin', title: 'Öğle Arası' },
        { time: '13:00–16:30', type: 'cadaver', title: 'Kadavra Üzerinde Enjeksiyon Pratikleri', items: [
          'Akromioklavikular eklem', 'Supraskapular blok', 'Subakromial bursa', 'Glenohumeral eklem', 'Biseps tendonu',
          'Kalça eklemi', 'Trokanterik bursa', 'Piriformis kası',
          'Diz eklemi', 'Pes anserin', 'Geniküler sinir', 'Gastrosoleus bursa',
          'Tibiotalar eklem', 'Tarsal tünel', 'Aşil tendonu', 'Plantar fasya', '1. MTF Eklem',
        ] },
        { time: '16:30–17:00', type: 'admin', title: 'Kapanış ve Değerlendirme' },
      ],
      en: [
        { time: '09:00–09:30', type: 'lecture', title: 'Introduction to Musculoskeletal Ultrasound & Core Principles', speaker: 'Assoc. Prof. Mahir Topaloğlu' },
        { time: '09:30–10:00', type: 'lecture', title: 'Shoulder Region — Ultrasonography & Injections', speaker: 'Assoc. Prof. Mahir Topaloğlu' },
        { time: '10:00–10:30', type: 'lecture', title: 'Hip Region — Ultrasonography & Injections', speaker: 'Assoc. Prof. Enes Efe İş' },
        { time: '10:30–11:00', type: 'admin', title: 'Coffee Break' },
        { time: '11:00–11:30', type: 'lecture', title: 'Knee Region — Ultrasonography & Injections', speaker: 'Assoc. Prof. Mert Zure' },
        { time: '11:30–12:00', type: 'lecture', title: 'Foot & Ankle Region — Ultrasonography & Injections', speaker: 'Dr. Havvanur Albayrak' },
        { time: '12:00–13:00', type: 'admin', title: 'Lunch Break' },
        { time: '13:00–16:30', type: 'cadaver', title: 'Cadaveric Injection Practice', items: [
          'Acromioclavicular joint', 'Suprascapular block', 'Subacromial bursa', 'Glenohumeral joint', 'Biceps tendon',
          'Hip joint', 'Trochanteric bursa', 'Piriformis muscle',
          'Knee joint', 'Pes anserine', 'Genicular nerve', 'Gastrosoleus bursa',
          'Tibiotalar joint', 'Tarsal tunnel', 'Achilles tendon', 'Plantar fascia', '1st MTP joint',
        ] },
        { time: '16:30–17:00', type: 'admin', title: 'Closing & Evaluation' },
      ],
    },
    facultyIds: ['mahir-topaloglu', 'mert-zure', 'enes-efe-is', 'havvanur-albayrak'],
  },
];
