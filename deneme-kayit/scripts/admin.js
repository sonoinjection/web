/* ============================================================
   admin.js — registration admin board (live Supabase data)
   State, render functions, optimistic updates with revert,
   detail modal, six action dialogs (status + log entry).
   ============================================================ */

import { adminApi } from './admin-api.js';
import {
  STATUS_LABELS_TR,
  ENTRY_TYPE_LABELS_TR,
  CONTACT_METHOD_LABELS_TR,
  ALLOWED_TRANSITIONS,
  TRANSITION_ACTION_LABELS_TR,
  SPECIALTY_LABELS_TR,
  POSITION_LABELS_TR,
  formatDateTimeTr,
  formatEventDateTr,
  formatTRY,
  escapeHtml,
} from './shared.js';

// ── DOM hooks ─────────────────────────────────────────────────
const els = {
  eventSelect:           document.querySelector('[data-event-select]'),
  eventPanel:            document.querySelector('[data-event-panel]'),
  stats:                 document.querySelector('[data-stats]'),
  filterStatus:          document.querySelector('[data-filter-status]'),
  filterSearch:          document.querySelector('[data-filter-search]'),
  statChips:             document.querySelector('[data-stat-chips]'),
  tableBody:             document.querySelector('[data-table-body]'),
  rowCount:              document.querySelector('[data-row-count]'),
  detailModal:           document.querySelector('[data-detail-modal]'),
  detailContent:         document.querySelector('[data-detail-content]'),
  actionDialog:          document.querySelector('[data-action-dialog]'),
  actionDialogContent:   document.querySelector('[data-action-dialog-content]'),
  toastContainer:        document.querySelector('[data-toast-container]'),
};

// ── State ─────────────────────────────────────────────────────
const state = {
  events: [],
  selectedEventId: null,
  selectedEvent: null,
  registrations: [],
  loading: { events: false, registrations: false, detail: false },
  filters: {
    statuses: new Set(['applied', 'paid', 'cancelled', 'refunded']),
    search: '',
  },
  detail: { open: false, registration: null, log: [] },
  pendingDialog: null,            // 'paid' | 'cancelled' | 'refunded' | 'reactivate' | 'note' | 'contact'
  pendingDialogTransition: null,  // for reactivate, the inferred new status
};

// ── Boot ──────────────────────────────────────────────────────
boot();

async function boot() {
  // Event-select listener.
  els.eventSelect.addEventListener('change', () => {
    selectEvent(els.eventSelect.value);
  });
  els.filterSearch?.addEventListener('input', (e) => {
    state.filters.search = e.target.value || '';
    renderTable();
  });
  // Status filter is a checkbox group inside [data-filter-status].
  els.filterStatus?.addEventListener('change', (e) => {
    if (!e.target.matches('input[type="checkbox"]')) return;
    const checked = els.filterStatus.querySelectorAll('input[type="checkbox"]:checked');
    state.filters.statuses = new Set(Array.from(checked).map((cb) => cb.value));
    renderStats();
    renderTable();
  });
  els.detailModal?.addEventListener('click', (e) => {
    if (e.target === els.detailModal) closeDetail();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (state.pendingDialog) closeActionDialog();
      else if (state.detail.open) closeDetail();
    }
  });

  await loadEvents();
}

// ── Loaders ───────────────────────────────────────────────────
async function loadEvents() {
  state.loading.events = true;
  renderEventDropdown();
  try {
    const { events } = await adminApi.listEvents();
    state.events = events;
    if (!state.selectedEventId && events.length > 0) {
      state.selectedEventId = events[0].id;
      state.selectedEvent = events[0];
    }
    renderEventDropdown();
    renderEventPanel();
    if (state.selectedEventId) await loadRegistrations();
  } catch (err) {
    toast(err.message || 'Etkinlikler yüklenemedi.', 'error');
  } finally {
    state.loading.events = false;
  }
}

async function loadRegistrations() {
  state.loading.registrations = true;
  renderTable();
  try {
    const { registrations } = await adminApi.listRegistrations(state.selectedEventId);
    state.registrations = registrations;
    renderStats();
    renderTable();
  } catch (err) {
    toast(err.message || 'Başvurular yüklenemedi.', 'error');
  } finally {
    state.loading.registrations = false;
  }
}

async function selectEvent(eventId) {
  if (!eventId) return;
  state.selectedEventId = eventId;
  state.selectedEvent = state.events.find((e) => e.id === eventId) || null;
  state.registrations = [];
  renderEventPanel();
  renderStats();
  renderTable();
  await loadRegistrations();
}

