const body = document.querySelector('body');
const signUpBtn = document.querySelector('.ui.button#signUpBtn');

function changeThemeForMan() {
  body.setAttribute('class', 'man');

  signUpBtn.classList.remove('alien');
  signUpBtn.classList.add('man');

  const loginBtn = document.querySelector('.ui.submit.ui__submit__login.ui__submit__login__button.button');
  const registerBtn = document.querySelector('.ui.button.ui__button__register');

  if (loginBtn != null) {
    loginBtn.classList.remove('alien');
    loginBtn.classList.add('man');
  }

  if(registerBtn != null){
    registerBtn.classList.remove('alien');
    registerBtn.classList.add('man');
  }

  const leaderboard = document.querySelector('.ui__selectable__celled__table__leaderboard');
  if (leaderboard != null) {
    leaderboard.classList.remove('alien');
    leaderboard.classList.add('man');
  }
}

function changeThemeForAlien() {
  body.setAttribute('class', 'alien');

  signUpBtn.classList.remove('man');
  signUpBtn.classList.add('alien');

  const loginBtn = document.querySelector('.ui.submit.ui__submit__login.ui__submit__login__button.button');

  if (loginBtn != null) {
    loginBtn.classList.remove('man');
    loginBtn.classList.add('alien');
  }

  const leaderboard = document.querySelector('.ui__selectable__celled__table__leaderboard');
  if (leaderboard != null) {
    leaderboard.classList.remove('man');
    leaderboard.classList.add('alien');
  }

  const registerBtn = document.querySelector('.ui.button.ui__button__register');
  if(registerBtn != null){
    registerBtn.classList.remove('man');
    registerBtn.classList.add('alien');
  }

}

function getThemeTag() {
  const tag: HTMLElement = <HTMLElement> document.querySelector('.menu .item.active.selected')
  return tag.innerText;
}

const races = document.querySelectorAll('.compact.menu .ui.simple.dropdown.ui__dropdown.item .item');
races.forEach((el) => {
  el.addEventListener('click', () => {
    const menuItems = document.querySelectorAll(".ui.dropdown.ui__dropdown .menu div.item");
    switch ((el as HTMLElement).innerText) {
      case 'Man':
      menuItems[1].classList.remove('active','selected');
      menuItems[0].classList.add('active','selected');
        changeThemeForMan();
        break;
      case 'Alien':
      menuItems[0].classList.remove('active','selected');
      menuItems[1].classList.add('active','selected');
        changeThemeForAlien();
        break;
      default:
        window.console.log('error');
        break;
    }
  });
}, this);

export { changeThemeForAlien, changeThemeForMan, getThemeTag };