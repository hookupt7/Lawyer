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
      if (id && id !== 'all') selectGroup(id);
      else if (id === 'all' && groups.length) selectGroup(groups[0].getAttribute('data-group'));
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

  /* ---------- CHOICE TILES ---------- */
  document.addEventListener('click', function (e) {
    var c = e.target.closest('.choice');
    if (!c) return;
    /* Chips inside a standalone .choices group are owned by the group picker
       below, which supports clearing a choice. Without this the delegate
       re-selected the chip the picker had just cleared — you could never
       un-select anything. */
    var grp = c.closest('.choices');
    if (grp && !grp.closest('#wizard')) return;
    var name = c.getAttribute('data-name');
    if (name) {
      $$('.choice[data-name="' + name + '"]').forEach(function (x) { x.classList.remove('is-selected'); x.setAttribute('aria-pressed', 'false'); });
    }
    var wasOn = c.classList.contains('is-selected');
    c.classList.toggle('is-selected', !wasOn);
    c.setAttribute('aria-pressed', wasOn ? 'false' : 'true');
    var input = c.querySelector('input');
    if (input) { input.checked = !wasOn; }
    c.dispatchEvent(new CustomEvent('choice:select', { bubbles: true, detail: { value: wasOn ? '' : c.getAttribute('data-value') } }));
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
        var chosen = !!g.querySelector('.choice.is-selected') || !!g.querySelector('input:checked') ||
                     !!g.querySelector('.slotday.is-selected') || !!g.querySelector('.slot.is-selected') ||
                     !!g.querySelector('.slots .slot.is-selected');
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
        consultType: 'Consultation type', matter: 'Matter type', urgency: 'Urgency', state: 'Jurisdiction',
        attorney: 'Preferred attorney', date: 'Date', time: 'Time',
        fee_type: 'Fee preference', name: 'Full name', email: 'Email',
        phone: 'Phone', details: 'Summary'
      };
      var typeLabel = { review: 'Free case review', call: 'Consultation call with an attorney' };
      var html = '';
      Object.keys(map).forEach(function (k) {
        if (state.data[k]) {
          var v = k === 'consultType' ? (typeLabel[state.data[k]] || state.data[k]) : state.data[k];
          html += '<div class="est__line"><span>' + map[k] + '</span><strong>' +
                  String(v).replace(/[<>]/g, '') + '</strong></div>';
        }
      });
      s.innerHTML = html || '<div class="est__detail">No details captured yet.</div>';
      paintFee();
    }

    /* Price shown at the point of booking: free review, or the stated call fee. */
    function paintFee() {
      var fee = parseInt(w.getAttribute('data-consult-fee'), 10) || 0;
      var isCall = state.data.consultType === 'call';
      var val = document.getElementById('wz-fee');
      var line = document.getElementById('wz-feeline');
      var terms = document.getElementById('wz-terms');
      if (val) val.textContent = isCall ? (fee > 0 ? '$' + fee : 'Payable on booking') : 'Free';
      if (line) line.classList.toggle('is-fee-charged', isCall && fee > 0);
      if (terms) {
        terms.innerHTML = isCall
          ? 'By confirming you agree to a ' + (fee > 0 ? '$' + fee + ' ' : '') + 'consultation call with an attorney. ' +
            'It is not legal advice, and the attorney-client relationship begins only if we both sign an engagement ' +
            'agreement afterward. The fee is credited toward your first invoice if you engage the firm.'
          : 'By confirming you agree to the terms of the case review: it is private, it is not legal advice, ' +
            'and the attorney-client relationship begins only if we both sign an engagement agreement afterward.';
      }
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
        if (f === 'consultType') paintFee();
      });
    });

    /* day picker */
    var dayBtns = $$('.slotday', w);
    var dateInput = $('#wz-date');
    function selectDay(btn) {
      dayBtns.forEach(function (b) { b.classList.remove('is-selected'); });
      btn.classList.add('is-selected');
      if (dateInput) {
        dateInput.value = btn.getAttribute('data-day') || '';
        dateInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
      state.data.date = btn.getAttribute('data-label') || btn.getAttribute('data-day') || '';
      var err = btn.closest('.form-row');
      var e2 = err && err.querySelector('.err');
      if (e2) e2.textContent = '';
    }
    dayBtns.forEach(function (b) { b.addEventListener('click', function () { selectDay(b); }); });

    /* time-slot picker */
    var slotBtns = $$('.slot', w);
    var timeInput = $('#wz-time');
    function selectSlot(btn) {
      if (btn.disabled) return;
      slotBtns.forEach(function (b) { b.classList.remove('is-selected'); });
      btn.classList.add('is-selected');
      if (timeInput) {
        timeInput.value = btn.getAttribute('data-time') || '';
        timeInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
      state.data.time = btn.getAttribute('data-time') || '';
      var row = btn.closest('.form-row');
      var e2 = row && row.querySelector('.err');
      if (e2) e2.textContent = '';
    }
    slotBtns.forEach(function (b) { b.addEventListener('click', function () { selectSlot(b); }); });

    /* seed defaults so the step validates without a manual click */
    if (dayBtns.length && dateInput && !dateInput.value) {
      var pre = dayBtns.filter(function (b) { return b.classList.contains('is-selected'); });
      selectDay(pre.length ? pre[0] : dayBtns[0]);
    }

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

  /* ---------- NAV DROPDOWNS ---------- */
  (function drops() {
    $$('.nav__item.has-drop').forEach(function (item) {
      var link = item.querySelector('.nav__link');
      item.addEventListener('mouseenter', function () { item.classList.add('is-open'); });
      item.addEventListener('mouseleave', function () { item.classList.remove('is-open'); });
      link.addEventListener('click', function (e) {
        if (item.classList.contains('is-open')) { item.classList.remove('is-open'); }
        else { e.preventDefault(); item.classList.add('is-open'); }
      });
      item.addEventListener('focusout', function (e) {
        if (!item.contains(e.relatedTarget)) item.classList.remove('is-open');
      });
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.nav__item.has-drop')) {
        $$('.nav__item.has-drop').forEach(function (i) { i.classList.remove('is-open'); });
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') $$('.nav__item.has-drop').forEach(function (i) { i.classList.remove('is-open'); });
    });
  })();

  /* ---------- SCROLL PROGRESS + BACK TO TOP ---------- */
  (function chrome() {
    var bar = $('#progress'), top = $('#totop');
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var h = document.documentElement;
        var p = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 || 0;
        if (bar) bar.style.width = p + '%';
        if (top) top.classList.toggle('is-on', h.scrollTop > 600);
        ticking = false;
      });
    }, { passive: true });
    top && top.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
  })();

  /* ---------- TESTIMONIAL ROTATOR ---------- */
  (function rot() {
    var r = $('#rot');
    if (!r) return;
    var slides = $$('.rot__slide', r), dots = $$('.rot__dot', r);
    var i = 0, timer = null;
    function go(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle('is-on', k === i); });
      dots.forEach(function (d, k) { d.classList.toggle('is-on', k === i); });
    }
    function restart() {
      if (timer) clearInterval(timer);
      if (reduce) return;
      timer = setInterval(function () { go(i + 1); }, 6000);
    }
    dots.forEach(function (d) {
      d.addEventListener('click', function () {
        go(Number(d.getAttribute('data-i')));
        restart();
      });
    });
    r.addEventListener('mouseenter', function () { if (timer) clearInterval(timer); });
    r.addEventListener('mouseleave', restart);
    restart();
  })();

  /* ---------- PRACTICE HUB FILTERS ---------- */
  (function filters() {
    var bar = $('#filters'), grid = $('#pa-all');
    if (!bar || !grid) return;
    var pills = $$('.filter', bar);
    pills.forEach(function (p) {
      p.addEventListener('click', function () {
        pills.forEach(function (x) { x.classList.remove('is-on'); });
        p.classList.add('is-on');
        var g = p.getAttribute('data-g');
        $$('.pa-card', grid).forEach(function (c) {
          c.classList.toggle('is-hidden', g !== 'all' && c.getAttribute('data-group') !== g);
        });
        grid.classList.remove('is-filtering');
        void grid.offsetWidth;
        grid.classList.add('is-filtering');
      });
    });
  })();

  /* ---------- PRACTICE INDEX (main page) ----------
     Filter the directory by group. Every card is a plain link, so with
     JavaScript off the whole list is still there and still navigable. */
  (function practiceIndex() {
    var root = $('#pix');
    if (!root) return;
    var grid = $('.pix__grid', root);
    var pills = $$('.pix__pill', root);
    var cards = $$('.pix__card', root);

    pills.forEach(function (p) {
      p.addEventListener('click', function () {
        pills.forEach(function (x) { x.classList.remove('is-on'); x.setAttribute('aria-pressed', 'false'); });
        p.classList.add('is-on');
        p.setAttribute('aria-pressed', 'true');
        var g = p.getAttribute('data-pix');
        cards.forEach(function (c) {
          c.classList.toggle('is-hidden', g !== 'all' && c.getAttribute('data-group') !== g);
        });
      });
    });
  })();

  /* ---------- GENERIC CHOICE PICKER (outside the booking wizard) ----------
     The emergency intake and any other .choices group. Single-choice, and
     clicking the selected chip again clears the choice — a chip you cannot
     un-select is a trap. Keeps the hidden input the form posts in sync. */
  (function choicePickers() {
    $$('.choices').forEach(function (group) {
      if (group.closest('#wizard')) return;
      var chips = $$('.choice', group);
      if (!chips.length) return;
      /* The hidden field mirrors the rendered state from the start. If the
         markup pre-selects a chip, the form must carry that value even when
         nobody taps anything. */
      chips.forEach(function (c) {
        if (c.classList.contains('is-selected')) {
          var f0 = c.getAttribute('data-field');
          var h0 = f0 && document.querySelector('input[type="hidden"][name="' + f0 + '"]');
          if (h0) h0.value = c.getAttribute('data-value');
        }
      });
      chips.forEach(function (c) {
        c.addEventListener('click', function () {
          var g = c.getAttribute('data-group') || '';
          var f = c.getAttribute('data-field');
          var v = c.getAttribute('data-value');
          if (!f) return;
          var wasOn = c.classList.contains('is-selected');
          var scope = g ? $$('.choice[data-group="' + g + '"]') : chips;
          scope.forEach(function (x) {
            x.classList.remove('is-selected');
            x.setAttribute('aria-pressed', 'false');
          });
          var hidden = document.querySelector('input[type="hidden"][name="' + f + '"]');
          if (wasOn) {
            /* cleared: the form should not claim a choice the client retracted */
            if (hidden) hidden.value = '';
            return;
          }
          c.classList.add('is-selected');
          c.setAttribute('aria-pressed', 'true');
          if (hidden) hidden.value = v;
        });
      });
    });
  })();

  /* ---------- YEAR / DATE STAMP ---------- */
  $$('[data-year]').forEach(function (e) { e.textContent = new Date().getFullYear(); });

  /* ---------- COPY-TO-CONFIRM on phone clicks (no-op hook for analytics) ---------- */
  $$('a[href^="tel:"]').forEach(function (a) {
    a.addEventListener('click', function () {
      a.setAttribute('data-clicked', '1');
    });
  });

  /* ---------- INLINE BOOKING (sub-pages book in place) ---------- */
  (function inlineBook() {
    var root = $('#ibook');
    if (!root) return;
    var form = $('#ibook-form', root);
    var formBox = $('.ibook__form', root);
    var doneBox = $('.ibook__done', root);
    var err = $('#ibook-err', root);
    var send = $('#ibook-send', root);
    var ctxEl = $('#ibook-ctx', root);
    var lastFocus = null;

    function open(rootEl) {
      lastFocus = document.activeElement;
      var area = rootEl.getAttribute('data-area') || '';
      var att = rootEl.getAttribute('data-attorney') || '';
      var svc = rootEl.getAttribute('data-service') || '';
      var ctx = rootEl.getAttribute('data-context') || '';
      $('#ib-area', root).value = area;
      $('#ib-service', root).value = svc;
      $('#ib-context', root).value = ctx;
      var sel = $('#ib-area-select', root);
      if (area) { sel.value = area; } else if (!sel.value) { sel.value = ''; }
      var attSel = $('#ib-attorney', root);
      if (att) attSel.value = att;
      if (ctx) { ctxEl.textContent = ctx; }
      err.textContent = '';
      root.hidden = false;
      lockScroll();
      var first = $('#ib-name', root);
      if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, 60);
    }
    function close() {
      root.hidden = true;
      unlockScroll();
      if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    }

    /* iOS Safari ignores `overflow:hidden` on <html>/<body>, so the page behind
       a modal kept scrolling underneath it — two scrollbars fighting. Pinning
       the body with a negative offset is what actually holds it still. */
    var savedY = 0, locked = false;
    function lockScroll() {
      if (locked) return;
      savedY = window.pageYOffset || document.documentElement.scrollTop || 0;
      var b = document.body;
      b.style.position = 'fixed';
      b.style.top = -savedY + 'px';
      b.style.left = '0';
      b.style.right = '0';
      b.style.width = '100%';
      b.style.overflow = 'hidden';
      locked = true;
    }
    function unlockScroll() {
      if (!locked) return;
      var b = document.body;
      b.style.position = '';
      b.style.top = '';
      b.style.left = '';
      b.style.right = '';
      b.style.width = '';
      b.style.overflow = '';
      window.scrollTo(0, savedY);
      locked = false;
    }
    /* A hidden [hidden] attribute is not enough if a deep link or a re-render
       left the lock on; release it whenever the modal ends up closed. */
    window.addEventListener('pageshow', function () { if (root.hidden) unlockScroll(); });

    $$('[data-ibook]').forEach(function (trig) {
      trig.addEventListener('click', function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return; // honour "open in new tab"
        e.preventDefault();
        open(trig);
      });
    });
    $$('[data-ibook-close]', root).forEach(function (b) { b.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !root.hidden) close();
    });
    /* keep the hidden area id in step with the dropdown */
    var sel = $('#ib-area-select', root);
    if (sel) sel.addEventListener('change', function () { $('#ib-area', root).value = sel.value; });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      err.textContent = '';
      var name = $('#ib-name', root).value.trim();
      var phone = $('#ib-phone', root).value.trim();
      var email = $('#ib-email', root).value.trim();
      if (!name) { err.textContent = 'Please add your name.'; return; }
      if (phone.replace(/\D/g, '').length < 10) { err.textContent = 'A reachable phone number is required.'; return; }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { err.textContent = 'A valid email is required for the confirmation.'; return; }
      root.classList.add('is-busy');
      if (send) send.textContent = 'Sending...';
      fetch('/api/book-inline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name, phone: phone, email: email,
          area: $('#ib-area', root).value,
          attorney: $('#ib-attorney', root).value,
          service: $('#ib-service', root).value,
          context: $('#ib-context', root).value,
          state: $('#ib-state', root).value,
          date: $('#ib-day', root).value,
          time: $('#ib-time', root).value,
          details: $('#ib-details', root).value
        })
      }).then(function (r) { return r.json(); }).then(function (data) {
        root.classList.remove('is-busy');
        if (!data || !data.ok) {
          err.textContent = (data && data.error) || 'Something went wrong. Please call us instead.';
          if (send) send.textContent = 'Request my consultation';
          return;
        }
        formBox.hidden = true;
        doneBox.hidden = false;
        var who = data.attorney && data.attorney.indexOf('No preference') === -1
          ? data.attorney : 'An attorney';
        $('#ibook-done-msg').innerHTML =
          '<strong>' + who + '</strong> will get in touch with you soon. A confirmation is on its way to ' +
          String(data.email || email).replace(/[<>]/g, '') + ', and your request is already in the firm\u2019s intake queue.';
        $('#ibook-done-ref').textContent = data.ref ? 'Reference ' + data.ref : '';
        if (data.when) $('#ibook-done-ref').textContent += (data.when ? ' \u00b7 requested ' + data.when : '');
      }).catch(function () {
        root.classList.remove('is-busy');
        if (send) send.textContent = 'Request my consultation';
        err.textContent = 'We could not reach the server. Please call us instead.';
      });
    });
  })();

  /* ---------- RATING PICKER (attorney profiles) ---------- */
  (function ratingPick() {
    $$('.ratingbox__pick').forEach(function (pick) {
      var val = 0;
      var buttons = $$('button', pick);
      var input = $('#' + pick.getAttribute('data-for'));
      function paint(n) {
        buttons.forEach(function (b, i) { b.classList.toggle('is-on', i < n); });
      }
      buttons.forEach(function (b, i) {
        b.addEventListener('click', function () { val = i + 1; paint(val); if (input) input.value = val; });
        b.addEventListener('mouseenter', function () { paint(i + 1); });
      });
      pick.addEventListener('mouseleave', function () { paint(val); });
    });
  })();

  /* ---------- ASSET PROTECTION ----------
     Stops the casual copy of the firm's photographs: the right-click save,
     the drag-to-desktop, and the iOS long-press sheet. The CSS does the
     heavy lifting (pointer-events, -webkit-touch-callout); this catches the
     keyboard shortcuts and the context menu on the wrappers around them.

     Honest limit: anyone who can see the image in a browser can screenshot
     it or pull it from the network tab. This deters the ordinary visitor,
     which is what it is for. It is not a content-protection system. */
  (function assetGuard() {
    if (!document.querySelector('.guarded')) return;
    document.addEventListener('dragstart', function (e) {
      if (e.target && e.target.closest && e.target.closest('.guarded, .att__photo, .att-profile__photo')) {
        e.preventDefault();
      }
    }, true);
    document.addEventListener('contextmenu', function (e) {
      if (e.target && e.target.closest && e.target.closest('.guarded, .att__photo, .att-profile__photo')) {
        e.preventDefault();
      }
    });
    document.addEventListener('keydown', function (e) {
      /* Ctrl/Cmd+S (save page) and Ctrl/Cmd+Shift+S are aimed at the assets. */
      var k = (e.key || '').toLowerCase();
      if ((e.ctrlKey || e.metaKey) && (k === 's' || k === 'u')) e.preventDefault();
    });
  })();

  /* ---------- PRACTICE FLOW: answer feedback ----------
     Choosing an answer should feel like a decision landing, not a page blink.
     The chosen card fills, ticks, and the page leaves; a keyboard user gets
     the same feedback. Motion is skipped when the OS asks for less. */
  (function flowPicks() {
    var root = document.querySelector('.pf');
    if (!root) return;
    var leaving = false;
    function go(el, href) {
      if (leaving) return;
      leaving = true;
      el.classList.add('is-chosen');
      var tick = document.createElement('span');
      tick.className = 'pf__tick';
      tick.setAttribute('aria-hidden', 'true');
      tick.innerHTML = '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" ' +
        'stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M4 12.5l5 5L20 6.5"/></svg>';
      el.appendChild(tick);
      var wait = reduce ? 40 : 340;
      setTimeout(function () { location.href = href; }, wait);
    }
    $$('.pf__opt', root).forEach(function (el) {
      var href = el.getAttribute('href');
      if (!href) return;
      el.addEventListener('click', function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        go(el, href);
      });
    });
    /* The state picker: same idea, aimed at the state the client tapped. */
    $$('.pf__state', root).forEach(function (el) {
      var href = el.getAttribute('href');
      if (!href) return;
      el.addEventListener('click', function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        go(el, href);
      });
    });
    /* The card fades in when each question arrives, so the page does not
       simply appear — it settles. */
    var card = $('.pf__card', root) || $('.pf', root);
    if (card && !reduce) {
      card.classList.add('pf-in');
      requestAnimationFrame(function () { card.classList.add('pf-in--on'); });
    }
  })();

  /* ---------- ADMIN: COLLAPSIBLE PANELS ----------
     A pane holding seven full editors is still a wall of form. Each panel
     header becomes a toggle so a pane opens as a short list of titles.
     Without JavaScript nothing is collapsed, so every field stays reachable. */
  (function adminAccordions() {
    if (!$('#adminTabs')) return;                 /* only on the dashboard */
    document.documentElement.classList.add('js-tabs');
    var panels = $$('.tabpane .panel');
    panels.forEach(function (p) {
      var head = $('.panel__h', p);
      if (!head || !$('h2', head)) return;
      /* Every panel must have a body to hide. If the markup nests the form
         differently, wrap what follows the header rather than collapsing
         the panel down to an empty shell. */
      if (!$('.panel__b', p)) {
        var wrap = document.createElement('div');
        wrap.className = 'panel__b';
        var sib = head.nextSibling;
        while (sib) { var nxt = sib.nextSibling; wrap.appendChild(sib); sib = nxt; }
        p.appendChild(wrap);
      }
      head.setAttribute('role', 'button');
      head.setAttribute('tabindex', '0');
      head.setAttribute('aria-expanded', 'false');
      p.classList.add('is-collapsed');
      function toggle() {
        var open = !p.classList.contains('is-collapsed');
        p.classList.toggle('is-collapsed', open);
        head.setAttribute('aria-expanded', open ? 'false' : 'true');
      }
      head.addEventListener('click', function (e) {
        if (e.target.closest('a, button, input, select, textarea, label')) return;
        toggle();
      });
      head.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
      });
    });
  })();

  /* ---------- ADMIN TABS ----------
     One pane at a time. Without JavaScript every pane still renders, so the
     page degrades to the old long scroll rather than hiding anything. */
  (function adminTabs() {
    var nav = $('#adminTabs');
    if (!nav) return;
    var tabs = $$('.admin__tab', nav);
    var panes = $$('.tabpane');
    if (!tabs.length || !panes.length) return;
    document.documentElement.classList.add('js-tabs');

    function show(name) {
      tabs.forEach(function (t) { t.classList.toggle('is-on', t.getAttribute('data-pane') === name); });
      panes.forEach(function (p) { p.classList.toggle('is-on', p.getAttribute('data-pane') === name); });
      try { history.replaceState(null, '', '#' + name); } catch (e) {}
      window.scrollTo(0, 0);
    }
    tabs.forEach(function (t) {
      t.addEventListener('click', function () { show(t.getAttribute('data-pane')); });
    });
    /* A deep link like /admin#prices opens the pane that owns it. */
    var hash = (location.hash || '').replace('#', '');
    if (hash) {
      var owner = panes.filter(function (p) { return p.getAttribute('data-pane') === hash; })[0];
      if (!owner) {
        panes.forEach(function (p) {
          if (!owner && p.querySelector('#' + hash)) owner = p;
        });
      }
      if (owner) show(owner.getAttribute('data-pane'));
    }
    /* Keep nav links inside a pane working (e.g. "Scroll to Inquiries"). */
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) return;
    });
  })();

  /* ---------- PRACTICE FLOW (one question per page) ----------
     The last step posts to /api/practice-start. With JavaScript we keep the
     client on the page and show the confirmation in place; without it the
     server redirects to the same flow with the confirmation showing. */
  (function practiceFlow() {
    var form = $('#pf-form');
    if (!form) return;
    var done = $('#pf-done');
    var box = form.closest('.pf__grid');
    var send = $('#pf-send');
    var err = $('#pf-err');
    var refEl = $('#pf-ref');

    function fail(msg) {
      if (err) { err.textContent = msg; err.style.display = 'block'; }
      if (send) { send.disabled = false; send.textContent = 'Request my free review'; }
    }

    form.addEventListener('submit', function (e) {
      if (!window.fetch || !done) return;           /* let the browser post it */
      e.preventDefault();
      if (err) err.textContent = '';
      var data = {};
      Array.prototype.forEach.call(form.elements, function (f) {
        if (f.name) data[f.name] = f.value;
      });
      if (!data.name || !data.phone || !data.email) { fail('Name, phone and email are needed.'); return; }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) { fail('That email address does not look right.'); return; }
      if (String(data.phone).replace(/\D/g, '').length < 10) { fail('A reachable phone number is required.'); return; }
      if (send) { send.disabled = true; send.textContent = 'Sending\u2026'; }
      fetch('/api/practice-start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(function (r) { return r.json(); }).then(function (j) {
        if (!j || !j.ok) { fail((j && j.error) || 'Something went wrong. Please call us instead.'); return; }
        if (refEl) refEl.textContent = j.ref;
        if (box) box.hidden = true;
        var prog = document.querySelector('.pf__prog');
        if (prog) prog.hidden = true;
        done.hidden = false;
        done.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      }).catch(function () {
        fail('We could not reach the server. Please call us instead.');
      });
    });
  })();

})();
