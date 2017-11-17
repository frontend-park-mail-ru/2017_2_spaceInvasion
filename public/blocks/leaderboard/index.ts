import Block from '../block/index';
import Http from '../../modules/http';
import leaderboardTemplate from './leaderboard.pug';
import userService from "../../services/userService";
import { throwIfNull } from "../../utils/htmlUtils";

function fetchLeaderboard(el : HTMLElement) : void {
  Http.Fetch('GET', '/leaderboard')
    .then(data => throwIfNull(data).json())
    .then((res) => {
      el.classList.remove('ui', 'active', 'loader');
      el.innerHTML = leaderboardTemplate({ data: res, you: userService.user });
  }).catch(() => {
    el.classList.remove('ui', 'active', 'loader');
    el.innerHTML = leaderboardTemplate({ data: [], you: userService.user });
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
