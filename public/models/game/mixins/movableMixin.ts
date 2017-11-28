import Sprite from '../sprites/sprite';
import Movable from '../interfaces/movable';
import Rect from '../interfaces/rect';
import SubscriptableMixin from './subscriptableMixin';

class MovableMixin extends Sprite implements SubscriptableMixin, Movable, Rect {
  protected direction: number|null;
  protected speed: number;

  move(dir?: number|null): void {
    if (dir === undefined) {
      dir = this.direction;
    }
    if (dir !== null) {
      this.coords.x += this.speed * Math.cos(dir);
      this.coords.y += this.speed * Math.sin(dir);
      this.stopIfOut();
    }
  }

  protected stopIfOut(): void {
    if (this.coords.y + this.height / 2 > this.canvas.height) {
      this.coords.y = this.canvas.height - this.height / 2;
      this.destroy();
    }
    if (this.coords.y - this.height / 2 < 0) {
      this.coords.y = this.height / 2;
      this.destroy();
    }
    if (this.coords.x + this.width / 2 > this.canvas.width) {
      this.coords.x = this.canvas.width - this.width / 2;
      this.destroy();
    }
    if (this.coords.x - this.width / 2 < 0) {
      this.coords.x = this.width / 2;
      this.destroy();
    }
  }

  protected dontMove(): void {
    this.destroy();
  }

  destroy() {
    this.speed = 0;
    this.direction = null;
  }
}

export default MovableMixin;