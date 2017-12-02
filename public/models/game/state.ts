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