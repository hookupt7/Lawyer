'use strict';
/**
 * Oakstone — page builders. Each returns { title, description, body, schema, noindex }.
 */
const R = require('./render.js');
const L = require('./layout.js');
const S = require('./sections.js');
const E = require('./explorer.js');
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
    knowsAbout: R.allAreas().map(a => a.name)
  };
}

/* ============================= INTRO (SPLASH) =============================
   The front door. Full-viewport dark gateway that introduces the firm;
   "Enter" leads to the main site where the practice options live. */
function intro(s) {
  const svcCount = R.allAreas().reduce((n, a) => n + a.services.length, 0);
  const admitted = R.states.filter(x => x.admitted).length;

  const principles = [
    { t: 'A written scope before work', d: 'No engagement starts on a handshake. You receive a scope document that lists what will be done, by whom, and at what price — before anything is billed.' },
    { t: 'Direct attorney contact', d: 'Every matter is assigned a lead attorney and a paralegal. You are given both of their direct lines on day one, not a case number.' },
    { t: 'Fees stated upfront', d: 'Flat, hourly, or contingency — the model and the number are written into the agreement before you sign, not discovered in an invoice.' }
  ];

  const body =
    '<section class="gate">' +
      '<div class="gate__bg" aria-hidden="true">' +
        '<img class="gate__photo guarded" src="/assets/img/hero/counsel-bg.jpg" alt="" aria-hidden="true" draggable="false">' +
      '</div>' +
      '<div class="gate__bar">' +
        L.brand() +
        '<nav class="gate__links" aria-label="Quick links">' +
          '<a href="/practice-areas">Practice areas</a>' +
          '<a href="/attorneys">Attorneys</a>' +
          '<a href="/pricing">Fees</a>' +
          '<a href="/contact">Contact</a>' +
        '</nav>' +
        '<a class="btn btn--brass btn--sm" href="/book">Book a review</a>' +
      '</div>' +
      '<div class="gate__body"><div class="gate__inner">' +
        '<div class="gate__eyebrow" data-hero style="--i:0">' +
          '<span>Counsel of record in ' + admitted + ' states</span></div>' +
        '<h1 data-hero style="--i:1">Serious counsel for the problems<br><span class="grad-text">that will not wait.</span></h1>' +
        '<p class="gate__lede" data-hero style="--i:2">Oakstone Legal Group is a nationwide law firm built for the matters ' +
          'that punish delay — family, cyber and digital recovery, injury, criminal defense, business and ' +
          (R.allAreas().length - 5) + ' further practice areas. You receive a written scope, a stated fee, and a named ' +
          'attorney before any work begins.</p>' +
        '<div class="gate__actions" data-hero style="--i:3">' +
          '<a class="btn btn--brass btn--lg" href="/home">Enter the firm&nbsp;&rarr;</a>' +
          '<a class="btn btn--ghostlight btn--lg" href="' + tel(s.phone) + '">Call ' + esc(s.phone) + '</a>' +
        '</div>' +
        '<div class="gate__facts" data-hero style="--i:4">' +
          '<div class="gate__fact"><strong>' + R.allAreas().length + '</strong><span>practice areas, each with its own page</span></div>' +
          '<div class="gate__fact"><strong>' + svcCount + '</strong><span>defined services with stated fee models</span></div>' +
          '<div class="gate__fact"><strong>' + admitted + '</strong><span>states with counsel of record</span></div>' +
          '<div class="gate__fact"><strong>24h</strong><span>emergency intake, answered within one hour</span></div>' +
        '</div>' +
      '</div></div>' +
      '<div class="gate__scroll" aria-hidden="true"><span>Scroll</span><i></i></div>' +
    '</section>' +

    '<section class="section section--dark">' +
      '<div class="wrap">' +
        '<div class="about-firm">' +
          '<div class="about-firm__head rv">' +
            '<span class="eyebrow eyebrow--light">Who we are</span>' +
            '<h2>A firm built for the matters that will not wait.</h2>' +
          '</div>' +
          '<div class="about-firm__body rv rv-d1">' +
            '<p>Oakstone Legal Group represents individuals, families, and businesses across ' + admitted + ' states. ' +
              'We keep a narrow promise: every engagement begins with a named attorney, a written scope of work, ' +
              'and a fee stated before anything is billed. From a contested custody motion to a federal cyber-crime ' +
              'referral, the same standard applies.</p>' +
            '<p>We do not run an intake call center. The attorney who reviews your matter is the attorney who handles it. ' +
              'Across ' + R.allAreas().length + ' practice areas and ' + svcCount + ' defined services, our work is built to be ' +
              'understood, priced, and scheduled without ambiguity.</p>' +
            '<div class="about-firm__actions">' +
              '<a class="btn btn--brass btn--lg" href="/home">Enter and choose your practice area&nbsp;&rarr;</a>' +
              '<p class="tiny mt4 light-muted">Free case review &middot; No obligation &middot; ' + admitted + '-state coverage</p>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</section>';

  return {
    title: 'Oakstone Legal Group | Nationwide Legal Representation in ' + R.allAreas().length + ' Practice Areas',
    description: 'Nationwide law firm handling family, cyber and digital recovery, personal injury, criminal defense, business, immigration and ' + (R.allAreas().length - 6) + ' further practice areas. Counsel of record in ' + admitted + ' states. 24 hour emergency intake.',
    canonical: '/',
    bodyClass: 'gate-body',
    bare: true,
    body,
    schema: orgSchema(s)
  };
}

