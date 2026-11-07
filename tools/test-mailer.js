'use strict';
/** Oakstone — mailer self-test. No framework. node tools/test-mailer.js */
const assert = require('assert');
const m = require('../lib/mailer.js');

let pass = 0, fail = 0;
function t(name, fn) {
  try { fn(); console.log('  PASS  ' + name); pass++; }
  catch (e) { console.log('  FAIL  ' + name + '\n          ' + e.message); fail++; }
}

console.log('Mailer test suite');
console.log('='.repeat(60));

t('buildIcs has required VEVENT structure', () => {
  const ics = m.buildIcs({
    start: new Date('2026-11-10T14:30:00Z'),
    end: new Date('2026-11-10T15:00:00Z'),
    summary: 'Consultation',
    organizer: 'intake@oakstonelegal.com',
    attendee: 'client@example.com'
  });
  ['BEGIN:VCALENDAR', 'END:VCALENDAR', 'BEGIN:VEVENT', 'END:VEVENT', 'METHOD:REQUEST']
    .forEach(k => assert(ics.indexOf(k) !== -1, 'missing ' + k));
});

t('buildIcs converts date to exact UTC basic format', () => {
  const ics = m.buildIcs({ start: new Date('2026-11-10T14:30:00Z'), end: new Date('2026-11-10T15:00:00Z'), summary: 'x' });
  assert(ics.indexOf('DTSTART:20261110T143000Z') !== -1, 'wrong DTSTART; got: ' + (ics.match(/DTSTART:.*/) || [''])[0]);
});

t('buildIcs folds every line to 75 octets or fewer', () => {
  const long = 'A'.repeat(400);
  const ics = m.buildIcs({ start: new Date(), end: new Date(Date.now() + 3600000), summary: long, description: long });
  const lines = ics.split('\r\n');
  const over = lines.filter(l => Buffer.byteLength(l, 'utf8') > 75);
  assert(over.length === 0, over.length + ' line(s) exceed 75 octets');
});

t('buildIcs escapes commas and semicolons in text', () => {
  const ics = m.buildIcs({ start: new Date(), end: new Date(Date.now() + 3600000), summary: 'Smith, Jones; LLP' });
  assert(ics.indexOf('Smith\\, Jones\\; LLP') !== -1, 'escape missing');
});

t('buildMime with text+html produces multipart/alternative', () => {
  const msg = m.buildMime({ from: 'a@x.com', to: 'b@y.com', subject: 'S', text: 'plain body', html: '<p>html body</p>' });
  assert(/Content-Type: multipart\/alternative; boundary=".+"/.test(msg), 'no alternative content-type');
  const b64 = Buffer.from('plain body').toString('base64');
  assert(msg.indexOf(b64) !== -1, 'plain part missing');
});

t('buildMime uses CRLF line endings only', () => {
  const msg = m.buildMime({ from: 'a@x.com', to: 'b@y.com', subject: 'S', text: 'body' });
  const headers = msg.split('\r\n\r\n')[0];
  assert(!/[^\r]\n/.test(headers), 'bare LF found in headers');
});

t('buildMime attachment produces multipart/mixed + base64 under 76 chars', () => {
  const msg = m.buildMime({
    from: 'a@x.com', to: 'b@y.com', subject: 'S', text: 'body',
    attachments: [{ filename: 'invite.ics', content: 'BEGIN:VCALENDAR\r\n'.repeat(30), contentType: 'text/calendar' }]
  });
  assert(/Content-Type: multipart\/mixed/.test(msg), 'no multipart/mixed');
  assert(/Content-Transfer-Encoding: base64/.test(msg), 'no base64 encoding');
  const over = msg.split('\r\n').filter(l => l.length > 76 && /^[A-Za-z0-9+/=]+$/.test(l));
  assert(over.length === 0, over.length + ' base64 line(s) exceed 76 chars');
});

t('buildMime blocks header injection in subject', () => {
  assert.throws(() => {
    m.buildMime({ from: 'a@x.com', to: 'x@y.com', subject: 'Hi\r\nBcc: evil@x.com', text: 'x' });
  }, /injection/i);
});

t('buildMime RFC2047 encodes non-ASCII subject', () => {
  const msg = m.buildMime({ from: 'a@x.com', to: 'b@y.com', subject: 'Café — £500', text: 'x' });
  assert(msg.indexOf('=?UTF-8?B?') !== -1, 'subject was not encoded');
});

t('sendMail without host skips rather than throwing', () => {
  return m.sendMail({ from: 'a@x.com', to: 'b@y.com', subject: 'S', text: 'body' }).then(r => {
    assert.strictEqual(r.ok, false, 'expected ok:false');
    assert.strictEqual(r.skipped, true, 'expected skipped:true');
    assert(r.preview && r.preview.indexOf('Subject:') !== -1, 'preview missing MIME');
  });
});

t('isConfigured reflects host presence', () => {
  assert.strictEqual(m.isConfigured({}), false);
  assert.strictEqual(m.isConfigured({ host: 'smtp.example.com' }), true);
});

t('formatAddress parses both forms', () => {
  const a = m.formatAddress('Jane Roe <jane@x.com>');
  assert.strictEqual(a.name, 'Jane Roe');
  assert.strictEqual(a.email, 'jane@x.com');
  const b = m.formatAddress('plain@x.com');
  assert.strictEqual(b.name, '');
  assert.strictEqual(b.email, 'plain@x.com');
});

/* ---- live SMTP, opt-in only ---- */
if (process.env.SMTP_TEST_HOST) {
  console.log('-'.repeat(60));
  m.verifyConnection({
    host: process.env.SMTP_TEST_HOST,
    port: process.env.SMTP_TEST_PORT,
    user: process.env.SMTP_TEST_USER,
    pass: process.env.SMTP_TEST_PASS
  }).then(r => {
    console.log(r.ok ? '  PASS  live SMTP handshake' : '  FAIL  live SMTP: ' + r.error);
    finish(r.ok ? 0 : 1);
  });
} else {
  console.log('-'.repeat(60));
  console.log('  SKIP (live SMTP)');
  finish(fail ? 1 : 0);
}

function finish(code) {
  console.log('='.repeat(60));
  console.log(pass + ' passed, ' + fail + ' failed');
  process.exit(code);
}
