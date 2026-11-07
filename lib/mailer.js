'use strict';
/**
 * Oakstone — zero-dependency mailer + iCalendar builder.
 * Speaks SMTP directly over net/tls. No nodemailer, no npm.
 *
 * Design rule: if SMTP is not configured, sendMail does NOT throw. It returns
 * { ok:false, skipped:true, preview:<mime> } so the whole site runs in
 * development with no mail server, and the MIME output can be inspected.
 */
const net = require('net');
const tls = require('tls');
const os = require('os');
const crypto = require('crypto');

const CRLF = '\r\n';

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

function formatAddress(input) {
  if (!input) return { name: '', email: '' };
  const s = String(input).trim();
  const m = s.match(/^(.*?)<([^>]+)>\s*$/);
  if (m) {
    let name = m[1].trim().replace(/^["']|["']$/g, '');
    return { name, email: m[2].trim() };
  }
  return { name: '', email: s };
}

function assertNoInjection(value, label) {
  if (value === undefined || value === null) return;
  if (/[\r\n]/.test(String(value))) {
    throw new Error('Header injection blocked in ' + (label || 'header') + ' value');
  }
}

function needsEncoding(s) {
  return /[^\x20-\x7E]/.test(String(s || ''));
}

function encodeWord(s) {
  if (!needsEncoding(s)) return String(s);
  return '=?UTF-8?B?' + Buffer.from(String(s), 'utf8').toString('base64') + '?=';
}

/** RFC 2047 encodes the display name only, leaving the address intact. */
function renderAddress(input) {
  const a = formatAddress(input);
  assertNoInjection(a.email, 'address');
  if (!a.name) return a.email;
  assertNoInjection(a.name, 'display name');
  // Quote when the name contains specials; encode when non-ASCII.
  if (needsEncoding(a.name)) return encodeWord(a.name) + ' <' + a.email + '>';
  if (/[",;:<>@\\\[\]]/.test(a.name)) return '"' + a.name.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '" <' + a.email + '>';
  return a.name + ' <' + a.email + '>';
}

function renderList(input) {
  if (!input) return '';
  const arr = Array.isArray(input) ? input : [input];
  return arr.filter(Boolean).map(renderAddress).join(', ');
}

function rfc2822Date(d) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dt = d || new Date();
  const off = -dt.getTimezoneOffset();
  const sign = off >= 0 ? '+' : '-';
  const oh = String(Math.floor(Math.abs(off) / 60)).padStart(2, '0');
  const om = String(Math.abs(off) % 60).padStart(2, '0');
  return days[dt.getDay()] + ', ' + String(dt.getDate()).padStart(2, '0') + ' ' +
    months[dt.getMonth()] + ' ' + dt.getFullYear() + ' ' +
    String(dt.getHours()).padStart(2, '0') + ':' +
    String(dt.getMinutes()).padStart(2, '0') + ':' +
    String(dt.getSeconds()).padStart(2, '0') + ' ' + sign + oh + om;
}

/** Folds a header at 78 chars, continuation lines begin with a single space. */
function foldHeader(name, value) {
  const line = name + ': ' + value;
  if (line.length <= 78) return line;
  const parts = String(value).split(/([;,]\s)/);
  const out = [name + ':'];
  let cur = '';
  parts.forEach(p => {
    if ((out[out.length - 1] + ' ' + cur + p).length > 76 && cur) {
      out[out.length - 1] += ' ' + cur.replace(/\s+$/, '');
      cur = p;
    } else {
      cur += p;
    }
  });
  if (cur) out.push(' ' + cur.trim());
  return out.join(CRLF).replace(/^(\S+):\s+/, '$1: ');
}

function wrap76(b64) {
  return String(b64).replace(/(.{76})/g, '$1' + CRLF).replace(/(\r\n)+$/, '');
}

class MimeBuilder {
  constructor() { this.headers = []; this.body = ''; this.subtype = 'alternative'; }
  header(name, value) {
    if (value === undefined || value === null || value === '') return this;
    this.headers.push({ name, value: String(value) });
    return this;
  }
  renderHeaders() {
    return this.headers.map(h => foldHeader(h.name, h.value)).join(CRLF);
  }
}

function boundary() {
  // Kept short (16 hex chars) so the Content-Type header stays under the
  // 78-char fold threshold and is not split across lines.
  return '----=_Oak_' + crypto.randomBytes(8).toString('hex');
}

/* ------------------------------------------------------------------ */
/* buildMime                                                           */
/* ------------------------------------------------------------------ */

function buildMime(o) {
  o = o || {};

  assertNoInjection(o.subject, 'subject');
  ['from', 'replyTo'].forEach(k => { if (o[k]) assertNoInjection(o[k], k); });
  [].concat(o.to || []).concat(o.cc || []).concat(o.bcc || []).forEach(a => assertNoInjection(a, 'recipient'));

  const b = new MimeBuilder();
  const messageId = '<' + crypto.randomBytes(16).toString('hex') + '@' +
    (formatAddress(o.from || 'no-reply@localhost').email.split('@')[1] || 'localhost') + '>';

  b.header('Date', rfc2822Date(o.date ? new Date(o.date) : new Date()));
  b.header('Message-ID', messageId);
  b.header('From', renderAddress(o.from || 'no-reply@localhost'));
  if (o.to) b.header('To', renderList(o.to));
  if (o.cc) b.header('Cc', renderList(o.cc));
  if (o.replyTo) b.header('Reply-To', renderAddress(o.replyTo));
  if (o.inReplyTo) { assertNoInjection(o.inReplyTo, 'inReplyTo'); b.header('In-Reply-To', o.inReplyTo); }
  if (o.references) { assertNoInjection(o.references, 'references'); b.header('References', o.references); }
  if (o.headers) Object.keys(o.headers).forEach(k => { assertNoInjection(o.headers[k], k); b.header(k, o.headers[k]); });
  b.header('Subject', encodeWord(o.subject || ''));
  b.header('MIME-Version', '1.0');
  b.header('X-Mailer', 'Oakstone Mailer');
  if (o.priority) b.header('X-Priority', String(o.priority));

  const hasAttach = Array.isArray(o.attachments) && o.attachments.length > 0;
  const hasBoth = !!(o.text && o.html);

  let body = '';

  if (hasBoth) {
    const ab = boundary();
    const inner = [];
    inner.push('--' + ab);
    inner.push('Content-Type: text/plain; charset="UTF-8"');
    inner.push('Content-Transfer-Encoding: base64');
    inner.push('');
    inner.push(wrap76(Buffer.from(o.text, 'utf8').toString('base64')));
    inner.push('--' + ab);
    inner.push('Content-Type: text/html; charset="UTF-8"');
    inner.push('Content-Transfer-Encoding: base64');
    inner.push('');
    inner.push(wrap76(Buffer.from(o.html, 'utf8').toString('base64')));
    inner.push('--' + ab + '--');
    body = inner.join(CRLF);
    b.subtype = 'alternative';
    b.header('Content-Type', 'multipart/alternative; boundary="' + ab + '"');
  } else {
    const isHtml = !!o.html;
    const text = isHtml ? o.html : (o.text || '');
    body = wrap76(Buffer.from(text, 'utf8').toString('base64'));
    b.header('Content-Type', 'text/' + (isHtml ? 'html' : 'plain') + '; charset="UTF-8"');
    b.header('Content-Transfer-Encoding', 'base64');
  }

  if (hasAttach) {
    const mb = boundary();
    const parts = [];
    parts.push('This is a multi-part message in MIME format.');
    parts.push('--' + mb);
    parts.push('Content-Type: multipart/alternative; boundary="' + b.boundaryOf() + '"');
    parts.push('');
    parts.push(body);
    o.attachments.forEach(att => {
      const content = Buffer.isBuffer(att.content) ? att.content : Buffer.from(String(att.content || ''), att.encoding === 'base64' ? 'base64' : 'utf8');
      const filename = att.filename || 'attachment';
      parts.push('--' + mb);
      parts.push('Content-Type: ' + (att.contentType || 'application/octet-stream') + '; name="' + filename.replace(/"/g, '') + '"');
      parts.push('Content-Transfer-Encoding: base64');
      parts.push('Content-Disposition: ' + (att.inline ? 'inline' : 'attachment') + '; filename="' + filename.replace(/"/g, '') + '"');
      parts.push('');
      parts.push(wrap76(content.toString('base64')));
    });
    parts.push('--' + mb + '--');
    // Rewrite the top-level content-type to mixed.
    b.headers = b.headers.filter(h => h.name !== 'Content-Type');
    b.header('Content-Type', 'multipart/mixed; boundary="' + mb + '"');
    body = parts.filter(p => p !== null).join(CRLF);
  }

  return b.renderHeaders() + CRLF + CRLF + body + CRLF;
}

// small shim so the mixed branch can reference the alternative boundary
MimeBuilder.prototype.boundaryOf = function () {
  const ct = this.headers.filter(h => h.name === 'Content-Type')[0];
  if (!ct) return '';
  const m = String(ct.value).match(/boundary="([^"]+)"/);
  return m ? m[1] : '';
};

/* ------------------------------------------------------------------ */
/* buildIcs                                                            */
/* ------------------------------------------------------------------ */

function icsEscape(v) {
  return String(v === undefined || v === null ? '' : v)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r\n|\r|\n/g, '\\n');
}

function icsDate(d) {
  const dt = d instanceof Date ? d : new Date(d);
  return dt.getUTCFullYear() +
    String(dt.getUTCMonth() + 1).padStart(2, '0') +
    String(dt.getUTCDate()).padStart(2, '0') + 'T' +
    String(dt.getUTCHours()).padStart(2, '0') +
    String(dt.getUTCMinutes()).padStart(2, '0') +
    String(dt.getUTCSeconds()).padStart(2, '0') + 'Z';
}

/** Folds at 75 OCTETS per RFC 5545. Continuation lines start with one space. */
function foldIcsLine(line) {
  const buf = Buffer.from(line, 'utf8');
  if (buf.length <= 75) return line;
  const out = [];
  let start = 0;
  let first = true;
  while (start < buf.length) {
    const limit = first ? 75 : 74;
    let end = Math.min(start + limit, buf.length);
    // do not split a multi-byte character
    while (end > start && end < buf.length && (buf[end] & 0xc0) === 0x80) end--;
    const chunk = buf.slice(start, end).toString('utf8');
    out.push(first ? chunk : ' ' + chunk);
    first = false;
    start = end;
  }
  return out.join(CRLF);
}

function buildIcs(o) {
  o = o || {};
  const uid = o.uid || crypto.randomBytes(12).toString('hex') + '@oakstonelegal.com';
  const start = o.start instanceof Date ? o.start : new Date(o.start);
  const end = o.end instanceof Date ? o.end : new Date(o.end || new Date(start.getTime() + 3600000));
  const lines = [];

  lines.push('BEGIN:VCALENDAR');
  lines.push('VERSION:2.0');
  lines.push('PRODID:-//Oakstone Legal Group//Booking//EN');
  lines.push('CALSCALE:GREGORIAN');
  lines.push('METHOD:REQUEST');
  lines.push('BEGIN:VEVENT');
  lines.push('UID:' + uid);
  lines.push('DTSTAMP:' + icsDate(new Date()));
  lines.push('DTSTART:' + icsDate(start));
  lines.push('DTEND:' + icsDate(end));
  lines.push('SUMMARY:' + icsEscape(o.summary || 'Consultation'));
  if (o.description) lines.push('DESCRIPTION:' + icsEscape(o.description));
  if (o.location) lines.push('LOCATION:' + icsEscape(o.location));
  lines.push('STATUS:CONFIRMED');
  lines.push('SEQUENCE:0');
  if (o.organizer) lines.push('ORGANIZER;CN=' + icsEscape(o.organizerName || 'Oakstone Legal Group') + ':mailto:' + o.organizer);
  if (o.attendee) lines.push('ATTENDEE;CN=' + icsEscape(o.attendeeName || o.attendee) + ';ROLE=REQ-PARTICIPANT;RSVP=TRUE:mailto:' + o.attendee);
  lines.push('BEGIN:VALARM');
  lines.push('TRIGGER:-PT60M');
  lines.push('ACTION:DISPLAY');
  lines.push('DESCRIPTION:' + icsEscape('Reminder: ' + (o.summary || 'Consultation')));
  lines.push('END:VALARM');
  lines.push('END:VEVENT');
  lines.push('END:VCALENDAR');

  return lines.map(foldIcsLine).join(CRLF) + CRLF;
}

/* ------------------------------------------------------------------ */
/* SMTP client                                                         */
/* ------------------------------------------------------------------ */

function isConfigured(o) {
  return !!(o && typeof o.host === 'string' && o.host.trim().length > 0);
}

function createSession(opts) {
  const secure = opts.secure === true || Number(opts.port) === 465;
  const port = Number(opts.port) || (secure ? 465 : 587);
  const timeout = Number(opts.timeout) || 20000;

  return new Promise((resolve, reject) => {
    let socket;
    let buffer = '';
    let queue = [];
    let settled = false;
    let capab = [];

    const done = (fn, arg) => { if (!settled) { settled = true; fn(arg); } };

    function fail(err) {
      try { socket && socket.destroy(); } catch (_) {}
      done(reject, err instanceof Error ? err : new Error(String(err)));
    }

    function onData(chunk) {
      buffer += chunk.toString('utf8');
      let idx;
      while ((idx = buffer.indexOf(CRLF)) !== -1) {
        const line = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 2);
        const m = line.match(/^(\d{3})([ -])(.*)$/);
        if (!m) continue;
        const code = Number(m[1]);
        const cont = m[2] === '-';
        if (!queue.length) continue;
        const cur = queue[0];
        cur.lines.push(line);
        if (!cont) {
          queue.shift();
          cur.resolve({ code, lines: cur.lines.slice(), text: cur.lines.slice().join('\n') });
        }
      }
    }

    function attach(s) {
      socket = s;
      socket.setTimeout(timeout);
      socket.on('data', onData);
      socket.on('error', fail);
      socket.on('timeout', () => fail(new Error('SMTP timeout after ' + timeout + 'ms')));
      socket.on('close', () => {
        if (!settled && queue.length) fail(new Error('SMTP connection closed unexpectedly'));
      });
    }

    function sendRaw(str) { socket.write(str); }

    function cmd(line) {
      return new Promise((res, rej) => {
        queue.push({ resolve: res, reject: rej, lines: [] });
        sendRaw(line + CRLF);
      });
    }

    function expect(res, ok, what) {
      if (ok.indexOf(res.code) === -1) {
        throw new Error('SMTP ' + what + ' failed: ' + res.code + ' ' + res.text);
      }
      return res;
    }

    if (secure) attach(tls.connect({ host: opts.host, port, servername: opts.host, rejectUnauthorized: opts.rejectUnauthorized !== false }));
    else attach(net.connect({ host: opts.host, port }));

    // 1. greeting
    new Promise((res, rej) => { queue.push({ resolve: res, reject: rej, lines: [] }); })
      .then(greet => {
        expect(greet, [220], 'greeting');
        const hostname = os.hostname() || 'oakstone.local';
        return cmd('EHLO ' + hostname);
      })
      .then(ehlo => {
        expect(ehlo, [250], 'EHLO');
        capab = ehlo.lines.slice(1).map(l => l.replace(/^250[ -]/, '').trim());
        const canStartTls = capab.some(c => /^STARTTLS/i.test(c));
        if (!secure && canStartTls) {
          return cmd('STARTTLS').then(r => {
            expect(r, [220], 'STARTTLS');
            return new Promise((res, rej) => {
              const upgraded = tls.connect({ socket, servername: opts.host, rejectUnauthorized: opts.rejectUnauthorized !== false }, () => res());
              upgraded.on('error', rej);
              socket.removeAllListeners('data');
              socket.removeAllListeners('error');
              socket.removeAllListeners('timeout');
              socket.removeAllListeners('close');
              attach(upgraded);
              upgraded.on('secureConnect', () => {});
            });
          }).then(() => cmd('EHLO ' + (os.hostname() || 'oakstone.local')))
            .then(r => { expect(r, [250], 'EHLO after STARTTLS'); capab = r.lines.slice(1).map(l => l.replace(/^250[ -]/, '').trim()); });
        }
        if (!secure && !canStartTls && (opts.user || opts.pass)) {
          throw new Error('SMTP server does not offer STARTTLS and credentials were supplied; refusing to send a password in plaintext');
        }
        return null;
      })
      .then(() => {
        if (!opts.user) return null;
        const canAuthLogin = capab.some(c => /AUTH/i.test(c) && /LOGIN/i.test(c));
        return cmd('AUTH LOGIN').then(r => {
          if (r.code !== 334) throw new Error('SMTP AUTH not accepted: ' + r.code + ' ' + r.text);
          return cmd(Buffer.from(opts.user, 'utf8').toString('base64'));
        }).then(r => {
          if (r.code !== 334) throw new Error('SMTP username rejected: ' + r.code + ' ' + r.text);
          return cmd(Buffer.from(opts.pass || '', 'utf8').toString('base64'));
        }).then(r => {
          if (r.code !== 235) throw new Error('SMTP authentication failed: ' + r.code + ' ' + r.text);
          return true;
        });
      })
      .then(() => ({
        cmd,
        expect,
        fail,
        sessionDone: done,
        getSocket: () => socket,
        capabilityList: capab,
        settle: (fn, a) => done(fn, a),
        /* Wait for the post-DATA reply, then stream the message and terminator. */
        dataReply: function (message) {
          return new Promise((res, rej) => {
            queue.push({ resolve: res, reject: rej, lines: [] });
            try {
              socket.write(message);
              socket.write(CRLF + '.' + CRLF);
            } catch (e) { rej(e); }
          });
        }
      }))
      .then(session => resolve({ session }))
      .catch(fail);
  });
}

/**
 * Opens a session, runs `fn(session)`, then QUITs. Used for both sendMail and verify.
 */
function withSession(opts, fn) {
  return createSession(opts).then(({ session }) => {
    return Promise.resolve(fn(session))
      .then(result => {
        return session.cmd('QUIT').catch(() => null).then(() => {
          try { session.getSocket().end(); } catch (_) {}
          return result;
        });
      })
      .catch(err => {
        try { session.getSocket().destroy(); } catch (_) {}
        throw err;
      });
  });
}

function sendMail(opts) {
  opts = opts || {};
  const built = buildMime({
    from: opts.from || opts.user,
    to: opts.to,
    cc: opts.cc,
    bcc: opts.bcc,
    subject: opts.subject,
    text: opts.text,
    html: opts.html,
    attachments: opts.attachments,
    replyTo: opts.replyTo,
    inReplyTo: opts.inReplyTo,
    references: opts.references,
    headers: opts.headers
  });

  if (!isConfigured(opts)) {
    return Promise.resolve({
      ok: false,
      skipped: true,
      reason: 'smtp-not-configured',
      preview: built
    });
  }

  const messageId = (built.match(/^Message-ID: (.+)$/m) || [])[1] || '';
  const envelopeFrom = formatAddress(opts.from || opts.user).email;
  const recipients = [].concat(opts.to || []).concat(opts.cc || []).concat(opts.bcc || [])
    .map(a => formatAddress(a).email).filter(Boolean);

  if (!envelopeFrom) return Promise.reject(new Error('No envelope sender set'));
  if (!recipients.length) return Promise.reject(new Error('No recipients set'));

  return withSession(opts, session => {
    return session.cmd('MAIL FROM:<' + envelopeFrom + '>')
      .then(r => { session.expect(r, [250], 'MAIL FROM'); return null; })
      .then(() => {
        // send RCPT sequentially to keep the reply parser simple
        return recipients.reduce((p, rcpt) => p.then(() => {
          return session.cmd('RCPT TO:<' + rcpt + '>').then(r => {
            if (r.code !== 250 && r.code !== 251) throw new Error('SMTP RCPT TO rejected for ' + rcpt + ': ' + r.code + ' ' + r.text);
            return null;
          });
        }), Promise.resolve());
      })
      .then(() => session.cmd('DATA'))
      .then(r => {
        session.expect(r, [354], 'DATA');
        return session.dataReply(built);
      })
      .then(r => {
        session.expect(r, [250], 'message body');
        return { ok: true, messageId, accepted: recipients, response: r.text };
      });
  });
}

function verifyConnection(opts) {
  opts = opts || {};
  if (!isConfigured(opts)) return Promise.resolve({ ok: false, error: 'smtp-not-configured' });
  return withSession(opts, session => {
    return Promise.resolve({ ok: true, capabilities: session.capabilityList });
  }).catch(err => ({ ok: false, error: err.message }));
}

module.exports = {
  sendMail,
  buildIcs,
  buildMime,
  formatAddress,
  verifyConnection,
  isConfigured,
  rfc2822Date,
  icsDate,
  foldIcsLine,
  icsEscape
};
