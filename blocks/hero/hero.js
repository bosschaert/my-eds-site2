/**
 * hero — full-bleed photographic hero with eyebrow, H1, lede and CTAs.
 * Template-slotted (#95): fixed composition, block owns the DOM and slots
 * authored values by role. Schema: stardust/eds-schema/index.json#hero
 *
 * Authoring (flattened single-cell tolerated; queried by role, not index #42):
 *   - <picture>/<img>  background image (optional)
 *   - eyebrow          short line before the heading (first bare <p>)
 *   - <h1>             the page's single H1
 *   - lede             sentence <p> after the heading
 *   - CTAs             p > strong>a (primary), p > em>a (secondary)
 *
 * The block also renders fixed decorative chrome matching the prototype: the
 * logo overlaid top-left (hero-top / hero-logo) and the bottom-right ghost
 * pills (Social Wall / Portail Open Data). The logo is pulled from the /nav
 * fragment's brand section (already optimized by EDS) so it resolves via the
 * media pipeline rather than an auth-gated source URL.
 */

import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

export default async function decorate(block) {
  const pic = block.querySelector('picture, img');
  const h = block.querySelector('h1, h2, h3');
  const paras = [...block.querySelectorAll('p')];
  const ctaParas = paras.filter((p) => p.querySelector('a'));
  const textParas = paras.filter((p) => !p.querySelector('a'));
  // eyebrow = first bare <p> (short, before heading); lede = the other.
  const eyebrow = textParas[0] || null;
  const lede = textParas[1] || null;

  const media = document.createElement('div');
  media.className = 'hero-media';
  if (pic) {
    const el = pic.matches('picture, img') ? pic : pic.querySelector('picture, img');
    media.append(el.cloneNode(true));
  }

  // ---- logo overlaid top-left (sourced from the /nav fragment brand section) ----
  const top = document.createElement('div');
  top.className = 'hero-top';
  const topWrap = document.createElement('div');
  topWrap.className = 'wrap';
  const logoLink = document.createElement('a');
  logoLink.className = 'hero-logo';
  logoLink.href = '/';
  logoLink.setAttribute('aria-label', 'Accueil Saint-Louis Agglomération');
  try {
    const navMeta = getMetadata('nav');
    const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
    const navFragment = await loadFragment(navPath);
    const brandPic = navFragment?.querySelector('picture, img');
    if (brandPic) {
      const el = brandPic.matches('picture, img') ? brandPic : brandPic.querySelector('picture, img');
      logoLink.append(el.cloneNode(true));
    }
  } catch (e) {
    // fragment unavailable — leave the logo link empty rather than break the hero
  }
  topWrap.append(logoLink);
  top.append(topWrap);

  const inner = document.createElement('div');
  inner.className = 'hero-inner';
  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  if (eyebrow) {
    const e = document.createElement('p');
    e.className = 'hero-eyebrow';
    e.append(...eyebrow.childNodes);
    wrap.append(e);
  }
  if (h) {
    const innerH = h.querySelector('h1, h2, h3, h4, h5, h6') || h;
    const h1 = document.createElement('h1');
    h1.append(...innerH.childNodes);
    wrap.append(h1);
  }
  if (lede) {
    const l = document.createElement('p');
    l.className = 'hero-lede';
    l.append(...lede.childNodes);
    wrap.append(l);
  }

  if (ctaParas.length) {
    const actions = document.createElement('div');
    actions.className = 'hero-ctas';
    ctaParas.forEach((p) => actions.append(...[...p.childNodes].map((n) => n.cloneNode(true))));
    wrap.append(actions);
  }

  inner.append(wrap);

  // ---- bottom-right pills ----
  const pills = document.createElement('div');
  pills.className = 'hero-pills';
  pills.innerHTML = '<div class="wrap"><a class="button secondary" href="#">Social Wall</a><a class="button secondary" href="#opendata">Portail Open Data</a></div>';

  block.replaceChildren(media, top, inner, pills);
}
