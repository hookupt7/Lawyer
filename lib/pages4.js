'use strict';
/** Oakstone — cyber center, contact, FAQ, legal notices, privacy, 404. */
const R = require('./render.js');
const L = require('./layout.js');
const S = require('./sections.js');
const esc = R.esc, tel = R.tel, icon = R.icon, safeUrl = R.safeUrl, wa = R.wa;

/* ===================== CYBER LAW CENTER ===================== */
function cyberCenter(s) {
  const cyber = R.byId('cyber');
  const body =
    '<section class="hero">' +
      '<div class="hero__grid"></div>' +
      '<div class="wrap"><div class="hero__inner" style="grid-template-columns:1.15fr .85fr">' +
        '<div>' +
          '<div class="hero__eyebrow">' +
            '<span class="eyebrow eyebrow--light" style="margin:0">Emergency intake answered within one hour, around the clock</span></div>' +
          '<h1>Hacked. Scammed.<br>Extorted. Start here.</h1>' +
          '<p class="hero__lede">The first seventy-two hours decide whether stolen funds and compromised accounts ' +
            'are recoverable. This division preserves evidence, freezes what can still be frozen, and files ' +
            'evidence-grade packages with the federal agencies that can act.</p>' +
          '<div class="hero__cta">' +
            '<a class="btn btn--brass btn--lg" href="' + tel(s.phoneEmergency) + '">Call the emergency line</a>' +
            '<a class="btn btn--ghostlight btn--lg" href="/book?area=cyber">Book a priority review</a>' +
          '</div>' +
          '<p class="tiny mt5" style="color:var(--ink-400)">No firm can guarantee recovery of stolen funds. ' +
            'Anyone who promises a fixed percentage back before tracing is done is not telling you the truth.</p>' +
        '</div>' +
        '<div class="intake rv rv-d2">' +
          '<div class="intake__title">Emergency cyber intake</div>' +
          '<div class="intake__sub">Answered within one hour, day or night.</div>' +
          '<form method="post" action="/api/cyber-emergency" novalidate>' +
            '<div class="intake__row"><label>What happened</label>' +
              '<div class="choices">' +
                [['hacked', 'Account taken over'], ['crypto', 'Crypto or wire scam'],
                 ['ransom', 'Ransomware or extortion'], ['bec', 'Business email compromise'],
                 ['sextort', 'Sextortion or blackmail'], ['identity', 'Identity theft']].map((c, i) =>
                  '<button type="button" class="choice' + (i === 0 ? ' is-selected' : '') + '" data-field="incident" data-group="inc" data-value="' + c[0] + '">' +
                    '<span class="choice__mark"></span><span class="choice__label">' + c[1] + '</span></button>').join('') +
              '</div></div>' +
            '<input type="hidden" name="incident" value="hacked">' +
            '<div class="intake__row"><label for="c-phone">Callback number</label>' +
              '<input class="field" id="c-phone" name="phone" type="tel" required placeholder="(555) 000-0000"></div>' +
            '<div class="intake__row"><label for="c-email">Email</label>' +
              '<input class="field" id="c-email" name="email" type="email" required placeholder="you@example.com"></div>' +
            '<div class="intake__row"><label for="c-when">When did it start</label>' +
              '<select class="field" id="c-when" name="when">' +
                '<option>Within the last 24 hours</option><option>Within the last week</option>' +
                '<option>Within the last month</option><option>More than a month ago</option></select></div>' +
            '<div class="intake__row"><label for="c-amount">Funds at stake, if any</label>' +
              '<select class="field" id="c-amount" name="amount">' +
                '<option>None</option><option>Under $1,000</option><option>$1,000 to $10,000</option>' +
                '<option>$10,000 to $100,000</option><option>Over $100,000</option></select></div>' +
            '<button class="btn btn--brass btn--block btn--lg" type="submit">Request emergency callback</button>' +
            '<p class="tiny mt4" style="color:var(--ink-400)">Do not send passwords, private keys or seed phrases ' +
              'through this form. We will never ask for them.</p>' +
          '</form>' +
        '</div>' +
      '</div></div>' +
    '</section>' +

    /* first 60 minutes */
    '<section class="section"><div class="wrap">' +
      S.secHead({ eyebrow: 'If it just happened', title: 'The first sixty minutes.',
        text: 'What you do before you call us changes what we can do for you. Work down this list in order.' }) +
      '<div class="grid g2" style="gap:var(--s4)">' +
        R.content.cyber.emergencySteps.map((x, i) =>
          '<div class="card card--accent rv rv-d' + ((i % 3) + 1) + '">' +
            '<span class="mono ox" style="font-weight:700">0' + (i + 1) + '</span>' +
            '<h4 class="mt3">' + x.split('.')[0] + '.</h4>' +
            '<p class="small muted mt2" style="line-height:1.6">' + esc(x.split('. ').slice(1).join('. ')) + '</p>' +
          '</div>').join('') +
      '</div>' +
    '</div></section>' +

    /* services */
    '<section class="section section--bone section--rule"><div class="wrap">' +
      S.secHead({ eyebrow: 'What this division handles', title: 'Twelve services, one emergency number.' }) +
      S.serviceRows(cyber.services) +
    '</div></section>' +

    /* liaison */
    '<section class="section section--dark"><div class="wrap">' +
      S.secHead({ dark: true, eyebrow: 'Law enforcement liaison', title: 'We file it the way the agencies actually read it.',
        text: 'A complaint that reaches an agent is structured, verified and complete. We prepare the package and follow up on the assigned number.' }) +
      '<div class="grid g2" style="gap:var(--s5)">' +
        R.content.cyber.liaison.map((x, i) =>
          '<div class="card card--dark rv rv-d' + ((i % 2) + 1) + '">' +
            '<span class="tag tag--dark">' + esc(x.agency.split('(')[0].trim()) + '</span>' +
            '<p class="small light-text mt4" style="line-height:1.7">' + esc(x.role) + '</p>' +
          '</div>').join('') +
      '</div>' +
      '<div class="notice notice--dark mt6">We cannot direct a federal investigation and no attorney can promise ' +
        'that charges will be filed. What we control is the quality of the evidence package and the follow-up.</div>' +
    '</div></section>' +

    /* honest recovery facts */
    '<section class="section"><div class="wrap">' +
      S.secHead({ eyebrow: 'What is true about recovery', title: 'Four facts before you hire anyone.' }) +
      '<div class="grid g2" style="gap:var(--s4)">' +
        R.content.cyber.recoveryFacts.map((x, i) =>
          '<div class="card rv rv-d' + ((i % 2) + 1) + '"><p class="small" style="line-height:1.7;color:var(--ink-600)">' + esc(x) + '</p></div>').join('') +
      '</div>' +
      '<div class="notice notice--alert mt6"><strong>Warning:</strong> "recovery agents" who contact you after a ' +
        'scam and ask for an upfront fee are usually a second scam. We take recovery matters on contingency where ' +
        'the facts support it, which means we are paid from what we recover, not from what you pay ahead.</div>' +
    '</div></section>' +

    S.ctaBand(s, { eyebrow: 'Emergency', title: 'Funds still moving? Call now.',
      text: 'The emergency line is answered around the clock. If it can wait until morning, book a priority review and we will respond within one hour of opening.' });
  return {
    title: 'Cyber Law Center | Hacked, Scammed or Extorted | Oakstone Legal Group',
    description: 'Emergency legal response for hacking, cryptocurrency scams, ransomware, business email compromise and extortion. Evidence preservation, exchange freezes and federal agency liaison. Intake answered within one hour.',
    canonical: '/cyber-law-center', body,
    schema: { '@context': 'https://schema.org', '@type': 'LegalService', name: 'Oakstone Cyber Law Center',
      telephone: s.phoneEmergency, areaServed: { '@type': 'Country', name: 'United States' } }
  };
}

