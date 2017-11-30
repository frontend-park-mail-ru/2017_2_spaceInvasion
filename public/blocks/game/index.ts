import Block from '../block/index';
import gameTemplate from './game.pug';
import Game from '../../models/game';
import KeyboardController from '../../modules/game/controllers/keyboardController';
import {throwIfNull} from '../../utils/utils';
import router from '../../modules/router';
import {dismissAllMessages} from '../../utils/notifications';
import gameService from '../../services/gameService';
import {ConstructableStrategy} from '../../modules/game/strateges/strategyInterface';
import Navigator from '../../modules/navigator';

abstract class GameBlock extends Block {
  protected game: Game;
  protected strategy: ConstructableStrategy;
  protected abstract init(): void;

  show(): void {
    dismissAllMessages();
    if (!Navigator.sections.game.ready) {
      this.el.innerHTML = gameTemplate();
      if (!this.game) {
        this.game = new Game(
          this.strategy,
          KeyboardController,
          <HTMLCanvasElement>throwIfNull(document.querySelector('canvas#game'))
        );
        this.init();
        Navigator.sections.game.ready = true;
      }
    }

    gameService.bind();
    router.setPath('/game');
    super.show();
  }

  hide(): void {
    gameService.unbind();
    super.hide();
  }
}

export default GameBlock;
