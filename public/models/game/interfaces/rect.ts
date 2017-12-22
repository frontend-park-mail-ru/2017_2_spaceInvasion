import Coords from '../coords';

interface Rect {
  getCoords(): Coords;

  getWidth(): number;

  getHeight(): number;
}

export default Rect;