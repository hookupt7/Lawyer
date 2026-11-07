'use strict';
/**
 * Oakstone — page builders. Each returns { title, description, body, schema, noindex }.
 */
const R = require('./render.js');
const L = require('./layout.js');
const S = require('./sections.js');
const esc = R.esc, tel = R.tel, icon = R.icon, wa = R.wa, safeUrl = R.safeUrl;

const ORIGIN = L.SITE_ORIGIN;

function orgSchema(s) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: s.firmName,
    url: ORIGIN,
    telephone: s.phone,
    email: s.email,
    image: ORIGIN + '/assets/img/og-default.svg',
    address: {
      '@type': 'PostalAddress',
      streetAddress: s.address,
      addressLocality: s.city,
      addressRegion: s.stateCode,
      postalCode: s.zip,
      addressCountry: 'US'
    },
    areaServed: R.states.map(x => ({ '@type': 'State', name: x.name })),
    openingHours: s.hours,
    knowsAbout: R.areas.map(a => a.name)
  };
}

/* ============================= HOME ============================= */
function home(s) {
  const featured = ['family', 'cyber', 'injury', 'criminal', 'business', 'immigration'].map(R.byId).filter(Boolean);

  const body =
    '<section class="hero">' +
      '<div class="hero__grid"></div>' +
      '<div class="wrap"><div class="hero__inner">' +
        '<div>' +
          '<div class="hero__eyebrow"><span class="pulse-dot"></span>' +
            '<span class="eyebrow eyebrow--light" style="margin:0">24 hour emergency intake</span></div>' +
          '<h1>A nationwide firm for the cases<br>that will not wait.</h1>' +
          '<p class="hero__lede">Twenty-six practice areas, 236 defined services, and counsel of record in ' +
            R.states.filter(x => x.admitted).length + ' states. One point of contact, one written scope, ' +
            'one fee agreement that states exactly what is included.</p>' +
          '<div class="hero__cta">' +
            '<a class="btn btn--brass btn--lg" href="/book">Get a free case review</a>' +
            '<a class="btn btn--ghostlight btn--lg" href="' + tel(s.phone) + '">Call ' + esc(s.phone) + '</a>' +
          '</div>' +
          '<div class="hero__proof">' +
            R.content.stats.slice(0, 3).map(x => '<div><strong>' + esc(x.value) + '</strong><span>' + esc(x.label) + '</span></div>').join('') +
          '</div>' +
        '</div>' +

        '<div class="intake rv rv-d2">' +
          '<div class="intake__title">Confidential case review</div>' +
          '<div class="intake__sub">Free. Reviewed by an attorney, not an intake service.</div>' +
          '<form method="post" action="/api/contact" novalidate>' +
            '<input type="hidden" name="source" value="home-hero">' +
            '<div class="intake__row"><label for="h-name">Your name</label>' +
              '<input class="field" id="h-name" name="name" type="text" required autocomplete="name" placeholder="First and last"></div>' +
            '<div class="intake__row"><label for="h-phone">Phone</label>' +
              '<input class="field" id="h-phone" name="phone" type="tel" required autocomplete="tel" placeholder="(555) 000-0000"></div>' +
            '<div class="intake__row"><label for="h-email">Email</label>' +
              '<input class="field" id="h-email" name="email" type="email" required autocomplete="email" placeholder="you@example.com"></div>' +
            '<div class="intake__row"><label for="h-area">What do you need help with</label>' +
              '<select class="field" id="h-area" name="practiceArea" required>' +
                '<option value="">Select a practice area</option>' +
                R.areas.map(a => '<option value="' + esc(a.id) + '">' + esc(a.name) + '</option>').join('') +
              '</select></div>' +
            '<div class="intake__row"><label for="h-details">Briefly, what happened</label>' +
              '<textarea class="field" id="h-details" name="details" rows="3" placeholder="Dates, parties, and any deadline you know of"></textarea></div>' +
            '<button class="btn btn--brass btn--block btn--lg" type="submit">Request my free review</button>' +
            '<p class="tiny mt4" style="color:var(--ink-400);line-height:1.5">Submitting this form does not create an ' +
              'attorney-client relationship. Information sent is treated as confidential.</p>' +
          '</form>' +
        '</div>' +
      '</div></div>' +
    '</section>' +

    S.statBand(R.content.stats) +

    /* Practice areas */
    '<section class="section">' +
      '<div class="wrap">' +
        S.secHead({ eyebrow: 'Practice areas', title: 'Twenty-six areas of law.<br>One firm behind all of them.',
          text: 'Organised the way clients describe their problem, not the way a firm describes itself. Choose the situation that matches yours.' }) +
        S.paGrid(R.areas.slice(0, 12)) +
        '<div class="center mt7"><a class="btn btn--ghost btn--lg" href="/practice-areas">See all ' +
          R.areas.length + ' practice areas</a></div>' +
      '</div>' +
    '</section>' +

    /* Cyber division spotlight */
    '<section class="section section--dark">' +
      '<div class="wrap"><div class="split split--wide-left">' +
        '<div class="rv">' +
          '<span class="eyebrow eyebrow--light">Cyber Law and Digital Recovery</span>' +
          '<h2 style="color:var(--bone);margin:.75rem 0 1rem">If you were hacked, scammed or extorted,<br>the first 72 hours decide the outcome.</h2>' +
          '<p class="light-text measure">Funds and accounts are usually still reachable on day one and rarely ' +
            'reachable on day sixty. This division preserves evidence, serves preservation letters on banks and ' +
            'exchanges, and files an evidence package to the federal agencies that can act on it.</p>' +
          '<div class="grid g2 mt6" style="gap:1rem">' +
            ['Cryptocurrency tracing and recovery', 'Ransomware and extortion response',
             'Business email compromise', 'Investment and romance scam recovery',
             'Account takeover', 'Federal agency liaison'].map(x =>
              '<div class="row" style="gap:.55rem;align-items:flex-start">' +
              '<span style="color:var(--brass-400);flex-shrink:0;margin-top:3px">' + icon('cyber', '') + '</span>' +
              '<span class="small light-text">' + esc(x) + '</span></div>').join('') +
          '</div>' +
          '<div class="hero__cta mt7">' +
            '<a class="btn btn--brass btn--lg" href="/cyber-law-center">Open the Cyber Law Center</a>' +
            '<a class="btn btn--ghostlight btn--lg" href="' + tel(s.phoneEmergency) + '">Emergency line</a>' +
          '</div>' +
        '</div>' +
        '<div class="card card--dark rv rv-d2">' +
          '<span class="tag tag--urgent">Urgent</span>' +
          '<h3 style="color:var(--bone);margin:1rem 0 .75rem">First 60 minutes</h3>' +
          '<ol class="stack-sm" style="counter-reset:n">' +
            R.content.cyber.emergencySteps.slice(0, 3).map((x, i) =>
              '<li class="small light-text" style="display:flex;gap:.7rem;align-items:flex-start">' +
              '<span class="mono" style="color:var(--brass-400);flex-shrink:0">0' + (i + 1) + '</span>' +
              '<span>' + esc(x) + '</span></li>').join('') +
          '</ol>' +
          '<div class="notice notice--dark mt5 small">No firm can guarantee recovery of stolen funds. ' +
            'Any service that promises a fixed percentage back before tracing is done is not telling you the truth.</div>' +
        '</div>' +
      '</div></div>' +
    '</section>' +

    /* Process */
    '<section class="section">' +
      '<div class="wrap">' +
        S.secHead({ eyebrow: 'How it works', title: 'Four steps, and you know the cost before the third.',
          text: 'No work begins and no fee is earned until you hold a signed agreement that says what is covered.' }) +
        S.steps(R.content.process) +
      '</div>' +
    '</section>' +

    /* Attorneys */
    '<section class="section section--bone section--rule">' +
      '<div class="wrap">' +
        S.secHead({ eyebrow: 'The people who do the work', title: 'Attorneys, not a call centre.',
          text: 'Every matter is assigned a lead attorney and a paralegal. You are given direct numbers for both.' }) +
        '<div class="att-grid">' + R.attorneys().filter(a => a.featured).slice(0, 4).map((a, i) => S.attCard(a, i + 1)).join('') + '</div>' +
        '<div class="mt7"><a class="link-arrow" href="/attorneys">Meet all ' + R.attorneys().length + ' attorneys of record</a></div>' +
      '</div>' +
    '</section>' +

    /* Reviews */
    '<section class="section">' +
      '<div class="wrap">' +
        S.secHead({ eyebrow: 'Client outcomes', title: 'What clients said afterward.',
          text: 'Testimonials are published with initials and jurisdiction. Prior results do not guarantee a similar outcome.' }) +
        S.quotes(R.content.testimonials, 6) +
      '</div>' +
    '</section>' +

    /* Coverage + FAQ */
    '<section class="section section--bone section--rule">' +
      '<div class="wrap"><div class="split">' +
        '<div class="rv">' +
          '<span class="eyebrow">Nationwide coverage</span>' +
          '<h2 style="margin:.75rem 0 1rem">Admitted in ' + R.states.filter(x => x.admitted).length + ' states.<br>Effective everywhere else.</h2>' +
          '<p class="muted measure">Where we hold counsel of record we appear directly. Where we do not, we run ' +
            'the case strategy and appear through admitted local counsel, which is the standard arrangement for ' +
            'matters that cross state lines. You keep one point of contact either way.</p>' +
          '<div class="grid g3 mt6" style="gap:1rem">' +
            [{ v: R.states.filter(x => x.admitted).length, l: 'States with counsel of record' },
             { v: R.states.filter(x => !x.admitted).length, l: 'States via local counsel' },
             { v: 51, l: 'Jurisdictions covered' }].map(x =>
              '<div><div class="num" style="font-size:1.6rem;color:var(--ox-500)">' + x.v + '</div>' +
              '<div class="tiny muted">' + esc(x.l) + '</div></div>').join('') +
          '</div>' +
          '<div class="mt6"><a class="link-arrow" href="/coverage">Check your state</a></div>' +
        '</div>' +
        '<div class="rv rv-d2">' +
          '<span class="eyebrow">Questions</span>' +
          '<h3 style="margin:.75rem 0 1rem">Before you call</h3>' +
          S.accordion(R.content.faqs.slice(0, 6), true) +
          '<div class="mt5"><a class="link-arrow" href="/faq">All ' + R.content.faqs.length + ' questions</a></div>' +
        '</div>' +
      '</div></div>' +
    '</section>' +

    S.ctaBand(s);
  '</section>';

  return {
    title: 'Oakstone Legal Group | Nationwide Legal Representation in 26 Practice Areas',
    description: 'Nationwide law firm handling family, cyber and digital recovery, personal injury, criminal defense, business, immigration and 21 further practice areas. Counsel of record in ' + R.states.filter(x => x.admitted).length + ' states. 24 hour emergency intake.',
    canonical: '/',
    body,
    schema: orgSchema(s)
  };
}

module.exports = { home, orgSchema, ORIGIN };
