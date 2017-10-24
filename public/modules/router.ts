import { showPlayerPage, showHome, showRegistration, showAbout, showLeaderboard } from '../main';

class Router {
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
      const historyTabs = window.router.tabs;
      const menu = document.querySelector('div.ui.huge.menu');
      const menutabs = [menu.children.homeBtn, menu.children.aboutBtn,
        menu.children.leaderboardBtn,
      ];
      menutabs.forEach((el) => {
        el.setAttribute('class', 'item');
      }, this);
      if (window.router.tabs.length > 0) {
        historyTabs.shift();
        [path] = historyTabs;
      } else {
        path = '/';
      }

      if (path === '/' || path === undefined) {
        showHome();
        menu.children.homeBtn.setAttribute('class', 'active item');
        return;
      }
      if (path === '/profile') {
        showPlayerPage();
        menu.children.homeBtn.setAttribute('class', 'active item');
        return;
      }
      if (path === '/login') {
        showHome();
        menu.children.homeBtn.setAttribute('class', 'active item');
        return;
      }
      if (path === '/signup') { showRegistration(); return; }
      if (path === '/about') {
        showAbout();
        menu.children.aboutBtn.setAttribute('class', 'active item');
        return;
      }
      if (path === '/leaderboard') {
        showLeaderboard();
        menu.children.leaderboardBtn.setAttribute('class', 'active item');
      }
    };
  }
}

const router = new Router();

export default router;
