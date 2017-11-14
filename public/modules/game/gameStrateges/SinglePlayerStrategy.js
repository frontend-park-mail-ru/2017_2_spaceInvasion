/* eslint-disable no-restricted-syntax */
import GameStrategy from './GameStrategy';
import { modelWidth } from '../MODEL_COORDINATES';
import Bullet from '../sprites/bullet';

import Player from '../Player';
import Tower from '../sprites/tower';
import Bomb from '../sprites/bomb';
import Coin from '../sprites/coin';

import findCollisions from '../findCollisions';

const SET_TOWERS_COOL_DOWN = 300;
const SPEED_OF_BULLETS = 6;
const TOWER_COOLDOWN = 50;
const INTERVAL = 20;

// TODO башни с разной стоимостью
const TOWER_COST = 5;

const KEYS = {
  FIRE: [' ', 'Enter'],
  LEFT: ['a', 'A', 'ф', 'Ф', 'ArrowLeft'],
  RIGHT: ['d', 'D', 'в', 'В', 'ArrowRight'],
  DOWN: ['s', 'S', 'ы', 'Ы', 'ArrowDown'],
  UP: ['w', 'W', 'ц', 'Ц', 'ArrowUp'],
  TOWER: ['shift'],
};

class SinglePlayerStrategy extends GameStrategy {
  constructor(funcSetState, funcFinishGame) {
    super();
    this.funcSetState = funcSetState;
    this.funcFinishGame = funcFinishGame;
  }

  onLoggedIn() {
    this.state = {
      randomTowersCoolDown: SET_TOWERS_COOL_DOWN,
      bullets: [],
      coins: [],
      me: new Player('My name', { baseXpos: 840 }, { manXpos: 750 }),
      opponent: new Player('Opponent', { baseXpos: 10 }, { manXpos: 190 }),
    };
    this.state.opponent.towers.push(new Tower(1, 130, 120));
    this.state.opponent.towers.push(new Tower(1, 130, 400));
    this.state.opponent.unit.coolDown = 63;
    this.funcSetState(this.state);
    this.startGameLoop();
  }

  onNewCommand(payload) {
    if (SinglePlayerStrategy.pressed('FIRE', payload)) {
      this.state.bullets.push(this.state.me.shootMan());
      return;
    }
    if (SinglePlayerStrategy.pressed('LEFT', payload)) {
      this.state.me.moveMan('LEFT');
    }
    if (SinglePlayerStrategy.pressed('RIGHT', payload)) {
      this.state.me.moveMan('RIGHT');
    }
    if (SinglePlayerStrategy.pressed('UP', payload)) {
      this.state.me.moveMan('UP');
    }

    if (SinglePlayerStrategy.pressed('DOWN', payload)) {
      this.state.me.moveMan('DOWN');
    }
    // Построить башню
    if (SinglePlayerStrategy.pressed('TOWER', payload)) {
      if (this.state.me.unit.xPosition >= modelWidth / 2 && this.state.me.coins >= TOWER_COST) {
        this.state.me.towers.push(new Tower(
          3,
          this.state.me.unit.xPosition,
          this.state.me.unit.yPosition,
          'LEFT',
        ));
        this.state.me.coins -= TOWER_COST;
      }
    }
  }

