import {EVENT} from './constants';

function throwIfNull<T>(a: T | null): T {
  if (a === null) {
    throw Error('Variable must not be null');
  }
  return a;
}

const eventMapper = new Map<EVENT, number>(
  [
    [EVENT.RIGHT, 90],
    [EVENT.LEFT, 270],
    [EVENT.UP, 0],
    [EVENT.DOWN, 180]
  ]
);

function mapEventDirection(event: EVENT): number|null {
  let direction: undefined|number|null = eventMapper.get(event);
  if (direction === undefined) {
    direction = null;
  }

  return direction;
}

export {throwIfNull, mapEventDirection};