// ── Rendering ─────────────────────────────────────────────────
function renderEventDropdown() {
  if (!els.eventSelect) return;
  if (state.events.length === 0) {
    els.eventSelect.innerHTML = `<option value="">Henüz etkinlik yok</option>`;
    els.eventSelect.disabled = true;
    return;
  }
  els.eventSelect.disabled = false;
  els.eventSelect.innerHTML = state.events.map((e) => {
    const label = `${formatEventDateTr(e.event_date)} — ${escapeHtml(e.title_tr)}`;
    const selected = e.id === state.selectedEventId ? ' selected' : '';
    return `<option value="${escapeHtml(e.id)}"${selected}>${label}</option>`;
  }).join('');
}

function renderEventPanel() {
  if (!els.eventPanel) return;
  const e = state.selectedEvent;
  if (!e) {
    els.eventPanel.innerHTML = '';
    return;
  }
  const grossDisplay = e.price_gross_try !== null && e.price_gross_try !== undefined
    ? formatTRY(e.price_gross_try)
    : '—';
  els.eventPanel.innerHTML = `
    <details class="event-panel" open>
      <summary>
        <span class="event-panel__title">Etkinlik Bilgisi</span>
        <span class="event-panel__expand">aç/kapat</span>
      </summary>
      <form class="event-panel__form" data-event-form>
        <div class="form-field">
          <label class="form-label" for="ev-title">Başlık</label>
          <input class="form-input" id="ev-title" name="title_tr" type="text" value="${escapeHtml(e.title_tr || '')}" required />
        </div>
        <div class="form-field">
          <label class="form-label" for="ev-desc">Açıklama</label>
          <textarea class="form-textarea" id="ev-desc" name="description_tr" rows="3">${escapeHtml(e.description_tr || '')}</textarea>
        </div>
        <div class="form-row">
          <div class="form-field">
            <label class="form-label" for="ev-date">Tarih</label>
            <input class="form-input" id="ev-date" name="event_date" type="date" value="${escapeHtml(e.event_date || '')}" required />
          </div>
          <div class="form-field">
            <label class="form-label" for="ev-loc">Yer</label>
            <input class="form-input" id="ev-loc" name="location_tr" type="text" value="${escapeHtml(e.location_tr || '')}" required />
          </div>
        </div>
        <div class="form-row">
          <div class="form-field">
            <label class="form-label" for="ev-cap">Kapasite</label>
            <input class="form-input" id="ev-cap" name="capacity" type="number" min="0" step="1" value="${e.capacity ?? ''}" placeholder="Sınırsız" />
          </div>
          <div class="form-field">
            <label class="form-label" for="ev-res">Dış Rezervasyon</label>
            <input class="form-input" id="ev-res" name="reserved_for_external" type="number" min="0" step="1" value="${e.reserved_for_external ?? 0}" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-field">
            <label class="form-label" for="ev-price">Fiyat (KDV Hariç)</label>
            <input class="form-input" id="ev-price" name="price_net_try" type="number" min="0" step="0.01" value="${e.price_net_try ?? ''}" />
          </div>
          <div class="form-field">
            <label class="form-label" for="ev-kdv">KDV Oranı (%)</label>
            <input class="form-input" id="ev-kdv" name="kdv_rate" type="number" min="0" step="0.01" value="${e.kdv_rate ?? 20}" />
          </div>
        </div>
        <div class="form-field">
          <label class="form-label">Brüt (Otomatik)</label>
          <div class="event-panel__readonly">${escapeHtml(grossDisplay)}</div>
        </div>
        <div class="form-field">
          <label class="form-label" for="ev-bank">Banka Bilgileri</label>
          <textarea class="form-textarea" id="ev-bank" name="bank_details_tr" rows="4">${escapeHtml(e.bank_details_tr || '')}</textarea>
        </div>
        <div class="form-field event-panel__toggle-field">
          <label class="event-panel__toggle">
            <input type="checkbox" name="is_active" ${e.is_active ? 'checked' : ''} />
            <span>Aktif (kayıt alıyor)</span>
          </label>
        </div>
        <div class="form-actions">
          <button class="btn btn--ghost btn--sm" type="button" data-event-reset>Vazgeç</button>
          <button class="btn btn--primary btn--sm" type="submit" data-event-save disabled>Kaydet</button>
        </div>
      </form>
    </details>
  `;
  attachEventFormHandlers();
}

