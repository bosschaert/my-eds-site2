/**
 * frame — full-bleed photographic story band (template-slotted, bespoke).
 * Schema: background image + a dark-scrimmed text panel (kicker -> h2 -> body -> CTA).
 *
 * Authoring (cells in order):
 *   1. <picture>/<img> background image
 *   2. kicker line (e.g. "Featured · Magazine")
 *   3. <h2> title
 *   4. body paragraph
 *   5. CTA cell: <em><a> (renders as the ghost article link)
 *
 * Scroll-reveal / parallax NOT lifted — content renders visible.
 */

/** Clone a CTA anchor and apply the button class its wrapper implies. */
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
 * Reparenting a natively lazy-loaded <img> can leave it un-observed so it
 * never fetches; re-setting src restarts the load deterministically.
 */
function placeMedia(parent, media) {
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
  const pic = block.querySelector('picture, img');
  const heading = block.querySelector('h1, h2, h3');
  const paras = [...block.querySelectorAll('p')].filter((p) => !p.querySelector('a'));

  // kicker = short line before heading; body = paragraph after
  let kickerEl = null;
  let bodyEl = null;
  if (paras.length === 1) {
    [bodyEl] = paras;
  } else if (paras.length >= 2) {
    kickerEl = paras.find((p) => heading && (p.compareDocumentPosition(heading)
      & Node.DOCUMENT_POSITION_FOLLOWING)) || paras[0];
    bodyEl = paras.find((p) => p !== kickerEl) || paras[1];
  }

  const ctaLinks = [...block.querySelectorAll('p a[href], a[href]')];

  const text = document.createElement('div');
  text.className = 'frame-text';

  if (kickerEl) {
    const k = document.createElement('p');
    k.className = 'kicker';
    k.textContent = kickerEl.textContent.trim();
    text.append(k);
  }

  if (heading) {
    const h = heading.querySelector('h1, h2, h3, h4, h5, h6') || heading;
    if (h.tagName !== 'H2') {
      const h2 = document.createElement('h2');
      [...h.childNodes].forEach((n) => h2.append(n.cloneNode(true)));
      text.append(h2);
    } else {
      text.append(heading);
    }
  }

  if (bodyEl) {
    const p = document.createElement('p');
    [...bodyEl.childNodes].forEach((n) => p.append(n.cloneNode(true)));
    text.append(p);
  }

  if (ctaLinks.length) {
    const cta = document.createElement('div');
    cta.className = 'frame-cta';
    ctaLinks.forEach((a) => cta.append(makeButton(a)));
    text.append(cta);
  }

  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  wrap.append(text);

  const imgLayer = document.createElement('div');
  imgLayer.className = 'frame-img';
  placeMedia(imgLayer, pic);

  block.replaceChildren(imgLayer, wrap);
}
