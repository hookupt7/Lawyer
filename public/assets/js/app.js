'use strict';
/* Oakstone — client behaviours. No dependencies. */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- MEGA MENU ---------- */
  (function mega() {
    var root = $('.mega');
    if (!root) return;
    var triggers = $$('[data-mega]');
    var groups = $$('.mega__railbtn');
    var closeTimer = null;

    function open(id) {
      clearTimeout(closeTimer);
      root.classList.add('is-open');
      $$('body > header').forEach(function (h) { h.style.borderBottomColor = 'transparent'; });
      $$('.nav__item').forEach(function (n) { n.classList.remove('is-open'); });
      if (id) {
        var t = triggers.filter(function (x) { return x.getAttribute('data-mega') === id; })[0];
        if (t) t.parentElement.classList.add('is-open');
      }
      if (id) selectGroup(id);
    }
    function selectGroup(id) {
      var btn = groups.filter(function (g) { return g.getAttribute('data-group') === id; })[0];
      if (!btn) return;
      groups.forEach(function (g) { g.classList.remove('is-active'); });
      btn.classList.add('is-active');
      $$('.mega__panel').forEach(function (p) {
        p.classList.toggle('is-active', p.getAttribute('data-panel') === id);
      });
    }
    function close() {
      root.classList.remove('is-open');
      $$('.nav__item').forEach(function (n) { n.classList.remove('is-open'); });
    }

    triggers.forEach(function (t) {
      var intent = t.getAttribute('data-mega');
      t.addEventListener('mouseenter', function () { open(intent); });
      t.addEventListener('focus', function () { open(intent); });
      t.addEventListener('click', function (e) {
        e.preventDefault();
        root.classList.contains('is-open') ? close() : open(intent);
      });
    });
    groups.forEach(function (g) {
      g.addEventListener('mouseenter', function () { selectGroup(g.getAttribute('data-group')); });
      g.addEventListener('focus', function () { selectGroup(g.getAttribute('data-group')); });
      g.addEventListener('click', function (e) { e.preventDefault(); selectGroup(g.getAttribute('data-group')); });
    });
    root.addEventListener('mouseenter', function () { clearTimeout(closeTimer); });
    root.addEventListener('mouseleave', function () { closeTimer = setTimeout(close, 220); });
    $$('.header').forEach(function (h) {
      h.addEventListener('mouseleave', function () { closeTimer = setTimeout(close, 220); });
      h.addEventListener('mouseenter', function () { clearTimeout(closeTimer); });
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    document.addEventListener('click', function (e) {
      if (!root.contains(e.target) && !e.target.closest('[data-mega]')) close();
    });
  })();

  /* ---------- MOBILE DRAWER ---------- */
  (function drawer() {
    var d = $('#drawer');
    if (!d) return;
    var openers = $$('[data-drawer-open]');
    function openD() { d.classList.add('is-open'); document.body.style.overflow = 'hidden'; }
    function closeD() { d.classList.remove('is-open'); document.body.style.overflow = ''; }
    openers.forEach(function (o) { o.addEventListener('click', function (e) { e.preventDefault(); openD(); }); });
    $$('[data-drawer-close]').forEach(function (c) { c.addEventListener('click', closeD); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeD(); });
    $$('.drawer__toggle').forEach(function (t) {
      t.addEventListener('click', function () {
        var g = t.parentElement;
        var wasOpen = g.classList.contains('is-open');
        $$('.drawer__group').forEach(function (x) { x.classList.remove('is-open'); });
        if (!wasOpen) g.classList.add('is-open');
      });
    });
  })();

  /* ---------- HEADER HIDE ON SCROLL DOWN ---------- */
  (function hdr() {
    var h = $('.header');
    if (!h) return;
    var last = 0;
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (y > 220 && y > last) h.classList.add('is-hidden');
      else h.classList.remove('is-hidden');
      last = y;
    }, { passive: true });
  })();

  /* ---------- ACCORDION ---------- */
  $$('.acc').forEach(function (acc) {
    var single = acc.hasAttribute('data-single');
    $$('.acc__btn', acc).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.acc__item');
        var panel = $('.acc__panel', item);
        var isOpen = item.classList.contains('is-open');
        if (single) {
          $$('.acc__item.is-open', acc).forEach(function (o) {
            o.classList.remove('is-open');
            $('.acc__panel', o).style.maxHeight = '0px';
            $('.acc__btn', o).setAttribute('aria-expanded', 'false');
          });
        }
        if (isOpen) {
          item.classList.remove('is-open');
          panel.style.maxHeight = '0px';
          btn.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('is-open');
          panel.style.maxHeight = panel.scrollHeight + 'px';
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  });

  /* ---------- SCROLL REVEAL ---------- */
  (function reveal() {
    var els = $$('.rv');
    if (!els.length) return;
    if (reduce || !('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('is-in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(function (e) { io.observe(e); });
  })();

  /* ---------- COUNT UP ---------- */
  (function counters() {
    var els = $$('[data-count]');
    if (!els.length || reduce || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, raw = el.getAttribute('data-count');
        var num = parseFloat(String(raw).replace(/[^0-9.]/g, '')) || 0;
        var pre = String(raw).match(/^[^0-9]*/)[0];
        var suf = String(raw).match(/[^0-9.]*$/)[0];
        var dec = (String(raw).split('.')[1] || '').length;
        var t0 = performance.now(), dur = 1100;
        (function tick(t) {
          var p = Math.min((t - t0) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = pre + (num * eased).toFixed(dec) + suf;
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
        io.unobserve(el);
      });
    }, { threshold: 0.4 });
    els.forEach(function (e) { io.observe(e); });
  })();

  /* ---------- CHOICE TILES ---------- */
  document.addEventListener('click', function (e) {
    var c = e.target.closest('.choice');
    if (!c) return;
    var name = c.getAttribute('data-name');
    if (name) {
      $$('.choice[data-name="' + name + '"]').forEach(function (x) { x.classList.remove('is-selected'); x.setAttribute('aria-pressed', 'false'); });
    }
    c.classList.add('is-selected');
    c.setAttribute('aria-pressed', 'true');
    var input = c.querySelector('input');
    if (input) { input.checked = true; }
    c.dispatchEvent(new CustomEvent('choice:select', { bubbles: true, detail: { value: c.getAttribute('data-value') } }));
  });

  /* ---------- BOOKING WIZARD ---------- */
  (function wizard() {
    var w = $('#wizard');
    if (!w) return;
    var panels = $$('.wizard__panel', w);
    var tabs = $$('.wizard__tab', w);
    var state = { step: 0, data: {} };
    var nextBtn = $('#wz-next'), backBtn = $('#wz-back'), submitBtn = $('#wz-submit');

    function render() {
      panels.forEach(function (p, i) { p.classList.toggle('is-active', i === state.step); });
      tabs.forEach(function (t, i) {
        t.classList.toggle('is-active', i === state.step);
        t.classList.toggle('is-done', i < state.step);
      });
      backBtn.style.visibility = state.step === 0 ? 'hidden' : 'visible';
      nextBtn.classList.toggle('hide', state.step === panels.length - 1);
      submitBtn.classList.toggle('hide', state.step !== panels.length - 1);
      var active = panels[state.step];
      var focusable = active.querySelector('input,select,textarea,button');
      if (focusable) focusable.focus({ preventScroll: true });
      if (state.step === panels.length - 1) fillSummary();
      w.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    }

    function collect() {
      $$('input,select,textarea', w).forEach(function (f) {
        if (!f.name) return;
        if (f.type === 'radio' && !f.checked) return;
        if (f.type === 'checkbox' && !f.checked) return;
        state.data[f.name] = f.value;
      });
      $$('.choice.is-selected', w).forEach(function (c) {
        var n = c.getAttribute('data-field');
        if (n) state.data[n] = c.getAttribute('data-value');
      });
    }

    function validate() {
      var ok = true;
      $$('[data-required]', panels[state.step]).forEach(function (f) {
        var err = f.parentElement.querySelector('.err');
        var val = (f.value || '').trim();
        var bad = !val;
        if (f.type === 'email' && val && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val)) bad = true;
        if (f.type === 'tel' && val && val.replace(/\D/g, '').length < 10) bad = true;
        f.classList.toggle('is-bad', bad);
        f.style.borderColor = bad ? 'var(--alert)' : '';
        if (err) err.textContent = bad ? (f.getAttribute('data-msg') || 'This field is required.') : '';
        if (bad) ok = false;
      });
      $$('[data-required-group]', panels[state.step]).forEach(function (g) {
        var chosen = !!g.querySelector('.choice.is-selected') || !!g.querySelector('input:checked');
        var err = g.parentElement.querySelector('.err');
        if (err) err.textContent = chosen ? '' : 'Choose one option to continue.';
        if (!chosen) ok = false;
      });
      return ok;
    }

    function fillSummary() {
      collect();
      var s = $('#wz-summary');
      if (!s) return;
      var map = {
        matter: 'Matter type', urgency: 'Urgency', state: 'Jurisdiction',
        attorney: 'Preferred attorney', date: 'Date', time: 'Time',
        fee_type: 'Fee preference', name: 'Full name', email: 'Email',
        phone: 'Phone', details: 'Summary'
      };
      var html = '';
      Object.keys(map).forEach(function (k) {
        if (state.data[k]) {
          html += '<div class="est__line"><span>' + map[k] + '</span><strong>' +
                  String(state.data[k]).replace(/[<>]/g, '') + '</strong></div>';
        }
      });
      s.innerHTML = html || '<div class="est__detail">No details captured yet.</div>';
    }

    $$('.choice', w).forEach(function (c) {
      c.addEventListener('click', function () {
        var f = c.getAttribute('data-field');
        var v = c.getAttribute('data-value');
        if (f) { state.data[f] = v; }
        var grp = c.getAttribute('data-group');
        if (grp) {
          $$('.choice[data-group="' + grp + '"]', w).forEach(function (x) { x.classList.remove('is-selected'); });
          c.classList.add('is-selected');
          var hidden = w.querySelector('input[name="' + f + '"]');
          if (hidden) hidden.value = v;
        }
      });
    });

    nextBtn && nextBtn.addEventListener('click', function () {
      if (!validate()) return;
      if (state.step < panels.length - 1) { state.step++; render(); }
    });
    backBtn && backBtn.addEventListener('click', function () {
      if (state.step > 0) { state.step--; render(); }
    });
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () {
        if (i <= state.step) { state.step = i; render(); }
      });
    });
    render();
  })();

  /* ---------- FEE ESTIMATOR ---------- */
  (function estimator() {
    var root = $('#estimator');
    if (!root) return;
    var data = null;
    try { data = JSON.parse($('#est-data').textContent); } catch (e) { return; }
    if (!data) return;
    var state = { matter: '', complexity: 'standard', urgency: 'normal' };

    var complexityMult = { simple: 1, standard: 1, complex: 1.85 };
    var urgencyMult = { normal: 1, urgent: 1.4, emergency: 1.75 };

    function fmt(n) {
      if (n >= 1000) return '$' + Math.round(n / 100) / 10 + 'k';
      return '$' + Math.round(n);
    }
    function calc() {
      var area = data.areas.filter(function (a) { return a.id === state.matter; })[0];
      var out = $('#est-out');
      if (!area) {
        out.innerHTML = '<div class="est__label">Estimated fee</div>' +
          '<div class="est__value">&mdash;</div>' +
          '<div class="est__detail">Select a matter type to see the fee ranges for that practice area.</div>';
        return;
      }
      var fees = area.services.slice(0, 4);
      var base = 1500;
      var matched = area.services.filter(function (s) { return s.fee && s.fee.amount; })[0];
      if (matched) base = matched.fee.amount;
      var mult = complexityMult[state.complexity] * urgencyMult[state.urgency];
      var low = base * mult * 0.85, high = base * mult * 2.4;
      var lines = fees.map(function (s) {
        var amt = s.fee && s.fee.amount ?
          (s.fee.type === 'contingency' ? s.fee.amount + '% contingency' :
           s.fee.type === 'hourly' ? '$' + s.fee.amount + '/hr' :
           s.fee.type === 'retainer' ? '$' + s.fee.amount.toLocaleString() + ' retainer' :
           s.fee.type === 'quote' ? 'Custom quote' : fmt(s.fee.amount)) : 'Quote required';
        return '<div class="est__line"><span>' + s.name + '</span><strong>' + amt + '</strong></div>';
      }).join('');
      out.innerHTML =
        '<div class="est__label">Estimated range for ' + area.name + '</div>' +
        '<div class="est__value">' + fmt(low) + ' &ndash; ' + fmt(high) + '</div>' +
        '<div class="est__detail">Based on the matter type and complexity you selected. Actual fees depend on the facts, the forum and whether the other side contests.</div>' +
        '<div class="est__split">' + lines + '</div>' +
        '<div class="est__caveat">This is an estimate, not a quote, and it is not legal advice. A binding fee is set only in a signed engagement agreement.</div>';
    }

    $$('.choice', root).forEach(function (c) {
      c.addEventListener('click', function () {
        var f = c.getAttribute('data-est'); if (!f) return;
        state[f] = c.getAttribute('data-value');
        calc();
      });
    });
    calc();
  })();

  /* ---------- YEAR / DATE STAMP ---------- */
  $$('[data-year]').forEach(function (e) { e.textContent = new Date().getFullYear(); });

  /* ---------- COPY-TO-CONFIRM on phone clicks (no-op hook for analytics) ---------- */
  $$('a[href^="tel:"]').forEach(function (a) {
    a.addEventListener('click', function () {
      a.setAttribute('data-clicked', '1');
    });
  });
})();
