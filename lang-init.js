/* Runs in <head>, before the body paints: sets the document language and
   direction so a Hebrew visitor never sees a left-to-right flash. i18n.js
   does the rest once the page has parsed. Same rules as I18N.detect(). */
(function () {
  var ok = { en: 1, es: 1, he: 1 }, lang = null;
  try { var v = localStorage.getItem('caniv.lang'); if (ok[v]) lang = v; } catch (e) {}
  if (!lang) {
    var list = navigator.languages || [navigator.language || ''];
    for (var i = 0; i < list.length && !lang; i++) {
      var b = String(list[i]).slice(0, 2).toLowerCase();
      if (ok[b]) lang = b;
    }
  }
  lang = lang || 'en';
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
})();
