import userService from './services/userService';
import Block from './blocks/block/index';
import Login from './blocks/login/index';
import About from './blocks/about/index';
import Leaderboard from './blocks/leaderboard/index';
import Registration from './blocks/registration/index';
import PlayerPage from './blocks/playerPage/index';
import { alertDialog } from './utils/aboutAlertDialog';
import router from './modules/router';

const app = new Block(document.getElementById('application'));
const signUpBtn = document.querySelector('.item#signUpBtn');
const PNotify = require('./pnotify.custom.min.js');

window.router = router;

const sections = {
  login: Block.Create('section', {}, ['login-section']),
  signup: Block.Create('section', {}, ['signup-section']),
  about: Block.Create('section', {}, ['about-section']),
  leaderboard: Block.Create('section', {}, ['leaderboard-section']),
  playerpage: Block.Create('section', {}, ['playerpage-section']),

  hide() {
    this
      .login
      .hide();
    this
      .signup
      .hide();
    this
      .about
      .hide();
    this
      .leaderboard
      .hide();
    this
      .playerpage
      .hide();
  },
};

sections.hide();

app
  .append(sections.login)
  .append(sections.signup)
  .append(sections.about)
  .append(sections.leaderboard)
  .append(sections.playerpage);

function dismissAllMessages() {
  PNotify.removeAll();
}

router.start();

function showError(message) {
  return new PNotify({
    title: 'Error',
    text: message,
    type: 'error',
  });
}

function hideSignUp() {
  signUpBtn.setAttribute('style', 'display:none');
}

function openPlayerPage() {
  dismissAllMessages();
  signUpBtn.setAttribute('style', 'display:none');
  sections.hide();
  if (!sections.playerpage.ready) {
    sections.playerpage.append(new PlayerPage());
    sections.playerpage.ready = true;
  } else {
    sections.playerpage.el.removeChild(sections.playerpage.el.firstChild);
    sections.playerpage.append(new PlayerPage());
  }
  router.setPath('/profile');
  sections.playerpage.show();
}

// Отправка формы логина.
function onSubmitLoginForm(formdata) {
  const loginBtn = document.querySelector('.ui.submit.button');
  loginBtn.classList.add('loading');
  userService.login(formdata.login, formdata.password).then(data => data.json())
    .then((data) => {
      if (data.result !== 'Singning in failed') {
        userService.user = data;
        loginBtn.classList.remove('loading');
        sections.login.loginform.reset();
        hideSignUp();
        openPlayerPage();
      } else {
        loginBtn.classList.remove('loading');
        showError(data.result);
      }
    });
}

// Отправка формы регистрации.
function onSubmitRegistrationForm(formdata) {
  const regBtn = document.querySelector('.validateBtn');
  regBtn.classList.add('loading');
  userService.register(formdata.email, formdata.login, formdata.password).then(data => data.json())
    .then((data) => {
      if (data.result !== 'Username already used') {
        userService.user = data;
        regBtn.classList.remove('loading');
        sections.signup.signupform.reset();
        hideSignUp();
        openPlayerPage();
      } else {
        regBtn.classList.remove('loading');
        showError(data.result);
      }
    });
}

function openLogin() {
  if (!userService.isLoggedIn()) {
    signUpBtn.setAttribute('style', '');
    sections.hide();
    if (!sections.login.ready) {
      sections.login.loginform = new Login();
      sections.login.append(sections.login.loginform);
      sections.login.loginform.onSubmit(onSubmitLoginForm);
      sections.login.ready = true;
    }
    sections.login.loginform.reset();
    router.setPath('/');
    sections.login.show();
  } else if (sections.playerpage.isHidden()) {
    router.setPath('/profile');
    openPlayerPage();
  }
}

function openRegistration() {
  dismissAllMessages();
  sections.hide();
  if (!sections.signup.ready) {
    sections.signup.signupform = new Registration();
    sections.signup.append(sections.signup.signupform);
    sections.signup.signupform.onSubmit(onSubmitRegistrationForm);
    sections.signup.ready = true;
  }
  sections.signup.signupform.reset();
  router.setPath('/signup');
  sections.signup.show();
}

function openLeaderboard() {
  dismissAllMessages();
  sections.hide();
  if (!sections.leaderboard.ready) {
    sections
      .leaderboard
      .append(new Leaderboard());
    sections.leaderboard.ready = true;
  }
  router.setPath('/leaderboard');
  sections
    .leaderboard
    .show();
}

function openAbout() {
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

userService.getData();
export {
  openLogin as showHome,
  openAbout as showAbout,
  openRegistration as showRegistration,
  openLeaderboard as showLeaderboard,
  openPlayerPage as showPlayerPage,
  showError,
};
