# Compliance notes — Can I Vote? (drafted 1 September 2026)

**This is not legal advice and it is not a clearance.** It is a triage memo listing what
looks like it applies to this specific site, what was built to address it, and what a lawyer
still needs to look at.

## Assumptions

Wrong assumptions here invalidate everything below. Confirm each one:

- The site is a **free, nonpartisan, informational** resource. It sells nothing, takes no
  donations, and endorses no candidate, party, or ballot measure.
- It is **not** operated by a government body, a campaign, a PAC, or a 501(c)(4) doing
  express advocacy. If any of that changes, this memo is void — campaign-finance and state
  electioneering rules would engage immediately.
- It **collects no personal data of any kind** and has no backend, no forms, no database,
  no analytics, no cookies, and no third-party requests. This is the single most important
  fact in this memo; most of the privacy analysis follows from it.
- It writes **one `localStorage` entry** on the visitor's own device — a two-letter state
  code and the string `yes` or `no` — purely so a returning visitor lands where they left
  off. It is never transmitted, contains no identifier, and the site provides two visible
  controls to erase it.
- It **never collects, handles, transmits, or assists with completing voter registration
  forms.** It only links out to official state systems.
- Audience is US-wide, all 50 states plus DC.

## Likely applies

### ADA Title III — accessibility (highest practical risk)
A public-facing informational website is routinely treated as a place of public accommodation.
There is no ADA technical standard, so WCAG 2.2 AA is the working benchmark used in DOJ
settlements and serial-plaintiff litigation. Voter-information sites are a sympathetic
target and inaccessibility here has real consequences.
**Built:** WCAG 2.2 AA throughout, verified with axe-core (zero violations across all four
pages) plus manual keyboard and reflow testing. A public accessibility statement with a
contact route is published at `accessibility.html`.
*Source: DOJ ADA Title III guidance; WCAG 2.2 (W3C Recommendation). Checked 2026-09-01.*

### Section 508 / ADA Title II — only if a public entity adopts this
Not currently triggered. If a state, county, school, library, or federal grantee ever hosts
or distributes this site, Title II's WCAG 2.1 AA rule and its fixed compliance deadlines
apply, and Section 508 applies if federal money is involved. **Re-check before any such
partnership.**

### Federal election law — 52 U.S.C. § 20511
Prohibits knowingly and willfully providing false information about voter registration or
voting in order to deprive someone of the right to vote. Accurate, sourced, official-link-only
information is the opposite of what this targets, but **accuracy is a legal exposure here in
a way it is not on a normal marketing site.**
**Built:** every substantive claim is sourced to NASS or NCSL with the date it was collected;
all 255 outbound links resolve to official state election systems; the site states plainly
that it cannot determine registration status and that the state's own page is authoritative
if the two disagree.

### FTC Act — deceptive claims
No testimonials, reviews, ratings, endorsements, or performance claims appear anywhere on the
site, so the fake-review rule and endorsement guides have nothing to attach to.
**Built:** the site explicitly disclaims the capability users most expect (an AI checking
their registration) rather than implying it.

### Privacy law (CCPA/CPRA and state analogues, GDPR/UK GDPR)
These regimes attach to processing personal information. **This site processes none.** There
is no form, no cookie, no analytics, no tracker, and no third-party request — fonts and
scripts are self-hosted, verified in the network log.

The one `localStorage` entry deserves its own note, because storage rules (ePrivacy Article
5(3) and its state analogues) are drafted around *terminal-equipment access* rather than
personal data, so "it isn't personal data" is not by itself the end of the analysis. The
argument that it needs no consent banner is:

- It stores a state code and `yes`/`no` — **no identifier**, nothing that singles anyone out.
- It is **never transmitted**. It is not readable by the operator, so it cannot be used to
  recognise a returning visitor across sessions in any way the operator can observe.
- It exists **solely to deliver the functionality the visitor asked for** — resuming where
  they left off — which is the shape of the strictly-necessary/functional carve-out.
- It is **disclosed in plain language** on the privacy page and **erasable from two visible
  buttons** in the interface.

That reasoning is sound for a purely functional, non-transmitted, non-identifying value, but
it is a judgment call rather than a certainty — see the open questions.
**Built:** `privacy.html` describes the actual (empty) collection rather than reciting
boilerplate. A boilerplate policy describing collection that does not happen would be worse
than none.
**Residual:** the host's own server logs (typically including IP addresses) are outside the
site's control. This is disclosed. Choose a host whose logging practices you are comfortable
publishing.

### CAN-SPAM / TCPA / COPPA
Not triggered. No email capture, no SMS, no targeting of children, no data collection at all.

### Third-party voter registration organization (TPVRO) laws
Several states — Florida, Texas, Georgia and others — impose registration, training, deadline,
and penalty regimes on organizations that **collect or handle** voter registration
applications. Linking to a state's own online system does not trigger these.
**This is a hard boundary: the moment this site collects, stores, prefills, or forwards a
registration form, those regimes engage in every state where it operates, with real penalties.**

