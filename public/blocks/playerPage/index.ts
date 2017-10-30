import Block from '../block/index';
import userService from '../../services/userService';
import { showHome, showGame, router } from '../../main';
import playerpageTemplate from './playerPage.pug';

function onLogoutBtnClick(el) {
  el.querySelector('.ui.button__logout').addEventListener('click', () => {
    userService.logout().then(() => {
      router.setPath('/');
      showHome();
    });
  });
}

function onPlayBtnClick(el) {
  el.querySelector('.ui.button__play').addEventListener('click', () => {
    if (userService.isLoggedIn()) {
      showGame();
    } else {
      showHome();
    }
  });
}

class PlayerPage extends Block {
  constructor() {
    const el = document.createElement('div');
    el.innerHTML = playerpageTemplate({ user: userService.user || 'Guest' });
    onLogoutBtnClick(el);
    onPlayBtnClick(el);
    super(el);
  }
}

export default PlayerPage;