function attachEventFormHandlers() {
  const form = els.eventPanel.querySelector('[data-event-form]');
  if (!form) return;
  const saveBtn = form.querySelector('[data-event-save]');
  const resetBtn = form.querySelector('[data-event-reset]');
  const initial = collectEventForm(form);

  const update = () => {
    const current = collectEventForm(form);
    saveBtn.disabled = JSON.stringify(current) === JSON.stringify(initial);
  };
  form.addEventListener('input', update);
  form.addEventListener('change', update);

  resetBtn.addEventListener('click', () => renderEventPanel());

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    saveBtn.disabled = true;
    const fields = collectEventForm(form);
    try {
      const { event } = await adminApi.updateEvent({
        event_id: state.selectedEventId,
        fields,
      });
      const idx = state.events.findIndex((x) => x.id === event.id);
      if (idx >= 0) state.events[idx] = { ...state.events[idx], ...event };
      state.selectedEvent = { ...state.selectedEvent, ...event };
      renderEventDropdown();
      renderEventPanel();
      renderStats();
      toast('Etkinlik güncellendi.', 'success');
    } catch (err) {
      toast(err.message || 'Etkinlik güncellenemedi.', 'error');
      saveBtn.disabled = false;
    }
  });
}

function collectEventForm(form) {
  const f = form.elements;
  const cap = f.capacity.value === '' ? null : Number(f.capacity.value);
  const price = f.price_net_try.value === '' ? null : Number(f.price_net_try.value);
  return {
    title_tr: f.title_tr.value.trim(),
    description_tr: f.description_tr.value.trim() || null,
    event_date: f.event_date.value,
    location_tr: f.location_tr.value.trim(),
    capacity: cap,
    reserved_for_external: Number(f.reserved_for_external.value || 0),
    price_net_try: price,
    kdv_rate: Number(f.kdv_rate.value || 0),
    bank_details_tr: f.bank_details_tr.value.trim() || null,
    is_active: f.is_active.checked,
  };
}

function renderStats() {
  if (!els.stats) return;
  const e = state.selectedEvent;
  if (!e) { els.stats.innerHTML = ''; return; }

  const counts = countByStatus(state.registrations);
  const active = counts.applied + counts.paid;
  const total = state.registrations.length;
  const reserved = e.reserved_for_external || 0;

  let capacityLine = 'Etkili Kapasite: Sınırsız';
  let onlineFreeLine = 'Online Boş: Sınırsız';
  if (e.capacity !== null && e.capacity !== undefined) {
    const effective = e.capacity - reserved;
    capacityLine = `Etkili Kapasite: ${effective}`;
    onlineFreeLine = `Online Boş: ${Math.max(0, effective - active)}`;
  }

  const fillLine = e.capacity !== null && e.capacity !== undefined
    ? `Doluluk: ${active} / ${e.capacity} aktif başvuru`
    : `Doluluk: ${active} aktif başvuru`;

  els.stats.innerHTML = `
    <div class="stats-row">
      <div class="stats-row__line">${escapeHtml(fillLine)}   |   ${escapeHtml(capacityLine)}</div>
      <div class="stats-row__line">
        Aktif (Başvurdu+Ödendi): <strong>${active}</strong>
         · İptal: <strong>${counts.cancelled}</strong>
         · İade: <strong>${counts.refunded}</strong>
         · ${escapeHtml(onlineFreeLine)}
      </div>
    </div>
    <div class="stat-chips" data-chips>
      ${chipHtml('all',       'Tümü',     total)}
      ${chipHtml('applied',   STATUS_LABELS_TR.applied,   counts.applied)}
      ${chipHtml('paid',      STATUS_LABELS_TR.paid,      counts.paid)}
      ${chipHtml('cancelled', STATUS_LABELS_TR.cancelled, counts.cancelled)}
      ${chipHtml('refunded',  STATUS_LABELS_TR.refunded,  counts.refunded)}
    </div>
  `;

  els.stats.querySelectorAll('[data-chip]').forEach((chip) => {
    chip.addEventListener('click', () => {
      const value = chip.dataset.chip;
      if (value === 'all') {
        state.filters.statuses = new Set(['applied', 'paid', 'cancelled', 'refunded']);
      } else {
        state.filters.statuses = new Set([value]);
      }
      syncStatusFilterUI();
      renderStats();
      renderTable();
    });
  });
}

function chipHtml(value, label, count) {
  const active = state.filters.statuses.size === 1 && state.filters.statuses.has(value)
    || (value === 'all' && state.filters.statuses.size === 4);
  return `
    <button type="button" class="stat-chip ${active ? 'is-active' : ''}" data-chip="${value}">
      <span class="stat-chip__label">${escapeHtml(label)}</span>
      <span class="stat-chip__count">${count}</span>
    </button>
  `;
}

function countByStatus(rows) {
  const c = { applied: 0, paid: 0, cancelled: 0, refunded: 0 };
  for (const r of rows) {
    if (Object.prototype.hasOwnProperty.call(c, r.status)) c[r.status] += 1;
  }
  return c;
}

