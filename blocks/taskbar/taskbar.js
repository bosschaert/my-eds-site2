/**
 * taskbar — primary task band: a search entry + a grid of quick-access tiles.
 * Reconstructive (#95). Schema: stardust/eds-schema/index.json#taskbar
 *
 * Authoring rows:
 *   1. search placeholder text (single cell) — optional
 *   2..N. one row per quick task: <strong>Title</strong> then a description
 *         line (or "Title | Description"); each row may be wrapped in an <a>.
 *
 * The search is a NON-submitting control (CSP makes inline handlers inert;
 * we render a decorative search box that does not navigate).
 */

const ICONS = {
  déchets: '<path d="M3 7h18M6 7V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2M5 7l1 13a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1l1-13"/>',
  agenda: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  marchés: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h6"/>',
  offres: '<path d="M4 22V6a2 2 0 0 1 2-2h5l2 2h5a2 2 0 0 1 2 2v14z"/><path d="M4 22h16"/>',
  trouver: '<path d="M12 21s-7-4.5-7-10a7 7 0 0 1 14 0c0 5.5-7 10-7 10z"/><circle cx="12" cy="11" r="2.5"/>',
};

function iconFor(title) {
  const key = Object.keys(ICONS).find((k) => title.toLowerCase().includes(k));
  const body = ICONS[key] || '<circle cx="12" cy="12" r="9"/>';
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">${body}</svg>`;
}

function svg(paths) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">${paths}</svg>`;
}

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // First row = search placeholder text.
  const placeholder = rows[0]?.textContent.trim()
    || 'Rechercher une démarche, une info, un service…';

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  // search (non-submitting)
  const search = document.createElement('div');
  search.className = 'search';
  search.setAttribute('role', 'search');
  const input = document.createElement('input');
  input.type = 'search';
  input.placeholder = placeholder;
  input.setAttribute('aria-label', 'Rechercher sur le site');
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.innerHTML = `${svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>')}Rechercher`;
  search.append(input, btn);
  wrap.append(search);

  // quick tasks
  const nav = document.createElement('nav');
  nav.className = 'quicktasks';
  nav.setAttribute('aria-label', 'Accès rapides');

  rows.slice(1).forEach((row) => {
    const cells = [...row.children];
    const link = row.querySelector('a');
    const href = link ? link.getAttribute('href') : '#';
    // title = the <strong> if present, else first cell text; desc = remaining text
    const strong = row.querySelector('strong');
    let title = '';
    let desc = '';
    if (strong) {
      title = strong.textContent.trim();
      const rest = row.textContent.replace(title, '').trim();
      desc = rest.replace(/^[|•·—-]\s*/, '').trim();
    } else if (cells.length >= 2) {
      title = cells[0].textContent.trim();
      desc = cells[1].textContent.trim();
    } else {
      const parts = row.textContent.split('|');
      title = (parts[0] || '').trim();
      desc = (parts[1] || '').trim();
    }
    if (!title) return;

    const a = document.createElement('a');
    a.className = 'qt';
    a.href = href;
    a.innerHTML = `<span class="qt-ico">${iconFor(title)}</span>`
      + `<strong>${title}</strong>`
      + (desc ? `<span>${desc}</span>` : '');
    nav.append(a);
  });

  wrap.append(nav);
  block.replaceChildren(wrap);
}
