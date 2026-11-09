'use strict';
/**
 * Oakstone — document shell: <head>, header + mega menu, drawer, footer.
 * Kept separate from page bodies so every page shares one chrome.
 */
const R = require('./render.js');
const channels = require('./channels.js');
const esc = R.esc, safeUrl = R.safeUrl, tel = R.tel, wa = R.wa, icon = R.icon;

const SITE_ORIGIN = 'https://oakstonelegal.com';

/* Cache-busting stamp for /assets, recomputed on every request so an edit to
   a stylesheet shows up immediately instead of hiding behind a stale ?v=.
   Cheap: five stat() calls per page. */
function assetVersion() {
  try {
    const fs = require('fs'), path = require('path'), crypto = require('crypto');
    const base = path.join(__dirname, '..', 'public', 'assets');
    const h = crypto.createHash('sha1');
    ['css/base.css', 'css/components.css', 'css/ui.css', 'css/admin.css', 'js/app.js'].forEach(f => {
      try { h.update(f + ':' + fs.statSync(path.join(base, f)).mtimeMs); } catch (e) { /* not built yet */ }
    });
    return h.digest('hex').slice(0, 8);
  } catch (e) { return '1'; }
}

function brand(size) {
  return '<a class="brand" href="/home" aria-label="Oakstone Legal Group home">' +
    '<svg class="brand__mark" viewBox="0 0 30 34" width="30" height="34" aria-hidden="true">' +
      '<path fill="currentColor" d="M15 1.5c1.6 3.4 6.4 6.4 6.4 11.6 0 3.6-2.3 6.4-5.2 7.6h-2.4c-2.9-1.2-5.2-4-5.2-7.6C8.6 7.9 13.4 4.9 15 1.5z"/>' +
      '<path fill="currentColor" d="M6.2 25.4h17.6L20.9 33H9.1z"/>' +
      '<path fill="none" stroke="#f8fafc" stroke-width="1.1" d="M15 6.5v14"/>' +
    '</svg>' +
    '<span class="brand__text"><span class="brand__name">Oakstone</span>' +
    '<span class="brand__sub">Legal Group</span></span></a>';
}

function socialIcon(kind) {
  const p = {
    tiktok: '<path d="M15 3v9.5a3.5 3.5 0 11-3-3.46"/><path d="M15 5.5a5 5 0 004.5 4.5"/>',
    telegram: '<path d="M21 4L3 11.2l6.3 2.2L11.6 20l3.2-3.9 5.1 3.7z"/><path d="M9.3 13.4L21 4"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/>',
    linkedin: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 10v7M7 7v.01M11 17v-4a2 2 0 014 0v4"/>',
    facebook: '<path d="M14 9V7a2 2 0 012-2h2V2h-3a4 4 0 00-4 4v3H9v3h2v8h3v-8h2.5l.5-3z"/>',
    youtube: '<rect x="2" y="5" width="20" height="14" rx="4"/><path d="M10 9.5l5 2.5-5 2.5z" fill="currentColor" stroke="none"/>',
    x: '<path d="M4 4l16 16M20 4L4 20"/>'
  }[kind] || '';
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
}

const SOCIAL_LABELS = channels.SOCIAL_LABELS;

function megaMenu(s) {
  const grps = R.groups();
  const rail = grps.map((g, i) =>
    '<button class="mega__railbtn' + (i === 0 ? ' is-active' : '') + '" data-group="' + esc(g.label) + '" type="button">' +
    '<span>' + esc(g.label) + '</span><span>' + g.items.length + '</span></button>').join('');
  const panels = grps.map((g, i) =>
    '<div class="mega__panel' + (i === 0 ? ' is-active' : '') + '" data-panel="' + esc(g.label) + '">' +
      '<div class="mega__head"><h3>' + esc(g.label) + '</h3><p>' +
        esc((g.items[0] && g.items[0].summary ? g.items[0].summary.split('. ')[0] + '.' : 'Practice areas within this group.')) +
      '</p></div>' +
      '<div class="mega__list">' +
        g.items.map((a, idx) => '<a class="mega__link" style="--i:' + (idx % 12) + '" href="/practice-areas/' + esc(a.id) + '">' + esc(a.name) + '</a>').join('') +
      '</div>' +
    '</div>').join('');
  return '<div class="mega" id="mega" role="region" aria-label="Practice areas">' +
    '<div class="wrap"><div class="mega__inner">' +
      '<div class="mega__rail">' + rail + '</div>' +
      '<div class="mega__panels">' + panels +
        '<div class="mega__foot"><span class="small muted">' + R.allAreas().reduce((n, a) => n + a.services.length, 0) +
        ' services across ' + R.allAreas().length + ' practice areas.</span>' +
        '<a class="link-arrow" href="/practice-areas">View all practice areas</a></div>' +
      '</div>' +
    '</div></div></div>';
}

