/* ============================================================
   admin.js — registration admin table (mock mode)
   No auth gate yet; everything reads from MOCK_REGISTRATIONS and
   per-row actions mutate the local array, then re-render.
   Replace the import with a Supabase fetch post-migration.
   ============================================================ */

import { MOCK_REGISTRATIONS } from './mock-data.js';
import {
  SPECIALTY_LABELS_TR,
  POSITION_LABELS_TR,
  STATUS_LABELS_TR,
  formatDateTimeTr,
} from './shared.js';

// Simulated logged-in admin (the real value will come from Supabase Auth).
const MOCK_ADMIN_EMAIL = 'kayit@sonoinjection.com';

// Working copy — all mutations happen here. NEVER mutate the imported array.
let registrations = MOCK_REGISTRATIONS.map((r) => ({ ...r }));

const tableBody = document.querySelector('[data-table-body]');
const countEl = document.querySelector('[data-row-count]');
const statusFilter = document.querySelector('[data-filter-status]');
const specialtyFilter = document.querySelector('[data-filter-specialty]');

statusFilter?.addEventListener('change', render);
specialtyFilter?.addEventListener('change', render);

tableBody?.addEventListener('click', onTableClick);

render();

function escape(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[c]);
}

function getFilters() {
  return {
    status: statusFilter?.value || 'all',
    specialty: specialtyFilter?.value || 'all',
  };
}

function getVisibleRows() {
  const { status, specialty } = getFilters();
  return registrations
    .filter((r) => {
      if (status !== 'all' && r.status !== status) return false;
      if (specialty !== 'all' && r.specialty !== specialty) return false;
      return true;
    })
    // Default sort: surname-first, ascending (Turkish locale).
    .sort((a, b) => a.last_name.localeCompare(b.last_name, 'tr'));
}

function rowActions(r) {
  const buttons = [];
  if (r.status === 'pending') {
    buttons.push(`<button class="btn btn--primary btn--sm" data-action="confirm" data-id="${r.id}">Onayla</button>`);
    buttons.push(`<button class="btn btn--ghost btn--sm" data-action="cancel" data-id="${r.id}">İptal Et</button>`);
  } else if (r.status === 'confirmed' || r.status === 'expired') {
    buttons.push(`<button class="btn btn--ghost btn--sm" data-action="cancel" data-id="${r.id}">İptal Et</button>`);
  }
  // cancelled rows have no actions
  return buttons.join('');
}

function fullName(r) {
  return `${r.first_name ?? ''} ${r.last_name ?? ''}`.trim();
}

function renderRow(r) {
  return `
    <tr data-row="${r.id}">
      <td>
        <div class="cell-name">${escape(fullName(r))}</div>
        <div class="cell-meta">${escape(r.email)}</div>
      </td>
      <td>${escape(r.phone)}</td>
      <td>${escape(SPECIALTY_LABELS_TR[r.specialty] ?? r.specialty)}</td>
      <td>${escape(POSITION_LABELS_TR[r.position] ?? r.position)}</td>
      <td>${escape(r.institution)}</td>
      <td><span class="status-pill status-pill--${r.status}">${escape(STATUS_LABELS_TR[r.status] ?? r.status)}</span></td>
      <td><span class="cell-meta">${escape(formatDateTimeTr(r.registered_at))}</span></td>
      <td><span class="cell-meta">${escape(formatDateTimeTr(r.expires_at))}</span></td>
      <td><div class="cell-actions">${rowActions(r)}</div></td>
    </tr>
  `;
}

function render() {
  if (!tableBody) return;
  const visible = getVisibleRows();
  if (visible.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="9" class="table-empty">Bu filtreyle eşleşen başvuru yok.</td></tr>`;
  } else {
    tableBody.innerHTML = visible.map(renderRow).join('');
  }
  if (countEl) {
    const total = registrations.length;
    countEl.textContent = `${visible.length} / ${total} başvuru gösteriliyor`;
  }
}

function onTableClick(event) {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const action = button.dataset.action;
  const id = button.dataset.id;
  const row = registrations.find((r) => r.id === id);
  if (!row) return;

  const displayName = fullName(row);

  if (action === 'confirm') {
    if (!confirm(`${displayName} adlı katılımcının kaydını onaylamak istediğinizden emin misiniz?`)) return;
    row.status = 'confirmed';
    row.confirmed_at = new Date().toISOString();
    row.confirmed_by = MOCK_ADMIN_EMAIL;
  } else if (action === 'cancel') {
    const reason = prompt('İptal nedenini girin (opsiyonel):', '');
    if (reason === null) return; // user cancelled the prompt
    row.status = 'cancelled';
    row.cancelled_at = new Date().toISOString();
    row.cancellation_reason = reason || 'Yönetici tarafından iptal edildi.';
  }

  render();
}