/* ===================== CONTACT ===================== */
function contact(s) {
  const body =
    '<header class="pagehead"><div class="wrap">' +
      S.crumbs([{ label: 'Home', href: '/' }, { label: 'Contact' }]) +
      '<h1>Contact the firm.</h1>' +
      '<p class="lede mt4 measure">Every channel reaches a person. Business-hours messages are answered within four ' +
        'hours; the emergency cyber line is answered around the clock.</p>' +
    '</div></header>' +
    '<section class="section"><div class="wrap"><div class="split">' +
      '<div>' +
        '<form method="post" action="/api/contact" novalidate class="card" style="padding:var(--s6)">' +
          '<h3 class="mb5">Send a message</h3>' +
          '<div class="form-grid">' +
            '<div class="form-row"><label for="ct-name">Full name</label>' +
              '<input class="field" id="ct-name" name="name" data-required autocomplete="name"></div>' +
            '<div class="form-row"><label for="ct-phone">Phone</label>' +
              '<input class="field" id="ct-phone" name="phone" type="tel" data-required autocomplete="tel"></div>' +
            '<div class="form-row full"><label for="ct-email">Email</label>' +
              '<input class="field" id="ct-email" name="email" type="email" data-required autocomplete="email"></div>' +
            '<div class="form-row full"><label for="ct-area">Practice area</label>' +
              '<select class="field" id="ct-area" name="practiceArea"><option value="">Select one</option>' +
              R.areas.map(a => '<option value="' + esc(a.id) + '">' + esc(a.name) + '</option>').join('') + '</select></div>' +
            '<div class="form-row full"><label for="ct-msg">Message</label>' +
              '<textarea class="field" id="ct-msg" name="details" rows="5" data-required></textarea></div>' +
          '</div>' +
          '<button class="btn btn--primary btn--lg btn--block mt4" type="submit">Send message</button>' +
          '<p class="tiny muted mt4">Submitting does not create an attorney-client relationship. ' +
            'Do not send confidential documents through this form; save those for the consultation.</p>' +
        '</form>' +
      '</div>' +
      '<aside class="stack">' +
        '<div class="card card--accent">' +
          '<h4 class="mb4">Direct lines</h4>' +
          '<div class="stack-sm">' +
            '<a class="btn btn--primary btn--block" href="' + tel(s.phone) + '">' + esc(s.phone) + '</a>' +
            '<a class="btn btn--ghost btn--block" href="' + tel(s.phoneEmergency) + '">Emergency: ' + esc(s.phoneEmergency) + '</a>' +
            '<a class="btn btn--ghost btn--block" href="' + safeUrl(wa(s.whatsapp)) + '" target="_blank" rel="noopener">WhatsApp</a>' +
            '<a class="btn btn--ghost btn--block" href="mailto:' + esc(s.email) + '">' + esc(s.email) + '</a>' +
          '</div>' +
          '<p class="tiny muted mt4">' + esc(s.hours) + '</p>' +
        '</div>' +
        '<div class="card">' +
          '<h4 class="mb3">Office</h4>' +
          '<p class="small muted">' + esc(s.address) + '<br>' + esc(s.city) + ', ' + esc(s.stateCode) + ' ' + esc(s.zip) + '</p>' +
          '<p class="tiny muted mt3">Meetings by appointment. We appear in every state through counsel of record or admitted local counsel.</p>' +
        '</div>' +
        '<div class="card card--flat">' +
          '<h4 class="mb3">Follow the firm</h4>' +
          '<div class="row" style="gap:.45rem">' +
            L.SOCIAL_LABELS && Object.keys(L.SOCIAL_LABELS).filter(k => s[k]).map(k =>
              '<a class="tag" href="' + safeUrl(s[k]) + '" target="_blank" rel="noopener">' + esc(L.SOCIAL_LABELS[k]) + '</a>').join('') +
          '</div>' +
        '</div>' +
      '</aside>' +
    '</div></div></section>';
  return { title: 'Contact | Oakstone Legal Group', description: 'Contact Oakstone Legal Group. Phone, WhatsApp, email and a confidential message form. Emergency cyber intake answered around the clock.',
    canonical: '/contact', body };
}

