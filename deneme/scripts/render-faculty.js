/* ============================================================
   render-faculty.js — injects faculty cards into target containers
   Usage:
     <div data-faculty-grid data-limit="4"></div>
     <div data-faculty-grid data-ids="mahir-topaloglu,mert-zure"></div>
   ============================================================ */

import { FACULTY } from '../data/faculty.js';
import { STRINGS } from '../data/strings.js';

const lang = document.documentElement.dataset.lang || 'en';
const base = document.documentElement.dataset.base || '';
const t = STRINGS[lang];

function escape(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[c]);
}

function nameFor(f) {
  return lang === 'en' ? (f.nameEn || f.name) : f.name;
}

const ROLE_LABEL_KEY = {
  director: 'directorRole',
  joker: 'jokerRole',
};
const ROLE_BADGE_CLASS = {
  director: 'badge--solid-navy',
  joker: 'badge--amber',
};

function roleLabel(f) {
  const key = ROLE_LABEL_KEY[f.role];
  return key ? t.courseDetail[key] : t.courseDetail.role;
}

function roleBadgeClass(f) {
  return ROLE_BADGE_CLASS[f.role] || 'badge--neutral';
}

function renderFacultyCard(f) {
  const title = f.title && f.title[lang];
  const inst = f.institution && f.institution[lang];
  const city = f.city && f.city[lang];
  const lines = [];
  if (title) lines.push(escape(title));
  if (inst) lines.push(`<strong>${escape(inst)}</strong>`);
  if (city) lines.push(escape(city));
  return `
    <div class="faculty-card">
      <img class="faculty-card__photo" src="${escape(base + f.photo)}" alt="${escape(nameFor(f))}" loading="lazy" />
      <div class="faculty-card__name">${escape(nameFor(f))}</div>
      <div class="faculty-card__title">${lines.join('<br/>')}</div>
      <span class="badge ${roleBadgeClass(f)}">${escape(roleLabel(f))}</span>
    </div>
  `;
}

function renderInto(el) {
  let list = FACULTY;
  if (el.dataset.ids) {
    const ids = el.dataset.ids.split(',').map((s) => s.trim()).filter(Boolean);
    list = ids.map((id) => FACULTY.find((f) => f.id === id)).filter(Boolean);
  }
  const limit = parseInt(el.dataset.limit || '0', 10);
  if (limit > 0) list = list.slice(0, limit);
  el.innerHTML = list.map(renderFacultyCard).join('');
}

document.querySelectorAll('[data-faculty-grid]').forEach(renderInto);
