import { showPlayerPage, showHome, showRegistration, showAbout, showLeaderboard, showGame } from './navigator';
import userService from "../services/userService";
import { throwIfNull } from "../utils/htmlUtils";
import { changeThemeForAlien, changeThemeForMan, refreshTheme } from "./themes";

class Router {
  private path: string;
  private tabs: Array<string> = [];

  setPath(newPath : string) {
    this.path = newPath;
    if (this.tabs[0] !== newPath) this.tabs.unshift(newPath);
    window.history.pushState(null, '', newPath);
  }

  getPath() : string {
    return this.path;
  }

  route(path : string) : void {
    refreshTheme();

    const checkIfGameCanStart = () => {
      if (userService.isLoggedIn()) {
        showGame()
      } else {
        showHome()
      }
    };

    const btnMap = new Map<string, string>();
    [
      ['/', 'homeBtn'],
      ['/login', 'homeBtn'],
      ['/about', 'aboutBtn'],
      ['/profile', 'homeBtn'],
      ['/leaderboard', 'leaderboardBtn'],
    ].forEach(route => btnMap.set(route[0], route[1]));

	  const pathMap = new Map<string, () => void>();
	  [
      ['/', showHome],
      ['/login', showHome],
      ['/about', showAbout],
      ['/signup', showRegistration],
      ['/profile', showPlayerPage],
      ['/leaderboard', showLeaderboard],
      ['/game', checkIfGameCanStart],
    ].forEach(route => pathMap.set(route[0] as string, route[1] as () => void));

    const menu = throwIfNull(document.querySelector('div.ui.huge.menu'));
    const btnClass = btnMap.get(path);
    if (btnClass) {
      throwIfNull(menu.children.namedItem(btnClass)).setAttribute('class', 'active item');
    }

    const callback = pathMap.get(path);
    if (callback) {
      callback();
    } else {
      // 404
      showHome();
    }
  }

  start() : void {
    const themeID = sessionStorage.getItem("theme") || 'man';

    switch (themeID) {
      case 'alien':
        changeThemeForAlien();
        break;
      default: // man
        changeThemeForMan();
        break;
    }

    this.path = window.location.pathname;
    this.route(this.path);

    window.onpopstate = () => {
      let path = '';
      const historyTabs = router.tabs;
      const menu = throwIfNull(document.querySelector('div.ui.huge.menu'));
      const menutabs = [
        menu.querySelector('homeBtn'),
        menu.querySelector('aboutBtn'),
        menu.querySelector('leaderboardBtn')
      ];
      menutabs.forEach((el : Element) => {
        el.setAttribute('class', 'item');
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
export default router;
