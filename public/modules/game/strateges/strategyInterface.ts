import GameState from '../../../models/game/state';

interface ConstructableStrategy {
  new(): StrategyInterface;
}

interface StrategyInterface {
  readonly height: number;
  readonly width: number;
  running: boolean;

  getState(): GameState;

  destroy(): void;

  join(...data: any[]): boolean;

  // Subscribes
  onNewCommand(...data: any[]): void; // command: EVENT
  onStopCommand(...data: any[]): void; // command: EVENT
}

export {ConstructableStrategy};
export default StrategyInterface;