## Built into this site

| Item | Where |
|---|---|
| WCAG 2.2 AA build + published accessibility statement | all pages, `accessibility.html` |
| Accurate privacy policy describing zero collection | `privacy.html` |
| "Not a government website" disclaimer | header notice on `index.html`, footer on every page |
| "Not connected to any party or campaign" | same |
| "Not legal advice" | footer on every page |
| "We cannot tell you if you are registered — only your state can" | footer, hero, `about.html` |
| Explicit statement that no AI can check registration | `index.html` "Why we never ask", `about.html` |
| Every claim sourced with a date | `index.html` sources section, `about.html` |
| "Believe your state's page, not us" precedence rule | `index.html` sources section |
| Explanation of non-.gov official domains (anti-phishing trust) | `about.html`, `index.html` |
| No PII collected anywhere | by construction — the site has no form |
| Local-only progress memory, disclosed and erasable from two visible buttons | `script.js`, `privacy.html` |
| Language preference stored locally, disclosed on the privacy page in all three languages | `i18n.js`, `privacy.html` |
| Machine-translation disclosure | `accessibility.html` (`a11y.li10`) |
| CSP, no inline handlers, no third-party requests, `noopener noreferrer`, `no-referrer` | all pages |
| Calls to action placed after their instructions, never before | `script.js`, asserted in test |

**Deployment gap:** `frame-ancestors` is ignored in a `<meta>` CSP and was removed. Set it,
`X-Content-Type-Options` and `Referrer-Policy` as real HTTP headers at the host — see README.

## Open questions for a lawyer

1. **Operator identity and disclaimers.** The site currently says who it is *not*. Once a real
   person or organization stands behind it, a named operator and contact route should be
   added, and the disclaimers reviewed against that entity's actual status (individual,
   nonprofit, 501(c)(3)). A 501(c)(3) has nonpartisanship constraints this site's content
   already respects, but that should be confirmed rather than assumed.
2. **State-specific election communication rules.** A handful of states regulate voter
   outreach and communications more tightly than federal law. Nothing here appears to be
   express advocacy, but a 50-state review is beyond what can be verified from the web.
3. **Accuracy maintenance duty.** Election links and rules go stale, and stale voting
   information is the main real-world risk this site carries. Maryland's and Iowa's links
   were already stale *at the source* when this was built. Decide who re-verifies, how
   often, and what happens if nobody does. Consider whether a visible "last verified" date
   and a stale-data warning should appear on the page itself.
4. **Whether the mail-ballot categories are safe to state at all.** The three-way
   all-mail / no-excuse / excuse-required classification is accurate as of NCSL's
   2026-07-17 table but is a simplification, and several states have exceptions. Every
   state card links to its official page, and the site says the official page wins. Confirm
   that is a sufficient hedge, or drop the classification and link only.
5. **Translations.** Spanish and Hebrew were machine-drafted. Inaccurate voting instructions
   in a language the operator cannot read are exactly the § 20511 exposure this memo worries
   about, and Spanish-language voting materials are additionally covered by Voting Rights Act
   § 203 expectations in many jurisdictions (accuracy and equivalence with the English). Have
   each language reviewed by a native speaker with election-administration familiarity before
   public launch; the accessibility page already discloses the machine drafting.
6. **The `localStorage` entries.** There are now two: progress (`caniv.progress.v1`) and
   language (`caniv.lang`, a two-letter code). The reasoning below applies to both.
   **The `localStorage` entry.** Confirm the no-consent-banner reasoning above holds for the
   jurisdictions this site actually serves. The value is non-identifying, never transmitted,
   functional, disclosed and user-erasable, which is about as defensible as browser storage
   gets — but ePrivacy-style rules regulate storage access rather than personal data, and a
   cautious reviewer may still want a notice. If consent is ever judged necessary, the fix is
   small: gate the `remember()` call, since the site works identically without it.
7. **District information.** The site deliberately does not derive congressional districts
   from ZIP codes. The Census crosswalk was evaluated and rejected: 17.4% of ZIP areas span
   multiple districts, and the current file predates the 2025-26 redistricting in six states.
   Stating a wrong district is squarely the kind of inaccuracy § 20511 is concerned with, so
   this decision should be revisited only with current, authoritative boundary data.
8. **Hosting and logging.** Server logs are the only place any visitor data could exist.
   Confirm the chosen host's retention and disclosure practices match `privacy.html`.

## Out of scope

Entity formation and registration, tax-exempt status, insurance, trademark on the name
"Can I Vote?" (note: **CanIVote.org is NASS's own brand — the name of this site is close
enough that it should be reviewed before any public launch**), employment law, contracts,
and anything that cannot be determined from a website.

## Highest-risk item

**Link and rule accuracy over time.** Two states' official links were already dead or stale at
the authoritative source on the day this was built. A voting site that sends people to a dead
page, or states a rule that changed, causes exactly the harm it exists to prevent. This needs
an owner and a schedule, not a one-time build.
