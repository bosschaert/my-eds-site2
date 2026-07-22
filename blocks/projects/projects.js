/**
 * projects — "Grands projets": full-bleed image cards with a ribbon, title,
 * body and CTA. Reconstructive (#95). Schema: index.json#projects
 *
 * Section head authored as default content, reabsorbed.
 * Authoring: one row per feature:
 *   <picture> | ribbon text | <h3>title</h3> | body <p> | <strong><a>CTA</a></strong>
 */

const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

function pic(el) {
  if (!el) return null;
  return el.matches?.('picture, img') ? el : el.querySelector('picture, img');
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
  const link = dc.querySelector('a');
  if (title) {
    const h2 = document.createElement('h2');
    h2.append(...title.childNodes);
    head.append(h2);
  }
  if (link) {
    link.classList.add('link-all');
    link.innerHTML = `${link.textContent.trim()} ${ARROW}`;
    head.append(link);
  }
  dc.remove();
  return head;
}

export default function decorate(block) {
  const head = reabsorbHead(block);
  const rows = [...block.children];

  const grid = document.createElement('div');
  grid.className = 'feature-grid';

  rows.forEach((row, i) => {
    const cells = [...row.children];
    const p = pic(cells[0]);
    const title = row.querySelector('h1, h2, h3, h4');
    const ctaP = [...row.querySelectorAll('p')].find((el) => el.querySelector('a'));
    // remaining plain-text cells (no media/heading/link), in authored order:
    // first = ribbon label, second = body copy. (EDS wraps text cells in <p>.)
    const textCells = cells.filter((c) => c.textContent.trim()
      && !c.querySelector('picture, img, h1, h2, h3, h4, h5, h6, a'));
    const ribbon = textCells[0];
    const body = textCells[1];

    const art = document.createElement('article');
    art.className = 'feature';
    if (p) art.append(p.cloneNode(true));
    if (ribbon) {
      const r = document.createElement('span');
      r.className = 'ribbon';
      if (i === 1) r.style.background = 'var(--cyan)';
      r.textContent = ribbon.textContent.trim();
      art.append(r);
    }
    const fbody = document.createElement('div');
    fbody.className = 'fbody';
    if (title) {
      const h3 = document.createElement('h3');
      h3.append(...(title.querySelector('h1,h2,h3,h4') || title).childNodes);
      fbody.append(h3);
    }
    if (body) {
      const bp = document.createElement('p');
      const inner = body.querySelector('p') || body;
      bp.append(...inner.childNodes);
      fbody.append(bp);
    }
    if (ctaP) {
      const wrapP = document.createElement('p');
      wrapP.className = 'button-wrapper';
      [...ctaP.childNodes].forEach((n) => wrapP.append(n.cloneNode(true)));
      fbody.append(wrapP);
    }
    art.append(fbody);
    grid.append(art);
  });

  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  if (head) wrap.append(head);
  wrap.append(grid);
  block.replaceChildren(wrap);
}
