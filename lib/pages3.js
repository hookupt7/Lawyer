'use strict';
/** Oakstone — pricing, booking, cyber center, contact, legal, 404. */
const R = require('./render.js');
const L = require('./layout.js');
const S = require('./sections.js');
const esc = R.esc, tel = R.tel, icon = R.icon, safeUrl = R.safeUrl, wa = R.wa;

/* ===================== PRICING ===================== */
function pricing(s) {
  const flat = [];
  const hourly = [];
  const contingency = [];
  R.allAreas().forEach(a => a.services.forEach(sv => {
    const row = { area: a, sv };
    if (sv.fee.type === 'flat') flat.push(row);
    else if (sv.fee.type === 'contingency') contingency.push(row);
    else if (sv.fee.type === 'hourly' || sv.fee.type === 'retainer') hourly.push(row);
  }));

  const rows = list => '<div class="tbl-scroll"><table class="tbl"><thead><tr>' +
    '<th>Service</th><th>Practice area</th><th>Fee type</th><th style="text-align:right">Amount</th><th></th>' +
    '</tr></thead><tbody>' + list.map(r =>
      '<tr><td style="font-weight:600">' + esc(r.sv.name) + '</td>' +
      '<td class="muted small">' + esc(r.area.name) + '</td>' +
      '<td class="small muted">' + esc(R.feeTag(r.sv.fee)) + '</td>' +
      '<td class="num" style="text-align:right;color:var(--ox-500);font-weight:600;white-space:nowrap">' +
        esc(R.feeLabel(r.sv.fee)) +
        (r.sv.fee.note ? '<div class="tiny muted" style="white-space:normal;max-width:24ch">' + esc(r.sv.fee.note) + '</div>' : '') +
      '</td>' +
      '<td><a class="link-arrow" href="/book?area=' + esc(r.area.id) + '">Book</a></td></tr>').join('') +
    '</tbody></table></div>';

  const body =
    '<header class="pagehead"><div class="wrap">' +
      S.crumbs([{ label: 'Home', href: '/' }, { label: 'Fees' }]) +
      '<h1>Fees, stated before you call.</h1>' +
      '<p class="lede mt4 measure">' + flat.length + ' flat-fee services, published hourly rates, and contingency ' +
        'representation where the law allows it. Every figure here is an illustrative starting point, not a quote: ' +
        'the binding fee is the one in your signed engagement agreement.</p>' +
    '</div></header>' +

    /* estimator */
    '<section class="section"><div class="wrap">' +
      '<div class="split split--wide-left">' +
        '<div class="rv">' +
          '<span class="eyebrow">Fee estimator</span>' +
          '<h2 class="mt3 mb5">Three questions, one range.</h2>' +
          '<div id="estimator">' +
            '<div class="form-row"><label>Matter type</label>' +
              '<div class="choices" data-est-group="matter">' +
                R.allAreas().slice(0, 12).map(a =>
                  '<button type="button" class="choice" data-est="matter" data-value="' + esc(a.id) + '">' +
                    '<span class="choice__mark"></span><span><span class="choice__label">' + esc(a.name) + '</span>' +
                    '<span class="choice__sub">' + a.services.length + ' services</span></span></button>').join('') +
              '</div></div>' +
            '<div class="form-row"><label>Complexity</label>' +
              '<div class="choices">' +
                [['simple', 'Simple', 'Single filing, one jurisdiction, no contest expected'],
                 ['standard', 'Standard', 'Negotiation or discovery, normal court timeline'],
                 ['complex', 'Complex', 'Multiple parties, experts, or trial expected']].map((c, i) =>
                  '<button type="button" class="choice' + (i === 1 ? ' is-selected' : '') + '" data-est="complexity" data-value="' + c[0] + '">' +
                    '<span class="choice__mark"></span><span><span class="choice__label">' + c[1] + '</span>' +
                    '<span class="choice__sub">' + c[2] + '</span></span></button>').join('') +
              '</div></div>' +
            '<div class="form-row"><label>Timing</label>' +
              '<div class="choices">' +
                [['normal', 'Normal', 'Handled on the standard schedule'],
                 ['urgent', 'Urgent', 'Deadline within 30 days'],
                 ['emergency', 'Emergency', 'Deadline within 72 hours']].map((c, i) =>
                  '<button type="button" class="choice' + (i === 0 ? ' is-selected' : '') + '" data-est="urgency" data-value="' + c[0] + '">' +
                    '<span class="choice__mark"></span><span><span class="choice__label">' + c[1] + '</span>' +
                    '<span class="choice__sub">' + c[2] + '</span></span></button>').join('') +
              '</div></div>' +
          '</div>' +
        '</div>' +
        '<div class="rv rv-d2"><div id="est-out" class="est"></div>' +
          '<script type="application/json" id="est-data">' +
            JSON.stringify({ areas: R.allAreas().map(a => ({ id: a.id, name: a.name, services: a.services.map(x => ({ name: x.name, fee: x.fee })) })) }) +
          '</script></div>' +
      '</div>' +
    '</div></section>' +

    /* fee models */
    '<section class="section section--bone section--rule"><div class="wrap">' +
      S.secHead({ eyebrow: 'How we charge', title: 'Four fee models, matched to the work.' }) +
      '<div class="grid g2" style="gap:var(--s5)">' +
        [['Flat fee', 'A single stated price for defined work: formations, uncontested divorces, trademark filings, expungements. You know the number before we start, and it does not move because the work took longer than expected.'],
         ['Hourly', 'Published rates from $275 to $600 depending on the attorney and the matter. Billed in tenths, with a monthly itemized statement that names what was done and who did it.'],
         ['Retainer', 'An advance deposited into the trust account and drawn against hourly work. Unused funds are refunded. The statement shows every draw.'],
         ['Contingency', 'For injury, recovery and plaintiff-side claims: a percentage of what we recover, and nothing if there is no recovery. Filing fees, records and experts are advanced by the firm and repaid only out of a recovery.']].map((x, i) =>
          '<div class="card rv rv-d' + (i + 1) + '"><h3 style="font-size:1.15rem">' + x[0] + '</h3>' +
          '<p class="small muted mt3" style="line-height:1.65">' + x[1] + '</p></div>').join('') +
      '</div>' +
    '</div></section>' +

    /* flat fees */
    '<section class="section"><div class="wrap">' +
      '<div class="row row--between mb5"><h2>Flat-fee services</h2><span class="tiny muted">' + flat.length + ' services</span></div>' +
      rows(flat.slice(0, 40)) +
      (flat.length > 40 ? '<p class="small muted mt4">Showing 40 of ' + flat.length + '. Every practice page lists its own fees.</p>' : '') +
    '</div></section>' +

    /* contingency */
    (contingency.length ? '<section class="section section--bone section--rule"><div class="wrap">' +
      '<div class="row row--between mb5"><h2>Contingency representation</h2><span class="tiny muted">No recovery, no fee</span></div>' +
      rows(contingency.slice(0, 30)) +
      '<div class="notice mt6">Contingency percentages are set by rule or statute in many states and vary by the stage ' +
        'at which the case resolves. The percentage and the cost treatment are stated in the engagement agreement ' +
        'before you sign.</div>' +
    '</div></section>' : '') +

    /* hourly */
    '<section class="section"><div class="wrap">' +
      '<div class="row row--between mb5"><h2>Hourly and retainer matters</h2><span class="tiny muted">' + hourly.length + ' services</span></div>' +
      rows(hourly.slice(0, 30)) +
    '</div></section>' +

    S.ctaBand(s, { eyebrow: 'Fees', title: 'Get your fee in writing.', text: 'The case review is free and includes the fee structure we would propose for your matter. No work begins until you sign.' });

  return {
    title: 'Legal Fees and Pricing | Flat, Hourly and Contingency | Oakstone Legal Group',
    description: 'Published fee structures for ' + flat.length + ' flat-fee services, hourly rates and contingency representation. Includes an interactive fee estimator. Illustrative figures, not quotes.',
    canonical: '/pricing', body
  };
}

