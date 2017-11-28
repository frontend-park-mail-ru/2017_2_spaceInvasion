import Block from '../block/index';
import gameTemplate from './game.pug';
import Navigator from '../../modules/navigator';
import SinglePlayerStrategy from '../../modules/game/strateges/singlePlayerStrategy';
import Game from '../../models/game';
import KeyboardController from '../../modules/game/controllers/keyboardController';
import {throwIfNull} from '../../utils/utils';
import router from '../../modules/router';
import {dismissAllMessages} from '../../utils/notifications';
import gameService from '../../services/gameService';
import userService from '../../services/userService';
import {getTheme} from '../../modules/themes';
import {SIDE} from '../../utils/constants';

class GameBlock extends Block {
  private game: Game;

  show(): void {
    dismissAllMessages();
    if (!Navigator.sections.game.ready) {
      this.el.innerHTML = gameTemplate();
      const user = userService.user;
      if (!this.game && user) {
        this.game = new Game(
          SinglePlayerStrategy,
          KeyboardController,
          <HTMLCanvasElement>throwIfNull(document.querySelector('canvas#game'))
        );
        this.game.join(user, getTheme() === 'man' ? SIDE.MAN : SIDE.ALIEN);
        Navigator.sections.game.ready = true;
      }
    }

    gameService.bind();
    router.setPath('/game');
    super.show();
  }

  hide() {
    gameService.unbind();
    super.hide();
  }
}

export default GameBlock;
