# Can I Vote?

A plain-language tool that helps someone find out whether they are registered to vote,
what to do if they are not, and how to vote by mail — by sending them to their own state's
official election page.

**It collects nothing.** No name, no date of birth, no address, no form, no cookie, no
analytics, no third-party request. Picking a state happens entirely in the browser.

## Why it does not "check your registration with AI"

It cannot, and neither can anything else. There is no national voter database; each of the
50 states and DC keeps its own list, and those lists are not openly queryable. Any site that
returns a registration status from a name and birthday is guessing, and a wrong guess can
cost someone their vote. So this site routes people to the only source that actually knows —
their state — and explains it in words a child can follow.

## Files

| File | What it is |
|---|---|
| `index.html` | The tool: state picker, then per-state steps |
| `about.html` | How it works, why no AI can do this, sources, mail-ballot table |
| `privacy.html` | What is collected (nothing) and why |
| `accessibility.html` | WCAG 2.2 AA statement, what was and was not tested |
| `states.js` | 51 states × 5 official links + mail-ballot category |
| `script.js` | Builds the per-state panel. No `innerHTML` anywhere |
| `styles.css` | Design system, light + dark |
| `fonts/` | Archivo Black + Public Sans, self-hosted (36 KB total) |
| `COMPLIANCE.md` | Legal triage memo — **not legal advice** |
| `i18n/en.json`, `es.json`, `he.json` | Every user-facing string, 316 keys per language — **edit these, not `strings.js`** |
| `strings.js` | Generated from `i18n/*.json` by `build.py` |
| `i18n.js` | Language runtime: applies strings, sets `lang`/`dir`, parses the tiny inline markup into DOM nodes |
| `lang-init.js` | 12 lines in `<head>` that set `lang`/`dir` before first paint, so Hebrew never flashes left-to-right |
| `tools/extract.py` | The one-time pass that keyed the HTML and produced `en.json` (re-runnable, idempotent) |
| `build.py` | Generates `strings.js` (with `--strict` completeness check) and the single-file artifact |
| `artifact.html` | Single-file build (fonts inlined). Published as a private Artifact |
| `test-artifact.html` | Standards-mode copy of the above, for local checking only |

> `artifact.html` is a fragment with no doctype — the Artifact host supplies one. Opening it
> directly in a browser triggers quirks mode, where tables stop inheriting colour and the dark
> theme looks broken. That is the test file's whole purpose; check `test-artifact.html` instead.

## Running it

```bash
python3 -m http.server 8927 --directory ~/Projects/can-i-vote-website
```

Registered in `~/.claude/launch.json` as `can-i-vote-website` on port 8927.

## Where the data came from

