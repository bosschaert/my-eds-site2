/**
 * intro — centered editorial prose strip with a kicker.
 * Template-slotted (#95). Schema: index.json#intro
 *
 * Authoring:
 *   kicker text (single cell) — the small uppercase line
 *   body <p> — the paragraph
 */

export default function decorate(block) {
  const paras = [...block.querySelectorAll('p')];
  const cells = [...block.querySelectorAll(':scope > div > div')];

  // kicker = short first text; body = the paragraph
  let kickerText = '';
  let bodyEl = null;
  if (paras.length >= 2) {
    kickerText = paras[0].textContent.trim();
    [, bodyEl] = paras;
  } else if (paras.length === 1) {
    bodyEl = paras[0];
    if (cells[0] && cells[0] !== bodyEl.parentElement) kickerText = cells[0].textContent.trim();
  } else if (cells.length >= 2) {
    kickerText = cells[0].textContent.trim();
    bodyEl = cells[1];
  }

  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  if (kickerText) {
    const k = document.createElement('p');
    k.className = 'kicker';
    k.textContent = kickerText;
    wrap.append(k);
  }
  if (bodyEl) {
    const p = document.createElement('p');
    p.append(...bodyEl.childNodes);
    wrap.append(p);
  }
  block.replaceChildren(wrap);
}
