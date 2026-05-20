# Notes — 001 home-proposed

## Phase: Capture

- Source: `/Users/bosschae/proj/stardust/stardust/prototypes/home-proposed.html` (Stardust 0.2.0 prototype of olive.ie home).
- Local file. Vendored 1 logo (`assets/logo.png`) and 6 product photos (`assets/media/*.jpeg|.jpg`) from `../current/assets/`.
- All CSS is inline (one `<style>` block, lines 99-739). Includes `@import url('https://fonts.googleapis.com/css2?...')` for Barlow Semi Condensed + Raleway.
- One inline `<script>` (lines 1067-1087) — mobile hamburger toggle.
- No external JS or library refs.

## Phase: Analyze

### Structural map

```
Line       Element                                                Disposition
─────      ─────────────────────────────────────────────────────  ──────────────────────────
1-91       <!-- stardust:provenance ... -->                       strip (drop comment)
92         <html lang="en-IE">                                    template wrapping
93-98      <head> (charset, viewport, title, desc, icon link)     title/desc → DA metadata; icon → vendor-rewritten
99-739     <style> ... </style>                                   → /styles/home-proposed.css
741        <body>                                                  
743        <a class="skip-link" href="#main-content">              HEADER fragment (first body child)
748-774    <header data-section="header" ...>                     HEADER fragment
776        <main id="main-content">                               TEMPLATE
781-800     section[data-section="hero"]                          Section 1
805-860     section[data-section="menu-strip"]                    Section 2
865-887     section[data-section="visit-us"]                      Section 3
892-910     section[data-section="cta-band"]                      Section 4
915-972     section[data-section="gift-hampers"]                  Section 5
977-994     section[data-section="closer"]                        Section 6
996        </main>
1001-1065  <footer data-section="footer" ...>                     FOOTER fragment
1067-1087  <script> mobile-nav toggle                             → /scripts/home-proposed-animations.js
1089       </body>
```

### Generator-specific findings

- **Placeholder convention.** Stardust 0.2.0 in this file uses the **0.3.0-style attribute** (`<span data-placeholder="true" ...>` with nested `placeholder-eyebrow` + `placeholder-shape` spans). Marker = `data-placeholder="true"`. Each placeholder also carries `data-placeholder-type` (paragraph / price / address / hours / phone) and `data-placeholder-source` provenance.

- **Placeholders to skip (not authorable, render as-is via `data-slot-skip="placeholder"`):**
  - `menu-strip .lede` body
  - `visit-us .visit-body`
  - `cta-band .band-body`
  - `gift-hampers` — 3× price placeholders (one per hamper card)
  - `closer .closer-body`
  - `footer` — 3× inline placeholders (address, hours, phone)

  Total: 10 placeholders.

- **First-class collisions: NONE.** Every `<section>` has a unique `data-section` value but **no class attribute at all**. The overlay engine requires `section[class]` with a unique first class to match DA blocks. **Action**: prepend the `data-section` value as the first class on each section (`hero`, `menu-strip`, `visit-us`, `cta-band`, `gift-hampers`, `closer`). All six exist nowhere as a `.classname` CSS selector — confirmed via grep — so no layout collision.

- **`<main>` exists** (line 776). No synthesis needed.

- **Footer's `<footer data-section="footer">` is the only `<footer>` in the file.** Substrate's lifecycle rule (`footer > .footer { visibility: hidden }`) shouldn't catch it directly because the fragment's `<footer>` wraps a `.container` (not `.footer`). Verify during round-trip.

### Slot opportunities

#### `hero`
| Slot | Type | Selector |
|---|---|---|
| eyebrow | text | `.hero-text .eyebrow` |
| title | text | `.hero-text h1` |
| cta-primary | link | `.hero-text .btn-primary` |
| cta-secondary | link | `.hero-text .text-link` |
| photo | image | `.hero-photo img` |

#### `menu-strip`
| Slot | Type | Selector |
|---|---|---|
| eyebrow | text | `.menu-head .eyebrow` |
| title | text | `.menu-head h2` |
| menu-1.name | text | `.menu-row:nth-child(1) .menu-name` |
| menu-1.price | text | `.menu-row:nth-child(1) .menu-price` |
| ... (×8 menu items) | ... | ... |
| menu-8.name / menu-8.price | text | `.menu-row:nth-child(8) .*` |
| cluster-1 | link | `.menu-cluster a:nth-of-type(1)` |
| cluster-2 | link | `.menu-cluster a:nth-of-type(2)` |
| cluster-3 | link | `.menu-cluster a:nth-of-type(3)` |