function syncStatusFilterUI() {
  if (!els.filterStatus) return;
  els.filterStatus.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
    cb.checked = state.filters.statuses.has(cb.value);
  });
}

function renderTable() {
  if (!els.tableBody) return;
  const visible = visibleRegistrations();
  if (state.loading.registrations && state.registrations.length === 0) {
    els.tableBody.innerHTML = `<tr><td colspan="8" class="table-empty">Yükleniyor…</td></tr>`;
  } else if (state.registrations.length === 0) {
    els.tableBody.innerHTML = `<tr><td colspan="8" class="table-empty">Bu etkinlikte henüz başvuru yok.</td></tr>`;
  } else if (visible.length === 0) {
    els.tableBody.innerHTML = `<tr><td colspan="8" class="table-empty">Filtreyle eşleşen başvuru yok.</td></tr>`;
  } else {
    els.tableBody.innerHTML = visible.map(renderRow).join('');
  }
  if (els.rowCount) {
    els.rowCount.textContent = `${visible.length} / ${state.registrations.length} başvuru`;
  }

  els.tableBody.querySelectorAll('[data-row]').forEach((tr) => {
    tr.addEventListener('click', () => openDetail(tr.dataset.row));
  });
}

function visibleRegistrations() {
  const search = state.filters.search.trim().toLocaleLowerCase('tr-TR');
  return state.registrations.filter((r) => {
    if (!state.filters.statuses.has(r.status)) return false;
    if (!search) return true;
    const haystack = [
      r.first_name, r.last_name, r.email, r.institution,
    ].filter(Boolean).join(' ').toLocaleLowerCase('tr-TR');
    return haystack.includes(search);
  });
}

function renderRow(r) {
  return `
    <tr data-row="${escapeHtml(r.id)}">
      <td>
        <div class="cell-name">${escapeHtml(`${r.first_name} ${r.last_name}`.trim())}</div>
      </td>
      <td>${escapeHtml(r.email)}</td>
      <td>${escapeHtml(r.phone)}</td>
      <td>${escapeHtml(SPECIALTY_LABELS_TR[r.specialty] ?? r.specialty)}</td>
      <td>${escapeHtml(POSITION_LABELS_TR[r.position] ?? r.position)}</td>
      <td>${escapeHtml(r.institution)}</td>
      <td>${statusPill(r.status)}</td>
      <td><span class="cell-meta">${escapeHtml(formatDateTimeTr(r.registered_at))}</span></td>
    </tr>
  `;
}

function statusPill(status) {
  const label = STATUS_LABELS_TR[status] || status;
  return `<span class="status-pill status-pill--${status}">${escapeHtml(label)}</span>`;
}

// ── Detail modal ──────────────────────────────────────────────
async function openDetail(registrationId) {
  state.detail = { open: true, registration: null, log: [] };
  state.loading.detail = true;
  renderDetailModal();
  els.detailModal.classList.add('is-open');
  document.body.classList.add('is-modal-open');

  try {
    const { registration, log } = await adminApi.getRegistration(registrationId);
    state.detail.registration = registration;
    state.detail.log = log;
    state.loading.detail = false;
    renderDetailModal();
  } catch (err) {
    toast(err.message || 'Kayıt yüklenemedi.', 'error');
    closeDetail();
  }
}

function closeDetail() {
  state.detail = { open: false, registration: null, log: [] };
  els.detailModal.classList.remove('is-open');
  document.body.classList.remove('is-modal-open');
  els.detailContent.innerHTML = '';
}