function header(s) {
  return '<header class="header">' +
    '<div class="wrap header__bar">' +
      brand() +
      '<nav class="nav" aria-label="Primary">' +
        '<div class="nav__item"><a href="#" class="nav__link" data-mega="all">Practice Areas' +
          '<svg class="nav__chev" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M1 3l4 4 4-4"/></svg></a></div>' +
        '<div class="nav__item"><a href="/cyber-law-center" class="nav__link">Cyber Law Center</a></div>' +
        '<div class="nav__item has-drop"><a href="/attorneys" class="nav__link">Attorneys' +
          '<svg class="nav__chev" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M1 3l4 4 4-4"/></svg></a>' +
          '<div class="drop"><div class="drop__head">Attorneys</div>' +
            '<a href="/attorneys">All attorneys</a>' +
            '<a href="/book">Book a consultation</a>' +
          '</div></div>' +
        '<div class="nav__item has-drop"><a href="/coverage" class="nav__link">Coverage' +
          '<svg class="nav__chev" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M1 3l4 4 4-4"/></svg></a>' +
          '<div class="drop"><div class="drop__head">Nationwide coverage</div>' +
            '<a href="/coverage">All 51 jurisdictions</a>' +
            '<a href="/coverage">Counsel of record by state</a>' +
          '</div></div>' +
        '<div class="nav__item has-drop"><a href="/pricing" class="nav__link">Fees' +
          '<svg class="nav__chev" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M1 3l4 4 4-4"/></svg></a>' +
          '<div class="drop"><div class="drop__head">Fees and pricing</div>' +
            '<a href="/pricing#estimator">Fee estimator</a>' +
            '<a href="/pricing">Flat-fee services</a>' +
            '<a href="/pricing">Contingency representation</a>' +
          '</div></div>' +
        '<div class="nav__item"><a href="/contact" class="nav__link">Contact</a></div>' +
      '</nav>' +
      '<div class="header__actions">' +
        '<a class="header__phone" href="' + tel(s.phone) + '">Call 24/7<strong>' + esc(s.phone) + '</strong></a>' +
        '<a class="btn btn--call btn--sm" href="' + tel(s.phone) + '">Call now</a>' +
        '<a class="btn btn--primary btn--sm" href="/book">Book consultation</a>' +
        '<button class="burger" type="button" data-drawer-open aria-label="Open menu"><span></span></button>' +
      '</div>' +
    '</div>' +
    megaMenu(s) +
  '</header>';
}

function drawer(s) {
  const grps = R.groups();
  const items = grps.map(g =>
    '<div class="drawer__group"><button class="drawer__toggle" type="button">' + esc(g.label) +
      '<i aria-hidden="true">+</i></button>' +
      '<div class="drawer__sub"><ul>' +
      g.items.map(a => '<li><a href="/practice-areas/' + esc(a.id) + '">' + esc(a.name) + '</a></li>').join('') +
      '</ul></div></div>').join('');
  const telegram = channels.tg(s.telegram);
  return '<div class="drawer" id="drawer" aria-hidden="true">' +
    '<div class="drawer__top">' + brand() +
      '<button class="drawer__close" type="button" data-drawer-close aria-label="Close menu">&times;</button></div>' +
    '<div class="drawer__body">' +
      '<a class="drawer__direct" href="/attorneys">Attorneys</a>' +
      '<a class="drawer__direct" href="/coverage">Nationwide coverage</a>' +
      '<a class="drawer__direct" href="/pricing">Fees and pricing</a>' +
      '<a class="drawer__direct" href="/cyber-law-center">Cyber Law Center</a>' +
      items +
      '<div class="stack-sm mt6">' +
        '<a class="btn btn--primary btn--block" href="/book">Book a consultation</a>' +
        '<a class="btn btn--ghost btn--block" href="' + tel(s.phone) + '">Call ' + esc(s.phone) + '</a>' +
        (s.whatsapp ? '<a class="btn btn--ghost btn--block" href="' + safeUrl(wa(s.whatsapp)) + '" target="_blank" rel="noopener">WhatsApp</a>' : '') +
        (telegram ? '<a class="btn btn--ghost btn--block" href="' + safeUrl(telegram) + '" target="_blank" rel="noopener">Telegram</a>' : '') +
      '</div>' +
    '</div></div>';
}

