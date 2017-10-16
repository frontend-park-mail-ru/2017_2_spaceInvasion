import Block from '../block/index';
import userService from '../../services/userService';
import { showHome } from '../../main';

function onLogoutBtnClick(el) {
  el.querySelector('.ui.logout').addEventListener('click', () => {
    userService.logout().then(() => {
      showHome();
    });
  });
}

class PlayerPage extends Block {
  constructor() {
    const el = document.createElement('div');
    el.innerHTML = window.playerpageTemplate({ user: userService.user });
    onLogoutBtnClick(el);
    super(el);
  }
}

export default PlayerPage;
