'use strict';
/**
 * Oakstone — admin content routes.
 * GET  the attorney / area / testimonial / office editor pages
 * POST the saves, including image uploads for attorney headshots.
 *
 * Writes go into the JSON store as override records keyed by the base id, so
 * the shipped data files are never modified and "restore original" is simply
 * clearing the override.
 */
const fs = require('fs');
const path = require('path');
const R = require('./render.js');
const store = require('./store.js');
const A = require('./admin.js');
const mp = require('./multipart.js');

const IMG_DIR = path.join(__dirname, '..', 'public', 'assets', 'img', 'team');
const ALLOWED = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/gif': '.gif' };

function send(res, code, body, headers) {
  const h = Object.assign({ 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store, no-cache, must-revalidate' }, headers || {});
  res.writeHead(code, h);
  res.end(body || '');
}
function redirect(res, to) { return send(res, 302, '', { Location: to }); }

function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on('data', c => {
      size += c.length;
      if (size > (limit || A.IMG_MAX + 200000)) { reject(new Error('too large')); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

/* Read form fields, honouring multipart when a file was posted. */
function readForm(req) {
  const ctype = req.headers['content-type'] || '';
  return readBody(req).then(buf => {
    if (ctype.indexOf('multipart/form-data') === 0) {
      const m = /boundary=(?:"([^"]+)"|([^;]+))/i.exec(ctype);
      return mp.parse(buf, (m && (m[1] || m[2]) || '').trim());
    }
    const raw = buf.toString('utf8');
    const fields = {};
    raw.split('&').forEach(pair => {
      const i = pair.indexOf('=');
      if (i === -1) return;
      const k = decodeURIComponent(pair.slice(0, i).replace(/\+/g, ' '));
      const v = decodeURIComponent(pair.slice(i + 1).replace(/\+/g, ' '));
      fields[k] = v;
    });
    return { fields, files: {} };
  });
}

/* Validate + store an uploaded headshot. Returns a web path or null. */
function saveImage(file, id) {
  if (!file || !file.filename) return { path: null };
  if (!ALLOWED[file.contentType]) return { error: 'Only JPG, PNG, WebP or GIF images can be uploaded.' };
  if (file.data.length > A.IMG_MAX) return { error: 'That image is larger than 4 MB. Please resize it and try again.' };
  /* Sniff the real format — never trust the declared content type. */
  const b = file.data;
  const isJpg = b[0] === 0xFF && b[1] === 0xD8;
  const isPng = b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4E && b[3] === 0x47;
  const isGif = b.slice(0, 3).toString('ascii') === 'GIF';
  const isWebp = b.slice(0, 4).toString('ascii') === 'RIFF' && b.slice(8, 12).toString('ascii') === 'WEBP';
  if (!isJpg && !isPng && !isGif && !isWebp) return { error: 'That file is not a readable image.' };

  const safeId = String(id).replace(/[^a-z0-9_-]/gi, '');
  const ext = isPng ? '.png' : isGif ? '.gif' : isWebp ? '.webp' : '.jpg';
  const name = safeId + '-headshot' + ext;
  fs.mkdirSync(IMG_DIR, { recursive: true });
  const dest = path.join(IMG_DIR, name);
  fs.writeFileSync(dest, file.data);

  /* Brand the photograph. Every attorney picture that arrives through the
     admin panel gets the Oakstone mark composited in, so a picture lifted off
     the site always carries the firm's name with it. Best effort: if the
     image tool is unavailable the upload still succeeds. */
  watermark(dest, safeId);

  return { path: '/assets/img/team/' + name };
}

/* Composite the Oakstone wordmark into the lower corner of a headshot, plus a
   faint diagonal. Non-fatal if anything goes wrong. */
function watermark(file, id) {
  const { execFileSync } = require('child_process');
  const OUT = file.replace(/(\.[a-z]+)$/i, '-wm$1');
  const logo = path.join(__dirname, '..', 'public', 'assets', 'img', 'oakstone-mark.png');
  try {
    if (fs.existsSync(logo)) {
      execFileSync('magick', [file, logo, '-gravity', 'southwest', '-geometry', '+14+14',
        '-composite', file], { stdio: 'ignore' });
    }
    execFileSync('magick', [file, '-gravity', 'center', '-fill', 'rgba(110,31,38,0.13)',
      '-pointsize', '46', '-annotate', '-24', 'OAKSTONE', file], { stdio: 'ignore' });
    if (fs.existsSync(OUT)) fs.unlinkSync(OUT);
  } catch (e) { /* no image tool — keep the original */ }
}

/* Turn "a, b, c" or a newline list into an array. */
function list(v) {
  return String(v || '').split(/[,\n]/).map(s => s.trim()).filter(Boolean);
}
function txt(f, k, max) {
  return String((f[k] || '')).replace(/[\r\n]+/g, ' ').trim().slice(0, max || 400);
}

/* ---------------- handlers ---------------- */

function handle(req, res, pathname) {
  const method = req.method;

  /* ---- attorney ---- */
  if (pathname === '/admin/attorney' && method === 'GET') {
    const id = (/[?&]id=([^&]*)/.exec(req.url) || [])[1];
    const html = A.attorneyForm(decodeURIComponent(id || ''));
    if (!html) return redirect(res, '/admin#attorneys');
    return send(res, 200, adminShell('Edit attorney', html, /[?&]saved=1/.test(req.url)));
  }
  if (pathname === '/admin/attorney' && method === 'POST') {
    return readForm(req).then(({ fields: f, files }) => {
      const id = String(f.id || '').trim();
      if (!id) return redirect(res, '/admin#attorneys');

      if (f.restore) {
        store.clearOverride('attorneyOverrides', id);
        store.audit('admin', 'attorney-restore', id);
        return redirect(res, '/admin#attorneys');
      }

      const patch = {
        name: txt(f, 'name', 120),
        title: txt(f, 'title', 120),
        email: txt(f, 'email', 200),
        phone: txt(f, 'phone', 40),
        office: txt(f, 'office', 160),
        barNumber: txt(f, 'barNumber', 60),
        years: txt(f, 'years', 4),
        rating: txt(f, 'rating', 5),
        reviewCount: txt(f, 'reviewCount', 5),
        bio: String(f.bio || '').trim().slice(0, 6000),
        featured: f.featured === 'on',
        practices: list(f.practices),
        admissions: list(f.admissions),
        education: list(f.education),
        languages: list(f.languages)
      };

      const img = saveImage(files && files.headshot, id);
      if (img.error) store.audit('admin', 'attorney-upload-rejected', id + ' ' + img.error);
      let headshot = img.path;
      if (!headshot && f.headshotPath) headshot = String(f.headshotPath).trim().slice(0, 400);
      if (headshot) patch.headshot = headshot;

      store.setOverride('attorneyOverrides', id, patch);
      store.audit('admin', 'attorney-save', id + (img.path ? ' +photo' : ''));
      return redirect(res, '/admin/attorney?id=' + encodeURIComponent(id) + '&saved=1');
    }).catch(() => send(res, 200, adminShell('Upload failed', '<p>That upload was too large or malformed. Please try a smaller image.</p>')));
  }

  /* ---- practice area ---- */
  if (pathname === '/admin/area' && method === 'GET') {
    const id = (/[?&]id=([^&]*)/.exec(req.url) || [])[1];
    const html = A.areaForm(decodeURIComponent(id || ''));
    if (!html) return redirect(res, '/admin#areas');
    return send(res, 200, adminShell('Edit practice area', html, /[?&]saved=1/.test(req.url)));
  }
  if (pathname === '/admin/area' && method === 'POST') {
    return readForm(req).then(({ fields: f }) => {
      const id = String(f.id || '').trim();
      if (!id) return redirect(res, '/admin#areas');
      if (f.restore) {
        store.clearOverride('areaOverrides', id);
        store.audit('admin', 'area-restore', id);
        return redirect(res, '/admin#areas');
      }
      /* Service lines are "Name :: description :: fee type :: amount :: note".
         Only the name is required; the rest is optional and older name-only
         lines still round-trip. */
      const services = String(f.services || '').split('\n').map(line => {
        const parts = line.split('::').map(x => x.trim());
        if (!parts[0]) return null;
        const svc = { name: parts[0] };
        if (parts[1]) svc.desc = parts[1];
        if (parts[2]) {
          svc.fee = { type: parts[2] };
          if (parts[3] !== undefined && parts[3] !== '') svc.fee.amount = /^-?\d+(\.\d+)?$/.test(parts[3]) ? Number(parts[3]) : parts[3];
          if (parts[4]) svc.fee.note = parts[4];
        }
        return svc;
      }).filter(Boolean);
      const patch = {
        name: txt(f, 'name', 120),
        group: txt(f, 'group', 80),
        tagline: txt(f, 'tagline', 300),
        summary: String(f.summary || '').trim().slice(0, 6000)
      };
      const base = require('../data/practice-areas.js')
        .concat(require('../data/practice-areas-2.js'))
        .filter(a => a.id === id)[0] || {};
      const merged = Object.assign({}, base, patch);
      const kept = (merged.services || []).filter(s => s && s.name && services.some(n => n.name === s.name));
      patch.services = kept.concat(services.filter(n => !kept.some(k => k.name === n.name)));
      store.setOverride('areaOverrides', id, patch);
      store.audit('admin', 'area-save', id);
      return redirect(res, '/admin/area?id=' + encodeURIComponent(id) + '&saved=1');
    });
  }

  /* ---- testimonial ---- */
  if (pathname === '/admin/testimonial' && method === 'GET') {
    const q = req.url;
    const isNew = /[?&]new=1/.test(q);
    const id = (/[?&]id=([^&]*)/.exec(q) || [])[1];
    return send(res, 200, adminShell(isNew ? 'Add testimonial' : 'Edit testimonial',
      A.testimonialForm(decodeURIComponent(id || ''), isNew)));
  }
  if (pathname === '/admin/testimonial' && method === 'POST') {
    return readForm(req).then(({ fields: f }) => {
      if (f.remove) {
        store.remove('testimonials', f.id);
        store.audit('admin', 'testimonial-delete', f.id);
        return redirect(res, '/admin#testimonials');
      }
      const entry = {
        quote: String(f.quote || '').trim().slice(0, 1200),
        name: txt(f, 'name', 120),
        location: txt(f, 'location', 120),
        matter: txt(f, 'matter', 200)
      };
      if (f.create || !f.id) {
        entry.id = store.id('tm');
        entry.at = new Date().toISOString();
        store.add('testimonials', entry);
        store.audit('admin', 'testimonial-create', entry.name);
      } else {
        /* Editing a shipped placeholder promotes it to an own record. */
        const own = store.find('testimonials', f.id);
        if (own) store.update('testimonials', f.id, entry);
        else {
          entry.id = store.id('tm');
          store.add('testimonials', entry);
        }
        store.audit('admin', 'testimonial-save', f.id);
      }
      return redirect(res, '/admin#testimonials');
    });
  }

  /* ---- office ---- */
  if (pathname === '/admin/office' && method === 'GET') {
    const q = req.url;
    const isNew = /[?&]new=1/.test(q);
    const id = (/[?&]id=([^&]*)/.exec(q) || [])[1];
    return send(res, 200, adminShell(isNew ? 'Add office' : 'Edit office',
      A.officeForm(decodeURIComponent(id || ''), isNew)));
  }
  if (pathname === '/admin/office' && method === 'POST') {
    return readForm(req).then(({ fields: f }) => {
      if (f.remove) {
        store.remove('offices', f.id);
        store.audit('admin', 'office-delete', f.id);
        return redirect(res, '/admin#offices');
      }
      const entry = {
        name: txt(f, 'name', 120),
        phone: txt(f, 'phone', 40),
        address: txt(f, 'address', 200),
        city: txt(f, 'city', 80),
        stateCode: txt(f, 'stateCode', 4),
        zip: txt(f, 'zip', 12),
        hours: txt(f, 'hours', 120),
        note: txt(f, 'note', 200)
      };
      if (f.create || !f.id) {
        entry.id = store.id('off');
        store.add('offices', entry);
        store.audit('admin', 'office-create', entry.name);
      } else {
        store.update('offices', f.id, entry);
        store.audit('admin', 'office-save', f.id);
      }
      return redirect(res, '/admin#offices');
    });
  }

  /* ---- headline figures ---- */
  if (pathname === '/admin/stats' && method === 'POST') {
    return readForm(req).then(({ fields: f }) => {
      if (f.restore) {
        ['stat0', 'stat1', 'stat2', 'stat3'].forEach(k => store.clearOverride('stats', k));
        store.audit('admin', 'stats-restore', 'all');
        return redirect(res, '/admin#stats');
      }
      const base = require('../data/content.js').stats || [];
      base.forEach((x, i) => {
        const k = 'stat' + i;
        const value = txt(f, k + '_value', 40);
        const label = txt(f, k + '_label', 120);
        if (value !== String(x.value) || label !== String(x.label)) {
          store.setOverride('stats', k, { value, label });
        } else {
          store.clearOverride('stats', k);
        }
      });
      store.setSettings({
        announcement: String(f.announcement || '').trim().slice(0, 300),
        announcementOn: f.announcementOn === 'on'
      });
      store.audit('admin', 'stats-save', 'figures updated');
      return redirect(res, '/admin#stats');
    });
  }

  return null;
}

/* Wrap a standalone editor page in the site's admin chrome. */
function adminShell(title, body, saved) {
  const R2 = require('./render.js');
  const layout = require('./layout.js');
  const store2 = require('./store.js');
  return layout.layout({
    settings: store2.getSettings(), noindex: true,
    title: title + ' | Oakstone Admin',
    bodyClass: 'admin',
    body:
      '<div class="admin__top"><div class="brand">' + layout.brand() + '</div>' +
        '<div class="row" style="gap:.6rem"><span class="tag tag--dark">Admin</span>' +
        '<a class="btn btn--ghostlight btn--sm" href="/home" target="_blank">View site</a>' +
        '<a class="btn btn--ghostlight btn--sm" href="/admin">Dashboard</a>' +
        '<a class="btn btn--sm" style="background:rgba(241,245,249,.1);color:var(--bone)" href="/admin/logout">Sign out</a></div></div>' +
      '<div class="admin__wrap admin__wrap--single"><main class="admin__main">' +
        (saved ? '<div class="notice notice--ok">Saved. The change is live on the site now.</div>' : '') +
        body +
      '</main></div>'
  });
}

module.exports = { handle, adminShell };
