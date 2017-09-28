(function loginIndex() {
  const { Form } = window;
  const LoginTemplate = window.loginTemplate;

  class Login extends Form {
    constructor() {
      const el = document.createElement('div');
      el.innerHTML = LoginTemplate();
      super(el);
    }
  }

  window.Login = Login;
}());
