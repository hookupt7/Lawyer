'use strict';
/**
 * Oakstone — HTML renderer.
 * Template literals only. No templating engine, no build step.
 * Every page passes through layout(), which emits the document shell.
 */
const areas = require('../data/practice-areas.js').concat(require('../data/practice-areas-2.js'));
const states = require('../data/states.js');
const content = require('../data/content.js');

/* ---------------- helpers ---------------- */

function esc(s) {
  return String(s === undefined || s === null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/** Only allow safe hrefs; blocks javascript: and data: URLs from settings. */
function safeUrl(u) {
  const s = String(u || '').trim();
  if (!s) return '#';
  if (/^(javascript|data|vbscript):/i.test(s)) return '#';
  return esc(s);
}

function tel(raw) { return 'tel:+1' + String(raw || '').replace(/[^\d]/g, ''); }
function wa(raw) { return 'https://wa.me/' + String(raw || '').replace(/[^\d]/g, ''); }

function money(n) {
  if (n === undefined || n === null) return '';
  return '$' + Number(n).toLocaleString('en-US');
}

function feeLabel(fee) {
  if (!fee) return 'Quote required';
  switch (fee.type) {
    case 'flat': return money(fee.amount);
    case 'hourly': return money(fee.amount) + ' / hour';
    case 'retainer': return money(fee.amount) + ' retainer';
    case 'contingency': return fee.amount + '% contingency';
    case 'consult': return 'Free consultation';
    case 'quote': default: return 'Quote required';
  }
}

function feeTag(fee) {
  if (!fee) return 'Fee';
  const map = { flat: 'Flat fee', hourly: 'Hourly', retainer: 'Retainer', contingency: 'Contingency', consult: 'No charge', quote: 'Scoped quote' };
  return map[fee.type] || 'Fee';
}

/* Client edits made in the admin panel live in the JSON store and are merged
   over these shipped defaults here, so every page picks them up automatically.
   `store` is required lazily to avoid a require cycle at load time. */
function storeMod() { return require('./store.js'); }

/* Practice areas with any client edits applied. Used everywhere instead of the
   raw array so an edited tagline or fee shows up across the whole site. */
function allAreas() { return storeMod().applyOverride('areaOverrides', areas); }

function byId(id) {
  const a = allAreas().filter(x => x.id === id)[0] || null;
  return a || null;
}
function attorneys() {
  return storeMod().applyOverride('attorneyOverrides', require('../data/attorneys.js'));
}
/* Groups for the mega menu, in a deliberate order. */
const GROUP_ORDER = ['Family', 'Cyber', 'Survivor', 'Injury', 'Criminal', 'Employment', 'Immigration', 'Estate', 'Business', 'Intellectual Property', 'Real Estate', 'Bankruptcy', 'Tax', 'Civil Rights', 'Government', 'Traffic', 'Education', 'Healthcare', 'Elder', 'Consumer', 'International', 'Litigation', 'Appellate', 'Specialty'];

function groups() {
  const list = allAreas();
  return GROUP_ORDER.filter(g => list.some(a => a.group === g)).map(g => ({
    label: g,
    items: list.filter(a => a.group === g)
  })).concat(
    list.filter(a => GROUP_ORDER.indexOf(a.group) === -1)
      .reduce((acc, a) => {
        let g = acc.filter(x => x.label === a.group)[0];
        if (!g) { g = { label: a.group, items: [] }; acc.push(g); }
        g.items.push(a); return acc;
      }, [])
  );
}

/* ---------------- icons ---------------- */
/* Hand-drawn paths, one per practice group. Deliberately not a generic icon set. */
const ICONS = {
  family: '<path d="M12 3l9 6v12H3V9z"/><path d="M9 21v-7h6v7"/>',
  cyber: '<path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z"/><path d="M9 12l2 2 4-4"/>',
  survivor: '<path d="M12 21s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 11c0 5.5-7 10-7 10z"/>',
  injury: '<path d="M12 3v18M3 12h18"/><circle cx="12" cy="12" r="4"/>',
  criminal: '<path d="M12 2l3 7h7l-5.5 4.5L18.5 21 12 16.5 5.5 21l2-7.5L2 9h7z"/>',
  employment: '<path d="M3 8h18v12H3z"/><path d="M9 8V6a3 3 0 016 0v2"/>',
  immigration: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/>',
  estate: '<path d="M4 21V9l8-6 8 6v12"/><path d="M9 21v-6h6v6"/>',
  business: '<path d="M3 21h18M5 21V7l7-4 7 4v14"/><path d="M9 11h2M13 11h2M9 15h2M13 15h2"/>',
  ip: '<path d="M9 3h6l1 5-4 2-4-2z"/><path d="M12 10v11"/>',
  realestate: '<path d="M3 10l9-7 9 7v11H3z"/><path d="M9 21v-8h6v8"/>',
  bankruptcy: '<path d="M12 3v18"/><path d="M5 8h14M5 16h14"/><path d="M4 8l-2 5h8zM16 8l-2 5h8z"/>',
  tax: '<path d="M6 3h12v18H6z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
  civilrights: '<path d="M12 3v18"/><path d="M5 7h14"/><path d="M5 7l-3 6h6zM19 7l-3 6h6z"/>',
  government: '<path d="M3 21h18M5 21V10l7-5 7 5v11"/><path d="M9 21v-6h6v6"/>',
  traffic: '<path d="M5 12h14M7 12l2-6h6l2 6"/><circle cx="7.5" cy="16" r="1.5"/><circle cx="16.5" cy="16" r="1.5"/>',
  education: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/>',
  healthcare: '<path d="M12 21s-8-5-8-11a5 5 0 019-3 5 5 0 019 3c0 6-8 11-8 11z"/><path d="M12 9v6M9 12h6"/>',
  elder: '<circle cx="12" cy="6" r="3"/><path d="M6 21v-4a6 6 0 0112 0v4"/><path d="M12 14v7"/>',
  consumer: '<path d="M6 6h15l-2 9H8z"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/>',
  international: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18"/>',
  litigation: '<path d="M12 3v18"/><path d="M6 21h12"/><path d="M4 8h16"/><path d="M8 8l-3 6h6zM16 8l-3 6h6z"/>',
  appellate: '<path d="M4 20h16"/><path d="M6 20V8l6-5 6 5v12"/><path d="M12 3v9M9 21v-4h6v4"/>',
  specialty: '<circle cx="12" cy="12" r="9"/><path d="M12 3v4M12 17v4M3 12h4M17 12h4"/>',
  social: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>'
};

function icon(name, cls) {
  const p = ICONS[name] || ICONS.specialty;
  return '<svg class="' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
}

/* Client edits made in the admin panel live here as override maps, keyed by the
   base record id. Merging happens in render.js when a page asks for the list,
   so a rename or a new testimonial shows up everywhere with no rebuild. */
/* Headline figures carry no id, so they are keyed by position (stat0..stat3). */
function applyStats(list, ov) {
  if (!Array.isArray(list)) return list;
  return list.map((x, i) => {
    const o = ov && ov['stat' + i];
    return o ? Object.assign({}, x, o) : x;
  });
}
/* Testimonials: client-added rows first, then the shipped set, both merged
   with any edits saved from the admin panel. */
function testimonials() {
  const st = storeMod();
  const own = st.list('testimonials');
  const shipped = st.applyOverride('testimonials', content.testimonials || []);
  return own.length ? own.concat(shipped) : shipped;
}
function stats() {
  return applyStats(content.stats || [], storeMod().overrides('stats'));
}

module.exports = {
  esc, safeUrl, tel, wa, money, feeLabel, feeTag,
  areas, allAreas, states, content, byId, attorneys, testimonials, stats, groups, icon, ICONS
};
