interface Destructible {
  destroy(): void;

  damage(points: number): void;

  getHealth(): number;

  alive(): boolean;
}

export default Destructible;