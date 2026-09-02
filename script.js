/* Can I Vote? — builds the per-state panel from STATES (states.js) with text
   from I18N (i18n.js / strings.js). Everything user-visible is set with
   textContent and real DOM nodes; no innerHTML anywhere, so nothing from the
   URL or storage can ever become markup. */
(function () {
  'use strict';

  var grid = document.getElementById('state-grid');
  var filter = document.getElementById('state-filter');
  var noMatch = document.getElementById('no-match');
  var filterStatus = document.getElementById('filter-status');
  var result = document.getElementById('result');
  if (!grid || !result || typeof STATES === 'undefined' || typeof I18N === 'undefined') return;

  var t = I18N.t;
  var byAbbr = {};
  STATES.forEach(function (s) { byAbbr[s.abbr] = s; });

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var chooseBranch = null;   /* set by render() for the state on screen */
  var current = null;        /* { abbr, branch, restored } for re-render on language change */

  /* Remembering where someone got to.

     localStorage, not cookies. A cookie is sent to the server with every
     single request; this never leaves the browser, so nothing about the
     visitor reaches us or anyone else. It is also why there is no cookie
     banner: there is no cookie.

     What is stored is two short strings - a state code and "yes" or "no".
     Nothing about the person. Every read is validated against the real state
     list before it is used, because anything in storage can be edited by hand.
     Every call is wrapped: private windows and blocked site data make these
     throw rather than return null. */
  var STORE_KEY = 'caniv.progress.v1';

  function remember(state, branch) {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({ state: state, branch: branch || null }));
    } catch (e) { /* storage unavailable - the site works exactly the same without it */ }
  }

  function recall() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return null;
      var v = JSON.parse(raw);
      if (!v || !Object.prototype.hasOwnProperty.call(byAbbr, v.state)) return null;
      return { state: v.state, branch: (v.branch === 'yes' || v.branch === 'no') ? v.branch : null };
    } catch (e) { return null; }
  }

  function forget() {
    try { localStorage.removeItem(STORE_KEY); } catch (e) {}
  }

  /* ---- tiny DOM helpers ------------------------------------------------ */

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function icon(id, size) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', size || 22);
    svg.setAttribute('height', size || 22);
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', '#' + id);
    svg.appendChild(use);
    return svg;
  }

  function badge(n) {
    var b = el('span', 'box box--accent', String(n));
    b.setAttribute('aria-hidden', 'true');
    return b;
  }

  /* Outbound link to an official state site. The href is only ever taken
     from STATES, and is checked again here before it is set. */
  function extLink(url, label, cls) {
    var a = el('a', cls || 'btn');
    if (!/^https?:\/\//i.test(String(url))) return el('span', null, label);
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.appendChild(document.createTextNode(label));
    a.appendChild(icon('i-ext', 20));
    a.appendChild(el('span', 'sr-only', t('ui.newtab')));
    return a;
  }

  function para(text, cls) { var p = el('p', cls || null); I18N.setRich(p, text); return p; }

  var checkSeq = 0;

  /* Ordered lists are instructions. Unordered ones are things to gather, and
     they are REAL checkboxes: the empty ballot-box bullets looked tickable,
     people tried to tick them, and nothing happened. Ticks live only on the
     page - they are not saved, so nothing new is written to storage. */
  function list(items, ordered) {
    var l = el(ordered ? 'ol' : 'ul', ordered ? 'steps' : 'checklist');
    items.forEach(function (item) {
      var li = el('li');
      if (ordered) {
        I18N.setRich(li, item);
      } else {
        var id = 'chk-' + (++checkSeq);
        var input = el('input');
        input.type = 'checkbox';
        input.id = id;
        var label = el('label', null, item);
        label.htmlFor = id;
        li.appendChild(input);
        li.appendChild(label);
      }
      l.appendChild(li);
    });
    return l;
  }

  /* Reassurance and curiosity go behind a click, so the step itself stays
     short. The summary is the question people actually ask. */
  function fold(question, paras) {
    var d = el('details', 'fold');
    d.appendChild(el('summary', null, question));
    var body = el('div', 'fold-body');
    paras.forEach(function (x) { body.appendChild(para(x)); });
    d.appendChild(body);
    return d;
  }

  function keys(prefix, n) {
    var out = [];
    for (var i = 1; i <= n; i++) out.push(prefix + i);
    return out;
  }

  /* ---- build the result panel -----------------------------------------
     One card per step. A step is one thing to do, with its link last. */

  function card(num, heading, headingId) {
    var c = el('section', 'card');
    c.appendChild(badge(num));
    var h = el('h3', null, heading);
    if (headingId) { h.id = headingId; c.setAttribute('aria-labelledby', headingId); }
    c.appendChild(h);
    return c;
  }

  function linkRow(a) {
    var l = el('ul', 'linklist');
    var li = el('li');
    li.appendChild(a);
    l.appendChild(li);
    return l;
  }

  function buildYes(s, v) {
    var wrap = el('div', 'outcome');
    wrap.id = 'outcome-yes';
    wrap.hidden = true;

    var intro = el('div', 'outcome-intro');
    var h = el('h3', 'outcome-title', t('ui.yes.h'));
    h.tabIndex = -1;
    intro.appendChild(h);
    intro.appendChild(para(t('ui.yes.sub')));
    wrap.appendChild(intro);

    /* 3 - districts. Deliberately not a ZIP lookup; the reason is behind the fold. */
    var d = card(3, t('ui.district.h'), 'yes-district-h');
    d.appendChild(para(t('ui.district.p1', v)));
    d.appendChild(para(t('ui.district.p2')));
    d.appendChild(fold(t('ui.district.q'), [t('ui.district.a1'), t('ui.district.a2'), t('ui.district.a3')]));
    d.appendChild(para(t('ui.district.p3'), 'btn-note'));
    d.appendChild(linkRow(extLink('https://www.house.gov/representatives/find-your-representative',
      t('ui.district.link'), 'btn btn--plain')));
    wrap.appendChild(d);

    /* 4 - vote by mail */
    var mk = 'ui.mail.' + s.mail + '.';
    var m = card(4, t('ui.mail.h', v), 'yes-mail-h');
    m.appendChild(el('span', 'tag', t(mk + 'tag')));
    m.appendChild(para(t(mk + 'lead', v)));
    m.appendChild(list(keys(mk + 's', 5).map(function (k) { return t(k, v); }), true));
    m.appendChild(para(t('ui.mail.deadline', v)));
    m.appendChild(linkRow(extLink(s.absentee, t('ui.mail.link', v))));
    wrap.appendChild(m);

    /* 5 - in person */
    var p = card(5, t('ui.person.h'), 'yes-person-h');
    p.appendChild(para(t('ui.person.p')));
    var pl = el('ul', 'linklist');
    [[s.polling, t('ui.person.where')], [s.id, t('ui.person.id')]].forEach(function (pair) {
      var li = el('li');
      li.appendChild(extLink(pair[0], pair[1], 'btn btn--plain'));
      pl.appendChild(li);
    });
    p.appendChild(pl);
    wrap.appendChild(p);

    var after = el('div', 'aside-note');
    after.appendChild(el('h4', null, t('ui.again.h')));
    after.appendChild(para(t('ui.again.p')));
    wrap.appendChild(after);

    return wrap;
  }

  function buildNo(s, v) {
    var wrap = el('div', 'outcome');
    wrap.id = 'outcome-no';
    wrap.hidden = true;

    var intro = el('div', 'outcome-intro');
    var h = el('h3', 'outcome-title', t('ui.no.h'));
    h.tabIndex = -1;
    intro.appendChild(h);
    intro.appendChild(para(t('ui.no.sub')));
    wrap.appendChild(intro);

    var c = card(3, t('ui.no.card.h', v), 'no-signup-h');
    c.appendChild(el('h4', null, t('ui.ready.h')));
    c.appendChild(list(keys('ui.no.need', 4).map(function (k) { return t(k); }), false));
    c.appendChild(fold(t('ui.no.q'), [t('ui.no.a')]));
    c.appendChild(para(t('ui.no.today')));
    c.appendChild(linkRow(extLink(s.register, t('ui.no.link', v))));
    wrap.appendChild(c);

    var c4 = card(4, t('ui.no.after.h'), 'no-after-h');
    c4.appendChild(para(t('ui.no.after.p1')));
    c4.appendChild(para(t('ui.no.after.p2')));
    wrap.appendChild(c4);

    return wrap;
  }

  function render(s) {
    while (result.firstChild) result.removeChild(result.firstChild);
    var v = { state: I18N.stateName(s.abbr) };

    var h2 = el('h2', 'result-title', v.state);
    h2.id = 'result-title';
    result.appendChild(h2);
    result.appendChild(el('p', 'result-sub', t('ui.result.sub')));

    /* Step 2. Instructions first, the button last, on purpose: put it first
       and people click straight through without reading what they need. */
    var c2 = card(2, t('ui.step2.h'), 'step2-h');
    c2.appendChild(para(t('ui.step2.intro', v)));
    c2.appendChild(el('h4', null, t('ui.ready.h')));
    c2.appendChild(list([t('ui.ready.name'), t('ui.ready.dob'), t('ui.ready.zip')], false));
    c2.appendChild(fold(t('ui.safe.q'), [t('ui.safe.p1'), t('ui.safe.p2')]));
    c2.appendChild(para(t('ui.step2.open')));
    c2.appendChild(linkRow(extLink(s.status, t('ui.step2.link', v))));

    var q = el('p', 'branch-q');
    q.appendChild(el('strong', null, t('ui.step2.q')));
    c2.appendChild(q);

    var branch = el('div', 'branch');
    var yesBtn = el('button', 'is-yes');
    yesBtn.type = 'button';
    yesBtn.setAttribute('aria-expanded', 'false');
    yesBtn.setAttribute('aria-controls', 'outcome-yes');
    yesBtn.appendChild(icon('i-check', 26));
    yesBtn.appendChild(el('span', null, t('ui.branch.yes')));

    var noBtn = el('button', 'is-no');
    noBtn.type = 'button';
    noBtn.setAttribute('aria-expanded', 'false');
    noBtn.setAttribute('aria-controls', 'outcome-no');
    noBtn.appendChild(icon('i-x', 26));
    noBtn.appendChild(el('span', null, t('ui.branch.no')));

    branch.appendChild(yesBtn);
    branch.appendChild(noBtn);
    c2.appendChild(branch);
    result.appendChild(c2);

    var yes = buildYes(s, v);
    var no = buildNo(s, v);
    result.appendChild(yes);
    result.appendChild(no);

    function choose(which, moveFocus) {
      var showEl = which === 'yes' ? yes : no;
      var hideEl = which === 'yes' ? no : yes;
      var onBtn  = which === 'yes' ? yesBtn : noBtn;
      var offBtn = which === 'yes' ? noBtn : yesBtn;
      showEl.hidden = false;
      hideEl.hidden = true;
      onBtn.setAttribute('aria-expanded', 'true');
      offBtn.setAttribute('aria-expanded', 'false');
      current.branch = which;
      remember(s.abbr, which);
      if (moveFocus === false) return;
      var h = showEl.querySelector('.outcome-title');
      h.focus();
      h.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }
    yesBtn.addEventListener('click', function () { choose('yes'); });
    noBtn.addEventListener('click', function () { choose('no'); });
    chooseBranch = choose;

    /* Quiet footer, not a card: housekeeping should not compete with steps. */
    var foot = el('div', 'result-foot');
    foot.appendChild(el('h4', null, t('ui.foot.h')));
    foot.appendChild(para(t('ui.foot.p')));
    var forgetBtn = el('button', 'btn btn--plain btn--sm', t('ui.foot.btn'));
    forgetBtn.type = 'button';
    forgetBtn.addEventListener('click', startOver);
    foot.appendChild(forgetBtn);
    result.appendChild(foot);

    result.hidden = false;
  }

  /* ---- state selection ------------------------------------------------- */

  var buttons = Array.prototype.slice.call(grid.querySelectorAll('button[data-abbr]'));

  /* Labels and order follow the language: an alphabetical list is only
     alphabetical in the language it is read in. */
  function relabelGrid() {
    var lang = I18N.lang();
    buttons.forEach(function (b) {
      var name = I18N.stateName(b.getAttribute('data-abbr'));
      var span = b.querySelector('span:not(.abbr)');
      if (span) span.textContent = name;
      b.setAttribute('data-name', name.toLowerCase());
    });
    var items = buttons.map(function (b) { return b.parentNode; });
    items.sort(function (a, b) {
      return a.firstElementChild.getAttribute('data-name')
        .localeCompare(b.firstElementChild.getAttribute('data-name'), lang);
    });
    items.forEach(function (li) { grid.appendChild(li); });
  }

  function select(abbr, scroll, opts) {
    var s = byAbbr[abbr];
    if (!s) return;
    opts = opts || {};
    current = { abbr: abbr, branch: opts.branch || null, restored: !!opts.restored };
    buttons.forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-abbr') === abbr ? 'true' : 'false');
    });
    render(s);
    collapsePicker(s);
    if (opts.branch && chooseBranch) chooseBranch(opts.branch, false);
    remember(abbr, opts.branch || null);
    if (opts.restored) result.insertBefore(welcomeBack(s), result.firstChild);
    if (history.replaceState) history.replaceState(null, '', '#' + abbr);
    if (scroll) {
      result.focus();
      result.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }
  }

  /* Shown only when the page restored a previous visit, so nobody is left
     wondering why a state is already picked. */
  function welcomeBack(s) {
    var box = el('div', 'recall');
    var p = el('p');
    p.appendChild(el('strong', null, t('ui.recall.strong')));
    p.appendChild(document.createTextNode(t('ui.recall.p', { state: I18N.stateName(s.abbr) })));
    box.appendChild(p);
    var b = el('button', 'btn btn--plain', t('ui.recall.btn'));
    b.type = 'button';
    b.addEventListener('click', startOver);
    box.appendChild(b);
    return box;
  }

  /* Once a state is picked, 51 buttons are noise. Fold them into one line
     with a way back. */
  var pickerBody = document.getElementById('picker-body');
  var pickerSummary = document.getElementById('picker-summary');
  var pickerName = document.getElementById('picker-summary-name');
  var changeBtn = document.getElementById('change-state');

  function collapsePicker(s) {
    if (!pickerBody || !pickerSummary) return;
    pickerName.textContent = I18N.stateName(s.abbr);
    pickerBody.hidden = true;
    pickerSummary.hidden = false;
  }

  function expandPicker(focusFilter) {
    if (!pickerBody || !pickerSummary) return;
    pickerSummary.hidden = true;
    pickerBody.hidden = false;
    if (focusFilter && filter) filter.focus();
  }

  if (changeBtn) {
    changeBtn.addEventListener('click', function () {
      expandPicker(true);
      pickerBody.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  }

  function startOver() {
    forget();
    current = null;
    buttons.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
    result.hidden = true;
    while (result.firstChild) result.removeChild(result.firstChild);
    expandPicker(false);
    if (history.replaceState) history.replaceState(null, '', location.pathname + location.search);
    if (filter) { filter.value = ''; filter.dispatchEvent(new Event('input')); }
    var h1 = document.querySelector('h1');
    h1.tabIndex = -1;
    h1.focus();
    h1.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () { select(b.getAttribute('data-abbr'), true); });
  });

  /* ---- filter: matches the name in the current language, the English
     name, or the two-letter code ------------------------------------------ */

  function runFilter() {
    if (!filter) return;
    var q = filter.value.trim().toLowerCase();
    var shown = 0;
    buttons.forEach(function (b) {
      var abbr = b.getAttribute('data-abbr');
      var hay = abbr.toLowerCase() + ' ' + byAbbr[abbr].name.toLowerCase() + ' ' + (b.getAttribute('data-name') || '');
      var hit = !q || hay.indexOf(q) !== -1;
      b.parentNode.hidden = !hit;
      if (hit) shown++;
    });
    noMatch.hidden = shown !== 0;
    if (filterStatus) {
      filterStatus.textContent = shown === 0 ? t('ui.filter.none', { q: filter.value })
        : shown === 1 ? t('ui.filter.one') : t('ui.filter.many', { n: shown });
    }
  }
  if (filter) filter.addEventListener('input', runFilter);

  /* ---- language change: relabel the grid, rebuild what is on screen ------ */

  document.addEventListener('langchange', function () {
    relabelGrid();
    if (current) {
      var c = current;
      select(c.abbr, false, { branch: c.branch, restored: c.restored });
    }
    if (filter && filter.value) runFilter();
  });
  relabelGrid();

  /* ---- where to start ---------------------------------------------------
     A shared #OH link is an explicit request. The site also writes its own
     #XX on every pick, so a hash that matches the saved state is "ours" and
     the whole visit is restored; a hash for a different state is external
     and wins clean. Neither is trusted blindly: both are checked against the
     state list. */
  function hashState() {
    var h = (location.hash || '').replace('#', '').toUpperCase();
    return Object.prototype.hasOwnProperty.call(byAbbr, h) ? h : null;
  }

  window.addEventListener('hashchange', function () {
    var h = hashState();
    /* Only act on a change to a *different* state. A late hashchange for the
       state already on screen would otherwise rebuild the panel and close
       whichever branch the person had open. */
    if (h && (!current || current.abbr !== h)) select(h, true);
  });

  var hash = hashState();
  var saved = recall();

  if (hash && (!saved || hash !== saved.state)) {
    select(hash, false);
  } else if (saved) {
    select(saved.state, false, { restored: true, branch: saved.branch });
    /* Go to it, but never steal focus on load - a screen reader user should
       still land at the top of the page and hear what this site is. */
    result.scrollIntoView({ behavior: 'auto', block: 'start' });
  }
})();
