#!/usr/bin/env python3
"""One-time extraction: key every translatable block in the four HTML files
and write the English strings to i18n/en.json. Inline markup becomes a tiny
markup: **bold**, _em_, `code`, [text](href). Re-runnable: already-keyed
elements are left alone."""
import json, re, sys, os
from collections import OrderedDict

os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PAGES = [("index.html","index"),("about.html","about"),("privacy.html","privacy"),("accessibility.html","a11y")]
strings = OrderedDict()
by_text = {}
counts = {}

def key_for(page, tag, text):
    if text in by_text: return by_text[text]
    counts[(page,tag)] = counts.get((page,tag),0)+1
    k = f"{page}.{tag}{counts[(page,tag)]}"
    strings[k] = text; by_text[text] = k
    return k

def to_markup(inner):
    t = inner
    t = re.sub(r'<span class="sr-only">\s*\(opens in a new tab\)\s*</span>', '', t)
    t = re.sub(r'<a href="([^"]+)"[^>]*>(.*?)</a>', r'[\2](\1)', t, flags=re.S)
    t = re.sub(r'<strong[^>]*>(.*?)</strong>', r'**\1**', t, flags=re.S)
    t = re.sub(r'<em>(.*?)</em>', r'_\1_', t, flags=re.S)
    t = re.sub(r'<span class="date">(.*?)</span>', r'_\1_', t, flags=re.S)
    t = re.sub(r'<code>(.*?)</code>', r'`\1`', t, flags=re.S)
    t = re.sub(r'\s+', ' ', t).strip()
    if '<' in t: raise SystemExit(f"unhandled markup: {t[:120]}")
    return t

CUT = [r'<ul class="state-grid".*?</ul>', r'<noscript>.*?</noscript>', r'<svg.*?</svg>',
       r'<div class="picker-summary".*?</div>']
BLOCK = r'<(h1|h2|h3|h4|h5|p|li|label|summary|caption|th|td|title)(\s[^>]*)?>(.*?)</\1>'
CATS = {"California":"all_mail","Alaska":"no_excuse","Alabama":"excuse"}

for fn, page in PAGES:
    src = open(fn).read()
    holes = []
    def cut(m):
        holes.append(m.group(0)); return f"\x00{len(holes)-1}\x00"
    for pat in CUT: src = re.sub(pat, cut, src, flags=re.S)

    def block(m):
        tag, attrs, inner = m.group(1), m.group(2) or "", m.group(3)
        if 'data-i18n' in attrs or 'class="box' in inner: return m.group(0)
        if tag == 'td':
            first = inner.strip().split(',')[0]
            if first in CATS:
                return f'<td data-i18n-states="{CATS[first]}">{inner}</td>'
        text = to_markup(inner)
        if not text: return m.group(0)
        k = key_for(page, tag, text)
        return f'<{tag}{attrs} data-i18n="{k}">{inner}</{tag}>'
    src = re.sub(BLOCK, block, src, flags=re.S)

    # plain spans left standing on their own (brand name, trust promises)
    def span(m):
        k = key_for(page, "span", to_markup(m.group(1)))
        return f'<span data-i18n="{k}">{m.group(1)}</span>'
    src = re.sub(r'<span>([^<]+)</span>', span, src)

    # nav links live directly in <nav>
    def navlink(m):
        if 'data-i18n' in m.group(1): return m.group(0)
        k = key_for(page, "a", m.group(2).strip())
        return f'<a{m.group(1)} data-i18n="{k}">{m.group(2)}</a>'
    src = re.sub(r'<a( href="(?:index|about|privacy|accessibility)\.html")>([^<]+)</a>', navlink, src)
    src = re.sub(r'<a( class="skip" href="#main")>([^<]+)</a>', navlink, src)

    # attributes
    def attr(m):
        name, val = m.group(1), m.group(2)
        k = key_for(page, name.replace('-',''), val)
        return f'{name}="{val}" data-i18n-attr="{name}:{k}"'
    src = re.sub(r'\b(placeholder|aria-label)="([^"]+)"(?![^>]*data-i18n-attr)', attr, src)
    src = re.sub(r'<meta name="description" content="([^"]+)">',
                 lambda m: f'<meta name="description" content="{m.group(1)}" data-i18n-attr="content:{key_for(page,"desc",m.group(1))}">', src)

    for i,h in enumerate(holes): src = src.replace(f"\x00{i}\x00", h)
    open(fn,"w").write(src)

json.dump(strings, open("i18n/en.json","w"), ensure_ascii=False, indent=1)
print(f"{len(strings)} unique strings -> i18n/en.json")
