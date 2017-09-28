(function loginIndex() {
  const { Block } = window;
  const LoginTemplate = window.loginTemplate;

  class Login extends Block {
    constructor() {
      const el = document.createElement('div');
      el.innerHTML = LoginTemplate();
      super(el);
    }
  }

  window.Login = Login;
}());
