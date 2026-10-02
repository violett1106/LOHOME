document.addEventListener('DOMContentLoaded', () => {
  const tabs = [...document.querySelectorAll('.package-tabs [role="tab"]')];
  const panels = [...document.querySelectorAll('.package-panel[role="tabpanel"]')];

  function setupCarousel(carousel) {
    if (!carousel || carousel.dataset.ready === '1') return;
    carousel.dataset.ready = '1';

    const slides = [...carousel.querySelectorAll('.carousel-slide')];
    const dots = [...carousel.querySelectorAll('.carousel-dots button')];
    const prev = carousel.querySelector('.carousel-arrow.prev');
    const next = carousel.querySelector('.carousel-arrow.next');
    let index = 0;
    let touchStartX = 0;

    function showSlide(newIndex) {
      if (!slides.length) return;
      index = (newIndex + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
      dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
    }

    prev?.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      showSlide(index - 1);
    });

    next?.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      showSlide(index + 1);
    });

    dots.forEach((dot, i) => dot.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      showSlide(i);
    }));

    carousel.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    carousel.addEventListener('touchend', e => {
      const distance = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(distance) < 45) return;
      showSlide(distance < 0 ? index + 1 : index - 1);
    }, { passive: true });

    showSlide(0);
  }

  function activateTab(tab) {
    const target = tab.getAttribute('aria-controls');

    tabs.forEach(btn => {
      const active = btn === tab;
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
      btn.tabIndex = active ? 0 : -1;
    });

    panels.forEach(panel => {
      panel.hidden = panel.id !== target;
    });

    const activePanel = document.getElementById(target);
    setupCarousel(activePanel?.querySelector('[data-carousel]'));
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => activateTab(tab));

    tab.addEventListener('keydown', e => {
      const current = tabs.indexOf(tab);
      let next = current;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (current + 1) % tabs.length;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (current - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = tabs.length - 1;

      if (next !== current) {
        e.preventDefault();
        tabs[next].focus();
        activateTab(tabs[next]);
      }
    });
  });

  document.querySelectorAll('[data-carousel]').forEach(setupCarousel);
});
