'use strict';
/** Oakstone — remaining page builders: practice, attorneys, coverage, pricing, book, cyber, contact, legal. */
const R = require('./render.js');
const L = require('./layout.js');
const S = require('./sections.js');
const I = require('./inline.js');
const P = require('./pages.js');
const esc = R.esc, tel = R.tel, icon = R.icon, safeUrl = R.safeUrl, wa = R.wa;

/* ===================== PRACTICE HUB ===================== */
function practiceHub(s) {
  const grps = R.groups();
  const pills =
    '<div class="filters" id="filters" role="tablist" aria-label="Filter practice areas">' +
      '<button type="button" class="filter is-on" data-g="all">All ' + R.allAreas().length + '</button>' +
      grps.map(g => '<button type="button" class="filter" data-g="' + esc(g.label) + '">' + esc(g.label) +
        ' <span style="opacity:.55;font-weight:500">' + g.items.length + '</span></button>').join('') +
    '</div>';
  const grid =
    '<div class="pa-grid" id="pa-all">' +
      R.allAreas().map(a => '<a class="pa-card" data-group="' + esc(a.group) + '" href="/practice-areas/' + esc(a.id) + '">' +
        icon(a.icon, 'pa-card__icon') +
        '<div><h4>' + esc(a.name) + (a.urgent ? ' <span class="tag tag--urgent" style="vertical-align:2px">Urgent</span>' : '') + '</h4>' +
        '<p>' + esc(a.tagline) + '</p>' +
        '<span class="tiny muted" style="display:block;margin-top:.5rem">' + a.services.length + ' services</span>' +
        '</div></a>').join('') +
    '</div>';

  const body =
    '<header class="pagehead"><div class="wrap">' +
      S.crumbs([{ label: 'Home', href: '/' }, { label: 'Practice areas' }]) +
      '<h1 style="max-width:22ch">Every practice area the firm handles.</h1>' +
      '<p class="lede mt4 measure">' + R.allAreas().length + ' practice areas and ' +
        R.allAreas().reduce((n, a) => n + a.services.length, 0) + ' defined services. Filter by group, open an area, ' +
        'and every service on that page carries its own fee and booking path.</p>' +
    '</div></header>' +
    '<section class="section"><div class="wrap">' +
      pills + grid +
    '</div></section>' +
    S.ctaBand(s, { inline: true });
  return {
    title: 'Practice Areas | ' + R.allAreas().length + ' Areas of Law | Oakstone Legal Group',
    description: 'Browse all ' + R.allAreas().length + ' practice areas and ' + R.allAreas().reduce((n, a) => n + a.services.length, 0) + ' services handled by Oakstone Legal Group nationwide, from family law and cyber recovery to criminal defense, injury, business and immigration.',
    canonical: '/practice-areas',
    body,
    schema: {
      '@context': 'https://schema.org', '@type': 'ItemList',
      itemListElement: R.allAreas().map((a, i) => ({ '@type': 'ListItem', position: i + 1, name: a.name, url: L.SITE_ORIGIN + '/practice-areas/' + a.id }))
    }
  };
}

