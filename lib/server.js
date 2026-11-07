'use strict';
/**
 * Oakstone Legal Group — zero-dependency HTTP server.
 * Static files, dynamic pages, form endpoints, admin API with session auth.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { URL } = require('url');

const store = require('./store.js');
const mail = require('./mailer.js');
const layout = require('./layout.js');
const R = require('./render.js');
const pages = require('./pages.js');
const pages2 = require('./pages2.js');
const pages3 = require('./pages3.js');
const pages4 = require('./pages4.js');

const PORT = Number(process.env.PORT) || 3000;
const PUBLIC = path.join(__dirname, '..', 'public');
const ADMIN_PASS = process.env.ADMIN_PASS || 'OANKS123456789';
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const SESSIONS = new Map(); // token -> { expires }
const SESSION_TTL = 1000 * 60 * 60 * 8;

/* ---------------- helpers ---------------- */

function send(res, code, body, headers) {
  headers = headers || {};
  const h = Object.assign({
    'Content-Type': 'text/html; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Frame-Options': 'SAMEORIGIN',
    'Content-Security-Policy': "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; frame-ancestors 'self'",
    /* Pages embed live data (dates, settings, prices) and must never be cached,
       or visitors keep seeing yesterday's available days. */
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'Pragma': 'no-cache'
  }, headers);
  res.writeHead(code, h);
  res.end(body);
}
function html(res, page, settings) {
  send(res, 200, layout.layout(Object.assign({}, page, { settings })));
}
function redirect(res, loc) {
  send(res, 302, '', { Location: loc });
}
function json(res, code, obj) {
  send(res, code, JSON.stringify(obj), { 'Content-Type': 'application/json; charset=utf-8' });
}