  gameLoop() {
    // TODO разгрести мусорку тут

    // Состояние пуль
    this.state.bullets = this.state.bullets.map((blt) => {
      switch (blt.direction) {
        case 'RIGHT': {
          blt.xPosition += SPEED_OF_BULLETS;
          break;
        }
        case 'LEFT': {
          blt.xPosition -= SPEED_OF_BULLETS;
          break;
        }
        default:
          break;
      }
      return blt;
    });


    // Пересечения пуль с моим юнитом;
    if (this.state && this.state.bullets) {
      for (const collision of findCollisions(this.state.bullets, [this.state.me.unit])) {
        collision[0].damaged(collision[1]);
        collision[1].damaged(collision[0]);
      }
    }
    this.state.bullets = this.state.bullets.filter(blt => blt.deleted === 0);

    // Установка бомбы
    if (this.state && this.state.me && this.state.opponent) {
      // eslint-disable-next-line no-unused-vars
      for (const collision of findCollisions([this.state.me.unit], [this.state.opponent.base])) {
        if (!this.state.opponent.bomb) {
          this.state.opponent.bomb = new Bomb(
            this.state.opponent.base.xPosition + (this.state.opponent.base.width / 3),
            this.state.opponent.base.yPosition + (this.state.opponent.base.height / 3),
          );
        }
      }
    }

    // пересечения пуль с башнями оппонента
    if (this.state && this.state.bullets) {
      for (const collision of findCollisions(this.state.bullets, this.state.opponent.towers)) {
        collision[0].damaged(collision[1]);
        collision[1].damaged(collision[0]);
      }
    }

    this.state.bullets = this.state.bullets.filter(blt => blt.deleted === 0);

    // За каждую убитую башню добавить монетки
    this.state.opponent.towers.forEach((tower) => {
      if (tower.health === 0) {
        this.state.coins.push(new Coin(
          tower.xPosition + (tower.width / 2),
          tower.yPosition + (tower.height / 2),
        ));
      }
    });

    this.state.opponent.towers = this.state.opponent.towers.filter(tower => tower.health !== 0);

    // обработка монеток
    if (this.state && this.state.coins) {
      for (const collision of findCollisions(this.state.coins, [this.state.me.unit])) {
        collision[0].collected = 1;
        this.state.me.coins += collision[0].cost;
      }
    }

    this.state.coins = this.state.coins.filter(coin => coin.collected === 0);

    // Установка рандобных башенок у соперника
    this.state.randomTowersCoolDown -= 1;
    if (this.state.randomTowersCoolDown === 0) {
      this.setRandomTower();
      this.state.randomTowersCoolDown = SET_TOWERS_COOL_DOWN;
    }

    // пересечения пуль с моими башеями
    if (this.state && this.state.bullets) {
      for (const collision of findCollisions(this.state.bullets, this.state.me.towers)) {
        collision[0].damaged(collision[1]);
        collision[1].damaged(collision[0]);
      }
    }

    this.state.bullets = this.state.bullets.filter(blt => blt.deleted === 0);

    this.state.me.towers = this.state.me.towers.filter(tower => tower.health !== 0);

    // TODO пересечение пули с пулями
    // TODO пересечение юнита с оппонентом

    if (this.state.me.unit.health === 0) {
      this.state.me.unit.health = 100;
      this.state.me.unit.xPosition = this.state.me.base.xPosition;
      this.state.me.unit.yPosition = this.state.me.base.yPosition;
      this.state.me.base.health -= 1;
    }

    // файерболы оппонента
    this.state.opponent.towers.forEach((tower) => {
      if (tower.coolDown > 0) {
        tower.coolDown -= 1;
      } else {
        if (tower.direction === 'RIGHT') {
          this.state.bullets.push(new Bullet(
            tower.direction,
            tower.xPosition + tower.width + 1,
            tower.yPosition + (tower.height / 4) + 1,
          ));
        } else {
          this.state.bullets.push(new Bullet(
            tower.direction,
            tower.xPosition - 26, // TODO 26 - ширина пули + 1
            tower.yPosition + (tower.height / 4) + 1,
          ));
        }
        tower.coolDown = TOWER_COOLDOWN;
      }
    });

    // файерболы мои
    this.state.me.towers.forEach((tower) => {
      if (tower.coolDown > 0) {
        tower.coolDown -= 1;
      } else {
        if (tower.direction === 'RIGHT') {
          this.state.bullets.push(new Bullet(
            tower.direction,
            tower.xPosition + tower.width + 1,
            tower.yPosition + (tower.height / 4) + 1,
          ));
        } else {
          this.state.bullets.push(new Bullet(
            tower.direction,
            tower.xPosition - 26, // TODO 26 - ширина пули + 1
            tower.yPosition + (tower.height / 4) + 1,
          ));
        }
        tower.coolDown = TOWER_COOLDOWN;
      }
    });

    // мной поставленные бомбы
    if (this.state.opponent && this.state.opponent.bomb) {
      this.state.opponent.bomb.coolDown -= 1;
      if (this.state.opponent.bomb.coolDown === 0) {
        this.state.opponent.bomb = null;
        this.state.opponent.base.health -= 1;
      }
    }

    // Обработка пуль, вышежших за пределы
    this.state.bullets.forEach((blt) => {
      if (blt.xPosition + blt.width < 0 || blt.xPosition > modelWidth) {
        blt.deleted = 1;
      }
    });

    this.state.bullets = this.state.bullets.filter(blt => blt.deleted === 0);


    // TODO оппонентом поставленные бомбы
    // TODO монеты coolDown

    // TODO сделать что то более адекватное
    if (this.state.opponent) {
      if (this.state.opponent.unit.coolDown >= 0) {
        if (this.state.opponent.unit.coolDown > 47 || this.state.opponent.unit.coolDown < 16) {
          this.state.opponent.moveMan('UP');
        } else {
          this.state.opponent.moveMan('DOWN');
        }
        if (this.state.opponent.unit.coolDown % 16 === 0) {
          this.state.bullets.push(new Bullet(
            'RIGHT',
            this.state.opponent.unit.xPosition + this.state.opponent.unit.width + 1,
            this.state.opponent.unit.yPosition + (this.state.opponent.unit.height / 2) + 1,
          ));
        }
        this.state.opponent.unit.coolDown -= 1;
      } else {
        this.state.opponent.unit.coolDown = 63;
      }
    }


    if (this.state.me.base.health === 0) {
      this.funcFinishGame(false);
      this.stopGameLoop();
      return;
    }

    if (this.state.opponent.base.health === 0) {
      this.funcFinishGame(true);
      this.stopGameLoop();
      return;
    }

    this.funcSetState(this.state);
  }

  setRandomTower() {
    this.state.opponent.towers.push(new Tower(1, 130, Math.random() * 540));
  }

  startGameLoop() {
    if (!this.running) {
      this.running = true;
      this.interval = setInterval(() => this.gameLoop(), INTERVAL); // 1000
    }
  }

  stopGameLoop() {
    if (this.running) {
      clearInterval(this.interval);
      this.running = false;
    }
  }

  static pressed(name, data) {
    return KEYS[name].some(k => data[k.toLowerCase()]);
  }

  destroy() {
    this.stopGameLoop();
  }
}

export default SinglePlayerStrategy;