function renderDetailModal() {
  if (!els.detailContent) return;
  if (state.loading.detail || !state.detail.registration) {
    els.detailContent.innerHTML = `<div class="modal__loading">Yükleniyor…</div>`;
    return;
  }
  const r = state.detail.registration;
  const log = state.detail.log || [];

  const allowed = ALLOWED_TRANSITIONS[r.status] || [];
  const actionButtons = allowed.map((newStatus) => {
    const label = TRANSITION_ACTION_LABELS_TR[`${r.status}→${newStatus}`] || newStatus;
    const variant = newStatus === 'paid' || newStatus === 'applied' ? 'btn--primary' : 'btn--ghost';
    return `<button type="button" class="btn ${variant} btn--sm" data-action="${actionFromTransition(r.status, newStatus)}">${escapeHtml(label)}</button>`;
  }).join('');

  els.detailContent.innerHTML = `
    <header class="modal__header">
      <div class="modal__heading">
        ${statusPill(r.status)}
        <span class="modal__name">${escapeHtml(`${r.first_name} ${r.last_name}`.trim())}</span>
      </div>
      <button type="button" class="modal__close" data-detail-close aria-label="Kapat">×</button>
    </header>

    <section class="modal__section">
      <h3 class="modal__section-title">Kişisel Bilgiler</h3>
      <form class="form" data-reg-form>
        <div class="form-row">
          <div class="form-field"><label class="form-label">Ad</label>
            <input class="form-input" name="first_name" value="${escapeHtml(r.first_name || '')}" required /></div>
          <div class="form-field"><label class="form-label">Soyad</label>
            <input class="form-input" name="last_name" value="${escapeHtml(r.last_name || '')}" required /></div>
        </div>
        <div class="form-row">
          <div class="form-field"><label class="form-label">E-posta</label>
            <input class="form-input" name="email" type="email" value="${escapeHtml(r.email || '')}" required /></div>
          <div class="form-field"><label class="form-label">Telefon</label>
            <input class="form-input" name="phone" type="tel" value="${escapeHtml(r.phone || '')}" required /></div>
        </div>
        <div class="form-row">
          <div class="form-field"><label class="form-label">Uzmanlık</label>
            <select class="form-select" name="specialty">${specialtyOptions(r.specialty)}</select></div>
          <div class="form-field"><label class="form-label">Pozisyon</label>
            <select class="form-select" name="position">${positionOptions(r.position)}</select></div>
        </div>
        <div class="form-field"><label class="form-label">Kurum</label>
          <input class="form-input" name="institution" value="${escapeHtml(r.institution || '')}" required /></div>
        <div class="form-field"><label class="form-label">Notlar (form)</label>
          <textarea class="form-textarea" name="notes" rows="3">${escapeHtml(r.notes || '')}</textarea></div>
        <div class="form-actions">
          <button type="submit" class="btn btn--primary btn--sm" data-reg-save disabled>Bilgileri Kaydet</button>
        </div>
      </form>
    </section>

    <section class="modal__section">
      <h3 class="modal__section-title">Durum İşlemleri</h3>
      <div class="action-row">${actionButtons || '<span class="muted">Mevcut durumda işlem yok.</span>'}</div>
    </section>

    <section class="modal__section">
      <h3 class="modal__section-title">Geçmiş</h3>
      <div class="action-row">
        <button type="button" class="btn btn--ghost btn--sm" data-add-note>+ Not Ekle</button>
        <button type="button" class="btn btn--ghost btn--sm" data-add-contact>+ İletişim Kaydı Ekle</button>
      </div>
      <div class="timeline">${log.map(renderLogEntry).join('') || '<div class="muted">Henüz kayıt yok.</div>'}</div>
    </section>
  `;

  attachDetailHandlers();
}

function attachDetailHandlers() {
  els.detailContent.querySelector('[data-detail-close]')?.addEventListener('click', closeDetail);

  const form = els.detailContent.querySelector('[data-reg-form]');
  if (form) {
    const saveBtn = form.querySelector('[data-reg-save]');
    const initial = collectRegForm(form);
    const update = () => {
      saveBtn.disabled = JSON.stringify(collectRegForm(form)) === JSON.stringify(initial);
    };
    form.addEventListener('input', update);
    form.addEventListener('change', update);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      saveRegistrationFields(collectRegForm(form));
    });
  }

  els.detailContent.querySelectorAll('[data-action]').forEach((btn) => {
    btn.addEventListener('click', () => openActionDialog(btn.dataset.action));
  });
  els.detailContent.querySelector('[data-add-note]')?.addEventListener('click', () => openActionDialog('note'));
  els.detailContent.querySelector('[data-add-contact]')?.addEventListener('click', () => openActionDialog('contact'));
}

function collectRegForm(form) {
  const f = form.elements;
  return {
    first_name: f.first_name.value.trim(),
    last_name:  f.last_name.value.trim(),
    email:      f.email.value.trim().toLowerCase(),
    phone:      f.phone.value.trim(),
    specialty:  f.specialty.value,
    position:   f.position.value,
    institution: f.institution.value.trim(),
    notes:      f.notes.value.trim(),
  };
}

function specialtyOptions(current) {
  return Object.entries(SPECIALTY_LABELS_TR).map(([v, l]) =>
    `<option value="${v}"${v === current ? ' selected' : ''}>${escapeHtml(l)}</option>`,
  ).join('');
}
function positionOptions(current) {
  return Object.entries(POSITION_LABELS_TR).map(([v, l]) =>
    `<option value="${v}"${v === current ? ' selected' : ''}>${escapeHtml(l)}</option>`,
  ).join('');
}

