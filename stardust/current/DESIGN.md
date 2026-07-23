# Design System — anthropic.com (Current State)

_Descriptive snapshot of the live site's visual system._

## Colors

| Role       | Value     | Usage                                    |
|-----------|-----------|------------------------------------------|
| Background | `#faf9f5` | Page background — warm off-white         |
| Surface    | `#ffffff` | Cards, elevated containers               |
| Text       | `#141413` | Primary text — near-black charcoal       |
| Text Sec.  | `#87867f` | Secondary/muted text                     |
| Primary    | `#cc785c` | Accent color — warm terracotta/salmon    |
| Secondary  | `#b0aea5` | Subtle UI elements, borders              |
| Border     | `#e8e5de` | Card and section borders                 |

The palette is intentionally restrained: warm neutrals with a single terracotta accent. No bright saturated colors anywhere in the UI.

## Typography

| Role     | Family                                                   | Weight | Sizes              |
|----------|----------------------------------------------------------|--------|---------------------|
| Heading  | Anthropic Serif, Georgia, serif                          | 400    | 48/36/28/24px       |
| Body     | Anthropic Sans, -apple-system, BlinkMacSystemFont, sans-serif | 400 | 16/18px             |
| UI/Nav   | Anthropic Sans                                           | 500    | 14/16px             |

Custom typefaces: **Anthropic Serif** (display/heading) and **Anthropic Sans** (body/UI). Both are proprietary web fonts. Closest system fallbacks: Georgia for serif, system sans-serif stack for sans.

Scale audit: ad-hoc (sizes do not follow a strict modular ratio).

## Shape & Space

- **Border radius:** 16px (cards, major containers), 8px (buttons, smaller elements)
- **Shadows:** Minimal — the site avoids box-shadow in favor of subtle borders
- **Spacing rhythm:** 8px base grid; generous vertical whitespace between sections (80-128px)
- **Layout:** Full-width hero sections, max-width content containers (~1200px)

## Motifs

1. **Warm neutral palette** — cream backgrounds, charcoal text, minimal color
2. **Editorial typography** — large serif headings with generous line-height
3. **Generous whitespace** — spacious vertical rhythm, unhurried reading experience
4. **Text-centric heroes** — headline-forward with minimal imagery
5. **Subtle geometry** — rounded corners without being playful

## System Components

- **Site header:** Logo (Lottie SVG animation) + horizontal nav + CTA buttons (Try Claude, Contact sales)
- **Site footer:** Multi-column link list + legal links
- **Card grid:** Used for latest releases, research papers, news items
- **Hero section:** Large serif headline, short description, CTA buttons on warm background
