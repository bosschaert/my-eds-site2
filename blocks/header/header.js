import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * header — Saint-Louis Agglomération chrome: ONLY the navy utility bar.
 * Left: utility links (Plan du site · Aller au contenu). Right: static weather,
 * text-size controls, social icons and the green Contact pill (matches the
 * prototype's top utility bar). The logo now lives overlaid on the hero; the
 * thematic navigation is its own `themenav` block below the hero.
 *
 * Built from the /nav content fragment, which holds:
 *   1. brand   — logo link (used by the hero, not rendered here)
 *   2. utility — a list of links (last one becomes the Contact button)
 */

const WEATHER_ICON = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M5 12H3M21 12h-2M6 6l1.5 1.5M18 6l-1.5 1.5"/></svg>';
const FACEBOOK_ICON = '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M13 22v-8h3l1-4h-4V8c0-1 .3-2 2-2h2V2.2C18.4 2.1 17 2 16 2c-3 0-5 1.8-5 5v3H8v4h3v8z"/></svg>';
const INSTAGRAM_ICON = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>';
const YOUTUBE_ICON = '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M22 8a3 3 0 0 0-2-2c-1.8-.5-8-.5-8-.5s-6.2 0-8 .5a3 3 0 0 0-2 2 31 31 0 0 0 0 8 3 3 0 0 0 2 2c1.8.5 8 .5 8 .5s6.2 0 8-.5a3 3 0 0 0 2-2 31 31 0 0 0 0-8zM10 15V9l5 3z"/></svg>';

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';
  const sections = fragment ? [...fragment.children] : [];

  // utility section — list of links (skip section 0, which is the brand/logo)
  const utilSection = sections[1];
  const utilLinks = utilSection ? [...utilSection.querySelectorAll('a')] : [];

  // ---- utility bar ----
  const utility = document.createElement('div');
  utility.className = 'utility';
  const uWrap = document.createElement('div');
  uWrap.className = 'wrap';
  const uLeft = document.createElement('div');
  uLeft.className = 'utility-left';
  const uRight = document.createElement('div');
  uRight.className = 'utility-right';

  // left links + Contact button, sourced from the nav utility section.
  let contactLink = null;
  utilLinks.forEach((a, i) => {
    const clone = a.cloneNode(true);
    if (i >= utilLinks.length - 1) {
      // last utility link -> Contact button (rendered on the right, after chrome)
      clone.className = 'btn-contact';
      contactLink = clone;
    } else {
      if (i === 0) clone.classList.add('plan');
      if (uLeft.children.length) {
        const sep = document.createElement('span');
        sep.className = 'sep';
        sep.textContent = '·';
        uLeft.append(sep);
      }
      uLeft.append(clone);
    }
  });

  // Fallback labels if the nav fragment is empty.
  if (!uLeft.children.length) {
    uLeft.innerHTML = '<a class="plan" href="#">Plan du site</a><span class="sep">·</span><a href="#contenu">Aller au contenu</a>';
  }

  // ---- right-side static chrome (matches prototype) ----
  const weather = document.createElement('span');
  weather.className = 'weather';
  weather.setAttribute('aria-label', 'Météo à Saint-Louis');
  weather.innerHTML = `${WEATHER_ICON} 18° / 33°`;

  const txtSize = document.createElement('span');
  txtSize.className = 'txt-size';
  txtSize.setAttribute('aria-label', 'Taille du texte');
  txtSize.innerHTML = '<button type="button" aria-label="Agrandir le texte">A+</button><button type="button" aria-label="Réduire le texte">A−</button>';

  const social = document.createElement('span');
  social.className = 'social';
  social.innerHTML = `<a href="#" aria-label="Facebook">${FACEBOOK_ICON}</a><a href="#" aria-label="Instagram">${INSTAGRAM_ICON}</a><a href="#" aria-label="YouTube">${YOUTUBE_ICON}</a>`;

  uRight.append(weather, txtSize, social);
  if (contactLink) {
    uRight.append(contactLink);
  } else {
    uRight.insertAdjacentHTML('beforeend', '<a class="btn-contact" href="#footer">Contact</a>');
  }

  uWrap.append(uLeft, uRight);
  utility.append(uWrap);

  block.append(utility);
}
