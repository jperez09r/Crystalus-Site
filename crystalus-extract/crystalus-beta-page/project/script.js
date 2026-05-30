// Projection navigation: when clicking a nav link, briefly flicker the
// target section like a mint-glass holo projector booting up.
document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('.nav a, .mobile-nav a, a.proj-link');
  links.forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href') || '';
      if (!href.startsWith('#')) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.classList.remove('projecting');
      // force reflow so the animation re-runs
      void target.offsetWidth;
      target.classList.add('projecting');
      target.scrollIntoView({behavior: 'smooth', block: 'start'});
      // close mobile drawer after tapping
      const drawer = document.getElementById('mobile-nav');
      const burger = document.querySelector('.nav-burger');
      if (drawer && drawer.classList.contains('open')) {
        drawer.classList.remove('open');
        drawer.setAttribute('aria-hidden', 'true');
        if (burger) burger.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Hamburger toggle
  const burger = document.querySelector('.nav-burger');
  const drawer = document.getElementById('mobile-nav');
  if (burger && drawer) {
    burger.addEventListener('click', () => {
      const open = drawer.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
    });
    // close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        drawer.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        drawer.setAttribute('aria-hidden', 'true');
      }
    });
  }

  // Mark active nav link based on visibility
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav a');
  const setActive = (id) => {
    navLinks.forEach(a => {
      if (a.getAttribute('href') === '#' + id) a.classList.add('active');
      else a.classList.remove('active');
    });
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) setActive(en.target.id);
      });
    }, {rootMargin: '-40% 0px -55% 0px', threshold: 0});
    sections.forEach(s => io.observe(s));
  }

  // Tilt the timeline slightly to mouse for a parallax feel
  const timeline = document.querySelector('.timeline');
  if (timeline) {
    timeline.addEventListener('mousemove', (e) => {
      const r = timeline.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) / r.width;
      timeline.style.setProperty('--tx', dx.toFixed(3));
    });
  }
});
