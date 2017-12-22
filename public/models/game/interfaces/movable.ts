import Coords from '../coords';
import Oriented from './oriented';

interface Movable extends Oriented {
  move(direction?: Coords): void;
}

export default Movable;