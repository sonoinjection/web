/* ============================================================
   event-availability.js — updates [data-availability-pill]
   elements on course-detail pages with live remaining-capacity
   data from /api/event-availability.

   Each pill needs:
     <span class="badge badge--success"
           data-availability-pill
           data-event-id="<uuid>">● Yükleniyor…</span>

   Page language read from <html data-lang="tr|en">.
   ============================================================ */

const TEXT = {
  tr: {
    open:      '● Kontenjan açık',
    full:      '● Kontenjan dolu',
    remaining: (n) => `● ${n} kontenjan kaldı`,
  },
  en: {
    open:      '● Open registration',
    full:      '● Sold out',
    remaining: (n) => `● ${n} spots remaining`,
  },
};

const lang = document.documentElement.dataset.lang || 'tr';
const t = TEXT[lang] || TEXT.tr;

const LOW_THRESHOLD = 5;   // ≤ this many → swap success → amber

async function updatePill(el) {
  const eventId = el.dataset.eventId;
  if (!eventId) return;

  try {
    const res = await fetch(`/api/event-availability?id=${encodeURIComponent(eventId)}`);
    if (!res.ok) throw new Error(`availability fetch failed (${res.status})`);
    const data = await res.json();

    // Unlimited capacity → just show "open"
    if (data.available === null || data.available === undefined) {
      el.textContent = t.open;
      return;
    }

    if (data.available <= 0) {
      el.textContent = t.full;
      el.classList.remove('badge--success', 'badge--amber');
      el.classList.add('badge--danger');
      return;
    }

    el.textContent = t.remaining(data.available);
    if (data.available <= LOW_THRESHOLD) {
      el.classList.remove('badge--success');
      el.classList.add('badge--amber');
    } else {
      el.classList.add('badge--success');
      el.classList.remove('badge--amber', 'badge--danger');
    }
  } catch (err) {
    // Soft fail: keep the badge readable rather than empty.
    el.textContent = t.open;
  }
}

document.querySelectorAll('[data-availability-pill]').forEach(updatePill);
