import Sprite from '../sprites/sprite';
import Movable from '../interfaces/movable';
import Rect from '../interfaces/rect';
import SubscriptableMixin from './subscriptableMixin';
import emitter from '../../../modules/emitter';
import Coords from '../coords';
import Oriented from '../interfaces/oriented';

class MovableMixin extends Sprite implements SubscriptableMixin, Movable, Oriented, Rect {
  protected direction: Coords;
  protected speed: number;

  move(dir?: Coords): void {
    if (dir === undefined) {
      dir = this.direction;
    }

    this.coords.x += this.speed * dir.x;
    this.coords.y += this.speed * dir.y;
    this.stopIfOut();
  }

  protected stopIfOut(): void {
    const height = emitter.emit('Strategy.height');
    const width = emitter.emit('Strategy.width');

    if (this.coords.y + this.height / 2 > height) {
      this.coords.y = height - this.height / 2;
      this.stop();
    }
    if (this.coords.y - this.height / 2 < 0) {
      this.coords.y = this.height / 2;
      this.stop();
    }
    if (this.coords.x + this.width / 2 > width) {
      this.coords.x = width - this.width / 2;
      this.stop();
    }
    if (this.coords.x - this.width / 2 < 0) {
      this.coords.x = this.width / 2;
      this.stop();
    }
  }

  protected dontMove(): void {
    this.stop();
  }

  stop(): void {
    this.speed = 0;
  }

  getDirection(): Coords {
    return this.direction
  }

  destroy() {
    super.destroy();
    this.stop();
  }
}

export default MovableMixin;