import SinglePlayerStrategy from '../../modules/game/strateges/singlePlayerStrategy';
import GameBlock from './index';
import userService from '../../services/userService';
import {getTheme} from '../../modules/themes';
import {SIDE} from '../../utils/constants';
import User from '../../models/user';

class SinglePlayerGameBlock extends GameBlock {
  protected strategy = SinglePlayerStrategy;

  init(): void {
    const user = userService.user || new User(0, 'Guest', '', '');
    this.game.join(user, getTheme() === 'man' ? SIDE.MAN : SIDE.ALIEN);
  }
}

export default SinglePlayerGameBlock;
