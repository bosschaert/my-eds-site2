/**
 * themenav — horizontal thematic navigation band (Saint-Louis Agglomération).
 * Renders a <nav class="themenav"> with a .wrap of anchor links; the first
 * link gets aria-current="page" (the active tab pill).
 *
 * Authoring: one row per theme link, each holding a single <a>label</a>
 * (DA may flatten to one cell with many <a>s — both handled).
 */

export default function decorate(block) {
  const links = [...block.querySelectorAll('a[href]')];

  const nav = document.createElement('nav');
  nav.className = 'themenav';
  nav.setAttribute('aria-label', 'Navigation thématique');

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  links.forEach((link, i) => {
    const a = document.createElement('a');
    a.href = link.getAttribute('href') || '#';
    a.textContent = link.textContent.trim();
    if (i === 0) a.setAttribute('aria-current', 'page');
    wrap.append(a);
  });

  nav.append(wrap);
  block.replaceChildren(nav);
}