/* ===================== SINGLE PRACTICE ===================== */
function practice(s, a) {
  const related = R.allAreas().filter(x => x.group === a.group && x.id !== a.id).slice(0, 3);
  const handlers = R.attorneys().filter(at => at.practices.indexOf(a.id) !== -1).slice(0, 3);

  const body =
    '<header class="pa-hero"><div class="wrap">' +
      S.crumbs([{ label: 'Home', href: '/' }, { label: 'Practice areas', href: '/practice-areas' }, { label: a.name }]) +
      '<div class="pa-hero__tag">' + icon(a.icon, '') +
        (a.urgent ? '<span class="tag tag--urgent">Time-critical intake</span>'
                  : '<span class="tag tag--dark">' + esc(a.group) + '</span>') + '</div>' +
      '<h1>' + esc(a.name) + '</h1>' +
      '<p class="pa-hero__lede">' + esc(a.summary) + '</p>' +
      '<div class="pa-hero__meta">' +
        '<span>' + a.services.length + ' services</span>' +
        '<span>' + esc(a.tagline) + '</span>' +
        '<a href="' + tel(s.phone) + '" style="color:var(--brass-400)">' + esc(s.phone) + '</a>' +
      '</div>' +
    '</div></header>' +

    '<section class="section"><div class="wrap"><div class="split split--wide-left">' +
      '<div>' +
        '<span class="eyebrow">What we handle</span>' +
        '<h2 class="mt3 mb6">Services, and what each one costs.</h2>' +
        S.serviceRows(a.services, { areaId: a.id, areaName: a.name, attorney: (handlers[0] && handlers[0].name) || '' }) +
        '<div class="notice mt6">Fees shown are illustrative starting points for this practice area and are not a quote. ' +
          'The binding fee is set in a signed engagement agreement after we review your facts. ' +
          'Contingency matters carry no fee and no cost reimbursement if there is no recovery.</div>' +
      '</div>' +
      '<aside class="stack">' +
        '<div class="card card--accent">' +
          '<h4 class="mb4">Start here</h4>' +
          '<a class="btn btn--brass btn--block btn--lg mb3" href="/practice-areas/' + esc(a.id) + '/start">' +
            'Begin your free review&nbsp;&rarr;</a>' +
          '<p class="tiny muted mb3">A few short questions, one per page. It takes a minute and an attorney reads ' +
            'the whole thing before replying.</p>' +
          '<a class="btn btn--ghost btn--block mb3" href="' + tel(s.phone) + '">Call ' + esc(s.phone) + '</a>' +
          '<a class="btn btn--ghost btn--block" href="' + safeUrl(wa(s.whatsapp)) + '" target="_blank" rel="noopener">WhatsApp</a>' +
        '</div>' +
        (handlers.length ? '<div class="card"><h4 class="mb4">Who handles this</h4>' +
          handlers.map(h => '<a href="/attorneys/' + esc(h.id) + '" class="row" style="gap:.7rem;padding:.5rem 0;border-bottom:1px solid var(--line)">' +
            '<img class="guarded" src="' + esc(h.headshot) + '" alt="" width="42" height="52" style="object-fit:cover;flex-shrink:0" draggable="false">' +
            '<span><span style="display:block;font-size:.87rem;font-weight:600">' + esc(h.name) + '</span>' +
            '<span class="tiny muted">' + esc(h.title) + '</span></span></a>').join('') + '</div>' : '') +
        '<div class="card card--flat">' +
          '<h4 class="mb3">Jurisdictions</h4>' +
          '<p class="small muted">Handled in all 51 jurisdictions. Counsel of record in ' +
            R.states.filter(x => x.admitted).length + ' states, local co-counsel elsewhere.</p>' +
          '<a class="link-arrow mt4" style="display:inline-flex" href="/coverage">Check your state</a>' +
        '</div>' +
      '</aside>' +
    '</div></div></section>' +

    '<section class="section section--bone section--rule"><div class="wrap"><div class="split">' +
      '<div class="rv">' +
        S.secHead({ eyebrow: 'Process', title: 'How a ' + a.name.replace(/ Law$/, '').toLowerCase() + ' matter runs.' }) +
        S.steps(R.content.process) +
      '</div>' +
      '<div class="rv rv-d2">' +
        S.secHead({ eyebrow: 'Common questions', title: 'Asked about this area.' }) +
        S.accordion(R.content.faqs.slice(0, 7), true) +
      '</div>' +
    '</div></div></section>' +

    (related.length ? '<section class="section"><div class="wrap">' +
      S.secHead({ eyebrow: 'Related', title: 'Other ' + esc(a.group.toLowerCase()) + ' matters.' }) +
      '<div class="pa-grid">' + related.map(x => S.paCard(x)).join('') + '</div>' +
    '</div></section>' : '') +

    S.ctaBand(s, { inline: true, areaId: a.id, title: 'Tell us about your ' + a.name.replace(/ Law$/, '').toLowerCase() + ' matter.', context: 'Booking a free case review for ' + a.name + '.' });

  return {
    title: a.name + ' Lawyers | Nationwide | Oakstone Legal Group',
    description: a.tagline + ' ' + a.summary.slice(0, 120),
    canonical: '/practice-areas/' + a.id,
    body,
    schema: {
      '@context': 'https://schema.org', '@type': 'Service',
      name: a.name, description: a.summary,
      provider: { '@type': 'LegalService', name: s.firmName, telephone: s.phone },
      areaServed: { '@type': 'Country', name: 'United States' },
      hasOfferCatalog: {
        '@type': 'OfferCatalog', name: a.name,
        itemListElement: a.services.map(x => ({ '@type': 'Offer', name: x.name, description: x.desc }))
      }
    }
  };
}

