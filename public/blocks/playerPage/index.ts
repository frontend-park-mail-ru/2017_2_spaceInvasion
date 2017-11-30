import Block from '../block/index';
import userService from '../../services/userService';
import playerPageTemplate from './playerPage.pug';
import {throwIfNull} from '../../utils/utils';
import {default as router, Router} from '../../modules/router';
import Navigator from '../../modules/navigator';
import LoginBlock from '../login/index';
import SinglePlayerGameBlock from '../game/singlePlayerGameBlock';
import MultiPlayerGameBlock from '../game/multiPlayerGameBlock';

class PlayerPageBlock extends Block {
  show(): void {
    if (!Navigator.sections.playerPage.ready) {
      this.el.innerHTML = playerPageTemplate({user: userService.user || 'Guest'});
      this.onLogoutBtnClick(this.el);
      this.onPlayBtnClick(this.el);
      Navigator.sections.playerPage.ready = true;
    }

    router.setPath('/profile');
    super.show();
  }

  private onLogoutBtnClick(el: HTMLElement): void {
    throwIfNull(el.querySelector('.ui.button__logout')).addEventListener('click', () => {
      userService.logout().then(() => {
        Navigator.sections.hide();
        router.setPath('/');
        Router.route();
      });
    });
  }

  private onPlayBtnClick(el: HTMLElement): void {
    throwIfNull(el.querySelector('.ui.button__play')).addEventListener('click', () => {
      Navigator.sections.hide();
      if (userService.isLoggedIn()) {
        Navigator.sections.game.append(new MultiPlayerGameBlock());
        Navigator.sections.game.show();
      } else {
        (Navigator.sections.home as LoginBlock).show(); // TODO: Сверстать homepage
      }
    });
  }
}

export default PlayerPageBlock;
