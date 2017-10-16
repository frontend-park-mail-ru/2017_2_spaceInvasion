import { closeDialog } from './aboutAlertDialog';
import { showHome, showAbout, showLeaderboard, showRegistration } from '../main';

const menuItems = document.querySelectorAll('.item');
const menu = document.querySelector('div.ui.huge.menu');
menu.setAttribute('data-tab', 'home');

function setSelection(el) {
  document.getElementById(el).setAttribute('class', 'active item');
}

function clearSelection() {
  const tabs = ['homeBtn', 'aboutBtn', 'signUpBtn', 'leaderboardBtn'];
  tabs.forEach((el) => {
    document.getElementById(el).setAttribute('class', 'item');
  }, this);
}

function navigate() {
  if (!this.id) {
    return;
  }
  clearSelection();
  if (menu.getAttribute('data-tab') === 'about' && typeof menu.getAttribute('data-dev-dialog') !== 'undefined') {
    closeDialog();
  }
  setSelection(this.id);
  switch (this.id) {
    case 'homeBtn':
      menu.setAttribute('data-tab', 'home');
      showHome();
      break;
    case 'aboutBtn':
      menu.setAttribute('data-tab', 'about');
      showAbout();
      break;
    case 'signUpBtn':
      menu.setAttribute('data-tab', 'signUp');
      clearSelection();
      showRegistration();
      break;
    case 'leaderboardBtn':
      menu.setAttribute('data-tab', 'leaderboard');
      showLeaderboard();
      break;
    default:
      break;
  }
}

for (let i = 0; i < menuItems.length; i += 1) {
  menuItems[i].addEventListener('click', navigate.bind(menuItems[i]));
}
