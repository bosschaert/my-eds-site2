import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const WKND_LOGO = `<svg viewBox="0 0 239.35 89.09" role="img" aria-label="WKND"><path d="M60.33,94.83h-13L39.94,47.39h-.25l-7,47.43H19.78L4.9,5.93H19l6.88,46.59h.21L32.45,5.88H46.6l6.86,46.45h.27L60.1,5.92H74.24Z" transform="translate(-4.9 -5.81)"/><path d="M176.45,64.52V5.94h13.49V94.8H175.49l-18.18-56-.23,0v56H143.69v-89h2.61c3.76,0,7.52,0,11.28,0A1.33,1.33,0,0,1,159.14,7q7.54,25.5,15.14,51l2,6.61Z" transform="translate(-4.9 -5.81)"/><path d="M202,5.84h21.67c9.68,0,18.75,7.78,20.19,17.36a30.86,30.86,0,0,1,.35,4.53q0,22.61,0,45.22c0,9.72-5.55,17.9-14.23,20.78a22.16,22.16,0,0,1-6.45,1.09c-6.71.14-13.43.05-20.15.05H202Zm13.44,13.73V81.41c2.76,0,5.44.07,8.11,0A7.56,7.56,0,0,0,231,73.64c0-1,0-2,0-3q0-21.59,0-43.18a7.57,7.57,0,0,0-6.86-7.86C221.31,19.42,218.42,19.57,215.45,19.57Z" transform="translate(-4.9 -5.81)"/><path d="M98.88,94.81H85.34V5.92H98.88V36.78l.26.05,4.14-8q5.64-11,11.26-22a1.56,1.56,0,0,1,1.63-1c4,.05,8.08,0,12.12,0h1.24L128.44,8q-8.39,16.63-16.8,33.25a2.16,2.16,0,0,0-.09,2q10.31,25.15,20.57,50.32c.15.36.28.73.47,1.22-.39,0-.68.09-1,.09-4.6,0-9.2,0-13.8,0a1.3,1.3,0,0,1-1.44-1q-6.52-16.8-13.1-33.58c-.14-.36-.3-.72-.54-1.32-.94,1.89-1.71,3.62-2.65,5.25a9.9,9.9,0,0,0-1.25,5.25c.07,8,0,15.92,0,23.88Z" transform="translate(-4.9 -5.81)"/></svg>`;

/**
 * footer — WKND dark footer (brand blurb + link columns + bottom bar).
 * Content authored in the /footer fragment as sections:
 *   1. brand blurb <p>
 *   2. a column: <h4>heading</h4> + link list  (repeat per column)
 *   last section: copyright <p> + social links
 * Columns are detected by the presence of an <h2>/<h3>/<h4> heading.
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  block.textContent = '';
  const sections = fragment ? [...fragment.querySelectorAll(':scope > div')] : [];

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  const top = document.createElement('div');
  top.className = 'footer-top';

  // brand column: first section (the blurb), decorated with logo
  const brand = document.createElement('div');
  const logo = document.createElement('a');
  logo.className = 'logo';
  logo.href = '/';
  logo.setAttribute('aria-label', 'WKND home');
  logo.innerHTML = WKND_LOGO;
  brand.append(logo);
  if (sections[0]) {
    const blurb = sections[0].querySelector('p');
    if (blurb) {
      const p = document.createElement('p');
      p.className = 'footer-blurb';
      [...blurb.childNodes].forEach((n) => p.append(n.cloneNode(true)));
      brand.append(p);
    }
  }
  top.append(brand);

  // link columns: sections with a heading
  const bottomSection = sections[sections.length - 1];
  sections.slice(1, -1).forEach((sec) => {
    const heading = sec.querySelector('h1, h2, h3, h4, h5, h6');
    if (!heading && !sec.querySelector('a')) return;
    const col = document.createElement('div');
    col.className = 'footer-col';
    if (heading) {
      const h4 = document.createElement('h4');
      const src = heading.querySelector('h1,h2,h3,h4,h5,h6') || heading;
      [...src.childNodes].forEach((n) => h4.append(n.cloneNode(true)));
      col.append(h4);
    }
    sec.querySelectorAll('a').forEach((a) => col.append(a.cloneNode(true)));
    top.append(col);
  });

  wrap.append(top);

  // bottom bar: copyright + socials
  const bottom = document.createElement('div');
  bottom.className = 'footer-bottom';
  if (bottomSection) {
    const copy = bottomSection.querySelector('p');
    const copySpan = document.createElement('span');
    copySpan.textContent = copy ? copy.textContent.trim() : '';
    bottom.append(copySpan);

    const socials = document.createElement('div');
    socials.className = 'socials';
    bottomSection.querySelectorAll('a').forEach((a) => socials.append(a.cloneNode(true)));
    bottom.append(socials);
  }
  wrap.append(bottom);

  block.append(wrap);
}