- **Per-state links** (check registration, register, mail ballot, polling place, voter ID) —
  [CanIVote.org](https://www.nass.org/can-I-vote), run by the National Association of
  Secretaries of State. Collected 2026-09-01.
- **Mail-ballot categories** — [NCSL Table 1](https://www.ncsl.org/elections-and-campaigns/table-1-states-with-no-excuse-absentee-voting),
  last updated 2026-07-17. 9 all-mail (incl. DC), 29 no-excuse, 13 excuse-required.

### Corrections applied to the source data

NASS's own list was not clean. These were found by health-checking all 255 links:

- **17 links** were plain `http://` and were upgraded to verified-working `https://`.
- **4 more** were upgraded to `https://` after confirming the TLS handshake succeeded
  (the `403`/`405` responses were bot-blocking, not missing HTTPS).
- **Maryland** (polling place, voter ID) was listed on `elections.state.md.us`, which no
  longer resolves over TLS. Repointed to the live `elections.maryland.gov` equivalents.
- **Iowa** (mail ballot, voter ID) returned real `404`s — the state restructured its site.
  Repointed to `sos.iowa.gov/voters/absentee-voting` and `.../voters/voter-id-faq`.

All 255 links are now HTTPS and resolve. The remaining `403`s in an automated sweep are
WAF bot-blocks; spot-checked in a real browser (Ohio, Wisconsin) and they load fine.

## Maintenance

**This is the part that matters.** Election links and rules go stale, and two states' links
were already stale at the authoritative source on build day. Re-verify before every major
election:

```bash
# re-scrape NASS and diff against states.js before each election cycle
```

If nobody owns this, the site will eventually send people to dead pages — the exact harm it
exists to prevent. See the "Highest-risk item" section of `COMPLIANCE.md`.

## Design notes

- **Palette:** Old Glory Blue `#0A3161` (text, borders, shadows) + Old Glory Red `#B31942`
  (calls to action) on white. Contrast audited: minimum 5.46:1 against a 4.5:1 requirement.
  The green/red "yes / no" status chips are a deliberate
  exception to the red-white-blue palette — green-means-yes is the most universally
  understood signal there is, and comprehension beats palette purity for this audience.
  They are never colour-alone (icon + text as well). Easy to change if you disagree.
- **Call-to-action placement:** every outbound link sits *after* its instructions, never
  before. Put the button first and people click straight through without reading what they
  need to have ready. There is an automated assertion for this — see below.
- **Stance:** sharp corners, 3px borders, hard offset shadows, Archivo Black over Public Sans.
  The heavy blocky affordances are a legibility choice, not just a style one.
- **Light theme only, by choice.** No `prefers-color-scheme` block and no `[data-theme]`
  stamps. Every colour is defined once on the bare `:root` and `body` paints its own
  background, so the page renders identically whatever theme the viewer's device is in —
  verified by stamping `data-theme="dark"` and confirming the page stays white.

## Languages

English, Spanish and Hebrew, switchable from the header on every page. The choice is
remembered on-device (`localStorage` key `caniv.lang`) and defaults to the browser's language.

- **One source of truth.** Every string lives in `i18n/<lang>.json` under a stable key. Static
  HTML carries `data-i18n="key"`; `script.js` asks `I18N.t(key, vars)`. `build.py --strict`
  refuses to build if `es` or `he` is missing a key or drops a `{placeholder}`.
- **Inline formatting without `innerHTML`.** Strings may contain `**bold**`, `_em_`, `` `code` ``
  and `[text](href)`. `i18n.js` parses that into real nodes; hrefs are accepted only if they are
  `https://…`, `#anchor`, or `name.html`, and external ones get `target`, `rel` and the
  screen-reader "(opens in a new tab)" suffix in the current language.
- **Hebrew is right-to-left.** The stylesheet uses logical properties throughout
  (`inset-inline-start`, `padding-inline-start`, `text-align:start`), so the step badges,
  fold chevrons, checklist boxes and card offsets all mirror. Archivo Black and Public Sans have
  no Hebrew glyphs, so `html[lang=he]` switches to self-hosted **Heebo** (variable 100–900,
  Hebrew + Latin subsets, 42 KB) with weight 900 standing in for the display face.
- **State names are localised and re-sorted** per language (Hebrew alphabetical order starts
  with אוהיו). The search box matches the localised name, the English name, or the code.
- **Switching language re-renders the tool in place** and keeps the chosen state and branch.
- **The translations were drafted by machine.** They read well to me, but voting instructions
  deserve a native-speaker review before wide distribution — the accessibility page says so
  in all three languages. Legal terms to double-check: *absentee ballot*, *precinct/ward*, and
  the mail-ballot category labels.
- **No JavaScript, no translation.** The `<noscript>` block carries a one-line pointer in all
  three languages to `vote.gov/es` and CanIVote.org.

## Flow and pacing

- **The "have these ready" lists are real checkboxes** (`<input type="checkbox">` with a
  full-width `<label>`, 44px hit area, custom ballot-box face). The earlier empty-box bullets
  looked tickable and weren't. Ticks are page-only — nothing new is written to storage. The
  three promises at the top use a *filled* tick (`.box--check`) so a statement and a task no
  longer share a glyph.
- **The 51-button grid folds away once a state is chosen** into "Your state: Texas —
  Change state". Fifty-one buttons above the instructions were the biggest single source of
  visual noise. "Change state" reopens the grid and focuses the search box.
- **One card per step.** The YES branch was one card with five sub-sections; it is now cards
  3, 4, 5 (district, mail, in person) with a quiet note after, and the NO branch is cards
  3 and 4. Each card ends with its link.
- **Reassurance and curiosity sit behind a `<details>` fold** — "Is it safe to type that
  in?", "Why don't you just ask for my ZIP code?", "What if I don't have any of these?" — so a
  step stays short for the person who just wants to do it, and the answer is one click away
  for the person who needs it.
- **The result panel sits on a tinted full-bleed band** so the white cards read as separate
  objects, and the state grid uses 2px borders instead of 3px so it recedes.

## Remembering where someone got to

The page saves two short strings on the visitor's own device — a state code and `yes`/`no` —
so a returning visitor lands back where they were.

**`localStorage`, not a cookie.** A cookie rides along with every request to the server; this
never leaves the browser. The operator cannot read it, cannot sell it, and could not hand it
over if asked. It is also why the site still has no cookie banner: there is no cookie.

Design decisions worth keeping:

- **Nothing identifying is stored** — a state is not a person.
- **Every read is validated** against the real state list, and the branch must be exactly
  `yes` or `no`. Storage is user-editable, so it is treated as untrusted input. Verified by
  writing `ZZ`, malformed JSON, and `<img src=x onerror=alert(1)>` into it: all three are
  discarded and the page carries on.
- **Every call is wrapped in try/catch.** Private windows and blocked site data make
  `localStorage` *throw*, not return null. Verified by stubbing it to throw `SecurityError` —
  the site works normally.
- **Two visible ways to erase it**: a "Not you? Start over" button in the welcome-back notice,
  and "Forget the state I picked" at the end of every result, framed for shared and public
  computers.
- **The restore is explained, not silent** — a returning visitor is told why a state is
  already selected, rather than being left to wonder.
- **Focus is never stolen on load.** The page scrolls to the restored result but leaves focus
  at the top, so a screen reader user still hears what the site is first.

Two bugs found and fixed while building this:

1. **A `#TX` hash change did nothing** when the page was already open, so shared state links
   silently failed. Added a `hashchange` handler.
2. **The saved branch could never be restored.** The site writes its own `#OH` into the URL on
   every pick, so after any reload the hash existed and always beat the saved value. Now a
   hash that *matches* the saved state is treated as the site's own and the full visit is
   restored; a hash for a *different* state is treated as an external link and wins.

## Why there is no ZIP-code district lookup

This was investigated properly rather than dismissed. The Census Bureau publishes
`tab20_cd11920_zcta520_natl.txt`, a ZIP-to-congressional-district crosswalk, and it was
downloaded and analysed. Two findings killed it:

1. **5,882 of 33,791 ZIP code areas (17.4%) span two or more congressional districts** —
   one spans four. For one user in six the honest output is "we cannot tell which".
2. **The file is dated October 2024.** Since then California, Missouri, North Carolina,
   Ohio, Texas and Utah have redrawn their congressional maps for the 2026 elections. A
   stored lookup would be confidently wrong across the two largest states, with no way to
   signal it.

A tool that silently returns a stale district is worse than no tool, because people believe
it — the same reasoning that rules out an AI guessing registration status. Since users must
visit their state's lookup anyway to answer the registration question, and that page shows
their districts using their exact street address, the district step now points them back to
a page they have already opened. That is fewer steps than asking for a ZIP code, and it is
correct.

## Deployment note

`frame-ancestors` cannot be set from a `<meta>` tag — browsers ignore it and log an error.
It was removed from the meta CSP. To get clickjacking protection, set these as **HTTP
headers** at the host:

```
Content-Security-Policy: frame-ancestors 'none'
X-Content-Type-Options: nosniff
Referrer-Policy: no-referrer
```

## Verified

- axe-core 4.13 (`wcag2a`, `wcag2aa`, `wcag22aa`): **0 violations, 0 incomplete** on all four
  pages in all three languages (including right-to-left), and on the result panel with each of
  the YES and NO branches expanded
- Contrast: all 19 token pairs audited by calculation, light and dark. Minimum 5.46:1
- Ordering: automated assertion that no instructional text is stranded after a call-to-action
  link, across all 6 CTAs in the result panel
- No horizontal overflow at 320 / 375 / 640 (= 1280 at 200% zoom) / 768 / 1024 / 1512
- Keyboard: 73 tabbable elements, skip link first, zero DOM-vs-visual order inversions,
  4px focus ring, hidden branches excluded from tab order
- Security: 0 inline handlers, 0 third-party requests, 0 cookies, CSP present, every
  `target="_blank"` carries `rel="noopener noreferrer"`. The one `localStorage` entry is
  validated on read and survives tampering and blocked-storage tests (see above)

**Not** tested with a real screen reader (VoiceOver/NVDA/JAWS), and not tested by people
with disabilities. Automated tooling catches roughly a third of WCAG issues.