function footer(s) {
  const grps = R.groups().slice(0, 3);
  const links = channels.socialLinks(s);
  const socials = links.map(l =>
    '<a class="social" href="' + safeUrl(l.href) + '" target="_blank" rel="noopener" aria-label="' +
    esc(l.label) + '">' + socialIcon(l.key) + '</a>').join('');
  const telegram = channels.tg(s.telegram);
  const addressLine = s.address
    ? '<span class="small">' + esc(s.address) + ', ' + esc(s.city) + ', ' + esc(s.stateCode) + ' ' + esc(s.zip) + '</span>'
    : '';

  return '<footer class="foot">' +
    '<div class="wrap">' +
      '<div class="foot__top">' +
        '<div class="foot__brand">' + brand() +
          '<p>' + esc(R.content.faqs[1].a.split('. ')[0]) + '. Counsel of record in ' +
          R.states.filter(x => x.admitted).length + ' states, with local co-counsel elsewhere.</p>' +
          '<div class="foot__contact">' +
            '<a href="' + tel(s.phone) + '">' + esc(s.phone) + ' &middot; 24 hour intake</a>' +
            '<a href="mailto:' + esc(s.email) + '">' + esc(s.email) + '</a>' +
            (s.whatsapp ? '<a href="' + safeUrl(wa(s.whatsapp)) + '" target="_blank" rel="noopener">WhatsApp us</a>' : '') +
            (telegram ? '<a href="' + safeUrl(telegram) + '" target="_blank" rel="noopener">Telegram</a>' : '') +
            addressLine +
          '</div>' +
          (socials ? '<div class="socials mt5">' + socials + '</div>' : '') +
        '</div>' +
        grps.map(g => '<div><h5>' + esc(g.label) + '</h5><ul>' +
          g.items.map(a => '<li><a href="/practice-areas/' + esc(a.id) + '">' + esc(a.name) + '</a></li>').join('') +
          '</ul></div>').join('') +
        '<div><h5>Firm</h5><ul>' +
          '<li><a href="/attorneys">Attorneys</a></li>' +
          '<li><a href="/coverage">State coverage</a></li>' +
          '<li><a href="/pricing">Fees</a></li>' +
          '<li><a href="/outcomes">Client outcomes</a></li>' +
          '<li><a href="/cyber-law-center">Cyber Law Center</a></li>' +
          '<li><a href="/book">Book a consultation</a></li>' +
          '<li><a href="/contact">Contact</a></li>' +
          '<li><a href="/disclaimer">Legal notices</a></li>' +
          '<li><a href="/privacy">Privacy</a></li>' +
        '</ul></div>' +
      '</div>' +
      '<div class="foot__mid">' +
        '<div class="foot__legal">' +
          '<p><strong>Attorney advertising.</strong> Prior results do not guarantee a similar outcome. ' +
          'The information on this site is general and is not legal advice. Reading it or submitting a form ' +
          'does not create an attorney-client relationship; that relationship is formed only by a signed ' +
          'engagement agreement.</p>' +
          '<p>Oakstone Legal Group is not licensed in every state. Where the firm is not admitted, matters are ' +
          'handled with admitted local counsel consistent with the rules of the jurisdiction. ' +
          'Statements of fees are illustrative and are not a quote. ' +
          'This site complies with the advertising rules of the jurisdictions in which the firm practices; ' +
          'some states impose additional requirements on legal advertising.</p>' +
        '</div>' +
        '<a class="btn btn--ghostlight btn--sm" href="/disclaimer">Full legal notices</a>' +
      '</div>' +
      '<div class="foot__bottom">' +
        '<span>&copy; <span data-year>2026</span> Oakstone Legal Group. All rights reserved.</span>' +
        '<span class="row" style="gap:1rem"><a href="/privacy">Privacy</a><a href="/disclaimer">Disclaimer</a>' +
        '<a href="/sitemap.xml">Sitemap</a></span>' +
      '</div>' +
    '</div>' +
  '</footer>';
}

