/* Can I Vote? — language runtime.
   STRINGS (strings.js) holds every user-facing string for en / es / he.
   Static text is swapped in place via data-i18n keys; script.js asks for its
   own strings with I18N.t(). Nothing here uses innerHTML: the small inline
   markup (**bold**, _em_, `code`, [text](href)) is parsed into real nodes,
   and link targets are checked before they are set. */
(function () {
  'use strict';
  if (typeof STRINGS === 'undefined') return;

  var SUPPORTED = ['en', 'es', 'he'];
  var RTL = { he: true };
  var KEY = 'caniv.lang';
  var lang = detect();

  function detect() {
    try { var v = localStorage.getItem(KEY); if (SUPPORTED.indexOf(v) >= 0) return v; } catch (e) {}
    var list = navigator.languages || [navigator.language || ''];
    for (var i = 0; i < list.length; i++) {
      var b = String(list[i]).slice(0, 2).toLowerCase();
      if (SUPPORTED.indexOf(b) >= 0) return b;
    }
    return 'en';
  }

  function raw(key) {
    var s = STRINGS[lang] && STRINGS[lang][key];
    if (s == null) s = STRINGS.en && STRINGS.en[key];
    return s;
  }

  function t(key, vars) {
    var s = raw(key);
    if (s == null) return key;
    if (vars) s = s.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; });
    return s;
  }

  function stateName(abbr) {
    var s = raw('states.' + abbr);
    if (s != null) return s;
    if (typeof STATES !== 'undefined') {
      for (var i = 0; i < STATES.length; i++) if (STATES[i].abbr === abbr) return STATES[i].name;
    }
    return abbr;
  }

  /* ---- inline markup -> DOM --------------------------------------------- */
  var TOKEN = /\*\*(.+?)\*\*|`(.+?)`|\[(.+?)\]\(([^)\s]+)\)|(?:^|(?<=[\s(]))_(.+?)_(?=[\s.,;:)!?]|$)/g;

  function safeHref(h) {
    if (/^https?:\/\//i.test(h)) return 'ext';
    if (/^#[\w-]*$/.test(h) || /^[a-z0-9-]+\.html(#[\w-]*)?$/.test(h)) return 'int';
    return null;
  }

  function rich(s) {
    var frag = document.createDocumentFragment();
    var last = 0, m;
    TOKEN.lastIndex = 0;
    while ((m = TOKEN.exec(s))) {
      if (m.index > last) frag.appendChild(document.createTextNode(s.slice(last, m.index)));
      var node;
      if (m[1] != null) { node = document.createElement('strong'); node.textContent = m[1]; }
      else if (m[2] != null) { node = document.createElement('code'); node.textContent = m[2]; }
      else if (m[3] != null) {
        var kind = safeHref(m[4]);
        if (!kind) { node = document.createTextNode(m[3]); }
        else {
          node = document.createElement('a');
          node.href = m[4];
          node.textContent = m[3];
          if (kind === 'ext') {
            node.target = '_blank';
            node.rel = 'noopener noreferrer';
            var sr = document.createElement('span');
            sr.className = 'sr-only';
            sr.textContent = t('ui.newtab');
            node.appendChild(sr);
          }
        }
      }
      else { node = document.createElement('em'); node.textContent = m[5]; }
      frag.appendChild(node);
      last = TOKEN.lastIndex;
    }
    if (last < s.length) frag.appendChild(document.createTextNode(s.slice(last)));
    return frag;
  }

  function setRich(el, s) {
    while (el.firstChild) el.removeChild(el.firstChild);
    el.appendChild(rich(s));
  }

  /* ---- apply ------------------------------------------------------------- */
  function apply(next, persist) {
    if (SUPPORTED.indexOf(next) < 0) next = 'en';
    lang = next;
    if (persist) { try { localStorage.setItem(KEY, lang); } catch (e) {} }

    var root = document.documentElement;
    root.lang = lang;
    root.dir = RTL[lang] ? 'rtl' : 'ltr';

    var nodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      var s = raw(nodes[i].getAttribute('data-i18n'));
      if (s == null) continue;
      if (nodes[i].tagName === 'TITLE') nodes[i].textContent = s; else setRich(nodes[i], s);
    }

    var attrs = document.querySelectorAll('[data-i18n-attr]');
    for (i = 0; i < attrs.length; i++) {
      var spec = attrs[i].getAttribute('data-i18n-attr').split(':');
      var v = raw(spec[1]);
      if (v != null) attrs[i].setAttribute(spec[0], v);
    }

    if (typeof STATES !== 'undefined') {
      var cells = document.querySelectorAll('[data-i18n-states]');
      for (i = 0; i < cells.length; i++) {
        var cat = cells[i].getAttribute('data-i18n-states');
        var names = STATES.filter(function (x) { return x.mail === cat; })
          .map(function (x) { return stateName(x.abbr); })
          .sort(function (a, b) { return a.localeCompare(b, lang); });
        cells[i].textContent = names.join(t('ui.states.sep'));
      }
    }

    var btns = document.querySelectorAll('.lang button[data-lang]');
    for (i = 0; i < btns.length; i++) {
      btns[i].setAttribute('aria-pressed', btns[i].getAttribute('data-lang') === lang ? 'true' : 'false');
    }

    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: lang } }));
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.lang button[data-lang]');
    if (!b) return;
    apply(b.getAttribute('data-lang'), true);
    b.focus();
  });

  window.I18N = { t: t, rich: rich, setRich: setRich, stateName: stateName, apply: apply,
                  lang: function () { return lang; }, supported: SUPPORTED.slice() };

  apply(lang, false);
})();