function actionFromTransition(oldStatus, newStatus) {
  if (newStatus === 'paid' && oldStatus === 'applied') return 'paid';
  if (newStatus === 'cancelled') return 'cancelled';
  if (newStatus === 'refunded') return 'refunded';
  if ((oldStatus === 'cancelled' && newStatus === 'applied') ||
      (oldStatus === 'refunded' && newStatus === 'paid')) return 'reactivate';
  return null;
}

function renderLogEntry(entry) {
  const when = formatDateTimeTr(entry.created_at);
  const typeLabel = ENTRY_TYPE_LABELS_TR[entry.entry_type] || entry.entry_type;
  let extra = '';
  if (entry.entry_type === 'contact' && entry.metadata?.contact_method) {
    extra = `<span class="timeline__chip">${escapeHtml(CONTACT_METHOD_LABELS_TR[entry.metadata.contact_method] || entry.metadata.contact_method)}</span>`;
  }
  if (entry.entry_type === 'status_change' && entry.metadata) {
    const m = entry.metadata;
    const bits = [];
    if (m.payment_reference) bits.push(`Ödeme ref: ${escapeHtml(m.payment_reference)}`);
    if (m.refund_amount !== undefined && m.refund_amount !== null) {
      bits.push(`İade: ${escapeHtml(formatTRY(m.refund_amount) || String(m.refund_amount))}`);
    }
    if (m.reason) bits.push(`Sebep: ${escapeHtml(m.reason)}`);
    if (bits.length > 0) extra = `<div class="timeline__metadata">${bits.join(' · ')}</div>`;
  }
  return `
    <article class="timeline__entry timeline__entry--${entry.entry_type}">
      <header class="timeline__header">
        <span class="timeline__type">${escapeHtml(typeLabel)}</span>
        ${extra ? extra : ''}
        <time class="timeline__time">${escapeHtml(when)}</time>
      </header>
      <div class="timeline__message">${escapeHtml(entry.message || '')}</div>
      <footer class="timeline__by">${escapeHtml(entry.created_by || '')}</footer>
    </article>
  `;
}

// ── Action dialogs ────────────────────────────────────────────
function openActionDialog(kind) {
  state.pendingDialog = kind;
  renderActionDialog();
  els.actionDialog.classList.add('is-open');
}
function closeActionDialog() {
  state.pendingDialog = null;
  els.actionDialog.classList.remove('is-open');
  els.actionDialogContent.innerHTML = '';
}

function renderActionDialog() {
  if (!els.actionDialogContent || !state.pendingDialog) return;
  const r = state.detail.registration;
  if (!r) { closeActionDialog(); return; }

  const def = DIALOG_DEFS[state.pendingDialog];
  if (!def) return;

  els.actionDialogContent.innerHTML = `
    <header class="modal__header">
      <h3 class="modal__title">${escapeHtml(def.title)}</h3>
      <button type="button" class="modal__close" data-action-cancel aria-label="Vazgeç">×</button>
    </header>
    <form class="form" data-action-form>
      ${def.body(r)}
      <div class="form-actions">
        <button type="button" class="btn btn--ghost btn--sm" data-action-cancel>Vazgeç</button>
        <button type="submit" class="btn ${def.confirmVariant || 'btn--primary'} btn--sm" data-action-confirm disabled>${escapeHtml(def.confirmLabel)}</button>
      </div>
    </form>
  `;

  const form = els.actionDialogContent.querySelector('[data-action-form]');
  const confirmBtn = form.querySelector('[data-action-confirm]');
  const update = () => { confirmBtn.disabled = !def.canConfirm(form); };
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  update();

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    confirmBtn.disabled = true;
    try {
      await def.onConfirm(form, r);
      closeActionDialog();
    } catch (err) {
      toast(err.message || 'İşlem başarısız.', 'error');
      confirmBtn.disabled = false;
    }
  });

  els.actionDialogContent.querySelectorAll('[data-action-cancel]').forEach((b) => {
    b.addEventListener('click', closeActionDialog);
  });
}

