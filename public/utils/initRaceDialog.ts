const body = document.querySelector('body');
const signUpBtn = document.querySelector('.ui.button#signUpBtn');

function changeThemeForMan() {
  body.setAttribute('class', 'man');

  signUpBtn.classList.remove('alien');
  signUpBtn.classList.add('man');

  const loginBtn = document.querySelector('.ui.submit.login.button');

  if (loginBtn != null) {
    loginBtn.classList.remove('alien');
    loginBtn.classList.add('man');
  }

  const leaderboard = document.querySelector('.ui.table.leaderboard');
  if (leaderboard != null) {
    leaderboard.classList.remove('alien');
    leaderboard.classList.add('man');
  }
}

function changeThemeForAlien() {
  body.setAttribute('class', 'alien');

  signUpBtn.classList.remove('man');
  signUpBtn.classList.add('alien');

  const loginBtn = document.querySelector('.ui.submit.login.button');
  if (loginBtn != null) {
    loginBtn.classList.remove('man');
    loginBtn.classList.add('alien');
  }

  const leaderboard = document.querySelector('.ui.table.leaderboard');
  if (leaderboard != null) {
    leaderboard.classList.remove('man');
    leaderboard.classList.add('alien');
  }
}

function getThemeTag() {
  const tag: HTMLElement = <HTMLElement> document.querySelector('.menu .item.active.selected')
  return tag.innerText;
}

const races = document.querySelectorAll('.compact.menu .dropdown.item .item');
races.forEach((el) => {
  el.addEventListener('click', () => {
    switch ((el as HTMLElement).innerText) {
      case 'Man':
        changeThemeForMan();
        break;
      case 'Alien':
        changeThemeForAlien();
        break;
      default:
        window.console.log('error');
        break;
    }
  });
}, this);

export { changeThemeForAlien, changeThemeForMan, getThemeTag };
