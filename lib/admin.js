'use strict';
/**
 * Oakstone — admin content editors.
 * Renders the Attorneys, Practice areas, Testimonials and Offices sections of
 * the admin panel. Every save writes to the JSON store as an override, so the
 * shipped defaults in data/*.js stay untouched and can always be restored.
 */
const R = require('./render.js');
const store = require('./store.js');

const esc = R.esc;

/* ---------- small form helpers ---------- */

function field(label, name, value, opts) {
  opts = opts || {};
  const type = opts.type || 'text';
  const hint = opts.hint ? '<span class="tiny muted">' + esc(opts.hint) + '</span>' : '';
  const req = opts.required ? ' required' : '';
  return '<div class="form-row' + (opts.wide ? ' full' : '') + '">' +
    '<label for="f-' + name + '">' + esc(label) + '</label>' +
    (type === 'textarea'
      ? '<textarea class="field" id="f-' + name + '" name="' + name + '" rows="' + (opts.rows || 4) + '"' + req + '>' + esc(value) + '</textarea>'
      : '<input class="field" id="f-' + name + '" name="' + name + '" type="' + type + '" value="' + esc(value) + '"' + req + '>') +
    hint + '</div>';
}

function listField(label, name, value, hint) {
  /* Comma or newline separated -> stored as an array. */
  const v = Array.isArray(value) ? value.join(', ') : (value || '');
  return '<div class="form-row full"><label for="f-' + name + '">' + esc(label) + '</label>' +
    '<input class="field" id="f-' + name + '" name="' + name + '" type="text" value="' + esc(v) + '">' +
    (hint ? '<span class="tiny muted">' + esc(hint) + '</span>' : '') + '</div>';
}

function uploadField(label, name, current, hint) {
  return '<div class="form-row full"><label>' + esc(label) + '</label>' +
    '<div class="upload">' +
      (current ? '<img class="upload__img" src="' + esc(current) + '" alt="">' : '<div class="upload__empty">No image</div>') +
      '<div class="upload__body">' +
        '<input class="field" type="file" name="' + name + '" accept="image/*">' +
        '<input class="field mt3" type="text" name="' + name + 'Path" value="' + esc(current || '') + '" placeholder="or paste an image path / URL">' +
        (hint ? '<span class="tiny muted">' + esc(hint) + '</span>' : '') +
      '</div>' +
    '</div></div>';
}

const IMG_MAX = 4 * 1024 * 1024;

/* Split a submitted list into a clean array. */
function toList(v) {
  return String(v || '').split(/[,\n]/).map(x => x.trim()).filter(Boolean);
}

/* ---------- ATTORNEYS ---------- */

function attorneysPanel() {
  const base = require('../data/attorneys.js');
  const ov = store.overrides('attorneyOverrides');
  const list = R.attorneys();

  const rows = list.map(a => {
    const edited = !!ov[a.id];
    return '<tr>' +
      '<td><div class="att-cell">' +
        '<img class="att-thumb" src="' + esc(a.headshot) + '" alt="">' +
        '<div><strong>' + esc(a.name) + '</strong><div class="tiny muted">' + esc(a.title) + '</div></div>' +
      '</div></td>' +
      '<td class="small">' + esc(a.email || '') + '</td>' +
      '<td class="small">' + (a.years || '') + ' yrs</td>' +
      '<td>' + (a.featured ? '<span class="tag tag--ok">Featured</span>' : '<span class="tag">Standard</span>') +
        (edited ? ' <span class="tag tag--edit">Edited</span>' : '') + '</td>' +
      '<td class="right"><a class="btn btn--ghost btn--sm" href="/admin/attorney?id=' + esc(a.id) + '">Edit</a></td>' +
    '</tr>';
  }).join('');

  return '<div class="panel" id="attorneys"><div class="panel__h">' +
    '<h2>Attorneys</h2>' +
    '<span class="tiny muted">' + list.length + ' on the roster &middot; ' + Object.keys(ov).length + ' edited</span></div>' +
    '<div class="panel__b tbl-scroll"><table class="tbl">' +
      '<thead><tr><th>Attorney</th><th>Email</th><th>Experience</th><th>Status</th><th></th></tr></thead>' +
      '<tbody>' + rows + '</tbody></table></div>' +
    '<div class="panel__b tiny muted" style="border-top:1px solid var(--line)">' +
      'Edit a name, title, photo, bio, admissions, education or contact line here. Changes appear on the site immediately. ' +
      '"Restore original" on an attorney\'s page undoes your edits and brings back the shipped text.' +
    '</div></div>';
}