/* ===================== ATTORNEYS ===================== */
function attorneyIndex(s) {
  const all = R.attorneys();
  const body =
    '<header class="pagehead"><div class="wrap">' +
      S.crumbs([{ label: 'Home', href: '/' }, { label: 'Attorneys' }]) +
      '<h1>Attorneys of record.</h1>' +
      '<p class="lede mt4 measure">' + all.length + ' attorneys across the firm practice groups. Each profile lists bar admissions, ' +
        'education and the practice areas that attorney handles.</p>' +
    '</div></header>' +
    '<section class="section"><div class="wrap">' +
      '<div class="att-grid">' + all.map((a, i) => S.attCard(a, (i % 4) + 1)).join('') + '</div>' +
    '</div></section>' +
    S.ctaBand(s, { inline: true, title: 'Ask for a specific attorney.', context: 'Booking a free case review with a specific attorney of the firm.' });
  return {
    title: 'Our Attorneys | Oakstone Legal Group',
    description: 'Meet the attorneys of Oakstone Legal Group. Bar admissions, education, languages and practice areas for every attorney of record at the firm.',
    canonical: '/attorneys', body,
    schema: { '@context': 'https://schema.org', '@type': 'ItemList',
      itemListElement: all.map((a, i) => ({ '@type': 'ListItem', position: i + 1, name: a.name, url: L.SITE_ORIGIN + '/attorneys/' + a.id })) }
  };
}

