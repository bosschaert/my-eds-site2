  // Mobile nav a11y per mobile-nav-collapse.md (≤10 lines)
  (function () {
    var btn = document.querySelector('.ds-nav-burger');
    var nav = document.getElementById('primary-nav');
    if (!btn || !nav) return;
    btn.addEventListener('click', function () {
      var open = nav.getAttribute('aria-expanded') === 'true';
      nav.setAttribute('aria-expanded', open ? 'false' : 'true');
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
      btn.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.getAttribute('aria-expanded') === 'true') {
        nav.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-expanded', 'false');
        btn.focus();
      }
    });
  })();