function attorneyForm(id) {
  const base = require('../data/attorneys.js').filter(a => a.id === id)[0];
  if (!base) return null;
  const a = R.attorneys().filter(x => x.id === id)[0] || base;
  const edited = !!store.overrides('attorneyOverrides')[id];

  return '<form method="post" action="/admin/attorney" enctype="multipart/form-data">' +
    '<input type="hidden" name="id" value="' + esc(id) + '">' +
    '<div class="panel"><div class="panel__h">' +
      '<h2>Edit ' + esc(a.name) + '</h2>' +
      '<div class="row" style="gap:.6rem">' +
        '<a class="btn btn--ghost btn--sm" href="/admin#attorneys">Back to list</a>' +
        '<a class="btn btn--ghost btn--sm" href="/attorneys/' + esc(id) + '" target="_blank">View page</a>' +
        '<button class="btn btn--primary btn--sm" type="submit">Save</button>' +
      '</div></div>' +
      '<div class="panel__b"><div class="form-grid">' +
        field('Full name', 'name', a.name, { required: true }) +
        field('Title', 'title', a.title, { hint: 'Partner, Senior Associate, Of Counsel...' }) +
        field('Email', 'email', a.email) +
        field('Direct phone', 'phone', a.phone, { hint: 'Shown on the profile so clients can reach this attorney directly.' }) +
        field('Office / location', 'office', a.office, { hint: 'The office this attorney works from, e.g. Washington, DC.' }) +
        field('Bar number', 'barNumber', a.barNumber) +
        field('Years of experience', 'years', a.years, { type: 'number' }) +
        field('Rating shown on the profile', 'rating', a.rating || '', { type: 'number',
          hint: 'Optional. A figure you can verify, 0 to 5. Leave blank unless the firm maintains real client ratings; ' +
                'approved client reviews roll into the average shown on the site either way.' }) +
        field('Number of ratings behind that figure', 'reviewCount', a.reviewCount || '', { type: 'number',
          hint: 'How many ratings the figure above is based on. Set both or neither.' }) +
        '<div class="form-row"><label for="f-featured">Show on the home page</label>' +
          '<label class="switch"><input type="checkbox" id="f-featured" name="featured"' + (a.featured ? ' checked' : '') +
          '><span>Featured attorney</span></label></div>' +
        uploadField('Headshot', 'headshot', a.headshot, 'JPG or PNG, up to 4 MB. Square photos look best.') +
        listField('Practice areas', 'practices', a.practices, 'Comma separated area ids, e.g. family, criminal, cyber') +
        listField('Bar admissions', 'admissions', a.admissions, 'One per line or comma separated') +
        listField('Education', 'education', a.education) +
        listField('Languages', 'languages', a.languages) +
        field('Biography', 'bio', a.bio, { type: 'textarea', rows: 7, wide: true }) +
      '</div></div>' +
      '<div class="panel__b row" style="gap:.6rem;border-top:1px solid var(--line)">' +
        '<button class="btn btn--primary btn--sm" type="submit">Save changes</button>' +
        (edited ? '<button class="btn btn--ghost btn--sm" type="submit" name="restore" value="1" ' +
          'formnovalidate>Restore original</button>' : '') +
      '</div>' +
    '</div></form>';
}

/* ---------- PRACTICE AREAS ---------- */

