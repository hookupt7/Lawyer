'use strict';
/**
 * Oakstone — the guided "start here" flow.
 *
 * ONE QUESTION PER PAGE. Nothing is stacked. Every answer is a real link (or a
 * real form) that carries you to the next page, and every answer stays in the
 * URL — so the back button walks you backwards through your own answers, a
 * reload never loses them, and the whole flow works with JavaScript disabled.
 *
 * Questions come from data/flows.js, which has a tailored set for each of the
 * 26 practice areas (divorce asks contested or uncontested; bankruptcy asks
 * income and debts; traffic asks whether it is a DUI; the survivor set asks the
 * age at the time of the abuse). If an area ever lacks a set, a safe generic
 * one is used rather than an empty page.
 *
 *   /practice-areas/<id>/start
 *   /practice-areas/<id>/start?matter=divorce&step=1
 *   /practice-areas/<id>/start?...&state=Texas&urgency=urgent&step=contact
 */
const R = require('./render.js');
const S = require('./sections.js');

let FLOWS = {};
try { FLOWS = require('../data/flows.js'); } catch (e) { FLOWS = {}; }

const esc = R.esc, tel = R.tel, safeUrl = R.safeUrl, wa = R.wa;

/* Answers carried between pages: a flat object of key -> value. */
const RESERVED = { step: 1, ref: 1, err: 1 };

function shortName(name) {
  return String(name).replace(/ &.*$/, '').replace(/ Law$/, '');
}

/* Everything except our own control params is a client answer. */
function answersFrom(query) {
  const out = {};
  Object.keys(query || {}).forEach(k => {
    if (!RESERVED[k] && query[k] !== '' && query[k] != null) out[k] = query[k];
  });
  return out;
}

function buildQuery(o) {
  return Object.keys(o).filter(k => o[k] !== undefined && o[k] !== '' && o[k] !== null)
    .map(k => k + '=' + encodeURIComponent(o[k])).join('&');
}

function urlTo(a, answers, extra) {
  const merged = Object.assign({}, answers, extra || {});
  return '/practice-areas/' + a.id + '/start?' + buildQuery(merged);
}

/* ---------- the question set for an area ---------- */
/* Two questions are mandatory in every flow: the state (it decides the court
   and the deadlines) and the urgency. They are appended here rather than
   written into each data set, so they cannot be forgotten or drift apart. */
function questionSet(a) {
  const set = FLOWS[a.id];
  const base = (set && set.questions && set.questions.length) ? set.questions.slice() : [
    { key: 'matter', type: 'choice', title: 'What do you need help with?',
      sub: 'Pick the closest match and an attorney will work out the detail with you.',
      options: (a.services || []).slice(0, 6).map(sv => ({
        value: sv.name, label: sv.name, desc: sv.desc
      })).concat([{ value: 'Not sure yet', label: 'I am not sure yet',
        desc: 'Describe it in your own words and we will tell you where it fits.' }]) }
  ];

  const hasState = base.some(q => q.type === 'state' || q.key === 'state');
  if (!hasState) {
    /* Sit the state question before the urgency one. */
    base.push({ key: 'state', type: 'state', title: 'Where are you?',
      sub: 'The state decides which court applies and which deadlines run. ' +
        'We are admitted in ' + R.states.filter(x => x.admitted).length + ' of them and work with local counsel in the rest.' });
  }
  const hasUrgency = base.some(q => q.key === 'urgency');
  if (!hasUrgency) {
    base.push({ key: 'urgency', type: 'choice', title: 'How soon does this need attention?',
      sub: 'This decides who picks up your file first.',
      options: [
        { value: 'normal', label: 'It can wait a little', desc: 'No deadline in the next few weeks.' },
        { value: 'urgent', label: 'Within about a month', desc: 'A date, notice or deadline is approaching.' },
        { value: 'emergency', label: 'Now — it is happening', desc: 'Money moving, someone in custody, or a deadline this week.' }
      ] });
  }
  return { intro: (set && set.intro) || 'A few short questions, then an attorney reads your matter.',
    questions: base };
}

/* ---------- progress ---------- */
function progress(a, index, total, answers) {
  const labels = ['Your matter', 'Details', 'Deadlines', 'Contact'];
  return '<div class="pf__prog" aria-label="Step ' + (index + 1) + ' of ' + total + '">' +
    Array.from({ length: total }).map((_, i) =>
      '<span class="pf__dot' + (i < index ? ' is-done' : i === index ? ' is-now' : '') + '">' +
        '<i></i><em>' + esc(labels[i] || ('Step ' + (i + 1))) + '</em></span>').join('') +
    '<span class="pf__bar"><i style="width:' + Math.round((index / Math.max(1, total - 1)) * 100) + '%"></i></span>' +
    (a.urgent ? '<span class="pf__flag tag tag--urgent">Time-critical</span>' : '') +
  '</div>';
}

