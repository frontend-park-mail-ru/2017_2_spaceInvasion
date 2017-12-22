import Rect from '../models/game/interfaces/rect';
import Collidable from '../models/game/interfaces/collidable';

class CollisionService {
  private static instance = new CollisionService();
  protected set = new Set<Collidable | Rect>();
  protected collisions = new Set<(Collidable | Rect)[]>();

  constructor() {
    if (CollisionService.instance) {
      return CollisionService.instance;
    }
    CollisionService.instance = this;
  }

  append(...arr: (Collidable | Rect)[]): void {
    arr.forEach(el => this.set.add(el));
  }

  collisionsArr(): Array<(Collidable | Rect)[]> {
    this.update();
    return Array.from(this.collisions.values());
  }

  collisionsSet(): Set<(Collidable | Rect)[]> {
    this.update();
    return this.collisions;
  }

  run(): void {
    this.update();
    (this.collisions as Set<Collidable[]>).forEach(collision => {
      collision[0].bumpInto(collision[1]);
      collision[1].bumpInto(collision[0]);
    });
  }

  clear() {
    this.set.clear();
    this.collisions.clear();
  }

  protected update() {
    let tempSet = new Set(this.set);
    this.set.forEach(el1 => {
      tempSet.delete(el1);
      tempSet.forEach(el2 => {
        const rect1 = el1 as Rect;
        const rect2 = el2 as Rect;
        if (
          (rect1.getCoords().x + rect1.getWidth() / 2 >= rect2.getCoords().x - rect2.getWidth() / 2) &&
          (rect1.getCoords().x - rect1.getWidth() / 2 <= rect2.getCoords().x + rect2.getWidth() / 2) &&
          (rect1.getCoords().y + rect1.getHeight() / 2 >= rect2.getCoords().y - rect2.getHeight() / 2) &&
          (rect1.getCoords().y - rect1.getHeight() / 2 <= rect2.getCoords().y + rect2.getHeight() / 2)
        ) {
          this.collisions.add([el1, el2]);
        }
      });
    });
  }
}

const collisionService = new CollisionService();
export {CollisionService};
export default collisionService;
