import Navigator from './navigator';
import userService from '../services/userService';
import {throwIfNull} from '../utils/utils';
import {refreshTheme} from './themes';
import {PATH_MAP} from '../utils/constants';
import NotFoundBlock from '../blocks/notFound/index';

class Router {
  protected path: string;
  protected tabs: Array<string> = [];

  route(path ?: string): void {
    refreshTheme();
    Navigator.sections.hide();

    path = path || window.location.pathname;
    this.setPath(path);

    const menu = throwIfNull(document.querySelector('div.ui.huge.menu'));
    const btnClass = (PATH_MAP.get(path) || '').toLowerCase();
    switch (btnClass) {
      case 'home':
      case 'leaderboard':
      case 'about':
      case 'signup':
        throwIfNull(menu.querySelector(`#${btnClass}Btn`)).setAttribute('class', 'active item');
        break;
      case 'game':
      case 'profile':
        break;
      default:
        break;
    }

    switch (PATH_MAP.get(path)) {
      case 'home':
        Navigator.sections.home.show();
        break;
      case 'login':
      case 'profile':
        if (userService.isLoggedIn()) {
          Navigator.sections.playerPage.show();
        } else {
          Navigator.sections.login.show();
        }
        break;
      case 'game':
        if (userService.isLoggedIn()) {
          Navigator.sections.game.show();
        } else {
          Navigator.sections.home.show();
        }
        break;
      case 'about':
        Navigator.sections.about.show();
        break;
      case 'signup':
        Navigator.sections.registration.show();
        break;
      case 'leaderboard':
        Navigator.sections.leaderboard.show();
        break;
      default:
        // 404
        (Navigator.sections.notFound as NotFoundBlock).show();
        break;
    }
  }

  setPath(newPath: string): void {
    this.path = newPath;
    if (this.tabs[0] !== newPath) this.tabs.unshift(newPath);
    window.history.pushState(null, '', newPath);
  }

  getPath(): string {
    return this.path;
  }

  start(): void {
    this.route();

    window.onpopstate = () => {
      let path = '';
      const historyTabs = router.tabs;
      const menu = throwIfNull(document.querySelector('div.ui.huge.menu'));
      const menutabs = [
        menu.querySelector('#homeBtn'),
        menu.querySelector('#aboutBtn'),
        menu.querySelector('#leaderboardBtn')
      ];
      menutabs.forEach((el: Element | null) => {
        throwIfNull(el).setAttribute('class', 'item');
      }, this);

      if (router.tabs.length > 0) {
        historyTabs.shift();
        [path] = historyTabs;
      } else {
        path = '/';
      }

      path = path || '/';
      this.route(path);
    };
  }
}

const router = new Router();
export {Router};
export default router;
