import Sprite from '../sprites/sprite';
import Movable from '../interfaces/movable';
import Rect from '../interfaces/rect';
import SubscriptableMixin from './subscriptableMixin';
import emitter from '../../../modules/emitter';
import Coords from '../coords';
import Oriented from '../interfaces/oriented';
import {FPS, SMOOTH_COEF} from '../../../utils/constants';

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

  correctCoords(coords: Coords): void {
    if (coords.x === this.coords.x && coords.y === this.coords.y) {
      return;
    }

    const start = performance.now();
    const startCoords = Coords.copy(this.getCoords());
    const duration = 1000 / FPS * SMOOTH_COEF;

    const animate = (time: number) => {
      let timePassed = time - start;
      if (timePassed > duration) {
        timePassed = duration;
      }

      this.coords.x = startCoords.x + timePassed / duration * (coords.x - startCoords.x);
      this.coords.y = startCoords.y + timePassed / duration * (coords.y - startCoords.y);

      if (timePassed < duration) {
        requestAnimationFrame(animate.bind(this));
      }
    };

    requestAnimationFrame(animate.bind(this));
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

  protected stopIfOut(): void {
    const height = emitter.emit('Strategy.height');
    const width = emitter.emit('Strategy.width');

    let stop = false;
    if (this.coords.y + this.height / 2 > height) {
      this.coords.y = height - this.height / 2;
      stop = true;
    }
    if (this.coords.y - this.height / 2 < 0) {
      this.coords.y = this.height / 2;
      stop = true;
    }
    if (this.coords.x + this.width / 2 > width) {
      this.coords.x = width - this.width / 2;
      stop = true;
    }
    if (this.coords.x - this.width / 2 < 0) {
      this.coords.x = this.width / 2;
      stop = true;
    }

    if (stop) {
      this.stop();
    }
  }

  protected dontMove(): void {
    this.stop();
  }
}

export default MovableMixin;