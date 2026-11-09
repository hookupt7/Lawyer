'use strict';
/**
 * Oakstone - which contact channels the public site shows.
 *
 * Always on the site (hidden only when left empty): phone, email, WhatsApp,
 * TikTok, Telegram. Everything in OPTIONAL is off by default and is switched
 * on or off from the admin panel ("Show on the website").
 */
const OPTIONAL = [
  { key: 'phoneEmergency', label: 'Emergency phone line' },
  { key: 'address', label: 'Street address and extra offices' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'youtube', label: 'YouTube' },
  { key: 'x', label: 'X (Twitter)' }
];
const SOCIAL_ORDER = ['tiktok', 'telegram', 'instagram', 'linkedin', 'facebook', 'youtube', 'x'];
const SOCIAL_LABELS = { tiktok: 'TikTok', telegram: 'Telegram', instagram: 'Instagram', linkedin: 'LinkedIn', facebook: 'Facebook', youtube: 'YouTube', x: 'X' };

const DEFAULT_FLAGS = {};
OPTIONAL.forEach(o => { DEFAULT_FLAGS['show_' + o.key] = false; });

/** Telegram accepts a handle (@name), t.me/name, or a full link. */
function tg(raw) {
  const s = String(raw || '').trim();
  if (!s) return '';
  if (/^https?:\/\//i.test(s)) return s;
  const handle = s.replace(/^@/, '').replace(/^t\.me\//i, '').replace(/[^\w]/g, '');
  return handle ? 'https://t.me/' + handle : '';
}

function isShown(s, key) { return !!s && s['show_' + key] === true; }

/**
 * The settings the public site is allowed to see. Hidden channels are blanked
 * (the emergency line falls back to the main number, so pages that mention it
 * still have somewhere to point). Safe to apply twice.
 */
function publicView(s) {
  const v = Object.assign({}, s);
  OPTIONAL.forEach(o => {
    if (isShown(s, o.key)) return;
    if (o.key === 'phoneEmergency') v.phoneEmergency = s.phone;
    else if (o.key === 'address') { v.address = ''; v.zip = ''; }
    else v[o.key] = '';
  });
  v.showOffices = isShown(s, 'address');
  return v;
}

/** Social links to render, in a fixed order, skipping any that are empty. */
function socialLinks(s) {
  return SOCIAL_ORDER.filter(k => s[k]).map(k => ({
    key: k, label: SOCIAL_LABELS[k], href: k === 'telegram' ? tg(s[k]) : String(s[k])
  })).filter(l => l.href);
}

module.exports = { OPTIONAL, SOCIAL_ORDER, SOCIAL_LABELS, DEFAULT_FLAGS, tg, isShown, publicView, socialLinks };
