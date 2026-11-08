'use strict';
/**
 * Oakstone — JSON file store.
 * No database dependency. Atomic writes via temp-file + rename.
 * Collections: settings (object), leads (array), appointments (array),
 *              contacts (array), audit (array).
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, '..', 'data', 'runtime');

const DEFAULTS = {
  settings: {
    firmName: 'Oakstone Legal Group',
    phone: '(800) 555-0142',
    phoneEmergency: '(800) 555-0199',
    whatsapp: '18005550142',
    email: 'intake@oakstonelegal.com',
    emailAlerts: 'newleads@oakstonelegal.com',
    address: '1200 Constitution Avenue NW, Suite 900',
    city: 'Washington',
    stateCode: 'DC',
    zip: '20005',
    hours: 'Monday to Friday, 7:00 a.m. to 9:00 p.m. Eastern. Emergency intake answered 24 hours.',
    tiktok: 'https://www.tiktok.com/@oakstonelegal',
    instagram: 'https://www.instagram.com/oakstonelegal',
    linkedin: 'https://www.linkedin.com/company/oakstonelegal',
    facebook: 'https://www.facebook.com/oakstonelegal',
    youtube: 'https://www.youtube.com/@oakstonelegal',
    x: 'https://x.com/oakstonelegal',
    bookingSlots: '09:00,10:00,11:00,13:00,14:00,15:00,16:00,17:00',
    consultingFee: 0,
    announcement: '',
    announcementOn: false,
    officeNote: '',
    gaId: '',
    recaptchaOn: false
  },
  leads: [],
  appointments: [],
  contacts: [],
  audit: [],
  /* Content the client edits from the admin panel. These are OVERRIDES keyed by
     the base record's id, merged over data/*.js at read time. That means the
     shipped defaults stay in version control as a fallback, and a client edit
     never has to be unpicked from generated code. */
  attorneyOverrides: {},
  areaOverrides: {},
  testimonials: [],
  reviews: [],
  offices: [],
  stats: []
};

function ensure() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}
function file(name) { return path.join(DATA_DIR, name + '.json'); }

function read(name) {
  ensure();
  const f = file(name);
  if (!fs.existsSync(f)) {
    const init = DEFAULTS[name];
    write(name, init);
    return JSON.parse(JSON.stringify(init));
  }
  try {
    return JSON.parse(fs.readFileSync(f, 'utf8'));
  } catch (e) {
    // Corrupt file: preserve it, restore defaults rather than crash the site.
    try { fs.renameSync(f, f + '.corrupt-' + Date.now()); } catch (_) {}
    const init = DEFAULTS[name];
    write(name, init);
    return JSON.parse(JSON.stringify(init));
  }
}

function write(name, value) {
  ensure();
  const f = file(name);
  const tmp = f + '.tmp-' + process.pid;
  fs.writeFileSync(tmp, JSON.stringify(value, null, 2));
  fs.renameSync(tmp, f);
  delete ovCache[name];        // never serve a stale override after a write
  return value;
}

function id(prefix) {
  return (prefix || 'id') + '_' + Date.now().toString(36) + '_' + crypto.randomBytes(4).toString('hex');
}

/* ---------- settings ---------- */
function getSettings() {
  const s = read('settings');
  // Merge forward any settings keys added after first run.
  let changed = false;
  Object.keys(DEFAULTS.settings).forEach(k => {
    if (!(k in s)) { s[k] = DEFAULTS.settings[k]; changed = true; }
  });
  if (changed) write('settings', s);
  return s;
}
function setSettings(patch) {
  const s = getSettings();
  Object.keys(patch || {}).forEach(k => { s[k] = patch[k]; });
  return write('settings', s);
}

/* ---------- generic collection ops ---------- */
function list(name) { return read(name); }
function add(name, item, meta) {
  const arr = read(name);
  const rec = Object.assign(
    { id: id(name.slice(0, 3)), createdAt: new Date().toISOString() },
    meta || {},
    item
  );
  arr.unshift(rec);
  write(name, arr);
  return rec;
}
function update(name, rid, patch) {
  const arr = read(name);
  const i = arr.findIndex(x => x.id === rid);
  if (i === -1) return null;
  arr[i] = Object.assign({}, arr[i], patch, { updatedAt: new Date().toISOString() });
  write(name, arr);
  return arr[i];
}
function remove(name, rid) {
  const arr = read(name);
  const i = arr.findIndex(x => x.id === rid);
  if (i === -1) return false;
  arr.splice(i, 1);
  write(name, arr);
  return true;
}
function find(name, rid) {
  return read(name).find(x => x.id === rid) || null;
}

/* ---------- content overrides ----------
   Each returns an override MAP keyed by base id. get() merges the shipped
   default with the override so pages never see a half-empty record.
   Cached by file mtime: pages read these on every request and re-parsing the
   JSON that often would be wasteful. */
const ovCache = {};
function overrides(name) {
  const f = file(name);
  let stamp = 0;
  try { stamp = fs.statSync(f).mtimeMs; } catch (_) {}
  const hit = ovCache[name];
  if (hit && hit.stamp === stamp) return hit.data;
  const o = read(name);
  const data = (o && typeof o === 'object' && !Array.isArray(o)) ? o : {};
  ovCache[name] = { stamp, data };
  return data;
}
function setOverride(name, rid, patch) {
  const o = overrides(name);
  o[rid] = Object.assign({}, o[rid] || {}, patch, { _editedAt: new Date().toISOString() });
  write(name, o);
  return o[rid];
}
function clearOverride(name, rid) {
  const o = overrides(name);
  delete o[rid];
  write(name, o);
}
function applyOverride(name, base) {
  const o = overrides(name);
  if (!base) return base;
  if (Array.isArray(base)) {
    return base.map(b => (o[b.id] ? Object.assign({}, b, o[b.id]) : b));
  }
  return o[base.id] ? Object.assign({}, base, o[base.id]) : base;
}

/* ---------- audit ---------- */
function audit(actor, action, detail) {
  const arr = read('audit');
  arr.unshift({
    id: id('aud'),
    at: new Date().toISOString(),
    actor: actor || 'system',
    action,
    detail: detail || ''
  });
  // cap the log
  write('audit', arr.slice(0, 1000));
}

module.exports = {
  DATA_DIR, DEFAULTS,
  getSettings, setSettings,
  list, add, update, remove, find, read, write, id, audit,
  overrides, setOverride, clearOverride, applyOverride
};
