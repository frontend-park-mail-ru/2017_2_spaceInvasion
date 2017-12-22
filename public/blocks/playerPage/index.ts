import Block from '../block/index';
import userService from '../../services/userService';
import playerPageTemplate from './playerPage.pug';
import {throwIfNull} from '../../utils/utils';
import router from '../../modules/router';
import Navigator from '../../modules/navigator';
import MultiPlayerGameBlock from '../game/multiPlayerGameBlock';
import {getTheme} from '../../modules/themes';

class PlayerPageBlock extends Block {
  show(): void {
    if (!Navigator.sections.playerPage.ready) {
      this.el.innerHTML = playerPageTemplate({theme: getTheme(), user: userService.user || {username: 'Guest'}});
      this.onLogoutBtnClick(this.el);
      this.onPlayBtnClick(this.el);
      this.onRulesBtnClick(this.el);
      Navigator.sections.playerPage.ready = true;
    }

    router.setPath('/profile');
    super.show();
  }

  private onRulesBtnClick(el: HTMLElement): void {
    throwIfNull(el.querySelector('.ui.button.rules'))
      .addEventListener('click', () => {
        Navigator.sections.hide();
        Navigator.sections.home.show();
      });
  }

  private onLogoutBtnClick(el: HTMLElement): void {
    // TODO: Show loading image
    const element = throwIfNull(el.querySelector('.ui.button__logout'));
    const listener = () => {
      Navigator.sections.hide();
      userService.logout().then(() => {
        Navigator.sections.hide();
        router.route('/');
        element.addEventListener('click', listener, {once: true});
      });
    };

    element.addEventListener('click', listener, {once: true});
  }

  private onPlayBtnClick(el: HTMLElement): void {
    throwIfNull(el.querySelector('.ui.button__play')).addEventListener('click', () => {
      Navigator.sections.hide();
      if (userService.isLoggedIn()) {
        if (!Navigator.sections.game.initialized) {
          Navigator.sections.game.append(new MultiPlayerGameBlock());
          Navigator.sections.game.initialized = true;
        }
        Navigator.sections.game.show();
      } else {
        Navigator.sections.login.show();
      }
    });
  }
}

export default PlayerPageBlock;
