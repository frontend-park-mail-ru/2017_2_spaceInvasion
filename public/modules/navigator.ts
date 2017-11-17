import { closeDialog } from '../utils/aboutAlertDialog';
import { dismissAllMessages, showError, showLeaveGameNotification, throwIfNull } from "../utils/htmlUtils";
import Login from '../blocks/login/index';
import About from '../blocks/about/index';
import GameBlock from '../blocks/game/index';
import Game from './game';
import SinglePlayerStrategy from '../modules/game/gameStrateges/SinglePlayerStrategy';
import Leaderboard from '../blocks/leaderboard/index';
import Registration from '../blocks/registration/index';
import PlayerPage from '../blocks/playerPage/index';
import { alertDialog } from '../utils/aboutAlertDialog';
import Section from "../blocks/block/section";
import Block from "../blocks/block/index";
import gameService from '../services/gameService';
import userService from "../services/userService";
import router from "./router";

const sections = {
  login: new Section(Block.Create('section', ['login-section'])),
  signup: new Section(Block.Create('section', ['signup-section'])),
  about: new Section(Block.Create('section', ['about-section'])),
  leaderboard: new Section(Block.Create('section', ['leaderboard-section'])),
  playerpage: new Section(Block.Create('section', ['playerpage-section'])),
  game: new Section(Block.Create('section', ['game-section'])),

  hide() : void {
    this.login.hide();
    this.signup.hide();
    this.about.hide();
    this.leaderboard.hide();
    this.playerpage.hide();
    this.game.hide();

    if (gameService.isRunning()) {
      showLeaveGameNotification();
    }
  },
};

function setSelectionOrThrow(el : string) : void {
  throwIfNull(document.getElementById(el)).setAttribute('class', 'active item');
}

function clearSelectionOrThrow() : void {
  const tabs = ['homeBtn', 'aboutBtn', 'signUpBtn', 'leaderboardBtn'];
  tabs.forEach((el) => {
    throwIfNull(document.getElementById(el)).setAttribute('class', 'item');
  });
}

function navigate(this : HTMLElement) : void {
  const menu = throwIfNull(document.querySelector('div.ui.huge.menu'));

  if (!this.id) {
    return;
  }

  clearSelectionOrThrow();

  if (menu.getAttribute('data-tab') === 'about' && typeof menu.getAttribute('data-dev-dialog') !== 'undefined') {
    closeDialog();
  }

  setSelectionOrThrow(this.id);

  switch (this.id) {
    case 'homeBtn':
      menu.setAttribute('data-tab', 'home');
      showHome();
      break;
    case 'aboutBtn':
      menu.setAttribute('data-tab', 'about');
      showAbout();
      break;
    case 'signUpBtn':
      menu.setAttribute('data-tab', 'signUp');
      clearSelectionOrThrow();
      showRegistration();
      break;
    case 'leaderboardBtn':
      menu.setAttribute('data-tab', 'leaderboard');
      showLeaderboard();
      break;
    default:
      break;
  }
}

function hideSignUp() : void {
  throwIfNull(document.getElementById('signUpBtn')).setAttribute('style', 'display:none');
}

function showPlayerPage() : void {
  dismissAllMessages();
  throwIfNull(document.getElementById('signUpBtn')).setAttribute('style', 'display:none');
  sections.hide();
  if (!sections.playerpage.ready) {
    sections.playerpage.append(new PlayerPage());
    sections.playerpage.ready = true;
  } else {
    sections.playerpage.el.removeChild(throwIfNull(sections.playerpage.el.firstChild));
    sections.playerpage.append(new PlayerPage());
  }
  router.setPath('/profile');
  sections.playerpage.show();
}

// Отправка формы логина.
function onSubmitLoginForm(formdata : any) : void {
  const loginBtn = throwIfNull(document.querySelector('.ui.submit.button'));
  loginBtn.classList.add('loading');
  userService.login(formdata.login, formdata.password)
    .then((data : any) => {
      switch (data.status) {
        case 400:
          if (data.result && data.result === 'Bad request') {
            showError(data.description);
          } else {
            showError('Already authorized as ' + data.username || 'Guest')
          }
          break;
        case 200:
          (sections.login as any).loginform.reset();
          hideSignUp();
          showPlayerPage();
          break;
        default:
          showError('Internal Error');
          break;
        }
      loginBtn.classList.remove('loading');
    }).catch(() => loginBtn.classList.remove('loading'));
}

// Отправка формы регистрации.
function onSubmitRegistrationForm(formdata : any) : void {
  const regBtn = throwIfNull(document.querySelector('.validateBtn'));
  regBtn.classList.add('loading');
  userService.register(formdata.email, formdata.login, formdata.password)
    .then((data : any) => {
      switch (data.status) {
        case 400:
          if (data.result === 'Username already used') {
            showError('Username already used');
          } else {
            showError(data.description);
          }
          break;
        case 200:
          (sections.signup as any).signupform.reset();
          hideSignUp();
          showPlayerPage();
          break;
        default:
          showError('Internal Error');
          break;
      }
      regBtn.classList.remove('loading');
    }).catch(() => regBtn.classList.remove('loading'));
}

function openLogin() : void {
  sections.hide();
  if (!userService.isLoggedIn()) {
    throwIfNull(document.getElementById('signUpBtn')).setAttribute('style', '');
    if (!sections.login.ready) {
      (sections.login as any).loginform = new Login();
      sections.login.append((sections.login as any).loginform);
      (sections.login as any).loginform.onSubmit(onSubmitLoginForm);
      sections.login.ready = true;
    }
    (sections.login as any).loginform.reset();
    router.setPath('/login');
    sections.login.show();
  } else if (sections.playerpage.isHidden()) {
    showPlayerPage();
  }
}
const showHome = openLogin; // TODO: Сверстать homepage

function showRegistration() : void {
  dismissAllMessages();
  sections.hide();
  if (!sections.signup.ready) {
    (sections.signup as any).signupform = new Registration();
    sections.signup.append((sections.signup as any).signupform);
    (sections.signup as any).signupform.onSubmit(onSubmitRegistrationForm);
    sections.signup.ready = true;
  }
  (sections.signup as any).signupform.reset();
  router.setPath('/signup');
  sections.signup.show();
}

function showLeaderboard() : void {
  dismissAllMessages();
  sections.hide();
  if (!sections.leaderboard.ready) {
    sections.leaderboard.append(new Leaderboard());
    sections.leaderboard.ready = true;
  }
  router.setPath('/leaderboard');
  sections.leaderboard.show();
}

function showAbout() : void {
  dismissAllMessages();
  sections.hide();
  if (!sections.about.ready) {
    sections.about.append(new About());
    sections.about.ready = true;
    alertDialog();
  }
  router.setPath('/about');
  sections.about.show();
}

function showGame() : void {
  sections.hide();
  dismissAllMessages();
  if (!sections.game.ready) {
    sections.game.append(new GameBlock());
    sections.about.ready = true;
    if (!gameService.isRunning()) {
      new Game(SinglePlayerStrategy, 'username', document.querySelector('canvas#game'));
    }
  }
  router.setPath('/game');
  sections.game.show();
}

function init() {
  const menuItems = throwIfNull(document.querySelectorAll('.item'));
  for (let i = 0; i < menuItems.length; i += 1) {
    menuItems[i].addEventListener('click', navigate.bind(menuItems[i]));
  }
}

export { sections, showHome, showGame, showAbout, showLeaderboard, showPlayerPage, showRegistration, init as initNavigator };