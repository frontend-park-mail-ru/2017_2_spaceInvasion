import {BULLET, EVENT} from './constants';
import Coords from '../models/game/coords';
import Shootable from '../models/game/interfaces/shootable';
import Rect from '../models/game/interfaces/rect';
import Oriented from '../models/game/interfaces/oriented';

function throwIfNull<T>(a: T | null): T {
  if (a === null) {
    throw Error('Variable must not be null');
  }
  return a;
}

const eventMapper = new Map<EVENT, Coords>(
  [
    [EVENT.RIGHT, new Coords(1, 0)],
    [EVENT.LEFT, new Coords(-1, 0)],
    [EVENT.UP, new Coords(0, -1)],
    [EVENT.DOWN, new Coords(0, 1)]
  ]
);

function mapEventDirection(event: EVENT): Coords {
  let direction: undefined|Coords = eventMapper.get(event);
  if (direction === undefined) {
    throw Error('Wrong direction event: ' + event);
  }

  return direction;
}

function sumDirs(dir1: Coords, dir2: Coords): Coords {
  const x = dir1.x + dir2.x;
  const y = dir1.y + dir2.y;
  return normalizeDir(x, y);
}

function subDirs(dir1: Coords, dir2: Coords): Coords {
  const x = dir1.x - dir2.x;
  const y = dir1.y - dir2.y;
  return normalizeDir(x, y);
}

function normalizeDir(x: number, y: number): Coords {
  return new Coords(x/Math.abs(x || 1), y/Math.abs(y || 1));
}

function getBulletCoords(shootable: Shootable&Rect&Oriented): Coords {
  const coords = shootable.getCoords();
  const dir = shootable.getDirection();
  const width = shootable.getWidth();
  const height = shootable.getHeight();

  return new Coords(coords.x + dir.x * (width/2 + BULLET.OFFSET), coords.y + dir.y * (height/2 + BULLET.OFFSET));
}

function isNumber(n: any): boolean {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function getCodeByDir(dir: Coords): number {
  switch (dir.x) {
    case 0:
      switch (dir.y) {
        case 0:
          throw Error('Wrong direction: ' + JSON.stringify(dir));
        case -1:
          return 0;
        case 1:
          return 4;
        default:
          throw Error('Wrong direction: ' + JSON.stringify(dir));
      }
    case -1:
      switch (dir.y) {
        case 0:
          return 6;
        case -1:
          return 7;
        case 1:
          return 5;
        default:
          throw Error('Wrong direction: ' + JSON.stringify(dir));
      }
    case 1:
      switch (dir.y) {
        case 0:
          return 2;
        case -1:
          return 1;
        case 1:
          return 3;
        default:
          throw Error('Wrong direction: ' + JSON.stringify(dir));
      }
    default:
      throw Error('Wrong direction: ' + JSON.stringify(dir));
  }
}

export {throwIfNull, mapEventDirection, getCodeByDir, sumDirs, subDirs, getBulletCoords, isNumber};