/* ---------- one option, as a link ---------- */
function optionLink(a, answers, question, opt, altClass) {
  const label = typeof opt === 'string' ? opt : opt.label;
  const value = typeof opt === 'string' ? opt : opt.value;
  const desc = typeof opt === 'string' ? '' : opt.desc;
  /* No prices on the question cards. Fees belong on the practice-area page,
     where they can be read properly — not stamped on every choice. */
  const next = {};
  next[question.key] = value;
  return '<a class="pf__opt' + (altClass ? ' ' + altClass : '') + '" href="' +
      esc(urlTo(a, answers, next)) + '">' +
    '<span class="pf__optname">' + esc(label) + '</span>' +
    (desc ? '<span class="pf__optdesc">' + esc(desc) + '</span>' : '') +
  '</a>';
}

/* ---------- a question rendered as its own page ---------- */
function renderQuestion(a, question, answers, index, total) {
  const head = '<span class="eyebrow">' + esc(a.name) + ' &middot; step ' + (index + 1) + ' of ' + total + '</span>' +
    '<h1 class="pf__title">' + esc(question.title) + '</h1>' +
    (question.sub ? '<p class="pf__sub">' + esc(question.sub) + '</p>' : '');
  const back = renderBack(a, answers, index);

  if (question.type === 'state') {
    return '<div class="pf__q rv" style="animation-delay:.04s">' + head +
      '<div class="pf__states">' +
        R.states.map(x => {
          const next = {}; next[question.key] = x.name;
          return '<a class="pf__state" href="' + esc(urlTo(a, answers, next)) + '">' +
            '<span>' + esc(x.name) + '</span>' +
            (x.admitted ? '<em>Counsel of record</em>' : '<em>Co-counsel</em>') +
          '</a>';
        }).join('') +
      '</div>' + back + '</div>';
  }

  if (question.type === 'number' || question.type === 'text') {
    /* A real GET form, so it works with or without JavaScript. */
    const hidden = Object.keys(answers).map(k =>
      '<input type="hidden" name="' + esc(k) + '" value="' + esc(answers[k]) + '">').join('');
    const field = question.type === 'number'
      ? '<div class="pf__number"><input class="field pf__numinput" type="number" inputmode="numeric" ' +
          'name="' + esc(question.key) + '" id="pf-a" min="0" step="1" required ' +
          (question.placeholder ? 'placeholder="' + esc(question.placeholder) + '" ' : '') + 'autofocus>' +
          (question.unit ? '<span class="pf__unit">' + esc(question.unit) + '</span>' : '') + '</div>'
      : '<input class="field" type="text" name="' + esc(question.key) + '" id="pf-a" required ' +
          'placeholder="' + esc(question.placeholder || '') + '" autofocus>';
    return '<div class="pf__q rv" style="animation-delay:.04s">' + head +
      '<form class="pf__inlineform" method="get" action="/practice-areas/' + esc(a.id) + '/start">' +
        hidden + '<input type="hidden" name="step" value="' + (index + 1) + '">' +
        '<div class="form-row">' + field + '</div>' +
        '<button class="btn btn--brass btn--lg" type="submit">Continue&nbsp;&rarr;</button>' +
      '</form>' + back + '</div>';
  }

  const opts = (question.options || []).map(o => optionLink(a, answers, question, o)).join('');
  return '<div class="pf__q rv" style="animation-delay:.04s">' + head +
    '<div class="pf__opts' + (question.options && question.options.length === 3 ? ' pf__opts--3' : '') + '">' +
      opts + '</div>' + back + '</div>';
}

function renderBack(a, answers, index) {
  if (index === 0) {
    return '<p class="pf__foot tiny muted">Not the right area? ' +
      '<a class="link-arrow" href="/practice-areas">See all 26</a>.</p>';
  }
  /* Walk back by dropping the most recent answer from the URL. */
  const keys = Object.keys(answers);
  const lastKey = keys[keys.length - 1];
  const prev = Object.assign({}, answers);
  delete prev[lastKey];
  return '<p class="pf__back"><a class="link-arrow" href="' + esc(urlTo(a, prev, { step: index - 1 })) +
    '">&larr; Back</a></p>';
}

