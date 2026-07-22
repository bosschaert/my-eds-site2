/**
 * concertations — "Concertations publiques": a 3-up card grid.
 * Reconstructive (#95). Schema: index.json#concertations
 *
 * Section head authored as default content, reabsorbed.
 * Authoring: one row per card:
 *   <picture> | status text | <h4>title</h4> | body <p> | link <a>
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
  grid.className = 'concert-grid';

  rows.forEach((row) => {
    const cells = [...row.children];
    const p = pic(cells[0]);
    const title = row.querySelector('h1, h2, h3, h4');
    const link = row.querySelector('a[href]');
    // plain-text cells in authored order: first = status label, second = body.
    const textCells = cells.filter((c) => c.textContent.trim()
      && !c.querySelector('picture, img, h1, h2, h3, h4, h5, h6, a'));
    const status = textCells[0];
    const body = textCells[1];

    const art = document.createElement('article');
    art.className = 'concert';
    const media = document.createElement('a');
    media.className = 'media';
    media.href = link ? link.getAttribute('href') : '#';
    if (p) media.append(p.cloneNode(true));
    art.append(media);

    const bodyEl = document.createElement('div');
    bodyEl.className = 'body';
    if (status) {
      const s = document.createElement('span');
      s.className = 'status';
      s.textContent = status.textContent.trim();
      bodyEl.append(s);
    }
    if (title) {
      const h4 = document.createElement('h4');
      h4.append(...(title.querySelector('h1,h2,h3,h4') || title).childNodes);
      bodyEl.append(h4);
    }
    if (body) {
      const bp = document.createElement('p');
      const inner = body.querySelector('p') || body;
      bp.append(...inner.childNodes);
      bodyEl.append(bp);
    }
    if (link) {
      const a = document.createElement('a');
      a.className = 'link-all';
      a.href = link.getAttribute('href');
      a.innerHTML = `${link.textContent.trim()} ${ARROW}`;
      bodyEl.append(a);
    }
    art.append(bodyEl);
    grid.append(art);
  });

  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  if (head) wrap.append(head);
  wrap.append(grid);
  block.replaceChildren(wrap);
}
