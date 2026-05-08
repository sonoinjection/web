/* ============================================================
   faculty.js — instructor roster
   To add: append an entry to FACULTY. Photo lives in assets/faculty/<id>.jpeg.
   ============================================================ */

export const FACULTY = [
  {
    id: 'mahir-topaloglu',
    photo: 'assets/faculty/mahir-topaloglu.jpeg',
    name: 'Doç. Dr. Mahir Topaloğlu',
    nameEn: 'Assoc. Prof. Dr. Mahir Topaloğlu',
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
    id: 'mert-zure',
    photo: 'assets/faculty/mert-zure.jpeg',
    name: 'Dr. Öğr. Üyesi Mert Züre',
    nameEn: 'Asst. Prof. Dr. Mert Züre',
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
    id: 'enes-efe-is',
    photo: 'assets/faculty/enes-efe-is.jpeg',
    name: 'Doç. Dr. Enes Efe İş',
    nameEn: 'Assoc. Prof. Dr. Enes Efe İş',
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
    id: 'havvanur-albayrak',
    photo: 'assets/faculty/havvanur-albayrak.jpeg',
    name: 'Dr. Havvanur Albayrak',
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
];

export function getFaculty(id) {
  return FACULTY.find((f) => f.id === id);
}
