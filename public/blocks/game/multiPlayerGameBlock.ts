import GameBlock from './index';
import webSocketService from '../../services/webSockets';
import MultiPlayerStrategy from '../../modules/game/strateges/multiPlayerStrategy';

class MultiPlayerGameBlock extends GameBlock {
  protected strategy = MultiPlayerStrategy;

  init(): void {
    webSocketService.init();
    // TODO: Show waiting image
  }
}

export default MultiPlayerGameBlock;
