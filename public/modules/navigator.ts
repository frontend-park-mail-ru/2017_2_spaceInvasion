import {dismissAllMessages, showLeaveGameNotification} from '../utils/notifications';
import {throwIfNull} from '../utils/utils';
import LoginBlock from '../blocks/login/index';
import AboutBlock from '../blocks/about/index';
import LeaderboardBlock from '../blocks/leaderboard/index';
import RegistrationBlock from '../blocks/registration/index';
import PlayerPageBlock from '../blocks/playerPage/index';
import gameService from '../services/gameService';
import Block from '../blocks/block/index';
import NotFoundBlock from '../blocks/notFound/index';
import WinLoseBlock from '../blocks/winlose/index';
import GameBlock from '../blocks/game/index';
import HomePageBlock from '../blocks/home/index';
import userService from '../services/userService';

class Sections {
  public home: HomePageBlock;
  public about: AboutBlock;
  public game: Block;
  public leaderboard: LeaderboardBlock;
  public login: LoginBlock;
  public registration: RegistrationBlock;
  public playerPage: PlayerPageBlock;
  public notFound: NotFoundBlock;
  public winlose: WinLoseBlock;

  constructor() {
    this.home = Block.Create('section', ['home-section'], HomePageBlock);
    this.about = Block.Create('section', ['about-section'], AboutBlock);
    this.game = Block.Create('section', ['game-section'], Block) as GameBlock;
    this.leaderboard = Block.Create('section', ['leaderboard-section'], LeaderboardBlock);
    this.login = Block.Create('section', ['login-section'], LoginBlock);
    this.registration = Block.Create('section', ['registration-section'], RegistrationBlock);
    this.playerPage = Block.Create('section', ['playerpage-section'], PlayerPageBlock);
    this.notFound = Block.Create('section', ['404-section'], NotFoundBlock);
    this.winlose = Block.Create('section', ['winlose-section'], WinLoseBlock);
  }

  hide(): void {
    this.about.hide();
    this.game.hide();
    this.leaderboard.hide();
    this.login.hide();
    this.registration.hide();
    this.playerPage.hide();
    this.winlose.hide();
    this.home.hide();
    this.notFound.hide();

    if (gameService.isRunning()) {
      showLeaveGameNotification();
    }
  }
}

class Navigator {
  static sections: Sections;

  constructor() {
    Navigator.sections = new Sections();

    const menuItems = throwIfNull(document.querySelectorAll('.item'));
    for (let i = 0; i < menuItems.length; i += 1) {
      menuItems[i].addEventListener('click', Navigator.navigate.bind(menuItems[i]));
    }
  }

  static navigate(this: HTMLElement): void {
    const menu = throwIfNull(document.querySelector('div.ui.huge.menu'));

    if (!this.id) {
      return;
    }

    Navigator.clearSelectionOrThrow();

    if (this.id !== 'signupBtn' && this.id !== 'loginBtn') {
      Navigator.setSelectionOrThrow(this.id);
    }

    dismissAllMessages();
    Navigator.sections.hide();

    switch (this.id) {
      case 'homeBtn':
        menu.setAttribute('data-tab', 'home');
        if (userService.isLoggedIn()) {
          Navigator.sections.playerPage.show();
        } else {
          Navigator.sections.home.show();
        }
        break;
      case 'aboutBtn':
        menu.setAttribute('data-tab', 'about');
        Navigator.sections.about.show();
        break;
      case 'loginBtn':
        menu.setAttribute('data-tab', 'login');
        Navigator.sections.login.show();
        break;
      case 'signupBtn':
        menu.setAttribute('data-tab', 'signup');
        Navigator.sections.registration.show();
        break;
      case 'leaderboardBtn':
        menu.setAttribute('data-tab', 'leaderboard');
        Navigator.sections.leaderboard.show();
        break;
      default:
        throw Error('Wrong section');
    }
  }

  private static setSelectionOrThrow(el: string): void {
    throwIfNull(document.getElementById(el)).setAttribute('class', 'active item');
  }

  private static clearSelectionOrThrow(): void {
    const tabs = ['homeBtn', 'aboutBtn', 'signupBtn', 'leaderboardBtn'];
    tabs.forEach((el) => {
      throwIfNull(document.getElementById(el)).setAttribute('class', 'item');
    });
  }
}

export default Navigator;
export {Sections};
