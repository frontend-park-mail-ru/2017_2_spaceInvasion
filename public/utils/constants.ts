const baseUrl = 'http://138.68.86.49/';

// Directions
const LEFT = 'LEFT';
const RIGHT = 'RIGHT';
const UP = 'UP';
const DOWN = 'DOWN';

// Game constants
// Tower
const TOWER_IMAGE_PATH = '../../../images/game/tower.png';
const TOWER_WIDTH = 50;
const TOWER_HEIGHT = 100;
const TOWER_DAMAGE = 10;
const TOWER_HEALTH = 100;

// Unit
const UNIT_IMAGE_PATH = '../../../images/game/alienUnit.png';
const UNIT_WIDTH = 50;
const UNIT_HEIGHT = 50;
const UNIT_DAMAGE = 10;

const modelWidth = 960;
const modelHeight = 640;

const SPEED = 5;

// Coins
const COIN_IMAGE_PATH = '../../../images/game/coin.png';
const COIN_WIDTH = 30;
const COIN_HEIGHT = 30;
const COIN_COST = 10;

// Bullets
const BULLET_IMAGE_PATH = '../../../images/game/bullet.png';
const BULLET_WIDTH = 25;
const BULLET_HEIGHT = 25;
const BULLET_DAMAGE = 10;

// Bombs
const BOMB_IMAGE_PATH = '../../../images/game/bomb.png';
const BOMB_WIDTH = 30;
const BOMB_HEIGHT = 30;

// Bases
const BASE_IMAGE_PATH = '../../../images/game/base.png';
const BASE_WIDTH = 110;
const BASE_HEIGHT = 110;

// Colors
const RED = '#F00';
const BLUE = '#000dd4';
const BLACK = 'black';

// Fonts
const DEFAULT_FONT = 'italic 20pt Arial';

export { baseUrl,
  TOWER_DAMAGE, TOWER_HEALTH, TOWER_HEIGHT, TOWER_IMAGE_PATH, TOWER_WIDTH, // Tower
  UNIT_DAMAGE, UNIT_HEIGHT, UNIT_IMAGE_PATH, UNIT_WIDTH, modelHeight, modelWidth, SPEED, // Unit
  LEFT, RIGHT, UP, DOWN, // Directions
  COIN_COST, COIN_HEIGHT, COIN_IMAGE_PATH, COIN_WIDTH, // Coins
  BULLET_DAMAGE, BULLET_HEIGHT, BULLET_IMAGE_PATH, BULLET_WIDTH, // Bullets
  BOMB_HEIGHT, BOMB_IMAGE_PATH, BOMB_WIDTH, // Bombs
  BASE_HEIGHT, BASE_IMAGE_PATH, BASE_WIDTH, // Bases
  RED, BLACK, BLUE, DEFAULT_FONT // Styles
};