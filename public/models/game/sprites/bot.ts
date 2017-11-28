import Unit from './unit';
import Destructible from '../interfaces/destructible';
import Collidable from '../interfaces/collidable';
import Shootable from '../interfaces/shootable';
import Rect from '../interfaces/rect';
import MovableMixin from '../mixins/movableMixin';
import SubscriptableMixin from '../mixins/subscriptableMixin';
import Temporary from '../interfaces/temporary';
import {BOT, SIDE} from '../../../utils/constants';
import emitter from '../../../modules/emitter';

// TODO: Написать умный ИИ
class Bot extends Unit implements SubscriptableMixin, MovableMixin, Destructible, Collidable, Shootable, Rect, Temporary {
  protected shoutTimer: number;
  protected randomTowerTimer: number;
  protected towerTimer: number;

  constructor(id: number, side: SIDE) {
    super(id, side);

    this.shoutTimer = window.setInterval(this.shout.bind(this), BOT.FIRE_SPEED);
    this.randomTowerTimer = window.setInterval(Bot.setRandomTower, BOT.RANDOM_TOWER_SPEED);
    this.towerTimer = window.setInterval(this.setTower.bind(this), BOT.TOWER_SPEED);
  }

  protected static setRandomTower(): void {
    emitter.emit('Tower.random');
  }

  move(): void {
    if (Math.abs(this.coords.y - emitter.emit('Strategy.height') / 2) > BOT.AMPLITUDE){
      this.direction = this.direction === 0 ? 180 : 0;
    }
    super.move();
  }

  cancel(): void {
    clearTimeout(this.shoutTimer);
    clearTimeout(this.randomTowerTimer);
    clearTimeout(this.towerTimer);
  }

  protected setTower(): void {
    emitter.emit('Player.setTower.' + this.id);
  }
}

export default Bot;