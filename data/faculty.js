/* ============================================================
   faculty.js — instructor roster
   Order: curated by the course director (Mahir Topaloğlu).
   This is intentional — not by academic rank or alphabet — and
   reflects how the team is presented on the homepage hero strip,
   the faculty teaser grid, and the /faculty page.
   To add: insert at the desired position. Photo lives in
   assets/faculty/<id>.jpeg.
   ============================================================ */

export const FACULTY = [
  {
    id: 'mahir-topaloglu',
    photo: 'assets/faculty/mahir-topaloglu.jpeg',
    name: 'Doç. Dr. Mahir Topaloğlu',
    nameEn: 'Assoc. Prof. Mahir Topaloğlu',
    title: {
      tr: 'Fiziksel Tıp ve Rehabilitasyon',
      en: 'Physical Medicine & Rehabilitation',
    },
    institution: {
      tr: 'Koç Üniversitesi Hastanesi',
      en: 'Koç University Hospital',
    },
    city: {
      tr: 'İstanbul, Türkiye',
      en: 'Istanbul, Turkey',
    },
    role: 'director',
  },
  {
    id: 'ergun-mendes',
    photo: 'assets/faculty/ergun-mendes.jpeg',
    name: 'Doç. Dr. Ergün Mendeş',
    nameEn: 'Assoc. Prof. Ergün Mendeş',
    title: {
      tr: 'Anesteziyoloji ve Reanimasyon',
      en: 'Anesthesiology & Reanimation',
    },
    institution: {
      tr: 'Koç Üniversitesi Hastanesi',
      en: 'Koç University Hospital',
    },
    city: {
      tr: 'İstanbul, Türkiye',
      en: 'Istanbul, Turkey',
    },
    role: 'faculty',
  },
  {
    id: 'enes-efe-is',
    photo: 'assets/faculty/enes-efe-is.jpeg',
    name: 'Doç. Dr. Enes Efe İş',
    nameEn: 'Assoc. Prof. Enes Efe İş',
    title: {
      tr: 'Fiziksel Tıp ve Rehabilitasyon',
      en: 'Physical Medicine & Rehabilitation',
    },
    institution: {
      tr: 'Şişli Hamidiye Etfal Eğitim ve Araştırma Hastanesi',
      en: 'Şişli Hamidiye Etfal Training & Research Hospital',
    },
    city: {
      tr: 'İstanbul, Türkiye',
      en: 'Istanbul, Turkey',
    },
    role: 'faculty',
  },
  {
    id: 'omer-batin-gozubuyuk',
    photo: 'assets/faculty/omer-batin-gozubuyuk.jpeg',
    name: 'Uzm. Dr. Ömer Batın Gözübüyük',
    nameEn: 'Dr. Ömer Batın Gözübüyük',
    title: {
      tr: 'Spor Hekimliği',
      en: 'Sports Medicine',
    },
    institution: { tr: '', en: '' },
    city: {
      tr: 'Melbourne, Avustralya',
      en: 'Melbourne, Australia',
    },
    role: 'faculty',
  },
  {
    id: 'sergen-devran',
    photo: 'assets/faculty/sergen-devran.jpeg',
    name: 'Dr. Öğr. Üyesi Sergen Devran',
    nameEn: 'Dr. Sergen Devran',
    title: {
      tr: 'Spor Hekimliği',
      en: 'Sports Medicine',
    },
    institution: {
      tr: 'İstanbul Tıp Fakültesi',
      en: 'Istanbul Faculty of Medicine',
    },
    city: {
      tr: 'İstanbul, Türkiye',
      en: 'Istanbul, Turkey',
    },
    role: 'faculty',
  },
  {
    id: 'mert-zure',
    photo: 'assets/faculty/mert-zure.jpeg',
    name: 'Dr. Öğr. Üyesi Mert Zure',
    nameEn: 'Dr. Mert Zure',
    title: {
      tr: 'Fiziksel Tıp ve Rehabilitasyon',
      en: 'Physical Medicine & Rehabilitation',
    },
    institution: {
      tr: 'Kanuni Sultan Süleyman Eğitim ve Araştırma Hastanesi',
      en: 'Kanuni Sultan Süleyman Training & Research Hospital',
    },
    city: {
      tr: 'İstanbul, Türkiye',
      en: 'Istanbul, Turkey',
    },
    role: 'faculty',
  },
  {
    id: 'havvanur-albayrak',
    photo: 'assets/faculty/havvanur-albayrak.jpeg',
    name: 'Uzm. Dr. Havvanur Albayrak',
    nameEn: 'Dr. Havvanur Albayrak',
    title: {
      tr: 'Fiziksel Tıp ve Rehabilitasyon',
      en: 'Physical Medicine & Rehabilitation',
    },
    institution: {
      tr: 'Koç Üniversitesi Hastanesi',
      en: 'Koç University Hospital',
    },
    city: {
      tr: 'İstanbul, Türkiye',
      en: 'Istanbul, Turkey',
    },
    role: 'faculty',
  },
  {
    id: 'selim-sezikli',
    photo: 'assets/faculty/selim-sezikli.jpeg',
    name: 'Uzm. Dr. Selim Sezikli',
    nameEn: 'Dr. Selim Sezikli',
    title: {
      tr: 'Fiziksel Tıp ve Rehabilitasyon',
      en: 'Physical Medicine & Rehabilitation',
    },
    institution: {
      tr: 'İstanbul Fizik Tedavi ve Rehabilitasyon Eğitim ve Araştırma Hastanesi',
      en: 'Istanbul Physical Therapy & Rehabilitation Training & Research Hospital',
    },
    city: {
      tr: 'İstanbul, Türkiye',
      en: 'Istanbul, Turkey',
    },
    role: 'faculty',
  },
];

export function getFaculty(id) {
  return FACULTY.find((f) => f.id === id);
}
