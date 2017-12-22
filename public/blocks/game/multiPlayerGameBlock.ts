import GameBlock from './index';
import webSocketService from '../../services/webSockets';
import MultiPlayerStrategy from '../../modules/game/strateges/multiPlayerStrategy';

const swal = require('sweetalert2');

class MultiPlayerGameBlock extends GameBlock {
  protected strategy = MultiPlayerStrategy;

  init(): void {
    webSocketService.init();
    swal({
      position: 'top-right',
      type: 'info',
      titleText: 'Пожалуйста, подождите...',
      text: 'Подождите, пока другой игрок зайдёт в игру против Вас...',
      showConfirmButton: false,
    });
  }
}

export default MultiPlayerGameBlock;
