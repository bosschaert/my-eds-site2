# Learnings — 001 home-proposed

## 2026-05-20 — Stardust 0.2.0 source may emit 0.3.0-style placeholders

**Context.** The bundled skill knowledge documents two placeholder conventions:
Stardust 0.3.0 uses `<el data-placeholder="true">` attribute; 0.2.0 uses
`<span class="placeholder-tag">` inline marker. This input declares
`stardustVersion: 0.2.0` in its provenance comment but uses the
**attribute** convention throughout (10 placeholders, all marked
`data-placeholder="true"`).

**Fix applied.** Used the 0.3.0 detection path; all 10 placeholders got
`data-slot-skip="placeholder"` in the generated template / fragments and
rendered as-is.

**Generic rule (candidate, not promoted).** Don't trust the
`stardustVersion` field in the provenance comment as the sole signal —
sniff for `[data-placeholder="true"]` presence first; fall back to
`<span class="placeholder-tag">` only if the attribute form isn't found.

## 2026-05-20 — Source section with no `class` attribute (only `data-section`)

**Context.** Every `<section>` in this source had a stable
`data-section` value (`hero`, `menu-strip`, …) but **no `class`
attribute at all**. The overlay engine's
`section.className.split(' ')[0]` returned an empty string → no match
between DA blocks and template sections.

**Fix applied.** During Generate phase, set `class="<data-section>"` on
each `<section>`. CSS uses `section[data-section="…"]` selectors
throughout so the added classname doesn't conflict. Verified via grep
that no `.hero`/`.menu-strip`/… selectors exist in the source CSS.

**Generic rule (candidate, not promoted).** Existing discriminator
priority (data-section → id → eyebrow slug → positional) already covers
this case — but it implicitly assumes there's an existing class list to
reorder. Worth one-liner in methodology Generate phase: "If the section
has no class at all, the discriminator IS the first/only class."

## 2026-05-20 — Local-source case worked end-to-end with vendoring

**Context.** Source file lived at a local filesystem path
(`/Users/.../home-proposed.html`). Following the vendor strategy from
prior learnings (2026-05-19 "Vendoring `/assets/` in the repo is a
viable option"), copied 7 referenced asset files into `/assets/` at
repo root, used root-relative paths in template/fragments/CSS, used
absolute branch URLs in the DA doc. Pushed to `main`, Code Sync took
~1s, DA upload returned 200, preview returned 200, Media Bus rewrote
the DA-cell image URLs to optimized `./media_<sha>.jpg`.

No new finding — this corroborates the 2026-05-19 vendoring guidance.
