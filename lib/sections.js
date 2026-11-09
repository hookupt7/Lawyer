'use strict';
/** Oakstone — reusable page sections. */
const R = require('./render.js');
const esc = R.esc, tel = R.tel, icon = R.icon, money = R.money;
const I = require('./inline.js');

/* Section heading block */
function secHead(o) {
  return '<div class="sec-head' + (o.center ? ' sec-head--center' : '') + ' rv">' +
    (o.eyebrow ? '<span class="eyebrow' + (o.dark ? ' eyebrow--light' : '') + '">' + esc(o.eyebrow) + '</span>' : '') +
    '<h2>' + (o.title || '') + '</h2>' +
    (o.text ? '<p' + (o.dark ? ' class="light-text"' : '') + '>' + esc(o.text) + '</p>' : '') +
    '</div>';
}

/* Stat band */
/* Practice area card */
function paCard(a, delay) {
  return '<a class="pa-card' + (delay ? ' rv rv-d' + delay : '') + '" href="/practice-areas/' + esc(a.id) + '">' +
    icon(a.icon, 'pa-card__icon') +
    '<div><h4>' + esc(a.name) + (a.urgent ? ' <span class="tag tag--urgent" style="vertical-align:2px">Urgent</span>' : '') + '</h4>' +
    '<p>' + esc(a.tagline) + '</p>' +
    '<span class="tiny muted" style="display:block;margin-top:.5rem">' + a.services.length + ' services</span>' +
    '</div></a>';
}

/* Full practice grid */
function paGrid(list, startDelay) {
  return '<div class="pa-grid">' + list.map((a, i) =>
    paCard(a, ((i % 6) + (startDelay || 0)))).join('') + '</div>';
}

/* Process steps */
function steps(list) {
  return '<div class="steps">' + list.map((p, i) =>
    '<div class="steps__step rv rv-d' + (i + 1) + '">' +
      '<span class="steps__num">Step ' + p.step + '</span>' +
      '<h4>' + esc(p.title) + '</h4>' +
      '<p>' + esc(p.desc) + '</p></div>').join('') + '</div>';
}

/* Accordion from {q,a} or {name,desc} */
function accordion(items, single) {
  return '<div class="acc"' + (single ? ' data-single' : '') + '>' + items.map((it, i) => {
    const q = it.q || it.name;
    const a = it.a || it.desc;
    return '<div class="acc__item">' +
      '<button class="acc__btn" type="button" aria-expanded="false">' +
        '<span>' + esc(q) + '</span><span class="acc__icon"></span></button>' +
      '<div class="acc__panel"><p>' + esc(a) + '</p></div></div>';
  }).join('') + '</div>';
}

/* Testimonials */
function quotes(list, limit) {
  const use = limit ? list.slice(0, limit) : list;
  return '<div class="quotes">' + use.map((t, i) =>
    '<figure class="quote rv rv-d' + ((i % 3) + 1) + '">' +
      '<div class="quote__stars" aria-label="' + t.rating + ' out of 5">' + '\u2605'.repeat(t.rating) + '</div>' +
      '<blockquote class="quote__text">&ldquo;' + esc(t.quote) + '&rdquo;</blockquote>' +
      '<figcaption class="quote__by"><strong>' + esc(t.author) + '</strong>' + esc(t.matter) + '</figcaption>' +
    '</figure>').join('') + '</div>';
}

/* Closing CTA band */
function ctaBand(s, o) {
  o = o || {};
  return '<section class="section section--dark">' +
    '<div class="wrap"><div class="split">' +
      '<div class="rv"><span class="eyebrow eyebrow--light">' + esc(o.eyebrow || 'Next step') + '</span>' +
        '<h2 style="color:var(--bone);margin:.75rem 0 1rem">' + (o.title || 'Tell us what happened.') + '</h2>' +
        '<p class="light-text measure">' + esc(o.text ||
          'A case review is free. An attorney reads what you send, then responds with the deadlines that apply and the fee structure we would propose. No obligation, and nothing is billed until you sign an engagement letter.') + '</p>' +
        '<div class="hero__cta mt6">' +
          (o.areaId
            ? '<a class="btn btn--brass btn--lg" href="/practice-areas/' + esc(o.areaId) + '/start">' +
                'Begin your free review&nbsp;&rarr;</a>'
            : '<a class="btn btn--brass btn--lg" href="/practice-areas">Find your practice area&nbsp;&rarr;</a>') +
          '<a class="btn btn--ghostlight btn--lg" href="' + tel(s.phone) + '">Call ' + esc(s.phone) + '</a>' +
        '</div>' +
      '</div>' +
      '<div class="notice notice--dark rv rv-d2">' +
        '<strong style="color:var(--bone)">What happens after you submit</strong>' +
        '<ul class="stack-sm mt4 small" style="color:var(--ink-200)">' +
          '<li>An attorney, not an intake vendor, reads your submission.</li>' +
          '<li>Business-hours responses go out within four hours. Emergency cyber intake is answered within one hour.</li>' +
          '<li>You receive a written scope: claims available, timeline, and fee structure.</li>' +
          '<li>No attorney-client relationship is formed until we both sign a fee agreement.</li>' +
        '</ul>' +
      '</div>' +
    '</div></div></section>';
}

