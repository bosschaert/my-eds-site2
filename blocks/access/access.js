/**
 * access — "Accès directs": a grid of icon + label quick links.
 * Reconstructive (#95). Schema: stardust/eds-schema/index.json#access
 *
 * Section head authored as default content, reabsorbed here.
 * Authoring: one row per link, each holding a single <a>label</a>
 * (DA may flatten to one cell of many <a>s — both handled).
 */

const ICONS = {
  actualités: '<path d="M4 5h16M4 12h16M4 19h10"/>',
  trouver: '<path d="M12 21s-7-4.5-7-10a7 7 0 0 1 14 0c0 5.5-7 10-7 10z"/><circle cx="12" cy="11" r="2.5"/>',
  agenda: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  liens: '<path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>',
  marchés: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
  télécharger: '<path d="M12 3v12M8 11l4 4 4-4M5 21h14"/>',
  publications: '<path d="M4 19V5a2 2 0 0 1 2-2h10l4 4v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M8 7h6M8 11h8M8 15h8"/>',
  fibre: '<path d="M2 12a10 10 0 0 1 20 0M6 12a6 6 0 0 1 12 0M10 12a2 2 0 0 1 4 0"/>',
  emploi: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  galerie: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="9" r="1.8"/><path d="m5 19 5-5 4 4 3-3 4 4"/>',
};

function iconFor(label) {
  const key = Object.keys(ICONS).find((k) => label.toLowerCase().includes(k));
  const body = ICONS[key] || '<circle cx="12" cy="12" r="9"/>';
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">${body}</svg>`;
}

function reabsorbHead(block) {
  const sectionWrapper = block.closest('[class$="-wrapper"]') || block.closest('.block-content');
  const container = sectionWrapper?.parentElement || block.closest('.section');
  if (!container) return null;
  const dc = [...container.children].find(
    (c) => c.matches('.default-content-wrapper, .default-content'),
  );
  if (!dc) return null;
  const head = document.createElement('div');
  head.className = 'section-head';
  const title = dc.querySelector('h1, h2, h3');
  if (title) {
    const h2 = document.createElement('h2');
    h2.append(...title.childNodes);
    head.append(h2);
  }
  dc.remove();
  return head;
}

export default function decorate(block) {
  const head = reabsorbHead(block);
  const links = [...block.querySelectorAll('a[href]')];

  const nav = document.createElement('nav');
  nav.className = 'access';
  nav.setAttribute('aria-label', 'Accès directs');

  links.forEach((link) => {
    const label = link.textContent.trim();
    if (!label) return;
    const a = document.createElement('a');
    a.href = link.getAttribute('href') || '#';
    a.innerHTML = `<span class="a-ico">${iconFor(label)}</span>${label}`;
    nav.append(a);
  });

  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  if (head) wrap.append(head);
  wrap.append(nav);
  block.replaceChildren(wrap);
}
