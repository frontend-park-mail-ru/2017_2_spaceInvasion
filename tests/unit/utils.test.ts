import {throwIfNull, mapEventDirection} from '../../public/utils/utils';
import {EVENT} from '../../public/utils/constants';

describe('utils', () => {
  it('throwIfNull', () => {
    expect(() => {throwIfNull(null)}).toThrow('Variable must not be null');
    let a: boolean | null = null;
    expect(() => {throwIfNull(a)}).toThrow('Variable must not be null');
    a = true;
    expect(() => {
      let b: boolean;
      b = throwIfNull(a);
      return b;
    }).toBeTruthy();
  });

  it('mapEventDirection', () => {
    expect(mapEventDirection(EVENT.DOWN)).toBe(180);
    expect(mapEventDirection(EVENT.UP)).toBe(0);
    expect(mapEventDirection(EVENT.LEFT)).toBe(270);
    expect(mapEventDirection(EVENT.RIGHT)).toBe(90);
    expect(mapEventDirection(EVENT.FIRE)).toBe(null);
    expect(mapEventDirection(EVENT.TOWER)).toBe(null);
    expect(mapEventDirection(EVENT.NO)).toBe(null);
  });
});