/* ===================== FAQ ===================== */
function faq(s) {
  const body =
    '<header class="pagehead"><div class="wrap">' +
      S.crumbs([{ label: 'Home', href: '/' }, { label: 'Questions' }]) +
      '<h1>Questions clients actually ask.</h1>' +
      '<p class="lede mt4 measure">Answered the way we would answer them on the phone, including the parts that ' +
        'are not flattering to us.</p>' +
    '</div></header>' +
    '<section class="section"><div class="wrap" style="max-width:860px">' +
      S.accordion(R.content.faqs) +
      '<div class="notice mt6">These answers are general information about how the firm operates, not legal advice ' +
        'about your matter. Deadlines and outcomes depend on facts we have not seen.</div>' +
    '</div></section>' +
    S.ctaBand(s, { title: 'A question we did not cover?' });
  return { title: 'Frequently Asked Questions | Oakstone Legal Group',
    description: 'How fees work, how nationwide coverage works, what the free case review covers, and other questions clients ask before retaining the firm.',
    canonical: '/faq', body };
}

/* ===================== DISCLAIMER ===================== */
function disclaimer(s) {
  const body =
    '<header class="pagehead"><div class="wrap">' +
      S.crumbs([{ label: 'Home', href: '/' }, { label: 'Legal notices' }]) +
      '<h1>Legal notices and disclaimers.</h1>' +
    '</div></header>' +
    '<section class="section"><div class="wrap" style="max-width:820px">' +
      '<div class="stack-lg">' +
        '<div><h2>Attorney advertising</h2><p class="muted mt3">This website is attorney advertising. It is ' +
          'intended for residents of the United States seeking legal representation. The rules of some states ' +
          'require specific language or filings for attorney advertising; this site is intended to comply with the ' +
          'rules of every jurisdiction in which it is published, and where a state requires additional notices they ' +
          'are available on request.</p></div>' +
        '<div><h2>No legal advice</h2><p class="muted mt3">Nothing on this site is legal advice, and no content ' +
          'here should be relied on to make a legal decision. Statutes, procedures and outcomes vary by ' +
          'jurisdiction and change over time. Reading this site, submitting a form, or booking a consultation does ' +
          'not make you a client of the firm.</p></div>' +
        '<div><h2>No attorney-client relationship</h2><p class="muted mt3">An attorney-client relationship with ' +
          'Oakstone Legal Group is formed only when both you and the firm have signed a written engagement ' +
          'agreement. Until then, do not send us information you wish to keep privileged, and understand that we ' +
          'may already represent an adverse party. We check for conflicts before accepting any matter.</p></div>' +
        '<div><h2>Prior results</h2><p class="muted mt3">Any case result, recovery figure or testimonial on this ' +
          'site is illustrative of the kind of matter the firm handles. Prior results do not guarantee or predict a ' +
          'similar outcome in any future matter. Testimonials reflect individual client experiences and are not a ' +
          'guarantee of results.</p></div>' +
        '<div><h2>Fees</h2><p class="muted mt3">All fees shown on this site are illustrative and are not a quote, ' +
          'an estimate you may rely on, or an offer to perform services at that price. Contingency percentages vary ' +
          'by state rule and by the stage of resolution. The binding fee is the one stated in your signed ' +
          'engagement agreement.</p></div>' +
        '<div><h2>Nationwide practice</h2><p class="muted mt3">The firm is not licensed in every state. Where the ' +
          'firm is not admitted, matters are handled through admitted local counsel working under the firm\u2019s ' +
          'case strategy, consistent with the rules of professional conduct of each jurisdiction. The attorneys, ' +
          'their admissions and their bar numbers are listed on each attorney profile.</p></div>' +
        '<div><h2>Cyber recovery claims</h2><p class="muted mt3">The firm does not guarantee the recovery of ' +
          'stolen funds, hacked accounts or lost cryptocurrency. Recovery depends on facts outside anyone\u2019s ' +
          'control, including how quickly the matter is reported and where the funds moved. Any representation to ' +
          'the contrary by a third party is not made by this firm.</p></div>' +
        '<div><h2>Third-party links</h2><p class="muted mt3">Links to external sites are provided for convenience ' +
          'and do not imply endorsement. The firm is not responsible for the content of third-party sites.</p></div>' +
        '<div><h2>Contact</h2><p class="muted mt3">Questions about these notices: ' + esc(s.email) + ' or ' + esc(s.phone) + '.</p></div>' +
      '</div>' +
    '</div></section>';
  return { title: 'Legal Notices and Disclaimers | Oakstone Legal Group',
    description: 'Attorney advertising notice, no-legal-advice disclaimer, attorney-client relationship terms, prior results and fee disclosures for Oakstone Legal Group.',
    canonical: '/disclaimer', body };
}