/* ---------- the final step: contact ---------- */
/* Turn a stored answer value back into the words the client actually read,
   so the recap says "Custody or parenting time" and not "custody". */
function answerLabel(a, key, value) {
  const qn = (questionSet(a).questions.filter(x => x.key === key)[0] || {});
  if (qn.options) {
    const hit = qn.options.filter(o => (typeof o === 'string' ? o : o.value) === value)[0];
    if (hit) return typeof hit === 'string' ? hit : hit.label;
  }
  if (qn.type === 'number') return value + (qn.unit ? ' ' + qn.unit : '');
  if (qn.type === 'state') return value;
  return String(value).replace(/_/g, ' ');
}

function renderContact(a, answers, index, total, s) {
  const att = R.attorneys().filter(x => (x.practices || []).indexOf(a.id) > -1)[0];
  /* Readable recap, one row per answered question, in the order asked. */
  const rows = questionSet(a).questions
    .filter(q => answers[q.key] !== undefined && answers[q.key] !== '')
    .map(q => {
      const label = q.title ? q.title.replace(/\?$/, '') : q.key;
      return '<div class="est__line"><span>' + esc(label) + '</span><strong>' +
        esc(answerLabel(a, q.key, answers[q.key])) + '</strong></div>';
    }).join(' ');
  const hidden = Object.keys(answers).map(k =>
    '<input type="hidden" name="' + esc(k) + '" value="' + esc(answers[k]) + '">').join('');

  return '<div class="pf__q rv" style="animation-delay:.04s">' +
    '<span class="eyebrow">' + esc(a.name) + ' &middot; last step</span>' +
    '<h1 class="pf__title">How should we reach you?</h1>' +
    '<p class="pf__sub">An attorney reads this and replies with the deadlines that apply and the fee we would ' +
      'propose. The case review itself is free.</p>' +
    '<div class="pf__grid">' +
      '<div class="est pf__sum"><div class="est__label">Your matter</div>' +
        (rows || '<div class="est__line"><span>Practice area</span><strong>' + esc(a.name) + '</strong></div>') +
        (att ? '<div class="est__line"><span>Likely attorney</span><strong>' + esc(att.name) + '</strong></div>' : '') +
      '</div>' +
      '<form class="pf__form" method="post" action="/api/practice-start" id="pf-form" novalidate>' +
        hidden +
        '<input type="hidden" name="practiceArea" value="' + esc(a.id) + '">' +
        '<input type="hidden" name="source" value="practice-flow">' +
        '<input type="hidden" name="answers" id="pf-answers" value="' + esc(JSON.stringify(answers)) + '">' +
        '<div class="form-row"><label for="pf-name">Full name</label>' +
          '<input class="field" id="pf-name" name="name" autocomplete="name" required></div>' +
        '<div class="form-row"><label for="pf-phone">Phone</label>' +
          '<input class="field" id="pf-phone" name="phone" type="tel" autocomplete="tel" required ' +
          'placeholder="(555) 000-0000"></div>' +
        '<div class="form-row"><label for="pf-email">Email</label>' +
          '<input class="field" id="pf-email" name="email" type="email" autocomplete="email" required></div>' +
        '<div class="form-row"><label for="pf-details">Anything else the attorney should know</label>' +
          '<textarea class="field" id="pf-details" name="details" rows="4" ' +
          'placeholder="Dates, parties, deadlines, and what you want to achieve"></textarea></div>' +
        '<button class="btn btn--brass btn--block btn--lg" type="submit" id="pf-send">Request my free review</button>' +
        '<p class="tiny muted mt4">Submitting does not create an attorney-client relationship, and what you send ' +
          'is not privileged until we are engaged. Do not send passwords or account numbers.</p>' +
      '</form>' +
    '</div>' +
    '<noscript><p class="tiny muted mt4">Submitting takes you to a confirmation page.</p></noscript>' +
    '<div class="pf__done" id="pf-done" hidden>' +
      '<div class="pf__tick" aria-hidden="true">' +
        '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.8" ' +
        'stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></svg></div>' +
      '<h2 class="pf__title">Request received.</h2>' +
      '<p class="pf__sub">An attorney will get in touch with you soon. If your matter is urgent, call us now and ' +
        'we will move it to the front of the queue.</p>' +
      '<div class="pf__ref tiny muted">Reference <strong class="mono" id="pf-ref"></strong></div>' +
      '<div class="pf__doneacts">' +
        '<a class="btn btn--primary" href="' + tel(s.phone) + '">Call ' + esc(s.phone) + '</a>' +
        '<a class="btn btn--ghost" href="/practice-areas/' + esc(a.id) + '">Back to ' + esc(shortName(a.name)) + '</a>' +
      '</div>' +
    '</div>' +
    '<p class="pf__err err tiny" id="pf-err" role="alert"></p>' +
    (answers.urgency === 'emergency'
      ? '<div class="notice notice--alert mt6"><strong>If this cannot wait:</strong> call ' +
        '<a href="' + tel(s.phoneEmergency) + '">' + esc(s.phoneEmergency) + '</a> now — we answer within the hour.</div>'
      : '') +
  '</div>';
}

