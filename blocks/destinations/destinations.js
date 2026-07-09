/**
 * destinations — "Where do you want to go?" tile grid + routes duo (reconstructive).
 *
 * Authoring rows (one cell each):
 *   1. head cell: <h2> + lead <p>
 *   2..5. destination tiles: <picture>/<img>, category <p>, <h3> place, tile <a href>
 *   6. CTA cell: <strong><a> "View All Trips"
 *   7..8. route panels: <p> kicker, <h3>, body <p>, <a href>
 *          (the second route panel is the dark "Adventures" one — marked by order)
 *
 * Segmentation: head = cell with <h2>; tiles = cells with <h3> AND media;
 * routes = cells with <h3> and NO media; CTA = link-only cell between them.
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
  const tileCells = [];
  const routeCells = [];

  cells.forEach((cell) => {
    const c = classify(cell);
    if (c.h2 && !c.h3) { headCell = cell; return; }
    if (c.h3 && c.media) { tileCells.push(cell); return; }
    if (c.h3 && !c.media) { routeCells.push(cell); return; }
    if (c.link && !c.media && !c.h3) { ctaCell = cell; return; }
    if (c.media) tileCells.push(cell);
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

  // Destination tiles
  if (tileCells.length) {
    const grid = document.createElement('div');
    grid.className = 'dest-grid';
    tileCells.forEach((cell) => {
      const c = classify(cell);
      const href = cell.querySelector('a[href]');
      const tile = document.createElement('a');
      tile.className = 'dest';
      tile.href = href ? href.getAttribute('href') : '#';

      placeMedia(tile, c.media);

      const label = document.createElement('span');
      label.className = 'dest-label';
      const catP = [...cell.querySelectorAll('p')].find((p) => !p.querySelector('a'));
      if (catP) {
        const n = document.createElement('span');
        n.className = 'n';
        n.textContent = catP.textContent.trim();
        label.append(n);
      }
      if (c.h3) {
        const h3 = document.createElement('h3');
        const src = c.h3.querySelector('h1,h2,h3,h4,h5,h6') || c.h3;
        [...src.childNodes].forEach((nn) => h3.append(nn.cloneNode(true)));
        label.append(h3);
      }
      tile.append(label);
      grid.append(tile);
    });
    wrap.append(grid);
  }

  if (ctaCell) {
    const cta = document.createElement('div');
    cta.className = 'dest-cta';
    const a = ctaCell.querySelector('a[href]');
    if (a) cta.append(makeButton(a));
    wrap.append(cta);
  }

  // Routes duo
  if (routeCells.length) {
    const routes = document.createElement('div');
    routes.className = 'routes';
    routeCells.forEach((cell, i) => {
      const c = classify(cell);
      const route = document.createElement('div');
      route.className = `route ${i === routeCells.length - 1 ? 'adv' : 'mag'}`;

      const paras = [...cell.querySelectorAll('p')].filter((p) => !p.querySelector('a'));
      const heading = c.h3;
      let kickerEl = paras.find((p) => heading
        && (p.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING));
      if (!kickerEl) [kickerEl] = paras;
      if (kickerEl) {
        const rk = document.createElement('span');
        rk.className = 'rk';
        rk.textContent = kickerEl.textContent.trim();
        route.append(rk);
      }
      if (heading) {
        const h3 = document.createElement('h3');
        const src = heading.querySelector('h1,h2,h3,h4,h5,h6') || heading;
        [...src.childNodes].forEach((nn) => h3.append(nn.cloneNode(true)));
        route.append(h3);
      }
      const bodyEl = paras.find((p) => p !== kickerEl);
      if (bodyEl) {
        const p = document.createElement('p');
        [...bodyEl.childNodes].forEach((nn) => p.append(nn.cloneNode(true)));
        route.append(p);
      }
      const link = cell.querySelector('a[href]');
      if (link) {
        const foot = document.createElement('div');
        foot.className = 'route-cta';
        foot.append(makeButton(link));
        route.append(foot);
      }
      routes.append(route);
    });
    wrap.append(routes);
  }

  block.replaceChildren(wrap);
}
