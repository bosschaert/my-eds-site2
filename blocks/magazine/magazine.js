/**
 * magazine — "From the Magazine" article grid (reconstructive).
 *
 * Authoring rows (one cell each unless noted):
 *   1. section head cell: <h2> title + a lead <p>
 *   2..N. one article row per card, cells (flat siblings tolerated):
 *         <picture>/<img>, tag <p>, <h3> title, body <p>, Read <a>
 *   last. a CTA cell whose only content is <strong><a> "All Articles"
 *
 * The head row (contains an <h2>) becomes .section-head; article rows
 * (contain an <h3>) become .article cards; a link-only cell is the trailing CTA.
 */

function classify(el) {
  const has = (sel) => (el.matches(sel) ? el : el.querySelector(sel));
  return {
    media: has('picture, img'),
    h2: has('h2'),
    h3: has('h3, h4'),
    link: has('a[href]'),
  };
}

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

/** Move media into a new parent and re-trigger its (lazy) load. */
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
  const rows = [...block.querySelectorAll(':scope > div')];
  const cells = rows.map((r) => r.querySelector(':scope > div') || r);

  let headCell = null;
  let ctaCell = null;
  const articleCells = [];

  cells.forEach((cell) => {
    const c = classify(cell);
    if (c.h2 && !c.h3) headCell = cell;
    else if (c.h3) articleCells.push(cell);
    else if (c.link && !c.media) ctaCell = cell;
    else if (c.media || cell.textContent.trim()) articleCells.push(cell);
  });

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  if (headCell) {
    const head = document.createElement('div');
    head.className = 'section-head';
    const h2src = headCell.querySelector('h2');
    if (h2src) head.append(h2src.cloneNode(true));
    const lead = [...headCell.querySelectorAll('p')].find((p) => !p.querySelector('a'));
    if (lead) {
      const p = document.createElement('p');
      p.className = 'lead';
      [...lead.childNodes].forEach((n) => p.append(n.cloneNode(true)));
      head.append(p);
    }
    wrap.append(head);
  }

  const grid = document.createElement('div');
  grid.className = 'article-grid';

  articleCells.forEach((cell) => {
    const c = classify(cell);
    const article = document.createElement('article');
    article.className = 'article';

    const media = document.createElement('div');
    media.className = 'article-media';
    placeMedia(media, c.media);
    article.append(media);

    const body = document.createElement('div');
    body.className = 'article-body';

    const heading = c.h3;
    const paras = [...cell.querySelectorAll('p')].filter((p) => !p.querySelector('a'));
    let tagEl = paras.find((p) => heading
      && (p.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING));
    if (!tagEl) [tagEl] = paras;

    if (tagEl) {
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = tagEl.textContent.trim();
      body.append(tag);
    }

    if (heading) {
      const h3 = document.createElement('h3');
      const src = heading.querySelector('h1,h2,h3,h4,h5,h6') || heading;
      [...src.childNodes].forEach((n) => h3.append(n.cloneNode(true)));
      body.append(h3);
    }

    const copyEl = paras.find((p) => p !== tagEl);
    if (copyEl) {
      const p = document.createElement('p');
      [...copyEl.childNodes].forEach((n) => p.append(n.cloneNode(true)));
      body.append(p);
    }

    const readLink = cell.querySelector('a[href]');
    if (readLink) {
      const link = readLink.cloneNode(true);
      link.classList.add('mag-link');
      const wrapP = document.createElement('p');
      wrapP.className = 'article-read';
      wrapP.append(link);
      body.append(wrapP);
    }

    article.append(body);
    grid.append(article);
  });

  wrap.append(grid);

  if (ctaCell) {
    const foot = document.createElement('div');
    foot.className = 'magazine-cta';
    const a = ctaCell.querySelector('a[href]');
    if (a) foot.append(makeButton(a));
    wrap.append(foot);
  }

  block.replaceChildren(wrap);
}