/* ---------- confirmation (no-JS redirect target) ---------- */
function renderDone(a, ref, s) {
  return '<div class="pf__q pf__q--done rv">' +
    '<div class="pf__tick" aria-hidden="true">' +
      '<svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" stroke-width="1.8" ' +
      'stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></svg></div>' +
    '<h1 class="pf__title">Request received.</h1>' +
    '<p class="pf__sub">An attorney will get in touch with you soon. If your matter is urgent, call us now and we ' +
      'will move it to the front of the queue.</p>' +
    (ref ? '<div class="pf__ref tiny muted">Reference <strong class="mono">' + esc(ref) + '</strong></div>' : '') +
    '<div class="pf__doneacts">' +
      '<a class="btn btn--primary" href="' + tel(s.phone) + '">Call ' + esc(s.phone) + '</a>' +
      '<a class="btn btn--ghost" href="/practice-areas/' + esc(a.id) + '">Back to ' + esc(shortName(a.name)) + '</a>' +
    '</div>' +
  '</div>';
}

/* ---------- the page ---------- */
function practiceFlow(s, a, query) {
  query = query || {};
  const set = questionSet(a);
  const questions = set.questions || [];
  const total = questions.length + 1;              /* + the contact step */
  const answers = answersFrom(query);
  const ref = query.ref;

  /* Which question comes next? Every answered key advances one step. */
  let index = 0;
  while (index < questions.length && answers[questions[index].key] !== undefined) index++;
  const answeredCount = index;
  if (query.step !== undefined && !ref) {
    const wanted = parseInt(query.step, 10);
    if (!isNaN(wanted) && wanted >= 0 && wanted <= answeredCount && wanted < questions.length) index = wanted;
  }

  let inner;
  if (ref) inner = renderDone(a, ref, s);
  else if (index >= questions.length) inner = renderContact(a, answers, questions.length, total, s);
  else inner = renderQuestion(a, questions[index], answers, index, total);

  const body =
    '<div class="pfbar">' +
      '<a class="pfbar__brand" href="/home" aria-label="Oakstone Legal Group home">' +
        '<svg viewBox="0 0 30 34" width="22" height="25" aria-hidden="true">' +
          '<path fill="currentColor" d="M15 1.5c1.6 3.4 6.4 6.4 6.4 11.6 0 3.6-2.3 6.4-5.2 7.6h-2.4c-2.9-1.2-5.2-4-5.2-7.6C8.6 7.9 13.4 4.9 15 1.5z"/>' +
          '<path fill="currentColor" d="M6.2 25.4h17.6L20.9 33H9.1z"/>' +
          '<path fill="none" stroke="#f8fafc" stroke-width="1.1" d="M15 6.5v14"/>' +
        '</svg>' +
        '<span>Oakstone</span>' +
      '</a>' +
      '<a class="pfbar__x" href="/practice-areas/' + esc(a.id) + '">' +
        (ref ? 'Close' : '<span class="pfbar__xq">Leave this and go to the ' + esc(shortName(a.name)) + ' page</span>') +
      '</a>' +
    '</div>' +

    '<section class="section section--tight"><div class="wrap" style="max-width:820px">' +
      (ref ? '' : progress(a, Math.min(index, total - 1), total, answers)) +
      '<div class="pf">' + inner + '</div>' +
    '</div></section>';

  return {
    title: 'Start here | ' + a.name + ' | Oakstone Legal Group',
    description: 'Answer a few short questions and an attorney reviews your ' + a.name.toLowerCase() +
      ' matter. Prices are listed for every service. The case review is free.',
    canonical: '/practice-areas/' + a.id + '/start',
    body,
    bare: true,       /* the question and nothing else — no header, no footer */
    noindex: true
  };
}

module.exports = { practiceFlow, questionSet, answerLabel };
