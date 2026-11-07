'use strict';
/**
 * Oakstone — asset generator. Pure Node, idempotent.
 * Generates: logo, logo-light, logotype, favicon, og-default, 14 attorney portraits.
 */
const fs = require('fs');
const path = require('path');

const IMG = path.join(__dirname, '..', 'public', 'assets', 'img');
const ATT = path.join(IMG, 'attorneys');
fs.mkdirSync(ATT, { recursive: true });

const attorneys = require(path.join(__dirname, '..', 'data', 'attorneys.js'));

const OX = '#6e1f26', OX_D = '#47151a', OX_L = '#8a2a32';
const BRASS = '#b08d57', BRASS_L = '#c4a578';
const INK = '#0b0d10', BONE = '#f4f1ea', PAPER = '#fbfaf7';

/* The mark: an oak-leaf flame rising from a keystone base.
   Drawn as two paths so it reads at 16px. */
const MARK = '<path fill="FILL" d="M15 1.2c1.9 3.9 6.8 6.9 6.8 12.2 0 3.9-2.6 6.9-5.6 8.1h-2.4c-3-1.2-5.6-4.2-5.6-8.1C8.2 8.1 13.1 5.1 15 1.2z"/>' +
  '<path fill="FILL" d="M5.6 25.2h18.8L21 33.4H9z"/>' +
  '<path fill="none" stroke="STROKE" stroke-width="1.1" d="M15 6.8v14.2"/>';

function mark(fill, stroke) {
  return MARK.replace(/FILL/g, fill).replace(/STROKE/g, stroke || PAPER);
}

function write(name, svg) {
  const p = path.join(IMG, name);
  fs.writeFileSync(p, svg);
  console.log('wrote', path.relative(process.cwd(), p), fs.statSync(p).size + 'B');
}

/* 1. logo */
write('logo.svg',
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 34" width="30" height="34">' + mark(OX) + '</svg>');

/* 2. logo-light */
write('logo-light.svg',
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 34" width="30" height="34">' + mark(BONE, INK) + '</svg>');

/* 3. logotype */
write('logotype.svg',
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 72" width="320" height="72">' +
  '<g transform="translate(8,14) scale(1.3)">' + mark(OX) + '</g>' +
  '<text x="62" y="40" font-family="Iowan Old Style,Palatino,Georgia,serif" font-size="27" font-weight="600" letter-spacing="2.5" fill="' + INK + '">OAKSTONE</text>' +
  '<text x="63" y="58" font-family="Inter,Helvetica,Arial,sans-serif" font-size="9.5" letter-spacing="5.2" fill="' + '#8a6d3f' + '">LEGAL GROUP</text>' +
  '</svg>');

/* 4. favicon */
write('favicon.svg',
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">' +
  '<rect width="32" height="32" rx="3.5" fill="' + OX + '"/>' +
  '<g transform="translate(5.2,3.2) scale(0.75)">' + mark(BONE, OX) + '</g>' +
  '</svg>');

/* 5. og-default */
write('og-default.svg',
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">' +
  '<rect width="1200" height="630" fill="' + INK + '"/>' +
  '<g opacity="0.5">' +
    Array.from({ length: 14 }, (_, i) => '<line x1="' + (i * 88) + '" y1="0" x2="' + (i * 88) + '" y2="630" stroke="' + BONE + '" stroke-opacity="0.045"/>').join('') +
  '</g>' +
  '<g transform="translate(80,36) scale(2.1)">' + mark(BONE) + '</g>' +
  '<rect x="80" y="118" width="1040" height="2" fill="' + BRASS + '"/>' +
  '<text x="80" y="330" font-family="Georgia,\'Times New Roman\',serif" font-size="66" font-weight="600" fill="' + BONE + '">Nationwide Legal Counsel</text>' +
  '<text x="80" y="396" font-family="Helvetica,Arial,sans-serif" font-size="21" letter-spacing="3" fill="' + BRASS + '">FAMILY  &#183;  CYBER  &#183;  INJURY  &#183;  CRIMINAL  &#183;  BUSINESS</text>' +
  '<text x="80" y="560" font-family="Helvetica,Arial,sans-serif" font-size="19" letter-spacing="2" fill="#5c6673">oakstonelegal.com  &#183;  26 practice areas  &#183;  all 50 states</text>' +
  '</svg>');

/* 6. attorney portraits */
const TONES = ['#12151a', '#1a1f26', '#47151a', '#5c1b21', '#262d36', '#3a434f'];
attorneys.forEach((a, i) => {
  const bg = TONES[i % TONES.length];
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 600" width="480" height="600">' +
    '<title>' + a.name + '</title>' +
    '<rect width="480" height="600" fill="' + bg + '"/>' +
    '<circle cx="240" cy="255" r="190" fill="#ffffff" fill-opacity="0.03"/>' +
    '<circle cx="240" cy="255" r="150" fill="#ffffff" fill-opacity="0.05"/>' +
    '<text x="240" y="305" text-anchor="middle" font-family="Georgia,\'Times New Roman\',serif" font-size="128" letter-spacing="4" fill="' + BONE + '">' + a.initials + '</text>' +
    '<rect x="180" y="470" width="120" height="2" fill="' + BRASS + '"/>' +
    '<text x="240" y="512" text-anchor="middle" font-family="Helvetica,Arial,sans-serif" font-size="19" letter-spacing="3" fill="#c2c8d0">' + a.name.replace(', Esq.', '').toUpperCase() + '</text>' +
    '<text x="240" y="540" text-anchor="middle" font-family="Helvetica,Arial,sans-serif" font-size="13" letter-spacing="2" fill="#8b94a1">' + a.title.toUpperCase() + '</text>' +
    '</svg>';
  const p = path.join(ATT, a.id + '.svg');
  fs.writeFileSync(p, svg);
  console.log('wrote', 'public/assets/img/attorneys/' + a.id + '.svg', fs.statSync(p).size + 'B');
});

console.log('done: ' + (5 + attorneys.length) + ' assets');