function attorneyProfile(s, a) {
  const areasFor = a.practices.map(R.byId).filter(Boolean);
  const rt = I.ratingFor(a, R.reviews());
  const reviews = rt.reviews.slice(0, 6);
  const rated = false;

  const ratingBlock =
    '<div class="ratingbox mb6">' +
      '<div class="ratingline">' +
        '<span class="ratingline__n" style="font-size:1.5rem;font-family:var(--serif)">' + (rt.count ? rt.avg.toFixed(1) : '\u2014') + '</span>' +
        I.stars(rt.avg) +
        '<span class="ratingline__c">' +
          (rt.count ? rt.count + ' client rating' + (rt.count === 1 ? '' : 's') : 'Not yet rated') +
        '</span>' +
      '</div>' +
      '<p class="small muted mt3" style="margin-bottom:0">' +
        (rt.count
          ? 'Averaged from reviews the firm has verified. Individual results differ; a rating is not a prediction of your outcome.'
          : 'This attorney has not been rated yet. If you have worked with ' + esc(a.name.split(' ')[0]) + ', you can leave the first review below.') +
      '</p>' +
    '</div>' +

    (reviews.length ? '<div class="mb6">' + reviews.map(r =>
      '<div class="review">' +
        '<div class="review__head">' + I.stars(Number(r.rating) || 0) +
          '<span class="review__who">' + esc(r.author || 'Client') + '</span>' +
          (r.matter ? '<span class="review__when">' + esc(r.matter) + '</span>' : '') +
        '</div>' +
        '<p class="review__text">\u201c' + esc(r.quote || '') + '\u201d</p>' +
      '</div>').join('') + '</div>' : '') +

    '<form class="ratingbox" method="post" action="/api/rate-attorney" id="rate">' +
      '<input type="hidden" name="attorneyId" value="' + esc(a.id) + '">' +
      '<input type="hidden" name="rating" id="rate-value" value="5">' +
      '<h3 style="font-size:1.05rem;margin-bottom:.35rem">Rate ' + esc(a.name.split(' ')[0]) + '</h3>' +
      '<p class="small muted" style="margin-bottom:.8rem">Worked with this attorney? Leave a rating and a short note. ' +
        'Reviews are checked by the firm before they appear, because advertising rules require it.</p>' +
      '<div class="ratingbox__pick" data-for="rate-value" role="radiogroup" aria-label="Star rating">' +
        [1, 2, 3, 4, 5].map(n => '<button type="button" class="is-on" aria-label="' + n + ' star' + (n === 1 ? '' : 's') + '">\u2605</button>').join('') +
      '</div>' +
      '<div class="form-grid mt4">' +
        '<div class="form-row"><label for="rate-author">Your name or initials</label>' +
          '<input class="field" id="rate-author" name="author" maxlength="120"></div>' +
        '<div class="form-row"><label for="rate-matter">What the matter was</label>' +
          '<input class="field" id="rate-matter" name="matter" maxlength="200" placeholder="e.g. Custody modification, Ohio"></div>' +
        '<div class="form-row full"><label for="rate-quote">Your review</label>' +
          '<textarea class="field" id="rate-quote" name="quote" rows="3" maxlength="1200" ' +
          'placeholder="What the representation was like, in your own words" required></textarea></div>' +
      '</div>' +
      '<button class="btn btn--primary mt4" type="submit">Submit review</button>' +
    '</form>';

  const body =
    '<header class="pagehead"><div class="wrap">' +
      S.crumbs([{ label: 'Home', href: '/' }, { label: 'Attorneys', href: '/attorneys' }, { label: a.name }]) +
    '</div></header>' +
    '<section class="section"><div class="wrap"><div class="att-profile">' +
      '<div>' +
        '<div class="att-profile__photo"><img class="guarded" src="' + esc(a.headshot) + '" alt="' + esc(a.name) + '" width="480" height="600" draggable="false"></div>' +
        '<div class="card mt5">' +
          I.trigger('Book with ' + a.name.split(' ')[0], { class: 'btn btn--primary btn--block mb3', attorney: a.id,
            area: (a.practices[0] || ''),
            context: 'Booking a free case review with ' + a.name + '. An attorney reads your submission and replies with the deadlines that apply and the fee structure we would propose.' }) +
          '<a class="btn btn--ghost btn--block mb3" href="' + tel(s.phone) + '">Call ' + esc(s.phone) + '</a>' +
          '<a class="btn btn--ghost btn--block" href="mailto:' + esc(a.email) + '">Email directly</a>' +
        '</div>' +
      '</div>' +
      '<div>' +
        '<span class="eyebrow">' + esc(a.title) + '</span>' +
        '<h1 class="mt3">' + esc(a.name) + '</h1>' +
        (rt.count ? '<div class="ratingline mt3">' + I.stars(rt.avg) +
          '<span class="ratingline__n">' + rt.avg.toFixed(1) + '</span>' +
          '<span class="ratingline__c">' + rt.count + ' review' + (rt.count === 1 ? '' : 's') + '</span></div>' : '') +
        '<p class="lede mt4">' + esc(a.bio) + '</p>' +
        '<div class="dl mt6">' +
          '<div class="dl__row"><div class="dl__k">Experience</div><div class="dl__v">' + a.years + ' years in practice</div></div>' +
          '<div class="dl__row"><div class="dl__k">Bar admissions</div><div class="dl__v">' + a.admissions.map(esc).join('<br>') + '</div></div>' +
          '<div class="dl__row"><div class="dl__k">Education</div><div class="dl__v">' + a.education.map(esc).join('<br>') + '</div></div>' +
          '<div class="dl__row"><div class="dl__k">Languages</div><div class="dl__v">' + a.languages.map(esc).join(', ') + '</div></div>' +
          '<div class="dl__row"><div class="dl__k">Bar number</div><div class="dl__v mono">' + esc(a.barNumber) + '</div></div>' +
          (a.office ? '<div class="dl__row"><div class="dl__k">Office</div><div class="dl__v">' + esc(a.office) + '</div></div>' : '') +
          (a.phone ? '<div class="dl__row"><div class="dl__k">Direct line</div><div class="dl__v"><a href="' + tel(a.phone) + '">' + esc(a.phone) + '</a></div></div>' : '') +
          '<div class="dl__row"><div class="dl__k">Email</div><div class="dl__v"><a href="mailto:' + esc(a.email) + '">' + esc(a.email) + '</a></div></div>' +
        '</div>' +
        (areasFor.length ? '<h3 class="mt7 mb4">Practice areas</h3><div class="row" style="gap:.5rem">' +
          areasFor.map(x => '<a class="tag" href="/practice-areas/' + esc(x.id) + '">' + esc(x.name) + '</a>').join('') + '</div>' : '') +
        '<div class="mt7">' + ratingBlock + '</div>' +
        '<div class="notice mt6">Admission to practice is jurisdiction-specific. This attorney appears in the courts ' +
          'listed above and works with admitted local counsel elsewhere.</div>' +
      '</div>' +
    '</div></div></section>' +
    S.ctaBand(s, { inline: true, areaId: (a.practices[0] || ''), title: 'Work with ' + a.name.split(' ')[0] + '.', context: 'Booking a free case review with ' + a.name + '.' });
  return {
    title: a.name + ' | ' + a.title + ' | Oakstone Legal Group',
    description: a.bio.slice(0, 155),
    canonical: '/attorneys/' + a.id, body,
    schema: { '@context': 'https://schema.org', '@type': 'Attorney', name: a.name, jobTitle: a.title,
      worksFor: { '@type': 'LegalService', name: s.firmName }, email: a.email,
      knowsAbout: areasFor.map(x => x.name), alumniOf: a.education,
      ...(rt.count ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: rt.avg, reviewCount: rt.count, bestRating: 5 } } : {}) }
  };
}

