/* ============================================================
   register.js — public registration form handler
   Wiring constants are at the top so the path from mock → real
   API is a one-line flip per constant.
   ============================================================ */

import {
  isValidEmail,
  isValidPhone,
  isNonEmpty,
} from './shared.js';
import {
  applyTranslations,
  getLang,
  t,
  wireLangToggle,
} from './i18n.js';

// ── Wiring ────────────────────────────────────────────────────
// Two pipelines exist; ENDPOINT and EVENT_ID must be flipped together
// because they use different event identifiers.
//
//   '/api/apply'    — email-only, no database. EVENT_ID is the course
//                     slug, resolved from api/_events.js.
//   '/api/register' — Supabase pipeline. EVENT_ID is the events-table
//                     UUID. Needs a live Supabase project.
//
// Supabase values, kept here for the flip back:
//   const REGISTER_ENDPOINT = '/api/register';
//   const EVENT_ID = '65675693-d721-47bf-b78d-244db4f3d77e';
const REGISTER_ENDPOINT = '/api/apply';
const EVENT_ID = '2027-01-rmk-aimes';
const USE_MOCK_RESPONSE = false;
const MOCK_LATENCY_MS = 500;
// ──────────────────────────────────────────────────────────────

const form = document.querySelector('[data-register-form]');
const submitBtn = document.querySelector('[data-register-submit]');
const submitLabel = document.querySelector('[data-register-submit-label]');
const submitSpinner = document.querySelector('[data-register-submit-spinner]');
const errorBanner = document.querySelector('[data-form-error]');
const successCard = document.querySelector('[data-success-card]');
const formCard = document.querySelector('[data-form-card]');

const FIELDS = [
  { name: 'first_name',  required: true,  validate: isNonEmpty,   errorKey: 'errors.firstName' },
  { name: 'last_name',   required: true,  validate: isNonEmpty,   errorKey: 'errors.lastName' },
  { name: 'email',       required: true,  validate: isValidEmail, errorKey: 'errors.email' },
  { name: 'phone',       required: true,  validate: isValidPhone, errorKey: 'errors.phone' },
  { name: 'specialty',   required: true,  validate: isNonEmpty,   errorKey: 'errors.specialty' },
  { name: 'position',    required: true,  validate: isNonEmpty,   errorKey: 'errors.position' },
  { name: 'institution', required: true,  validate: isNonEmpty,   errorKey: 'errors.institution' },
  { name: 'notes',       required: false, validate: () => true,   errorKey: null },
];

// ── Language ──────────────────────────────────────────────────
let lang = getLang();
let isPending = false;
applyTranslations(lang);
wireLangToggle((next) => {
  lang = next;
  applyTranslations(lang);
  // Any error text already on screen is now in the wrong language.
  FIELDS.forEach(({ name, errorKey }) => {
    const wrapper = form.querySelector(`[data-field="${name}"]`);
    if (errorKey && wrapper?.classList.contains('is-invalid')) {
      setFieldError(name, t(lang, errorKey));
    }
  });
  if (errorBanner?.classList.contains('is-active')) hideErrorBanner();
  // Re-apply the current state, not a reset — applyTranslations has just
  // overwritten the submit label, and toggling mid-submit must not
  // re-enable the button.
  setPending(isPending);
});

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
      setFieldError(field.name, t(lang, field.errorKey));
      if (!firstInvalidField) firstInvalidField = input;
      allValid = false;
    } else if (value && field.validate && !field.validate(value)) {
      setFieldError(field.name, t(lang, field.errorKey));
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

  setPending(true);

  try {
    if (USE_MOCK_RESPONSE) {
      // Mock-mode fallback: simulates a successful submit without
      // hitting the API. Useful for local UI work; flip the flag above.
      await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));
    } else {
      const payload = {
        event_id: EVENT_ID,
        lang,
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
        // The API returns { error, code } as JSON for known failure
        // modes, already in the language we sent as `lang`. Fall back
        // to a generic message if parsing fails (network blip,
        // unexpected server response, etc.).
        let serverMessage = '';
        try {
          const errorBody = await res.json();
          if (errorBody && typeof errorBody.error === 'string') {
            serverMessage = errorBody.error;
          }
        } catch { /* non-JSON response */ }
        throw new Error(
          serverMessage || t(lang, 'errors.requestFailed')(res.status),
        );
      }
    }

    showSuccess();
  } catch (err) {
    showErrorBanner(err.message || t(lang, 'errors.unexpected'));
    setPending(false);
  }
}

function setPending(pending) {
  isPending = pending;
  if (!submitBtn) return;
  submitBtn.disabled = pending;
  if (submitLabel) {
    submitLabel.textContent = pending
      ? t(lang, 'form.submitting')
      : t(lang, 'form.submit');
  }
  if (submitSpinner) {
    submitSpinner.style.display = pending ? 'inline-block' : 'none';
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

function showSuccess() {
  if (formCard) formCard.style.display = 'none';
  if (successCard) successCard.classList.add('is-active');
  successCard?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
