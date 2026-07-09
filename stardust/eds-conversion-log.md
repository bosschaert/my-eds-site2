# WKND — stardust:deploy conversion log

Source prototype: `home-C-cinematic.html` (Variant C — cinematic editorial).
Target: EDS project `of1-labs/stardust-dd30e620`, branch `main`.

## Runtime

- **Runtime: vanilla-eds** (`scripts/aem.js` + `scripts/scripts.js`, block-based
  `header`/`footer` loading `/nav` and `/footer` fragments). NOT AuthorKit.
  Deliberately kept the vanilla runtime rather than bootstrapping AuthorKit — the
  DA content model given (index/nav/footer authored to DA, block-based chrome)
  matches vanilla EDS exactly, and re-cloning after a git-index corruption argued
  for minimal repo churn.
- `blockWrapperClass: block` — `decorateBlock` adds `.block`; block CSS scopes
  `.<name>.block` for layout roots and `.<name> .child` for inner elements.
- Buttons: vanilla `decorateButtons` — `<strong><a>` → `.button.primary`,
  `<em><a>` → `.button.secondary`, `<strong><em><a>` → `.button.accent`.
- Body gate: vanilla `body{display:none} body.appear{display:block}` (aem.js adds
  `.appear`) — left intact (this is the runtime's own gate, not the banned
  boilerplate port).

## Section → block map (single page)

| Prototype `<section>` | Block | Tier | Notes |
|---|---|---|---|
| `.hero` | `hero` | template-slotted bespoke | full-bleed image + scrim; eyebrow/h1/lede/CTA |
| `.frame` | `frame` | template-slotted bespoke | full-bleed featured story band, dark text panel |
| `.magazine` | `magazine` | reconstructive | section head + 2 article cards + "All Articles" CTA |
| `.destinations` | `destinations` | reconstructive | head + 4-tile grid + "View All Trips" + routes duo |
| header chrome | `header` (custom) | — | utility bar + sticky nav + search; CSS drawer for mobile |
| footer chrome | `footer` (custom) | — | dark footer: blurb + 2 link columns + bottom social bar |

Header/footer blocks render the WKND chrome DOM (logo SVG inline) and pull
authorable link groups from `/nav` and `/footer` fragments. Prototype header JS
(menu toggle) re-implemented as a CSS `:checked` checkbox drawer (fragment JS is
inert). Parallax + scroll-reveal + Lenis smooth-scroll from the prototype are
enhancement-only and NOT lifted (content renders visible).

## Fonts (self-hosted, SIL OFL)

- Asar (display / headings) → fallback Times New Roman, metric-matched.
- Source Sans 3 (body, incl. italic) → fallback Arial, metric-matched
  (fontsource calibration: size-adjust 96.35%, ascent 108.02%, descent 29.93%).
- woff2 already fetched into `styles/fonts/`; declared in `styles/styles.css`
  only (no font lines in `head.html`). `styles/fonts.css` emptied of Roboto.
- No proprietary faces → no licensing alert needed.

## Images

Editorial images committed to repo `media/` (serve from code bus). Authored in
content as fully-qualified `https://main--stardust-dd30e620--of1-labs.aem.page/media/<file>`
`<img>` with alt text — ingestable, not repo-relative `/img/`.

## Buttons — prototype → EDS

- `.btn` (yellow fill) → `<strong><a>` → `.button.primary` (yellow chip + arrow).
- `.btn.mag` (blue underline) → `<em><a>` → `.button.secondary` (blue text link).
- `.btn.ghost` (yellow underline, on dark) → per-block CSS override on the
  cloned anchor (frame ghost link, magazine "All Articles").
- On dark surfaces (hero, frame) the secondary link is re-colored white/accent
  via block-scoped CSS.

## Verification (harness, no DA)

Self-contained render harness (data: URL, comment-stripped block JS + inlined
local media). Full decode, 0 errors:
- 1 `<h1>` (hero), 3 `<h2>` (frame + 2 section heads), 8 `<h3>` (2 articles +
  4 tiles + 2 routes).
- hero 2 CTAs, frame 1 CTA, magazine 2 articles + head + CTA,
  destinations 4 tiles + 2 routes (adv route "Then come with us.") + head.
- 8 images load; visual screenshot confirms fidelity to the prototype.

Token-completeness gate: clean. Absolute-URL-in-blocks gate: clean.

## Anti-patterns avoided

- One block per distinct section (no speculative "hero with variants").
- No section-metadata style classes; per-block CSS paints each section.
- No shared utility modules; SVG inline in header/footer JS.
- Buttons via the decorator convention + minimal per-block overrides.
- `img { height: auto }` in the reset (EDS pipeline width/height attrs).
- Scroll-reveal `opacity:0` NOT lifted (prototype script does not run in EDS).