/* ===================== COVERAGE ===================== */
function coverage(s) {
  const body =
    '<header class="pagehead"><div class="wrap">' +
      S.crumbs([{ label: 'Home', href: '/' }, { label: 'Coverage' }]) +
      '<h1>Coverage in every state.</h1>' +
      '<p class="lede mt4 measure">Counsel of record in ' + R.states.filter(x => x.admitted).length +
        ' states and the District of Columbia. In the remaining states we run the matter through admitted local counsel ' +
        'under our case strategy. Select a state to see the bar, the court system and any jurisdictional note that matters.</p>' +
    '</div></header>' +
    '<section class="section"><div class="wrap">' +
      '<div class="state-grid">' + R.states.map(st =>
        '<a class="state-cell" href="/coverage/' + esc(st.code.toLowerCase()) + '">' +
          '<span class="state-cell__code">' + esc(st.code) + '</span>' +
          '<span class="state-cell__name">' + esc(st.name) + '</span>' +
          '<span class="state-cell__dot' + (st.admitted ? '' : ' state-cell__dot--off') + '"></span>' +
          '<span class="state-cell__lbl">' + (st.admitted ? 'Counsel of record' : 'Local counsel') + '</span>' +
        '</a>').join('') + '</div>' +
      '<div class="notice mt6">Coverage reflects where the firm or its local counsel may appear. It is not a ' +
        'statement that every attorney is admitted in every state. Admission is verified per matter before engagement.</div>' +
    '</div></section>' +
    S.ctaBand(s, { inline: true, title: 'Not sure which state applies?', context: 'Not sure which state governs the matter; asking the firm to confirm jurisdiction.' });
  return {
    title: 'Nationwide Coverage | All 50 States and DC | Oakstone Legal Group',
    description: 'Oakstone Legal Group covers all 50 states and the District of Columbia. Counsel of record in ' + R.states.filter(x => x.admitted).length + ' states, with admitted local counsel handling other jurisdictions.',
    canonical: '/coverage', body,
    schema: { '@context': 'https://schema.org', '@type': 'ItemList',
      itemListElement: R.states.map((x, i) => ({ '@type': 'ListItem', position: i + 1, name: x.name })) }
  };
}