function areasPanel() {
  const list = R.allAreas();
  const ov = store.overrides('areaOverrides');
  const byGroup = {};
  list.forEach(a => { (byGroup[a.group] = byGroup[a.group] || []).push(a); });

  const rows = Object.keys(byGroup).sort().map(g =>
    '<tr class="tbl__group"><td colspan="4">' + esc(g) + '</td></tr>' +
    byGroup[g].map(a =>
      '<tr>' +
        '<td><strong>' + esc(a.name) + '</strong>' + (ov[a.id] ? ' <span class="tag tag--edit">Edited</span>' : '') +
          '<div class="tiny muted">' + esc(a.tagline || '') + '</div></td>' +
        '<td class="small">' + (a.services ? a.services.length : 0) + ' services</td>' +
        '<td class="small">' + esc(R.feeLabel(a.fee) || '') + '</td>' +
        '<td class="right"><a class="btn btn--ghost btn--sm" href="/admin/area?id=' + esc(a.id) + '">Edit</a></td>' +
      '</tr>').join('')
  ).join('');

  return '<div class="panel" id="areas"><div class="panel__h">' +
    '<h2>Practice areas</h2>' +
    '<span class="tiny muted">' + list.length + ' areas &middot; ' + Object.keys(ov).length + ' edited</span></div>' +
    '<div class="panel__b tbl-scroll"><table class="tbl">' +
      '<thead><tr><th>Area</th><th>Services</th><th>Fee</th><th></th></tr></thead>' +
      '<tbody>' + rows + '</tbody></table></div>' +
    '<div class="panel__b tiny muted" style="border-top:1px solid var(--line)">' +
      'Rename an area, rewrite its summary, change how the fee is described. The 26 area pages and the menus update together.' +
    '</div></div>';
}

function areaForm(id) {
  const base = require('../data/practice-areas.js').concat(require('../data/practice-areas-2.js'))
    .filter(a => a.id === id)[0];
  if (!base) return null;
  const a = R.byId(id);
  const fee = a.fee || {};
  const edited = !!store.overrides('areaOverrides')[id];

  return '<form method="post" action="/admin/area">' +
    '<input type="hidden" name="id" value="' + esc(id) + '">' +
    '<div class="panel"><div class="panel__h">' +
      '<h2>Edit ' + esc(a.name) + '</h2>' +
      '<div class="row" style="gap:.6rem">' +
        '<a class="btn btn--ghost btn--sm" href="/admin#areas">Back to list</a>' +
        '<a class="btn btn--ghost btn--sm" href="/practice-areas/' + esc(id) + '" target="_blank">View page</a>' +
        '<button class="btn btn--primary btn--sm" type="submit">Save</button>' +
      '</div></div>' +
      '<div class="panel__b"><div class="form-grid">' +
        field('Area name', 'name', a.name, { required: true }) +
        field('Menu group', 'group', a.group, { hint: 'Groups the area in the navigation menu' }) +
        field('One-line summary', 'tagline', a.tagline, { wide: true }) +
        field('Introductory paragraph', 'summary', a.summary, { type: 'textarea', rows: 5, wide: true }) +
        field('Service list', 'services',
          (a.services || []).map(s =>
            (s.name || s) +
            (s.desc ? ' :: ' + s.desc : '') +
            (s.fee ? ' :: ' + s.fee.type + ' :: ' + (s.fee.amount === undefined ? '' : s.fee.amount) +
              (s.fee.note ? ' :: ' + s.fee.note : '') : '')
          ).join('\n'),
          { type: 'textarea', rows: 12, wide: true,
            hint: 'One service per line. Format: Name :: description :: fee type :: amount :: note. ' +
                  'Fee type is flat, hourly, retainer, contingency, consult or quote. Leave the extra parts off to keep a simple name-only line.' }) +
      '</div></div>' +
      '<div class="panel__b row" style="gap:.6rem;border-top:1px solid var(--line)">' +
        '<button class="btn btn--primary btn--sm" type="submit">Save changes</button>' +
        (edited ? '<button class="btn btn--ghost btn--sm" type="submit" name="restore" value="1">Restore original</button>' : '') +
      '</div>' +
    '</div></form>';
}

