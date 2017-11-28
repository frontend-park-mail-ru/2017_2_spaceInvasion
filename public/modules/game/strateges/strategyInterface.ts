import GameState from '../../../models/game/state';

interface ConstructableStrategy {
  new(funcFinishGame: (victory: boolean) => any): StrategyInterface;
}

interface StrategyInterface {
  readonly height: number;
  readonly width: number;
  running: boolean;

  getState(): GameState;

  destroy(): void;

  join(...data: any[]): boolean;

  // Subscribes
  onNewCommand(...data: any[]): void; // Strategy.onNewCommand(command : EVENT)
  onStopCommand(...data: any[]): void; // Strategy.onStopCommand(command : EVENT)
}

export {ConstructableStrategy};
export default StrategyInterface;