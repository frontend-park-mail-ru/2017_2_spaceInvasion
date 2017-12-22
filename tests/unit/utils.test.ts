import {mapEventDirection, throwIfNull} from '../../public/utils/utils';
import {EVENT} from '../../public/utils/constants';

describe('utils', () => {
  it('throwIfNull', () => {
    expect(() => {
      throwIfNull(null)
    }).toThrow('Variable must not be null');
    let a: boolean | null = null;
    expect(() => {
      throwIfNull(a)
    }).toThrow('Variable must not be null');
    a = true;
    expect(() => {
      let b: boolean;
      b = throwIfNull(a);
      return b;
    }).toBeTruthy();
  });

  it('mapEventDirection', () => {
    expect(mapEventDirection(EVENT.DOWN)).toEqual({x: 0, y: 1});
    expect(mapEventDirection(EVENT.UP)).toEqual({x: 0, y: -1});
    expect(mapEventDirection(EVENT.LEFT)).toEqual({x: -1, y: 0});
    expect(mapEventDirection(EVENT.RIGHT)).toEqual({x: 1, y: 0});
    expect(() => mapEventDirection(EVENT.FIRE)).toThrow('Wrong direction event: ' + EVENT.FIRE);
    expect(() => mapEventDirection(EVENT.TOWER)).toThrow('Wrong direction event: ' + EVENT.TOWER);
    expect(() => mapEventDirection(EVENT.NO)).toThrow('Wrong direction event: ' + EVENT.NO);
  });
});
