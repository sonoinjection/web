/* ============================================================
   render-courses.js — injects course cards into target containers
   Usage:
     <div data-course-grid data-limit="3"></div>
     <script type="module" src="scripts/render-courses.js"></script>
   The page must set <html data-lang="tr|en"> for language selection.
   ============================================================ */

import { COURSES } from '../data/courses.js';
import { STRINGS } from '../data/strings.js';

const lang = document.documentElement.dataset.lang || 'en';
const base = document.documentElement.dataset.base || '';
const t = STRINGS[lang];

function escape(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[c]);
}

function pinIcon() {
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>';
}
function calIcon() {
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>';
}

function renderCourseCard(c) {
  const detailHref = c.detail[lang];
  const registerHref = c.registerUrl || 'mailto:kayit@sonoinjection.com';
  const ctaLabel = t.courseCard.register;

  return `
    <article class="course-card">
      <a class="course-card__main" href="${escape(detailHref)}">
        <div class="course-card__thumb" style="background: ${c.thumbColor};">
          ${c.thumbImage
            ? `<img class="course-card__thumb-photo" src="${escape(base + c.thumbImage)}" alt="" loading="lazy" /><span class="course-card__thumb-scrim"></span>`
            : '<div class="course-card__thumb-pattern"></div>'}
          <span class="course-card__thumb-label">${escape(c.thumbLabel[lang])}</span>
        </div>
        <div class="course-card__body">
          <div class="course-card__tags">
            <span class="badge badge--teal">${escape(c.level[lang])}</span>
          </div>
          <div class="course-card__title">${escape(c.title[lang])}</div>
          <div class="course-card__meta">
            <span class="course-card__meta-row">${pinIcon()}${escape(c.venue)} · ${escape(c.city)}</span>
            <span class="course-card__meta-row">${calIcon()}${escape(c.date[lang])}</span>
          </div>
        </div>
      </a>
      <div class="course-card__footer course-card__footer--cta-only">
        <a class="btn btn--primary btn--sm" href="${escape(registerHref)}">${escape(ctaLabel)}</a>
      </div>
    </article>
  `;
}

function renderInto(el) {
  const limit = parseInt(el.dataset.limit || '0', 10);
  const list = limit > 0 ? COURSES.slice(0, limit) : COURSES;
  if (list.length === 0) {
    el.innerHTML = `<div class="muted" style="grid-column: 1 / -1; text-align: center; padding: var(--space-12) 0;">${escape(t.listing.empty)}</div>`;
    return;
  }
  el.innerHTML = list.map(renderCourseCard).join('');
}

document.querySelectorAll('[data-course-grid]').forEach(renderInto);