/* The floating "Call / Book review" bar that used to sit fixed above the
   bottom of every mobile page is gone: it covered content and repeated what
   the header and each page already offer. */

/* ---------- layout ---------- */
function layout(opts) {
  /* Every page is drawn from the public view of the settings, so a channel the
     admin has switched off can never leak into the header, footer or drawer. */
  const s = channels.publicView(opts.settings);
  const bare = opts.bare === true;
  const title = opts.title || 'Oakstone Legal Group';
  /* Names 5 areas (family, cyber, injury, criminal, business), so the remainder is the area count minus five. */
  const desc = opts.description || 'Nationwide legal representation in family, cyber, injury, criminal, business and ' +
    (R.allAreas().length - 5) + ' further practice areas. Counsel of record in ' +
    R.states.filter(x => x.admitted).length + ' states.';
  const canonical = opts.canonical ? SITE_ORIGIN + opts.canonical : SITE_ORIGIN;
  const ogImage = SITE_ORIGIN + '/assets/img/og-default.svg';
  const robots = opts.noindex ? 'noindex, nofollow' : 'index, follow';
  const bodyClass = opts.bodyClass || '';

  return '<!DOCTYPE html>' +
  '<html lang="en">' +
  '<head>' +
    '<meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<title>' + esc(title) + '</title>' +
    '<meta name="description" content="' + esc(desc) + '">' +
    '<meta name="robots" content="' + robots + '">' +
    '<link rel="canonical" href="' + esc(canonical) + '">' +
    '<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">' +
    '<link rel="apple-touch-icon" href="/assets/img/favicon.svg">' +
    '<meta property="og:type" content="website">' +
    '<meta property="og:site_name" content="Oakstone Legal Group">' +
    '<meta property="og:title" content="' + esc(title) + '">' +
    '<meta property="og:description" content="' + esc(desc) + '">' +
    '<meta property="og:url" content="' + esc(canonical) + '">' +
    '<meta property="og:image" content="' + esc(ogImage) + '">' +
    '<meta name="twitter:card" content="summary_large_image">' +
    '<meta name="theme-color" content="#14181f">' +
    '<meta name="format-detection" content="telephone=yes">' +
    '<link rel="preload" href="/assets/css/base.css" as="style">' +
    '<link rel="stylesheet" href="/assets/css/base.css?v=' + assetVersion() + '">' +
    '<link rel="stylesheet" href="/assets/css/components.css?v=' + assetVersion() + '">' +
    '<link rel="stylesheet" href="/assets/css/ui.css?v=' + assetVersion() + '">' +
    (bodyClass === 'admin' ? '<link rel="stylesheet" href="/assets/css/admin.css?v=' + assetVersion() + '">' : '') +
    (opts.head || '') +
    (s.gaId ? '<script async src="https://www.googletagmanager.com/gtag/js?id=' + esc(s.gaId) + '"></script>' +
      '<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","' + esc(s.gaId) + '");</script>' : '') +
    (opts.schema ? '<script type="application/ld+json">' + JSON.stringify(opts.schema).replace(/</g, '\\u003c') + '</script>' : '') +
  '</head>' +
  '<body class="' + esc(bodyClass) + '">' +
    '<a class="sr" href="#main">Skip to content</a>' +
    '<div class="progress" id="progress" aria-hidden="true"></div>' +
    (bare ? '' :
    (s.announcementOn && s.announcement
      ? '<div class="section--ink" style="padding:.6rem 0;text-align:center"><div class="wrap small">' + esc(s.announcement) + '</div></div>'
      : '')) +
    (bare ? '' : header(s) + drawer(s)) +
    '<main id="main">' + (opts.body || '') + '</main>' +
    (bare ? '' : footer(s) +
    '<button class="totop" id="totop" type="button" aria-label="Back to top">' +
      '<svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 13V3M3.5 7.5L8 3l4.5 4.5"/></svg>' +
    '</button>') +
    (bare || opts.noInline ? '' : require('./inline.js').modal(s)) +
    '<script src="/assets/js/app.js?v=' + assetVersion() + '" defer></script>' +
  '</body></html>';
}

module.exports = { layout, header, footer, brand, icon, socialIcon, SOCIAL_LABELS, SITE_ORIGIN };
