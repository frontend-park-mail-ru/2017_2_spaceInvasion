import Block from '../block/index';
import userService from '../../services/userService';
import { showHome, showGame } from '../../modules/navigator';
import playerpageTemplate from './playerPage.pug';
import { throwIfNull } from "../../utils/htmlUtils";
import router from "../../modules/router";

function onLogoutBtnClick(el : HTMLElement) : void {
  throwIfNull(el.querySelector('.ui.button__logout')).addEventListener('click', () => {
    userService.logout().then(() => {
      router.setPath('/');
      showHome();
    });
  });
}

function onPlayBtnClick(el : HTMLElement) : void {
  throwIfNull(el.querySelector('.ui.button__play')).addEventListener('click', () => {
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
