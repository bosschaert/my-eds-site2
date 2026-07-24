import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * footer — Saint-Louis Agglomération footer built from the /footer fragment.
 * The fragment holds, in order, five default-content sections:
 *   1. brand column   (logo image + tagline paragraph)
 *   2. address column (h5 + paragraph)
 *   3. hours column   (h5 + paragraph)
 *   4. contact column (h5 + phone link + message link + map image)
 *   5. legal bar      (list of legal links + a credit line)
 * The first four become the .foot-grid; the fifth becomes the .foot-legal bar.
 */

export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  block.textContent = '';
  const sections = fragment ? [...fragment.children] : [];

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  const grid = document.createElement('div');
  grid.className = 'foot-grid';

  sections.slice(0, 4).forEach((sec, i) => {
    const col = document.createElement('div');
    if (i === 0) col.className = 'foot-brand';
    if (i === 3) col.className = 'foot-contact';
    while (sec.firstChild) col.append(sec.firstChild);
    // wrap a leading logo image in a .foot-logo
    if (i === 0) {
      const img = col.querySelector('picture, img');
      if (img) {
        const logoWrap = document.createElement('div');
        logoWrap.className = 'foot-logo';
        logoWrap.append(img.closest('p') || img);
        col.prepend(logoWrap);
      }
    }
    // contact: phone link becomes .big, map image gets .foot-map wrapper
    if (i === 3) {
      const links = [...col.querySelectorAll('a[href^="tel:"]')];
      links.forEach((a) => a.classList.add('big'));
      const map = col.querySelector('picture, img');
      if (map) {
        const mapWrap = document.createElement('div');
        mapWrap.className = 'foot-map';
        (map.closest('p') || map).replaceWith(mapWrap);
        mapWrap.append(map);
      }
    }
    grid.append(col);
  });
  wrap.append(grid);

  // legal bar
  const legalSection = sections[4];
  if (legalSection) {
    const legal = document.createElement('div');
    legal.className = 'foot-legal';
    const links = [...legalSection.querySelectorAll('a')];
    links.forEach((a) => legal.append(a.cloneNode(true)));
    // credit = last non-link text in the section
    const creditText = legalSection.textContent
      .replace(links.map((a) => a.textContent).join(''), '').trim();
    if (creditText) {
      const credit = document.createElement('span');
      credit.className = 'credit';
      credit.textContent = creditText;
      legal.append(credit);
    }
    wrap.append(legal);
  }

  block.append(wrap);
}