const DIALOG_DEFS = {
  paid: {
    title: 'Ödeme Onayla',
    confirmLabel: 'Onayla',
    body: () => `
      <p class="form-helper">Bu kaydı "Ödendi" olarak işaretlemek üzeresiniz.</p>
      <label class="form-checkbox">
        <input type="checkbox" name="informed_confirmed" />
        <span>Ödemenin alındığını teyit ediyorum.</span>
      </label>
      <div class="form-field">
        <label class="form-label" for="dlg-payref">Ödeme referansı (opsiyonel)</label>
        <input class="form-input" id="dlg-payref" name="payment_reference" type="text" />
      </div>
    `,
    canConfirm: (form) => form.elements.informed_confirmed.checked,
    onConfirm: async (form, r) => {
      const payment_reference = form.elements.payment_reference.value.trim() || null;
      await transitionStatus(r.id, 'paid', {
        payment_reference,
        informed_confirmed: true,
        send_email: true,
      });
    },
  },

  cancelled: {
    title: 'İptal Et',
    confirmLabel: 'İptal Et',
    confirmVariant: 'btn--danger',
    body: () => `
      <p class="form-helper">Bu kaydı iptal etmek üzeresiniz.</p>
      <label class="form-checkbox">
        <input type="checkbox" name="informed_confirmed" />
        <span>Katılımcı bu iptalden haberdar edildi.</span>
      </label>
      <label class="form-checkbox">
        <input type="checkbox" name="send_email" />
        <span>Katılımcıya iptal e-postası gönder.</span>
      </label>
      <div class="form-field">
        <label class="form-label" for="dlg-reason">İptal sebebi (opsiyonel)</label>
        <input class="form-input" id="dlg-reason" name="reason" type="text" />
      </div>
    `,
    canConfirm: (form) => form.elements.informed_confirmed.checked,
    onConfirm: async (form, r) => {
      await transitionStatus(r.id, 'cancelled', {
        reason: form.elements.reason.value.trim() || null,
        informed_confirmed: true,
        send_email: form.elements.send_email.checked,
      });
    },
  },

  refunded: {
    title: 'İade Et',
    confirmLabel: 'İade Et',
    confirmVariant: 'btn--danger',
    body: () => `
      <p class="form-helper">Bu kaydı iade olarak işaretlemek üzeresiniz.</p>
      <label class="form-checkbox">
        <input type="checkbox" name="informed_confirmed" />
        <span>Katılımcı bu iadeden haberdar edildi.</span>
      </label>
      <label class="form-checkbox">
        <input type="checkbox" name="refund_completed_confirmed" />
        <span>İade işlemi banka tarafında tamamlandı.</span>
      </label>
      <label class="form-checkbox">
        <input type="checkbox" name="send_email" />
        <span>Katılımcıya iade e-postası gönder.</span>
      </label>
      <div class="form-row">
        <div class="form-field">
          <label class="form-label" for="dlg-refund-amount">İade tutarı (TL, opsiyonel)</label>
          <input class="form-input" id="dlg-refund-amount" name="refund_amount" type="number" min="0" step="0.01" />
        </div>
      </div>
      <div class="form-field">
        <label class="form-label" for="dlg-refund-notes">Notlar (opsiyonel)</label>
        <textarea class="form-textarea" id="dlg-refund-notes" name="reason" rows="2"></textarea>
      </div>
    `,
    canConfirm: (form) =>
      form.elements.informed_confirmed.checked && form.elements.refund_completed_confirmed.checked,
    onConfirm: async (form, r) => {
      const amount = form.elements.refund_amount.value;
      await transitionStatus(r.id, 'refunded', {
        reason: form.elements.reason.value.trim() || null,
        refund_amount: amount === '' ? null : Number(amount),
        informed_confirmed: true,
        refund_completed_confirmed: true,
        send_email: form.elements.send_email.checked,
      });
    },
  },

  reactivate: {
    title: 'Yeniden Aktive Et',
    confirmLabel: 'Yeniden Aktive Et',
    body: () => `
      <p class="form-helper">Bu kaydı yeniden aktive etmek üzeresiniz.</p>
      <div class="form-field">
        <label class="form-label" for="dlg-react-reason">Sebep (opsiyonel)</label>
        <input class="form-input" id="dlg-react-reason" name="reason" type="text" />
      </div>
    `,
    canConfirm: () => true,
    onConfirm: async (form, r) => {
      const newStatus = r.status === 'cancelled' ? 'applied' : 'paid';
      await transitionStatus(r.id, newStatus, {
        reason: form.elements.reason.value.trim() || null,
      });
    },
  },

  note: {
    title: 'Yeni Not',
    confirmLabel: 'Kaydet',
    body: () => `
      <div class="form-field">
        <label class="form-label" for="dlg-note">Not</label>
        <textarea class="form-textarea" id="dlg-note" name="message" rows="5" required></textarea>
      </div>
    `,
    canConfirm: (form) => form.elements.message.value.trim().length > 0,
    onConfirm: async (form, r) => {
      const message = form.elements.message.value.trim();
      const { entry } = await adminApi.addLogEntry({
        registration_id: r.id,
        entry_type: 'admin_note',
        message,
      });
      if (entry) state.detail.log = [entry, ...state.detail.log];
      renderDetailModal();
      toast('Not eklendi.', 'success');
    },
  },

  contact: {
    title: 'Yeni İletişim Kaydı',
    confirmLabel: 'Kaydet',
    body: () => `
      <fieldset class="form-fieldset">
        <legend class="form-label">İletişim yöntemi</legend>
        <label class="form-radio"><input type="radio" name="contact_method" value="phone" required /> <span>Telefon</span></label>
        <label class="form-radio"><input type="radio" name="contact_method" value="email" /> <span>E-posta</span></label>
        <label class="form-radio"><input type="radio" name="contact_method" value="in_person" /> <span>Yüz yüze</span></label>
      </fieldset>
      <div class="form-field">
        <label class="form-label" for="dlg-contact-msg">Açıklama</label>
        <textarea class="form-textarea" id="dlg-contact-msg" name="message" rows="4" required></textarea>
      </div>
    `,
    canConfirm: (form) => {
      const m = form.elements.message.value.trim().length > 0;
      const c = !!form.querySelector('input[name="contact_method"]:checked');
      return m && c;
    },
    onConfirm: async (form, r) => {
      const method = form.querySelector('input[name="contact_method"]:checked').value;
      const message = form.elements.message.value.trim();
      const { entry } = await adminApi.addLogEntry({
        registration_id: r.id,
        entry_type: 'contact',
        message,
        metadata: { contact_method: method },
      });
      if (entry) state.detail.log = [entry, ...state.detail.log];
      renderDetailModal();
      toast('İletişim kaydı eklendi.', 'success');
    },
  },
};

