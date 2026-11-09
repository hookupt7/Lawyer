'use strict';
/**
 * Oakstone — the main-page practice index.
 *
 * A clean, quiet list of the whole menu. Every entry is a real link straight
 * to its practice-area page, where the visitor reads the laws, the fees, how
 * the work runs, picks their state and books. A group filter narrows the list.
 *
 * No accordions, no in-place booking, nothing to decode. Server-rendered, so
 * it works with JavaScript off; the filter is pure CSS+JS progressive.
 */
const R = require('./render.js');
const esc = R.esc;

/* Cheapest stated fee among the area's services, so the card can say "from $X". */
function fromLabel(a) {
  const fees = (a.services || []).map(s => s.fee).filter(f =>
    f && typeof f.amount === 'number' && (f.type === 'flat' || f.type === 'retainer'));
  if (!fees.length) {
    const any = (a.services || []).map(s => s.fee).filter(Boolean)[0];
    return any && any.type === 'contingency' ? 'No fee unless we win'
      : any && any.type === 'hourly' ? 'Hourly rate' : 'Quoted per matter';
  }
  fees.sort((x, y) => x.amount - y.amount);
  return 'from ' + R.feeLabel(fees[0]);
}

function shortName(name) {
  return String(name).replace(/ &.*$/, '').replace(/ Law$/, '');
}

function card(a) {
  const n = (a.services || []).length;
  return '<a class="pix__card" href="/practice-areas/' + esc(a.id) + '" data-group="' + esc(a.group) + '">' +
    '<span class="pix__ico">' + R.icon(a.icon, 'pix__icon') + '</span>' +
    '<span class="pix__body">' +
      '<span class="pix__name">' + esc(a.name) +
        (a.urgent ? '<span class="pix__flag">Urgent</span>' : '') + '</span>' +
      '<span class="pix__tag">' + esc(a.tagline) + '</span>' +
      '<span class="pix__meta">' + n + (n === 1 ? ' service' : ' services') + ' &middot; ' +
        esc(fromLabel(a)) + '</span>' +
    '</span>' +
    '<span class="pix__go" aria-hidden="true">&rarr;</span>' +
  '</a>';
}

function practiceIndex() {
  const grps = R.groups().filter(g => g.items.length);
  const areas = R.allAreas();
  const svcTotal = areas.reduce((n, a) => n + (a.services ? a.services.length : 0), 0);

  const pills =
    '<button class="pix__pill is-on" type="button" data-pix="all" aria-pressed="true">All areas' +
      '<span class="pix__n">' + areas.length + '</span></button>' +
    grps.map(g =>
      '<button class="pix__pill" type="button" data-pix="' + esc(g.label) + '" aria-pressed="false">' +
        esc(g.label) + '<span class="pix__n">' + g.items.length + '</span></button>').join('');

  return '<section class="section" id="practice">' +
    '<div class="wrap">' +
      '<div class="sec-head rv">' +
        '<span class="eyebrow">Practice areas</span>' +
        '<h2>Start with what happened to you.</h2>' +
        '<p class="lede mt4 measure">Twenty-six practice areas and ' + svcTotal +
          ' defined services, each with its own page: what the law allows, what it costs, how the work runs, ' +
          'and a booking form. Choose the one that matches and everything is there.</p>' +
      '</div>' +
      '<div class="pix" id="pix">' +
        '<div class="pix__rail" role="group" aria-label="Filter practice areas">' + pills + '</div>' +
        '<div class="pix__grid">' + areas.map(card).join('') + '</div>' +
      '</div>' +
    '</div>' +
  '</section>';
}

module.exports = { practiceIndex, shortName };
