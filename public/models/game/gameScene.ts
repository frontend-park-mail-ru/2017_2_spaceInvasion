import {AREA, DEFAULT_FONT, HALF_LINE_COLOR, HALF_LINE_WIDTH, SIDE, TOWER} from '../../utils/constants';
import GameState from './state';
import {throwIfNull} from '../../utils/utils';
import Tower from './sprites/tower';
import resize from '../../utils/imageResizer';
import emitter from '../../modules/emitter';
import SubscriptableMixin from './mixins/subscriptableMixin';

class GameScene extends SubscriptableMixin {
  protected aspectRatio = 1;
  protected font = DEFAULT_FONT;
  protected readonly canvas: HTMLCanvasElement;
  protected readonly ctx: CanvasRenderingContext2D;
  protected background = AREA.BACKGROUND_IMAGE;
  protected handlers = new Map<string, () => any>();

  constructor(canvas: HTMLCanvasElement) {
    super();

    this.canvas = canvas;
    this.canvas.width = AREA.WIDTH;
    this.canvas.height = AREA.HEIGHT;

    this.ctx = throwIfNull(this.canvas.getContext('2d'));
    this.ctx.font = this.font.toString();
    this.handlers.set('resize', this.resize.bind(this));

    // Subscribes
    this.subscribe('Scene.aspectRatio', () => this.aspectRatio); // --No arguments--

    this.render(new GameState());
    this.resize();
  }

  bind(): void {
    this.handlers.forEach((val, key) => window.addEventListener(key, val));
  }

  unbind(): void {
    this.handlers.forEach((val, key) => window.removeEventListener(key, val));
  }

  resize(): void {
    this.aspectRatio = this.canvas.width / emitter.emit('Strategy.width');
    this.font.replace(/\d+/, '' + this.aspectRatio);
  }

  render(state: GameState): void {
    // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.renderBackground();
    this.renderHalfLine();

    // this.ctx.scale(this.aspectRatio, this.aspectRatio);

    this.renderBases(state);
    this.renderTowers(state);
    this.renderCoins(state);
    this.renderUnits(state);
    this.renderBullets(state);
    this.renderBombs(state);
    this.renderText(state);

    // this.ctx.scale(1 / this.aspectRatio, 1 / this.aspectRatio);
  }

  destroy(): void {
    this.unbind();
  }

  protected clearStyle(): void {
    this.ctx.shadowColor = '';
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;
    this.ctx.shadowBlur = 0;

    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 1;
  }

  private renderBackground(): void {
    const background = new Image();
    const height = this.canvas.height;

    background.onload = () => {
      const width = Math.round(height * background.width / background.height);
      this.ctx.drawImage(
        background, //TODO: resize(background, width, height),
        0,
        0,
        width * this.aspectRatio,
        height * this.aspectRatio,
      );
    };

    background.src = this.background;
  }

  private renderHalfLine(): void {
    this.ctx.strokeStyle = HALF_LINE_COLOR;
    this.ctx.lineWidth = HALF_LINE_WIDTH;
    this.ctx.beginPath();
    this.ctx.moveTo(this.canvas.width / 2, 0);
    this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
    this.ctx.stroke();
    this.clearStyle();
  }

  private renderBases(state: GameState): void {
    state.bases.forEach(base => base.render(this.ctx));
  }

  private renderUnits(state: GameState): void {
    state.units.forEach(unit => unit.render(this.ctx));
  }

  private renderTowers(state: GameState): void {
    state.towers.forEach(tower => {
      tower.render(this.ctx);
      this.renderHealthOfTower(tower);
    });
  }

  private renderBullets(state: GameState): void {
    state.bullets.forEach(bullet => bullet.render(this.ctx));
  }

  private renderText(state: GameState): void {
    this.ctx.shadowOffsetX = 5;
    this.ctx.shadowOffsetY = 5;
    this.ctx.shadowBlur = 5;

    let alienBaseBombs = 3;
    let manBaseBombs = 3;
    state.bases.forEach(base => {
      switch (base.side) {
        case SIDE.MAN:
          manBaseBombs = base.getHealth();
          break;
        case SIDE.ALIEN:
          alienBaseBombs = base.getHealth();
          break;
        default:
          throw Error('Wrong base side: ' + base.side);
      }
    });

    state.players.forEach(player => {
      let x: number;
      if (player.unit.side === SIDE.MAN) {
        this.ctx.shadowColor = 'blue';
        x = 10;
      } else {
        this.ctx.shadowColor = 'red';
        x = 700;
      }
      this.ctx.strokeText(player.user.username, x, 40);
      this.ctx.strokeText(`Base lives: ${player.unit.side === SIDE.MAN ? manBaseBombs : alienBaseBombs}`, x, 80);
      this.ctx.strokeText(`${player.user.username}'s health: ${player.unit.getHealth()}`, x, 120);
      this.ctx.strokeText(`Coins: ${player.coins}`, x, 160);
    });

    this.clearStyle();
  }

  private renderBombs(state: GameState) {
    state.bombs.forEach((bomb, i) => {
      const text = `Bomb ${i + 1}: ${bomb.getTime()}`;
      const textWidth = this.ctx.measureText(text).width;
      this.ctx.strokeText(text, bomb.getCoords().x - (bomb.target.side === SIDE.MAN ? 0 : 1) * textWidth, 40);
      bomb.render(this.ctx);
    });
  }

  private renderCoins(state: GameState) {
    state.coins.forEach((coin) => {
      coin.render(this.ctx);
    });
  }

  private renderHealthOfTower(tower: Tower) {
    this.ctx.strokeStyle = 'red';
    this.ctx.lineWidth = 4;

    this.ctx.beginPath();
    this.ctx.moveTo(
      (tower.getCoords().x - tower.getWidth() / 2) * this.aspectRatio,
      (tower.getCoords().y - tower.getHeight() / 2) * this.aspectRatio
    );
    this.ctx.lineTo(
      (tower.getCoords().x - tower.getWidth() / 2 + tower.getWidth() * (tower.getHealth() / TOWER.HEALTH)) * this.aspectRatio,
      (tower.getCoords().y - tower.getHeight() / 2) * this.aspectRatio,
    );
    this.ctx.stroke();

    this.clearStyle();
  }
}

export default GameScene;
