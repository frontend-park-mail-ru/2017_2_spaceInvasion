class Coords {
  public x: number;
  public y: number;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  static copy(coords: Coords): Coords {
    return new Coords(coords.x, coords.y);
  }
}

export default Coords;