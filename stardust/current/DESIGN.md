# DESIGN — Breathe (Current State)

> Descriptive snapshot of the existing visual system at breathe-app.com.

## Palette

| Role        | Value                           | Notes                        |
|-------------|----------------------------------|------------------------------|
| Background  | #f3f7fa                          | Very light blue-grey         |
| Surface     | rgba(255, 255, 255, 0.75)        | Frosted-glass card surfaces  |
| Text        | #233039                          | Deep navy ink                |
| Muted       | rgba(35, 48, 57, 0.55)          | Subdued body copy            |
| Primary     | #3f6486                          | Steel blue accent            |
| Secondary   | #9fc4e0                          | Light sky blue               |
| Dark section| #23323d                          | Navy for CTA bands           |
| Dark text   | #e8f0f5                          | Light text on dark sections  |
| Stroke      | rgba(35, 48, 57, 0.09)          | Ultra-subtle borders         |

The palette is restrained and serene — dominated by blue-grey neutrals with no saturated accents. The brand gradient (teal-to-peach) appears only in the logo mark.

## Typography

| Role     | Family                                         | Weight | Notes                     |
|----------|------------------------------------------------|--------|---------------------------|
| Heading  | Newsreader, Georgia, serif                     | 400    | Elegant editorial serif   |
| Body     | Hanken Grotesk, Trebuchet MS, sans-serif       | 400    | Clean geometric grotesque |

Both are Google Fonts (OFL-licensed). Newsreader provides editorial warmth for headlines; Hanken Grotesk adds clarity and modernity for body text and navigation. Italics are used decoratively in the hero headline ("calm" is italic).

## Shapes & Motifs

- **Border radius:** 22px signature radius on cards, thumbnails, containers, and buttons — consistently large and soft.
- **Shadows:** Two tiers — standard (`0 8px 28px rgba(35,48,57,.1)`) for cards, strong (`0 20px 56px rgba(35,48,57,.18)`) for hero-level elevation.
- **Glass surface:** Semi-transparent white background on cards with blur/overlay effect.
- **Dark CTA band:** Navy section with serif headline and rounded ghost-button in white.
- **Numbered features:** 01–06 grid with numbered cards and short descriptions.
- **Thumbnail carousel:** Landscape thumbnails with rounded corners and text label + badge overlay.

## Layout

- Mobile-first responsive design
- Single-column hero with asymmetric text-left / phone-right composition
- 3-column grid for feature cards (desktop), collapsing to single column on mobile
- 4-column thumbnail grid for backgrounds section
- 2-column card layout for breathing rhythms section
- Generous section spacing (~80px vertical rhythm)

## Iconography

No icon font detected. The brand uses the app icon (gradient rounded-square with wave motif) as both favicon and header brand mark. Badges (App Store, Google Play) are inline SVGs.

## Brand Personality (Visual)

Calm, minimal, intentional. The design communicates "less is more" through restrained color, generous whitespace, a single serif+sans pairing, and soft rounded shapes. No animation-heavy features or aggressive gradients — the experience mirrors the product's purpose (breathing, relaxation).