The `.menu-head .lede` body is a placeholder → `data-slot-skip="placeholder"`.

#### `visit-us`
| Slot | Type | Selector |
|---|---|---|
| eyebrow | text | `.visit-text .eyebrow` |
| title | text | `.visit-text h2` |
| cta | link | `.visit-text .text-link` |
| photo | image | `.visit-photo img` |

The `.visit-body` is a placeholder → skip.

#### `cta-band`
| Slot | Type | Selector |
|---|---|---|
| eyebrow | text | `.band-text .eyebrow` |
| title | text | `.band-text h2` |
| cta | link | `.band-cta .btn-on-sage` |

The `.band-body` is a placeholder → skip.

#### `gift-hampers`
| Slot | Type | Selector |
|---|---|---|
| eyebrow | text | `.hampers-head .eyebrow` |
| title | text | `.hampers-head h2` |
| see-all | link | `.hampers-head .text-link` |
| card-1.photo | image | `.hamper-card:nth-of-type(1) .hamper-photo img` |
| card-1.name | text | `.hamper-card:nth-of-type(1) .hamper-name` |
| card-2.photo | image | `.hamper-card:nth-of-type(2) .hamper-photo img` |
| card-2.name | text | `.hamper-card:nth-of-type(2) .hamper-name` |
| card-3.photo | image | `.hamper-card:nth-of-type(3) .hamper-photo img` |
| card-3.name | text | `.hamper-card:nth-of-type(3) .hamper-name` |

**Container-vs-children rule (learnings 2026-05-19):** the card `<a>` wraps photo + name. Slotting both children means we cannot also slot the `<a>` (its `innerHTML` overwrite would destroy nested slot markers). The product URL (`<a href="...">`) therefore stays **static** in the template. The 3 placeholders for price are kept as `data-slot-skip="placeholder"`.

#### `closer`
| Slot | Type | Selector |
|---|---|---|
| photo | image | `.closer-photo img` |
| eyebrow | text | `.closer-caption .eyebrow` |
| title | text | `.closer-caption h2` |

The `.closer-body` is a placeholder → skip.

### Head-level resources to lift

The source `<head>` has minimal content. Only one resource is worth lifting into the template top:

- `<link rel="icon" href="/assets/logo.png">` (rewrite vendored path)

`title` and `description` go into the DA `metadata` block (Generate phase emits them). The Google Fonts import is already inside the inline `<style>` and will survive the CSS extraction.

### Asset strategy

**Vendor.** Source is local file:// path — production preview host cannot reach the assets. All references go to root-relative `/assets/...` in template/fragments/CSS. DA cells use **absolute branch URLs** (`https://main--my-eds-site2--bosschaert.aem.page/assets/...`) per Media Bus requirement (learnings 2026-05-19).

Assets to copy from project `input/assets/` → repo `/assets/`:
- `assets/logo.png`
- `assets/media/Fresh-Baked-Arbutus-Sourdough-b1a86a.jpg`
- `assets/media/IMG_4941-330df0.jpeg`
- `assets/media/IMG_4942-d89293.jpeg`
- `assets/media/IMG_4943-35a46c.jpeg`
- `assets/media/Skerries-HArbour-043447.jpeg`
- `assets/media/WhatsApp-Image-2021-05-11-at-13.59.46-d5f29b.jpeg`

### Strip decisions

- Drop the stardust:provenance HTML comment (lines 2-91) when emitting template.
- Drop the section-boundary comments (`<!-- =============... -->`) — cosmetic only.

### CSS strategy

- Extract inline `<style>` (lines 99-739) verbatim to `/styles/home-proposed.css`. Includes `@import url(google fonts)` at the top.
- No `<link>` to Google Fonts in the head — the `@import` inside the CSS file handles it.

### Decisions surfaced by analysis

