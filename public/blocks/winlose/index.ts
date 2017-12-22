import Block from '../block/index';
import Navigator from '../../modules/navigator';
import winloseTemplate from './winlose.pug';
import {throwIfNull} from '../../utils/utils';

class WinLoseBlock extends Block {
  show(victory?: boolean): void {
    if (!Navigator.sections.winlose.ready) {
      this.el.innerHTML = winloseTemplate({victory});

      throwIfNull(document.querySelector('.ui.button.playagain'))
        .addEventListener('click', () => {
          Navigator.sections.hide();
          Navigator.sections.game.show();
        });

      throwIfNull(document.querySelector('.ui.button.leave'))
        .addEventListener('click', () => {
          Navigator.sections.hide();
          Navigator.sections.playerPage.show();
        });

      Navigator.sections.winlose.ready = true;
    }

    super.show();
  }
}

export default WinLoseBlock;