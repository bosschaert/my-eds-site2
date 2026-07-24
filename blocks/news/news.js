/**
 * news — "À la une": a large lead article + a column of compact side items.
 * Reconstructive (#95). Schema: stardust/eds-schema/index.json#news
 *
 * Section head (eyebrow/title + "see all" link) is authored as DEFAULT CONTENT
 * before the block and reabsorbed here (byte-identical decorated DOM).
 *
 * Authoring rows (one row per item; first item = lead):
 *   lead row cells:  <picture> | tag text | <h3>title</h3> | body <p> | link <a>
 *   side row cells:  <picture> | meta text | <h4>title</h4>   (wrapped in <a>)
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
  const rows = [...block.children];
  if (!rows.length) return;

  const head = reabsorbHead(block);

  const grid = document.createElement('div');
  grid.className = 'news-grid';

  // Lead = first row.
  const leadRow = rows[0];
  const leadCells = [...leadRow.children];
  const leadPic = pic(leadCells[0]);
  const leadLinkEl = leadRow.querySelector('a[href]');
  const leadHref = leadLinkEl ? leadLinkEl.getAttribute('href') : '#';
  const leadTextCells = leadCells.filter((c) => c.textContent.trim()
    && !c.querySelector('picture, img, h1, h2, h3, h4, h5, h6, a'));
  const leadTag = leadTextCells[0];
  const leadTitle = leadRow.querySelector('h1, h2, h3, h4');
  const leadBody = leadTextCells[1];

  const lead = document.createElement('article');
  lead.className = 'news-lead';
  const leadMedia = document.createElement('a');
  leadMedia.className = 'media';
  leadMedia.href = leadHref;
  if (leadPic) leadMedia.append(leadPic.cloneNode(true));
  const leadBodyEl = document.createElement('div');
  leadBodyEl.className = 'body';
  if (leadTag) {
    const t = document.createElement('span');
    t.className = 'tag';
    t.textContent = leadTag.textContent.trim();
    leadBodyEl.append(t);
  }
  if (leadTitle) {
    const h3 = document.createElement('h3');
    h3.append(...(leadTitle.querySelector('h1,h2,h3,h4') || leadTitle).childNodes);
    leadBodyEl.append(h3);
  }
  if (leadBody) {
    const p = document.createElement('p');
    const inner = leadBody.querySelector('p') || leadBody;
    p.append(...inner.childNodes);
    leadBodyEl.append(p);
  }
  const more = document.createElement('a');
  more.className = 'link-all';
  more.href = leadHref;
  more.style.marginTop = '1.1rem';
  more.innerHTML = `En savoir plus ${ARROW}`;
  leadBodyEl.append(more);
  lead.append(leadMedia, leadBodyEl);
  grid.append(lead);

  // Side items
  const side = document.createElement('div');
  side.className = 'news-side';
  rows.slice(1).forEach((row) => {
    const cells = [...row.children];
    const p = pic(cells[0]);
    const link = row.querySelector('a[href]');
    const href = link ? link.getAttribute('href') : '#';
    const title = row.querySelector('h1, h2, h3, h4, h5, h6');
    const meta = cells.find((c) => c.textContent.trim()
      && !c.querySelector('picture, img, h1, h2, h3, h4, h5, h6, a'));
    const a = document.createElement('a');
    a.className = 'news-item';
    a.href = href;
    const thumb = document.createElement('span');
    thumb.className = 'thumb';
    if (p) thumb.append(p.cloneNode(true));
    const metaWrap = document.createElement('span');
    metaWrap.className = 'meta-wrap';
    if (meta) {
      const m = document.createElement('span');
      m.className = 'meta';
      m.textContent = meta.textContent.trim();
      metaWrap.append(m);
    }
    if (title) {
      const h4 = document.createElement('h4');
      h4.append(...(title.querySelector('h1,h2,h3,h4,h5,h6') || title).childNodes);
      metaWrap.append(h4);
    }
    a.append(thumb, metaWrap);
    side.append(a);
  });
  grid.append(side);

  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  if (head) wrap.append(head);
  wrap.append(grid);
  block.replaceChildren(wrap);
}