/* ===================== BOOKING ===================== */
function booking(s, query) {
  const preArea = query.area || '';
  const preAttorney = query.attorney || '';
  const preState = query.state || '';
  const days = [];
  /* Build days from local midnight so the label and the ISO value can never
     disagree. Using toISOString() on a local date shifts the day backwards
     for every timezone west of UTC. */
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  for (let i = 1; i <= 14; i++) {
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    const dow = d.getDay();
    if (dow === 0 || dow === 6) continue;
    days.push(d);
    if (days.length >= 6) break;
  }
  const iso = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const slots = String(s.bookingSlots || '09:00,10:00,11:00,13:00,14:00,15:00,16:00,17:00').split(',').map(x => x.trim()).filter(Boolean);
  const fmtDay = d => d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const fmtFull = iso;

  const body =
    '<header class="pagehead"><div class="wrap">' +
      S.crumbs([{ label: 'Home', href: '/' }, { label: 'Book a consultation' }]) +
      '<h1>Book your case review.</h1>' +
      '<p class="lede mt4 measure">Four steps. The review is free, an attorney reads it, and you receive a written ' +
        'scope with the deadlines that apply and the fee structure we would propose.</p>' +
    '</div></header>' +

    '<section class="section section--tight"><div class="wrap" style="max-width:900px">' +
      '<form id="wizard" method="post" action="/api/book" novalidate>' +
        '<div class="wizard">' +
          '<div class="wizard__bar">' +
            ['Matter', 'Schedule', 'Details', 'Review'].map((x, i) =>
              '<button type="button" class="wizard__tab" data-tab="' + i + '">' + x + '</button>').join('') +
          '</div>' +

          /* step 1 */
          '<div class="wizard__panel">' +
            '<div class="wizard__legend">What is this about?</div>' +
            '<div class="wizard__hint">Pick the closest match. You can explain the details in step three.</div>' +
            '<div class="form-row" data-required-group><label>Practice area</label>' +
              '<div class="choices">' + R.allAreas().map(a =>
                '<button type="button" class="choice' + (a.id === preArea ? ' is-selected' : '') + '" data-field="practiceArea" data-group="pa" data-value="' + esc(a.id) + '">' +
                  '<span class="choice__mark"></span><span><span class="choice__label">' + esc(a.name) + '</span>' +
                  '<span class="choice__sub">' + esc(a.tagline) + '</span></span></button>').join('') + '</div>' +
              '<span class="err"></span></div>' +
            '<div class="form-row" data-required-group><label>How urgent is this</label>' +
              '<div class="choices">' +
                [['normal', 'Normal', 'No deadline I know of'],
                 ['urgent', 'Urgent', 'A deadline is coming within 30 days'],
                 ['emergency', 'Emergency', 'Court date, hearing or funds at risk within days']].map((c, i) =>
                  '<button type="button" class="choice' + (i === 0 ? ' is-selected' : '') + '" data-field="urgency" data-group="urg" data-value="' + c[0] + '">' +
                    '<span class="choice__mark"></span><span><span class="choice__label">' + c[1] + '</span>' +
                    '<span class="choice__sub">' + c[2] + '</span></span></button>').join('') + '</div>' +
              '<span class="err"></span></div>' +
            '<div class="form-row"><label>State where the matter is</label>' +
              '<select class="field" name="state" id="wz-state">' +
                '<option value="">Select a state</option>' +
                R.states.map(x => '<option value="' + esc(x.code) + '"' + (x.code === preState ? ' selected' : '') + '>' + esc(x.name) + '</option>').join('') +
              '</select></div>' +
          '</div>' +

          /* step 2 */
          '<div class="wizard__panel">' +
            '<div class="wizard__legend">Pick a time.</div>' +
            '<div class="wizard__hint">All times are Eastern. The consultation runs 30 minutes by phone or video. ' +
              'Days shown are the next six business days, counted from today, ' +
              new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) + '. This list refreshes every time the page loads.</div>' +
            '<input type="hidden" name="date" id="wz-date" value="">' +
            '<input type="hidden" name="time" id="wz-time" value="">' +
            '<div class="form-row" data-required-group><label>Day</label>' +
              '<div class="slotbar">' + days.map((d, i) =>
                '<button type="button" class="slotday' + (i === 0 ? ' is-selected' : '') + '" data-day="' + fmtFull(d) + '" data-label="' + esc(fmtDay(d)) + '">' +
                  '<strong>' + d.toLocaleDateString('en-US', { weekday: 'short' }) + '</strong>' +
                  '<span>' + d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + '</span>' +
                  '<em>' + (i === 0 ? 'Next open' : '\u00a0') + '</em></button>').join('') + '</div>' +
              '<span class="err"></span></div>' +
            '<div class="form-row" data-required-group><label>Time</label>' +
              '<div class="slots">' + slots.map(t =>
                '<button type="button" class="slot" data-time="' + esc(t) + '">' + esc(t) + '</button>').join('') + '</div>' +
              '<span class="err"></span></div>' +
            '<div class="form-row"><label>Preferred attorney, if any</label>' +
              '<select class="field" name="attorney" id="wz-attorney">' +
                '<option value="">No preference</option>' +
                R.attorneys().map(a => '<option value="' + esc(a.id) + '"' + (a.id === preAttorney ? ' selected' : '') + '>' + esc(a.name) + ' — ' + esc(a.title) + '</option>').join('') +
              '</select></div>' +
            '<div class="form-row"><label>Format</label>' +
              '<div class="choices">' +
                [['phone', 'Phone call', 'We call the number you give us'],
                 ['video', 'Video call', 'A link is emailed to you'],
                 ['office', 'In office', 'At our ' + esc(s.city) + ' office']].map((c, i) =>
                  '<button type="button" class="choice' + (i === 0 ? ' is-selected' : '') + '" data-field="format" data-group="fmt" data-value="' + c[0] + '">' +
                    '<span class="choice__mark"></span><span><span class="choice__label">' + c[1] + '</span>' +
                    '<span class="choice__sub">' + c[2] + '</span></span></button>').join('') + '</div></div>' +
          '</div>' +

          /* step 3 */
          '<div class="wizard__panel">' +
            '<div class="wizard__legend">Your details.</div>' +
            '<div class="wizard__hint">This is how we reach you and send the confirmation.</div>' +
            '<div class="form-grid">' +
              '<div class="form-row"><label for="wz-name">Full name</label>' +
                '<input class="field" id="wz-name" name="name" data-required data-msg="Your name is required." autocomplete="name"></div>' +
              '<div class="form-row"><label for="wz-phone">Phone</label>' +
                '<input class="field" id="wz-phone" name="phone" type="tel" data-required data-msg="A reachable phone number is required." autocomplete="tel"></div>' +
              '<div class="form-row full"><label for="wz-email">Email</label>' +
                '<input class="field" id="wz-email" name="email" type="email" data-required data-msg="A valid email is required for the confirmation." autocomplete="email"></div>' +
              '<div class="form-row full"><label for="wz-details">What happened</label>' +
                '<textarea class="field" id="wz-details" name="details" rows="4" placeholder="Dates, parties, deadlines, and what you want to achieve"></textarea></div>' +
              '<div class="form-row full"><label>How did you find us</label>' +
                '<select class="field" name="source"><option value="">Prefer not to say</option>' +
                ['Search engine', 'Referral from another attorney', 'Friend or family', 'Social media', 'News article', 'Other'].map(x =>
                  '<option>' + x + '</option>').join('') + '</select></div>' +
            '</div>' +
            '<div class="notice mt5">Submitting this form does not create an attorney-client relationship. ' +
              'Anything you send is treated as confidential. Do not send passwords, account numbers or private keys.</div>' +
          '</div>' +

          /* step 4 */
          '<div class="wizard__panel">' +
            '<div class="wizard__legend">Review and confirm.</div>' +
            '<div class="wizard__hint">Check the details, then confirm. You will receive an email with a calendar invitation.</div>' +
            '<div class="est mb5"><div class="est__label">Your consultation</div>' +
              '<div class="est__split" id="wz-summary"></div></div>' +
            '<div class="notice">By confirming you agree to the terms of the case review: it is free, it is ' +
              'confidential, it is not legal advice, and the attorney-client relationship begins only if we both ' +
              'sign an engagement agreement afterward.</div>' +
          '</div>' +

          '<div class="wizard__foot">' +
            '<button type="button" class="btn btn--ghost" id="wz-back">Back</button>' +
            '<span class="row" style="gap:.6rem">' +
              '<button type="button" class="btn btn--primary" id="wz-next">Continue</button>' +
              '<button type="submit" class="btn btn--brass hide" id="wz-submit">Confirm booking</button>' +
            '</span>' +
          '</div>' +
        '</div>' +
      '</form>' +
      '<div id="wz-done" class="card hide mt5" style="border-color:var(--ok)">' +
        '<h3 style="color:var(--ok)">Booked.</h3>' +
        '<p class="small muted mt3" id="wz-done-msg"></p>' +
      '</div>' +
    '</div></section>' +

    '<section class="section section--bone section--rule"><div class="wrap"><div class="split">' +
      '<div>' + S.secHead({ eyebrow: 'What to expect', title: 'The 30 minutes, spent well.' }) +
        S.accordion([{ q: 'Who takes the call?', a: 'An attorney who handles the practice area you selected, plus the paralegal who will manage your file if you engage us. Not a salesperson.' },
          { q: 'What should I have ready?', a: 'Any contract, notice, court paper or message thread involved, the dates of the events, and a one-paragraph account of what happened. For cyber matters, bank or exchange records showing the transfer.' },
          { q: 'What happens at the end?', a: 'If we can help, you receive a written scope with the claims available, the timeline and the fee structure. If we cannot, we tell you and point you to the right resource.' }], true) + '</div>' +
      '<div>' + S.secHead({ eyebrow: 'Other ways to reach us', title: 'If the calendar does not fit.' }) +
        '<div class="stack-sm">' +
          '<a class="btn btn--primary btn--block" href="' + tel(s.phone) + '">Call ' + esc(s.phone) + '</a>' +
          '<a class="btn btn--ghost btn--block" href="' + safeUrl(wa(s.whatsapp)) + '" target="_blank" rel="noopener">WhatsApp ' + esc(s.whatsapp) + '</a>' +
          '<a class="btn btn--ghost btn--block" href="mailto:' + esc(s.email) + '">' + esc(s.email) + '</a>' +
          '<div class="notice mt4">' + esc(s.hours) + '</div>' +
        '</div></div>' +
    '</div></div></section>';

  return {
    title: 'Book a Free Case Review | Oakstone Legal Group',
    description: 'Book a free 30-minute case review with an attorney. Choose your practice area, pick a time, and receive a written scope with fees. No obligation.',
    canonical: '/book', body,
    noindex: false
  };
}

