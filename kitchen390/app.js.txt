const tabs = [...document.querySelectorAll('.package-tabs [role="tab"]')];
const panels = [...document.querySelectorAll('.package-panel[role="tabpanel"]')];

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