1. Add `class` to each `<section>` using the value of its `data-section` as the first (and only) class — required for the engine to match.
2. Vendor the 7 assets (1 logo + 6 photos) under `/assets/` in the repo.
3. Drop the stardust:provenance HTML comment from emitted template.
4. The product URL on each hamper card stays static (container-vs-children rule).
5. 8 menu items → 16 slots (name + price each). Easy and gives full editability.
6. Footer is purely static — no authorable slots (per skill's "header/footer remain static repository fragments" rule).

## Phase: Generate

- 45 `[data-slot]` markers across 6 sections (hero 5, menu-strip 21, visit-us 4, cta-band 3, gift-hampers 9, closer 3).
- 7 `data-slot-skip="placeholder"` markers in template (menu lede, visit-body, band-body, 3× hamper price, closer-body).
- DA-source HTML uses absolute URLs (`https://main--my-eds-site2--bosschaert.aem.page/assets/...`) for Media Bus.
- Template/fragments use root-relative `/assets/...`.
- Section first-classes added on the fly (source had `data-section` only, no `class` attribute on `<section>` elements). Confirmed no CSS layout-class collision on `hero`/`menu-strip`/`visit-us`/`cta-band`/`gift-hampers`/`closer`.

## Phase: Wire

- Artifacts copied to: `templates/`, `fragments/home-proposed/`, `styles/`, `scripts/`.
- Drafts file built via `transform-da-to-eds.mjs` — 5619 bytes, 3 meta tags.
- 7 vendored assets in `/assets/` (1 logo + 6 photos).
- `npm run lint` passes clean.

## Phase: Round-trip

### Local
- Dev server (`@adobe/aem-cli` v16.19.7) came up at `http://localhost:3000/`.
- All 13 EDS-served paths return 200 (template, fragments, CSS, JS, 6 photos, logo, drafts).
- **Local caveat**: drafts-file img URLs initially absolute (matching DA source for Media Bus), so images 404'd locally until the branch was pushed. Mitigation applied: `sed`-rewrote drafts file imgs to `/assets/...` for local viewing only. DA-source file unchanged.

### Production
- Pushed to `main` via `ssh` remote (`git@github.com:bosschaert/my-eds-site2.git`). Code Sync ready in ~1s.
- All 9 sanity-probed paths return 200 on `https://main--my-eds-site2--bosschaert.aem.page/`.
- DA PUT: `POST /versionsource` returned 201 (snapshot created). `PUT /source/...` returned 200.
- `POST /preview/...` returned 200 with `preview.status: 200`.
- Final URL: https://main--my-eds-site2--bosschaert.aem.page/snowflake/001/home-proposed
- Production HTML response includes:
  - `<meta name="template" content="home-proposed">` ✓
  - All 6 section classes present in served HTML ✓
  - Media Bus rewrote DA-cell `<img>` URLs to optimized `./media_<sha>.jpg?width=750&format=jpg&optimize=medium` ✓

## Phase: Reflect

### Project-specific findings
- Stardust 0.2.0 emitted *0.3.0-style* placeholder attributes (`data-placeholder="true"`) — not the 0.2.0 `<span class="placeholder-tag">` shape documented in skill knowledge. Possibly a Stardust convergence in newer 0.2.0 patch revisions. Not promoting yet; needs corroboration from another Stardust 0.2.0 input.

### Cross-project candidates
- **Source-has-no-class-at-all on sections** (only `data-section`). Methodology rule "first class must be unique" applies even when the section has *no class*, by adding the `data-section` value as the section's first (and only) class. Existing methodology covers this implicitly under disambiguator priority #1, but the all-attributes-no-class case is worth a one-liner. Marking [candidate-not-yet-promoted].

### Workflow gotchas (not for skill knowledge)
- HTTPS push via macOS keychain offered the wrong account credentials → 403. Workaround was a manually-configured ssh remote. Specific to multi-account setups; not a snowflake-generalizable rule.

### Timings (rough)
| Phase | Elapsed |
|---|---|
| capture | < 1 min |
| analyze | ~7 min (full source read + structural map) |
| generate | ~7 min (template + DA doc with 45 slots) |
| wire | ~4 min (npm install dominated) |
| roundtrip-local | ~3 min |
| roundtrip-prod | ~5 min (incl. push permission diagnosis) |

### Status
Ready for close. Iteration is NOT closed — awaiting user say-so.
