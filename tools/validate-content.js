'use strict';
/**
 * Enforces the anti-AI-slop copy rules across every content surface.
 * Run: node tools/validate-content.js
 * Exit code 1 if any violation is found.
 */
const fs = require('fs');
const path = require('path');

const DATA = path.join(__dirname, '..', 'data');

// Whole-word matches only, so "Compassionate" does not trip "passionate".
// Terms that legitimately contain a banned word are whitelisted explicitly.
const BANNED = [
  'seamless', 'innovative', 'cutting-edge', 'leverage', 'synergy',
  'end-to-end', 'holistic', 'world-class', 'passionate',
  'committed to excellence', 'delve', 'robust', 'best-in-class',
  'tailored solutions', 'peace of mind', 'empower', 'game-changing',
  'revolutionary', 'unparalleled', 'state-of-the-art', 'turnkey'
];

// Any banned term must not be flagged when it appears inside one of these.
const WHITELIST = [
  'compassionate release'   // First Step Act statutory term
];

function walk(node, cb, trail) {
  trail = trail || '';
  if (typeof node === 'string') return cb(node, trail);
  if (Array.isArray(node)) return node.forEach((v, i) => walk(v, cb, trail + '[' + i + ']'));
  if (node && typeof node === 'object') {
    return Object.keys(node).forEach(k => walk(node[k], cb, trail + '.' + k));
  }
}

let violations = 0;
let checked = 0;
const files = fs.readdirSync(DATA).filter(f => f.endsWith('.js'));

console.log('Anti-slop copy validation');
console.log('='.repeat(58));

files.forEach(file => {
  let mod;
  try {
    delete require.cache[require.resolve(path.join(DATA, file))];
    mod = require(path.join(DATA, file));
  } catch (e) {
    console.log('  LOAD FAIL ' + file + ': ' + e.message);
    violations++;
    return;
  }
  const found = [];
  walk(mod, (str, trail) => {
    checked++;
    // Strip whitelisted phrases before scanning so their substrings are ignored.
    let low = str.toLowerCase();
    WHITELIST.forEach(w => { low = low.split(w).join('\u0000'.repeat(w.length)); });
    BANNED.forEach(b => {
      const re = new RegExp('\\b' + b.replace(/[-]/g, '[- ]') + '\\b');
      const m = low.match(re);
      if (m) {
        const idx = low.indexOf(m[0]);
        found.push({ word: b, trail, ctx: str.slice(Math.max(0, idx - 30), idx + 45).replace(/\s+/g, ' ') });
      }
    });
  });
  const ok = found.length === 0;
  console.log((ok ? '  PASS  ' : '  FAIL  ') + file.padEnd(26) + (ok ? '' : found.length + ' hit(s)'));
  found.forEach(f => {
    violations++;
    console.log('         [' + f.word + '] ' + f.trail);
    console.log('           ...' + f.ctx + '...');
  });
});

console.log('='.repeat(58));
console.log('strings checked: ' + checked);
console.log(violations === 0 ? 'RESULT: clean' : 'RESULT: ' + violations + ' violation(s)');
process.exit(violations === 0 ? 0 : 1);
