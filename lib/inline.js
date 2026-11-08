'use strict';
/**
 * Oakstone — inline ("book directly from here") consultation capture.
 *
 * Sub-pages (a practice area, a service row, an attorney profile, a fee table,
 * a state page) hand the visitor a short form that submits in place and swaps
 * itself for a confirmation. Nothing navigates away and the main /book wizard
 * is untouched.
 *
 * Progressive enhancement: every trigger is a real <a href="/book?..."> so the
 * page still works with JavaScript disabled. The client script intercepts the
 * click and opens the modal instead.
 */
const R = require('./render.js');

const esc = R.esc;

/* Next six business days, built from local midnight so the label and the ISO
   value can never disagree (the same fix the booking wizard uses). */
function nextDays(from) {
  const start = from ? new Date(from) : new Date();
  start.setHours(0, 0, 0, 0);
  const out = [];
  for (let i = 1; i <= 21 && out.length < 6; i++) {
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    const dow = d.getDay();
    if (dow === 0 || dow === 6) continue;
    out.push(d);
  }
  return out;
}
function iso(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function dayOptions(from) {
  return nextDays(from).map((d, i) =>
    '<option value="' + iso(d) + '">' +
      d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) +
      (i === 0 ? ' (next open)' : '') + '</option>').join('');
}

function slotOptions(s) {
  return String(s.bookingSlots || '09:00,10:00,11:00,13:00,14:00,15:00,16:00,17:00')
    .split(',').map(x => x.trim()).filter(Boolean)
    .map(t => '<option value="' + esc(t) + '">' + esc(t) + ' ET</option>').join('');
}

/* The one modal, rendered once per page by layout() and hidden until opened. */
function modal(s) {
  const areas = R.allAreas();
  return '' +
  '<div class="ibook" id="ibook" hidden>' +
    '<div class="ibook__scrim" data-ibook-close></div>' +
    '<div class="ibook__card" role="dialog" aria-modal="true" aria-labelledby="ibook-title">' +
      '<button class="ibook__x" type="button" aria-label="Close" data-ibook-close>' +
        '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M3 3l10 10M13 3L3 13"/></svg>' +
      '</button>' +
      '<div class="ibook__form">' +
        '<span class="eyebrow">Free case review</span>' +
        '<h2 class="ibook__title" id="ibook-title">Book your consultation</h2>' +
        '<p class="ibook__ctx small muted" id="ibook-ctx">An attorney reads what you send and replies with the deadlines that apply and the fee structure we would propose.</p>' +
        '<form id="ibook-form" method="post" action="/api/book-inline" novalidate>' +
          '<input type="hidden" name="area" id="ib-area" value="">' +
          '<input type="hidden" name="attorney" id="ib-attorney" value="">' +
          '<input type="hidden" name="service" id="ib-service" value="">' +
          '<input type="hidden" name="context" id="ib-context" value="">' +
          '<div class="form-grid">' +
            '<div class="form-row"><label for="ib-name">Full name</label>' +
              '<input class="field" id="ib-name" name="name" autocomplete="name" required></div>' +
            '<div class="form-row"><label for="ib-phone">Phone</label>' +
              '<input class="field" id="ib-phone" name="phone" type="tel" autocomplete="tel" required></div>' +
            '<div class="form-row full"><label for="ib-email">Email</label>' +
              '<input class="field" id="ib-email" name="email" type="email" autocomplete="email" required></div>' +
            '<div class="form-row full"><label for="ib-area-select">Practice area</label>' +
              '<select class="field" id="ib-area-select" name="area_name">' +
                '<option value="">General / not sure</option>' +
                areas.map(a => '<option value="' + esc(a.id) + '" data-id="' + esc(a.id) + '">' + esc(a.name) + '</option>').join('') +
              '</select></div>' +
            '<div class="form-row"><label for="ib-state">State</label>' +
              '<select class="field" id="ib-state" name="state"><option value="">Select a state</option>' +
                R.states.map(x => '<option value="' + esc(x.code) + '">' + esc(x.name) + '</option>').join('') +
              '</select></div>' +
            '<div class="form-row"><label for="ib-day">Preferred day</label>' +
              '<select class="field" id="ib-day" name="date">' + dayOptions() + '</select></div>' +
            '<div class="form-row full"><label for="ib-time">Preferred time</label>' +
              '<select class="field" id="ib-time" name="time">' + slotOptions(s) + '</select></div>' +
            '<div class="form-row full"><label for="ib-details">What happened</label>' +
              '<textarea class="field" id="ib-details" name="details" rows="3" ' +
              'placeholder="Dates, parties, deadlines, and what you want to achieve"></textarea></div>' +
          '</div>' +
          '<p class="ibook__err err" id="ibook-err"></p>' +
          '<div class="ibook__foot">' +
            '<button class="btn btn--brass btn--block btn--lg" type="submit" id="ibook-send">Request my consultation</button>' +
          '</div>' +
          '<p class="tiny muted center mt3">No obligation. Nothing is billed until we both sign an engagement letter. ' +
            'Do not send passwords or account numbers.</p>' +
        '</form>' +
      '</div>' +
      '<div class="ibook__done" hidden>' +
        '<div class="ibook__tick" aria-hidden="true">' +
          '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></svg>' +
        '</div>' +
        '<h2 class="ibook__title" id="ibook-done-title">Request received.</h2>' +
        '<p class="ibook__msg" id="ibook-done-msg"></p>' +
        '<div class="ibook__ref tiny muted" id="ibook-done-ref"></div>' +
        '<div class="stack-sm mt5">' +
          '<a class="btn btn--primary btn--block" href="' + R.tel(s.phone) + '">Call ' + esc(s.phone) + ' now</a>' +
          '<button class="btn btn--ghost btn--block" type="button" data-ibook-close>Close</button>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</div>';
}

