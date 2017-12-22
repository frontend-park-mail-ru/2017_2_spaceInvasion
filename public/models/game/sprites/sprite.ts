import Coords from '../coords';
import {throwIfNull} from '../../../utils/utils';
import Rect from '../interfaces/rect';
import emitter from '../../../modules/emitter';
import SubscriptableMixin from '../mixins/subscriptableMixin';

abstract class Sprite extends SubscriptableMixin implements Rect {
  public visible: boolean;
  public readonly id: number;

  protected readonly canvas: HTMLCanvasElement;
  protected coords: Coords;
  protected width: number;
  protected height: number;

  private image: HTMLImageElement;

  constructor(id: number, coords: Coords, srcOfImage: string, width: number, height: number) {
    super();
    this.id = id;
    this.canvas = throwIfNull(document.getElementById('game')) as HTMLCanvasElement;
    this.visible = true;
    this.coords = coords;
    this.image = new Image();
    this.image.src = srcOfImage;
    this.width = width;
    this.height = height;
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (this.visible) {
      const aspectRatio = emitter.emit('Scene.aspectRatio');
      const render = () => ctx.drawImage(
        this.image,
        (this.coords.x - this.width / 2) * aspectRatio,
        (this.coords.y - this.height / 2) * aspectRatio,
        (this.width) * aspectRatio,
        (this.height) * aspectRatio
      );

      if (!this.image.complete) {
        this.image.onload = render;
      } else {
        render();
      }
    }
  }

  getCoords(): Coords {
    return this.coords;
  }

  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }

  getImage(): HTMLImageElement {
    return this.image;
  }

  setImage(path: string): void {
    this.image.src = path;
  }

}

export default Sprite;