/* booking success */
function booked(s, appt) {
  const when = new Date(appt.date + 'T' + appt.time + ':00');
  const nice = when.toLocaleString('en-US', { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: 'UTC' }) + ' Eastern';
  const body =
    '<section class="section"><div class="wrap" style="max-width:720px">' +
      '<div class="center mb6"><span class="tag tag--brass">Confirmed</span></div>' +
      '<h1 class="center">Your consultation is booked.</h1>' +
      '<p class="lede center mt4" style="margin-left:auto;margin-right:auto">A confirmation email with a calendar ' +
        'invitation is on its way to <strong>' + esc(appt.email) + '</strong>.</p>' +
      '<div class="est mt6"><div class="est__label">Your appointment</div>' +
        '<div class="est__value" style="font-size:1.7rem">' + esc(nice) + '</div>' +
        '<div class="est__split">' +
          '<div class="est__line"><span>Matter</span><strong>' + esc(appt.practiceArea || 'General') + '</strong></div>' +
          '<div class="est__line"><span>Format</span><strong>' + esc(appt.format || 'Phone') + '</strong></div>' +
          '<div class="est__line"><span>Reference</span><strong class="mono">' + esc(appt.id) + '</strong></div>' +
        '</div></div>' +
      '<div class="notice mt6"><strong>Before the call:</strong> have your documents ready and join from somewhere ' +
        'private. If this is a cyber emergency and funds are still moving, call ' + esc(s.phoneEmergency) + ' now instead of waiting.</div>' +
      '<div class="center mt6"><a class="btn btn--primary" href="/home">Back to home</a></div>' +
    '</div></section>';
  return { title: 'Consultation Booked | Oakstone Legal Group', description: 'Your consultation is confirmed.', canonical: '/booked', body, noindex: true };
}

module.exports = { pricing, booking, booked };