// ── State mutators with optimistic + revert ──────────────────
async function transitionStatus(regId, newStatus, payload) {
  const i = state.registrations.findIndex((r) => r.id === regId);
  if (i < 0) return;
  const before = { ...state.registrations[i] };
  const beforeDetail = state.detail.registration ? { ...state.detail.registration } : null;

  state.registrations[i] = { ...before, status: newStatus };
  if (state.detail.registration?.id === regId) {
    state.detail.registration = { ...state.detail.registration, status: newStatus };
  }
  renderTable(); renderStats(); renderDetailModal();

  try {
    const { registration, log_entries } = await adminApi.updateStatus({
      registration_id: regId,
      new_status: newStatus,
      ...payload,
    });
    state.registrations[i] = { ...state.registrations[i], ...registration };
    if (state.detail.registration?.id === regId) {
      state.detail.registration = { ...state.detail.registration, ...registration };
      if (Array.isArray(log_entries) && log_entries.length > 0) {
        state.detail.log = [...log_entries, ...state.detail.log];
      }
    }
    renderTable(); renderStats(); renderDetailModal();
    toast('Durum güncellendi.', 'success');
  } catch (err) {
    state.registrations[i] = before;
    if (beforeDetail && state.detail.registration?.id === regId) {
      state.detail.registration = beforeDetail;
    }
    renderTable(); renderStats(); renderDetailModal();
    throw err;
  }
}

async function saveRegistrationFields(fields) {
  const r = state.detail.registration;
  if (!r) return;
  const before = { ...r };
  const idx = state.registrations.findIndex((x) => x.id === r.id);
  const beforeRow = idx >= 0 ? { ...state.registrations[idx] } : null;

  state.detail.registration = { ...r, ...fields };
  if (idx >= 0) state.registrations[idx] = { ...state.registrations[idx], ...fields };
  renderTable(); renderDetailModal();

  try {
    const { registration, log_entries } = await adminApi.updateRegistration({
      registration_id: r.id,
      fields,
    });
    state.detail.registration = { ...state.detail.registration, ...registration };
    if (idx >= 0) state.registrations[idx] = { ...state.registrations[idx], ...registration };
    if (Array.isArray(log_entries) && log_entries.length > 0) {
      state.detail.log = [...log_entries, ...state.detail.log];
    }
    renderTable(); renderDetailModal();
    toast('Bilgiler güncellendi.', 'success');
  } catch (err) {
    state.detail.registration = before;
    if (beforeRow && idx >= 0) state.registrations[idx] = beforeRow;
    renderTable(); renderDetailModal();
    toast(err.message || 'Bilgiler güncellenemedi.', 'error');
  }
}

// ── Toast ─────────────────────────────────────────────────────
function toast(message, kind = 'info') {
  if (!els.toastContainer) return;
  const el = document.createElement('div');
  el.className = `toast toast--${kind}`;
  el.textContent = message;
  els.toastContainer.appendChild(el);
  setTimeout(() => {
    el.classList.add('is-leaving');
    setTimeout(() => el.remove(), 200);
  }, kind === 'error' ? 6000 : 3000);
}
