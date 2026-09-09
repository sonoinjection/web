/* ============================================================
   contact-reveal.js — renders phone contacts that plain-HTML
   scrapers can't read.

   The digits never appear in the served markup: each slot holds
   a base64 payload of the reversed E.164 number, decoded here at
   runtime and turned into a tel: link.

   Usage:
     <span data-contact-tel="MTYwNzEzMTk0NTA5Kw=="></span>
     <script type="module" src="scripts/contact-reveal.js"></script>

   Pair every slot with a <noscript> fallback (an email address)
   so visitors without JS still have a way to reach us.
   ============================================================ */

// Reversed-then-base64 keeps the number out of the HTML source and
// out of this file's plain text; it is obfuscation, not secrecy.
function decodeTel(payload) {
  const decoded = atob(payload);
  return [...decoded].reverse().join('');
}

// A 13-character Turkish number is grouped 3-3-2-2; anything
// else is shown exactly as decoded.
function formatTel(e164) {
  const tr = /^\+90(\d{3})(\d{3})(\d{2})(\d{2})$/.exec(e164);
  return tr ? `+90 ${tr[1]} ${tr[2]} ${tr[3]} ${tr[4]}` : e164;
}

document.querySelectorAll('[data-contact-tel]').forEach((slot) => {
  const e164 = decodeTel(slot.dataset.contactTel);
  const link = document.createElement('a');
  link.href = `tel:${e164}`;
  link.rel = 'nofollow';
  link.textContent = formatTel(e164);
  slot.replaceChildren(link);
});
