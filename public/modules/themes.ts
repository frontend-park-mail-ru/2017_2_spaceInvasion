const selectors = [
  '.ui.button',
  '.navbar',
  '.ui__selectable__celled__table__leaderboard',
  '.registration_form_style',
  'body'
];

function getTheme(): string {
  return window.sessionStorage.getItem('theme') || 'man';
}

function refreshTheme(theme?: string): void {
  const t = theme || getTheme() || 'man';
  const otherT = (t === 'man' ? 'alien' : 'man');
  let menuItems = Array.from(document.querySelectorAll('.ui.dropdown.item.races .menu .item'));

  if (t !== 'man') {
    menuItems = menuItems.reverse();
  }
  menuItems[0].classList.add('active', 'selected');
  menuItems[1].classList.remove('active', 'selected');

  selectors.forEach(sel => {
    const elems = document.querySelectorAll(sel);
    elems.forEach(elem => {
      elem.classList.remove(otherT);
      elem.classList.add(t);
    });
  });
  sessionStorage.setItem('theme', t);
}

function init(): void {
  const races = document.querySelectorAll('.right.menu .ui.dropdown.ui__dropdown.item .menu .item');
  races.forEach((el: Element) => {
    el.addEventListener('click', () => {
      refreshTheme((el as HTMLElement).dataset['race']);
    });
  });
}

export {getTheme, refreshTheme, init as initThemes};
