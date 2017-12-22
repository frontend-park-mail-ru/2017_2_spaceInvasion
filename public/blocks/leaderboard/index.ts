import Block from '../block/index';
import Http from '../../modules/http';
import leaderboardTemplate from './leaderboard.pug';
import userService from '../../services/userService';
import {throwIfNull} from '../../utils/utils';
import {refreshTheme} from '../../modules/themes';
import Navigator from '../../modules/navigator';
import router from '../../modules/router';
import {ROWS_BY_PAGE} from '../../utils/constants';

class LeaderboardBlock extends Block {
  private page = 1;

  show(): void {
    if (!Navigator.sections.leaderboard.ready) {
      this.fetchLeaderboard(this.el).then(() => {
        const paginator: Element[] = Array.from(document.querySelectorAll('.ui.pagination.menu .item'));
        const right = paginator.pop();
        const left = paginator.shift();
        paginator.pop(); // ...

        if (left && right) {
          left.addEventListener('click', () => {
            if (this.page > 1) {
              this.page--;
              this.fetchLeaderboardByPage();
              right.classList.add('active', 'selected');
            } else {
              left.classList.remove('active', 'selected');
            }
          });

          right.addEventListener('click', () => {
            this.page++;
            left.classList.add('active', 'selected');
            this.fetchLeaderboardByPage().catch(() => right.classList.remove('active', 'selected'));
          });
        }
        paginator.forEach(page => page.addEventListener('click', () => this.paginate(page)));
      });
      Navigator.sections.leaderboard.ready = true;
    }
    router.setPath('/leaderboard');
    super.show();
  }

  hide(): void {
    this.el.classList.remove('ui', 'active', 'loader');
    super.hide();
  }

  public paginate(elem: Element): void {
    this.page = parseInt(elem.innerHTML, 10);
    this.fetchLeaderboardByPage();
  }

  private fetchLeaderboardByPage(): Promise<any> {
    const limit = this.page * ROWS_BY_PAGE;
    const offset = limit - ROWS_BY_PAGE;
    return Http.Fetch('GET', `/leaderboard/page?limit=${limit}&offset=${offset}`)
      .then(data =>
        this.el.innerHTML = leaderboardTemplate({data: data || [], you: userService.user || 'Guest', page: this.page || 1})
      );
  }

  private fetchLeaderboard(el: HTMLElement): Promise<any> {
    el.classList.add('ui', 'active', 'loader');
    return Http.Fetch('GET', '/leaderboard/top')
      .then(data => throwIfNull(data).json())
      .then(res => {
        el.classList.remove('ui', 'active', 'loader');
        el.innerHTML = leaderboardTemplate({data: res, you: userService.user, page: 1});
        refreshTheme();
      }).catch(() => {
      el.classList.remove('ui', 'active', 'loader');
      el.innerHTML = leaderboardTemplate({data: [], you: userService.user, page: 1});
      refreshTheme();
    });
  }
}

export default LeaderboardBlock;
