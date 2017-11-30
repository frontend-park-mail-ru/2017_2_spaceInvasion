import SinglePlayerStrategy from '../../modules/game/strateges/singlePlayerStrategy';
import GameBlock from './index';
import userService from '../../services/userService';
import {getTheme} from '../../modules/themes';
import {SIDE} from '../../utils/constants';
import {throwIfNull} from '../../utils/utils';

class SinglePlayerGameBlock extends GameBlock {
  protected strategy = SinglePlayerStrategy;

  init(): void {
    const user = throwIfNull(userService.user);
    this.game.join(user, getTheme() === 'man' ? SIDE.MAN : SIDE.ALIEN);
  }
}

export default SinglePlayerGameBlock;