function statePage(s, st) {
  const body =
    '<header class="pagehead"><div class="wrap">' +
      S.crumbs([{ label: 'Home', href: '/' }, { label: 'Coverage', href: '/coverage' }, { label: st.name }]) +
      '<h1>' + esc(st.name) + '</h1>' +
      '<p class="lede mt4 measure">' + esc(st.note) + '</p>' +
      '<div class="row mt5" style="gap:.6rem">' +
        '<span class="tag ' + (st.admitted ? 'tag--brass' : '') + '">' + (st.admitted ? 'Counsel of record' : 'Local counsel') + '</span>' +
        '<span class="tag">' + esc(st.code) + '</span>' +
      '</div>' +
    '</div></header>' +
    '<section class="section"><div class="wrap"><div class="split">' +
      '<div>' +
        '<div class="dl">' +
          '<div class="dl__row"><div class="dl__k">State</div><div class="dl__v">' + esc(st.name) + '</div></div>' +
          '<div class="dl__row"><div class="dl__k">Capital</div><div class="dl__v">' + esc(st.capital) + '</div></div>' +
          '<div class="dl__row"><div class="dl__k">Bar</div><div class="dl__v">' + esc(st.barName) + '</div></div>' +
          '<div class="dl__row"><div class="dl__k">Court system</div><div class="dl__v">' + esc(st.courts) + '</div></div>' +
          '<div class="dl__row"><div class="dl__k">Representation</div><div class="dl__v">' +
            (st.admitted ? 'Direct, through attorneys admitted in ' + esc(st.name) + '.'
                         : 'Through admitted co-counsel under firm case strategy.') + '</div></div>' +
        '</div>' +
        '<div class="notice mt6">Rules, limitation periods and filing requirements vary by state. ' +
          'The note above is general information about ' + esc(st.name) + ', not legal advice about your matter. ' +
          'Deadlines are computed from your specific facts during the case review.</div>' +
        '<h3 class="mt7 mb4">Practice areas available in ' + esc(st.name) + '</h3>' +
        '<div class="row" style="gap:.45rem">' + R.allAreas().slice(0, 18).map(a =>
          '<a class="tag" href="/practice-areas/' + esc(a.id) + '">' + esc(a.name) + '</a>').join('') +
          '<span class="tag">and ' + (R.allAreas().length - 18) + ' more</span></div>' +
      '</div>' +
      '<aside class="stack">' +
        '<div class="card card--accent">' +
          '<h4 class="mb3">' + esc(st.name) + ' case review</h4>' +
          '<p class="small muted mb4">Tell us the county and the court, and we will confirm who appears before you book.</p>' +
          I.trigger('Book a review', { class: 'btn btn--primary btn--block mb3', area: 'general',
            context: 'Booking a case review for a matter in ' + st.name + ' (' + st.code + '). An attorney confirms which court the matter sits in and who appears, then replies with the deadlines and fee structure.' }) +
          '<a class="btn btn--ghost btn--block" href="' + tel(s.phone) + '">Call ' + esc(s.phone) + '</a>' +
        '</div>' +
        '<div class="card card--flat"><h4 class="mb3">Other states</h4>' +
          '<div class="row" style="gap:.3rem">' + R.states.filter(x => x.code !== st.code).slice(0, 20).map(x =>
            '<a class="tag" href="/coverage/' + esc(x.code.toLowerCase()) + '">' + esc(x.code) + '</a>').join('') + '</div>' +
          '<a class="link-arrow mt4" style="display:inline-flex" href="/coverage">All jurisdictions</a>' +
        '</div>' +
      '</aside>' +
    '</div></div></section>' +
    S.ctaBand(s, { inline: true, areaId: 'general', title: 'Filing in ' + st.name + '?', context: 'Booking a case review for a matter in ' + st.name + '.' });
  return {
    title: st.name + ' Attorneys | Oakstone Legal Group',
    description: st.note.slice(0, 155),
    canonical: '/coverage/' + st.code.toLowerCase(), body,
    schema: { '@context': 'https://schema.org', '@type': 'LegalService', name: s.firmName + ' — ' + st.name,
      areaServed: { '@type': 'State', name: st.name } }
  };
}

module.exports = { practiceHub, practice, attorneyIndex, attorneyProfile, coverage, statePage };
