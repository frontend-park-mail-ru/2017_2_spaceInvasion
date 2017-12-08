import Bullet from './sprites/bullet';
import Tower from './sprites/tower';
import Unit from './sprites/unit';
import Coin from './sprites/coin';
import Player from './player';
import Base from './sprites/base';
import Bomb from './sprites/bomb';

class GameState {
  public players: Player[];
  public bases: Base[];
  public units: Unit[];
  public towers: Tower[];
  public coins: Coin[];
  public bullets: Bullet[];
  public bombs: Bomb[];

  constructor() {
    this.players = [];
    this.bases = [];
    this.units = [];
    this.towers = [];
    this.coins = [];
    this.bullets = [];
    this.bombs = [];
  }

  static copy(state: GameState): GameState {
    const newState = new GameState();
    newState.players = state.players.map(p => Player.copy(p));
    newState.bases = state.bases.map(b => Base.copy(b));
    newState.units = state.units.map(u => Unit.copy(u));
    newState.towers = state.towers.map(t => Tower.copy(t));
    newState.coins = state.coins.map(c => Coin.copy(c));
    newState.bullets = state.bullets.map(b => Bullet.copy(b));
    newState.bombs = state.bombs.map(b => Bomb.copy(b));
    return newState;
  }

  destroy(): void {
    this.players = [];
    this.bases.forEach(b => b.destroy());
    this.units.forEach(u => u.destroy());
    this.towers.forEach(t => t.destroy());
    this.coins.forEach(c => c.destroy());
    this.bullets.forEach(b => b.destroy());
    this.bombs.forEach(b => b.destroy());
  }
}

export default GameState;