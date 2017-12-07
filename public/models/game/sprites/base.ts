import Sprite from './sprite';
import {BASE, SIDE} from '../../../utils/constants';
import Coords from '../coords';
import Destructible from '../interfaces/destructible';
import Unit from './unit';
import Collidable from '../interfaces/collidable';
import Rect from '../interfaces/rect';
import emitter from '../../../modules/emitter';

export default class Base extends Sprite implements Destructible, Collidable, Rect {
  public readonly side: SIDE;
  protected health = BASE.HEALTH;
  public underAttack = false;

  constructor(id: number, side: SIDE) {
    super(
      id,
      new Coords,
      BASE.IMAGE_PATH,
      BASE.WIDTH,
      BASE.HEIGHT,
    );

    this.coords = this.getCoordsBySide(side);
    this.side = side;
  }

  destroy(): void {
    this.health = 0;
    this.underAttack = false;
    this.visible = false;
    super.destroy();
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

  bumpInto(obj: Collidable): void {
    if (obj instanceof Unit && obj.side !== this.side) {
      this.underAttack = true;
    }
  }

  static copy(base: Base): Base {
    const newBase = new Base(base.id, base.side);
    newBase.visible = base.visible;
    newBase.handlers = new Map(base.handlers);
    newBase.coords = Coords.copy(base.coords);
    newBase.health = base.health;
    newBase.underAttack = base.underAttack;
    return newBase;
  }

  private getCoordsBySide(side: SIDE): Coords {
    const coords = new Coords;
    coords.y = emitter.emit('Strategy.height') / 2;
    switch (side) {
      case SIDE.MAN:
        coords.x = this.width / 2 + BASE.OFFSET;
        break;
      case SIDE.ALIEN:
        coords.x = emitter.emit('Strategy.width') - this.width / 2 - BASE.OFFSET;
        break;
      default:
        throw Error('Wrong side');
    }
    return coords;
  }
}