function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on('data', c => {
      size += c.length;
      if (size > (limit || 200000)) { reject(new Error('body too large')); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function parseForm(raw) {
  const out = {};
  raw.split('&').forEach(pair => {
    const i = pair.indexOf('=');
    if (i === -1) return;
    const k = decodeURIComponent(pair.slice(0, i).replace(/\+/g, ' '));
    const v = decodeURIComponent(pair.slice(i + 1).replace(/\+/g, ' '));
    if (k in out) { out[k] = [].concat(out[k], v); } else out[k] = v;
  });
  return out;
}

function clientMeta(req) {
  return {
    ip: (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim(),
    userAgent: req.headers['user-agent'] || '',
    referer: req.headers['referer'] || ''
  };
}

function clean(s, max) { return String(s || '').replace(/[\r\n]+/g, ' ').trim().slice(0, max || 2000); }

/* ---------------- auth ---------------- */

function newSession() {
  const token = crypto.randomBytes(24).toString('hex');
  SESSIONS.set(token, { expires: Date.now() + SESSION_TTL });
  return token;
}
function checkSession(req) {
  const cookies = req.headers.cookie || '';
  const m = cookies.match(/oak_admin=([a-f0-9]+)/);
  if (!m) return false;
  const s = SESSIONS.get(m[1]);
  if (!s || s.expires < Date.now()) { SESSIONS.delete(m[1]); return false; }
  return true;
}
function parseCookies(req) {
  const out = {};
  (req.headers.cookie || '').split(';').forEach(p => {
    const i = p.indexOf('=');
    if (i > -1) out[p.slice(0, i).trim()] = p.slice(i + 1).trim();
  });
  return out;
}

/* ---------------- mail composition ---------------- */

function leadEmailTo(setting, lead) {
  const lines = [
    'New ' + lead.kind + ' through the website.',
    '',
    'Name: ' + lead.name,
    'Phone: ' + lead.phone,
    'Email: ' + lead.email,
    'Practice area: ' + (lead.practiceArea || lead.incident || 'Not specified'),
    'State: ' + (lead.state || 'Not specified'),
    'Urgency: ' + (lead.urgency || 'Normal'),
    '',
    'Details:',
    (lead.details || '(none)'),
    '',
    'Submitted: ' + lead.createdAt,
    'IP: ' + (lead.ip || 'unknown'),
    'User agent: ' + (lead.userAgent || 'unknown'),
    'Referrer: ' + (lead.referer || 'direct'),
    'Record ID: ' + lead.id,
    '',
    'Open the admin panel to action this lead.'
  ];
  return lines.join('\n');
}

function leadEmailHtml(setting, lead) {
  const row = (k, v) => v ? '<tr><td style="padding:6px 14px 6px 0;color:#4a525f;font-size:13px;white-space:nowrap;vertical-align:top">' + k + '</td><td style="padding:6px 0;color:#14181f;font-size:14px;font-weight:600">' + String(v).replace(/</g, '<') + '</td></tr>' : '';
  return '<div style="font-family:Helvetica,Arial,sans-serif;max-width:640px;margin:0 auto;border:1px solid #dfe2e7">' +
    '<div style="background:#14181f;padding:22px 28px">' +
      '<span style="color:#eef0f3;font-family:Georgia,serif;font-size:20px">Oakstone</span>' +
      '<span style="color:#a48c5c;font-size:11px;letter-spacing:3px;margin-left:10px">NEW ' + String(lead.kind || 'LEAD').toUpperCase() + '</span>' +
    '</div>' +
    '<div style="padding:26px 28px">' +
      '<table style="border-collapse:collapse;width:100%">' +
        row('Name', lead.name) + row('Phone', lead.phone) + row('Email', lead.email) +
        row('Practice area', lead.practiceArea) + row('Incident', lead.incident) +
        row('State', lead.state) + row('Urgency', lead.urgency) +
        row('Appointment', lead.appointment) + row('Submitted', lead.createdAt) +
        row('IP', lead.ip) + row('Record', lead.id) +
      '</table>' +
      (lead.details ? '<div style="margin-top:18px;padding:14px;background:#eef0f3;font-size:13px;line-height:1.6;color:#1f2530">' + String(lead.details).replace(/</g, '<').replace(/\n/g, '<br>') + '</div>' : '') +
      '<p style="margin-top:22px;font-size:12px;color:#667080">Open the admin panel to action this lead. This notification was generated automatically.</p>' +
    '</div></div>';
}

function clientConfirmation(setting, lead) {
  const isAppt = lead.kind === 'appointment';
  const subject = isAppt
    ? 'Your consultation is confirmed - Oakstone Legal Group'
    : 'We received your request - Oakstone Legal Group';
  const when = lead.appointment || 'within four hours during business hours';
  const text = [
    lead.name ? 'Dear ' + lead.name + ',' : 'Hello,',
    '',
    isAppt ? 'Your consultation is confirmed for ' + when + '.'
           : 'We received your request on ' + new Date(lead.createdAt).toUTCString() + '.',
    '',
    'An attorney will review what you sent and respond ' + (isAppt ? 'at that time.' : 'within four hours during business hours.'),
    isAppt ? 'A calendar invitation is attached to this message.' : '',
    '',
    'Reference: ' + lead.id,
    '',
    'If this matter is urgent, call ' + setting.phone + '. For cyber emergencies call ' + setting.phoneEmergency + '.',
    '',
    'Oakstone Legal Group',
    setting.phone + ' | ' + setting.email,
    'Attorney advertising. No attorney-client relationship is formed by this message.'
  ].filter(x => x !== '').join('\n');
  return { subject, text };
}

async function dispatchLead(lead) {
  const setting = store.getSettings();
  const smtp = {
    host: process.env.SMTP_HOST, port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER, pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM || setting.email
  };

  /* 1. internal alert */
  const internal = await mail.sendMail(Object.assign({}, smtp, {
    to: setting.emailAlerts,
    replyTo: lead.email ? lead.name + ' <' + lead.email + '>' : undefined,
    subject: '[' + (lead.kind === 'appointment' ? 'BOOKING' : lead.kind === 'emergency' ? 'EMERGENCY' : 'LEAD') + '] ' +
      (lead.name || 'Website visitor') + (lead.practiceArea ? ' - ' + lead.practiceArea : '') + (lead.urgency === 'emergency' ? ' - URGENT' : ''),
    text: leadEmailTo(setting, lead),
    html: leadEmailHtml(setting, lead)
  }));

  /* 2. client confirmation + ICS for appointments */
  let client = { ok: false, skipped: true };
  const conf = clientConfirmation(setting, lead);
  if (lead.email) {
    const attachments = [];
    if (lead.kind === 'appointment' && lead.date && lead.time) {
      const start = new Date(lead.date + 'T' + lead.time + ':00');
      const ics = mail.buildIcs({
        uid: lead.id + '@oakstonelegal.com',
        start, end: new Date(start.getTime() + 30 * 60000),
        summary: 'Oakstone Legal Group - Case Review',
        description: 'Consultation with ' + setting.firmName + '. Reference ' + lead.id + '. Call ' + setting.phone + ' with questions.',
        location: lead.format === 'video' ? 'Video conference (link to follow)' : 'Phone call',
        organizer: setting.email, organizerName: setting.firmName,
        attendee: lead.email, attendeeName: lead.name
      });
      attachments.push({ filename: 'appointment.ics', content: ics, contentType: 'text/calendar; method=REQUEST' });
    }
    client = await mail.sendMail(Object.assign({}, smtp, {
      to: lead.email,
      subject: conf.subject,
      text: conf.text,
      attachments
    }));
  }

  store.audit('system', 'mail', lead.id + ' internal=' + (internal.ok ? 'sent' : internal.skipped ? 'skipped' : 'failed') +
    ' client=' + (client.ok ? 'sent' : client.skipped ? 'skipped' : 'failed'));
  return { internal, client };
}

/* ---------------- static files ---------------- */

const MIME = {
  '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff',
  '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8',
  '.json': 'application/json', '.pdf': 'application/pdf', '.webmanifest': 'application/manifest+json'
};

function serveStatic(req, res, pathname) {
  const safe = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  const file = path.join(PUBLIC, safe);
  if (!file.startsWith(PUBLIC)) return false;
  let target = file;
  if (!fs.existsSync(target) || fs.statSync(target).isDirectory()) {
    if (fs.existsSync(target + '.html')) target += '.html';
    else if (fs.existsSync(path.join(target, 'index.html'))) target = path.join(target, 'index.html');
    else return false;
  }
  const ext = path.extname(target).toLowerCase();
  const stream = fs.createReadStream(target);
  res.writeHead(200, {
    'Content-Type': MIME[ext] || 'application/octet-stream',
    'Cache-Control': ext === '.css' || ext === '.js' ? 'public, max-age=3600' : 'public, max-age=86400'
  });
  stream.pipe(res);
  stream.on('error', () => { try { res.end(); } catch (_) {} });
  return true;
}

/* ---------------- router ---------------- */

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  const pathname = decodeURIComponent(url.pathname).replace(/\/+$/, '') || '/';
  const method = req.method;
  const settings = store.getSettings();

  try {
    /* ---------- API ---------- */
    if (pathname.startsWith('/api/')) return await api(req, res, pathname, settings);

    /* ---------- admin ---------- */
    if (pathname === '/admin' || pathname.startsWith('/admin/')) return admin(req, res, pathname, settings);

    /* ---------- sitemap / robots ---------- */
    if (pathname === '/sitemap.xml') return sitemap(res);
    if (pathname === '/robots.txt') {
      return send(res, 200, 'User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: ' + layout.SITE_ORIGIN + '/sitemap.xml\n',
        { 'Content-Type': 'text/plain; charset=utf-8' });
    }

    /* ---------- static ---------- */
    if (method === 'GET' && pathname.startsWith('/assets/')) {
      if (serveStatic(req, res, pathname)) return;
    }

    /* ---------- pages ---------- */
    if (method !== 'GET') return send(res, 405, 'Method not allowed');

    let m;
    if (pathname === '/') return html(res, pages.intro(settings), settings);
    if (pathname === '/home') return html(res, pages.mainHome(settings), settings);
    if (pathname === '/practice-areas') return html(res, pages2.practiceHub(settings), settings);
    if (m = pathname.match(/^\/practice-areas\/([a-z0-9-]+)$/)) {
      const a = R.byId(m[1]);
      return a ? html(res, pages2.practice(settings, a), settings) : notFound(res, settings);
    }
    if (pathname === '/attorneys') return html(res, pages2.attorneyIndex(settings), settings);
    if (m = pathname.match(/^\/attorneys\/([a-z0-9-]+)$/)) {
      const a = R.attorneys().filter(x => x.id === m[1])[0];
      return a ? html(res, pages2.attorneyProfile(settings, a), settings) : notFound(res, settings);
    }
    if (pathname === '/coverage') return html(res, pages2.coverage(settings), settings);
    if (m = pathname.match(/^\/coverage\/([a-z]{2})$/)) {
      const st = R.states.filter(x => x.code.toLowerCase() === m[1])[0];
      return st ? html(res, pages2.statePage(settings, st), settings) : notFound(res, settings);
    }
    if (pathname === '/pricing') return html(res, pages3.pricing(settings), settings);
    if (pathname === '/book') return html(res, pages3.booking(settings, url.searchParams), settings);
    if (pathname === '/booked') {
      const id = url.searchParams.get('ref');
      const appt = id ? store.find('appointments', id) : null;
      return appt ? html(res, pages3.booked(settings, appt), settings) : redirect(res, '/book');
    }
    if (pathname === '/cyber-law-center') return html(res, pages4.cyberCenter(settings), settings);
    if (pathname === '/outcomes') return html(res, pages4.outcomes(settings), settings);
    if (pathname === '/contact') return html(res, pages4.contact(settings), settings);
    if (pathname === '/faq') return html(res, pages4.faq(settings), settings);
    if (pathname === '/disclaimer') return html(res, pages4.disclaimer(settings), settings);
    if (pathname === '/privacy') return html(res, pages4.privacy(settings), settings);
    if (pathname === '/thanks') return html(res, pages4.thanks(settings), settings);

    return notFound(res, settings);
  } catch (e) {
    console.error('[server]', method, pathname, e);
    try {
      send(res, 500, '<h1>Something went wrong</h1><p>The error has been logged. Please call ' + settings.phone + '.</p>');
    } catch (_) {}
  }
});

function notFound(res, settings) {
  send(res, 404, layout.layout(Object.assign({}, pages4.notFound(settings), { settings })));
}

/* ---------------- API endpoints ---------------- */

async function api(req, res, pathname, settings) {
  const meta = clientMeta(req);

  if (pathname === '/api/contact' && req.method === 'POST') {
    const f = parseForm(await readBody(req));
    if (!f.name || !f.email || !f.phone) return redirect(res, '/contact');
    const lead = store.add('contacts', {
      kind: 'contact', name: clean(f.name, 120), phone: clean(f.phone, 40),
      email: clean(f.email, 160), practiceArea: clean(f.practiceArea, 60),
      details: clean(f.details, 5000), status: 'new'
    }, meta);
    await dispatchLead(lead);
    return redirect(res, '/thanks');
  }

  if (pathname === '/api/cyber-emergency' && req.method === 'POST') {
    const f = parseForm(await readBody(req));
    if (!f.email || !f.phone) return redirect(res, '/cyber-law-center');
    const lead = store.add('leads', {
      kind: 'emergency', name: clean(f.name, 120), phone: clean(f.phone, 40),
      email: clean(f.email, 160), incident: clean(f.incident, 40),
      when: clean(f.when, 40), amount: clean(f.amount, 40),
      details: clean(f.details, 5000), urgency: 'emergency', status: 'new'
    }, meta);
    await dispatchLead(lead);
    return redirect(res, '/thanks?emergency=1');
  }

  if (pathname === '/api/book' && req.method === 'POST') {
    const f = parseForm(await readBody(req));
    if (!f.name || !f.email || !f.phone || !f.date || !f.time) return redirect(res, '/book');
    const area = R.byId(f.practiceArea);
    const att = R.attorneys().filter(a => a.id === f.attorney)[0];
    const appt = store.add('appointments', {
      kind: 'appointment', name: clean(f.name, 120), phone: clean(f.phone, 40),
      email: clean(f.email, 160), practiceArea: area ? area.name : clean(f.practiceArea, 60),
      state: clean(f.state, 30), urgency: clean(f.urgency, 20),
      attorney: att ? att.name : 'No preference', format: clean(f.format, 20) || 'phone',
      date: clean(f.date, 10), time: clean(f.time, 5),
      details: clean(f.details, 5000), source: clean(f.source, 60),
      status: 'confirmed'
    }, meta);
    appt.appointment = appt.date + ' at ' + appt.time + ' Eastern';
    await dispatchLead(appt);
    return redirect(res, '/booked?ref=' + encodeURIComponent(appt.id));
  }

  return json(res, 404, { error: 'not found' });
}

/* ---------------- admin ---------------- */

function admin(req, res, pathname, settings) {
  const cookies = parseCookies(req);

  /* login page */
  if (pathname === '/admin' && !checkSession(req)) {
    return send(res, 200, adminLoginHtml());
  }
  if (pathname === '/admin/login' && req.method === 'POST') {
    return readBody(req).then(raw => {
      const f = parseForm(raw);
      if (f.pass !== ADMIN_PASS) {
        store.audit('anonymous', 'admin-login-failed', 'bad password');
        return send(res, 200, adminLoginHtml('Incorrect password.'));
      }
      const token = newSession();
      store.audit('admin', 'admin-login', 'ok');
      return send(res, 302, '', {
        Location: '/admin',
        'Set-Cookie': 'oak_admin=' + token + '; HttpOnly; Path=/; SameSite=Lax; Max-Age=28800'
      });
    });
  }
  if (pathname === '/admin/logout') {
    const token = (cookies.oak_admin || '').trim();
    if (token) SESSIONS.delete(token);
    return send(res, 302, '', { Location: '/admin', 'Set-Cookie': 'oak_admin=; HttpOnly; Path=/; Max-Age=0' });
  }
  if (!checkSession(req)) return send(res, 302, '', { Location: '/admin' });

  /* admin pages */
  if (pathname === '/admin') return send(res, 200, adminDashboardHtml(settings));
  if (pathname === '/admin/settings' && req.method === 'POST') {
    return readBody(req).then(raw => {
      const f = parseForm(raw);
      const patch = {};
      ['firmName', 'phone', 'phoneEmergency', 'whatsapp', 'email', 'emailAlerts', 'address', 'city',
       'stateCode', 'zip', 'hours', 'tiktok', 'instagram', 'linkedin', 'facebook', 'youtube', 'x',
       'bookingSlots', 'consultingFee', 'announcement', 'gaId'].forEach(k => {
        if (k in f) patch[k] = clean(f[k], 300);
      });
      patch.announcementOn = f.announcementOn === 'on';
      patch.recaptchaOn = f.recaptchaOn === 'on';
      store.setSettings(patch);
      store.audit('admin', 'settings-update', Object.keys(patch).join(','));
      return send(res, 302, '', { Location: '/admin?saved=settings' });
    });
  }
  if (pathname === '/admin/lead-status' && req.method === 'POST') {
    return readBody(req).then(raw => {
      const f = parseForm(raw);
      const coll = f.coll === 'appointments' ? 'appointments' : f.coll === 'contacts' ? 'contacts' : 'leads';
      store.update(coll, f.id, { status: clean(f.status, 30) });
      store.audit('admin', 'lead-status', coll + ':' + f.id + ' -> ' + f.status);
      return send(res, 302, '', { Location: '/admin#leads' });
    });
  }
  if (pathname === '/admin/delete' && req.method === 'POST') {
    return readBody(req).then(raw => {
      const f = parseForm(raw);
      const coll = f.coll === 'appointments' ? 'appointments' : f.coll === 'contacts' ? 'contacts' : 'leads';
      store.remove(coll, f.id);
      store.audit('admin', 'lead-delete', coll + ':' + f.id);
      return send(res, 302, '', { Location: '/admin' });
    });
  }
  if (pathname === '/admin/test-mail' && req.method === 'POST') {
    return readBody(req).then(async () => {
      const to = settings.emailAlerts || settings.email;
      store.audit('admin', 'test-mail', 'to=' + to);
      const out = await mail.sendMail({
        host: process.env.SMTP_HOST, port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER, pass: process.env.SMTP_PASS,
        from: process.env.SMTP_FROM || settings.email,
        to,
        subject: 'Oakstone test email - delivery is working',
        text: 'This is a test from the Oakstone admin panel. If you are reading this, lead and booking ' +
              'emails will reach you at ' + to + '. Sent ' + new Date().toString() + '.'
      });
      const result = out && out.skipped
        ? 'NOT SENT - SMTP not configured yet. Fill in SMTP_HOST, SMTP_USER and SMTP_PASS, then try again.'
        : out && out.ok
          ? 'SENT to ' + to + '. Check that inbox, including the spam folder the first time.'
          : 'FAILED - ' + ((out && out.reason) || 'the mail server refused the message') + '. Check the SMTP values and try again.';
      store.audit('admin', 'test-mail', result);
      return send(res, 302, '', { Location: '/admin#mail' });
    });
  }
  if (pathname === '/admin/backup.json') {
    store.audit('admin', 'backup', 'full export');
    const dump = {
      exportedAt: new Date().toISOString(),
      settings: store.getSettings(),
      leads: store.list('leads'),
      appointments: store.list('appointments'),
      contacts: store.list('contacts'),
      audit: store.list('audit')
    };
    const stamp = new Date().toISOString().slice(0, 10);
    return send(res, 200, JSON.stringify(dump, null, 2), {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': 'attachment; filename="oakstone-backup-' + stamp + '.json"'
    });
  }
  if (pathname === '/admin/export.csv') {
    const rows = [['id', 'collection', 'kind', 'name', 'phone', 'email', 'practiceArea', 'state', 'urgency', 'appointment', 'details', 'ip', 'createdAt', 'status']];
    store.list('leads').forEach(x => rows.push([x.id, 'leads', x.kind, x.name, x.phone, x.email, x.incident || '', '', x.urgency || '', '', x.details || '', x.ip || '', x.createdAt, x.status || '']));
    store.list('appointments').forEach(x => rows.push([x.id, 'appointments', x.kind, x.name, x.phone, x.email, x.practiceArea || '', x.state || '', x.urgency || '', (x.date || '') + ' ' + (x.time || ''), x.details || '', x.ip || '', x.createdAt, x.status || '']));
    store.list('contacts').forEach(x => rows.push([x.id, 'contacts', x.kind, x.name, x.phone, x.email, x.practiceArea || '', '', '', '', x.details || '', x.ip || '', x.createdAt, x.status || '']));
    const csv = rows.map(r => r.map(c => '"' + String(c === undefined || c === null ? '' : c).replace(/"/g, '""') + '"').join(',')).join('\n');
    return send(res, 200, csv, {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="oakstone-leads.csv"'
    });
  }
  return send(res, 404, 'Not found');
}

/* ---------------- admin HTML ---------------- */

function adminLoginHtml(msg) {
  return layout.layout({
    settings: store.getSettings(), noindex: true,
    title: 'Admin | Oakstone Legal Group',
    body: '<div class="login"><div class="login__card">' +
      '<span class="eyebrow">Oakstone Command</span>' +
      '<h1 class="mt3" style="font-size:1.5rem">Sign in</h1>' +
      (msg ? '<div class="notice notice--alert mt4">' + msg + '</div>' : '') +
      '<form method="post" action="/admin/login" class="mt5">' +
        '<div class="form-row"><label for="pass">Password</label>' +
        '<input class="field" type="password" id="pass" name="pass" required autofocus></div>' +
        '<button class="btn btn--ink btn--block btn--lg" type="submit">Sign in</button>' +
      '</form>' +
      '<p class="tiny muted mt5">Sessions expire after 8 hours. Set ADMIN_PASS as an environment variable before deploying.</p>' +
    '</div></div>'
  });
}

function adminDashboardHtml(settings) {
  const leads = store.list('leads');
  const appts = store.list('appointments');
  const contacts = store.list('contacts');
  const all = leads.concat(appts, contacts).sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  const esc = R.esc;
  /* Mail is ready when the five SMTP values are present. Surfaced in the panel
     so the client can tell at a glance whether leads are being emailed. */
  const mailReady = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
  const mailNotice = mailReady
    ? '<div class="panel" style="border-left:3px solid #15803d"><div class="panel__b small"><strong>Email delivery is live.</strong> New inquiries are emailed to ' + esc(settings.emailAlerts || settings.email) + '.</div></div>'
    : '<div class="panel" style="border-left:3px solid var(--ox)"><div class="panel__b small"><strong>Email is not switching on yet.</strong> Inquiries are still saved in the table below and downloadable as a spreadsheet, but no email is sent. Open <a href="#mail">Email delivery</a> at the bottom of this page to finish the five SMTP settings.</div></div>';
  const kpi = (v, l) => '<div class="kpi"><div class="kpi__v">' + v + '</div><div class="kpi__l">' + l + '</div></div>';
  const statusOpts = ['new', 'contacted', 'consulted', 'retained', 'declined', 'closed'];
  const leadRow = x =>
    '<tr><td class="mono tiny">' + esc(x.id) + '</td>' +
    '<td><strong>' + esc(x.name || '(none)') + '</strong><br><span class="tiny muted">' + esc(x.kind) + '</span></td>' +
    '<td><a href="tel:' + esc(String(x.phone || '').replace(/[^\d+]/g, '')) + '">' + esc(x.phone || '') + '</a><br>' +
      '<a href="mailto:' + esc(x.email || '') + '" class="tiny">' + esc(x.email || '') + '</a></td>' +
    '<td class="small">' + esc(x.practiceArea || x.incident || '') + (x.state ? '<br><span class="tiny muted">' + esc(x.state) + '</span>' : '') + '</td>' +
    '<td class="tiny muted">' + esc(x.appointment || (x.createdAt || '').slice(0, 16).replace('T', ' ')) + '</td>' +
    '<td><form method="post" action="/admin/lead-status" class="row" style="gap:.3rem;flex-wrap:nowrap">' +
      '<input type="hidden" name="coll" value="' + esc(x._coll || '') + '">' +
      '<input type="hidden" name="id" value="' + esc(x.id) + '">' +
      '<select name="status" class="field" style="padding:.3rem .4rem;font-size:.78rem;width:auto">' +
      statusOpts.map(s => '<option' + (s === (x.status || 'new') ? ' selected' : '') + '>' + s + '</option>').join('') +
      '</select><button class="btn btn--ghost btn--sm" type="submit">Save</button></form>' +
      '<form method="post" action="/admin/delete" class="mt2"><input type="hidden" name="coll" value="' + esc(x._coll || '') + '">' +
      '<input type="hidden" name="id" value="' + esc(x.id) + '">' +
      '<button class="btn btn--sm" style="color:var(--alert)" type="submit">Delete</button></form></td></tr>';

  const field = (label, name, value, type) =>
    '<div class="form-row"><label for="f-' + name + '">' + label + '</label>' +
    '<input class="field" id="f-' + name + '" name="' + name + '" type="' + (type || 'text') + '" value="' + esc(value === undefined ? '' : value) + '"></div>';

  return layout.layout({
    settings, noindex: true,
    title: 'Dashboard | Oakstone Admin',
    bodyClass: 'admin',
    body:
      '<div class="admin__top"><div class="brand">' + layout.brand() + '</div>' +
        '<div class="row" style="gap:.6rem"><span class="tag tag--dark">Admin</span>' +
        '<a class="btn btn--ghostlight btn--sm" href="/home" target="_blank">View site</a>' +
        '<a class="btn btn--sm" style="background:rgba(241,245,249,.1);color:var(--bone)" href="/admin/logout">Sign out</a></div></div>' +
      '<div class="admin__wrap">' +
        '<aside class="admin__side"><nav class="admin__nav">' +
          '<a href="#leads" class="is-active">Leads and bookings</a>' +
          '<a href="#settings">Contact and social</a>' +
          '<a href="#booking">Booking</a>' +
          '<a href="#audit">Audit log</a>' +
          '<a href="#mail">Email delivery</a>' +
          '<a href="/admin/export.csv">Export CSV</a>' +
          '<a href="/admin/backup.json">Download full backup</a>' +
        '</nav></aside>' +
        '<main class="admin__main">' +
          mailNotice +
          '<div class="kpis">' +
            kpi(all.length, 'Total inquiries') +
            kpi(all.filter(x => (x.status || 'new') === 'new').length, 'New, not yet contacted') +
            kpi(appts.length, 'Booked consultations') +
            kpi(all.filter(x => x.urgency === 'emergency').length, 'Emergency intakes') +
          '</div>' +

          '<div class="panel" id="leads"><div class="panel__h"><h2>Inquiries, bookings and messages</h2>' +
            '<a class="btn btn--ghost btn--sm" href="/admin/export.csv">Export CSV</a></div>' +
            '<div class="tbl-scroll">' +
            (all.length ? '<table class="tbl"><thead><tr><th>Ref</th><th>Contact</th><th>Phone / email</th><th>Matter</th><th>When</th><th>Status</th></tr></thead><tbody>' +
              all.map(x => { x._coll = leads.includes(x) ? 'leads' : appts.includes(x) ? 'appointments' : 'contacts'; return leadRow(x); }).join('') + '</tbody></table>'
              : '<div class="panel__b muted small">No inquiries yet. Submissions from the site appear here with the sender IP and user agent.</div>') +
            '</div></div>' +

          '<form method="post" action="/admin/settings" id="settings"><div class="panel">' +
            '<div class="panel__h"><h2>Firm contact details</h2><button class="btn btn--primary btn--sm" type="submit">Save changes</button></div>' +
            '<div class="panel__b"><div class="form-grid">' +
              field('Firm name', 'firmName', settings.firmName) +
              field('Main phone', 'phone', settings.phone) +
              field('Emergency phone', 'phoneEmergency', settings.phoneEmergency) +
              field('WhatsApp number (digits only)', 'whatsapp', settings.whatsapp) +
              field('Public email', 'email', settings.email, 'email') +
              field('Internal alert email', 'emailAlerts', settings.emailAlerts, 'email') +
              field('Street address', 'address', settings.address) +
              field('City', 'city', settings.city) +
              field('State code', 'stateCode', settings.stateCode) +
              field('ZIP', 'zip', settings.zip) +
              '<div class="form-row full"><label for="f-hours">Hours</label>' +
                '<input class="field" id="f-hours" name="hours" value="' + esc(settings.hours) + '"></div>' +
            '</div></div></div>' +

            '<div class="panel"><div class="panel__h"><h2>Social profiles</h2></div><div class="panel__b"><div class="form-grid">' +
              field('TikTok URL', 'tiktok', settings.tiktok, 'url') +
              field('Instagram URL', 'instagram', settings.instagram, 'url') +
              field('LinkedIn URL', 'linkedin', settings.linkedin, 'url') +
              field('Facebook URL', 'facebook', settings.facebook, 'url') +
              field('YouTube URL', 'youtube', settings.youtube, 'url') +
              field('X (Twitter) URL', 'x', settings.x, 'url') +
            '</div></div></div>' +

            '<div class="panel" id="booking"><div class="panel__h"><h2>Booking and announcements</h2></div><div class="panel__b"><div class="form-grid">' +
              '<div class="form-row full"><label for="f-slots">Bookable time slots (comma separated, Eastern)</label>' +
                '<input class="field" id="f-slots" name="bookingSlots" value="' + esc(settings.bookingSlots) + '"></div>' +
              '<div class="form-row full"><label for="f-announce">Site announcement bar</label>' +
                '<input class="field" id="f-announce" name="announcement" value="' + esc(settings.announcement) + '"></div>' +
              '<div class="form-row"><label style="display:flex;gap:.5rem;align-items:center;text-transform:none;letter-spacing:0;font-size:.9rem">' +
                '<input type="checkbox" name="announcementOn"' + (settings.announcementOn ? ' checked' : '') + '> Show announcement bar</label></div>' +
              field('Google Analytics ID', 'gaId', settings.gaId) +
            '</div></div></div>' +
          '</form>' +

          '<div class="panel" id="audit"><div class="panel__h"><h2>Audit log</h2><span class="tiny muted">Last 30 events</span></div>' +
            '<div class="panel__b tbl-scroll"><table class="tbl"><thead><tr><th>When</th><th>Actor</th><th>Action</th><th>Detail</th></tr></thead><tbody>' +
            store.list('audit').slice(0, 30).map(a =>
              '<tr><td class="tiny mono">' + esc((a.at || '').slice(0, 19).replace('T', ' ')) + '</td>' +
              '<td class="small">' + esc(a.actor) + '</td><td class="small">' + esc(a.action) + '</td>' +
              '<td class="tiny muted mono">' + esc(a.detail) + '</td></tr>').join('') +
            '</tbody></table></div></div>' +

          '<div class="panel" id="mail"><div class="panel__h"><h2>Email delivery</h2>' +
            '<form method="post" action="/admin/test-mail" style="display:inline">' +
            '<button class="btn btn--ghost btn--sm" type="submit">Send test email</button></form></div><div class="panel__b">' +
            (mailReady
              ? '<p class="small" style="color:var(--ok,#15803d);font-weight:600">Mail is live. Every inquiry is emailed to <strong>' + esc(settings.emailAlerts || settings.email) + '</strong> and every booking also sends the client a confirmation with a calendar invite attached.</p>'
              : '<p class="small" style="color:var(--ox)"><strong>Mail is not sending yet.</strong> Form submissions are still saved here in the admin panel and nothing is lost, but no email goes out. Fill in the five SMTP settings below to switch it on.</p>') +
            '<div class="tbl-scroll mt4"><table class="tbl"><thead><tr><th>Setting</th><th>Status</th><th>What it does</th></tr></thead><tbody>' +
              [['SMTP_HOST', 'Your mail server, e.g. smtp.gmail.com or smtp.zoho.com'],
               ['SMTP_PORT', '587 for TLS (most common) or 465 for SSL'],
               ['SMTP_USER', 'The full email address you send from'],
               ['SMTP_PASS', 'An app password, not your normal login password'],
               ['SMTP_FROM', 'The From line, e.g. Oakstone Legal Group <intake@yourdomain.com>'],
               ['ADMIN_PASS', 'The password for this admin panel']].map(v =>
                '<tr><td class="mono">' + v[0] + '</td><td class="small ' + (process.env[v[0]] ? '' : 'ox') + '">' +
                (process.env[v[0]] ? 'configured' : 'not set') + '</td><td class="tiny muted">' + v[1] + '</td></tr>').join('') +
            '</tbody></table></div>' +
            '<p class="tiny muted mt4">Where leads go: every submission is written to the table at the top of this page and can be downloaded as a spreadsheet with <strong>Export CSV</strong>. Once SMTP is set, the same submission also arrives by email. Gmail, Outlook, Zoho, Fastmail and most hosts all work &mdash; only these five values are needed.</p>' +
          '</div></div>' +
        '</main>' +
      '</div>'
  });
}

/* ---------------- sitemap ---------------- */

function sitemap(res) {
  const O = layout.SITE_ORIGIN;
  const urls = ['/', '/home', '/practice-areas', '/attorneys', '/coverage', '/pricing', '/book', '/cyber-law-center',
    '/contact', '/faq', '/disclaimer', '/privacy'];
  R.areas.forEach(a => urls.push('/practice-areas/' + a.id));
  R.attorneys().forEach(a => urls.push('/attorneys/' + a.id));
  R.states.forEach(s => urls.push('/coverage/' + s.code.toLowerCase()));
  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map(u => '  <url><loc>' + O + u + '</loc></url>').join('\n') + '\n</urlset>';
  send(res, 200, xml, { 'Content-Type': 'application/xml; charset=utf-8' });
}

/* ---------------- boot ---------------- */

if (require.main === module) {
  server.listen(PORT, () => {
    console.log('Oakstone Legal Group serving on http://localhost:' + PORT);
    console.log('Admin panel: http://localhost:' + PORT + '/admin  (password: ADMIN_PASS env, default "OANKS123456789")');
    console.log('SMTP: ' + (process.env.SMTP_HOST ? process.env.SMTP_HOST : 'not configured - mail will be skipped, not lost'));
  });
}

module.exports = { server, dispatchLead, parseForm, clientMeta };