/* Trust badges strip */
function trustStrip(badges) {
  return '<div class="row row--between" style="gap:1.5rem;flex-wrap:wrap">' +
    badges.map(b => '<span class="tag tag--brass">' + esc(b) + '</span>').join('') + '</div>';
}

/* Testimonial rotator — auto-advancing, dot navigation */
function rotator(list) {
  return '<div class="rot" id="rot">' +
    list.map((t, i) =>
      '<figure class="rot__slide' + (i === 0 ? ' is-on' : '') + '">' +
        '<div class="quote__stars" aria-label="' + t.rating + ' out of 5">' + '\u2605'.repeat(t.rating) + '</div>' +
        '<blockquote class="quote__text" style="font-size:1.18rem;line-height:1.7">&ldquo;' + esc(t.quote) + '&rdquo;</blockquote>' +
        '<figcaption class="quote__by"><strong>' + esc(t.author) + '</strong>' + esc(t.matter) + '</figcaption>' +
      '</figure>').join('') +
    '<div class="rot__dots">' +
      list.map((_, i) => '<button class="rot__dot' + (i === 0 ? ' is-on' : '') + '" data-i="' + i + '" type="button" aria-label="Show quote ' + (i + 1) + '"></button>').join('') +
    '</div></div>';
}

/* Breadcrumbs */
function crumbs(items) {
  return '<nav class="crumbs" aria-label="Breadcrumb">' + items.map((c, i) =>
    (i ? '<span>/</span>' : '') +
    (c.href ? '<a href="' + esc(c.href) + '">' + esc(c.label) + '</a>' : '<span>' + esc(c.label) + '</span>')
  ).join('') + '</nav>';
}

/* Service pricing rows. The right-hand action books the service in place
   (inline modal) rather than bouncing to the main booking page; the href is a
   real /book link so the row still works without JavaScript. */
function serviceRows(services, opts) {
  opts = opts || {};
  /* No "Book" link on each service row: sixteen of them on one page is
     clutter, and the guided review already carries the service through. */
  return '<div class="svc">' + services.map(s =>
    '<div class="svc__row">' +
      '<div><div class="svc__name">' + esc(s.name) + '</div>' +
        '<div class="svc__desc">' + esc(s.desc) + '</div></div>' +
      '<div class="svc__fee"><small>' + esc(R.feeTag(s.fee)) + '</small>' + esc(R.feeLabel(s.fee)) +
        (s.fee && s.fee.note ? '<span class="svc__note">' + esc(s.fee.note) + '</span>' : '') + '</div>' +
    '</div>').join('') + '</div>';
}

/* Attorney card. Shows the aggregate rating when one exists and otherwise
   invites the visitor to be the first to review, rather than inventing a score. */
function attCard(a, delay) {
  const rt = I.ratingFor(a, R.reviews());
  const ratingLine = rt.count
    ? '<div class="ratingline"><span class="ratingline__n">' + rt.avg.toFixed(1) + '</span>' +
      I.stars(rt.avg) + '<span class="ratingline__c">' + rt.count + ' review' + (rt.count === 1 ? '' : 's') + '</span></div>'
    : '<div class="ratingline"><span class="ratingline__c">No reviews yet</span></div>';
  return '<a class="att' + (delay ? ' rv rv-d' + delay : '') + '" href="/attorneys/' + esc(a.id) + '">' +
    '<div class="att__photo"><img class="guarded" src="' + esc(a.headshot) + '" alt="' + esc(a.name) + '" loading="lazy" width="480" height="600" draggable="false"></div>' +
    '<div class="att__body">' +
      '<div class="att__name">' + esc(a.name) + '</div>' +
      '<div class="att__title">' + esc(a.title) + '</div>' +
      ratingLine +
      '<div class="att__meta">' + a.practices.map(p => { const x = R.byId(p); return x ? esc(x.name.replace(/ Law$| &.*$/, '')) : esc(p); }).slice(0, 2).join(' &middot; ') + '</div>' +
    '</div></a>';
}

module.exports = { secHead, paCard, paGrid, steps, accordion, quotes, rotator, ctaBand, trustStrip, crumbs, serviceRows, attCard };
