import Block from '../block/index';
import userService from '../../services/userService';
import playerPageTemplate from './playerPage.pug';
import {throwIfNull} from '../../utils/utils';
import {default as router, Router} from '../../modules/router';
import Navigator from '../../modules/navigator';
import MultiPlayerGameBlock from '../game/multiPlayerGameBlock';
import SinglePlayerGameBlock from '../game/singlePlayerGameBlock';
import {getTheme} from '../../modules/themes';

class PlayerPageBlock extends Block {
  private initialized = false;

  show(): void {
    if (!Navigator.sections.playerPage.ready) {
      this.el.innerHTML = playerPageTemplate({theme: getTheme(), user: userService.user || {username: 'Guest'}});
      this.onLogoutBtnClick(this.el);
      this.onPlayBtnClick(this.el);
      Navigator.sections.playerPage.ready = true;
    }

    router.setPath('/profile');
    super.show();
  }

  private onLogoutBtnClick(el: HTMLElement): void {
    // TODO: Show loading image
    const element = throwIfNull(el.querySelector('.ui.button__logout'));
    const listener = () => {
      Navigator.sections.hide();
      element.removeEventListener('click', listener);
      userService.logout().then(() => {
        Navigator.sections.hide();
        router.route('/');
        element.addEventListener('click', listener);
      });
    };

    element.addEventListener('click', listener);
  }

  private onPlayBtnClick(el: HTMLElement): void {
    throwIfNull(el.querySelector('.ui.button__play')).addEventListener('click', () => {
      Navigator.sections.hide();
      if (userService.isLoggedIn()) {
        if (!this.initialized) {
          Navigator.sections.game.append(new MultiPlayerGameBlock());
          this.initialized = true;
        }
        Navigator.sections.game.show();
      } else {
        Navigator.sections.home.show(); // TODO: Сверстать homepage
      }
    });
  }
}

export default PlayerPageBlock;
