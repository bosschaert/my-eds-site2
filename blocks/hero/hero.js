/**
 * hero — full-bleed cinematic opener (template-slotted, bespoke).
 * Schema: eyebrow -> h1 -> lede -> CTA group; a full-bleed background image behind a scrim.
 *
 * Authoring (one section, cells in order):
 *   1. <picture>/<img> background image (optional; CSS ink fallback if absent)
 *   2. eyebrow line
 *   3. <h1> headline  (the page's single <h1>)
 *   4. lede paragraph
 *   5. CTA cell: <strong><a> primary + <em><a> secondary
 *
 * Content is queried by role (not hard row index) so it tolerates a
 * consolidated single-cell shape. The prototype scroll-reveal / parallax is
 * enhancement only and is NOT lifted (script does not run in EDS) — content
 * renders visible.
 */

function firstPicture(block) {
  return block.querySelector('picture, img');
}

/**
 * Clone a CTA anchor and apply the EDS button class its emphasis wrapper
 * implies (<strong> -> primary, <em> -> secondary, both -> accent). The
 * stock decorateButtons only fires when a <p> holds exactly one link, so a
 * two-CTA cell needs the class applied here.
 */
function makeButton(a) {
  const link = a.cloneNode(true);
  link.title = link.title || link.textContent.trim();
  const strong = a.closest('strong');
  const em = a.closest('em');
  link.classList.add('button');
  if (strong && em) link.classList.add('accent');
  else if (strong) link.classList.add('primary');
  else if (em) link.classList.add('secondary');
  return link;
}

/**
 * Move a <picture>/<img> into a new parent and re-trigger its load.
 * Reparenting a natively lazy-loaded <img> can leave it un-observed and it
 * never fetches; re-setting src (and dropping lazy for above-fold media)
 * restarts the load deterministically.
 */
function placeMedia(parent, media, eager) {
  if (!media) return;
  const node = media.closest('picture') || media;
  parent.append(node);
  const img = node.matches('img') ? node : node.querySelector('img');
  if (img) {
    img.loading = 'eager';
    const src = img.getAttribute('src');
    if (src) img.setAttribute('src', src);
  }
}

export default async function decorate(block) {
  const pic = firstPicture(block);
  const heading = block.querySelector('h1, h2, h3');

  // classify link-free paragraphs: eyebrow = short line before heading, lede = sentence after
  const paras = [...block.querySelectorAll('p')].filter((p) => !p.querySelector('a'));
  let eyebrowEl = null;
  let ledeEl = null;
  if (paras.length === 1) {
    [ledeEl] = paras;
  } else if (paras.length >= 2) {
    // eyebrow precedes the heading in document order; lede follows it
    eyebrowEl = paras.find((p) => heading && (p.compareDocumentPosition(heading)
      & Node.DOCUMENT_POSITION_FOLLOWING)) || paras[0];
    ledeEl = paras.find((p) => p !== eyebrowEl) || paras[1];
  }

  // CTAs live in the link-bearing paragraph(s)
  const ctaLinks = [...block.querySelectorAll('p a[href], a[href]')];

  const inner = document.createElement('div');
  inner.className = 'hero-inner';

  if (eyebrowEl) {
    const eb = document.createElement('span');
    eb.className = 'eyebrow';
    eb.textContent = eyebrowEl.textContent.trim();
    inner.append(eb);
  }

  if (heading) {
    const h = heading.querySelector('h1, h2, h3, h4, h5, h6') || heading;
    // ensure it is an h1
    if (h.tagName !== 'H1') {
      const h1 = document.createElement('h1');
      [...h.childNodes].forEach((n) => h1.append(n.cloneNode(true)));
      inner.append(h1);
    } else {
      inner.append(heading);
    }
  }

  if (ledeEl) {
    const p = document.createElement('p');
    [...ledeEl.childNodes].forEach((n) => p.append(n.cloneNode(true)));
    inner.append(p);
  }

  if (ctaLinks.length) {
    const cta = document.createElement('div');
    cta.className = 'hero-cta';
    ctaLinks.forEach((a) => cta.append(makeButton(a)));
    inner.append(cta);
  }

  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  wrap.append(inner);

  const imgLayer = document.createElement('div');
  imgLayer.className = 'hero-img';
  placeMedia(imgLayer, pic, true);

  block.replaceChildren(imgLayer, wrap);
}
