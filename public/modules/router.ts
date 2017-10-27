import { showPlayerPage, showHome, showRegistration, showAbout, showLeaderboard, showGame } from '../main';

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
    switch (this.path) {
      case '/':
        showHome();
        break;
      case '/login':
        showHome();
        break;
      case '/about':
        showAbout();
        break;
      case '/signup':
        showRegistration();
        break;
      case '/profile':
        showPlayerPage();
        break;
      case '/leaderboard':
        showLeaderboard();
        break;
      default:
        showHome();
    }

    window.onpopstate = () => {
      let path = '';
      const historyTabs = router.tabs;
      const menu = document.querySelector('div.ui.huge.menu');
      const menutabs = [menu.children['homeBtn'], menu.children['aboutBtn'],
        menu.children['leaderboardBtn'],
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
      switch(path) {
        case '/':
          showHome();
          menu.children['homeBtn'].setAttribute('class', 'active item');
          break;
        case '/profile':
          showPlayerPage();
          menu.children['homeBtn'].setAttribute('class', 'active item');
          break;
        case '/login':
          showHome();
          menu.children['homeBtn'].setAttribute('class', 'active item');
          break;
        case '/signup':
          showRegistration();
          break;
        case '/about':
          showAbout();
          menu.children['aboutBtn'].setAttribute('class', 'active item');
          break;
        case '/leaderboard':
          showLeaderboard();
          menu.children['leaderboardBtn'].setAttribute('class', 'active item');
          break;
        case '/game':
          showGame();
          menu.children['gameBtn'].setAttribute('class', 'active item');
      }
    };
  }
}

const router = new Router();

export default router;