/* A book trigger. Renders as a real link so it still works with JS off. */
function trigger(label, opts) {
  opts = opts || {};
  const q = [];
  if (opts.area) q.push('area=' + encodeURIComponent(opts.area));
  if (opts.attorney) q.push('attorney=' + encodeURIComponent(opts.attorney));
  return '<a class="' + (opts.class || 'btn btn--primary') + '" href="/book' + (q.length ? '?' + q.join('&') : '') + '"' +
    ' data-ibook' +
    ' data-area="' + esc(opts.area || '') + '"' +
    ' data-attorney="' + esc(opts.attorney || '') + '"' +
    ' data-service="' + esc(opts.service || '') + '"' +
    ' data-context="' + esc(opts.context || '') + '">' + (opts.html || esc(label)) + '</a>';
}

/* Aggregate star rating for an attorney.
   Combines any figures the firm entered in the admin panel with approved
   client reviews. If there is nothing to show, the caller renders a prompt
   rather than an invented score. */
function ratingFor(a, reviews) {
  const seedN = Number(a.reviewCount) || 0;
  const seedR = Number(a.rating) || 0;
  const mine = (reviews || []).filter(r => r.attorneyId === a.id && r.status === 'approved' && Number(r.rating) > 0);
  const sum = (seedN > 0 ? seedR * seedN : 0) + mine.reduce((n, r) => n + Number(r.rating), 0);
  const n = seedN + mine.length;
  return { count: n, avg: n ? Math.round((sum / n) * 10) / 10 : 0, reviews: mine };
}

/* Star row, half-star aware. */
function stars(avg, cls) {
  let html = '<span class="stars ' + (cls || '') + '" aria-label="' + avg + ' out of 5">';
  for (let i = 1; i <= 5; i++) {
    const on = avg >= i - 0.25 ? ' is-on' : avg >= i - 0.75 ? ' is-half' : '';
    html += '<span class="stars__s' + on + '">\u2605</span>';
  }
  return html + '</span>';
}

module.exports = { modal, trigger, ratingFor, stars, dayOptions, slotOptions };