/* ---------- TESTIMONIALS ---------- */

function testimonialsPanel() {
  const mine = store.list('testimonials');
  const shipped = R.content.testimonials || [];

  const row = (t, own) => '<tr>' +
    '<td class="small">&#8220;' + esc(String(t.quote || '').slice(0, 90)) + (String(t.quote || '').length > 90 ? '…' : '') + '&#8221;</td>' +
    '<td class="small">' + esc(t.name || t.author || '') + '</td>' +
    '<td class="small">' + esc(t.location || t.matter || '') + '</td>' +
    '<td>' + (own ? '<span class="tag tag--ok">Yours</span>' : '<span class="tag">Placeholder</span>') + '</td>' +
    '<td class="right">' + (own
      ? '<form method="post" action="/admin/testimonial" style="display:inline">' +
        '<input type="hidden" name="id" value="' + esc(t.id) + '">' +
        '<input type="hidden" name="remove" value="1">' +
        '<button class="btn btn--ghost btn--sm" type="submit">Delete</button></form>'
      : '<a class="btn btn--ghost btn--sm" href="/admin/testimonial?id=' + esc(t.id) + '">Edit</a>') +
    '</td></tr>';

  return '<div class="panel" id="testimonials"><div class="panel__h">' +
    '<h2>Client testimonials</h2>' +
    '<a class="btn btn--primary btn--sm" href="/admin/testimonial?new=1">Add testimonial</a></div>' +
    '<div class="panel__b tbl-scroll"><table class="tbl">' +
      '<thead><tr><th>Quote</th><th>Client</th><th>Matter</th><th></th><th></th></tr></thead><tbody>' +
      mine.map(t => row(t, true)).join('') +
      shipped.map(t => row(t, false)).join('') +
      '</tbody></table></div>' +
    '<div class="panel__b tiny muted" style="border-top:1px solid var(--line)">' +
      'Rows marked <strong>Placeholder</strong> are the samples shipped with the site. Rewrite each one with a real client comment, ' +
      'or edit it and it becomes yours. <strong>Add testimonial</strong> appends a new one at the top of the home page.' +
    '</div></div>';
}

function testimonialForm(id, isNew) {
  let t = { id: '', quote: '', name: '', location: '', matter: '' };
  if (!isNew) {
    const mine = store.list('testimonials').filter(x => x.id === id)[0];
    if (mine) t = mine;
    else {
      const s = (R.content.testimonials || []).filter(x => String(x.id || x.name) === String(id))[0];
      if (s) t = Object.assign({ id: s.id || s.name }, s);
    }
  }

  return '<form method="post" action="/admin/testimonial">' +
    '<input type="hidden" name="id" value="' + esc(t.id || '') + '">' +
    (isNew ? '<input type="hidden" name="create" value="1">' : '') +
    '<div class="panel"><div class="panel__h">' +
      '<h2>' + (isNew ? 'Add a testimonial' : 'Edit testimonial') + '</h2>' +
      '<div class="row" style="gap:.6rem">' +
        '<a class="btn btn--ghost btn--sm" href="/admin#testimonials">Back to list</a>' +
        '<button class="btn btn--primary btn--sm" type="submit">Save</button>' +
      '</div></div>' +
      '<div class="panel__b"><div class="form-grid">' +
        field('Client name or initials', 'name', t.name || t.author, { hint: 'Use initials if the client prefers privacy' }) +
        field('Location', 'location', t.location || t.matter, { hint: 'City and state, e.g. Austin, Texas' }) +
        field('What the matter was', 'matter', t.matter, { wide: true }) +
        field('The quote', 'quote', t.quote, { type: 'textarea', rows: 6, wide: true, required: true }) +
      '</div></div>' +
      '<div class="panel__b tiny muted" style="border-top:1px solid var(--line)">' +
        'Only publish a testimonial with the client&#8217;s written permission. Bar rules in most states also require the ' +
        'site to say whether results depend on the facts of each case &#8212; that disclaimer is already on the page.' +
      '</div>' +
    '</div></form>';
}

