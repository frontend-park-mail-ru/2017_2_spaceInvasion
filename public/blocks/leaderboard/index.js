import Block from '../block/index';
import Http from '../../modules/httpModule';
import leaderboardTemplate from './leaderboard.pug';
import { changeThemeForAlien, changeThemeForMan, getThemeTag } from '../../utils/initRaceDialog';

function fetchLeaderboard(el) {
  Http.Fetch('GET', '/leaderboard').then(res => res.json())
    .then((res) => {
      el.classList.remove('ui', 'active', 'loader');
      el.innerHTML = leaderboardTemplate({ data: res });
      switch (getThemeTag()) {
        case 'Alien':
          changeThemeForAlien();
          break;
        case 'Man':
          changeThemeForMan();
          break;
        default:
          window.console.log('error');
          break;
      }
    });
}

class Leaderboard extends Block {
  constructor() {
    const el = document.createElement('div');
    el.classList.add('ui', 'active', 'loader');
    fetchLeaderboard(el);
    super(el);
  }
}

export default Leaderboard;
