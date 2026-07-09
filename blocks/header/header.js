import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const WKND_LOGO = `<svg viewBox="0 0 239.35 89.09" role="img" aria-label="WKND"><path d="M60.33,94.83h-13L39.94,47.39h-.25l-7,47.43H19.78L4.9,5.93H19l6.88,46.59h.21L32.45,5.88H46.6l6.86,46.45h.27L60.1,5.92H74.24Z" transform="translate(-4.9 -5.81)"/><path d="M176.45,64.52V5.94h13.49V94.8H175.49l-18.18-56-.23,0v56H143.69v-89h2.61c3.76,0,7.52,0,11.28,0A1.33,1.33,0,0,1,159.14,7q7.54,25.5,15.14,51l2,6.61Z" transform="translate(-4.9 -5.81)"/><path d="M202,5.84h21.67c9.68,0,18.75,7.78,20.19,17.36a30.86,30.86,0,0,1,.35,4.53q0,22.61,0,45.22c0,9.72-5.55,17.9-14.23,20.78a22.16,22.16,0,0,1-6.45,1.09c-6.71.14-13.43.05-20.15.05H202Zm13.44,13.73V81.41c2.76,0,5.44.07,8.11,0A7.56,7.56,0,0,0,231,73.64c0-1,0-2,0-3q0-21.59,0-43.18a7.57,7.57,0,0,0-6.86-7.86C221.31,19.42,218.42,19.57,215.45,19.57Z" transform="translate(-4.9 -5.81)"/><path d="M98.88,94.81H85.34V5.92H98.88V36.78l.26.05,4.14-8q5.64-11,11.26-22a1.56,1.56,0,0,1,1.63-1c4,.05,8.08,0,12.12,0h1.24L128.44,8q-8.39,16.63-16.8,33.25a2.16,2.16,0,0,0-.09,2q10.31,25.15,20.57,50.32c.15.36.28.73.47,1.22-.39,0-.68.09-1,.09-4.6,0-9.2,0-13.8,0a1.3,1.3,0,0,1-1.44-1q-6.52-16.8-13.1-33.58c-.14-.36-.3-.72-.54-1.32-.94,1.89-1.71,3.62-2.65,5.25a9.9,9.9,0,0,0-1.25,5.25c.07,8,0,15.92,0,23.88Z" transform="translate(-4.9 -5.81)"/></svg>`;

const SEARCH_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>`;
const MENU_ICON = `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>`;

/**
 * header — WKND sticky chrome (utility bar + primary nav + search).
 * The prototype chrome is rendered here; authorable links come from the
 * /nav fragment as three link groups (utility / primary nav / — ), one EDS
 * section each. Interactive JS from the prototype (menu toggle) is
 * re-implemented as a CSS checkbox drawer.
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';

  // Collect authorable link groups from the fragment sections.
  const groups = fragment
    ? [...fragment.querySelectorAll(':scope > div')].map((sec) => [...sec.querySelectorAll('a')])
    : [];
  const utilityLinks = groups[0] || [];
  const primaryLinks = groups[1] || [];

  const utility = document.createElement('div');
  utility.className = 'utility';
  const uWrap = document.createElement('div');
  uWrap.className = 'wrap';
  utilityLinks.forEach((a) => uWrap.append(a.cloneNode(true)));
  utility.append(uWrap);

  const site = document.createElement('div');
  site.className = 'site';
  const sWrap = document.createElement('div');
  sWrap.className = 'wrap';

  // checkbox drawer toggle (must be first sibling for :checked selector)
  const toggle = document.createElement('input');
  toggle.type = 'checkbox';
  toggle.id = 'wknd-nav-toggle';
  toggle.className = 'nav-toggle-cb';
  block.prepend(toggle);

  const logo = document.createElement('a');
  logo.className = 'logo';
  logo.href = '/';
  logo.setAttribute('aria-label', 'WKND home');
  logo.innerHTML = WKND_LOGO;
  sWrap.append(logo);

  const nav = document.createElement('nav');
  nav.className = 'primary';
  primaryLinks.forEach((a) => {
    const link = a.cloneNode(true);
    if (/magazine/i.test(link.textContent)) link.dataset.route = 'magazine';
    nav.append(link);
  });
  sWrap.append(nav);

  const searchbox = document.createElement('div');
  searchbox.className = 'searchbox';
  searchbox.innerHTML = `${SEARCH_ICON}<input type="search" placeholder="Search" aria-label="Search">`;
  sWrap.append(searchbox);

  const menuLabel = document.createElement('label');
  menuLabel.className = 'menu-toggle';
  menuLabel.setAttribute('for', 'wknd-nav-toggle');
  menuLabel.setAttribute('aria-label', 'Menu');
  menuLabel.innerHTML = MENU_ICON;
  sWrap.append(menuLabel);

  site.append(sWrap);
  block.append(utility, site);
}
