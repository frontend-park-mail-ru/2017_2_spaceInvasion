import Unit from './sprites/unit';
import User from '../user';
import SubscriptableMixin from './mixins/subscriptableMixin';
import {COIN, TOWER} from '../../utils/constants';
import emitter from '../../modules/emitter';

class Player extends SubscriptableMixin {
  public user: User;
  public unit: Unit;
  public coins = COIN.DEFAULT;

  constructor(user: User, unit: Unit) {
    super();

    this.user = user;
    this.unit = unit;

    // Subscribes
    this.subscribe('Player.reward.' + this.unit.id, this.reward.bind(this)); // coins: number
    this.subscribe('Player.pay.' + this.unit.id, this.pay.bind(this)); // coins: number
    this.subscribe('Player.setTower.' + this.unit.id, this.setTower.bind(this)); // --No arguments
    this.subscribe('Player.shout.' + this.unit.id, this.unit.shout.bind(this.unit)); // --No arguments
    this.subscribe('Player.setDirection.' + this.unit.id, this.unit.setDirection.bind(this.unit)); // direction: number|null
  }

  reward(coins: number): void {
    this.coins += coins;
  }

  pay(coins: number): void {
    if (this.coins < coins) {
      throw Error('Not enough money');
    }
    this.coins -= coins;
  }

  protected setTower(...data: any[]): void {
    if (this.unit.onHisHalf()) {
      let direction = this.unit.getDirection();
      if (direction === null) {
        direction = Unit.getDirectionBySide(this.unit.side);
      }
      this.pay(TOWER.COST);
      emitter.emit('Tower', this.unit.getCoords(), direction, this.unit.side);
    }
  }
}

export default Player;