/* ===================== PRIVACY ===================== */
function privacy(s) {
  const body =
    '<header class="pagehead"><div class="wrap">' +
      S.crumbs([{ label: 'Home', href: '/' }, { label: 'Privacy' }]) +
      '<h1>Privacy policy.</h1>' +
      '<p class="lede mt4 measure">What we collect through this site, what we do with it, and what we never do.</p>' +
    '</div></header>' +
    '<section class="section"><div class="wrap" style="max-width:820px">' +
      '<div class="stack-lg">' +
        '<div><h2>What we collect</h2><p class="muted mt3">When you submit a form we collect the information you ' +
          'type: name, phone, email, the practice area selected, and the description of your matter. For ' +
          'operational security we also record the submitting IP address and browser user agent, which we use to ' +
          'detect fraudulent or automated submissions. We do not use tracking cookies beyond optional analytics.</p></div>' +
        '<div><h2>Why we collect it</h2><p class="muted mt3">To respond to your inquiry, to schedule the ' +
          'consultation you requested, to check for conflicts of interest, and to keep records required of a law ' +
          'practice. We do not sell, rent or share your information with advertisers or data brokers.</p></div>' +
        '<div><h2>Confidentiality</h2><p class="muted mt3">Information submitted before engagement is treated as ' +
          'confidential, but it is not protected by the attorney-client privilege until an engagement is formed. ' +
          'Do not send passwords, private keys, account numbers or trade secrets through any web form.</p></div>' +
        '<div><h2>Email</h2><p class="muted mt3">When you book an appointment you receive a confirmation email and ' +
          'a calendar invitation. The firm receives an internal notification with the details you submitted. Email ' +
          'is not encrypted end to end; if a matter requires secure transmission we will arrange it after engagement.</p></div>' +
        '<div><h2>Retention</h2><p class="muted mt3">Inquiry records are retained as required for law-practice ' +
          'record keeping. You may request deletion of pre-engagement inquiry data by writing to ' + esc(s.email) + ', ' +
          'subject to records we are required to keep.</p></div>' +
        '<div><h2>Security</h2><p class="muted mt3">Form submissions are transmitted over HTTPS and stored on ' +
          'servers with access limited to firm personnel. No system is perfectly secure, and we do not store ' +
          'payment details on this site.</p></div>' +
        '<div><h2>Changes</h2><p class="muted mt3">Material changes to this policy will be posted on this page with ' +
          'an updated date. Questions: ' + esc(s.email) + '.</p></div>' +
      '</div>' +
    '</div></section>';
  return { title: 'Privacy Policy | Oakstone Legal Group',
    description: 'What Oakstone Legal Group collects through this website, how it is used, retention and confidentiality.',
    canonical: '/privacy', body };
}