/* ---------- OFFICES ---------- */

function officesPanel() {
  const list = store.list('offices');
  const s = store.getSettings();

  const rows = list.length ? list.map(o =>
    '<tr><td><strong>' + esc(o.name) + '</strong></td>' +
    '<td class="small">' + esc(o.address || '') + '</td>' +
    '<td class="small">' + esc(o.phone || '') + '</td>' +
    '<td class="right">' +
      '<a class="btn btn--ghost btn--sm" href="/admin/office?id=' + esc(o.id) + '">Edit</a>' +
      '<form method="post" action="/admin/office" style="display:inline">' +
        '<input type="hidden" name="id" value="' + esc(o.id) + '"><input type="hidden" name="remove" value="1">' +
        '<button class="btn btn--ghost btn--sm" type="submit">Delete</button></form>' +
    '</td></tr>').join('')
    : '<tr><td colspan="4" class="small muted">No additional offices yet. The main address above is used when the list is empty.</td></tr>';

  return '<div class="panel" id="offices"><div class="panel__h">' +
    '<h2>Offices</h2>' +
    '<a class="btn btn--primary btn--sm" href="/admin/office?new=1">Add office</a></div>' +
    '<div class="panel__b tbl-scroll"><table class="tbl">' +
      '<thead><tr><th>Office</th><th>Address</th><th>Phone</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
    '<div class="panel__b"><div class="form-grid">' +
      field('Office note', 'officeNote', s.officeNote || '', { wide: true,
        hint: 'Optional line shown under the main address on the contact page.' }) +
    '</div>' +
    '<p class="tiny muted">Offices are additional locations shown on the contact page. Leave empty to show only the main address.</p>' +
    '</div></div>';
}

function officeForm(id, isNew) {
  const o = isNew ? {} : (store.find('offices', id) || {});
  return '<form method="post" action="/admin/office">' +
    '<input type="hidden" name="id" value="' + esc(o.id || '') + '">' +
    (isNew ? '<input type="hidden" name="create" value="1">' : '') +
    '<div class="panel"><div class="panel__h"><h2>' + (isNew ? 'Add an office' : 'Edit office') + '</h2>' +
      '<div class="row" style="gap:.6rem">' +
        '<a class="btn btn--ghost btn--sm" href="/admin#offices">Back to list</a>' +
        '<button class="btn btn--primary btn--sm" type="submit">Save</button></div></div>' +
      '<div class="panel__b"><div class="form-grid">' +
        field('Office name', 'name', o.name, { required: true }) +
        field('Phone', 'phone', o.phone) +
        field('Street address', 'address', o.address, { wide: true }) +
        field('City', 'city', o.city) +
        field('State code', 'stateCode', o.stateCode) +
        field('ZIP', 'zip', o.zip) +
        field('Hours', 'hours', o.hours, { wide: true }) +
        field('Note', 'note', o.note, { wide: true, hint: 'Optional line shown under the address' }) +
      '</div></div></div></form>';
}

/* ---------- STATS / RESULTS STRIP ---------- */

