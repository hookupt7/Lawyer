/* OAKSTONE — page audit helper.
   Loaded only by the audit tooling, never by a public page. Reports:
   text contrast failures (gradient-aware), undersized tap targets,
   images without alt text, the h1 count, and horizontal overflow. */
(function () {
  if (window.pageAudit) return;
  function parse(c) { const m = (c || '').match(/[\d.]+/g); return m ? m.map(Number) : null; }
  function lum(a) {
    const f = function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(a[0]) + 0.7152 * f(a[1]) + 0.0722 * f(a[2]);
  }
  function ratio(a, b) {
    const L1 = lum(a), L2 = lum(b);
    return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
  }
  function gradStops(gi) {
    return Array.from(gi.matchAll(/rgba?\(([^)]+)\)/g)).map(function (m) {
      const p = m[1].split(',').map(parseFloat);
      return { c: p.slice(0, 3), a: p.length > 3 ? p[3] : 1 };
    }).filter(function (x) { return x.a > 0.55; }).map(function (x) { return x.c; });
  }
  function effectiveBg(el, fg) {
    let e = el;
    while (e && e !== document.documentElement) {
      if (e === document.body) return [248, 250, 252];
      const cs = getComputedStyle(e);
      if (cs.backgroundImage && cs.backgroundImage !== 'none' && /gradient/.test(cs.backgroundImage)) {
        const s = gradStops(cs.backgroundImage);
        if (s.length) {
          const fl = lum(fg);
          let w = s[0], b = Infinity;
          for (const c of s) { const d = Math.abs(lum(c) - fl); if (d < b) { b = d; w = c; } }
          return w;
        }
      }
      const p = parse(cs.backgroundColor);
      if (p && (p.length < 4 || p[3] > 0.55)) return p.slice(0, 3);
      e = e.parentElement;
    }
    return [248, 250, 252];
  }
  window.pageAudit = function () {
    const fails = [];
    let checked = 0;
    document.querySelectorAll('p,span,a,li,h1,h2,h3,h4,strong,em,small,td,th,label,button').forEach(function (el) {
      if (el.children.length > 0) return;
      if (el.closest('.sr,[aria-hidden="true"]')) return;
      const t = (el.textContent || '').trim();
      if (t.length < 3) return;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none') return;
      if (parseFloat(cs.opacity) < 0.15) return;
      const r0 = el.getBoundingClientRect();
      if (r0.width < 2 || r0.height < 2) return;
      const fs = parseFloat(cs.fontSize), fw = parseInt(cs.fontWeight) || 400;
      const fgc = parse(cs.color);
      if (!fgc) return;
      const bg = effectiveBg(el, fgc.slice(0, 3));
      const r = ratio(fgc.slice(0, 3), bg);
      const large = fs >= 24 || (fs >= 18.66 && fw >= 700);
      const need = large ? 3 : 4.5;
      checked++;
      if (r < need) fails.push({ t: t.slice(0, 36), cls: (el.className || el.tagName).toString().slice(0, 26), fs: Math.round(fs), r: +r.toFixed(2), need: need });
    });
    const small = [];
    document.querySelectorAll('a.btn,button,.pf__opt,a.nav__link').forEach(function (el) {
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return;
      if (r.height < 32) small.push({ cls: (el.className || '').toString().slice(0, 30), h: Math.round(r.height), t: (el.textContent || '').trim().slice(0, 24) });
    });
    const noAlt = Array.from(document.querySelectorAll('img')).filter(function (i) { return !i.hasAttribute('alt'); });
    const de = document.documentElement;
    return {
      url: location.pathname,
      checked: checked,
      failCount: fails.length,
      fails: fails.slice(0, 12),
      smallTargets: small.slice(0, 8),
      imgNoAlt: noAlt.length,
      h1: document.querySelectorAll('h1').length,
      overflow: de.scrollWidth > de.clientWidth + 1 ? { scrollW: de.scrollWidth, clientW: de.clientWidth } : null
    };
  };
})();
