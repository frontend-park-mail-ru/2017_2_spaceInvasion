import Block from '../block/index';
import Navigator from '../../modules/navigator';
import homePageTemplate from './homepage.pug';
import router from '../../modules/router';
import {throwIfNull} from '../../utils/utils';
import SinglePlayerGameBlock from '../game/singlePlayerGameBlock';

class HomePageBlock extends Block {
  show(): void {
    if (!Navigator.sections.home.ready) {
      this.el.innerHTML = homePageTemplate();

      throwIfNull(document.querySelector('#playNow'))
        .addEventListener('click', () => {
          Navigator.sections.hide();
          if (!Navigator.sections.game.initialized) {
            Navigator.sections.game.append(new SinglePlayerGameBlock());
            Navigator.sections.game.initialized = true;
          }
          Navigator.sections.game.show();
        });

      Navigator.sections.home.ready = true;
    }

    router.setPath('/');
    super.show();
  }
}

export default HomePageBlock;
