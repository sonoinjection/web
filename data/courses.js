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
    // Quoted per physician in USD, KDV included. The applicant works out
    // the lira equivalent at the TCMB selling rate on the payment date.
    priceGrossUsd: 1125,
    earlyBirdPriceGrossUsd: 1000,
    earlyBirdDeadline: '2026-12-15',
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
        { time: '08:30–08:40', type: 'admin', title: 'Açılış, kurs tanıtımı ve grup dağılımı', speaker: 'Doç. Dr. Mahir Topaloğlu' },
        { time: '08:40–09:05', type: 'lecture', title: 'Lomber Bölge Sonoanatomisi ve Temel Prensipler', speaker: 'Doç. Dr. Mahir Topaloğlu', note: 'Part I — Teorik Oturum: Temeller ve Güncel Yaklaşımlar' },
        { time: '09:05–09:30', type: 'lecture', title: 'Miyofasyal Ağrı Sendromunda Fasyanın Rolü — Enjeksiyondan Rehabilitasyona', speaker: 'Prof. Dr. Özge Keniş Coşkun' },
        { time: '09:30–09:55', type: 'lecture', title: 'İnterfasyal Plan Blokları (ESP, QL, SPSIP): Endikasyon, Teknik, Komplikasyonlar ve Acil Durum Yönetimi', speaker: 'Doç. Dr. Ergün Mendeş' },
        { time: '09:55–10:20', type: 'lecture', title: 'Faset Eklem Ağrısında Ultrason Eşliğinde Radyofrekans Uygulamaları', speaker: 'Prof. Dr. Serdar Kesikburun' },
        { time: '10:20–10:40', type: 'admin', title: 'Kahve arası ve laboratuvara geçiş' },
        { time: '10:40–13:10', type: 'cadaver', title: 'Part II — Kadavra Pratiği: İnterfasyal Plan Blokları', speaker: 'Lab Director: Prof. Dr. Serdar Kesikburun', note: 'Beş masa, rotasyonlu — her masada 30 dakika' },
        { time: '13:10–14:00', type: 'admin', title: 'Öğle yemeği' },
        { time: '14:00–15:30', type: 'cadaver', title: 'Part III — Kadavra Pratiği: Lumbosakral Eklem, Epidural ve Sinir Hedefli Enjeksiyonlar (rotasyon 1–3)', speaker: 'Lab Director: Doç. Dr. Mahir Topaloğlu' },
        { time: '15:30–15:45', type: 'admin', title: 'Kahve arası' },
        { time: '15:45–16:45', type: 'cadaver', title: 'Part III devam (rotasyon 4–5)', speaker: 'Lab Director: Doç. Dr. Mahir Topaloğlu' },
        { time: '16:45–17:00', type: 'admin', title: 'Kapanış, değerlendirme ve sertifika töreni', speaker: 'Düzenleme Kurulu' },
      ],
      en: [
        { time: '08:30–08:40', type: 'admin', title: 'Welcome, course introduction & group allocation', speaker: 'Assoc. Prof. Mahir Topaloğlu' },
        { time: '08:40–09:05', type: 'lecture', title: 'Lumbar Sonoanatomy & Core Principles', speaker: 'Assoc. Prof. Mahir Topaloğlu', note: 'Part I — Theory Session: Foundations & Current Approaches' },
        { time: '09:05–09:30', type: 'lecture', title: 'The Role of Fascia in Myofascial Pain Syndrome — From Injection to Rehabilitation', speaker: 'Prof. Özge Keniş Coşkun' },
        { time: '09:30–09:55', type: 'lecture', title: 'Interfascial Plane Blocks (ESP, QL, SPSIP): Indications, Technique, Complications & Emergency Management', speaker: 'Assoc. Prof. Ergün Mendeş' },
        { time: '09:55–10:20', type: 'lecture', title: 'Ultrasound-Guided Radiofrequency Procedures for Facet Joint Pain', speaker: 'Prof. Serdar Kesikburun' },
        { time: '10:20–10:40', type: 'admin', title: 'Coffee break & move to the lab' },
        { time: '10:40–13:10', type: 'cadaver', title: 'Part II — Cadaver Practice: Interfascial Plane Blocks', speaker: 'Lab Director: Prof. Serdar Kesikburun', note: 'Five tables, rotational — 30 minutes per table' },
        { time: '13:10–14:00', type: 'admin', title: 'Lunch' },
        { time: '14:00–15:30', type: 'cadaver', title: 'Part III — Cadaver Practice: Lumbosacral Joint, Epidural and Nerve-Targeted Injections (rotations 1–3)', speaker: 'Lab Director: Assoc. Prof. Mahir Topaloğlu' },
        { time: '15:30–15:45', type: 'admin', title: 'Coffee break' },
        { time: '15:45–16:45', type: 'cadaver', title: 'Part III continued (rotations 4–5)', speaker: 'Lab Director: Assoc. Prof. Mahir Topaloğlu' },
        { time: '16:45–17:00', type: 'admin', title: 'Closing, evaluation & certificate ceremony', speaker: 'Organising Committee' },
      ],
    },
    // Part II and Part III: five cadaver tables each, run simultaneously;
    // groups rotate through all five tables in each part (day-programme docx, Nov 2026).
    practicals: {
      tr: [
        { title: 'Part II — Kadavra Pratiği: İnterfasyal Plan Blokları', time: '10:40–13:10', labDirector: 'Prof. Dr. Serdar Kesikburun', rotation: 'Rotasyon saatleri — her masada 25 dk uygulama, 5 dk geçiş.<br/>10:40–11:10 · 11:10–11:40 · 11:40–12:10 · 12:10–12:40 · 12:40–13:10', tables: [
          { no: 'Masa 1', title: 'Serratus posterior superior interkostal plan (SPSIP) ve quadratus lumborum (QL) blokları', speaker: 'Doç. Dr. Ergün Mendeş' },
          { no: 'Masa 2', title: 'Romboid interkostal blok (RIB) ve trapez–romboid interfasyal plan bloğu', speaker: 'Dr. Öğr. Üyesi Havvanur Albayrak' },
          { no: 'Masa 3', title: 'Erektör spina plan (ESP) bloğu', speaker: 'Doç. Dr. Enes Efe İş' },
          { no: 'Masa 4', title: 'Quadro-iliak plan (QIP) bloğu', speaker: 'Doç. Dr. Mahir Topaloğlu' },
          { no: 'Masa 5', title: 'Piriformis enjeksiyonu', speaker: 'Doç. Dr. Mert Zure' },
        ] },
        { title: 'Part III — Kadavra Pratiği: Lumbosakral Eklem, Epidural ve Sinir Hedefli Enjeksiyonlar', time: '14:00–16:45', labDirector: 'Doç. Dr. Mahir Topaloğlu', rotation: 'Rotasyon saatleri — her masada 25 dk uygulama, 5 dk geçiş.<br/>14:00–14:30 · 14:30–15:00 · 15:00–15:30 · kahve arası 15:30–15:45 · 15:45–16:15 · 16:15–16:45', tables: [
          { no: 'Masa 1', title: 'Lomber faset eklem enjeksiyonu ve medial dal bloğu', speaker: 'Doç. Dr. Enes Efe İş' },
          { no: 'Masa 2', title: 'Sakroiliak eklem enjeksiyonu', speaker: 'Doç. Dr. Mert Zure' },
          { no: 'Masa 3', title: 'Kaudal epidural enjeksiyon', speaker: 'Dr. Öğr. Üyesi Havvanur Albayrak' },
          { no: 'Masa 4', title: 'Lomber selektif sinir kökü (periradiküler) enjeksiyonu', speaker: 'Prof. Dr. Serdar Kesikburun' },
          { no: 'Masa 5', title: 'Superior ve orta kluneal sinir blokları', speaker: 'Doç. Dr. Ergün Mendeş' },
        ] },
      ],
      en: [
        { title: 'Part II — Cadaver Practice: Interfascial Plane Blocks', time: '10:40–13:10', labDirector: 'Prof. Serdar Kesikburun', rotation: 'Rotation times — 25 minutes of practice and 5 minutes of changeover per table.<br/>10:40–11:10 · 11:10–11:40 · 11:40–12:10 · 12:10–12:40 · 12:40–13:10', tables: [
          { no: 'Table 1', title: 'Serratus posterior superior intercostal plane (SPSIP) and quadratus lumborum (QL) blocks', speaker: 'Assoc. Prof. Ergün Mendeş' },
          { no: 'Table 2', title: 'Rhomboid intercostal block (RIB) and trapezius–rhomboid interfascial plane block', speaker: 'Assist. Prof. Havvanur Albayrak' },
          { no: 'Table 3', title: 'Erector spinae plane (ESP) block', speaker: 'Assoc. Prof. Enes Efe İş' },
          { no: 'Table 4', title: 'Quadro-iliac plane (QIP) block', speaker: 'Assoc. Prof. Mahir Topaloğlu' },
          { no: 'Table 5', title: 'Piriformis injection', speaker: 'Assoc. Prof. Mert Zure' },
        ] },
        { title: 'Part III — Cadaver Practice: Lumbosacral Joint, Epidural and Nerve-Targeted Injections', time: '14:00–16:45', labDirector: 'Assoc. Prof. Mahir Topaloğlu', rotation: 'Rotation times — 25 minutes of practice and 5 minutes of changeover per table.<br/>14:00–14:30 · 14:30–15:00 · 15:00–15:30 · coffee break 15:30–15:45 · 15:45–16:15 · 16:15–16:45', tables: [
          { no: 'Table 1', title: 'Lumbar facet joint injection and medial branch block', speaker: 'Assoc. Prof. Enes Efe İş' },
          { no: 'Table 2', title: 'Sacroiliac joint injection', speaker: 'Assoc. Prof. Mert Zure' },
          { no: 'Table 3', title: 'Caudal epidural injection', speaker: 'Assist. Prof. Havvanur Albayrak' },
          { no: 'Table 4', title: 'Lumbar selective nerve root (periradicular) injection', speaker: 'Prof. Serdar Kesikburun' },
          { no: 'Table 5', title: 'Superior and middle cluneal nerve blocks', speaker: 'Assoc. Prof. Ergün Mendeş' },
        ] },
      ],
    },
    facultyIds: ['mahir-topaloglu', 'ozge-kenis-coskun', 'serdar-kesikburun', 'ergun-mendes', 'enes-efe-is', 'mert-zure', 'havvanur-albayrak'],
  },
  {
    id: '2027-02-rmk-aimes',
    slug: '2027-02-rmk-aimes',
    registrationOpen: true,
    detail: {
      tr: 'courses/2027-02-rmk-aimes.html',
      en: 'courses/2027-02-rmk-aimes.en.html',
    },
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
    venueFull: {
      tr: 'RMK AIMES — Rahmi M. Koç Girişimsel Tıp, Eğitim ve Simülasyon Akademisi',
      en: 'RMK AIMES — Rahmi M. Koç Academy of Interventional Medicine, Education, and Simulation',
    },
    city: 'Istanbul, Turkey',
    countryCode: 'TR',
    date: {
      tr: '27 Şubat 2027',
      en: 'February 27, 2027',
    },
    iso: '2027-02-27',
    spots: null,
    // 40 places, 8 participants per cadaver table — same format as the
    // other RMK AIMES courses.
    maxSpots: 40,
    // Quoted per physician in USD, KDV included — same shape as January.
    // Two tiers: early bird until 15 Dec 2026, standard afterwards. The lira
    // equivalent is worked out at confirmation time and sent with the bank
    // details, so no exchange rate is frozen here.
    priceGrossUsd: 875,
    earlyBirdPriceGrossUsd: 800,
    earlyBirdDeadline: '2026-12-15',
    kdvRate: 20,
    // Its own registration page — each course keeps its own e-mail thread.
    registerUrl: '/kayit-subat/',
    joints: {
      tr: ['Kalça', 'Diz', 'Ayak Bileği'],
      en: ['Hip', 'Knee', 'Ankle'],
    },
    description: {
      tr: [
        '<strong>"Kadavrada Ultrasonografi Eşliğinde Alt Ekstremite Enjeksiyon Kursu"</strong>, 27 Şubat tarihinde RMK AIMES\'te (Rahmi M. Koç Academy of Interventional Medicine, Education, and Simulation) kapılarını açıyor.',
        'Kas-iskelet sistemi girişimsel uygulamalarındaki güncel yaklaşımlar doğrultusunda hazırlanan kursumuzda; teorik içeriğin ardından taze donmuş kadavra üzerinde gerçekleştirilecek uygulamalı oturumlarla ileri düzey pratik deneyim kazanma fırsatı sunuyoruz. Alt ekstremiteye yönelik enjeksiyon teknikleri, ultrasonografi rehberliğinde adım adım ele alınacak ve interaktif bir öğrenme ortamı sağlanacaktır.',
        'Programımızı; çok açılı demonstrasyonlar, birebir uygulama imkânı ve eğitmenlerle etkileşimli oturumlarla zenginleştirdik. Alanında deneyimli eğitmenler eşliğinde, günlük klinik pratiğinize doğrudan katkı sunacak verimli bir buluşma hazırlamak için tüm hazırlıklarımızı titizlikle sürdürüyoruz.',
      ],
      en: [
        '<strong>"Cadaveric Ultrasound-Guided Lower Extremity Injection Course"</strong> opens its doors on February 27 at RMK AIMES (Rahmi M. Koç Academy of Interventional Medicine, Education, and Simulation).',
        'Designed in line with current approaches in musculoskeletal interventional practice, our course offers the opportunity to gain advanced practical experience through hands-on sessions performed on fresh-frozen cadavers that follow the theoretical content. Injection techniques targeting the lower extremity will be addressed step by step under ultrasonographic guidance, in an interactive learning environment.',
        'We have enriched the program with multi-angle demonstrations, one-on-one practice opportunities, and interactive sessions with the faculty. Alongside experienced instructors in the field, we are meticulously preparing a productive gathering that will directly contribute to your daily clinical practice.',
      ],
    },
    signature: {
      tr: '27 Şubat\'ta RMK AIMES\'te sizleri aramızda görmekten büyük mutluluk duyacağız.',
      en: 'We will be delighted to welcome you at RMK AIMES on February 27.',
    },
    signatureBy: {
      tr: 'Düzenleme Kurulu Adına Doç. Dr. Mahir TOPALOĞLU',
      en: 'On behalf of the Organising Committee, Assoc. Prof. Mahir TOPALOĞLU',
    },
    schedule: {
      tr: [
        { time: '08:30–08:45', type: 'admin', title: 'Açılış, kurs tanıtımı ve grup dağılımı', speaker: 'Düzenleme Kurulu' },
        { time: '08:45–09:30', type: 'lecture', title: 'Kas-İskelet Sistemi Ultrasonografisine Giriş ve Temel Prensipler', speaker: 'Doç. Dr. Mahir Topaloğlu' },
        { time: '09:30–10:15', type: 'lecture', title: 'Kalça Bölgesinin Ultrasonografisi ve Enjeksiyonları (PENG ve ANK bloğu dahil)', speaker: 'Doç. Dr. Enes Efe İş' },
        { time: '10:15–10:30', type: 'admin', title: 'Kahve Arası' },
        { time: '10:30–11:15', type: 'lecture', title: 'Diz Bölgesinin Ultrasonografisi ve Enjeksiyonları', speaker: 'Doç. Dr. Mert Zure' },
        { time: '11:15–12:00', type: 'lecture', title: 'Ayak Bileği ve Ayak Bölgesinin Ultrasonografisi ve Enjeksiyonları', speaker: 'Dr. Öğr. Üyesi Sergen Devran' },
        { time: '12:00–13:00', type: 'admin', title: 'Öğle Arası' },
        { time: '13:00–16:45', type: 'cadaver', title: 'Kadavra Üzerinde Enjeksiyon Pratikleri', speaker: 'Tüm eğitmenler', note: 'Beş istasyon, rotasyonlu — her istasyon 45 dakika' },
        { time: '16:45–17:00', type: 'admin', title: 'Kapanış ve Değerlendirme' },
      ],
      en: [
        { time: '08:30–08:45', type: 'admin', title: 'Welcome, course introduction & group allocation', speaker: 'Organising Committee' },
        { time: '08:45–09:30', type: 'lecture', title: 'Introduction to Musculoskeletal Ultrasound & Core Principles', speaker: 'Assoc. Prof. Mahir Topaloğlu' },
        { time: '09:30–10:15', type: 'lecture', title: 'Hip Region — Ultrasonography & Injections (incl. PENG & ANK block)', speaker: 'Assoc. Prof. Enes Efe İş' },
        { time: '10:15–10:30', type: 'admin', title: 'Coffee Break' },
        { time: '10:30–11:15', type: 'lecture', title: 'Knee Region — Ultrasonography & Injections', speaker: 'Assoc. Prof. Mert Zure' },
        { time: '11:15–12:00', type: 'lecture', title: 'Foot & Ankle Region — Ultrasonography & Injections', speaker: 'Assist. Prof. Sergen Devran' },
        { time: '12:00–13:00', type: 'admin', title: 'Lunch Break' },
        { time: '13:00–16:45', type: 'cadaver', title: 'Cadaveric Injection Practice', speaker: 'All faculty', note: 'Five stations, rotational — 45 minutes per station' },
        { time: '16:45–17:00', type: 'admin', title: 'Closing & Evaluation' },
      ],
    },
    // Afternoon stations run simultaneously; groups rotate through all five.
    // Rotation: 13:00–13:45 · 13:45–14:30 · 14:30–15:15 · 15:15–16:00 · 16:00–16:45
    stations: {
      tr: [
        { no: 'İstasyon 1', title: 'Piriformis + Aşil tendonu + plantar fasya', speaker: 'Doç. Dr. Mahir Topaloğlu' },
        { no: 'İstasyon 2', title: 'Kalça eklemi + PENG bloğu + ANK bloğu', speaker: 'Doç. Dr. Enes Efe İş' },
        { no: 'İstasyon 3', title: 'Diz eklemi + pes anserin + geniküler sinir', speaker: 'Doç. Dr. Mert Zure' },
        { no: 'İstasyon 4', title: 'Tibiotalar eklem + 1. MTF eklem + tarsal tünel', speaker: 'Dr. Öğr. Üyesi Sergen Devran' },
        { no: 'İstasyon 5', title: 'Trokanterik bölge + iliotibial bant', speaker: 'Dr. Öğr. Üyesi Havvanur Albayrak' },
      ],
      en: [
        { no: 'Station 1', title: 'Piriformis + Achilles tendon + plantar fascia', speaker: 'Assoc. Prof. Mahir Topaloğlu' },
        { no: 'Station 2', title: 'Hip joint + PENG block + ANK block', speaker: 'Assoc. Prof. Enes Efe İş' },
        { no: 'Station 3', title: 'Knee joint + pes anserine + genicular nerve', speaker: 'Assoc. Prof. Mert Zure' },
        { no: 'Station 4', title: 'Tibiotalar joint + 1st MTP joint + tarsal tunnel', speaker: 'Assist. Prof. Sergen Devran' },
        { no: 'Station 5', title: 'Trochanteric region + iliotibial band', speaker: 'Assist. Prof. Havvanur Albayrak' },
      ],
    },
    facultyIds: ['mahir-topaloglu', 'enes-efe-is', 'mert-zure', 'sergen-devran', 'havvanur-albayrak'],
  },
  {
    id: '2027-03-rmk-aimes',
    slug: '2027-03-rmk-aimes',
    registrationOpen: true,
    detail: {
      tr: 'courses/2027-03-rmk-aimes.html',
      en: 'courses/2027-03-rmk-aimes.en.html',
    },
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
    venueFull: {
      tr: 'RMK AIMES — Rahmi M. Koç Girişimsel Tıp, Eğitim ve Simülasyon Akademisi',
      en: 'RMK AIMES — Rahmi M. Koç Academy of Interventional Medicine, Education, and Simulation',
    },
    city: 'Istanbul, Turkey',
    countryCode: 'TR',
    date: {
      tr: '3 Nisan 2027',
      en: 'April 3, 2027',
    },
    iso: '2027-04-03',
    spots: null,
    // 40 places, 8 participants per cadaver table — same format as January.
    maxSpots: 40,
    // Same programme as the January course, so the same fee: quoted per
    // physician in USD, KDV included. Two tiers: early bird until 15 Jan 2027,
    // standard afterwards.
    priceGrossUsd: 1125,
    earlyBirdPriceGrossUsd: 1000,
    earlyBirdDeadline: '2027-01-15',
    kdvRate: 20,
    // Its own registration page: /kayit/ stays wired to the January course,
    // and each course's applications keep their own e-mail thread.
    registerUrl: '/kayit-mart/',
    joints: {
      tr: ['Lomber Bölge', 'Sakroiliak Eklem', 'Piriformis', 'Fasya Planları'],
      en: ['Lumbar Region', 'Sacroiliac Joint', 'Piriformis', 'Fascial Planes'],
    },
    description: {
      tr: [
        '<strong>"Kadavrada Ultrasonografi Eşliğinde Lomber Bölge ve Fasya Plan Enjeksiyonları Kursu"</strong>, 3 Nisan tarihinde RMK AIMES\'te (Rahmi M. Koç Academy of Interventional Medicine, Education, and Simulation) kapılarını açıyor.',
        'Kas-iskelet sistemi girişimsel uygulamalarındaki güncel yaklaşımlar doğrultusunda hazırlanan kursumuzda; teorik içeriğin ardından kadavra üzerinde gerçekleştirilecek uygulamalı oturumlarla ileri düzey pratik deneyim kazanma fırsatı sunuyoruz. Lomber bölgeye ve fasya planlarına yönelik enjeksiyon teknikleri, ultrasonografi rehberliğinde adım adım ele alınacak ve interaktif bir öğrenme ortamı sağlanacaktır.',
        'Programımızı; çok açılı demonstrasyonlar, birebir uygulama imkânı ve eğitmenlerle etkileşimli oturumlarla zenginleştirdik. Alanında deneyimli eğitmenler eşliğinde, günlük klinik pratiğinize doğrudan katkı sunacak verimli bir buluşma hazırlamak için tüm hazırlıklarımızı titizlikle sürdürüyoruz.',
      ],
      en: [
        '<strong>"Cadaveric Ultrasound-Guided Lumbar Region and Fascial Plane Injection Course"</strong> opens its doors on April 3 at RMK AIMES (Rahmi M. Koç Academy of Interventional Medicine, Education, and Simulation).',
        'Designed in line with current approaches in musculoskeletal interventional practice, our course offers the opportunity to gain advanced practical experience through hands-on cadaveric sessions that follow the theoretical content. Injection techniques targeting the lumbar region and the fascial planes will be addressed step by step under ultrasonographic guidance, in an interactive learning environment.',
        'We have enriched the program with multi-angle demonstrations, one-on-one practice opportunities, and interactive sessions with the faculty. Alongside experienced instructors in the field, we are meticulously preparing a productive gathering that will directly contribute to your daily clinical practice.',
      ],
    },
    signature: {
      tr: '3 Nisan\'da RMK AIMES\'te sizleri aramızda görmekten büyük mutluluk duyacağız.',
      en: 'We will be delighted to welcome you at RMK AIMES on April 3.',
    },
    signatureBy: {
      tr: 'Düzenleme Kurulu Adına Doç. Dr. Mahir TOPALOĞLU',
      en: 'On behalf of the Organising Committee, Assoc. Prof. Mahir TOPALOĞLU',
    },
    // Same programme as the old January plan; instructor names removed
    // until the April faculty is confirmed.
    schedule: {
      tr: [
        { time: '08:30–08:45', type: 'admin', title: 'Açılış, kurs tanıtımı ve grup dağılımı', speaker: 'Düzenleme Kurulu' },
        { time: '08:45–09:15', type: 'lecture', title: 'Lomber Bölge Sonoanatomi Prensipleri ve Prob-İğne Seçimi' },
        { time: '09:15–09:45', type: 'lecture', title: 'Faset Eklem Enjeksiyonu ve Medial Dal Bloğu' },
        { time: '09:45–10:15', type: 'lecture', title: 'Sakroiliak Eklem ve Piriformis Enjeksiyonları' },
        { time: '10:15–10:30', type: 'admin', title: 'Kahve Arası' },
        { time: '10:30–10:50', type: 'lecture', title: 'Kaudal Epidural Enjeksiyon ve Superior Kluneal Sinir Bloğu' },
        { time: '10:50–11:20', type: 'lecture', title: 'Kasın İçindeki Düğüm: Miyofasyal Ağrı Sendromunda Fasyanın Rolü — Enjeksiyondan Rehabilitasyona' },
        { time: '11:20–12:00', type: 'lecture', title: 'Fasya Plan Blokları (ESP, QL, TLIP, multifidus hidrodiseksiyonu); Komplikasyonlar ve İlk Yardım Kuralları' },
        { time: '12:00–13:00', type: 'admin', title: 'Öğle Arası' },
        { time: '13:00–16:45', type: 'cadaver', title: 'Kadavra Üzerinde Enjeksiyon Pratikleri', speaker: 'Tüm eğitmenler', note: 'Beş istasyon, rotasyonlu — her istasyon 45 dakika' },
        { time: '16:45–17:00', type: 'admin', title: 'Kapanış, değerlendirme ve sertifika töreni' },
      ],
      en: [
        { time: '08:30–08:45', type: 'admin', title: 'Welcome, course introduction & group allocation', speaker: 'Organising Committee' },
        { time: '08:45–09:15', type: 'lecture', title: 'Lumbar Sonoanatomy Principles & Probe–Needle Selection' },
        { time: '09:15–09:45', type: 'lecture', title: 'Facet Joint Injection & Medial Branch Block' },
        { time: '09:45–10:15', type: 'lecture', title: 'Sacroiliac Joint & Piriformis Injections' },
        { time: '10:15–10:30', type: 'admin', title: 'Coffee Break' },
        { time: '10:30–10:50', type: 'lecture', title: 'Caudal Epidural Injection & Superior Cluneal Nerve Block' },
        { time: '10:50–11:20', type: 'lecture', title: 'The Knot Within the Muscle: The Role of Fascia in Myofascial Pain Syndrome — From Injection to Rehabilitation' },
        { time: '11:20–12:00', type: 'lecture', title: 'Fascial Plane Blocks (ESP, QL, TLIP, multifidus hydrodissection); Complications & First-Aid Rules' },
        { time: '12:00–13:00', type: 'admin', title: 'Lunch Break' },
        { time: '13:00–16:45', type: 'cadaver', title: 'Cadaveric Injection Practice', speaker: 'All faculty', note: 'Five stations, rotational — 45 minutes per station' },
        { time: '16:45–17:00', type: 'admin', title: 'Closing, evaluation & certificate ceremony' },
      ],
    },
    // Afternoon stations run simultaneously; groups rotate through all five.
    // Rotation: 13:00–13:45 · 13:45–14:30 · 14:30–15:15 · 15:15–16:00 · 16:00–16:45
    stations: {
      tr: [
        { no: 'İstasyon 1', title: 'Faset eklem + medial dal bloğu' },
        { no: 'İstasyon 2', title: 'Sakroiliak eklem + piriformis' },
        { no: 'İstasyon 3', title: 'Kaudal epidural + superior kluneal sinir bloğu' },
        { no: 'İstasyon 4', title: 'Torakolomber fasya ve multifidus hidrodiseksiyonu + TLIP bloğu' },
        { no: 'İstasyon 5', title: 'Erektör spina plan (ESP) + quadratus lumborum (QL1-2-3)' },
      ],
      en: [
        { no: 'Station 1', title: 'Facet joint + medial branch block' },
        { no: 'Station 2', title: 'Sacroiliac joint + piriformis' },
        { no: 'Station 3', title: 'Caudal epidural + superior cluneal nerve block' },
        { no: 'Station 4', title: 'Thoracolumbar fascia and multifidus hydrodissection + TLIP block' },
        { no: 'Station 5', title: 'Erector spinae plane (ESP) + quadratus lumborum (QL1-2-3)' },
      ],
    },
    facultyIds: [],
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
