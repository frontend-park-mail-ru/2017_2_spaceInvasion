import { showPlayerPage, showHome, showRegistration, showAbout, showLeaderboard, showGame } from '../main';
import userService from "../services/userService";

class Router {
  private path: string;
  private tabs: Array<string>;

  constructor() {
    this.path = '';
    this.tabs = [];
  }

  setPath(newPath) {
    this.path = newPath;
    if (this.tabs[0] !== newPath) this.tabs.unshift(newPath);
    window.history.pushState(null, null, newPath);
  }

  getPath() {
    return this.path;
  }

  checkIfGameCanStart() {
    if (userService.isLoggedIn()) {
      showGame()
    } else {
      showHome()
    }
  }

  route(path) {
    const btnMap = new Map([
      ['/', 'homeBtn'],
      ['/login', 'homeBtn'],
      ['/about', 'aboutBtn'],
      ['/profile', 'homeBtn'],
      ['/leaderboard', 'leaderboardBtn'],
    ]);
	const pathMap = new Map([
      ['/', showHome],
      ['/login', showHome],
      ['/about', showAbout],
      ['/signup', showRegistration],
      ['/profile', showPlayerPage],
      ['/leaderboard', showLeaderboard],
      ['/game', this.checkIfGameCanStart],
    ]);

    const menu = document.querySelector('div.ui.huge.menu');
    const btnClass = btnMap.get(path);
    if (btnClass) {
      menu.children[btnClass].setAttribute('class', 'active item');
    }
    pathMap.get(path)()
  }

  start() {
    const menuItems = document.querySelectorAll(".ui.dropdown .menu div.item");
    const themeID = sessionStorage.getItem("theme");
    if(themeID != null){
      if (themeID.includes("man")){
        menuItems[1].classList.remove('active','selected');
        menuItems[0].classList.add('active','selected');
      }else{
        menuItems[0].classList.remove('active','selected');
        menuItems[1].classList.add('active','selected');
      }
    }

    this.path = window.location.pathname;
    this.route(this.path);

    window.onpopstate = () => {
      let path = '';
      const historyTabs = router.tabs;
      const menu = document.querySelector('div.ui.huge.menu');
      const menutabs = [
        menu.children['homeBtn'],
        menu.children['aboutBtn'],
        menu.children['leaderboardBtn']
      ];
      menutabs.forEach((el) => {
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
