(function main() {
  const {
    UserService, Block, Login, About, Scoreboard, Registration,
  } = window;
  const userService = new UserService();

  const app = new Block(document.getElementById('application'));
  const curUser = document.querySelector('#signUpBtn.ui.primary.button');

  const sections = {

    login: Block.Create('section', {}, ['login-section']),
    signup: Block.Create('section', {}, ['signup-section']),
    about: Block.Create('section', {}, ['about-section']),
    scoreboard: Block.Create('section', {}, ['scoreboard-section']),

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
        .scoreboard
        .hide();
    },
  };

  sections.hide();

  app
    .append(sections.login)
    .append(sections.signup)
    .append(sections.about)
    .append(sections.scoreboard);

  // Отправка формы логина.
  function onSubmitLoginForm(formdata) {
    return UserService.login(UserService.login, formdata.password)
      .then(() => userService.getData(true))
      .then(() => {
        sections.login.loginform.reset();
        curUser.innerText = userService.user.username;
        // openGamePage();
      })
      .catch((err) => { alert(curUser.innerText = `err: ${err.status}; ${err.message}`); });
  }

  // Отправка формы регистрации.
  function onSubmitRegistrationForm(formdata) {
    return UserService.register(formdata.email, UserService.login, formdata.password)
      .then(() => userService.getData(true))
      .then(() => {
        sections.signup.signupform.reset();
        curUser.innerText = userService.user.username;

        // openGamePage();
      })
      .catch((err) => { curUser.innerText = `err: ${err.status}; ${err.message}`; });
  }
  function openLogin() {
    sections.hide();
    if (!sections.login.ready) {
      sections.login.loginform = new Login();
      sections.login.append(sections.login.loginform);
      sections.login.loginform.onSubmit(onSubmitLoginForm);
      sections.login.ready = true;
    }
    sections.login.loginform.reset();
    sections.login.show();
  }

  function openRegistration() {
    sections.hide();
    if (!sections.signup.ready) {
      sections.signup.signupform = new Registration();
      sections.signup.append(sections.signup.signupform);
      sections.signup.signupform.onSubmit(onSubmitRegistrationForm);
      sections.signup.ready = true;
    }
    sections.signup.signupform.reset();
    sections.signup.show();
  }


  function openScoreboard() {
    sections.hide();
    if (!sections.scoreboard.ready) {
      sections
        .scoreboard
        .append(new Scoreboard());
      sections.scoreboard.ready = true;
    }
    sections
      .scoreboard
      .show();
  }

  function openAbout() {
    sections.hide();
    if (!sections.about.ready) {
      sections.about.append(new About());
      sections.about.ready = true;
    }
    sections.about.show();
  }

  window.showHome = openLogin;
  window.showAbout = openAbout;
  window.showRegistration = openRegistration;
  window.showScoreboard = openScoreboard;

  openLogin();

  if (userService.isLoggedIn()) {
    curUser.innerText = userService.user.username;
  } else {
    curUser.innerText = 'Sign up';
  }
}());
