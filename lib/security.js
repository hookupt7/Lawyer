'use strict';
/**
 * Oakstone - small security helpers. Node core only.
 * Password checks, rate limiting, origin checks (CSRF), safe decoding.
 */
const crypto = require('crypto');

const KNOWN_BAD = ['OANKS123456789', 'password', 'admin', 'changeme'];

function digest(s) { return crypto.createHash('sha256').update(String(s)).digest(); }

/** Constant-time string comparison (hashes first so lengths never leak). */
function safeEqual(a, b) { return crypto.timingSafeEqual(digest(a), digest(b)); }

/** Returns a problem description, or '' when the admin password is acceptable. */
function adminPasswordProblem(pass) {
  if (!pass) return 'ADMIN_PASS is not set. Set it to a unique password of at least 12 characters.';
  if (String(pass).length < 12) return 'ADMIN_PASS must be at least 12 characters.';
  if (KNOWN_BAD.indexOf(String(pass)) !== -1) return 'ADMIN_PASS is a published default. Choose a different one.';
  return '';
}

/** Sliding-window limiter, in memory. */
function createLimiter(max, windowMs) {
  const hits = new Map();
  function live(key, now) {
    const a = (hits.get(key) || []).filter(t => now - t < windowMs);
    if (a.length) hits.set(key, a); else hits.delete(key);
    return a;
  }
  return {
    allowed(key, now) { return live(key, now || Date.now()).length < max; },
    hit(key, now) {
      now = now || Date.now();
      const a = live(key, now);
      a.push(now);
      hits.set(key, a);
      if (hits.size > 10000) {
        for (const k of Array.from(hits.keys())) { live(k, now); if (hits.size <= 5000) break; }
      }
    },
    take(key, now) {
      now = now || Date.now();
      if (!this.allowed(key, now)) return false;
      this.hit(key, now);
      return true;
    },
    reset(key) { hits.delete(key); }
  };
}

/** True when a state-changing request came from this site (Origin, else Referer). */
function sameOrigin(req, trustProxy) {
  const h = req.headers || {};
  const host = String((trustProxy && h['x-forwarded-host']) || h.host || '').toLowerCase();
  const src = h.origin || h.referer;
  if (!host || !src) return false;
  try { return new URL(src).host.toLowerCase() === host; } catch (e) { return false; }
}

function isSecure(req, trustProxy) {
  if (req.socket && req.socket.encrypted) return true;
  return !!trustProxy && String((req.headers || {})['x-forwarded-proto'] || '').split(',')[0].trim() === 'https';
}

/** Client IP. Forwarded headers are believed only when the operator says a proxy is in front. */
function clientIp(req, trustProxy) {
  if (trustProxy) {
    const xf = String((req.headers || {})['x-forwarded-for'] || '').split(',')[0].trim();
    if (xf) return xf;
  }
  return (req.socket && req.socket.remoteAddress) || '';
}

/** decodeURIComponent that returns null instead of throwing. */
function safeDecode(s) {
  try { return decodeURIComponent(s); } catch (e) { return null; }
}

function validEmail(e) {
  const s = String(e || '').trim();
  return s.length <= 160 && /^[^@\s<>]+@[^@\s<>]+\.[^@\s<>]+$/.test(s);
}

/** Spreadsheet formula injection guard for CSV cells. */
function csvCell(c) {
  let s = c === undefined || c === null ? '' : String(c);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return '"' + s.replace(/"/g, '""') + '"';
}

module.exports = {
  safeEqual, adminPasswordProblem, createLimiter, sameOrigin, isSecure,
  clientIp, safeDecode, validEmail, csvCell
};