/* ============================= HOME (MAIN) ============================= */
function mainHome(s) {
  const areaCount = R.allAreas().length;
  const svcTotal = R.allAreas().reduce((n, a) => n + (a.services ? a.services.length : 0), 0);
  const admitted = R.states.filter(x => x.admitted).length;
  const coCounsel = R.states.length - admitted;

  const body =
    /* The hero makes the argument; the band below it carries the figures.
       The lede used to recite the counts as well, which left the band with
       nothing to say. */
    '<section class="hero">' +
      '<div class="hero__grid"></div>' +
      '<div class="wrap"><div class="hero__inner hero__inner--solo">' +
        '<div>' +
          '<div class="hero__eyebrow" data-hero style="--i:0">' +
            '<span class="eyebrow eyebrow--light" style="margin:0">24 hour emergency intake</span></div>' +
          '<h1 data-hero style="--i:1">A nationwide firm for the cases<br>that will not wait.</h1>' +
          '<p class="hero__lede" data-hero style="--i:2">A filing deadline does not move because you ' +
            'needed a week to find a lawyer. You get one point of contact, one written scope of work, ' +
            'and one fee agreement that states what is owed before anyone starts.</p>' +
          '<div class="hero__cta" data-hero style="--i:3">' +
            '<a class="btn btn--brass btn--lg" href="/practice-areas">Find your practice area</a>' +
            '<a class="btn btn--ghostlight btn--lg" href="/book">Book a free case review</a>' +
          '</div>' +
        '</div>' +
      '</div></div>' +
    '</section>' +

    /* Four blocks left this page on the client's instruction: the "Or call —"
       line, the 9,000 / 50 / 26 proof figures, the scrolling practice ticker,
       and the statistics band that repeated those same three figures. What
       they said was "the calling, 9000 matters handled, and the stuff moving
       under it". The figures return below, once, on a light ground.

       The practice-area cards are gone too. The nav and the /practice-areas
       hub own that job; 26 cards here only pushed the real content down. */

    /* A light band sits between the dark hero and the dark cyber section.
       Two dark blocks with nothing between them read as one slab. This is
       also the honest place to state admission, since the old "counsel of
       record in 50 states" line counted jurisdictions we are not admitted
       in and reach only through local co-counsel. */
    '<section class="introwrap">' +
      '<div class="wrap"><div class="introband">' +
        '<div class="introband__lede">' +
          '<span class="eyebrow">The firm in one paragraph</span>' +
          '<p class="introband__p">Oakstone practises in ' + areaCount + ' areas of law and ' +
            svcTotal + ' named services. Counsel of record is admitted in ' + admitted +
            ' states, with vetted local co-counsel in the remaining ' + coCounsel + '. ' +
            'One point of contact and one written scope, whether the matter is a closing or a ' +
            'federal cyber case.</p>' +
        '</div>' +
        '<div class="introband__facts">' +
          '<div class="introfact"><span class="introfact__n">' + admitted + '</span>' +
            '<span class="introfact__l">States with counsel of record</span></div>' +
          '<div class="introfact"><span class="introfact__n">' + coCounsel + '</span>' +
            '<span class="introfact__l">Served by local co-counsel</span></div>' +
          '<div class="introfact"><span class="introfact__n">' + areaCount + '</span>' +
            '<span class="introfact__l">Practice areas</span></div>' +
          '<div class="introfact"><span class="introfact__n">24/7</span>' +
            '<span class="introfact__l">Emergency intake</span></div>' +
        '</div>' +
      '</div></div>' +
    '</section>' +

    /* cyber compact strip */
    '<section class="section section--dark section--tight">' +
      '<div class="wrap"><div class="split">' +
        '<div class="rv">' +
          '<span class="eyebrow eyebrow--light">Cyber Law and Digital Recovery</span>' +
          '<h2 style="color:var(--bone);margin:.75rem 0 1rem;font-size:clamp(1.4rem,2.6vw,2rem)">Hacked, scammed or extorted? The first 72 hours decide the outcome.</h2>' +
          '<p class="light-text measure">Evidence preservation, exchange freezes, and evidence-grade packages to the federal agencies that can act. Emergency intake answered within one hour.</p>' +
          '<div class="hero__cta mt5">' +
            '<a class="btn btn--brass" href="/cyber-law-center">Open the Cyber Law Center</a>' +
            '<a class="btn btn--ghostlight" href="' + tel(s.phoneEmergency) + '">Emergency line</a>' +
          '</div>' +
        '</div>' +
        '<div class="notice notice--dark rv rv-d2">' +
          '<strong style="color:var(--bone)">First 60 minutes</strong>' +
          '<ol class="stack-sm mt4 small" style="color:var(--ink-200)">' +
            R.content.cyber.emergencySteps.slice(0, 3).map((x, i) =>
              '<li style="display:flex;gap:.7rem;align-items:flex-start">' +
              '<span class="mono" style="color:var(--brass-400);flex-shrink:0">0' + (i + 1) + '</span>' +
              '<span>' + esc(x.split('.')[0]) + '.</span></li>').join('') +
          '</ol>' +
          '<a class="link-arrow link-arrow--light mt4" style="display:inline-flex" href="/cyber-law-center">Full checklist</a>' +
        '</div>' +
      '</div></div>' +
    '</section>' +

    /* process */
    '<section class="section">' +
      '<div class="wrap">' +
        S.secHead({ eyebrow: 'How it works', title: 'Four steps, and you know the cost before the third.',
          text: 'No work begins and no fee is earned until you hold a signed agreement that says what is covered.' }) +
        S.steps(R.content.process) +
      '</div>' +
    '</section>' +

    /* meet the attorneys — one unmistakable button, no grid on the home page */
    '<section class="section section--dark section--tight">' +
      '<div class="wrap"><div class="meetband rv">' +
        '<div class="meetband__copy">' +
          '<span class="eyebrow eyebrow--light">The attorneys</span>' +
          '<h2 class="meetband__h">Meet the attorney who would handle your matter.</h2>' +
          '<p class="light-text meetband__p">Every attorney has a page: what they handle, where they are admitted, ' +
            'how many years they have practised, and a direct booking form. Read the person before you ' +
            'trust them with the case.</p>' +
        '</div>' +
        '<div class="meetband__act">' +
          '<a class="btn btn--brass btn--lg meetband__btn" href="/attorneys">Meet the attorneys' +
            '<span class="meetband__arrow" aria-hidden="true">&rarr;</span></a>' +
          '<span class="meetband__note">' + R.attorneys().length +
            ' attorneys of record &middot; direct numbers, no call centre</span>' +
        '</div>' +
      '</div></div>' +
    '</section>' +

    /* testimonial rotator */
    '<section class="section">' +
      '<div class="wrap" style="max-width:820px">' +
        '<div class="center rv">' +
          '<span class="eyebrow">Client outcomes</span>' +
          '<h2 style="margin:.75rem 0 var(--s6)">What clients said afterward.</h2>' +
        '</div>' +
        S.rotator(R.testimonials().slice(0, 5)) +
        '<p class="tiny muted center mt5">Prior results do not guarantee a similar outcome. ' +
        '<a class="link-arrow" style="display:inline-flex" href="/outcomes">Read every client outcome</a></p>' +
      '</div>' +
    '</section>' +

    S.ctaBand(s);

  return {
    title: 'Oakstone Legal Group | Nationwide Legal Representation in 26 Practice Areas',
    description: 'Nationwide law firm handling family, cyber and digital recovery, personal injury, criminal defense, business, immigration and ' + (R.allAreas().length - 6) + ' further practice areas. Counsel of record in ' + R.states.filter(x => x.admitted).length + ' states. 24 hour emergency intake.',
    canonical: '/home',
    body,
    schema: orgSchema(s)
  };
}

module.exports = { intro, mainHome, orgSchema, ORIGIN };
