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
      this.fetchLeaderboard(this.el).then(this.initEventListeners.bind(this));
      Navigator.sections.leaderboard.ready = true;
    }
    router.setPath('/leaderboard');
    super.show();
  }

  private initEventListeners(): void {
    const paginator = document.querySelectorAll('.ui.pagination.menu .item');
    const right = paginator[paginator.length - 1];
    const left = paginator[0];

    if (left && right) {
      left.addEventListener('click', () => {
        if (this.page > 1) {
          this.page--;
          this.fetchLeaderboardByPage();
          right.classList.remove('disabled');
        } else {
          left.classList.add('disabled');
        }
      });

      right.addEventListener('click', () => {
        this.page++;
        left.classList.remove('disabled');
        this.fetchLeaderboardByPage();
      });
    }

    for(let i = 1; i < paginator.length - 1; i++) {
      paginator[i].addEventListener('click', this.paginate.bind(this, paginator[i] as HTMLElement));
    }
  }

  hide(): void {
    this.el.classList.remove('ui', 'active', 'loader');
    super.hide();
  }

  private paginate(elem: HTMLElement): void {
    const newPage = parseInt(elem.innerText, 10);
    if (this.page !== newPage) {
      this.page = newPage;
      this.fetchLeaderboardByPage();
    }
  }

  private fetchLeaderboardByPage(): Promise<any> {
    const offset = (this.page - 1) * ROWS_BY_PAGE;
    const paginator = document.querySelectorAll('.ui.pagination.menu .item');
    const right = paginator[paginator.length - 1];
    const left = paginator[0];

    return Http.Fetch('GET', `/leaderboard/page?limit=${ROWS_BY_PAGE}&offset=${offset}`)
      .then(data => throwIfNull(data).json())
      .then(data => {
        this.el.innerHTML = leaderboardTemplate({
          data: data || [],
          you: userService.user || 'Guest',
          page: this.page || 1
        });

        if (left && right ) {
          if (this.page > 1) {
            left.classList.remove('disabled');
          } else {
            left.classList.add('disabled');
          }
        }
        paginator.forEach(page => page.classList.remove('active', 'selected'));

        let selectedPage: Element|undefined;
        for (let i = 1; i < paginator.length - 1; i++) {
          if (parseInt((paginator[i] as HTMLElement).innerText, 10) === this.page) {
            selectedPage = paginator[i];
            break;
          }
        }

        if (selectedPage) {
          selectedPage.classList.add('active', 'selected');
        } else {
          const paginElem = throwIfNull(document.querySelector('.ui.pagination.menu')).children.item(this.page);
          const a = document.createElement('a');
          a.classList.add('item', 'active', 'selected');
          a.innerText = '' + this.page;
          throwIfNull(paginElem.parentNode).insertBefore(a, paginElem);
        }

        refreshTheme();
        this.initEventListeners();
      }).catch(() => right && right.classList.add('disabled'));
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
