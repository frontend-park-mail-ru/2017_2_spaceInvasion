import Block from '../block/index';
import Http from '../../modules/http';
import leaderboardTemplate from './leaderboard.pug';
import userService from '../../services/userService';
import {throwIfNull} from '../../utils/utils';
import {refreshTheme} from '../../modules/themes';
import Navigator from '../../modules/navigator';
import router from '../../modules/router';
import { debug } from 'util';

class LeaderboardBlock extends Block {
  show(): void {
    if (!Navigator.sections.leaderboard.ready) {
      this.fetchLeaderboard(this.el);
      Navigator.sections.leaderboard.ready = true;
    }
    router.setPath('/leaderboard');
    super.show();
  }

  private fetchLeaderboard(el: HTMLElement): void {
    debugger
    el.classList.add('ui', 'active', 'loader');
    Http.Fetch('GET', '/leaderboard')
      .then(data => throwIfNull(data).json())
      .then((res) => {
        debugger;
        el.classList.remove('ui', 'active', 'loader');
        debugger;
        el.innerHTML = leaderboardTemplate({data: res, you: userService.user});
        refreshTheme();
      }).catch(() => {
      el.classList.remove('ui', 'active', 'loader');
      el.innerHTML = leaderboardTemplate({data: [], you: userService.user});
      refreshTheme();
    });
  }
}

export default LeaderboardBlock;
