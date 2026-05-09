/* ============================================================
   register.js — public registration form handler
   Wiring constants are at the top so the path from mock → real
   API is a one-line flip per constant.
   ============================================================ */

import {
  calculateDeadline,
  formatDeadlineTr,
  isValidEmail,
  isValidPhone,
  isNonEmpty,
} from './shared.js';

// ── Wiring ────────────────────────────────────────────────────
const REGISTER_ENDPOINT = '/api/register';   // becomes a real Vercel route post-migration
const EVENT_ID = 'TODO_UUID_2026_06_20';     // becomes events.id from Supabase
const USE_MOCK_RESPONSE = true;              // flip to false when the API is live
const MOCK_LATENCY_MS = 500;
// ──────────────────────────────────────────────────────────────

const form = document.querySelector('[data-register-form]');
const submitBtn = document.querySelector('[data-register-submit]');
const submitLabel = document.querySelector('[data-register-submit-label]');
const submitSpinner = document.querySelector('[data-register-submit-spinner]');
const errorBanner = document.querySelector('[data-form-error]');
const successCard = document.querySelector('[data-success-card]');
const formCard = document.querySelector('[data-form-card]');
const deadlineSlot = document.querySelector('[data-success-deadline]');

const FIELDS = [
  { name: 'first_name',  required: true,  validate: isNonEmpty,   error: 'Lütfen adınızı girin.' },
  { name: 'last_name',   required: true,  validate: isNonEmpty,   error: 'Lütfen soyadınızı girin.' },
  { name: 'email',       required: true,  validate: isValidEmail, error: 'Geçerli bir e-posta adresi girin.' },
  { name: 'phone',       required: true,  validate: isValidPhone, error: 'Geçerli bir telefon numarası girin (örn. +90 555 123 45 67).' },
  { name: 'specialty',   required: true,  validate: isNonEmpty,   error: 'Lütfen uzmanlığınızı seçin.' },
  { name: 'position',    required: true,  validate: isNonEmpty,   error: 'Lütfen pozisyonunuzu seçin.' },
  { name: 'institution', required: true,  validate: isNonEmpty,   error: 'Lütfen kurum bilginizi girin.' },
  { name: 'notes',       required: false, validate: () => true,    error: '' },
];

// Live: clear the invalid state on a field as soon as the user edits it.
FIELDS.forEach(({ name }) => {
  const input = form.elements[name];
  if (!input) return;
  input.addEventListener('input', () => clearFieldError(name));
  input.addEventListener('change', () => clearFieldError(name));
});

form.addEventListener('submit', onSubmit);

async function onSubmit(event) {
  event.preventDefault();
  hideErrorBanner();

  const data = {};
  let firstInvalidField = null;
  let allValid = true;

  for (const field of FIELDS) {
    const input = form.elements[field.name];
    const value = input.value.trim();
    data[field.name] = value;
    if (field.required && !field.validate(value)) {
      setFieldError(field.name, field.error);
      if (!firstInvalidField) firstInvalidField = input;
      allValid = false;
    } else if (value && field.validate && !field.validate(value)) {
      setFieldError(field.name, field.error);
      if (!firstInvalidField) firstInvalidField = input;
      allValid = false;
    } else {
      clearFieldError(field.name);
    }
  }

  if (!allValid) {
    firstInvalidField?.focus();
    return;
  }

  // Compute the deadline now so the success state has it ready.
  const registeredAt = new Date();
  const deadline = calculateDeadline(registeredAt);

  setPending(true);

  try {
    if (USE_MOCK_RESPONSE) {
      // Simulate the network round-trip so the success copy and
      // formatted deadline can be verified end-to-end without a backend.
      // TODO: flip USE_MOCK_RESPONSE to false once /api/register is live.
      await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));
    } else {
      const payload = {
        event_id: EVENT_ID,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone.replace(/[\s\-()]/g, ''),
        specialty: data.specialty,
        position: data.position,
        institution: data.institution,
        notes: data.notes || null,
      };
      const res = await fetch(REGISTER_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const message = await res.text().catch(() => '');
        throw new Error(message || `İstek başarısız oldu (${res.status}).`);
      }
    }

    showSuccess(deadline);
  } catch (err) {
    showErrorBanner(err.message || 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.');
    setPending(false);
  }
}

function setPending(isPending) {
  if (!submitBtn) return;
  submitBtn.disabled = isPending;
  if (submitLabel) {
    submitLabel.textContent = isPending ? 'Gönderiliyor…' : 'Kayıt Ol';
  }
  if (submitSpinner) {
    submitSpinner.style.display = isPending ? 'inline-block' : 'none';
  }
}

function setFieldError(name, message) {
  const wrapper = form.querySelector(`[data-field="${name}"]`);
  if (!wrapper) return;
  wrapper.classList.add('is-invalid');
  const errorEl = wrapper.querySelector('.form-error');
  if (errorEl) errorEl.textContent = message;
}

function clearFieldError(name) {
  const wrapper = form.querySelector(`[data-field="${name}"]`);
  if (!wrapper) return;
  wrapper.classList.remove('is-invalid');
}

function showErrorBanner(message) {
  if (!errorBanner) return;
  errorBanner.textContent = message;
  errorBanner.classList.add('is-active');
}
function hideErrorBanner() {
  if (!errorBanner) return;
  errorBanner.classList.remove('is-active');
  errorBanner.textContent = '';
}

function showSuccess(deadline) {
  if (formCard) formCard.style.display = 'none';
  if (successCard) successCard.classList.add('is-active');
  if (deadlineSlot) deadlineSlot.textContent = formatDeadlineTr(deadline);
  successCard?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