/* ===================== OUTCOMES (testimonials) ===================== */
function outcomes(s) {
  const body =
    '<header class="pagehead"><div class="wrap">' +
      S.crumbs([{ label: 'Home', href: '/' }, { label: 'Client outcomes' }]) +
      '<h1>Client outcomes.</h1>' +
      '<p class="lede mt4 measure">Published with initials and the jurisdiction, because that is what a ' +
        'testimonial is worth. Prior results do not guarantee a similar outcome in any future matter.</p>' +
    '</div></header>' +
    '<section class="section"><div class="wrap">' +
      S.quotes(R.content.testimonials) +
      '<div class="notice mt6">Testimonials reflect individual client experiences and are not a guarantee of ' +
        'results. Every matter turns on its own facts, the forum, and the conduct of the opposing party.</div>' +
    '</div></section>' +
    S.ctaBand(s, { title: 'Your matter could be next.' });
  return {
    title: 'Client Outcomes and Testimonials | Oakstone Legal Group',
    description: 'What clients said after their matters closed: cyber recovery, custody, nursing home neglect, tax, appeals and more. Published with initials and jurisdiction.',
    canonical: '/outcomes', body
  };
}

/* ===================== 404 ===================== */
function notFound(s) {
  const body =
    '<section class="section" style="min-height:60vh;display:grid;place-items:center">' +
      '<div class="wrap center" style="max-width:640px">' +
        '<span class="eyebrow">404</span>' +
        '<h1 class="mt3">That page is not here.</h1>' +
        '<p class="lede mt4" style="margin-left:auto;margin-right:auto">The link may be old, or the matter may have ' +
          'been renamed. The practice area index below covers everything the firm handles.</p>' +
        '<div class="row mt6" style="justify-content:center">' +
          '<a class="btn btn--primary" href="/practice-areas">All practice areas</a>' +
          '<a class="btn btn--ghost" href="/home">Home</a>' +
        '</div>' +
        '<div class="row mt7" style="justify-content:center;gap:.45rem">' +
          R.areas.slice(0, 10).map(a => '<a class="tag" href="/practice-areas/' + esc(a.id) + '">' + esc(a.name) + '</a>').join('') +
        '</div>' +
      '</div>' +
    '</section>';
  return { title: 'Page not found | Oakstone Legal Group', description: 'The page you requested does not exist.', body, noindex: true };
}

/* ===================== THANK YOU (contact) ===================== */
function thanks(s) {
  const body =
    '<section class="section"><div class="wrap" style="max-width:640px">' +
      '<div class="center"><span class="tag tag--brass">Received</span></div>' +
      '<h1 class="center mt4">Your message is with an attorney.</h1>' +
      '<p class="lede center mt4" style="margin-left:auto;margin-right:auto">You will receive a confirmation email ' +
        'shortly, and a substantive response within four hours during business hours. If this is urgent, call ' + esc(s.phone) + '.</p>' +
      '<div class="center mt6"><a class="btn btn--primary" href="/home">Back to home</a></div>' +
    '</div></section>';
  return { title: 'Message received | Oakstone Legal Group', description: 'Your message was received.', body, noindex: true };
}

module.exports = { cyberCenter, contact, faq, disclaimer, privacy, notFound, thanks, outcomes };
