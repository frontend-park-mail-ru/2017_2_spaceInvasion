interface Destructible {
  destroy(): void;

  damage(points: number): void;

  alive(): boolean;
}

export default Destructible;