/* ============================================================
   nav.js — mobile nav toggle
   ============================================================ */

const nav = document.querySelector('[data-nav]');
const toggle = document.querySelector('[data-nav-toggle]');

if (nav && toggle) {
  toggle.addEventListener('click', () => {
    nav.classList.toggle('is-open');
    const expanded = nav.classList.contains('is-open');
    toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  });

  // Close mobile menu when a link is clicked
  nav.querySelectorAll('.nav__link').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}
