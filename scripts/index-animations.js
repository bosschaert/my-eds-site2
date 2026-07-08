/* Glendalough — Gallery carousel + smooth-scroll nav
   Converted from Stardust DCLogic class to vanilla JS.
   Loaded by delayed.js when main.dataset.overlay === 'index'. */

(function initGlendalough() {
  const slides = [
    { name: 'Upper Lake', cap: 'Glacial waters beneath the cliffs of the Spinc' },
    { name: 'The Round Tower', cap: 'Thirty metres of 10th-century stone above the monastic city' },
    { name: 'Glenealo Valley', cap: 'Wild deer and cascading streams on the high route' },
    { name: 'The Boardwalk', cap: 'Railway sleepers climbing high above the Upper Lake' },
    { name: 'Poulanass Waterfall', cap: "The 'hole of the falls' tumbling through the woods" },
  ];

  let current = 0;
  let timer = null;

  /* ---- Gallery carousel ---- */
  const gallery = document.querySelector('section.gallery');
  if (!gallery) return;

  const slideEls = gallery.querySelectorAll('[style*="transition: opacity"]');
  const dotEls = gallery.querySelectorAll('[style*="border-radius: 999px"][style*="cursor: pointer"]');
  const captionEl = gallery.querySelector('[style*="font-size: 26px"]');
  const subcapEl = gallery.querySelector('[style*="font-size: 15px"][style*="margin-top: 4px"]');
  const prevBtn = gallery.querySelectorAll('button[style*="border-radius: 50%"]')[0];
  const nextBtn = gallery.querySelectorAll('button[style*="border-radius: 50%"]')[1];

  function setSlide(i) {
    current = ((i % slides.length) + slides.length) % slides.length;
    slideEls.forEach((el, idx) => {
      el.style.opacity = idx === current ? '1' : '0';
    });
    dotEls.forEach((el, idx) => {
      el.style.width = idx === current ? '28px' : '8px';
      el.style.background = idx === current ? '#5de3f7' : 'rgba(255,255,255,0.35)';
    });
    if (captionEl) captionEl.textContent = slides[current].name;
    if (subcapEl) subcapEl.textContent = slides[current].cap;
    startTimer();
  }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => setSlide(current + 1), 5000);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => setSlide(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => setSlide(current + 1));
  dotEls.forEach((dot, i) => dot.addEventListener('click', () => setSlide(i)));

  startTimer();

  /* ---- Smooth-scroll nav links ---- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const target = document.getElementById(a.getAttribute('href').slice(1));
      if (target) {
        e.preventDefault();
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.pageYOffset - 64,
          behavior: 'smooth',
        });
      }
    });
  });
}());
