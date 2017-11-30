import MovableMixin from '../mixins/movableMixin';
import {SIDE, UNIT} from '../../../utils/constants';
import Coords from '../coords';
import Destructible from '../interfaces/destructible';
import Bullet from './bullet';
import Collidable from '../interfaces/collidable';
import Shootable from '../interfaces/shootable';
import Coin from './coin';
import Rect from '../interfaces/rect';
import emitter from '../../../modules/emitter';
import SubscriptableMixin from '../mixins/subscriptableMixin';

class Unit extends MovableMixin implements SubscriptableMixin, Destructible, Collidable, Shootable, Rect {
  public readonly side: SIDE;
  protected health = UNIT.HEALTH;
  protected _damage = UNIT.DAMAGE;

  constructor(id: number, side: SIDE) {
    super(
      id,
      new Coords,
      (side === SIDE.MAN ? UNIT.MAN_IMAGE_PATH : UNIT.ALIEN_IMAGE_PATH),
      UNIT.WIDTH,
      UNIT.HEIGHT,
    );

    this.side = side;
    this.spawn();
  }

  static getDirectionBySide(side: SIDE): number {
    return side === SIDE.MAN ? 90 : 270;
  }

  onHisHalf(): boolean {
    switch (this.side) {
      case SIDE.ALIEN:
        return this.coords.x >= emitter.emit('Strategy.width') / 2;
      case SIDE.MAN:
        return this.coords.x < emitter.emit('Strategy.width') / 2;
      default:
        throw Error('Wrong side');
    }
  }

  spawn(): void {
    this.health = UNIT.HEALTH;
    this.speed = UNIT.SPEED;
    this._damage = UNIT.DAMAGE;
    this.direction = Unit.getDirectionBySide(this.side);
    this.visible = true;
    this.coords = this.getCoordsBySide(this.side);

    // Subscribes
    this.subscribe('Unit.damage.' + this.id, this.damage); // points: number
  }

  destroy(): void {
    this.health = 0;
    this.speed = 0;
    this._damage = 0;
    this.direction = null;
    this.visible = false;
    super.destroy();
  }

  bumpInto(obj: Collidable): void {
    if (obj instanceof Bullet) {
      this.damage(obj.getDamage());
      if (!this.alive()) {
        this.destroy();
      }
    } else if (obj instanceof Coin) {
      emitter.emit('Player.reward.' + this.id, obj.getCost());
    }
    // TODO пересечение с другими юнитами
  }

  shout(): void {
    emitter.emit('Bullet', this.direction, this.coords, this);
  }

  damage(points: number): void {
    this.health -= points;
  }

  alive(): boolean {
    return this.health > 0;
  }

  getHealth(): number {
    return this.health;
  }

  getDirection(): number|null {
    return this.direction;
  }

  setDirection(direction: number|null): void {
    this.direction = direction;
  }

  getDamage(): number {
    return this._damage;
  }

  private getCoordsBySide(side: SIDE): Coords {
    const coords = new Coords;
    coords.y = emitter.emit('Strategy.height') / 2 + this.height / 2;
    switch (side) {
      case SIDE.MAN:
        coords.x = emitter.emit('Strategy.width') - UNIT.SPAWN_OFFSET - this.width / 2;
        break;
      case SIDE.ALIEN:
        coords.x = UNIT.SPAWN_OFFSET + this.width / 2;
        break;
      default:
        throw Error('Wrong side');
    }
    return coords;
  }
}

export default Unit;