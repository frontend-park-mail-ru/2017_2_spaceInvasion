import {throwIfNull} from '../utils/utils';

function changeThemeForMan(): void {
  const menuItems = document.querySelectorAll('.ui.dropdown.ui__dropdown .menu div.item');

  throwIfNull(document.querySelector('body')).setAttribute('class', 'man');
  menuItems[1].classList.remove('active', 'selected');
  menuItems[0].classList.add('active', 'selected');

  const signUpBtn = throwIfNull(document.querySelector('.ui.button#signupBtn'));
  signUpBtn.classList.remove('alien');
  signUpBtn.classList.add('man');

  const loginBtn = document.querySelector('.ui.submit.ui__submit__login.ui__submit__login__button.button');
  const registerBtn = document.querySelector('.ui.button.ui__button__register');
  const leaderboard = document.querySelector('.ui__selectable__celled__table__leaderboard');

  if (loginBtn !== null) {
    loginBtn.classList.remove('alien');
    loginBtn.classList.add('man');
  }

  if (registerBtn !== null) {
    registerBtn.classList.remove('alien');
    registerBtn.classList.add('man');
  }

  if (leaderboard !== null) {
    leaderboard.classList.remove('alien');
    leaderboard.classList.add('man');
  }

  sessionStorage.setItem('theme', 'man');
}

function changeThemeForAlien(): void {
  const menuItems = document.querySelectorAll('.ui.dropdown.ui__dropdown.item .menu .item');

  throwIfNull(document.querySelector('body')).setAttribute('class', 'alien');
  menuItems[0].classList.remove('active', 'selected');
  menuItems[1].classList.add('active', 'selected');

  const signUpBtn = throwIfNull(document.querySelector('.ui.button#signupBtn'));
  signUpBtn.classList.remove('man');
  signUpBtn.classList.add('alien');

  const loginBtn = document.querySelector('.ui.submit.ui__submit__login.ui__submit__login__button.button');
  const registerBtn = document.querySelector('.ui.button.ui__button__register');
  const leaderboard = document.querySelector('.ui__selectable__celled__table__leaderboard');

  if (loginBtn !== null) {
    loginBtn.classList.remove('man');
    loginBtn.classList.add('alien');
  }

  if (registerBtn !== null) {
    registerBtn.classList.remove('man');
    registerBtn.classList.add('alien');
  }

  if (leaderboard !== null) {
    leaderboard.classList.remove('man');
    leaderboard.classList.add('alien');
  }

  sessionStorage.setItem('theme', 'alien');
}

function getTheme(): string {
  return sessionStorage.getItem('theme') || 'man';
}

function refreshTheme(): void {
  switch (getTheme()) {
    case 'alien':
      changeThemeForAlien();
      break;
    default: // man
      changeThemeForMan();
      break;
  }
}

function init(): void {
  const races = document.querySelectorAll('.right.menu .ui.dropdown.ui__dropdown.item .menu .item');
  races.forEach((el: Element) => {
    el.addEventListener('click', () => {
      switch ((el as HTMLElement).dataset['race']) {
        case 'man':
          changeThemeForMan();
          break;
        case 'alien':
          changeThemeForAlien();
          break;
        default:
          throw Error('Wrong theme identifier');
      }
    });
  });
}

export {changeThemeForAlien, changeThemeForMan, getTheme, refreshTheme, init as initThemes};