'use strict';
/** node tools/test-security.js - unit tests for lib/security.js and lib/channels.js */
const assert = require('assert');
const sec = require('../lib/security.js');
const ch = require('../lib/channels.js');

let n = 0;
function t(name, fn) { fn(); n++; console.log('ok - ' + name); }

t('rejects missing, short and published-default admin passwords', () => {
  assert.ok(sec.adminPasswordProblem(''));
  assert.ok(sec.adminPasswordProblem('short'));
  assert.ok(sec.adminPasswordProblem('OANKS123456789'));
  assert.strictEqual(sec.adminPasswordProblem('a-long-unique-passphrase'), '');
});
t('safeEqual compares correctly', () => {
  assert.ok(sec.safeEqual('abc', 'abc'));
  assert.ok(!sec.safeEqual('abc', 'abd'));
  assert.ok(!sec.safeEqual('abc', 'abcd'));
});
t('limiter blocks after max and recovers after the window', () => {
  const l = sec.createLimiter(2, 1000);
  assert.ok(l.take('a', 0)); assert.ok(l.take('a', 10)); assert.ok(!l.take('a', 20));
  assert.ok(l.take('b', 20));
  assert.ok(l.take('a', 1500));
  l.reset('a'); assert.ok(l.allowed('a', 1501));
});
t('sameOrigin accepts same host and rejects others, null and missing', () => {
  const mk = h => ({ headers: h });
  assert.ok(sec.sameOrigin(mk({ host: 'x.com', origin: 'https://x.com' })));
  assert.ok(sec.sameOrigin(mk({ host: 'x.com', referer: 'https://x.com/admin' })));
  assert.ok(!sec.sameOrigin(mk({ host: 'x.com', origin: 'https://evil.com' })));
  assert.ok(!sec.sameOrigin(mk({ host: 'x.com', origin: 'null' })));
  assert.ok(!sec.sameOrigin(mk({ host: 'x.com' })));
});
t('clientIp ignores X-Forwarded-For unless a proxy is trusted', () => {
  const req = { headers: { 'x-forwarded-for': '9.9.9.9, 1.1.1.1' }, socket: { remoteAddress: '5.5.5.5' } };
  assert.strictEqual(sec.clientIp(req, false), '5.5.5.5');
  assert.strictEqual(sec.clientIp(req, true), '9.9.9.9');
});
t('safeDecode returns null on malformed input instead of throwing', () => {
  assert.strictEqual(sec.safeDecode('%E0%A4%A'), null);
  assert.strictEqual(sec.safeDecode('a%20b'), 'a b');
});
t('validEmail', () => {
  assert.ok(sec.validEmail('a@b.co'));
  assert.ok(!sec.validEmail('a@b'));
  assert.ok(!sec.validEmail('a b@c.com'));
  assert.ok(!sec.validEmail('<x>@c.com'));
});
t('csvCell neutralises formulas and escapes quotes', () => {
  assert.strictEqual(sec.csvCell('=1+1'), '"\'=1+1"');
  assert.strictEqual(sec.csvCell('a"b'), '"a""b"');
  assert.strictEqual(sec.csvCell(null), '""');
});
t('optional channels default to hidden', () => {
  assert.strictEqual(ch.DEFAULT_FLAGS.show_instagram, false);
  assert.strictEqual(ch.DEFAULT_FLAGS.show_address, false);
  assert.strictEqual(ch.DEFAULT_FLAGS.show_phoneEmergency, false);
});
t('publicView hides optional channels and keeps the core five', () => {
  const s = Object.assign({ phone: '1', phoneEmergency: '2', email: 'e@x.co', whatsapp: '3', tiktok: 'tt', telegram: 'tgh',
    instagram: 'ig', linkedin: 'li', facebook: 'fb', youtube: 'yt', x: 'xx', address: 'A', zip: 'Z', city: 'C' }, ch.DEFAULT_FLAGS);
  const v = ch.publicView(s);
  assert.strictEqual(v.instagram, ''); assert.strictEqual(v.x, ''); assert.strictEqual(v.address, ''); assert.strictEqual(v.zip, '');
  assert.strictEqual(v.phoneEmergency, '1');
  assert.strictEqual(v.phone, '1'); assert.strictEqual(v.email, 'e@x.co'); assert.strictEqual(v.tiktok, 'tt'); assert.strictEqual(v.telegram, 'tgh');
  assert.strictEqual(v.city, 'C'); assert.strictEqual(v.showOffices, false);
  assert.deepStrictEqual(ch.socialLinks(v).map(l => l.key), ['tiktok', 'telegram']);
  assert.deepStrictEqual(ch.publicView(v), v);
});
t('switching a channel on shows it', () => {
  const s = Object.assign({ phone: '1', phoneEmergency: '2', instagram: 'https://i.co/x', address: 'A' }, ch.DEFAULT_FLAGS, { show_instagram: true, show_address: true, show_phoneEmergency: true });
  const v = ch.publicView(s);
  assert.strictEqual(v.instagram, 'https://i.co/x'); assert.strictEqual(v.address, 'A'); assert.strictEqual(v.phoneEmergency, '2'); assert.strictEqual(v.showOffices, true);
});
t('telegram handles and links normalise', () => {
  assert.strictEqual(ch.tg('@oak'), 'https://t.me/oak');
  assert.strictEqual(ch.tg('t.me/oak'), 'https://t.me/oak');
  assert.strictEqual(ch.tg('https://t.me/oak'), 'https://t.me/oak');
  assert.strictEqual(ch.tg(''), '');
});
console.log('\n' + n + ' tests passed');