function statsPanel() {
  const s = store.getSettings();
  const ov = store.overrides('stats');
  const base = R.content.stats || [];

  const rows = base.map((x, i) => {
    const k = 'stat' + i;
    const v = ov[k] || {};
    return '<tr>' +
      '<td><input class="field" form="statsform" name="' + k + '_value" value="' + esc(v.value !== undefined ? v.value : x.value) + '"></td>' +
      '<td><input class="field" form="statsform" name="' + k + '_label" value="' + esc(v.label !== undefined ? v.label : x.label) + '"></td>' +
      '<td class="right">' + (ov[k] ? '<span class="tag tag--edit">Edited</span>' : '') + '</td></tr>';
  }).join('');

  return '<form id="statsform" method="post" action="/admin/stats">' +
    '<div class="panel" id="stats"><div class="panel__h">' +
      '<h2>Headline figures</h2>' +
      '<div class="row" style="gap:.6rem">' +
        '<button class="btn btn--ghost btn--sm" type="submit" name="restore" value="1">Restore original</button>' +
        '<button class="btn btn--primary btn--sm" type="submit">Save</button></div></div>' +
      '<div class="panel__b tbl-scroll"><table class="tbl">' +
        '<thead><tr><th>Figure</th><th>Description</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '<div class="panel__b"><div class="form-grid">' +
        field('Announcement bar text', 'announcement', s.announcement, { wide: true,
          hint: 'Shown across the top of every page when switched on' }) +
        '<div class="form-row"><label for="f-announcementOn">Show the announcement bar</label>' +
          '<label class="switch"><input type="checkbox" id="f-announcementOn" name="announcementOn"' +
          (s.announcementOn ? ' checked' : '') + '><span>Enabled</span></label></div>' +
      '</div>' +
      '<p class="tiny muted mt4">These four figures appear on the home page and the entry screen. ' +
      'They must be accurate: advertising rules prohibit overstated or unverifiable claims about results.</p>' +
      '</div></div></form>';
}

/* ---------- PRICES ----------
   One row per service across all 26 practice areas. The price the client types
   is stored as an override keyed "<areaId>::<service name>" and is merged over
   the shipped fee at read time, so it appears everywhere at once without
   touching code, and can always be restored. */

function feePanel() {
  const ov = store.overrides('feeOverrides');
  const areas = R.allAreas();
  const typeOpts = ['flat', 'hourly', 'retainer', 'contingency', 'consult', 'quote'];
  const typeNames = { flat: 'Flat fee', hourly: 'Hourly', retainer: 'Retainer',
    contingency: 'Contingency', consult: 'No charge', quote: 'Quoted' };

  const groups = areas.map(a => {
    const rows = (a.services || []).map(sv => {
      const key = a.id + '::' + sv.name;
      const f = sv.fee || { type: 'quote' };
      const edited = !!ov[key];
      return '<tr>' +
        '<td class="small"><strong>' + esc(sv.name) + '</strong>' +
          (edited ? ' <span class="tag tag--edit">Edited</span>' : '') + '</td>' +
        '<td><select class="field" form="feeform" name="fee_' + esc(key) + '_type" style="min-width:9rem">' +
          typeOpts.map(t => '<option value="' + t + '"' + (f.type === t ? ' selected' : '') + '>' + typeNames[t] + '</option>').join('') +
        '</select></td>' +
        '<td><input class="field" form="feeform" name="fee_' + esc(key) + '_amount" style="width:7rem" ' +
          'value="' + esc(f.amount === undefined ? '' : f.amount) + '" placeholder="—"></td>' +
        '<td class="tiny muted">' + esc(sv.fee ? R.feeLabel(sv.fee) : 'Quoted') + '</td>' +
        '</tr>';
    }).join('');
    return '<tbody><tr class="fee-group"><td colspan="4"><strong>' + esc(a.name) + '</strong>' +
      ' <span class="tiny muted">' + (a.services || []).length + ' services</span></td></tr>' + rows + '</tbody>';
  }).join('');

  return '<form id="feeform" method="post" action="/admin/fees">' +
    '<div class="panel" id="prices"><div class="panel__h">' +
      '<h2>Prices</h2>' +
      '<div class="row" style="gap:.6rem">' +
        '<button class="btn btn--ghost btn--sm" type="submit" name="restore" value="1">Restore all to original</button>' +
        '<button class="btn btn--primary btn--sm" type="submit">Save prices</button></div></div>' +
      '<div class="panel__b">' +
        '<p class="small muted">Every price on the site comes from this table. Set the type on the left and the ' +
        'number on the right; leave the number empty to show a quoted price instead. ' +
        'Contingency amounts are written as a number, meaning the percentage. Changes appear immediately on ' +
        'every page that prints the fee.</p>' +
        '<div class="tbl-scroll"><table class="tbl">' +
          '<thead><tr><th style="min-width:16rem">Service</th><th>Type</th><th>Amount</th><th>Shows as</th></tr></thead>' +
          groups +
        '</table></div>' +
      '</div></div></form>';
}

/* ---------- REVIEWS (submitted from attorney profiles) ---------- */

function reviewsPanel() {
  const all = store.list('reviews');
  const pending = all.filter(r => (r.status || 'pending') === 'pending');
  const approved = all.filter(r => r.status === 'approved');

  const stars = n => '\u2605'.repeat(Math.max(1, Math.min(5, Number(n) || 0)));
  const row = r =>
    '<tr>' +
      '<td><span class="tag ' + (r.status === 'approved' ? 'tag--ok' : '') + '">' + esc(r.status || 'pending') + '</span></td>' +
      '<td class="small"><strong>' + esc(r.attorney || r.attorneyId || '') + '</strong></td>' +
      '<td class="small" style="color:var(--brass-500);white-space:nowrap">' + stars(r.rating) + '</td>' +
      '<td class="small">' + esc(r.author || 'Anonymous') +
        (r.matter ? '<div class="tiny muted">' + esc(r.matter) + '</div>' : '') + '</td>' +
      '<td class="small">&#8220;' + esc(String(r.quote || '').slice(0, 160)) + (String(r.quote || '').length > 160 ? '…' : '') + '&#8221;</td>' +
      '<td class="tiny muted">' + esc((r.createdAt || '').slice(0, 16).replace('T', ' ')) + '</td>' +
      '<td class="right" style="white-space:nowrap">' +
        '<form method="post" action="/admin/review" style="display:inline">' +
          '<input type="hidden" name="id" value="' + esc(r.id) + '">' +
          '<input type="hidden" name="status" value="' + (r.status === 'approved' ? 'pending' : 'approved') + '">' +
          '<button class="btn btn--ghost btn--sm" type="submit">' + (r.status === 'approved' ? 'Unpublish' : 'Approve') + '</button>' +
        '</form>' +
        '<form method="post" action="/admin/review" style="display:inline;margin-left:.3rem">' +
          '<input type="hidden" name="id" value="' + esc(r.id) + '">' +
          '<input type="hidden" name="remove" value="1">' +
          '<button class="btn btn--sm" style="color:var(--alert)" type="submit">Delete</button>' +
        '</form>' +
      '</td></tr>';

  return '<div class="panel" id="reviews"><div class="panel__h">' +
    '<h2>Client reviews</h2>' +
    '<span class="tiny muted">' + pending.length + ' awaiting you &middot; ' + approved.length + ' published</span></div>' +
    '<div class="panel__b tbl-scroll"><table class="tbl">' +
      '<thead><tr><th>Status</th><th>Attorney</th><th>Stars</th><th>Reviewer</th><th>Review</th><th>Received</th><th></th></tr></thead><tbody>' +
      (all.length ? all.map(row).join('')
        : '<tr><td colspan="7" class="small muted">No reviews submitted yet. Visitors can leave a rating and a note on any attorney profile; it appears on the site only after you approve it here.</td></tr>') +
      '</tbody></table></div>' +
    '<div class="panel__b tiny muted" style="border-top:1px solid var(--line)">' +
      'A review is never published automatically. <strong>Approve</strong> publishes it on that attorney&#8217;s profile and rolls it into the star average. ' +
      'The average shown on the site is the mean of every approved review, plus any rating you record for the attorney in Attorneys. ' +
      'Only publish reviews you can verify &#8212; bar rules treat client ratings as advertising.' +
    '</div></div>';
}

module.exports = {
  field, listField, toList, IMG_MAX,
  attorneysPanel, attorneyForm,
  areasPanel, areaForm,
  testimonialsPanel, testimonialForm,
  reviewsPanel,
  officesPanel, officeForm,
  statsPanel, feePanel
};
